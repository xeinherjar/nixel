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

        scope.$on('chr:chrTable:update', function(e, chrTable) {
          if (!tbl) { return; }
          tbl = chrTable;
          render(tbl);
        });

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
