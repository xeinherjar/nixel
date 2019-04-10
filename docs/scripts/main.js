;(function() {
  'use strict';

  angular.module('nixel', ['ui.router'])

  .config(function($stateProvider) {

    $stateProvider
      .state('editor', {
        url: '',
        views: {
          'main': {
            templateUrl: 'templates/main.template.html',
            controller : 'mainController',
          },
          'file': {
            templateUrl: 'templates/file.template.html',
            controller : 'fileController',
          },
          'edit': {
            templateUrl: 'templates/edit.template.html',
            controller: 'editController',
          },
          'tools': {
            templateUrl: 'templates/tools.template.html',
            controller: 'toolController',
          },
          'chr' : {
            templateUrl: 'templates/chr.template.html',
            controller: 'chrController',
          },
        },
      });


  });


}());

;(function() {
  'use strict';

  angular.module('nixel')

  .directive('nixelSprite', ['chrFactory',
    function(chrFactory) {

    return {
      restrict: 'A',
      scope: {
        spriteIndex: '=',
        scale: '=',
        editable: '@?',
      },

      link: function(scope, el, attr) {

        var e    = el[0];
        var ctx  = e.getContext('2d');
        var size = attr.scale * 8;
        var tbl;
        var pallete = chrFactory.pallete;
        var activePallete = [48, 16, 0, 63];

        scope.$watch('spriteIndex', function(e) {
          if (!tbl) { return; }
          render(tbl);
        });

        el.attr('width',  size);
        el.attr('height', size);

        scope.$on('chr:chrTable', function(e, chrTable) {
          scope.editable = (scope.editable === 'true') ? true : false;
          tbl = chrTable;
          render(tbl);
        });

        scope.$on('chr:chrTable:update', function(e, chrTable, idx) {
          if (!tbl) { return; }

          // Only draw modified
          var id = scope.spriteIndex;
          if (id != idx) { return; }

          tbl = chrTable;
          render(tbl);
        });

        // From tool.controller
        scope.$on('pallete:select:value', function(e, idx, val) {
          if (!tbl) { return; }
          activePallete[idx] = val;
          render(tbl);
        });


        var render = function(chrTable) {

          var n   = scope.scale;
          var ctx = el[0].getContext('2d');
          var idx = scope.spriteIndex;

          for (var i = 0; i < 8; i++) {
            for (var j = 0; j < 8; j++) {
              var x = j,
                  y = i,
                  s = chrTable[idx][i][j];
              switch(s) {
                case 0:
                  // ctx.fillStyle = "rgb(255, 255, 255)";
                  ctx.fillStyle = pallete[activePallete[0]];
                  break;
                case 1:
                  // ctx.fillStyle = "rgb(170, 170, 170)";
                  ctx.fillStyle = pallete[activePallete[1]];
                  break;
                case 2:
                  // ctx.fillStyle = "rgb(85, 85, 85)";
                  ctx.fillStyle = pallete[activePallete[2]];
                  break;
                case 3:
                  // ctx.fillStyle = "rgb(0, 0, 0)";
                  ctx.fillStyle = pallete[activePallete[3]];
                  break;
              }

            ctx.fillRect(x * n, y * n, n, n);

            } // j
          } // i

        };






      }
    };

  }]);

}());

;(function() {
  'use strict';

  angular.module('nixel')

  .directive('nixelDrag',
    function() {

    return {
      restrict: 'A',

    link: function(scope, el, attr) {
      el.attr('draggable', 'true');
      var idx = scope.$index;

      el.bind('dragstart', function(e) {
        e.dataTransfer.setData('text', idx);
      });
    }


    };
    })

  .directive('nixelDrop',
      ['$rootScope',
    function($rootScope) {

    return {

      restrict: 'A',

    link: function(scope, el, attr) {
      el.bind('dragover', function(e) {
        // Allows us to drop
        if (e.preventDefault) {
          e.preventDefault();
        }

        e.dataTransfer.dropEffect = 'move';

        return false;
      });


      // Cosmetic
      el.bind('dragenter', function(e) {
        angular.element(e.target).addClass('drop-target');
      });

      el.bind('dragleave', function(e) {
        angular.element(e.target).removeClass('drop-target');
      });

      el.bind('drop', function(e) {
        if (e.preventDefault) {
          e.preventDefault();
        }
        if (e.stopPropogation) {
          e.stopPropogation();
        }

        angular.element(e.target).removeClass('drop-target');

        var idx = e.dataTransfer.getData('text');
        $rootScope.$broadcast('sprite:drop', idx, e.target.id);
      });


    },


    };
    }
  ]);

}());

;(function() {

  'use strict';

  angular.module('nixel')

  .controller('chrController',
           ['$scope', 'chrFactory', 'romFactory', '$rootScope',
    function($scope,   chrFactory,   romFactory,   $rootScope) {

    $scope.chrAvailable = true;

    // from file.controller
    $scope.$on('file:load', function(e) {
      if (romFactory.ROM.chrData.length > 0) {
        chrFactory.setup(romFactory.ROM.chrData);
      } else {
        chrFactory.setup(romFactory.ROM.prgData);
        $scope.chrAvailable = false;
        $scope.$digest();
      }

    });

    // from chr.factory
    $scope.$on('chr:chrTable', function(e, chrTable) {
      $scope.spriteTable = chrTable;
      // Needed to fire ng-repeat after ROM load
      $scope.$digest();
    });


    $scope.makeHex = function(n) {
      var h = n.toString(16).toUpperCase();
      var l = "0000".substring(h.length);

      return "0x" + l + h;
    };



    }
  ]);


}());

;(function() {

  'use strict';

  angular.module('nixel')

  .controller('fileController',
           ['$scope', 'romFactory','$rootScope', 'chrFactory',
    function($scope,   romFactory,  $rootScope,   chrFactory) {


      $scope.downloadCHR = function() {
        var blob = new Blob([romFactory.ROM.chrData],
            { type: 'octet/stream' });
        var url = window.URL.createObjectURL(blob);
        //window.location.assign(url);

        var a = document.createElement('a');
        document.body.appendChild(a);
        //a.style = 'display: none';
        a.setAttribute('style', 'display: none');
        a.href = url;
        a.download = 'patched.chr';
        a.click();
        window.URL.revokeObjectURL(url);
      };


      var chrTableToPatch;
      $scope.$on('chr:chrTable:update', function(e, chrTable) {
        chrTableToPatch = chrTable;
      });

      $scope.patchROM = function() {
        var chrTable = patchChr();

        var romBuffer = new ArrayBuffer(romFactory.ROM.raw.length);
        var rom       = new Uint8Array(romBuffer);

        // Header is 16 bytes
        for (var i = 0; i < 16; i++) {
          rom[i] = romFactory.ROM.raw[i];
        }

        // chr or prg edited?
        var chrPresent = romFactory.ROM.header.chrPageCount;

        // If CHR data
        //  Prg Data

        var offset = 16;
        if (chrPresent) {
          for (var i = 0; i < romFactory.ROM.header.prgDataSize; i++) {
            rom[offset + i] = romFactory.ROM.prgData[i];
          }

          // Chr Data
          offset += romFactory.ROM.header.prgDataSize;
          for (var i = 0; i < romFactory.ROM.header.chrDataSize; i++) {
            rom[offset + i] = chrTable[i];
          }

        // If CHR doesn't exist, then patch PRG only
        } else {
          // Prg Data
          for (var i = 0; i < romFactory.ROM.header.prgDataSize; i++) {
            rom[offset + i] = chrTable[i];
          }

        }



        var blob = new Blob([rom],
            { type: 'octet/stream' });
        var url = window.URL.createObjectURL(blob);
        //window.location.assign(url);

        var a = document.createElement('a');
        document.body.appendChild(a);
        //a.style = 'display: none';
        a.setAttribute('style', 'display: none');
        a.href = url;
        a.download = 'patched.nes';
        a.click();
        window.URL.revokeObjectURL(url);
 
      };


      var patchChr = function() {

        var chrPresent = romFactory.ROM.header.chrPageCount;

        var chrTableBuffer;
        if (chrPresent) {
          chrTableBuffer = new ArrayBuffer(romFactory.ROM.chrData.length);
        } else {
          chrTableBuffer = new ArrayBuffer(romFactory.ROM.prgData.length);
        }
        var chrTable = new Uint8Array(chrTableBuffer);

        for (var i = 0, b = 0; i < chrTableToPatch.length; i++) {
          var tmp = chrTableToPatch[i];
          for (var j = 0; j < 8; j++) {
            var byte0 = "";
            var byte8 = "";
            for (var k = 0; k < 8; k++) {
              switch (tmp[j][k]) {
                case 0:
                  byte0 += 0;
                  byte8 += 0;
                  break;
                case 1:
                  byte0 += 1;
                  byte8 += 0;
                  break;
                case 2:
                  byte0 += 0;
                  byte8 += 1;
                  break;
                case 3:
                  byte0 += 1;
                  byte8 += 1;
                  break;

              } // k
            } // j

            chrTable[b + j]     = parseInt(byte0, 2);
            chrTable[b + j + 8] = parseInt(byte8, 2);
          }

            b += 16;
        } // i loop

        return chrTable;
      };




    }
  ]);


}());

;(function() {
  'use strict';

  angular.module('nixel')

  .controller('toolController',
      ['$scope', '$rootScope', 'chrFactory',
    function($scope, $rootScope, chrFactory) {

    var selected   = 's0';

    $scope.selectTool = function(e) {
      var pv = Number(e.target.innerText);
      selected  = angular.element(e.target)[0].attributes['data-swatch'].value;

      // Styles
      var tools = document.getElementsByClassName('tool-selected');
      if (tools.length) {
        tools[0].classList.remove('tool-selected');
      }
      angular.element(e.target).addClass('tool-selected');

      // Let the editor know what value was selected
      $rootScope.$broadcast('tool:select:value', pv);
    };

    $scope.selectSwatch = function(e, idx) {
      $scope[selected] = idx;

      // Update tool background-color
      var color  = angular.element(e.target)[0].attributes.style.value;
      var el = document.getElementsByClassName('tool-selected')[0];
      el.setAttribute('style', color);



      // Let sprite directive know what color to use
      $rootScope.$broadcast('pallete:select:value', selected[1], idx);
     
    };




    $scope.pallete = chrFactory.pallete;
    $scope.s0 = 48;
    $scope.s1 = 16;
    $scope.s2 =  0;
    $scope.s3 = 63;

    }
  ]);

}());

;(function() {
  'use strict';

  angular.module('nixel')

  .controller('editController',
      ['$scope', 'romFactory', 'chrFactory', '$rootScope',
    function($scope, romFactory, chrFactory,  $rootScope) {

    $scope.el0 = 0;
    $scope.el1 = 1;
    $scope.el2 = 2;
    $scope.el3 = 3;

    var pixelValue = 0;
    // From tool.controller
    $scope.$on('tool:select:value', function(e, pv) {
      pixelValue = pv;
    });

    $scope.select = function(e) {
      var   id = e.target.getAttribute('sprite-index'),
           idx = $scope[id],
          elid = e.target.id,
             n = e.target.getAttribute('scale'),

            // offset for webkit, layer for FireFox
            // layer only works because the div containing
            // the canvas has its position set to relative
             x = e.offsetX || e.layerX,
             y = e.offsetY || e.layerY;

      x = Math.floor(x / n) % 8;
      y = Math.floor(y / n) % 8;

      chrFactory.updateTable(idx, x, y, pixelValue);
    };


    $scope.$on('sprite:drop', function(e, idx, el) {
      switch (el) {
        case 'e0':
          $scope.el0 = idx;
          break;
        case 'e1':
          $scope.el1 = idx;
          break;
        case 'e2':
          $scope.el2 = idx;
          break;
         case 'e3':
          $scope.el3 = idx;
          break;
      }
      $scope.$digest();
    });


    }
  ]);

}());

;(function() {

  'use strict';

  angular.module('nixel')

  .factory('romFactory', [
    function() {

    var parse = function(rom) {

      var header = {
        inesHeader: '',
        prgPageCount: 1,
        chrPageCount: 0,
        flag06:       0,
        flag07:       0,
        prgRAM:       0,
        format:       0,
        mapper:       0,
        trainer:      false,
        // battery:      false,
        // mirroring
      };


      var romParts = {};
      romParts.raw = rom;

      var i = 0;
      for (i = 0; i < 4; i++) {
        header.inesHeader += String.fromCharCode(rom[i]);
      }
      if (header.inesHeader !== 'NES\x1a') {
        console.log(header.inesHeader);
        throw new Error('Not a valid NES rom!');
      }

      /* Number of Banks
       * PRG has a minimum,  16kb page size [16384 bytes]
       * CHR has no minimum,  8kb page size [ 8192 bytes]
       * */
      header.prgPageCount = rom[4] || 1;
      header.chrPageCount = rom[5];
      header.flag06       = rom[6];
      header.flag07       = rom[7];
      header.prgRAM       = rom[8] || 1;
      header.format       = rom[9]; // 0: NTSC, 1: PAL
      header.mapper       = (header.flag07 & 0xF0) |
                            ((header.flag06 & 0xF0) >> 4);
      header.trainer      = (header.flag06 & 0x04) === 1 ? true : false;
      header.prgDataSize  = 16384 * header.prgPageCount;
      header.chrDataSize  =  8192 * header.chrPageCount;


      romParts.header = header;

      // First 16 bytes of the ROM is the header
      var offset = 16;
      if (header.trainer) { offset += 512; }

      var pBuffer = new ArrayBuffer(header.prgDataSize);
      var cBuffer = new ArrayBuffer(header.chrDataSize);
      romParts.prgData = new Uint8Array(pBuffer);
      romParts.chrData = new Uint8Array(cBuffer);
      for (i = 0; i < header.prgDataSize; i++) {
        romParts.prgData[i] = rom[offset + i];
      }

      offset += header.prgDataSize;
      for (i = 0; i < header.chrDataSize; i++) {
        romParts.chrData[i] = rom[offset + i];
      }

      console.log('ROM Factory');
      console.log('Mapper: ', header.mapper);
      console.log('PRG_COUNT ', header.prgPageCount);
      console.log('CHR_COUNT ', header.chrPageCount);
      console.log('PRG_SIZE  ', header.prgDataSize);
      console.log('CHR_SIZE  ', header.chrDataSize);

      return romParts;

      };

    var ROM = {};
    ROM.spriteTable = [];

    return {
      parse : parse,
      ROM   : ROM,
    };

    }
  ]);

}());

;(function() {

  'use strict';

  angular.module('nixel')

  .factory('chrFactory',
      ['$rootScope',
    function($rootScope) {

  var toBinaryStringArray = function (chrData) {
    var strArr = [];
    var tmp;

    for (var i = 0; i< chrData.length; i++) {
          tmp = '00000000' + chrData[i].toString(2);
          tmp = tmp.substr(-8);

          strArr.push(tmp);
    }

    return strArr;
  };


  var mapBits = function (lowbyte, highbyte) {
    //var spriteBits = "";
    var spriteBits = [];
    var tmplow;
    var tmphigh;

    for (var i=0; i<8; i++) {
      tmplow  = Number(lowbyte[i]);
      tmphigh = Number(highbyte[i]);
      spriteBits.push((tmphigh << 1) | tmplow);
    }

    return spriteBits;
  };



  var buildSpriteTable = function (arr) {
    var spriteArr = [];
    for (var i = 0; i < arr.length; i += 16) {
      for (var j = 0; j < 8; j++) {
        spriteArr.push(mapBits(arr[i + j], arr[i + j + 8]));
      }
    }

    var spriteTable = [];
    var tmp = [];
    for (var i = 0; i < spriteArr.length; i++) {
      tmp.push(spriteArr[i]);
      if (tmp.length === 8) {
        spriteTable.push(tmp);
        tmp = [];
      }
    }

    return spriteTable;
  };


  var chrTable;

  var updateTable = function(idx, x, y, pixelValue) {
    chrTable[idx][y][x] = pixelValue;
    $rootScope.$broadcast('chr:chrTable:update', chrTable, idx);
  };



  var broadcast = function(state) {
    $rootScope.$broadcast('chr:chrTable', state);
  };

  var update = function(state) {
    chrTable = state;
    broadcast(state);
  };

  var setup = function(chrData) {
    var spriteBinaryStringArray = toBinaryStringArray(chrData);
    var table = buildSpriteTable(spriteBinaryStringArray);
    update(table);
  };

  var pallete = [
    "rgb(124, 124, 124)", "rgb(  0,   0, 252)", "rgb(  0,   0, 188)",
    "rgb( 68,  40, 188)", "rgb(148,   0, 132)", "rgb(168,   0,  32)",
    "rgb(168,  16,   0)", "rgb(136,  20,   0)", "rgb( 80,  48,   0)",
    "rgb(  0, 120,   0)", "rgb(  0, 104,   0)", "rgb(  0,  88,   0)",
    "rgb(  0,  64,  88)", "rgb(  0,   0,   0)", "rgb(  0,   0,   0)",
    "rgb(  0,   0,   0)", "rgb(188, 188, 188)", "rgb(  0, 120, 248)",
    "rgb(  0,  88, 248)", "rgb(104,  68, 252)", "rgb(216,   0, 204)",
    "rgb(228,   0,  88)", "rgb(248,  56,   0)", "rgb(228,  92,  16)",
    "rgb(172, 124,   0)", "rgb(  0, 184,   0)", "rgb(  0, 168,   0)",
    "rgb(  0, 168,  68)", "rgb(  0, 136, 136)", "rgb(  0,   0,   0)",
    "rgb(  0,   0,   0)", "rgb(  0,   0,   0)", "rgb(248, 248, 248)",
    "rgb( 60, 188, 252)", "rgb(104, 136, 252)", "rgb(152, 120, 248)",
    "rgb(248, 120, 248)", "rgb(248,  88, 152)", "rgb(248, 120,  88)",
    "rgb(252, 160,  68)", "rgb(248, 184,   0)", "rgb(184, 248,  24)",
    "rgb( 88, 216,  84)", "rgb( 88, 248, 152)", "rgb(  0, 232, 216)",
    "rgb(120, 120, 120)", "rgb(  0,   0,   0)", "rgb(  0,   0,   0)",
    "rgb(252, 252, 252)", "rgb(164, 228, 252)", "rgb(184, 184, 248)",
    "rgb(216, 184, 248)", "rgb(248, 184, 248)", "rgb(248, 164, 192)",
    "rgb(240, 208, 176)", "rgb(252, 224, 168)", "rgb(248, 216, 120)",
    "rgb(216, 248, 120)", "rgb(184, 248, 184)", "rgb(184, 248, 216)",
    "rgb(  0, 252, 252)", "rgb(248, 216, 248)", "rgb(  0,   0,   0)",
    "rgb(  0,   0,   0)"
  ];



  var chrTableToByteArray = function() {

  };


  return {
    setup       : setup,
    chrTable    : chrTable,
    update      : update,
    updateTable : updateTable,
    pallete     : pallete,
  };


    }
  ]);

}());

;(function() {

  'use strict';

  angular.module('nixel')

  .controller('mainController',
    ['$rootScope', '$scope', 'romFactory',
    function($rootScope, $scope, romFactory) {

      // show load, hide rest of app
      $rootScope.show = true;

      var fileLoadCallback = function(e) {
        var file = e.target.files[0];
        var romReader = new FileReader();

        romReader.onloadend = ( function(f) {
          var rawData = new Uint8Array(romReader.result);
          romFactory.ROM = romFactory.parse(rawData);
            $rootScope.$broadcast('file:load');
          });
        romReader.readAsArrayBuffer(file);

        // Hide load, show rest of app
        $rootScope.show = false;
        $rootScope.$apply();
      };


      var romFile = document.getElementById('romFile');
      romFile.addEventListener('change', fileLoadCallback, false);

      $scope.loadROM = function() {
        romFile.click();
      };




    }
  ]);

}());
