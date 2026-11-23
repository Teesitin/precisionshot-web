<script lang="ts">
    import MermaidDiagram from '$lib/components/MermaidDiagram.svelte';
    import ObjModelViewer from '$lib/components/ObjModelViewer.svelte';
    import EnclosureParts from '$lib/components/EnclosureParts.svelte';
    import { flowcharts } from '$lib/flowcharts';
    import { enclosureDownload } from '$lib/models';
    const names = ['System architecture', 'Software', 'Hardware', 'PCB design', 'Mechanical'];
</script>

<section id="design" class="section page-width engineering-section">
    <div class="section-heading"><h2>Engineering.</h2><a class="text-link" href={enclosureDownload.href} download={enclosureDownload.filename}>Download CAD · 16 MB</a></div>
    <div id="models"><ObjModelViewer /></div>
    <EnclosureParts />
    <div class="diagram-grid" id="architecture">{#each flowcharts as diagram, index}<div class="diagram-panel"><MermaidDiagram title={names[index]} chart={diagram.chart} /></div>{/each}</div>
</section>
