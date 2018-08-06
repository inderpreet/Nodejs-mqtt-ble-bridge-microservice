/**
 * 
 * Client Application For IoT Demo
 * 
 * Written By: Inderpreet Singh @Hackaday.com
 * 
 */

var mqtt    = require('mqtt');
var count   = 0;
var client  = mqtt.connect("mqtt://iot.eclipse.org",{clientId:"mqttjs0109843"});

var noble   = require('noble');
var ble_UUID =['171a3182907143bfb53a1689b132a533', '9d0bfe96c7bb46c59b35d9abc398c587', '49c6dbc511bb4c8f968efb21b73260f8']; // add your UUIDs to this list...
var ble_serices = 'ffb0';
var red_char = 'ffb1';
var green_char = 'ffb2';
var blue_char = 'ffb3';
var white_char = 'ffb4';
var R=0;
var G=0;
var B=0;
var W=0;
var scanningTimeout = 1000; // one second
var scanningRepeat = scanningTimeout + 9000; // Repeat scanning after 10 seconds for new peripherals.

// Asychronous Stuff

client.on("connect",function(){	
    console.log("CLIENT CONNECTED: "+ client.connected);

})

//handle errors
client.on("error",function(error){
console.log("Can't connect" + error);
process.exit(1)});

//handle incoming messages
client.on('message',function(topic, message, packet){
    // The fun stuff happens here!
    console.log("INCOMING MESSAGE: "+ message +"On topic: "+ topic);
    var tempBuff = 0;
    tempBuff = convert(message.toString());

    if(topic==="ip_v1/BLE_Light/Red"){
        R=tempBuff;
        console.log("R value is "+ tempBuff);
    } else if(topic==="ip_v1/BLE_Light/Green"){
        G=tempBuff;
        console.log("G value is "+ tempBuff);
    } else if(topic==="ip_v1/BLE_Light/Blue"){
        B=tempBuff;
        console.log("B value is "+ tempBuff);
    } else if(topic==="ip_v1/BLE_Light/White"){
        W=tempBuff;
        console.log("W value is "+ tempBuff);
    }
	//console.log("topic is "+ topic);
});

// BLE stuff

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
}, 1500);

// cycle through values
/*
setInterval(function(){
    W= W + 10;
    R= R + 10;

    if(R>200) 
        R=0;
}, 1500);
*/
//  Everytime a peripheral is discovered...
// Check if it is recognized and if so then connect to it.
noble.on('discover', function(peripheral) {
    // we found a peripheral, stop scanning if we were looking for only one device.
    //noble.stopScanning();
    //R = 00;
    //G = 00;
    //B = 00;
    //W = 00;
    //console.log('found peripheral:', peripheral.advertisement);
    var advertisement = peripheral.advertisement;
    var localName = advertisement.localName;
    var txPowerLevel = advertisement.txPowerLevel;
    var manufacturerData = advertisement.manufacturerData;
    var serviceData = advertisement.serviceData;
    var serviceUuids = advertisement.serviceUuids;
    console.log(peripheral.id);
  
    ble_UUID.forEach(function(temp){                        // compare with known BLE Devices in the list
      if(peripheral.id === temp){                           // if it is a match, 
        peripheral.connect(function(err){                   // connect with..
          setTimeout(function(){peripheral.disconnect(function(err){});}, 1000); // timeout
            peripheral.discoverServices([ble_serices], function(err, service) {  // ask about the services
                service.forEach(function(service){      			
                    console.log('found service:', service.uuid);
                    //discover characteristics
                    service.discoverCharacteristics([], function(err, characteristics) {
                        characteristics.forEach(function(characteristic) { // for each discovered characteris
                            var mybuff = new Buffer(1);
                            switch(characteristic.uuid){
                                case red_char:
                                    mybuff.writeUInt8(R,0); //write R at 0 offset
                                    break;
                                case green_char: 
                                    mybuff.writeUInt8(G,0); //write G at 0 offset
                                    break;
                                case blue_char:
                                    mybuff.writeUInt8(B,0); //write B at 0 offset
                                    break;
                                case white_char:
                                    mybuff.writeUInt8(W,0); //write W at 0 offset
                                    break;
                                default:
                                    mybuff.writeUInt8(0,0); //write 0 at 0 offset
                                    break;
                            } // end switch
                            console.log('found characteristic:', characteristic.uuid);
                            characteristic.write( mybuff, true, function(err){ });
                        }); // End for each characteristic
                    }); // End Service discovery
                }); //End Service for each
            }); // End discovery listed services
        }); // End Connect 
      } // End IF Peripheral ID select
    }); // End For each
  }); // End on Noble Discover!

// Functions and Stuff

function convert(strDec){
    // string must always be three bytes.. add checks here
    console.log(strDec);
    var myBuff = new Buffer(1);
    //Lower Byte
    myBuff = parseInt(strDec[2], 10);
    // if(myBuff>9) error
    value = myBuff; 

    // Middle Byte - check?
    myBuff = parseInt(strDec[1], 10);
    value = value + ( myBuff * 10);

    // Upper Byte - check?
    myBuff = parseInt(strDec[0], 10);
    value = value + ( myBuff * 100);
    //console.log(value);
    return value;
}

//publish
function publish(topic,msg,options){
    console.log("PUBLISHING",msg);

    if (client.connected == true){
        client.publish(topic,msg,options);
    }

    count+=1;
    if (count==2){
        clearTimeout(timer_id); //stop timer
    }
    //client.end();	
}

// The rest of the stuff

var options={
    retain:true,
    qos:1};
var topic="BLE-Light-Response";
var message="Hello From BLE Light";
var command_topic="ble_commands_2108321";

var topic_list=["ip_v1/BLE_Light/Red","ip_v1/BLE_Light/Green","ip_v1/BLE_Light/Blue", "ip_v1/BLE_Light/White"];

console.log("subscribing to topics");
client.subscribe(topic_list,{qos:1}); //single topic

// Create a timer to end this program in... 5, 4, 3, 2, 1 . Boom!
var timer_id=setInterval(function(){publish(topic,message,options);},30000);

