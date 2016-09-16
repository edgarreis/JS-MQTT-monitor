
// Script JavaScript

	var on_led3 = null;
	var on_led4 = null;
	var on_led5 = null;
	
	var tempGauge;
	var humGauge;

	var TempValue = new Array();
	var HumValue = new Array();

	var client = new Messaging.Client(websocketserver, websocketport,
							"web_" + parseInt(Math.random() * 100, 10));

	client.onConnectionLost = function (responseObject) {
			$('#message').val("connection lost: " + responseObject.errorMessage);
			tempGauge.setLedColor(steelseries.LedColor.RED_LED); 
			//change status LED to RED on broker disconnection
			
			humGauge.setLedColor(steelseries.LedColor.RED_LED); 
			//change status LED to RED on broker disconnection
	};

	client.onMessageArrived = function (msg) {
		
		$('#message').val(msg.payloadString);

		console.log(JSON.stringify(msg.destinationName));
		console.log(JSON.stringify(msg.payloadString));
		
		topic_parts = msg.destinationName.split('/');
		
		//statusled = topic_parts[2];
		
		//if (topic_parts[topic_parts.length - 1] == 'statusled') {
			//var status = parseInt(msg.payloadString);
			//console.log("GOTCHA " + status);
			//if (status) {
				//$("#status_off_led1").hide();
				//$("#status_on_led3").show();
			//} else {
				//$("#status_off_led1").show();
				//$("#status_on_led3").hide();
			//}
			//return;
		//}
		

		// LED1 STATUS
		
		if (msg.destinationName == 'clients/arduino/led1') {
			var status_led1 = parseInt(msg.payloadString);
			console.log("GOTCHA " + status_led1);
			if (status_led1) {
				$("#status_off_led1").hide();
				$("#status_on_led1").show();
			} else {
				$("#status_off_led1").show();
				$("#status_on_led1").hide();
			}
			return;
		}
		
		// LED2 STATUS
		
		if (msg.destinationName == 'clients/arduino/led2') {
			var status_led2 = parseInt(msg.payloadString);
			console.log("GOTCHA " + status_led2);
			if (status_led2) {
				$("#status_off_led2").hide();
				$("#status_on_led2").show();
			} else {
				$("#status_off_led2").show();
				$("#status_on_led2").hide();
			}
			return;
		}
		
		// LED3 STATUS
		
		if (msg.destinationName == 'clients/arduino/led3') {
			var status_led3 = parseInt(msg.payloadString);
			console.log("GOTCHA " + status_led3);
			if (status_led3) {
				on_led3 = true;
				$("#status_off_led3").hide();
				$("#status_on_led3").show();
			} else {
				on_led3 = false;
				$("#status_off_led3").show();
				$("#status_on_led3").hide();
			}
			return;
		}

		// LED4 STATUS
		
		if (msg.destinationName == 'clients/arduino/led4') {
			var status_led4 = parseInt(msg.payloadString);
			console.log("GOTCHA " + status_led4);
			if (status_led4) {
				on_led4 = true;
				$("#status_off_led4").hide();
				$("#status_on_led4").show();
			} else {
				on_led4 = false;
				$("#status_off_led4").show();
				$("#status_on_led4").hide();
			}
			return;
		}

		// LED5 STATUS
		
		if (msg.destinationName == 'clients/arduino/led5') {
			var status_led5 = parseInt(msg.payloadString);
			console.log("GOTCHA " + status_led5);
			if (status_led5) {
				on_led5 = true;
				$("#status_off_led5").hide();
				$("#status_on_led5").show();
			} else {
				on_led5 = false;
				$("#status_off_led5").show();
				$("#status_on_led5").hide();
			}
			return;
		}
		
		sensor_addr = topic_parts[2];
		//sensor_addr = "Room Light";
		
		// TEMPERATURE
		
		 if (topic_parts[topic_parts.length - 1] == 'temperature') {
		
			$('#TempValueLabel').text(msg.payloadString + ' C');
			$('#TempValueLabel').removeClass('').addClass('label-default');

			TempValue.push(parseInt(msg.payloadString));
			if (TempValue.length >= 20) {
				TempValue.shift();
			}

			$('#TempValueChart').sparkline(TempValue, {
				type: 'line',
				width: '180',
				height: '40'
			});
			tempGauge.setValue(msg.payloadString);
			
			
		// } else {
			if (msg.payloadString == '1') {
				$('#label_temp').text(sensor_addr);
				$('#label_temp').removeClass('label-danger').addClass('label-success');
			} else {
				$('#label_temp').text(sensor_addr);
				$('#label_temp').removeClass('label-success').addClass('label-danger');
			}
		}
		
		// HUMIDITY
		
		if (topic_parts[topic_parts.length - 1] == 'humidity') {
		
			$('#HumValueLabel').text(msg.payloadString + '%');
			$('#HumValueLabel').removeClass('').addClass('label-default');

			TempValue.push(parseInt(msg.payloadString));
			if (TempValue.length >= 20) {
				TempValue.shift();
			}

			$('#HumValueChart').sparkline(TempValue, {
				type: 'line',
				width: '180',
				height: '40'
			});
			
			humGauge.setValue(msg.payloadString);
			
		// } else {
			
			if (msg.payloadString == '1') {
				$('#label_hum').text(sensor_addr);
				$('#label_hum').removeClass('label-danger').addClass('label-success');
			} else {
				$('#label_hum').text(sensor_addr);
				$('#label_hum').removeClass('label-success').addClass('label-danger');
			}
		}
	};


	var options = {
			timeout: 3,
			onSuccess: function () {
					$('#message').html('Connected to ' + websocketserver + ':' + websocketport);
					// Connection succeeded; subscribe to our topic
					client.subscribe(topic, {qos: 0});
					client.subscribe(ledtopic, {qos: 0});
					// $('#topic').val(topic);

					humGauge.setLedColor(steelseries.LedColor.GREEN_LED); 
					//change status LED to GREEN on broker connection
					
					tempGauge.setLedColor(steelseries.LedColor.GREEN_LED); 
					//change status LED to GREEN on broker connection

			},
			onFailure: function (message) {
					$('#message').html("Connection failed: " + message.errorMessage);

					humGauge.setLedColor(steelseries.LedColor.RED_LED); 
					//change status LED to RED on broker disconnection

					tempGauge.setLedColor(steelseries.LedColor.RED_LED); 
					//change status LED to RED on broker disconnection

			}
	};

	function init() {
			/* Connect to MQTT broker */
			client.connect(options);

			tempGauge = new steelseries.Radial('gaugeCanvas', {
					gaugeType: steelseries.GaugeType.TYPE4,
					minValue:-10,
					maxValue:80,
					size: 250,
					frameDesign: steelseries.FrameDesign.STEEL,
					knobStyle: steelseries.KnobStyle.STEEL,
					pointerType: steelseries.PointerType.TYPE6,
					lcdDecimals: 0,
					section: null,
					area: null,
					titleString: 'Temperature',
					unitString: 'C',
					threshold: 0,
					lcdVisible: true,
					lcdDecimals: 2
			   });
			tempGauge.setValue(''); //gives a blank display 'NaN' until broker has connected
			tempGauge.setLedColor(steelseries.LedColor.RED_LED); //set the LED RED until connected
			
			humGauge = new steelseries.Radial('humGaugeCanvas', {
					gaugeType: steelseries.GaugeType.TYPE4,
					minValue:0,
					maxValue:100,
					size: 250,
					frameDesign: steelseries.FrameDesign.STEEL,
					knobStyle: steelseries.KnobStyle.STEEL,
					pointerType: steelseries.PointerType.TYPE6,
					lcdDecimals: 0,
					section: null,
					area: null,
					titleString: 'Humidity',
					unitString: '%',
					threshold: 0,
					lcdVisible: true,
					lcdDecimals: 2
			   });
			humGauge.setValue(''); //gives a blank display 'NaN' until broker has connected
			humGauge.setLedColor(steelseries.LedColor.RED_LED); //set the LED RED until connected
	}

	$(document).ready(function() {
		 
		 init();
			

	});

		// OBS USAR PROTOTIPO DE FUNÇÃO (OBJETO) PARA A FUNÇÃO TOGGLE
		
		// Provides the button logic that toggles our display LED on and off
		// Triggered by pressing the HTML button "status_button"	
		 function toggle_led3(){
			if (on_led3){

				message = new Messaging.Message("0");
				message.destinationName = "clients/arduino/led3";
				client.send(message);
			}
			else {
		
				message = new Messaging.Message("1");
				message.destinationName = "clients/arduino/led3";
				client.send(message);	
			}
		}
		
		// Provides the button logic that toggles our display LED on and off
		// Triggered by pressing the HTML button "status_button"	
		 function toggle_led4(){
			if (on_led4){

				message = new Messaging.Message("0");
				message.destinationName = "clients/arduino/led4";
				client.send(message);	
			}				
			else {
		
				message = new Messaging.Message("1");
				message.destinationName = "clients/arduino/led4";
				client.send(message);
			}
		}
	
		// Provides the button logic that toggles our display LED on and off
		// Triggered by pressing the HTML button "status_button"	
		 function toggle_led5(){
			if (on_led5){

				message = new Messaging.Message("0");
				message.destinationName = "clients/arduino/led5";
				client.send(message);	
			}
			else {
		
				message = new Messaging.Message("1");
				message.destinationName = "clients/arduino/led5";
				client.send(message);				
			}
		}
		

