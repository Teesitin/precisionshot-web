const fills: Record<string, string> = {
    '#f6f7f9': '#151e2d',
    '#f1f7fc': '#142333',
    '#fff8ed': '#272218',
    '#f1faf5': '#14251f',
    '#f8f3fb': '#211d30',
    '#dceef9': '#1d3347',
    '#fce4bf': '#3a2d1e',
    '#ede1f2': '#30283e',
    '#dcf4e6': '#1f342c',
    '#eceff1': '#253041'
};

const borders: Record<string, string> = {
    '#aab2ba': '#38465b', '#76a7c9': '#35516b', '#d6a85f': '#5e4c30',
    '#86b89b': '#365347', '#a88abb': '#4d3e62', '#2874a6': '#52758b',
    '#b9770e': '#8a7249', '#7d3c98': '#756187', '#239b56': '#547d68',
    '#7f8c8d': '#64748b'
};

// Explicit source styles override Mermaid's theme, so adapt those declarations
// too. Keep chart content, layout, class assignments, and light mode unchanged.
export function darkenDiagramStyles(source: string): string {
    return source.replace(/^[\t ]*(?:style|classDef)\s+[^\r\n]+/gm, (declaration) =>
        declaration.replace(/\b(fill|stroke|color)\s*:\s*(#[\da-f]{3,8})\b/gi, (_, property: string, color: string) => {
            const key = property.toLowerCase();
            const value = key === 'color' ? '#cbd5e1'
                : key === 'fill' ? fills[color.toLowerCase()] ?? '#1e293b'
                : borders[color.toLowerCase()] ?? '#52637a';
            return `${property}:${value}`;
        })
    );
}
