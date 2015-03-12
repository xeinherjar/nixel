;(function() {
  'use strict';

  angular.module('nixel')

  .controller('editController',
      ['$scope', 'romFactory', 'chrFactory', '$rootScope',
    function($scope, romFactory, chrFactory,  $rootScope) {

    $scope.tmp = 0;


    $scope.select = function(e) {
      var  idx = e.target.getAttribute('sprite-index'),
          elid = e.target.id,
             n = e.target.getAttribute('scale'),
             x = Math.floor(e.offsetX / n),
             y = Math.floor(e.offsetY / n);
    };


    $scope.$on('sprite:drop', function(e, idx) {
      console.log($scope.spriteIndex);
      console.log('drop:', idx);
      $scope.tmp = idx;
      $scope.$digest();
    });

    }
  ]);

}());
