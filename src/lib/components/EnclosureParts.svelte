<script lang="ts">
    import { enclosureParts } from '$lib/models';
</script>

<div class="enclosure-parts">
    <h3>All ten enclosure parts</h3>
    <p>Each part shown separately, with nothing covering it.</p>
    <div class="parts-grid">{#each enclosureParts as part}<figure><img src={`/images/showcase/enclosure-v8-${part.id.toLowerCase()}.webp`} alt={`${part.id}: ${part.name}, complete CAD view.`} width="800" height="640" loading="lazy" /><figcaption><span>{part.id}</span>{part.name}</figcaption></figure>{/each}</div>
</div>
