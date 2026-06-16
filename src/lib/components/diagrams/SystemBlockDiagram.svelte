<script lang="ts">
	import MermaidDiagram from './MermaidDiagram.svelte';

	const chart = `
flowchart LR

	subgraph EXT["External / User Side"]
		direction TB
		User["User"]
		Laser["Laser Training Round"]
		Phone["Mobile App"]
	end

	subgraph NICK["Nick - Enclosure / Prototype"]
		direction TB
		Enclosure["3D Printed Enclosure"]
		Faceplate["Faceplate + Honeycomb"]
		Mounting["Mounting + Access Panel"]
	end

	subgraph ANTHONY["Anthony - Hardware / PCB / Power"]
		direction TB
		Power["LiPo Battery + USB-C"]
		Regulators["3.3V / 5V Regulators"]
		Sensors["Phototransistor Array"]
		SensorPCB["Sensor PCB"]
		Mux["MUX / I/O Expansion"]
		ControlHW["ESP32 Control Hardware"]
		Display["TFT / LCD Display"]
		LEDs["LED Feedback Array"]
		Buttons["Physical Buttons"]
		Storage["SD Card Storage"]
	end

	subgraph DELAYNE["DeLayne - Software / App / Logic"]
		direction TB
		Firmware["Embedded Firmware"]
		Detection["Shot Detection + Filtering"]
		Scoring["Scoring + Calibration"]
		Wireless["Wireless Data Flow"]
		Analytics["Training History + Stats"]
	end

	subgraph KENN["Kenn - Specs / Research / Testing"]
		direction TB
		Research["Component Research"]
		Specs["Engineering Specs"]
		Validation["Test Plan + Validation"]
	end

	User --> Laser
	User --> Buttons
	User --> Phone

	Laser --> Faceplate
	Faceplate --> Sensors
	Enclosure -. houses .-> SensorPCB
	Enclosure -. supports .-> ControlHW
	Mounting -. aligns .-> Faceplate

	Power --> Regulators
	Regulators ==> SensorPCB
	Regulators ==> ControlHW
	Regulators ==> Display

	Sensors --> SensorPCB
	SensorPCB --> Mux
	Mux --> ControlHW
	Buttons --> ControlHW
	ControlHW --> Display
	ControlHW --> LEDs
	ControlHW <--> Storage

	ControlHW --> Firmware
	Firmware --> Detection
	Detection --> Scoring
	Scoring --> Display
	Scoring --> LEDs
	Scoring --> Storage
	Scoring --> Wireless
	Wireless -. Wi-Fi / Bluetooth .-> Phone
	Phone --> Analytics

	Research -. informs .-> Sensors
	Research -. informs .-> ControlHW
	Specs -. defines .-> Validation
	Validation -. verifies .-> Detection
	Validation -. verifies .-> Wireless
	Validation -. verifies .-> Analytics

	class User,Laser,Phone externalNode;
	class Enclosure,Faceplate,Mounting nickNode;
	class Power,Regulators,Sensors,SensorPCB,Mux,ControlHW,Display,LEDs,Buttons,Storage anthonyNode;
	class Firmware,Detection,Scoring,Wireless,Analytics delayneNode;
	class Research,Specs,Validation kennNode;

	class EXT externalGroup;
	class NICK nickGroup;
	class ANTHONY anthonyGroup;
	class DELAYNE delayneGroup;
	class KENN kennGroup;
`;
</script>

<MermaidDiagram title="System Block Diagram" {chart} />
