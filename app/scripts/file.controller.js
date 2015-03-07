;(function() {

  'use strict';

  angular.module('nixel')

  .controller('fileController', 
           ['$scope', 'romFactory','$rootScope',
    function($scope,   romFactory,  $rootScope) {

      var fileLoadCallback = function(e) {
        var file= e.target.files[0];
        var romReader = new FileReader();

        romReader.onloadend = ( function(f) {
          var rawData = new Uint8Array(romReader.result);
          romFactory.ROM = romFactory.parse(rawData);
            $rootScope.$broadcast('file:load');
          });
        romReader.readAsArrayBuffer(file);

        
      };


      var romFild = document.getElementById('romFile');
      romFile.addEventListener('change', fileLoadCallback, false);

      $scope.loadROM = function() {
        romFile.click();
      };

      $scope.downloadCHR = function() {
        var blob = new Blob([romFactory.ROM.chrData], 
            { type: 'octet/stream' });
        var url = window.URL.createObjectURL(blob);
        window.location.assign(url);
      };

    }
  ]);


}());
