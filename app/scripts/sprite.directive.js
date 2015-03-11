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
        editable: '@?',
      },

      controller: ['$scope', '$element', 'romFactory', '$rootScope',
        function($scope, $element, romFactory, $rootScope) {
          $scope.$on('file:load', function() {

            var n   = $scope.scale;
            var ctx = $element[0].getContext('2d');
            var idx = $scope.spriteIndex;
            for (var i = 0; i < 8; i++) {
              for (var j = 0; j < 8; j++) {
                var x = j,
                    y = i,
                    s = Number(romFactory.ROM.spriteTable[idx][i][j]);
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

          $element.bind('click', function(e) {
            var x = Math.floor(e.offsetX / n),
                y = Math.floor(e.offsetY / n);
            console.log('index:', idx);
            $rootScope.$broadcast('sprite:selected', idx);
            console.log('x:', x);
            console.log('y:', y);
        });


          });

        }],

      link: function(scope, el, attr) {
        var e    = el[0];
        var ctx  = e.getContext('2d');
        var size = attr.scale * 8;

        el.attr('width',  size);
        el.attr('height', size);
        /*
        el.bind('click', function(e) {
          console.log('index:', scope.spriteIndex);
          scope.$broadcast('sprite:selected', scope.spriteIndex);
          console.log('x:', Math.floor(e.offsetX / attr.scale));
          console.log('y:', Math.floor(e.offsetY / attr.scale));
        });
        */

      }
    };

  });

}());
