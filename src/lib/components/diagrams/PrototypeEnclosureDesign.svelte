<script lang="ts">
	import MermaidDiagram from './MermaidDiagram.svelte';

	const chart = `
flowchart LR

	subgraph FACE["Front Faceplate"]
		direction TB
		OuterShell["3D Printed Front Shell"]
		DisplayWindow["LCD Display Window"]
		ButtonCutouts["Button Cutouts"]
		Honeycomb["Honeycomb Sensor Openings"]
	end

	subgraph OPTICAL["Optical Isolation"]
		direction TB
		TargetGraphic["Visible Target Pattern"]
		SensorTunnels["Recessed Sensor Tunnels"]
		AmbientShield["Ambient Light Shielding"]
	end

	subgraph SENSOR["Sensor + PCB Mounting"]
		direction TB
		Sensors["Phototransistor Array"]
		MainPCB["Main Sensor PCB"]
		Standoffs["Nylon Standoffs"]
		Alignment["Sensor-to-Opening Alignment"]
	end

	subgraph UI["Control Panel"]
		direction TB
		Display["TFT / LCD Display"]
		Buttons["Mode / Reset / Calibration Buttons"]
		PowerSwitch["Hard Power Switch"]
		ChargingPort["USB-C Charging Port"]
	end

	subgraph REAR["Rear Housing"]
		direction TB
		BackPanel["Removable Back Panel"]
		BatteryAccess["Battery Access Area"]
		InternalRibs["Internal Support Ribs"]
		Vents["Rear Ventilation Slots"]
	end

	subgraph MOUNT["Mounting + Assembly"]
		direction TB
		WallMount["Wall Mount Keyholes"]
		StandMount["Stand / Tripod Option"]
		Screws["Screws / Inserts"]
		ServiceAccess["Service and Debug Access"]
	end

	OuterShell --> Honeycomb
	OuterShell --> DisplayWindow
	OuterShell --> ButtonCutouts

	TargetGraphic --> Honeycomb
	Honeycomb --> SensorTunnels
	SensorTunnels --> AmbientShield
	AmbientShield --> Sensors

	Sensors --> MainPCB
	MainPCB --> Alignment
	Alignment --> Standoffs
	Standoffs --> OuterShell

	DisplayWindow --> Display
	ButtonCutouts --> Buttons
	PowerSwitch --> MainPCB
	ChargingPort --> MainPCB
	Display --> MainPCB
	Buttons --> MainPCB

	MainPCB --> InternalRibs
	InternalRibs --> BackPanel
	BackPanel --> BatteryAccess
	BackPanel --> Vents

	BackPanel --> WallMount
	BackPanel --> StandMount
	Screws --> BackPanel
	Screws --> Standoffs
	ServiceAccess --> BackPanel
	ServiceAccess --> MainPCB

	class OuterShell,DisplayWindow,ButtonCutouts,Honeycomb inputNode;
	class TargetGraphic,SensorTunnels,AmbientShield routingNode;
	class Sensors,MainPCB,Standoffs,Alignment powerNode;
	class Display,Buttons,PowerSwitch,ChargingPort controlNode;
	class BackPanel,BatteryAccess,InternalRibs,Vents buildNode;
	class WallMount,StandMount,Screws,ServiceAccess safetyNode;

	class FACE inputGroup;
	class OPTICAL routingGroup;
	class SENSOR powerGroup;
	class UI controlGroup;
	class REAR buildGroup;
	class MOUNT safetyGroup;
`;
</script>

<MermaidDiagram title="Prototype and Enclosure Design" {chart} />
