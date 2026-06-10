<script lang="ts">
	import MermaidDiagram from './MermaidDiagram.svelte';

	const chart = `
        flowchart LR
            Faceplate[Front Faceplate] --> Honeycomb[Honeycomb Sensor Openings]
            Honeycomb --> Sensors[Sensor Array]
            Sensors --> PCB[Main PCB]
            PCB --> BackPanel[Removable Back Panel]
            BackPanel --> Mounting[Wall Mount or Stand]
            Display[Display Window] --> Faceplate
            Buttons[User Buttons] --> Faceplate
    `;
</script>

<MermaidDiagram title="Prototype and Enclosure Mock Diagram" {chart} />