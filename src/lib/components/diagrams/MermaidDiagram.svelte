<script lang="ts">
	import { onMount } from 'svelte';

	let { title, chart } = $props<{
		title: string;
		chart: string;
	}>();

	let diagramElement: HTMLDivElement;
	let errorMessage = '';

	onMount(async () => {
		try {
			const mermaid = (await import('mermaid')).default;

			mermaid.initialize({
				startOnLoad: false,
				theme: 'dark',
				securityLevel: 'strict'
			});

			const id = `mermaid-${Math.random().toString(36).slice(2)}`;
			const { svg } = await mermaid.render(id, chart);

			diagramElement.innerHTML = svg;
		} catch (error) {
			errorMessage = error instanceof Error ? error.message : 'Unable to render diagram.';
		}
	});
</script>

<div class="">
	<h4 class="font-bold text-white">{title}</h4>

	{#if errorMessage}
		<p class="mt-3 text-sm text-red-300">{errorMessage}</p>
	{/if}

	<div bind:this={diagramElement} class="mt-4 overflow-x-auto rounded-lg bg-slate-950 p-4"></div>
</div>