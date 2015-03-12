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
