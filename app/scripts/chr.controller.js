;(function() {

  'use strict';

  angular.module('nixel')

  .controller('chrController',
           ['$scope', 'chrFactory', 'romFactory', '$rootScope',
    function($scope,   chrFactory,   romFactory,   $rootScope) {

    $scope.chrAvailable = true;

    // from file.controller
    $scope.$on('file:load', function(e) {
      if (romFactory.ROM.chrData.length > 0) {
        chrFactory.setup(romFactory.ROM.chrData);
      } else {
        chrFactory.setup(romFactory.ROM.prgData);
        $scope.chrAvailable = false;
        $scope.$digest();
      }

    });

    // from chr.factory
    $scope.$on('chr:chrTable', function(e, chrTable) {
      $scope.spriteTable = chrTable;
      // Needed to fire ng-repeat after ROM load
      $scope.$digest();
    });


    $scope.makeHex = function(n) {
      var h = n.toString(16).toUpperCase();
      var l = "0000".substring(h.length);

      return "0x" + l + h;
    };



    }
  ]);


}());
