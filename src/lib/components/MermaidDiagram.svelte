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
	let isRendering = $state(true);
	let isDark = $state(true);
	let isZoomOpen = $state(false);
	let mermaidInstance = $state<any>(null);
	let diagramElement = $state<HTMLDivElement | null>(null);
	let diagramViewportElement = $state<HTMLDivElement | null>(null);
	let viewerElement = $state<HTMLDivElement | null>(null);
	let shouldOpenFromUrl = false;

	let zoom = $state(1);
	let isDragging = $state(false);
	let diagramMinHeight = $state(360);

	let originalViewBox: ViewBox | null = null;
	let currentViewBox = $state<ViewBox | null>(null);
	let dragStartX = 0;
	let dragStartY = 0;
	let dragStartViewBox: ViewBox | null = null;
	let renderCount = 0;

	const minZoom = 0.25;
	const maxZoom = 80;

	function slugify(value: string) {
		return value
			.normalize('NFKD')
			.replace(/[\u0300-\u036f]/g, '')
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, '-')
			.replace(/^-|-$/g, '');
	}

	function getDeepLinkDetails(chartTitle: string) {
		const titleMatch = chartTitle.match(/^(\d+)\.(\d+)\s+(.+)$/);

		if (!titleMatch) {
			const slug = slugify(chartTitle);

			return {
				figureId: `figure-${slug}`,
				modalSlug: slug
			};
		}

		return {
			figureId: `figure-${Number(titleMatch[1])}-${Number(titleMatch[2])}`,
			modalSlug: slugify(titleMatch[3])
		};
	}

	const deepLinkDetails = $derived(getDeepLinkDetails(title));

	const lightThemeInit = `
%%{init: {
	"theme": "base",
	"flowchart": {
		"curve": "basis",
		"nodeSpacing": 35,
		"rankSpacing": 55
	},
	"themeVariables": {
		"background": "#ffffff",
		"mainBkg": "#ffffff",
		"primaryColor": "#f8fafc",
		"primaryTextColor": "#0f172a",
		"primaryBorderColor": "#cbd5e1",
		"lineColor": "#64748b",
		"fontFamily": "Inter, system-ui, sans-serif",
		"clusterBkg": "#f8fafc",
		"clusterBorder": "#cbd5e1",
		"titleColor": "#0f172a"
	}
}}%%
`;

	const darkThemeInit = `
%%{init: {
	"theme": "base",
	"flowchart": {
		"curve": "basis",
		"nodeSpacing": 35,
		"rankSpacing": 55
	},
	"themeVariables": {
		"background": "#0f172a",
		"mainBkg": "#0f172a",
		"primaryColor": "#1e293b",
		"primaryTextColor": "#f8fafc",
		"primaryBorderColor": "#475569",
		"lineColor": "#94a3b8",
		"fontFamily": "Inter, system-ui, sans-serif",
		"clusterBkg": "#020617",
		"clusterBorder": "#334155",
		"titleColor": "#f8fafc"
	}
}}%%
`;

	const lightSharedStyles = `
classDef inputNode fill:#e0f2fe,stroke:#0284c7,color:#0f172a,stroke-width:2px;
classDef routingNode fill:#ffedd5,stroke:#ea580c,color:#0f172a,stroke-width:2px;
classDef controlNode fill:#f3e8ff,stroke:#9333ea,color:#0f172a,stroke-width:2px;
classDef powerNode fill:#dcfce7,stroke:#16a34a,color:#0f172a,stroke-width:2px;
classDef buildNode fill:#fef9c3,stroke:#ca8a04,color:#0f172a,stroke-width:2px;
classDef safetyNode fill:#fee2e2,stroke:#dc2626,color:#0f172a,stroke-width:2px;

classDef inputGroup fill:#eff6ff,stroke:#0ea5e9,color:#0c4a6e,stroke-width:2px;
classDef routingGroup fill:#fff7ed,stroke:#f97316,color:#7c2d12,stroke-width:2px;
classDef controlGroup fill:#faf5ff,stroke:#a855f7,color:#581c87,stroke-width:2px;
classDef powerGroup fill:#f0fdf4,stroke:#22c55e,color:#14532d,stroke-width:2px;
classDef buildGroup fill:#fefce8,stroke:#eab308,color:#713f12,stroke-width:2px;
classDef safetyGroup fill:#fef2f2,stroke:#ef4444,color:#7f1d1d,stroke-width:2px;

classDef startupNode fill:#f8fafc,stroke:#64748b,color:#0f172a,stroke-width:2px;
classDef filteringNode fill:#fef9c3,stroke:#ca8a04,color:#0f172a,stroke-width:2px;
classDef processingNode fill:#dcfce7,stroke:#16a34a,color:#0f172a,stroke-width:2px;
classDef feedbackNode fill:#f3e8ff,stroke:#9333ea,color:#0f172a,stroke-width:2px;
classDef errorNode fill:#fee2e2,stroke:#dc2626,color:#0f172a,stroke-width:2px;

classDef startupGroup fill:#f8fafc,stroke:#cbd5e1,color:#334155,stroke-width:2px;
classDef filteringGroup fill:#fefce8,stroke:#eab308,color:#713f12,stroke-width:2px;
classDef processingGroup fill:#f0fdf4,stroke:#22c55e,color:#14532d,stroke-width:2px;
classDef feedbackGroup fill:#faf5ff,stroke:#a855f7,color:#581c87,stroke-width:2px;
classDef errorGroup fill:#fef2f2,stroke:#ef4444,color:#7f1d1d,stroke-width:2px;

classDef delayneNode fill:#e0f2fe,stroke:#0284c7,color:#0f172a,stroke-width:2px;
classDef anthonyNode fill:#ffedd5,stroke:#ea580c,color:#0f172a,stroke-width:2px;
classDef kennNode fill:#f3e8ff,stroke:#9333ea,color:#0f172a,stroke-width:2px;
classDef nickNode fill:#dcfce7,stroke:#16a34a,color:#0f172a,stroke-width:2px;
classDef externalNode fill:#f8fafc,stroke:#64748b,color:#0f172a,stroke-width:2px;

classDef delayneGroup fill:#eff6ff,stroke:#0ea5e9,color:#0c4a6e,stroke-width:2px;
classDef anthonyGroup fill:#fff7ed,stroke:#f97316,color:#7c2d12,stroke-width:2px;
classDef kennGroup fill:#faf5ff,stroke:#a855f7,color:#581c87,stroke-width:2px;
classDef nickGroup fill:#f0fdf4,stroke:#22c55e,color:#14532d,stroke-width:2px;
classDef externalGroup fill:#f8fafc,stroke:#cbd5e1,color:#334155,stroke-width:2px;

linkStyle default stroke:#64748b,stroke-width:1.5px;
`;

	const darkSharedStyles = `
classDef target fill:#0c4a6e,stroke:#38bdf8,color:#e0f2fe,stroke-width:2px;
classDef app fill:#14532d,stroke:#4ade80,color:#dcfce7,stroke-width:2px;
classDef ble fill:#7c2d12,stroke:#fb923c,color:#ffedd5,stroke-width:2px;
classDef storage fill:#581c87,stroke:#c084fc,color:#f3e8ff,stroke-width:2px;
classDef process fill:#1e293b,stroke:#94a3b8,color:#f8fafc,stroke-width:2px;
classDef warn fill:#7f1d1d,stroke:#f87171,color:#fee2e2,stroke-width:2px;
classDef future fill:#1e293b,stroke:#94a3b8,color:#f8fafc,stroke-width:2px,stroke-dasharray:5 5;

classDef inputNode fill:#0c4a6e,stroke:#38bdf8,color:#e0f2fe,stroke-width:2px;
classDef routingNode fill:#7c2d12,stroke:#fb923c,color:#ffedd5,stroke-width:2px;
classDef controlNode fill:#581c87,stroke:#c084fc,color:#f3e8ff,stroke-width:2px;
classDef powerNode fill:#14532d,stroke:#4ade80,color:#dcfce7,stroke-width:2px;
classDef buildNode fill:#713f12,stroke:#facc15,color:#fef9c3,stroke-width:2px;
classDef safetyNode fill:#7f1d1d,stroke:#f87171,color:#fee2e2,stroke-width:2px;

classDef inputGroup fill:#082f49,stroke:#0ea5e9,color:#e0f2fe,stroke-width:2px;
classDef routingGroup fill:#431407,stroke:#f97316,color:#ffedd5,stroke-width:2px;
classDef controlGroup fill:#3b0764,stroke:#a855f7,color:#f3e8ff,stroke-width:2px;
classDef powerGroup fill:#052e16,stroke:#22c55e,color:#dcfce7,stroke-width:2px;
classDef buildGroup fill:#422006,stroke:#eab308,color:#fef9c3,stroke-width:2px;
classDef safetyGroup fill:#450a0a,stroke:#ef4444,color:#fee2e2,stroke-width:2px;

classDef startupNode fill:#1e293b,stroke:#94a3b8,color:#f8fafc,stroke-width:2px;
classDef filteringNode fill:#713f12,stroke:#facc15,color:#fef9c3,stroke-width:2px;
classDef processingNode fill:#14532d,stroke:#4ade80,color:#dcfce7,stroke-width:2px;
classDef feedbackNode fill:#581c87,stroke:#c084fc,color:#f3e8ff,stroke-width:2px;
classDef errorNode fill:#7f1d1d,stroke:#f87171,color:#fee2e2,stroke-width:2px;

classDef startupGroup fill:#020617,stroke:#475569,color:#f8fafc,stroke-width:2px;
classDef filteringGroup fill:#422006,stroke:#eab308,color:#fef9c3,stroke-width:2px;
classDef processingGroup fill:#052e16,stroke:#22c55e,color:#dcfce7,stroke-width:2px;
classDef feedbackGroup fill:#3b0764,stroke:#a855f7,color:#f3e8ff,stroke-width:2px;
classDef errorGroup fill:#450a0a,stroke:#ef4444,color:#fee2e2,stroke-width:2px;

classDef delayneNode fill:#0c4a6e,stroke:#38bdf8,color:#e0f2fe,stroke-width:2px;
classDef anthonyNode fill:#7c2d12,stroke:#fb923c,color:#ffedd5,stroke-width:2px;
classDef kennNode fill:#581c87,stroke:#c084fc,color:#f3e8ff,stroke-width:2px;
classDef nickNode fill:#14532d,stroke:#4ade80,color:#dcfce7,stroke-width:2px;
classDef externalNode fill:#1e293b,stroke:#94a3b8,color:#f8fafc,stroke-width:2px;

classDef delayneGroup fill:#082f49,stroke:#0ea5e9,color:#e0f2fe,stroke-width:2px;
classDef anthonyGroup fill:#431407,stroke:#f97316,color:#ffedd5,stroke-width:2px;
classDef kennGroup fill:#3b0764,stroke:#a855f7,color:#f3e8ff,stroke-width:2px;
classDef nickGroup fill:#052e16,stroke:#22c55e,color:#dcfce7,stroke-width:2px;
classDef externalGroup fill:#020617,stroke:#475569,color:#f8fafc,stroke-width:2px;

linkStyle default stroke:#94a3b8,stroke-width:1.5px;
`;

	function applyTheme(chartSource: string, themeInit: string, sharedStyles: string) {
		const trimmedChart = chartSource.trim();
		const frontmatter = trimmedChart.match(/^---\s*\r?\n[\s\S]*?\r?\n---\s*(?:\r?\n|$)/);
		const chartBody = frontmatter
			? trimmedChart.slice(frontmatter[0].length).trimStart()
			: trimmedChart;
		const flowchartStyles = /^\s*(?:flowchart|graph)\b/m.test(chartBody) ? sharedStyles : '';

		if (!frontmatter) {
			return `${themeInit}\n${chartBody}\n${flowchartStyles}`;
		}

		return `${frontmatter[0].trimEnd()}\n\n${themeInit}\n${chartBody}\n${flowchartStyles}`;
	}

	const themedChart = $derived(
		applyTheme(
			chart,
			isDark ? darkThemeInit : lightThemeInit,
			isDark ? darkSharedStyles : lightSharedStyles
		)
	);

	function rememberDiagramHeight() {
		const height = diagramViewportElement?.getBoundingClientRect().height;

		if (height && height > 80) {
			diagramMinHeight = Math.ceil(height);
		}
	}

	onMount(() => {
		isDark = document.documentElement.classList.contains('dark');

		function handleDeepLink() {
			const searchParams = new URLSearchParams(window.location.search);
			const matchesFigure = window.location.hash === `#${deepLinkDetails.figureId}`;
			const matchesModal = searchParams.get('modal') === deepLinkDetails.modalSlug;

			if (!matchesFigure || !matchesModal) return;

			diagramElement?.scrollIntoView({
				block: 'start'
			});

			if (svgMarkup) {
				void openZoom();
			} else {
				shouldOpenFromUrl = true;
			}
		}

		const observer = new MutationObserver(() => {
			rememberDiagramHeight();
			isDark = document.documentElement.classList.contains('dark');
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
				isRendering = false;
			}
		}

		loadMermaid();
		handleDeepLink();
		window.addEventListener('hashchange', handleDeepLink);
		window.addEventListener('popstate', handleDeepLink);

		return () => {
			observer.disconnect();
			window.removeEventListener('hashchange', handleDeepLink);
			window.removeEventListener('popstate', handleDeepLink);
		};
	});

	$effect(() => {
		if (!mermaidInstance || !themedChart.trim()) return;

		const currentRender = ++renderCount;

		errorMessage = '';
		isRendering = true;
		rememberDiagramHeight();

		mermaidInstance.initialize({
			startOnLoad: false,
			theme: 'base',
			securityLevel: 'strict'
		});

		const id = `mermaid-${Math.random().toString(36).slice(2)}`;

		mermaidInstance
			.render(id, themedChart)
			.then(async ({ svg }: { svg: string }) => {
				if (currentRender !== renderCount) return;

				svgMarkup = svg;
				isRendering = false;

				await tick();

				rememberDiagramHeight();

				if (shouldOpenFromUrl) {
					shouldOpenFromUrl = false;
					await openZoom();
				} else if (isZoomOpen) {
					resetViewerViewBox();
				}
			})
			.catch((error: unknown) => {
				if (currentRender !== renderCount) return;

				errorMessage = error instanceof Error ? error.message : 'Unable to render diagram.';
				isRendering = false;

				if (!svgMarkup) {
					svgMarkup = '';
				}
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

	function zoomAt(multiplier: number, centerX = Number.NaN, centerY = Number.NaN) {
		if (!currentViewBox || !originalViewBox) return;

		const nextZoom = clampZoom(zoom * multiplier);
		const actualMultiplier = nextZoom / zoom;

		if (actualMultiplier === 1) return;

		const x = Number.isNaN(centerX) ? currentViewBox.x + currentViewBox.width / 2 : centerX;
		const y = Number.isNaN(centerY) ? currentViewBox.y + currentViewBox.height / 2 : centerY;
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
</script>

<svelte:window onkeydown={handleKeydown} />

<div bind:this={diagramElement} id={deepLinkDetails.figureId} class="scroll-mt-24">
	<h4 class="font-bold text-slate-950 dark:text-white">{title}</h4>

	{#if errorMessage}
		<p class="mt-3 text-sm text-red-600 dark:text-red-300">{errorMessage}</p>
	{/if}

	<div class="relative mt-4 overflow-hidden rounded-lg border border-slate-200 bg-slate-50/50 transition-colors dark:border-slate-800 dark:bg-slate-950">
		<div bind:this={diagramViewportElement} class="relative overflow-x-auto p-10 [&_svg]:mx-auto [&_svg]:h-auto [&_svg]:max-w-full" style={`min-height: ${diagramMinHeight}px;`}>
			{#if svgMarkup}
				{@html svgMarkup}
			{/if}

			{#if isRendering && !errorMessage}
				<div class="absolute inset-0 z-10 grid place-items-center bg-white/60 backdrop-blur-[1px] dark:bg-slate-950/60">
					<div class="size-11 animate-spin rounded-full border-4 border-slate-300 border-t-accent dark:border-slate-700 dark:border-t-accent"></div>
				</div>
			{/if}
		</div>

		<button type="button" onclick={openZoom} disabled={!svgMarkup} aria-label="Open fullscreen diagram" class="absolute right-3 top-3 grid size-9 place-items-center rounded-full border border-slate-300 bg-white/90 text-slate-700 shadow-lg backdrop-blur transition hover:border-accent hover:text-accent disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:bg-slate-900/90 dark:text-slate-200">
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" class="size-5 fill-current">
				<path d="M120-120v-240h80v104l124-124 56 56-124 124h104v80H120Zm480 0v-80h104L580-324l56-56 124 124v-104h80v240H600ZM324-580 200-704v104h-80v-240h240v80H256l124 124-56 56Zm312 0-56-56 124-124H600v-80h240v240h-80v-104L636-580Z" />
			</svg>
		</button>
	</div>

	{#if isZoomOpen}
		<div class="fixed inset-0 z-100 p-4">
			<button type="button" onclick={closeZoom} aria-label="Close diagram viewer backdrop" class="absolute inset-0 bg-slate-900/40 backdrop-blur dark:bg-slate-950/70"></button>

			<div class="relative z-10 flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl transition-colors dark:border-slate-700 dark:bg-slate-950">
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
				<div bind:this={viewerElement} onwheel={handleWheel} onpointerdown={handlePointerDown} onpointermove={handlePointerMove} onpointerup={handlePointerUp} onpointercancel={handlePointerUp} role="application" tabindex="0" aria-label="Zoomable diagram canvas" class={`diagram-zoom-canvas ${isDragging ? 'diagram-zoom-canvas-dragging' : ''} relative flex flex-1 touch-none select-none items-center justify-center overflow-hidden bg-slate-100 outline-none dark:bg-slate-950 [&_svg]:overflow-visible [&_svg_*]:overflow-visible`}>
					<div class="h-full w-full overflow-visible p-6 **:overflow-visible [&_svg]:h-full [&_svg]:w-full [&_svg]:max-w-none [&_svg]:overflow-visible">
						{@html svgMarkup}
					</div>

					{#if isRendering && !errorMessage}
						<div class="absolute inset-0 z-10 grid place-items-center bg-white/50 backdrop-blur-[1px] dark:bg-slate-950/50">
							<div class="size-12 animate-spin rounded-full border-4 border-slate-300 border-t-accent dark:border-slate-700 dark:border-t-accent"></div>
						</div>
					{/if}

					<p class="absolute bottom-4 right-4 rounded-full border border-slate-200 bg-white/90 px-4 py-2 text-xs font-bold text-slate-500 shadow-lg backdrop-blur dark:border-slate-700 dark:bg-slate-900/90 dark:text-slate-400">Scroll / pinch to zoom • drag to move • Esc to close</p>
				</div>
			</div>
		</div>
	{/if}
</div>

<style>
	.diagram-zoom-canvas {
		cursor:
			url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 -960 960 960'%3E%3Cpath fill='%23ecd316' stroke='%230f172a' stroke-width='2' stroke-linejoin='round' d='M402-40q-30 0-56-13.5T303-92L48-465l24-23q19-19 45-22t47 12l116 81v-383q0-17 11.5-28.5T320-840q17 0 28.5 11.5T360-800v537L212-367l157 229q5 8 14 13t19 5h278q33 0 56.5-23.5T760-200v-560q0-17 11.5-28.5T800-800q17 0 28.5 11.5T840-760v560q0 66-47 113T680-40H402Zm38-440v-400q0-17 11.5-28.5T480-920q17 0 28.5 11.5T520-880v400h-80Zm160 0v-360q0-17 11.5-28.5T640-880q17 0 28.5 11.5T680-840v360h-80ZM486-300Z'/%3E%3C/svg%3E") 12 12,
			grab;
	}

	.diagram-zoom-canvas-dragging {
		cursor:
			url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 -960 960 960'%3E%3Cpath fill='%23ecd316' stroke='%230f172a' stroke-width='2' stroke-linejoin='round' d='M398-120q-27 0-51.5-11.5T305-164L46-483l26-25q19-19 45-22t47 12l116 81v-403q0-17 11.5-28.5T320-880q17 0 28.5 11.5T360-840v557l-111-78 118 146q6 7 14 11t17 4h282q33 0 56.5-23.5T760-280v-280q0-17 11.5-28.5T800-600q17 0 28.5 11.5T840-560v280q0 66-47 113t-113 47H398Zm122-240Zm-80-80v-240q0-17 11.5-28.5T480-720q17 0 28.5 11.5T520-680v240h-80Zm160 0v-200q0-17 11.5-28.5T640-680q17 0 28.5 11.5T680-640v200h-80Z'/%3E%3C/svg%3E") 12 12,
			grabbing;
	}
</style>

