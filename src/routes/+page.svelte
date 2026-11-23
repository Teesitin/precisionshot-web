<script lang="ts">
	import { tick } from 'svelte';
	import Icon from '$lib/components/Icon.svelte';
	import { resourceSections, videos, type Resource } from '$lib/resources';
	import { teamMembers, reviewers, sd1Timeline, sd2Timeline } from '$lib/project';
    import Downloads from '$lib/components/Downloads.svelte';
    import EngineeringSection from '$lib/components/EngineeringSection.svelte';
    import TaskArchive from '$lib/components/TaskArchive.svelte';

	const imageRoot = '/images/showcase/';
	const finalDemo = videos.find((item) => item.downloadId === 'final-demonstration')!;
	const finalPresentation = videos.find((item) => item.downloadId === 'final-presentation')!;
	const videoCards = [finalDemo, finalPresentation, ...videos.filter((item) => item !== finalDemo && item !== finalPresentation)];
	const portraits: Record<string, string> = {
		'Anthony Fontana': 'anthony-fontana', 'DeLayne Russell': 'delayne-russell',
		'Kenn Pickavance': 'kenn-pickavance', 'Nicolas Koteff': 'nicolas-koteff'
	};
	const systemViews = [
        { label: 'Target', icon: 'target' as const, description: 'Sixteen optical zones detect laser strikes, with immediate LED feedback and onboard scoring.', image: 'enclosure-v8-assembled.webp', width: 800, height: 1340, alt: 'Complete PrecisionShot V8 enclosure.', caption: 'Enclosure V8 · CAD rendering' },
        { label: 'Electronics', icon: 'chip' as const, description: 'Three custom PCBs handle sensing, power, and ESP32-S3 processing.', image: 'main-board.webp', width: 1200, height: 725, alt: 'PrecisionShot Main Board V4.', caption: 'Main Board V4 · PCB design' },
        { label: 'App', icon: 'phone' as const, description: 'Connect over Bluetooth for training modes, shot feedback, settings, and session history.', image: 'app-screen.webp', width: 640, height: 1372, alt: 'PrecisionShot companion app interface.', caption: 'Companion app · Actual interface' }
    ];
	let activeVideo = $state<Resource | null>(null);
	let videoDialog = $state<HTMLDialogElement>();
    const hasCaptions = $derived(activeVideo?.downloadId === 'final-demonstration' || activeVideo?.downloadId === 'final-presentation');
	async function watchVideo(video: Resource) {
		activeVideo = video;
		await tick();
		videoDialog?.showModal();
	}

</script>

<svelte:head>
	<title>PrecisionShot — Every shot. More insight.</title>
	<meta name="description" content="Meet PrecisionShot: a laser training target, custom embedded electronics, and companion app. A UCF Senior Design project by Group 13." />
</svelte:head>

<main id="main">
	<section id="home" class="hero page-width">
		<div class="hero-copy">

			<h1>Every shot.<br /><span>More insight.</span></h1>
			<p class="hero-description">Laser training with instant feedback, custom electronics, and a connected app.</p>
			<div class="hero-actions"><a href="#project" class="button">Explore the system</a><button class="button button-quiet" onclick={() => watchVideo(finalDemo)}><Icon name="play" size={18} /> Watch the demo</button></div>

		</div>
		<figure class="hero-visual">
			<div class="product-scene">
				<div class="scene-circle" aria-hidden="true"></div>
				<span class="scene-corner corner-one" aria-hidden="true"></span><span class="scene-corner corner-two" aria-hidden="true"></span>
				<img class="hero-target" src={`${imageRoot}enclosure-v8-assembled.webp`} alt="PrecisionShot V8 enclosure with its upper electronics housing and sixteen optical openings." width="800" height="1340" fetchpriority="high" />
				<div class="hero-phone"><img src={`${imageRoot}app-screen.webp`} alt="The PrecisionShot companion app interface." width="640" height="1372" /></div>

			</div>
			<figcaption>V8 enclosure · Companion app</figcaption>
		</figure>
	</section>

	<div class="capability-band"><div class="page-width capability-inner"><span>Optical shot detection</span><span>On-target feedback</span><span>Bluetooth connectivity</span><span>Standalone operation</span></div></div>

	<section id="project" class="section page-width">
		<div class="section-heading"><h2>System.</h2></div>
        <div class="system-overview">
            {#each systemViews as view}
                <article class="system-card">
                    <figure class="system-card-image" class:app-image={view.label === 'App'}><img src={`${imageRoot}${view.image}`} alt={view.alt} width={view.width} height={view.height} loading="lazy" /><figcaption>{view.caption}</figcaption></figure>
                    <h3><Icon name={view.icon} size={21} />{view.label}</h3><p>{view.description}</p>
                </article>
            {/each}
        </div>

	</section>

    <EngineeringSection />

	<section id="videos" class="section page-width">
		<div class="section-heading"><h2>Videos.</h2></div>
        <div class="video-grid">{#each videoCards as video, index}
            <article class="video-card" class:featured={index < 2}>
                <button type="button" class="video-thumbnail" aria-label={`Watch ${video.title}`} onclick={() => watchVideo(video)}><img src={video.poster} alt={video.thumbnailAlt} width="1280" height="720" loading="lazy" /><span class="play-control"><Icon name="play" size={24} /></span><span class="video-duration">{video.duration}</span></button>
                <h3>{video.title.replace(/ Video$/, '')}</h3>
            </article>
        {/each}</div>
	</section>

    <Downloads />

	<section id="team" class="section page-width">
		<div class="section-heading"><h2>Team.</h2></div>
		<div class="team-grid">{#each teamMembers as member}<article class="team-member"><div class="team-portrait"><img src={`${imageRoot}${portraits[member.name]}.webp`} alt={member.name} width="320" height="320" loading="lazy" /></div><h3>{member.name}</h3><p>{member.role.replace(' Design Lead', '').replace(' Lead', '')} · {member.major}</p></article>{/each}</div>
		<div class="reviewers"><h3>Reviewers</h3><ul>{#each reviewers as reviewer}<li>{reviewer}</li>{/each}</ul></div>
	</section>

    <section id="timeline" class="timeline-section"><div class="page-width section">
        <div class="section-heading"><h2>Timeline.</h2><p class="timeline-note">Approximate milestone dates.</p></div>
        <div class="full-timeline">{#each [{ title: 'Senior Design I', items: sd1Timeline }, { title: 'Senior Design II', items: sd2Timeline }] as phase}<div><h3>{phase.title}</h3>{#each phase.items as item}<div class="timeline-row"><p>{item.dates}{phase.title === 'Senior Design I' ? ', 2026' : ''}</p><h4>{item.title}</h4></div>{/each}</div>{/each}</div>
    </div></section>
    <TaskArchive />
</main>

<dialog bind:this={videoDialog} class="video-dialog" onclose={() => activeVideo = null} aria-labelledby="video-dialog-title">
	{#if activeVideo}
		<div class="video-dialog-header"><h2 id="video-dialog-title">{activeVideo.title}</h2><button class="icon-button" aria-label="Close video" onclick={() => videoDialog?.close()}><Icon name="close" /></button></div>
		<video controls autoplay playsinline preload="metadata" aria-label={activeVideo.title}><source src={activeVideo.href} type="video/mp4" /><track kind="captions" src={hasCaptions ? `/captions/${activeVideo.downloadId}.en.vtt` : undefined} srclang="en" label="English (auto-generated)" /></video>
		<div class="video-dialog-footer">{#if hasCaptions}<p>Auto-generated captions</p>{/if}<a href="#documents" onclick={() => videoDialog?.close()}>All downloads</a></div>
	{/if}
</dialog>
