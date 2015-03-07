;(function() {
  
  'use strict';

  angular.module('nixel')

  .factory('romFactory', [
    function() {

    var parse = function(rom) {

      var header = {
        inesHeader: '',
        prgPageCount: 1,
        chrPageCount: 0,
        flag06:       0,
        flag07:       0,
        prgRAM:       0,
        format:       0,
        mapper:       0,
        trainer:      false,
        // battery:      false,
        // mirroring
      };


      var romParts = {};
      romParts.raw = rom;

      var i = 0;
      for (i = 0; i < 4; i++) {
        header.inesHeader += String.fromCharCode(rom[i]);
      }
      if (header.inesHeader !== 'NES\x1a') { 
        console.log(header.inesHeader);
        throw new Error('Not a valid NES rom!');
      }

      /* Number of Banks
       * PRG has a minimum,  16kb page size [16384 bytes]
       * CHR has no minimum,  8kb page size [ 8192 bytes]
       * */
      header.prgPageCount = rom[4] || 1;
      header.chrPageCount = rom[5];
      header.flag06       = rom[6];
      header.flag07       = rom[7];
      header.prgRAM       = rom[8] || 1;
      header.format       = rom[9]; // 0: NTSC, 1: PAL
      header.mapper       = (header.flag07 & 0xF0) |
                            ((header.flag06 & 0xF0) >> 4);
      header.trainer      = (header.flag06 & 0x04) === 1 ? true : false;
      header.prgDataSize  = 16384 * header.prgPageCount;
      header.chrDataSize  =  8192 * header.chrPageCount;


      romParts.header = header;

      // First 16 bytes of the ROM is the header
      var offset = 16;
      if (header.trainer) { offset += 512; }

      var pBuffer = new ArrayBuffer(header.prgDataSize);
      var cBuffer = new ArrayBuffer(header.chrDataSize);
      romParts.prgData = new Uint8Array(pBuffer);
      romParts.chrData = new Uint8Array(cBuffer);
      for (i = 0; i < header.prgDataSize; i++) {
        romParts.prgData[i] = rom[offset + i];
      }

      offset += header.prgDataSize;
      for (i = 0; i < header.chrDataSize; i++) {
        romParts.chrData[i] = rom[offset + i];
      }

      console.log('ROM Factory');
      console.log('Mapper: ', header.mapper);
      console.log('PRG_COUNT ', header.prgPageCount);
      console.log('CHR_COUNT ', header.chrPageCount);
      console.log('PRG_SIZE  ', header.prgDataSize);
      console.log('CHR_SIZE  ', header.chrDataSize);

      return romParts;

      };

    var ROM;


    return {
      parse : parse,
      ROM   : ROM,
    };

    }
  ]);

}());
