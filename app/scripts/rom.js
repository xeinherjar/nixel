(function() {

'use strict';
var rom = {};

var rBuffer = new ArrayBuffer();

rom.get = new XMLHttpRequest();
rom.get.onload = function(e) {
  rBuffer = rom.get.response;
  rom.rawData = new Uint8Array(rBuffer);

  rom.parse();

};

rom.load = function() {
  rom.get.open('GET', 'roms/supermariobrothers.nes', true);
  //rom.get.open('GET', 'roms/MegaMan.nes', true);
  //rom.get.open('GET', 'roms/IceHockey.nes', true);
  //rom.get.open('GET', 'roms/METROID.nes', true);
  //rom.get.open('GET', 'roms/DonkeyKong.nes', true);
  rom.get.responseType = 'arraybuffer';
  rom.get.send(null);
};

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


/* Parse ROM data */
rom.parse = function() {
  var i = 0;
  for (i = 0; i < 4; i++) {
    header.inesHeader += String.fromCharCode(rom.rawData[i]);
  }
  if (header.inesHeader !== 'NES\x1a') { throw new Error('Not a valid NES rom!'); }

  /* Number of Banks
   * PRG has a minimum,  16kb page size [16384 bytes]
   * CHR has no minimum,  8kb page size [ 8192 bytes]
   * */
  header.prgPageCount = rom.rawData[4] || 1;
  header.chrPageCount = rom.rawData[5];
  header.flag06       = rom.rawData[6];
  header.flag07       = rom.rawData[7];
  header.prgRAM       = rom.rawData[8] || 1;
  header.format       = rom.rawData[9]; // 0: NTSC, 1: PAL
  header.mapper       = (header.flag07 & 0xF0) |
                        ((header.flag06 & 0xF0) >> 4);
  header.trainer      = (header.flag06 & 0x04) === 1 ? true : false;
  header.prgDataSize  = 16384 * header.prgPageCount;
  header.chrDataSize  =  8192 * header.chrPageCount;


  rom.header = header;

  // First 16 bytes of the ROM is the header
  var offset = 16;
  if (header.trainer) { offset += 512; }

  var pBuffer = new ArrayBuffer(header.prgDataSize);
  var cBuffer = new ArrayBuffer(header.chrDataSize);
  rom.prgData = new Uint8Array(pBuffer);
  rom.chrData = new Uint8Array(cBuffer);
  for (i = 0; i < header.prgDataSize; i++) {
    rom.prgData[i] = rom.rawData[offset + i];
  }

  offset += header.prgDataSize;
  for (i = 0; i < header.chrDataSize; i++) {
    rom.chrData[i] = rom.rawData[offset + i];
  }

  console.log('Mapper: ', header.mapper);
  console.log('PRG_COUNT ', header.prgPageCount);
  console.log('CHR_COUNT ', header.chrPageCount);
  console.log('PRG_SIZE  ', header.prgDataSize);
  console.log('CHR_SIZE  ', header.chrDataSize);



};



window.rom = rom;

}());
