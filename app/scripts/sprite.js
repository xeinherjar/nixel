(function() {

'use strict';

var sprite= {};

sprite.toBinaryStringArray = function (chrData) {
  var strArr = [];
  var tmp;
  for (var i = 0; i< chrData.length; i++) {
        tmp = '00000000' + chrData[i].toString(2);
        tmp = tmp.substr(-8);
        //tmp = tmp.split('').reverse().join('');

        strArr.push(tmp);
  }

  return strArr;
};


sprite.mapBits = function (lowbyte, highbyte) {
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

sprite.buildSpriteTable = function (arr) {
  var spriteArr = [];
  var tmp = [];
  for (var i = 0; i < arr.length; i += 16) {
    for (var j = 0; j < 8; j++) {
      tmp.push(sprite.mapBits(arr[i + j], arr[i + j + 8]));
    }
  }

  //return spriteArr;
  return tmp;
};


//var tmp = toBinaryStringArray();

window.sprite = sprite;

}());
