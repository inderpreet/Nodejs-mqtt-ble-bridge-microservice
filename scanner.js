var noble   = require('noble');
var scanningTimeout = 2000; // one second
var scanningRepeat = scanningTimeout + 8000; // Repeat scanning after 10 seconds for new peripherals.

noble.on('stateChange', function(state) {
    if (state === 'poweredOn') {
      //
      // Once the BLE radio has been powered on, it is possible
      // to begin scanning for services. Pass an empty array to
      // scan for all services (uses more time and power).
      //
      console.log('scanning...');
      noble.startScanning();
    } else {
      noble.stopScanning();
    }
})

// Checking, Scanning, stopping repeatedly
setInterval( function(){
    if(noble.state==='poweredOn'){
      noble.startScanning();
      console.log('Starting Scan...');
      setTimeout(function(){
        noble.stopScanning();
        console.log('Stopping Scan...');
      }, scanningTimeout)
    }  
}, scanningRepeat);

noble.on('discover', function(peripheral) {

    var advertisement = peripheral.advertisement;
    var localName = advertisement.localName;
    var txPowerLevel = advertisement.txPowerLevel;
    var manufacturerData = advertisement.manufacturerData;
    var serviceData = advertisement.serviceData;
    var serviceUuids = advertisement.serviceUuids;
    console.log('Found peripheral :');
    //console.log(peripheral.id);
    console.log(localName);
    console.log('\n');

}); // End on Noble Discover!
