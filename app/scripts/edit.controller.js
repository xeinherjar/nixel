;(function() {
  'use strict';

  angular.module('nixel')

  .controller('editController',
      ['$scope', 'romFactory', 'chrFactory',
    function($scope, romFactory, chrFactory) {

    $scope.$on('sprite:selected', function(e, idx) {
      console.log('selected:', idx);
      console.log('index:', idx);
    });

    $scope.$on('sprite:edit', function(e, idx, x, y) {
      console.log('edit:', idx);
      console.log('index:', idx);
      console.log('x:', x);
      console.log('y:', y);
    });






    }
  ]);

}());
