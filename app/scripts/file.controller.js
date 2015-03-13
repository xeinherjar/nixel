;(function() {

  'use strict';

  angular.module('nixel')

  .controller('fileController',
           ['$scope', 'romFactory','$rootScope', 'chrFactory',
    function($scope,   romFactory,  $rootScope,   chrFactory) {

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


      var chrTableToPatch;
      $scope.$on('chr:chrTable:update', function(e, chrTable) {
        chrTableToPatch = chrTable;
      });

      $scope.patchROM = function() {
        var chrTable = patchChr();

        var romBuffer = new ArrayBuffer(romFactory.ROM.raw.length);
        var rom       = new Uint8Array(romBuffer); 

        // Header is 16 bytes
        for (var i = 0; i < 16; i++) {
          rom[i] = romFactory.ROM.raw[i];
        }

        // Prg Data
        var offset = 16;
        for (var i = 0; i < romFactory.ROM.header.prgDataSize; i++) {
          rom[offset + i] = romFactory.ROM.prgData[i];
        }

        // Chr Data
        offset += romFactory.ROM.header.prgDataSize;
        for (var i = 0; i < romFactory.ROM.header.chrDataSize; i++) {
          rom[offset + i] = chrTable[i];
        }

        var blob = new Blob([rom],
            { type: 'octet/stream' });
        var url = window.URL.createObjectURL(blob);
        window.location.assign(url);

      };


      var patchChr = function() {
        var chrTableBuffer = new ArrayBuffer(romFactory.ROM.chrData.length);
        var chrTable = new Uint8Array(chrTableBuffer);

        for (var i = 0, b = 0; i < chrTableToPatch.length; i++) {
          var tmp = chrTableToPatch[i];
          for (var j = 0; j < 8; j++) {
            var byte0 = "";
            var byte8 = "";
            for (var k = 0; k < 8; k++) {
              switch (tmp[j][k]) {
                case 0:
                  byte0 += 0;
                  byte8 += 0;
                  break;
                case 1:
                  byte0 += 1;
                  byte8 += 0;
                  break;
                case 2:
                  byte0 += 0;
                  byte8 += 1;
                  break;
                case 3:
                  byte0 += 1;
                  byte8 += 1;
                  break;

              } // k
            } // j

            chrTable[b + j]     = parseInt(byte0, 2);
            chrTable[b + j + 8] = parseInt(byte8, 2);
          }

            b += 16;
        } // i loop

        console.log(chrTable);
        console.log(romFactory.ROM.chrData);
        return chrTable;
      };




    }
  ]);


}());
