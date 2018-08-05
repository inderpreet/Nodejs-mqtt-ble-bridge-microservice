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
	console.log("INCOMING MESSAGE: "+ message);
	//console.log("topic is "+ topic);
});

// Functions and Stuff

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
    client.end();	
}

// The preverbial Main!

var options={
    retain:true,
    qos:1};
var topic="BLE-Light-Response";
var message="Hello From BLE Light";
var command_topic="ble_commands_2108321";

var topic_list=["topic2","topic3","topic4"];
var topic_o={"topic22":0,"topic33":1,"topic44":1};

console.log("subscribing to topics");

client.subscribe(command_topic,{qos:1}); //single topic

// Create a timer to end this program in... 5, 4, 3, 2, 1 . Boom!
var timer_id=setInterval(function(){publish(topic,message,options);},5000);

