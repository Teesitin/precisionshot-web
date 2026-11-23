<script lang="ts">
	import MermaidDiagram from '$lib/components/MermaidDiagram.svelte';
	import ObjModelViewer from '$lib/components/ObjModelViewer.svelte';
	import { flowcharts } from '$lib/flowcharts';
	import { enclosureDownload } from '$lib/models';
	let selected = $state(0);
	let showModels = $state(false);
	const names = ['System architecture', 'Software', 'Hardware', 'PCB design', 'Mechanical'];
</script>

<svelte:head><title>Inside the engineering — PrecisionShot</title><meta name="description" content="Explore the PrecisionShot system architecture, custom PCB designs, mechanical assembly, and interactive CAD models." /></svelte:head>

<main id="main" class="engineering-page page-width">
	<div class="engineering-page-heading"><a class="text-link" href="/#design">Back to the project</a><p class="eyebrow">Inside PrecisionShot</p><h1>Built as a system.<br />Engineered in layers.</h1><p>Optics, electronics, firmware, and a companion app.<br />Explore how the parts work together.</p></div>
	<div class="engineering-gallery"><figure><img src="/images/showcase/main-board.webp" width="1200" height="725" alt="PrecisionShot Main Board V4 PCB rendering." /><figcaption>Main Board V4 · ESP32-S3 processing & interfaces</figcaption></figure><figure><img src="/images/showcase/enclosure-v8-exploded.webp" width="1400" height="1000" alt="Exploded view of the ten PrecisionShot V8 enclosure parts." /><figcaption>Enclosure V8 · Exploded CAD assembly</figcaption></figure></div>
	<section class="engineering-detail" aria-labelledby="architecture-heading"><div class="section-heading"><div><p class="eyebrow">System design</p><h2 id="architecture-heading">The architecture.</h2></div><p>Choose a view. Open any diagram<br />to zoom and explore.</p></div><div class="diagram-tabs" role="group" aria-label="Engineering diagram">{#each names as name, index}<button class:active={selected === index} aria-pressed={selected === index} onclick={() => selected = index}>{name}</button>{/each}</div><div class="diagram-panel">{#key selected}<MermaidDiagram title={names[selected]} chart={flowcharts[selected].chart} />{/key}</div></section>
	<section class="engineering-detail" aria-labelledby="cad-heading"><div class="section-heading"><div><p class="eyebrow">Enclosure V8 · November 2026</p><h2 id="cad-heading">Explore in three dimensions.</h2></div><p>The full assembly. Every part.<br />Rotate, zoom, and inspect.</p></div><p class="engineering-description">Explore the V8 enclosure and its ten individual parts, alongside the main, sensor, and regulator boards.</p><div class="cad-actions"><button class="button" onclick={() => showModels = !showModels} aria-expanded={showModels} aria-controls="interactive-models">{showModels ? 'Close interactive models' : 'Load interactive models'}</button><a class="button button-quiet" href={enclosureDownload.href} download={enclosureDownload.filename}>Download V8 CAD · 16 MB</a></div><div id="interactive-models">{#if showModels}<ObjModelViewer />{/if}</div></section>
	<div class="engineering-bottom"><h2>Read the full engineering story.</h2><a class="button" href="/#documents">Reports & documentation</a></div>
</main>
