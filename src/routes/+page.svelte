<script lang="ts">
	import { tick } from 'svelte';
	import Icon from '$lib/components/Icon.svelte';
	import { resourceSections, videos, type Resource } from '$lib/resources';
	import { teamMembers, reviewers, sd1Timeline, sd2Timeline } from '$lib/project';

	const imageRoot = '/images/showcase/';
	const documents = resourceSections.find((section) => section.title === 'Documents')!.items;
	const slides = resourceSections.find((section) => section.title === 'Slides')!.items;
	const projectLinks = resourceSections.find((section) => section.title === 'Project Links')!.items.filter((item) => item.title.includes('Source Code'));
	const finalDemo = videos.find((item) => item.downloadId === 'final-demonstration')!;
	const finalPresentation = videos.find((item) => item.downloadId === 'final-presentation')!;
	const olderVideos = videos.filter((item) => item !== finalDemo && item !== finalPresentation);
	const portraits: Record<string, string> = {
		'Anthony Fontana': 'anthony-fontana', 'DeLayne Russell': 'delayne-russell',
		'Kenn Pickavance': 'kenn-pickavance', 'Nicolas Koteff': 'nicolas-koteff'
	};
	const systemViews = [
		{ label: 'Target', icon: 'target' as const, title: 'See the result. Right on target.', description: 'A 4 × 4 optical array detects laser strikes. LEDs and an onboard display return immediate feedback, with or without a phone.', image: 'target-front.webp', alt: 'CAD rendering of the PrecisionShot target with its display and sixteen optical sensing zones.', caption: 'Target enclosure · CAD rendering', tags: ['16 optical zones', 'Onboard scoring', 'Standalone operation'] },
		{ label: 'Electronics', icon: 'chip' as const, title: 'Custom hardware, working together.', description: 'Three purpose-built PCBs connect optical sensing, power regulation, and ESP32-S3 processing in a single training system.', image: 'main-board.webp', alt: 'PrecisionShot Main Board V4 CAD rendering showing the ESP32-S3, display connector, and sensor interface.', caption: 'Main Board V4 · PCB design', tags: ['ESP32-S3', 'Three custom PCBs', 'Local controls'] },
		{ label: 'App', icon: 'phone' as const, title: 'Bring every session into focus.', description: 'The companion app connects over Bluetooth for shot feedback, training modes, settings, and session history.', image: 'app-screen.webp', alt: 'PrecisionShot companion app showing its target, training modes, and latest shot panel.', caption: 'Companion app · Actual interface', tags: ['Bluetooth LE', 'Training modes', 'Session history'] }
	];
	let selectedView = $state(0);
	const currentView = $derived(systemViews[selectedView]);
	let activeVideo = $state<Resource | null>(null);
	let videoDialog = $state<HTMLDialogElement>();
	async function watchVideo(video: Resource) {
		activeVideo = video;
		await tick();
		videoDialog?.showModal();
	}
	const milestones = [
		{ date: 'May 2026', title: 'Project kickoff' },
		{ date: 'July 28', title: 'SD1 final report' },
		{ date: 'October 2', title: 'Design review' },
		{ date: 'October 17', title: 'Midterm demo' },
		{ date: 'November 18', title: 'Final review' }
	];
</script>

<svelte:head>
	<title>PrecisionShot — Every shot. More insight.</title>
	<meta name="description" content="Meet PrecisionShot: a laser training target, custom embedded electronics, and companion app. A UCF Senior Design project by Group 13." />
</svelte:head>

<main id="main">
	<section id="home" class="hero page-width">
		<div class="hero-copy">
			<p class="eyebrow"><span class="eyebrow-line"></span> UCF Senior Design · Group 13</p>
			<h1>Every shot.<br /><span>More insight.</span></h1>
			<p class="hero-description">A smarter way to practice. PrecisionShot pairs a laser target with real-time feedback and a connected companion app.</p>
			<div class="hero-actions"><a href="#project" class="button">Explore the system</a><button class="button button-quiet" onclick={() => watchVideo(finalDemo)}><Icon name="play" size={18} /> Watch the demo</button></div>
			<div class="hero-note"><span class="note-rule"></span><span>Hardware. Firmware. Mobile.<br /><strong>One integrated training system.</strong></span></div>
		</div>
		<figure class="hero-visual">
			<div class="product-scene">
				<div class="scene-circle" aria-hidden="true"></div>
				<span class="scene-corner corner-one" aria-hidden="true"></span><span class="scene-corner corner-two" aria-hidden="true"></span>
				<img class="hero-target" src={`${imageRoot}target-front.webp`} alt="PrecisionShot target design with an onboard display and sixteen optical sensing zones." width="700" height="1204" fetchpriority="high" />
				<div class="hero-phone"><img src={`${imageRoot}app-screen.webp`} alt="The PrecisionShot companion app interface." width="640" height="1372" /></div>
				<span class="scene-label">Designed to connect.</span>
			</div>
			<figcaption><span>PrecisionShot Training System</span><span>Target render + app interface</span></figcaption>
		</figure>
	</section>

	<div class="capability-band"><div class="page-width capability-inner"><span>Optical shot detection</span><span>On-target feedback</span><span>Bluetooth connectivity</span><span>Standalone operation</span></div></div>

	<section id="project" class="section page-width">
		<div class="section-heading"><div><p class="eyebrow">The system</p><h2>Practice with purpose.</h2></div><p>From a laser strike to a useful result.<br />Every part has a clear job to do.</p></div>
		<div class="system-explorer">
			<figure class="system-figure" class:app-view={selectedView === 2} class:board-view={selectedView === 1}>
				{#key selectedView}<img src={`${imageRoot}${currentView.image}`} alt={currentView.alt} width={selectedView === 1 ? 1200 : 700} height={selectedView === 1 ? 725 : 1204} loading="lazy" />{/key}
				<figcaption>{currentView.caption}</figcaption>
			</figure>
			<div class="system-copy">
				<div class="system-tabs" role="group" aria-label="Explore the system">
					{#each systemViews as view, index}<button aria-pressed={selectedView === index} class:active={selectedView === index} onclick={() => selectedView = index}><Icon name={view.icon} size={19} />{view.label}</button>{/each}
				</div>
				<div class="system-description" aria-live="polite"><h3>{currentView.title}</h3><p>{currentView.description}</p><ul class="feature-list">{#each currentView.tags as tag}<li><Icon name="check" size={18} />{tag}</li>{/each}</ul></div>
				<a href="/engineering" class="text-link">Explore the engineering</a>
			</div>
		</div>
	</section>

	<section id="design" class="engineering-band">
		<div class="page-width engineering-inner">
			<div class="engineering-copy"><p class="eyebrow">Behind the build</p><h2>Designed from<br />the inside out.</h2><p>Custom electronics. A modular enclosure. Embedded software that connects it all.</p><a class="button button-accent" href="/engineering">Inside the engineering</a><span class="engineering-note">Schematics, architecture & interactive 3D models</span></div>
			<figure><img src={`${imageRoot}sensor-assembly.webp`} alt="Exploded CAD view of the sensor enclosure, lenses, optical grid, sensor PCB, and rear covers." width="1300" height="798" loading="lazy" /><figcaption>Sensor assembly · Exploded CAD view</figcaption></figure>
		</div>
	</section>

	<section id="videos" class="section page-width">
		<div class="section-heading"><div><p class="eyebrow">See it in action</p><h2>From design to demonstration.</h2></div><p>The working prototype, the thinking behind it,<br />and the complete project story.</p></div>
		<div class="featured-videos">
			<article class="video-feature">
				<button class="video-thumbnail" aria-label="Watch Final Demonstration Video" onclick={() => watchVideo(finalDemo)}><img src={`${imageRoot}prototype-demo.webp`} alt="The working PrecisionShot target showing illuminated sensing zones and its onboard score display." width="1280" height="720" loading="lazy" /><span class="play-control"><Icon name="play" size={24} /></span><span class="video-duration">10:17</span></button>
				<div class="video-feature-info"><div><p class="eyebrow">The working prototype</p><h3>Final demonstration</h3></div><a class="text-link" href="/downloads/final-demonstration" aria-label="Download Final Demonstration Video" download>Download MP4</a></div>
			</article>
			<article class="video-feature">
				<button class="video-thumbnail presentation-thumbnail" aria-label="Watch Final Presentation Video" onclick={() => watchVideo(finalPresentation)}><span class="presentation-label">PRECISIONSHOT<span>Final project presentation</span></span><img src={`${imageRoot}main-board.webp`} alt="The custom PrecisionShot main board design." width="1200" height="725" loading="lazy" /><span class="play-control"><Icon name="play" size={24} /></span><span class="video-duration">23:31</span></button>
				<div class="video-feature-info"><div><p class="eyebrow">The engineering story</p><h3>Final presentation</h3></div><a class="text-link" href="/downloads/final-presentation" aria-label="Download Final Presentation Video" download>Download MP4</a></div>
			</article>
		</div>
		<details class="disclosure video-archive"><summary>Earlier project videos <span>Mini demo, CDR & midterm demo<Icon name="chevron" size={18} /></span></summary><div class="archive-video-list">{#each olderVideos as video}<div class="archive-video-row"><div><span class="phase-label">{video.phase}</span><h3>{video.title}</h3></div><div><a href={video.href} target="_blank" rel="noreferrer">Watch video</a>{#if video.downloadId}<a href={`/downloads/${video.downloadId}`} download aria-label={`Download ${video.title}`}>Download MP4</a>{/if}</div></div>{/each}</div></details>
	</section>

	<section id="resources" class="resource-section">
		<div class="page-width section" id="documents">
			<div class="section-heading"><div><p class="eyebrow">Project resources</p><h2>The complete paper trail.</h2></div><p>Reports, slide decks, and source code.<br />All in one place.</p></div>
			<div class="document-columns">
				{#each [{ title: 'Reports & papers', items: documents }, { title: 'Presentation slides', items: slides }] as group}
					<div class="document-group"><h3>{group.title}</h3><div class="document-list">{#each group.items as document}<div class="document-row"><span class="file-icon"><Icon name="file" size={21} /></span><div class="document-name"><h4>{document.title}</h4><p>{document.phase} · PDF</p></div>{#if document.href && document.downloadId}<a href={`/downloads/${document.downloadId}`} download aria-label={`Download ${document.title}`} class="document-action">Download</a>{:else}<span class="document-pending">Awaiting final file</span>{/if}</div>{/each}</div></div>
				{/each}
			</div>
			<div class="source-code-row"><h3>Open engineering.</h3><div>{#each projectLinks as link}<a href={link.href} target="_blank" rel="noreferrer">{link.title === 'Website Source Code' ? 'Website' : link.title === 'Mobile Application Source Code' ? 'Mobile app' : 'Firmware'} <span>GitHub</span></a>{/each}<a href="/tasks">Project tasks <span>Archive</span></a></div></div>
		</div>
	</section>

	<section id="team" class="section page-width">
		<div class="section-heading"><div><p class="eyebrow">Meet Group 13</p><h2>The people behind PrecisionShot.</h2></div><p>Four engineers. One shared project.<br />University of Central Florida.</p></div>
		<div class="team-grid">{#each teamMembers as member}<article class="team-member"><div class="team-portrait"><img src={`${imageRoot}${portraits[member.name]}.webp`} alt={member.name} width="320" height="320" loading="lazy" /></div><h3>{member.name}</h3><p>{member.role.replace(' Design Lead', '').replace(' Lead', '')}</p><span>{member.major === 'CpE' ? 'Computer Engineering' : 'Electrical Engineering'}</span></article>{/each}</div>
		<details class="disclosure reviewers"><summary>Faculty & project reviewers <span>With thanks<Icon name="chevron" size={18} /></span></summary><ul>{#each reviewers as reviewer}<li>{reviewer}</li>{/each}</ul></details>
	</section>

	<section id="timeline" class="timeline-section"><div class="page-width section"><div class="timeline-intro"><p class="eyebrow">May–November 2026</p><h2>A project, from the ground up.</h2></div><ol class="milestone-strip">{#each milestones as milestone}<li><p>{milestone.date}</p><h3>{milestone.title}</h3></li>{/each}</ol><details class="disclosure"><summary>Full project timeline <span>Senior Design I & II<Icon name="chevron" size={18} /></span></summary><p class="timeline-note">Approximate milestone dates from ClickUp and course submissions. Due dates fill gaps where completion dates were not recorded.</p><div class="full-timeline">{#each [{ title: 'Senior Design I', items: sd1Timeline }, { title: 'Senior Design II', items: sd2Timeline }] as phase}<div><h3>{phase.title}</h3>{#each phase.items as item}<div class="timeline-row"><p>{item.dates}{phase.title === 'Senior Design I' ? ', 2026' : ''}</p><h4>{item.title}</h4></div>{/each}</div>{/each}</div></details></div></section>
</main>

<dialog bind:this={videoDialog} class="video-dialog" onclose={() => activeVideo = null} aria-labelledby="video-dialog-title">
	{#if activeVideo}
		<div class="video-dialog-header"><h2 id="video-dialog-title">{activeVideo.title}</h2><button class="icon-button" aria-label="Close video" onclick={() => videoDialog?.close()}><Icon name="close" /></button></div>
		<video controls autoplay playsinline preload="metadata" aria-label={activeVideo.title}><source src={activeVideo.href} type="video/mp4" /><track kind="captions" src={`/captions/${activeVideo.downloadId}.en.vtt`} srclang="en" label="English (auto-generated)" /></video>
		<div class="video-dialog-footer"><p>English captions are auto-generated.</p><a href={`/downloads/${activeVideo.downloadId}`} download>Download MP4</a></div>
	{/if}
</dialog>
