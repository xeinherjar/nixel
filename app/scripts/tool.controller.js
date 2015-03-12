;(function() {
  'use strict';

  angular.module('nixel')

  .controller('toolController',
      ['$scope', '$rootScope',
    function($scope, $rootScope) {

    $scope.selectTool = function(e) {
      var pv = Number(e.target.innerText);
      var tools = document.getElementsByClassName('tool-selected');

      if (tools.length) {
        tools[0].classList.remove('tool-selected');
      }

      angular.element(e.target).addClass('tool-selected');
      $rootScope.$broadcast('tool:select:value', pv);
    };

    }
  ]);

}());
