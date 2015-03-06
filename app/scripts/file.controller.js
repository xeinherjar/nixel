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
           console.log(romFactory.ROM); 
            $rootScope.$broadcast('file:load');
          });
        romReader.readAsArrayBuffer(file);

        
      };


      var rom = document.getElementById('romFile');
      rom.addEventListener('change', fileLoadCallback, false);

      $scope.loadROM = function() {
        rom.click();
      };

    }
  ]);


}());
