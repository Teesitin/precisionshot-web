<script lang="ts">
	import MermaidDiagram from './MermaidDiagram.svelte';

	const chart = `
        flowchart LR

        %% Ownership Colors:
        %% DeLayne = Blue
        %% Anthony = Orange
        %% Kenn = Purple
        %% Nick = Green
        %% External = Gray

        subgraph EXT["External Inputs / User Side"]
            direction TB
            Laser["Laser Training Round"]
            Phone["Mobile App"]
            User["User"]
        end

        subgraph NICK["Nick - Enclosure / Prototype"]
            direction TB
            Enclosure["3D Printed Enclosure"]
            Faceplate["Faceplate + Honeycomb Openings"]
            Mounting["Mounting + Access Panel"]
        end

        subgraph ANTHONY["Anthony - Hardware / PCB / Power"]
            direction TB
            Power["LiPo Battery + USB-C Charging"]
            Regulators["3.3V / 5V Regulators"]
            SensorPCB["Sensor PCB"]
            Sensors["Phototransistor Array"]
            Mux["MUX / I/O Expansion"]
            LEDs["LED Feedback Array"]
            ControlHW["ESP32 Control Hardware"]
            Display["TFT / LCD Display"]
            Buttons["Physical Buttons"]
            Storage["SD Card Storage"]
        end

        subgraph DELAYNE["DeLayne - Software / App / Logic"]
            direction TB
            Firmware["Embedded Firmware"]
            Detection["Shot Detection + Filtering"]
            Scoring["Scoring + Calibration"]
            Wireless["Wireless Data Flow"]
            Analytics["App Stats + Training History"]
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
        Regulators ==> Sensors
        Regulators ==> Mux
        Regulators ==> ControlHW
        Regulators ==> LEDs
        Regulators ==> Display
        Regulators ==> Storage

        Sensors --> SensorPCB
        SensorPCB --> Mux
        Mux --> ControlHW
        ControlHW --> LEDs
        ControlHW --> Display
        Buttons --> ControlHW
        Storage <--> ControlHW

        ControlHW --> Firmware
        Firmware --> Detection
        Detection --> Scoring
        Scoring --> Display
        Scoring --> LEDs
        Scoring --> Storage
        Scoring --> Wireless
        Wireless -. Wi-Fi / Bluetooth .-> Phone
        Phone --> Analytics

        Research -. informs .-> SensorPCB
        Research -. informs .-> Regulators
        Research -. informs .-> ControlHW
        Specs -. defines .-> Validation
        Validation -. verifies .-> Sensors
        Validation -. verifies .-> Detection
        Validation -. verifies .-> Wireless
        Validation -. verifies .-> Analytics

        classDef delayne fill:#D6EAF8,stroke:#2874A6,color:#000,stroke-width:2px;
        classDef anthony fill:#FAD7A0,stroke:#B9770E,color:#000,stroke-width:2px;
        classDef kenn fill:#E8DAEF,stroke:#7D3C98,color:#000,stroke-width:2px;
        classDef nick fill:#D5F5E3,stroke:#239B56,color:#000,stroke-width:2px;
        classDef external fill:#EAECEE,stroke:#7F8C8D,color:#000,stroke-width:2px;

        class Firmware,Detection,Scoring,Wireless,Analytics delayne;
        class Power,Regulators,SensorPCB,Sensors,Mux,LEDs,ControlHW,Display,Buttons,Storage anthony;
        class Research,Specs,Validation kenn;
        class Enclosure,Faceplate,Mounting nick;
        class Laser,Phone,User external;
    `;
</script>

<MermaidDiagram title="System Block Diagram" {chart} />