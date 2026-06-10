<script lang="ts">
	import MermaidDiagram from './MermaidDiagram.svelte';

	const chart = `
        flowchart LR
            Start[Start System] --> Calibrate[Calibrate Sensors]
            Calibrate --> Wait[Wait for Laser Shot]
            Wait --> Detect[Detect Sensor Input]
            Detect --> Process[Calculate Shot Location]
            Process --> Score[Calculate Score]
            Score --> Display[Update Display]
            Display --> Wait
    `;
</script>

<MermaidDiagram title="Software Flowchart Mock Diagram" {chart} />