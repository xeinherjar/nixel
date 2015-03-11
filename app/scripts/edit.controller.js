;(function() {
  'use strict';

  angular.module('nixel')

  .controller('editController',
      ['$scope', 'romFactory',
    function($scope, romFactory) {

      $scope.$on('sprite:selected', function(e, idx) {
        console.log('edit:', idx);
      });


    }
  ]);

}());
