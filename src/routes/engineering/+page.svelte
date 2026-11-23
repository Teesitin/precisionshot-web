<script lang="ts">
	import MermaidDiagram from '$lib/components/MermaidDiagram.svelte';
	import ObjModelViewer from '$lib/components/ObjModelViewer.svelte';
	import { flowcharts } from '$lib/flowcharts';
	let selected = $state(0);
	let showModels = $state(false);
	const names = ['System architecture', 'Software', 'Hardware', 'PCB design', 'Mechanical'];
</script>

<svelte:head><title>Inside the engineering — PrecisionShot</title><meta name="description" content="Explore the PrecisionShot system architecture, custom PCB designs, mechanical assembly, and interactive CAD models." /></svelte:head>

<main id="main" class="engineering-page page-width">
	<div class="engineering-page-heading"><a class="text-link" href="/#design">Back to the project</a><p class="eyebrow">Inside PrecisionShot</p><h1>Built as a system.<br />Engineered in layers.</h1><p>Optics, electronics, firmware, and a companion app.<br />Explore how the parts work together.</p></div>
	<div class="engineering-gallery"><figure><img src="/images/showcase/main-board.webp" width="1200" height="725" alt="PrecisionShot Main Board V4 PCB rendering." /><figcaption>Main Board V4 · ESP32-S3 processing & interfaces</figcaption></figure><figure><img src="/images/showcase/sensor-assembly.webp" width="1300" height="798" alt="Exploded view of the optical sensor enclosure assembly." /><figcaption>Sensor enclosure · Modular optical assembly</figcaption></figure></div>
	<section class="engineering-detail" aria-labelledby="architecture-heading"><div class="section-heading"><div><p class="eyebrow">System design</p><h2 id="architecture-heading">The architecture.</h2></div><p>Choose a view. Open any diagram<br />to zoom and explore.</p></div><div class="diagram-tabs" role="group" aria-label="Engineering diagram">{#each names as name, index}<button class:active={selected === index} aria-pressed={selected === index} onclick={() => selected = index}>{name}</button>{/each}</div><div class="diagram-panel">{#key selected}<MermaidDiagram title={names[selected]} chart={flowcharts[selected].chart} />{/key}</div></section>
	<section class="engineering-detail" aria-labelledby="cad-heading"><div class="section-heading"><div><p class="eyebrow">CAD archive · October 2026</p><h2 id="cad-heading">Explore in three dimensions.</h2></div><p>Boards and enclosure parts.<br />Rotate, zoom, and inspect.</p></div><p class="engineering-description">These archived exports include Main Board V4, the sensor and regulator boards, and the V3 enclosure parts.</p><button class="button" onclick={() => showModels = !showModels} aria-expanded={showModels} aria-controls="interactive-models">{showModels ? 'Close interactive models' : 'Load interactive models'}</button><div id="interactive-models">{#if showModels}<ObjModelViewer />{/if}</div></section>
	<div class="engineering-bottom"><h2>Read the full engineering story.</h2><a class="button" href="/#documents">Reports & documentation</a></div>
</main>
