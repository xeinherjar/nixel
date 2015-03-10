;(function() {
  'use strict';

  angular.module('nixel')

  .directive('nixelSprite', 
    function() {

    return {
      restrict: 'A',
      scope: {
        spriteIndex: '=',
        scale: '=',
      },
      //template: '<canvas></canvas>',
      controller: ['$scope', '$element', 'romFactory', 
        function($scope, $element, romFactory) {
          $scope.$on('file:load', function() {
            console.log(romFactory.ROM.spriteTable[$scope.spriteIndex]);

            var n   = $scope.scale;
            var ctx = $element[0].getContext('2d');
            var idx = $scope.spriteIndex;
            for (var i = idx; i < idx + 8; i++) {
              for (var j = 0; j < 8; j++) {
                var x = j,
                    y = i % 8,
                    s = Number(romFactory.ROM.spriteTable[i][j]);
                switch(s) {
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

              } // j
            } // i
          });

        }],
      link: function(scope, el, attr) {
        var e    = el[0];
        var ctx  = e.getContext('2d');
        var size = attr.scale * 8;

      }
    };

  });

}());
