const flowchartSources = import.meta.glob('../../flowcharts/*.mermaid', {
	eager: true,
	query: '?raw',
	import: 'default'
}) as Record<string, string>;

const acronyms = new Map([
	['lcd', 'LCD'],
	['sd', 'SD']
]);

function titleFromPath(path: string) {
	const filename = path.split('/').at(-1) ?? path;
	const match = filename.match(/^(\d+)_(\d+)_(.+)\.mermaid$/);

	if (!match) {
		return filename.replace(/\.mermaid$/, '').replaceAll('_', ' ');
	}

	const [, chapter, section, slug] = match;
	const words = slug.split('_').map((word, index) => {
		const acronym = acronyms.get(word);

		if (acronym) return acronym;
		if (index > 0 && word === 'and') return word;

		return `${word.charAt(0).toUpperCase()}${word.slice(1)}`;
	});

	return `${chapter}.${section} ${words.join(' ')}`;
}

export const flowcharts = Object.entries(flowchartSources)
	.map(([path, chart]) => ({
		path,
		title: titleFromPath(path),
		chart
	}))
	.sort((a, b) => a.path.localeCompare(b.path, undefined, { numeric: true }));
