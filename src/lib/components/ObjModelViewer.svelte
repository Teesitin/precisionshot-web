<script lang="ts">
	import { onMount } from 'svelte';
	import type { ObjViewer } from '$lib/obj-viewer';

	const models = [
		{ name: 'Main board V4', file: '2026-10-06/Main Board V4', size: '38 MB', zUp: true },
		{ name: 'Sensor board', file: '2026-10-06/Sensor Board', size: '56 MB', zUp: true },
		{ name: '3.3 V / 5 V regulator board', file: '2026-10-06/Regulator Board', size: '4.5 MB', zUp: true },
		{ name: 'Top faceplate V3', file: '2026-10-06/SENIOR DESIGN 2 Faceplate Top V3', size: '0.14 MB', zUp: true },
		{ name: 'Bottom faceplate V3', file: '2026-10-06/SENIOR DESIGN 2 Faceplate Bottom V3', size: '0.24 MB', zUp: true },
		{ name: 'Enclosure container V3', file: '2026-10-06/SENIOR DESIGN 2 Container V3', size: '1.1 MB', zUp: true },
		{ name: 'Diffuser', file: '2026-10-06/SENIOR DESIGN 2 Diffuser', size: '4 KB', zUp: true }
	];
	let selected = $state(0);
	let status = $state<'idle' | 'loading' | 'ready' | 'error'>('idle');
	let canvas = $state<HTMLCanvasElement>();
	let container = $state<HTMLDivElement>();
	let viewer: ObjViewer | undefined;
	let activeRequest: AbortController | undefined;
	let observer: IntersectionObserver | undefined;
	let mounted = false;
	let requestId = 0;
	const current = $derived(models[selected]);
	const controlClass = 'min-h-10 rounded border border-slate-300 bg-white px-3 py-2 text-sm font-bold text-slate-700 transition hover:border-accent disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200';

	onMount(() => {
		mounted = true;
		observer = new IntersectionObserver((entries) => {
			if (entries.some((entry) => entry.isIntersecting)) {
				observer?.disconnect();
				if (status === 'idle') void loadModel();
			}
		}, { rootMargin: '200px' });
		if (container) observer.observe(container);
		return () => {
			mounted = false;
			requestId++;
			observer?.disconnect();
			activeRequest?.abort();
			viewer?.dispose();
		};
	});

	async function loadModel() {
		if (!mounted || !canvas) return;
		observer?.disconnect();
		activeRequest?.abort();
		const request = new AbortController();
		activeRequest = request;
		const id = ++requestId;
		const model = current;
		status = 'loading';
		// Abort stalled requests and ignore results from a previous selection.
		const timeout = setTimeout(() => request.abort(), 90000);
		async function read(extension: string) {
			const path = model.file.split('/').map(encodeURIComponent).join('/');
			const response = await fetch(`/models/${path}.${extension}`, { signal: request.signal });
			if (!response.ok) throw new Error('Model file unavailable');
			return response.text();
		}
		try {
			const [{ createObjViewer }, obj, mtl] = await Promise.all([
				import('$lib/obj-viewer'), read('obj'), read('mtl')
			]);
			if (!mounted || id !== requestId) return;
			if (request.signal.aborted) throw new Error('Model loading timed out');
			viewer ??= createObjViewer(canvas);
			viewer.load(obj, mtl, model.zUp);
			status = 'ready';
		} catch {
			request.abort();
			if (mounted && id === requestId) status = 'error';
		} finally {
			clearTimeout(timeout);
		}
	}

	function handleKeydown(event: KeyboardEvent) {
		if (status !== 'ready' || !viewer) return;
		const actions: Record<string, () => void> = {
			ArrowLeft: () => viewer?.rotate(-0.12, 0), ArrowRight: () => viewer?.rotate(0.12, 0),
			ArrowUp: () => viewer?.rotate(0, -0.12), ArrowDown: () => viewer?.rotate(0, 0.12),
			'+': () => viewer?.zoom(0.8), '=': () => viewer?.zoom(0.8), '-': () => viewer?.zoom(1.25),
			r: () => viewer?.reset(), R: () => viewer?.reset()
		};
		if (actions[event.key]) { event.preventDefault(); actions[event.key](); }
	}
</script>

<div id="design-models" bind:this={container} class="mt-10 scroll-mt-24">
	<h3 class="text-xl font-bold text-slate-950 dark:text-white">3D Models</h3>
	<p id="model-instructions" class="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">Drag to rotate · Scroll or pinch to zoom · Right-drag or use two fingers to move</p>
	<div class="mt-4 overflow-hidden rounded-lg border border-slate-200 dark:border-slate-800">
		<div class="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-950">
			<div class="flex flex-wrap items-center gap-3">
				<label for="obj-model" class="text-sm font-bold text-slate-700 dark:text-slate-300">Model</label>
				<select id="obj-model" class={controlClass} value={selected} onchange={(event) => { selected = Number(event.currentTarget.value); void loadModel(); }}>
					{#each models as model, i}<option value={i}>{model.name}</option>{/each}
				</select>
			</div>
			<div class="flex items-center gap-2">
				<button type="button" class={controlClass} disabled={status !== 'ready'} onclick={() => viewer?.zoom(0.8)} aria-label="Zoom in on model">+</button>
				<button type="button" class={controlClass} disabled={status !== 'ready'} onclick={() => viewer?.zoom(1.25)} aria-label="Zoom out of model">−</button>
				<button type="button" class={controlClass} disabled={status !== 'ready'} onclick={() => viewer?.reset()}>Reset View</button>
			</div>
		</div>
		<div class="relative h-88 bg-slate-50/50 sm:h-120 dark:bg-slate-950" aria-busy={status === 'loading'}>
			<canvas bind:this={canvas} class="block h-full w-full cursor-grab outline-offset-[-3px] focus-visible:outline-2 focus-visible:outline-accent active:cursor-grabbing" tabindex="0" aria-label={`${current.name} 3D viewer. Use arrow keys to rotate, plus or minus to zoom, and R to reset.`} aria-describedby="model-instructions" onkeydown={handleKeydown}>Interactive {current.name} 3D model.</canvas>
			{#if status !== 'ready'}
				<div class="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-slate-50 px-6 text-center dark:bg-slate-950">
					{#if status === 'error'}
						<p role="alert" class="text-sm text-slate-700 dark:text-slate-300">The 3D model couldn’t load. Please try again in a browser with 3D graphics support.</p>
						<button type="button" class={controlClass} onclick={() => void loadModel()}>Try Again</button>
					{:else}
						{#if status === 'loading'}<div aria-hidden="true" class="size-9 animate-spin rounded-full border-4 border-slate-300 border-t-accent motion-reduce:animate-none dark:border-slate-700 dark:border-t-accent"></div>{/if}
						<p role="status" class="text-sm text-slate-600 dark:text-slate-400">{status === 'loading' ? `Loading ${current.name.toLowerCase()}… (${current.size})` : 'The model will load when this viewer is in view.'}</p>
					{/if}
				</div>
			{/if}
		</div>
	</div>
</div>
