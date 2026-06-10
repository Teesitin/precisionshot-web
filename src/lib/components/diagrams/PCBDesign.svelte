<script lang="ts">
	import MermaidDiagram from './MermaidDiagram.svelte';

	const chart = `
        flowchart LR
            Sensors[Phototransistor Array] --> PCB[Main Sensor PCB]
            PCB --> Traces[Signal Traces]
            Traces --> Connector[Board Connector]
            Connector --> MCU[Microcontroller Board]
            Power[Power Rails] --> PCB
            Ground[Ground Plane] --> PCB
    `;
</script>

<MermaidDiagram title="PCB Design Mock Diagram" {chart} />