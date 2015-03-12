;(function() {
  'use strict';

  angular.module('nixel')

  .controller('editController',
      ['$scope', 'romFactory', 'chrFactory', '$rootScope',
    function($scope, romFactory, chrFactory,  $rootScope) {

    $scope.el0 = 0;
    $scope.el1 = 1;
    $scope.el2 = 2;
    $scope.el3 = 3;


    $scope.select = function(e) {
      var   id = e.target.getAttribute('sprite-index'),
           idx = $scope[id],
          elid = e.target.id,
             n = e.target.getAttribute('scale'),
             x = Math.floor(e.offsetX / n),
             y = Math.floor(e.offsetY / n);
      console.log('sel', idx, elid, n, x, y);
      chrFactory.updateTable(idx, x, y);
    };


    $scope.$on('sprite:drop', function(e, idx, el) {
      console.log($scope.spriteIndex);
      switch (el) {
        case 'e0':
          $scope.el0 = idx;
          break;
        case 'e1':
          $scope.el1 = idx;
          break;
        case 'e2':
          $scope.el2 = idx;
          break;
         case 'e3':
          $scope.el3 = idx;
          break;
      }
      $scope.$digest();
    });


    }
  ]);

}());
