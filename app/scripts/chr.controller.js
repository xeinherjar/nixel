;(function() {

  'use strict';

  angular.module('nixel')

  .controller('chrController',
           ['$scope', 'chrFactory', 'romFactory',
    function($scope,   chrFactory,   romFactory) {


    $scope.$on('file:load', function(e) {
      chrFactory.setup(romFactory.ROM.chrData);
    });

    $scope.$on('chr:chrTable', function(e, chrTable) {
      $scope.spriteTable = chrTable;
      // Needed to fire ng-repeat after ROM load
      $scope.$digest();
    });

    }
  ]);


}());
