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
    $rootScope.$broadcast('chr:chrTable:update', chrTable);
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
