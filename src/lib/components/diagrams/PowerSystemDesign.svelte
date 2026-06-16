<script lang="ts">
	import MermaidDiagram from './MermaidDiagram.svelte';

	const chart = `
flowchart LR

	subgraph INPUT["Charging / Input Power"]
		direction TB
		USB["USB-C Input"]
		Charger["TP4056 Charging Circuit"]
		ChargeLED["Charging Status LED"]
	end

	subgraph BATTERY["Battery + Protection"]
		direction TB
		Battery["Rechargeable LiPo Battery"]
		Protection["Battery Protection"]
		Switch["Hard Power Switch"]
		Monitor["Battery Monitor / Fuel Gauge"]
	end

	subgraph REGULATION["Voltage Regulation"]
		direction TB
		ThreeReg["3.3V Regulator"]
		FiveReg["5V Regulator"]
		ThreeRail["3.3V Power Rail"]
		FiveRail["5V Power Rail"]
		Ground["Common Ground Plane"]
	end

	subgraph LOGIC["3.3V Logic Loads"]
		direction TB
		MCU["ESP32 Control Hardware"]
		Mux["MUX / I/O Expansion"]
		Sensors["Phototransistor Array"]
		Storage["SD Card Storage"]
		Ambient["Ambient Light Sensor"]
	end

	subgraph FEEDBACK["5V Display / Feedback Loads"]
		direction TB
		Display["TFT / LCD Display"]
		LEDs["LED Feedback Array"]
	end

	subgraph SAFETY["Testing / Safety Checks"]
		direction TB
		TestPoints["Voltage Test Points"]
		LowBattery["Low Battery Warning"]
		PowerFault["Power Fault / Brownout Check"]
	end

	USB --> Charger
	Charger --> Battery
	Charger --> ChargeLED

	Battery --> Protection
	Protection --> Switch
	Switch --> ThreeReg
	Switch --> FiveReg
	Battery --> Monitor

	ThreeReg --> ThreeRail
	FiveReg --> FiveRail

	ThreeRail ==> MCU
	ThreeRail ==> Mux
	ThreeRail ==> Sensors
	ThreeRail ==> Storage
	ThreeRail ==> Ambient

	FiveRail ==> Display
	FiveRail ==> LEDs

	Ground ==> MCU
	Ground ==> Mux
	Ground ==> Sensors
	Ground ==> Storage
	Ground ==> Display
	Ground ==> LEDs

	Monitor -. battery data .-> MCU
	MCU -. display battery level .-> Display
	MCU -. controls warning .-> LowBattery

	ThreeRail -. measured at .-> TestPoints
	FiveRail -. measured at .-> TestPoints
	TestPoints -. verifies .-> PowerFault
	PowerFault -. protects system .-> MCU

	class USB,Charger,ChargeLED inputNode;
	class Battery,Protection,Switch,Monitor routingNode;
	class ThreeReg,FiveReg,ThreeRail,FiveRail,Ground powerNode;
	class MCU,Mux,Sensors,Storage,Ambient controlNode;
	class Display,LEDs buildNode;
	class TestPoints,LowBattery,PowerFault safetyNode;

	class INPUT inputGroup;
	class BATTERY routingGroup;
	class REGULATION powerGroup;
	class LOGIC controlGroup;
	class FEEDBACK buildGroup;
	class SAFETY safetyGroup;
`;
</script>

<MermaidDiagram title="Power System Diagram" {chart} />
