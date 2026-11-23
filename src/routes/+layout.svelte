<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/fav.png';
	import Icon from '$lib/components/Icon.svelte';
	import { onMount } from 'svelte';
	import { page } from '$app/state';

	let { children } = $props();
	let isDark = $state(true);
	let menuOpen = $state(false);
	const navigation = [
		{ label: 'The system', href: '#project' },
		{ label: 'Engineering', href: '#design' },
		{ label: 'Videos', href: '#videos' },
		{ label: 'The team', href: '#team' }
	];
	const homeLink = (hash: string) => page.url.pathname === '/' ? hash : `/${hash}`;

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
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<link rel="preload" href="/fonts/BlackOpsOne-Regular.ttf" as="font" type="font/ttf" crossorigin="anonymous" />
	<link rel="preload" href="/fonts/MaterialSymbolsOutlined.woff2" as="font" type="font/woff2" crossorigin="anonymous" />
	<meta name="theme-color" content={isDark ? '#020617' : '#f8fafc'} />
</svelte:head>

<a class="skip-link" href="#main">Skip to content</a>
<div class="site-shell">
	<header class="site-header">
		<div class="page-width header-inner">
			<a href={homeLink('#home')} class="wordmark" aria-label="PrecisionShot home" onclick={() => menuOpen = false}>
				<span class="brand-mark" aria-hidden="true"><Icon name="target" size={28} /></span>
				<span>PrecisionShot<span class="wordmark-dot">.</span></span>
			</a>
			<nav id="main-nav" class="site-nav" class:menu-open={menuOpen} aria-label="Main navigation">
				{#each navigation as item}
					<a href={homeLink(item.href)} onclick={() => menuOpen = false}>{item.label}</a>
				{/each}
				<a class="mobile-resources" href={homeLink('#documents')} onclick={() => menuOpen = false}>Project resources</a>
			</nav>
			<div class="header-actions">
				<button class="icon-button theme-button" type="button" onclick={toggleTheme} aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}><Icon name={isDark ? 'sun' : 'moon'} size={19} /></button>
				<a class="button button-small header-resource" href={homeLink('#documents')}>Project resources</a>
				<button class="icon-button menu-button" type="button" onclick={() => menuOpen = !menuOpen} aria-expanded={menuOpen} aria-controls="main-nav" aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}><Icon name={menuOpen ? 'close' : 'menu'} /></button>
			</div>
		</div>
	</header>

	{@render children()}

	<footer class="site-footer">
		<div class="page-width footer-main">
			<div>
				<a class="wordmark" href={homeLink('#home')}><span class="brand-mark" aria-hidden="true"><Icon name="target" size={28} /></span><span>PrecisionShot.</span></a>
				<p>Built to make practice measurable.</p>
			</div>
			<div class="footer-links"><a href={homeLink('#documents')}>Documentation</a><a href="/engineering">Engineering</a><a href={homeLink('#timeline')}>Project timeline</a><a href="/tasks">Task archive</a><a href="https://github.com/Teesitin/precisionshot-web" target="_blank" rel="noreferrer">GitHub</a></div>
		</div>
		<div class="page-width footer-bottom"><p>© 2026 PrecisionShot</p><p>University of Central Florida · Senior Design · Group 13</p></div>
	</footer>
</div>
