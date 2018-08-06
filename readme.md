# BLE-MQTT Bridge Microservice written in NodeJS

This is a simple BLE-MQTT Bridge application to allows remote control of a TI BLE Light. Code was written and tested on a Macbook Air.

## Getting Started

Install,

Run

Connect to iot.eclipse.org via an MQTT Client. Send a command and viola!

Commands are sent to ip_v1/BLE_Light/Red , ip_v1/BLE_Light/Green , ip_v1/BLE_Light/Blue and ip_v1/BLE_Light/White

Values MUST be three ASCII Characters of values ranging from 000 to 255

e.g. 015 must be send as a ASCII String. The parser will automatically convert to the number 15.


### Prerequisites

nodejs, npm...
everything else, will get installed once you do npm install


### Installing

Step 1: Clone the repository

Step 2: 
```
npm install
```
Step 3: 
```
node index.js
```




## Authors

* **Inderpreet Singh** - *Initial work* - 


## License

This project is licensed under the GPLv2 License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

// to-do

