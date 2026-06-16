<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/fav.png';
	import { onMount } from 'svelte';

	let { children } = $props();

	let header: HTMLElement;
	let isDark = $state(true);

	const navItems = [
		{ label: 'Home', href: '#home' },
		{ label: 'Team', href: '#team' },
		{ label: 'Project', href: '#project' },
		{ label: 'Design', href: '#design' },
		{ label: 'Documents', href: '#documents' },
		{ label: 'Videos', href: '#videos' },
		{ label: 'Timeline', href: '#timeline' }
	];

	onMount(() => {
		const savedTheme = localStorage.getItem('theme');

		isDark = savedTheme ? savedTheme === 'dark' : true;

		document.documentElement.classList.toggle('dark', isDark);
	});

	function toggleTheme() {
		isDark = !isDark;

		document.documentElement.classList.toggle('dark', isDark);
		localStorage.setItem('theme', isDark ? 'dark' : 'light');
	}

	function scrollToSection(event: MouseEvent, href: string) {
		event.preventDefault();

		const id = href.replace('#', '');
		const target = document.getElementById(id);

		if (!target) return;

		const navOffset = header?.offsetHeight ?? 0;
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

{#snippet themeIcon()}
	{#if isDark}
		<!-- Light Mode -->
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" class="size-6 fill-current">
			<path d="M565-395q35-35 35-85t-35-85q-35-35-85-35t-85 35q-35 35-35 85t35 85q35 35 85 35t85-35Zm-226.5 56.5Q280-397 280-480t58.5-141.5Q397-680 480-680t141.5 58.5Q680-563 680-480t-58.5 141.5Q563-280 480-280t-141.5-58.5ZM200-440H40v-80h160v80Zm720 0H760v-80h160v80ZM440-760v-160h80v160h-80Zm0 720v-160h80v160h-80ZM256-650l-101-97 57-59 96 100-52 56Zm492 496-97-101 53-55 101 97-57 59Zm-98-550 97-101 59 57-100 96-56-52ZM154-212l101-97 55 53-97 101-59-57Zm326-268Z" />
		</svg>
	{:else}
		<!-- Dark Mode -->
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" class="size-6 fill-current">
			<path d="M480-120q-150 0-255-105T120-480q0-150 105-255t255-105q14 0 27.5 1t26.5 3q-41 29-65.5 75.5T444-660q0 90 63 153t153 63q55 0 101-24.5t75-65.5q2 13 3 26.5t1 27.5q0 150-105 255T480-120Zm0-80q88 0 158-48.5T740-375q-20 5-40 8t-40 3q-123 0-209.5-86.5T364-660q0-20 3-40t8-40q-78 32-126.5 102T200-480q0 116 82 198t198 82Zm-10-270Z" />
		</svg>
	{/if}
{/snippet}

<div class="min-h-screen bg-slate-50 text-slate-950 transition-colors dark:bg-slate-950 dark:text-slate-100">
	<header bind:this={header} class="sticky top-0 z-50 border-b border-slate-200 bg-white/70 backdrop-blur transition-colors dark:border-slate-800 dark:bg-slate-950/70">
		<div class="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 md:pr-20">
			<a href="#home" onclick={(event) => scrollToSection(event, '#home')} class="font-blackops text-lg font-bold text-accent">PrecisionShot</a>

			<div class="flex items-center gap-5">
				<nav class="hidden gap-5 text-sm text-slate-600 md:flex dark:text-slate-300">
					{#each navItems as item}
						<a href={item.href} onclick={(event) => scrollToSection(event, item.href)} class="transition hover:text-accent">{item.label}</a>
					{/each}
				</nav>

				<button type="button" onclick={toggleTheme} aria-label="Toggle light and dark mode" class="grid size-10 place-items-center rounded-full border border-slate-300 bg-white text-slate-700 shadow-sm transition hover:border-accent hover:text-accent dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 md:hidden">
					{@render themeIcon()}
				</button>
			</div>
		</div>

		<button type="button" onclick={toggleTheme} aria-label="Toggle light and dark mode" class="absolute right-6 top-1/2 hidden size-10 -translate-y-1/2 place-items-center rounded-full border border-slate-300 bg-white text-slate-700 shadow-sm transition hover:border-accent hover:text-accent dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 md:grid">
			{@render themeIcon()}
		</button>
	</header>

	{@render children()}

	<footer class="border-t border-slate-200 bg-white transition-colors dark:border-slate-800 dark:bg-slate-950">
		<div class="mx-auto max-w-6xl px-6 py-6 text-sm text-slate-500 dark:text-slate-500">
			<p>© 2026 PrecisionShot Training System - UCF Senior Design Group 13</p>
		</div>
	</footer>
</div>