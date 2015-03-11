;(function() {

  'use strict';

  angular.module('nixel')

  .controller('chrController',
           ['$scope', 'chrFactory', 'romFactory',
    function($scope,   chrFactory,   romFactory) {


    $scope.$on('file:load', function(e) {
      romFactory.ROM.spriteBinaryStringArray =
        chrFactory.toBinaryStringArray(romFactory.ROM.chrData);
      romFactory.ROM.spriteTable =
        chrFactory.buildSpriteTable(romFactory.ROM.spriteBinaryStringArray);
      $scope.spriteTable = romFactory.ROM.spriteTable;

      // Needed to fire ng-repeat after ROM load
      $scope.$digest();
    });

    }
  ]);


}());
