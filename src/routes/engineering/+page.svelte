<script lang="ts">
	import MermaidDiagram from '$lib/components/MermaidDiagram.svelte';
	import ObjModelViewer from '$lib/components/ObjModelViewer.svelte';
	import { flowcharts } from '$lib/flowcharts';
	import { enclosureDownload } from '$lib/models';
	import EnclosureParts from '$lib/components/EnclosureParts.svelte';
	const names = ['System architecture', 'Software', 'Hardware', 'PCB design', 'Mechanical'];
</script>

<svelte:head><title>Inside the engineering — PrecisionShot</title><meta name="description" content="Explore the PrecisionShot system architecture, custom PCB designs, mechanical assembly, and interactive CAD models." /></svelte:head>

<main id="main" class="engineering-page page-width">
	<div class="engineering-page-heading"><a class="text-link" href="/#design">Back to the project</a><p class="eyebrow">Inside PrecisionShot</p><h1>Inside the build.</h1><p>The enclosure, electronics, and system architecture.</p></div>
	<div class="engineering-gallery"><figure><img src="/images/showcase/main-board.webp" width="1200" height="725" alt="PrecisionShot Main Board V4 PCB rendering." /><figcaption>Main Board V4 · ESP32-S3 processing & interfaces</figcaption></figure><figure><img src="/images/showcase/enclosure-v8-exploded.webp" width="1400" height="1000" alt="Exploded view of the ten PrecisionShot V8 enclosure parts." /><figcaption>Enclosure V8 · Exploded CAD assembly</figcaption></figure></div>
    <section class="engineering-detail" aria-labelledby="cad-heading">
        <div class="section-heading"><div><p class="eyebrow">Enclosure V8 · November 2026</p><h2 id="cad-heading">Enclosure V8.</h2></div><a class="text-link" href={enclosureDownload.href} download={enclosureDownload.filename}>Download V8 CAD · 16 MB</a></div>
        <ObjModelViewer />
        <EnclosureParts />
    </section>
    <section class="engineering-detail" aria-labelledby="architecture-heading">
        <div class="section-heading"><div><p class="eyebrow">System design</p><h2 id="architecture-heading">The architecture.</h2></div><p>Every diagram, ready to explore.</p></div>
        <div class="diagram-grid">{#each flowcharts as diagram, index}<div class="diagram-panel"><MermaidDiagram title={names[index]} chart={diagram.chart} /></div>{/each}</div>
    </section>
	<div class="engineering-bottom"><h2>Read the full engineering story.</h2><a class="button" href="/#documents">Reports & documentation</a></div>
</main>
