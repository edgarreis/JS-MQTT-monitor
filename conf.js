
// Script JavaScript
// Config Broker Connection
var websocketserver = 'iot.eclipse.org'; //'broker.hivemq.com'; //'192.168.25.4'; //'192.168.110.82';
var websocketport   =  80; 
var topic = 'dev/node1/#';

var ledtopic = 'clients/arduino/led';	// Web PUBlishes to ledtopic + "/cmd"
