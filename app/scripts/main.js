
rom.load();

var spriteTable;
var test = function() {
  rom.spriteArrString = sprite.toBinaryStringArray(rom.chrData);
  rom.spriteTable = sprite.buildSpriteTable(rom.spriteArrString);
};



var setup = function () {
  var hero = document.getElementsByClassName('hero-unit')[0];
  var spCount = 1;
  var n = 10;

  for (var i = 0; i < rom.spriteTable.length; i++) {
    if (i % 8 === 0) {
      var canvas = document.createElement('canvas');
      canvas.id = 'ctx' + spCount;
      canvas.setAttribute('width', 8 * n);
      canvas.setAttribute('height', 8 * n);
      spCount++;
      hero.appendChild(canvas);
      ctx = document.getElementById(canvas.id).getContext('2d');
      console.log(ctx);
      render(ctx, i);
    }
  }
};

var render = function(ctx, spNum) {
  var n = 10;
  var stop = spNum + 8;

  for (var i = spNum; i < stop; i++) {
    for (var j = 0; j < 8; j++) {
        var x = j,
            y = i % 8,
            s = rom.spriteTable[i][j];
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
