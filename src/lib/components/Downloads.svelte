<script lang="ts">
    import Icon from '$lib/components/Icon.svelte';
    import { resourceSections, videos, type Resource } from '$lib/resources';
    import { enclosureDownload } from '$lib/models';

    const fileLinks = (items: Resource[]) => items.map((item) => ({
        title: item.title,
        href: item.href && item.downloadId ? `/downloads/${item.downloadId}` : ''
    }));
    const groups = [
        { title: 'Reports', items: fileLinks(resourceSections.find((section) => section.title === 'Documents')!.items) },
        { title: 'Slides', items: fileLinks(resourceSections.find((section) => section.title === 'Slides')!.items) },
        { title: 'Videos', items: fileLinks(videos) },
        { title: 'CAD', items: [{ title: 'Enclosure V8 · STEP, STL & OBJ', href: enclosureDownload.href }] },
        { title: 'Task data', items: [{ title: 'ClickUp archive · CSV', href: '/clickup-tasks-static/export-7-22-26.csv' }] }
    ];
    const repositories = resourceSections.find((section) => section.title === 'Project Links')!.items.filter((item) => item.title.includes('Source Code'));
</script>

<section id="documents" class="resource-section">
    <div class="section downloads-panel">
        <div class="section-heading"><h2>Downloads.</h2></div>
        {#each groups as group}
            <div class="download-group"><h3>{group.title}</h3>
                {#each group.items as item}
                    <div class="document-row"><span class="file-icon"><Icon name="file" size={21} /></span><div class="document-name"><h4>{item.title}</h4></div>
                        {#if item.href}<a class="document-action" href={item.href} download aria-label={`Download ${item.title}`}>Download</a>{:else}<span class="document-pending">Pending</span>{/if}
                    </div>
                {/each}
            </div>
        {/each}
        <div class="repository-links"><h3>Source code</h3><div>{#each repositories as repository}<a class="text-link" href={repository.href} target="_blank" rel="noreferrer">{repository.title === 'Website Source Code' ? 'Website' : repository.title === 'Mobile Application Source Code' ? 'App' : 'Firmware'}</a>{/each}</div></div>
    </div>
</section>
