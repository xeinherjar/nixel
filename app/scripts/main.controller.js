;(function() {

  'use strict';

  angular.module('nixel')

  .controller('mainController',
    ['$rootScope', '$scope', 'romFactory',
    function($rootScope, $scope, romFactory) {

      // show load, hide rest of app
      $rootScope.show = true;

      var fileLoadCallback = function(e) {
        var file = e.target.files[0];
        var romReader = new FileReader();

        romReader.onloadend = ( function(f) {
          var rawData = new Uint8Array(romReader.result);
          romFactory.ROM = romFactory.parse(rawData);
            $rootScope.$broadcast('file:load');
          });
        romReader.readAsArrayBuffer(file);

        // Hide load, show rest of app
        $rootScope.show = false;
        $rootScope.$apply();
      };


      var romFile = document.getElementById('romFile');
      romFile.addEventListener('change', fileLoadCallback, false);

      $scope.loadROM = function() {
        romFile.click();
      };




    }
  ]);

}());
