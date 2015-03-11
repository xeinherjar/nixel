;(function() {
  'use strict';

  angular.module('nixel')

  .controller('editController',
      ['$scope', 'romFactory', 'chrFactory',
    function($scope, romFactory, chrFactory) {

    $scope.$on('sprite:selected', function(e, idx) {
      console.log('edit:', idx);
    });


    $scope.$on('file:load', function(e) {
      romFactory.ROM.spriteBinaryStringArray =
        chrFactory.toBinaryStringArray(romFactory.ROM.chrData);
      romFactory.ROM.spriteTable =
        chrFactory.buildSpriteTable(romFactory.ROM.spriteBinaryStringArray);
      $scope.spriteTable = romFactory.ROM.spriteTable;

    });





    }
  ]);

}());
