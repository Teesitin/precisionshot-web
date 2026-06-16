<script lang="ts">
	import { onMount, tick } from 'svelte';

	let { title, chart } = $props<{
		title: string;
		chart: string;
	}>();

	type ViewBox = {
		x: number;
		y: number;
		width: number;
		height: number;
	};

	let svgMarkup = $state('');
	let errorMessage = $state('');
	let isDark = $state(true);
	let isZoomOpen = $state(false);
	let mermaidInstance = $state<any>(null);
	let viewerElement = $state<HTMLDivElement | null>(null);

	let zoom = $state(1);
	let isDragging = $state(false);

	let originalViewBox: ViewBox | null = null;
	let currentViewBox = $state<ViewBox | null>(null);
	let dragStartX = 0;
	let dragStartY = 0;
	let dragStartViewBox: ViewBox | null = null;
	let renderCount = 0;

	const minZoom = 0.25;
	const maxZoom = 80;

	onMount(() => {
		isDark = document.documentElement.classList.contains('dark');

		const observer = new MutationObserver(() => {
			const nextTheme = document.documentElement.classList.contains('dark');

			if (nextTheme !== isDark) {
				isDark = nextTheme;
			}
		});

		observer.observe(document.documentElement, {
			attributes: true,
			attributeFilter: ['class']
		});

		async function loadMermaid() {
			try {
				mermaidInstance = (await import('mermaid')).default;
			} catch (error) {
				errorMessage = error instanceof Error ? error.message : 'Unable to load Mermaid.';
			}
		}

		loadMermaid();

		return () => {
			observer.disconnect();
		};
	});

	$effect(() => {
		if (!mermaidInstance || !chart) return;

		const currentRender = ++renderCount;

		errorMessage = '';
		svgMarkup = '';

		mermaidInstance.initialize({
			startOnLoad: false,
			theme: isDark ? 'dark' : 'default',
			securityLevel: 'strict'
		});

		const id = `mermaid-${Math.random().toString(36).slice(2)}`;

		mermaidInstance.render(id, chart)
			.then(({ svg }: { svg: string }) => {
				if (currentRender !== renderCount) return;

				svgMarkup = svg;
			})
			.catch((error: unknown) => {
				if (currentRender !== renderCount) return;

				errorMessage = error instanceof Error ? error.message : 'Unable to render diagram.';
				svgMarkup = '';
			});
	});

	$effect(() => {
		if (typeof document === 'undefined') return;

		const originalOverflow = document.body.style.overflow;

		if (isZoomOpen) {
			document.body.style.overflow = 'hidden';
		}

		return () => {
			document.body.style.overflow = originalOverflow;
		};
	});

	$effect(() => {
		if (!isZoomOpen || !svgMarkup) return;

		tick().then(() => {
			resetViewerViewBox();
		});
	});

	async function openZoom() {
		if (!svgMarkup) return;

		isZoomOpen = true;
		isDragging = false;

		await tick();

		resetViewerViewBox();
	}

	function closeZoom() {
		isZoomOpen = false;
		isDragging = false;
	}

	function getViewerSvg() {
		return viewerElement?.querySelector('svg') as SVGSVGElement | null;
	}

	function parseViewBox(svg: SVGSVGElement): ViewBox | null {
		const viewBox = svg.getAttribute('viewBox');

		if (viewBox) {
			const values = viewBox.split(/\s+/).map(Number);

			if (values.length === 4 && values.every((value) => !Number.isNaN(value))) {
				const padding = 80;

				return {
					x: values[0] - padding,
					y: values[1] - padding,
					width: values[2] + padding * 2,
					height: values[3] + padding * 2
				};
			}
		}

		try {
			const box = svg.getBBox();
			const padding = 80;

			return {
				x: box.x - padding,
				y: box.y - padding,
				width: box.width + padding * 2,
				height: box.height + padding * 2
			};
		} catch {
			return null;
		}
	}

	function setSvgViewBox(nextViewBox: ViewBox) {
		const svg = getViewerSvg();

		if (!svg || !originalViewBox) return;

		svg.setAttribute('viewBox', `${nextViewBox.x} ${nextViewBox.y} ${nextViewBox.width} ${nextViewBox.height}`);

		currentViewBox = nextViewBox;
		zoom = originalViewBox.width / nextViewBox.width;
	}

	function resetViewerViewBox() {
		const svg = getViewerSvg();

		if (!svg) return;

		const parsedViewBox = parseViewBox(svg);

		if (!parsedViewBox) return;

		originalViewBox = parsedViewBox;
		setSvgViewBox(parsedViewBox);
		zoom = 1;
	}

	function clampZoom(value: number) {
		return Math.min(maxZoom, Math.max(minZoom, value));
	}

	function getSvgPoint(event: WheelEvent) {
		const svg = getViewerSvg();

		if (!svg) return null;

		const point = svg.createSVGPoint();
		const matrix = svg.getScreenCTM();

		if (!matrix) return null;

		point.x = event.clientX;
		point.y = event.clientY;

		return point.matrixTransform(matrix.inverse());
	}

	function zoomAt(multiplier: number, centerX?: number, centerY?: number) {
		if (!currentViewBox || !originalViewBox) return;

		const nextZoom = clampZoom(zoom * multiplier);
		const actualMultiplier = nextZoom / zoom;

		if (actualMultiplier === 1) return;

		const x = centerX ?? currentViewBox.x + currentViewBox.width / 2;
		const y = centerY ?? currentViewBox.y + currentViewBox.height / 2;
		const nextWidth = currentViewBox.width / actualMultiplier;
		const nextHeight = currentViewBox.height / actualMultiplier;
		const nextX = x - (x - currentViewBox.x) / actualMultiplier;
		const nextY = y - (y - currentViewBox.y) / actualMultiplier;

		setSvgViewBox({
			x: nextX,
			y: nextY,
			width: nextWidth,
			height: nextHeight
		});
	}

	function zoomBy(multiplier: number) {
		zoomAt(multiplier);
	}

	function resetZoom() {
		resetViewerViewBox();
	}

	function handleWheel(event: WheelEvent) {
		if (!isZoomOpen) return;

		event.preventDefault();

		const point = getSvgPoint(event);
		const multiplier = Math.exp(-event.deltaY * 0.002);

		zoomAt(multiplier, point?.x, point?.y);
	}

	function handlePointerDown(event: PointerEvent) {
		if (!currentViewBox) return;

		isDragging = true;
		dragStartX = event.clientX;
		dragStartY = event.clientY;
		dragStartViewBox = { ...currentViewBox };

		if (event.currentTarget instanceof HTMLElement) {
			event.currentTarget.setPointerCapture(event.pointerId);
		}
	}

	function handlePointerMove(event: PointerEvent) {
		const svg = getViewerSvg();

		if (!isDragging || !dragStartViewBox || !svg) return;

		const rect = svg.getBoundingClientRect();
		const deltaX = ((event.clientX - dragStartX) * dragStartViewBox.width) / rect.width;
		const deltaY = ((event.clientY - dragStartY) * dragStartViewBox.height) / rect.height;

		setSvgViewBox({
			x: dragStartViewBox.x - deltaX,
			y: dragStartViewBox.y - deltaY,
			width: dragStartViewBox.width,
			height: dragStartViewBox.height
		});
	}

	function handlePointerUp(event: PointerEvent) {
		isDragging = false;

		if (event.currentTarget instanceof HTMLElement) {
			event.currentTarget.releasePointerCapture(event.pointerId);
		}
	}

	function handleKeydown(event: KeyboardEvent) {
		if (!isZoomOpen) return;

		if (event.key === 'Escape') {
			closeZoom();
		}
	}

	function handleCanvasKeydown(event: KeyboardEvent) {
		if (!currentViewBox) return;

		const moveAmountX = currentViewBox.width * 0.06;
		const moveAmountY = currentViewBox.height * 0.06;

		if (event.key === '+') {
			event.preventDefault();
			zoomBy(1.25);
		}

		if (event.key === '-' || event.key === '_') {
			event.preventDefault();
			zoomBy(0.8);
		}

		if (event.key === '0') {
			event.preventDefault();
			resetZoom();
		}

		if (event.key === 'ArrowLeft') {
			event.preventDefault();
			setSvgViewBox({ ...currentViewBox, x: currentViewBox.x - moveAmountX });
		}

		if (event.key === 'ArrowRight') {
			event.preventDefault();
			setSvgViewBox({ ...currentViewBox, x: currentViewBox.x + moveAmountX });
		}

		if (event.key === 'ArrowUp') {
			event.preventDefault();
			setSvgViewBox({ ...currentViewBox, y: currentViewBox.y - moveAmountY });
		}

		if (event.key === 'ArrowDown') {
			event.preventDefault();
			setSvgViewBox({ ...currentViewBox, y: currentViewBox.y + moveAmountY });
		}
	}
</script>

<svelte:window onkeydown={handleKeydown} />

<div>
	<h4 class="font-bold text-slate-950 dark:text-white">{title}</h4>

	{#if errorMessage}
		<p class="mt-3 text-sm text-red-600 dark:text-red-300">{errorMessage}</p>
	{/if}

	<div class="relative mt-4 overflow-hidden rounded-lg border border-slate-200 bg-white transition-colors dark:border-slate-800 dark:bg-slate-950">
		<div class="overflow-x-auto p-4 [&_svg]:mx-auto [&_svg]:h-auto [&_svg]:max-w-full">
			{#if svgMarkup}
				{@html svgMarkup}
			{:else if !errorMessage}
				<p class="text-sm text-slate-500 dark:text-slate-400">Rendering diagram...</p>
			{/if}
		</div>

		<button type="button" onclick={openZoom} disabled={!svgMarkup} aria-label="Open fullscreen diagram" class="absolute bottom-3 left-3 grid size-9 place-items-center rounded-full border border-slate-300 bg-white/90 text-slate-700 shadow-lg backdrop-blur transition hover:border-accent hover:text-accent disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:bg-slate-900/90 dark:text-slate-200">
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" class="size-5 fill-current">
				<path d="M120-120v-240h80v104l124-124 56 56-124 124h104v80H120Zm480 0v-80h104L580-324l56-56 124 124v-104h80v240H600ZM324-580 200-704v104h-80v-240h240v80H256l124 124-56 56Zm312 0-56-56 124-124H600v-80h240v240h-80v-104L636-580Z" />
			</svg>
		</button>
	</div>

	{#if isZoomOpen}
		<div class="fixed inset-0 z-100 p-4">
			<button type="button" onclick={closeZoom} aria-label="Close diagram viewer backdrop" class="absolute inset-0 bg-slate-900/40 backdrop-blur dark:bg-slate-950/70"></button>

			<div class="relative z-10 flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white/80 shadow-2xl backdrop-blur transition-colors dark:border-slate-700 dark:bg-slate-950/80">
				<div class="flex items-center justify-between gap-4 border-b border-slate-200 px-4 py-3 dark:border-slate-800">
					<div>
						<p class="text-xs font-bold uppercase tracking-widest text-accent">Diagram Viewer</p>
						<h3 class="font-bold text-slate-950 dark:text-white">{title}</h3>
					</div>

					<button type="button" onclick={closeZoom} aria-label="Close fullscreen diagram" class="grid size-10 place-items-center rounded-full border border-slate-300 bg-white text-slate-700 shadow-sm transition hover:border-accent hover:text-accent dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" class="size-6 fill-current">
							<path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
						</svg>
					</button>
				</div>

				<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
				<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
				<div bind:this={viewerElement} onwheel={handleWheel} onpointerdown={handlePointerDown} onpointermove={handlePointerMove} onpointerup={handlePointerUp} onpointercancel={handlePointerUp} onkeydown={handleCanvasKeydown} role="application" tabindex="0" aria-label="Zoomable diagram canvas" class="relative flex flex-1 touch-none select-none items-center justify-center overflow-hidden bg-slate-100 cursor-grab outline-none active:cursor-grabbing dark:bg-slate-950 [&_svg]:overflow-visible [&_svg_*]:overflow-visible">
					<div class="h-full w-full overflow-visible p-6 **:overflow-visible [&_svg]:h-full [&_svg]:w-full [&_svg]:max-w-none [&_svg]:overflow-visible">
						{@html svgMarkup}
					</div>

					<!-- <div class="absolute bottom-4 left-4 flex items-center gap-2 rounded-full border border-slate-200 bg-white/90 p-2 shadow-lg backdrop-blur dark:border-slate-700 dark:bg-slate-900/90">
						<button type="button" onclick={() => zoomBy(0.8)} class="grid size-9 place-items-center rounded-full bg-slate-100 text-lg font-bold text-slate-700 transition hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700">−</button>
						<p class="min-w-16 text-center text-sm font-bold text-slate-700 dark:text-slate-200">{Math.round(zoom * 100)}%</p>
						<button type="button" onclick={() => zoomBy(1.25)} class="grid size-9 place-items-center rounded-full bg-slate-100 text-lg font-bold text-slate-700 transition hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700">+</button>
						<button type="button" onclick={resetZoom} class="rounded-full bg-accent px-4 py-2 text-sm font-bold text-slate-950 transition hover:bg-accent/80">Reset</button>
					</div> -->

					<p class="absolute bottom-4 right-4 rounded-full border border-slate-200 bg-white/90 px-4 py-2 text-xs font-bold text-slate-500 shadow-lg backdrop-blur dark:border-slate-700 dark:bg-slate-900/90 dark:text-slate-400">Scroll / pinch to zoom • drag to move • Esc to close</p>
				</div>
			</div>
		</div>
	{/if}
</div>