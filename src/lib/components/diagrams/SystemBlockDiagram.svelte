<script lang="ts">
	import MermaidDiagram from './MermaidDiagram.svelte';

	const chart = `
        flowchart LR
            Laser[Laser Training Round] --> Sensor[Phototransistor Sensor Array]
            Sensor --> Signal[Signal Processing]
            Signal --> MCU[Microcontroller]
            MCU --> Display[LCD Display]
            MCU --> Buttons[User Buttons]
            Battery[Rechargeable Battery] --> Power[Voltage Regulation]
            Power --> Sensor
            Power --> MCU
            Power --> Display
            MCU --> Feedback[Shot Location and Score Feedback]
    `;
</script>

<MermaidDiagram title="System Block Diagram" {chart} />