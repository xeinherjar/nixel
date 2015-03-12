;(function() {

  'use strict';

  angular.module('nixel')

  .controller('chrController',
           ['$scope', 'chrFactory', 'romFactory', '$rootScope',
    function($scope,   chrFactory,   romFactory,   $rootScope) {


    $scope.$on('file:load', function(e) {
      if (romFactory.ROM.chrData.length > 0) {
        chrFactory.setup(romFactory.ROM.chrData);
      } else {
        chrFactory.setup(romFactory.ROM.prgData);
      }

    });

    $scope.$on('chr:chrTable', function(e, chrTable) {
      $scope.spriteTable = chrTable;
      // Needed to fire ng-repeat after ROM load
      $scope.$digest();
    });


    }
  ]);


}());
