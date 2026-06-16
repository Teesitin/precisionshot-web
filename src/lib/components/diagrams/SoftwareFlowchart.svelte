<script lang="ts">
	import MermaidDiagram from './MermaidDiagram.svelte';

	const chart = `
flowchart LR

	subgraph STARTUP["Startup / Configuration"]
		direction TB
		Start["Power On System"]
		InitHW["Initialize Hardware"]
		LoadSettings["Load Saved Settings"]
		CheckBattery{"Battery OK?"}
		Calibrate["Run Sensor Calibration"]
	end

	subgraph INPUT["Sensor Input Loop"]
		direction TB
		Idle["Wait for Laser Shot"]
		ReadSensors["Read Sensor Array"]
		ApplyThreshold["Apply Light Thresholds"]
		ShotDetected{"Shot Detected?"}
	end

	subgraph FILTERING["Detection + Filtering"]
		direction TB
		CapturePulse["Capture Triggered Sensors"]
		RejectNoise["Reject Ambient Light / Noise"]
		ValidatePulse{"Valid Laser Pulse?"}
		MapSensors["Map Sensors to Grid Positions"]
	end

	subgraph PROCESSING["Shot Processing"]
		direction TB
		EstimateLocation["Estimate Shot Location"]
		AverageHits["Average Multi-Sensor Hits"]
		SelectMode["Check Active Training Mode"]
		CalculateScore["Calculate Score / Accuracy"]
	end

	subgraph FEEDBACK["User Feedback + Data Output"]
		direction TB
		UpdateDisplay["Update TFT / LCD Display"]
		UpdateLEDs["Update LED Feedback"]
		SaveSession["Save Shot to Session Data"]
		BuildPacket["Build Wireless Data Packet"]
		SendApp["Send Data to Mobile App"]
		UpdateApp["Update App Stats + History"]
	end

	subgraph ERRORS["Error / Maintenance States"]
		direction TB
		LowBattery["Show Low Battery Warning"]
		Recalibrate["Prompt Recalibration"]
		SensorFault["Flag Sensor Fault"]
	end

	Start --> InitHW
	InitHW --> LoadSettings
	LoadSettings --> CheckBattery
	CheckBattery -- Yes --> Calibrate
	CheckBattery -- No --> LowBattery
	LowBattery --> Idle

	Calibrate --> Idle
	Idle --> ReadSensors
	ReadSensors --> ApplyThreshold
	ApplyThreshold --> ShotDetected

	ShotDetected -- No --> Idle
	ShotDetected -- Yes --> CapturePulse

	CapturePulse --> RejectNoise
	RejectNoise --> ValidatePulse
	ValidatePulse -- No --> Recalibrate
	Recalibrate --> Idle
	ValidatePulse -- Yes --> MapSensors

	MapSensors --> EstimateLocation
	EstimateLocation --> AverageHits
	AverageHits --> SelectMode
	SelectMode --> CalculateScore

	CalculateScore --> UpdateDisplay
	CalculateScore --> UpdateLEDs
	CalculateScore --> SaveSession
	CalculateScore --> BuildPacket

	BuildPacket --> SendApp
	SendApp --> UpdateApp
	UpdateApp --> Idle

	ReadSensors -. detects issue .-> SensorFault
	SensorFault -. maintenance .-> Recalibrate

	class Start,InitHW,LoadSettings,CheckBattery,Calibrate startupNode;
	class Idle,ReadSensors,ApplyThreshold,ShotDetected inputNode;
	class CapturePulse,RejectNoise,ValidatePulse,MapSensors filteringNode;
	class EstimateLocation,AverageHits,SelectMode,CalculateScore processingNode;
	class UpdateDisplay,UpdateLEDs,SaveSession,BuildPacket,SendApp,UpdateApp feedbackNode;
	class LowBattery,Recalibrate,SensorFault errorNode;

	class STARTUP startupGroup;
	class INPUT inputGroup;
	class FILTERING filteringGroup;
	class PROCESSING processingGroup;
	class FEEDBACK feedbackGroup;
	class ERRORS errorGroup;
`;
</script>

<MermaidDiagram title="Software Flowchart" {chart} />
