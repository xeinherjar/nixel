;(function() {

  'use strict';
  
  angular.module('nixel')

  .controller('chrController',
           ['$scope', 'chrFactory', 'romFactory',
    function($scope,   chrFactory,   romFactory) {

    var renderCHR = function () {
      var chr = document.getElementById('chr');
      var spCount = 1;
      var n = 10;
      
      for (var i = 0; i < romFactory.ROM.spriteTable.length; i++) {
        if (i % 8 === 0) {
          var canvas = document.createElement('canvas');
          canvas.id = 'ctx' + spCount;
          canvas.setAttribute('width', 8 * n);
          canvas.setAttribute('height', 8 * n);
          spCount++;
          chr.appendChild(canvas);
          var ctx = document.getElementById(canvas.id).getContext('2d');
          renderSprite(ctx, i, 10);
        }
      }
    };

    var renderSprite = function(ctx, spNum, scale) {
      var n = scale;
      var stop = spNum + 8;

      for (var i = spNum; i < stop; i++) {
        for (var j = 0; j < 8; j++) {
            var x = j,
                y = i % 8,
                s = romFactory.ROM.spriteTable[i][j];
            switch(Number(s)) {
              case 0:
                ctx.fillStyle = "rgb(255, 255, 255)";
                break;
              case 1:
                ctx.fillStyle = "rgb(170, 170, 170)";
                break;
              case 2:
                ctx.fillStyle = "rgb(85, 85, 85)";
                break;
              case 3:
                ctx.fillStyle = "rgb(0, 0, 0)";
                break;
            }

            ctx.fillRect(x * n, y * n, n, n);
        }
      }
    };

    $scope.$on('file:load', function(e) {
      romFactory.ROM.spriteBinaryStringArray = 
        chrFactory.toBinaryStringArray(romFactory.ROM.chrData);
      romFactory.ROM.spriteTable = 
        chrFactory.buildSpriteTable(romFactory.ROM.spriteBinaryStringArray);
      renderCHR();
    });

    }
  ]);


}());
