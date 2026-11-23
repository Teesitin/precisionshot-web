<script lang="ts">
	const paths = {
		play: 'm9 5 11 7-11 7V5Z',
		menu: 'M4 7h16M4 12h16M4 17h16',
		close: 'm6 6 12 12M6 18 18 6',
		sun: 'M12 3V1m0 22v-2M3 12H1m22 0h-2M5.6 5.6 4.2 4.2m15.6 15.6-1.4-1.4M5.6 18.4l-1.4 1.4M19.8 4.2l-1.4 1.4M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z',
		moon: 'M20.5 14.1A8.5 8.5 0 0 1 9.9 3.5 8.5 8.5 0 1 0 20.5 14.1Z',
		target: 'M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-4 0a5 5 0 1 1-10 0 5 5 0 0 1 10 0ZM12 1v5m0 12v5M1 12h5m12 0h5',
		chip: 'M7 7h10v10H7V7Zm3 3h4v4h-4v-4ZM8 3v4m4-4v4m4-4v4M8 17v4m4-4v4m4-4v4M3 8h4m-4 4h4m-4 4h4m10-8h4m-4 4h4m-4 4h4',
		phone: 'M8 2h8a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Zm2 3h4m-3 14h2',
		file: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6Zm0 0v6h6M8 13h8m-8 4h5',
		check: 'm5 12 4 4L19 6',
		chevron: 'm6 9 6 6 6-6'
	};
	type IconName = 'play' | 'menu' | 'close' | 'sun' | 'moon' | 'target' | 'chip' | 'phone' | 'file' | 'check' | 'chevron';
	let { name, size = 22 }: { name: IconName; size?: number } = $props();
</script>

<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d={paths[name]} /></svg>
