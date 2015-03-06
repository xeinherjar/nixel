;(function() {

  'use strict';

  angular.module('nixel')

  .factory('chrFactory',
      [
    function() {

  var toBinaryStringArray = function (chrData) {
    var strArr = [];
    var tmp;

    console.log('binarystringarray', chrData);
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

    return spriteArr;
  };



  return {
    toBinaryStringArray : toBinaryStringArray,
    buildSpriteTable    : buildSpriteTable,
  };


    }
  ]);

}());
