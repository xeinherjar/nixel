;(function() {
  'use strict';

  angular.module('nixel')

  .controller('toolController',
      ['$scope', '$rootScope', 'chrFactory',
    function($scope, $rootScope, chrFactory) {

    var selected   = 's0';

    $scope.selectTool = function(e) {
      var pv = Number(e.target.innerText);
      selected  = angular.element(e.target)[0].attributes['data-swatch'].value;

      // Styles
      var tools = document.getElementsByClassName('tool-selected');
      if (tools.length) {
        tools[0].classList.remove('tool-selected');
      }
      angular.element(e.target).addClass('tool-selected');

      // Let the editor know what value was selected
      $rootScope.$broadcast('tool:select:value', pv);
    };

    $scope.selectSwatch = function(e, idx) {
      $scope[selected] = idx;

      // Update tool background-color
      var color  = angular.element(e.target)[0].attributes.style.value;
      var el = document.getElementsByClassName('tool-selected')[0];
      el.setAttribute('style', color);



      // Let sprite directive know what color to use
      $rootScope.$broadcast('pallete:select:value', selected[1], idx);
     
    };




    $scope.pallete = chrFactory.pallete;
    $scope.s0 = 48;
    $scope.s1 = 16;
    $scope.s2 =  0;
    $scope.s3 = 63;

    }
  ]);

}());
