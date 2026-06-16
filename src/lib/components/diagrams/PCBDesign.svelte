<script lang="ts">
	import MermaidDiagram from './MermaidDiagram.svelte';

	const chart = `
flowchart LR

	subgraph INPUT["Sensor Input Area"]
		direction TB
		Sensors["Phototransistor Array"]
		SensorPads["Sensor Pads / Footprints"]
		SensorPCB["Main Sensor PCB"]
	end

	subgraph ROUTING["Signal Routing"]
		direction TB
		Traces["Signal Traces"]
		Grouping["Zone / Sensor Group Routing"]
		Connector["Board Connector / Header"]
		TestPoints["Test Points"]
	end

	subgraph CONTROL["Control Interface"]
		direction TB
		Mux["MUX / I/O Expansion"]
		MCU["Microcontroller Board"]
		DisplayIF["Display / UI Connector"]
	end

	subgraph POWER["Power Distribution"]
		direction TB
		Battery["Battery Input"]
		Charging["Charging Circuit"]
		Regulators["Voltage Regulators"]
		PowerRails["3.3V / 5V Power Rails"]
		Ground["Ground Plane"]
	end

	subgraph BUILD["Assembly + Validation"]
		direction TB
		Mounting["Mounting Holes / Standoffs"]
		Labels["Silkscreen Labels"]
		Debug["Debug Access"]
	end

	Sensors --> SensorPads
	SensorPads --> SensorPCB
	SensorPCB --> Traces
	Traces --> Grouping
	Grouping --> Connector
	Grouping --> TestPoints

	Connector --> Mux
	Mux --> MCU
	MCU --> DisplayIF

	Battery --> Charging
	Charging --> Regulators
	Regulators --> PowerRails

	PowerRails ==> SensorPCB
	PowerRails ==> Mux
	PowerRails ==> MCU
	PowerRails ==> DisplayIF

	Ground ==> SensorPCB
	Ground ==> Mux
	Ground ==> MCU

	SensorPCB -. includes .-> Mounting
	SensorPCB -. includes .-> Labels
	TestPoints -. supports .-> Debug
	Debug -. verifies .-> MCU
	Debug -. verifies .-> Grouping

	class Sensors,SensorPads,SensorPCB inputNode;
	class Traces,Grouping,Connector,TestPoints routingNode;
	class Mux,MCU,DisplayIF controlNode;
	class Battery,Charging,Regulators,PowerRails,Ground powerNode;
	class Mounting,Labels,Debug buildNode;

	class INPUT inputGroup;
	class ROUTING routingGroup;
	class CONTROL controlGroup;
	class POWER powerGroup;
	class BUILD buildGroup;
`;
</script>

<MermaidDiagram title="PCB Design Diagram" {chart} />
