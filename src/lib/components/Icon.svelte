<script lang="ts">
	// Keep this map in sync with the self-hosted Material Symbols font subset.
	const symbols = {
		play: 'play_arrow',
		menu: 'menu',
		close: 'close',
		sun: 'light_mode',
		moon: 'dark_mode',
		target: 'my_location',
		chip: 'memory',
		phone: 'smartphone',
		file: 'description',
		check: 'check',
		chevron: 'expand_more',
		fullscreen: 'fullscreen',
		plus: 'add',
		minus: 'remove',
		reset: 'restart_alt'
	};
	type IconName = keyof typeof symbols;
	let { name, size = 22 }: { name: IconName; size?: number } = $props();
</script>

<span class="google-icon" style:font-size={`${size}px`} aria-hidden="true">{symbols[name]}</span>

<style>
	.google-icon {
		font-family: 'Material Symbols Outlined';
		font-weight: 400;
		font-style: normal;
		line-height: 1;
		letter-spacing: normal;
		text-transform: none;
		display: inline-block;
		width: 1em;
		height: 1em;
		white-space: nowrap;
		word-wrap: normal;
		direction: ltr;
		font-feature-settings: 'liga';
		-webkit-font-smoothing: antialiased;
		flex-shrink: 0;
		vertical-align: middle;
		user-select: none;
	}
</style>
