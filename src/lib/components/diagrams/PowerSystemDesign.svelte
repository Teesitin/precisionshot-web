<script lang="ts">
	import MermaidDiagram from './MermaidDiagram.svelte';

	const chart = `
        flowchart LR
            Battery[Rechargeable Battery] --> Switch[Power Switch]
            Switch --> Charger[Charging Circuit]
            Switch --> Regulator[Voltage Regulator]
            Regulator --> MCU[Microcontroller]
            Regulator --> Sensors[Sensor Array]
            Regulator --> Display[LCD Display]
    `;
</script>

<MermaidDiagram title="Power System Mock Diagram" {chart} />