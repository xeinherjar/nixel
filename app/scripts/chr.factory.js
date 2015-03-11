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
    var spriteBits = "";
    var tmplow;
    var tmphigh;

    for (var i=0; i<8; i++) {
      tmplow  = Number(lowbyte[i]);
      tmphigh = Number(highbyte[i]);
      spriteBits = spriteBits + ((tmphigh << 1) | tmplow);
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



  return {
    setup    : setup,
    chrTable : chrTable,
    update   : update,
  };


    }
  ]);

}());
