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