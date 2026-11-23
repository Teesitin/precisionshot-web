<script lang="ts">
    import folders from '$lib/task-summary.json';
</script>

<section id="tasks" class="section page-width task-archive">
    <div class="section-heading"><h2>Task archive.</h2></div>
    <p class="archive-date">Snapshot · July 22, 2026</p>
    <table><thead><tr><th scope="col">Folder</th><th scope="col">Tasks</th><th scope="col">Completed</th></tr></thead><tbody>{#each folders as folder}<tr><th scope="row">{folder.name}</th><td>{folder.total}</td><td>{folder.complete}</td></tr>{/each}</tbody></table>
</section>
