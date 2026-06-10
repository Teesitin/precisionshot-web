<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/fav.png';

	let { children } = $props();

	let header: HTMLElement;

	const navItems = [
		{ label: 'Home', href: '#home' },
		{ label: 'Team', href: '#team' },
		{ label: 'Project', href: '#project' },
		{ label: 'Design', href: '#design' },
		{ label: 'Documents', href: '#documents' },
		{ label: 'Videos', href: '#videos' },
		{ label: 'Timeline', href: '#timeline' }
	];

	function scrollToSection(event: MouseEvent, href: string) {
		event.preventDefault();

		const id = href.replace('#', '');
		const target = document.getElementById(id);

		if (!target) return;

		const navOffset = (header?.offsetHeight ?? 0);
		const targetTop = target.getBoundingClientRect().top + window.scrollY - navOffset;

		window.scrollTo({
			top: Math.max(targetTop, 0),
			behavior: 'smooth'
		});

		history.pushState(null, '', href);
	}
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<header
	bind:this={header}
	class="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/70 backdrop-blur"
>
	<div class="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
		<a
			href="#home"
			onclick={(event) => scrollToSection(event, '#home')}
			class="text-lg font-blackops font-bold text-accent"
		>
			PrecisionShot
		</a>

		<nav class="hidden gap-5 text-sm text-slate-300 md:flex">
			{#each navItems as item}
				<a
					href={item.href}
					onclick={(event) => scrollToSection(event, item.href)}
					class="hover:text-accent"
				>
					{item.label}
				</a>
			{/each}
		</nav>
	</div>
</header>

{@render children()}

<footer class="border-t border-slate-800 bg-slate-950">
	<div class="mx-auto max-w-6xl px-6 py-6 text-sm text-slate-500">
		<p>© 2026 PrecisionShot Training System - UCF Senior Design Group 13</p>
	</div>
</footer>