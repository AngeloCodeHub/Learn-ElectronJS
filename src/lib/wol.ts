import wol from 'wake_on_lan';

wol.wake('08-BF-B8-40-37-30');

/*
wol.wake('20:DE:20:DE:20:DE', function (error) {
  if (error) {
    // handle error
  } else {
    // done sending packets
  }
});
 */

// let magic_packet = wol.createMagicPacket('20:DE:20:DE:20:DE');
// wol.createMagicPacket('20:DE:20:DE:20:DE');
