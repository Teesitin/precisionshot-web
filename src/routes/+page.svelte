<script lang="ts">
    import SystemBlockDiagram from '$lib/components/diagrams/SystemBlockDiagram.svelte';
    import PCBDesign from '$lib/components/diagrams/PCBDesign.svelte';
    import SoftwareFlowchart from '$lib/components/diagrams/SoftwareFlowchart.svelte';
    import PowerSystemDesign from '$lib/components/diagrams/PowerSystemDesign.svelte';
    import PrototypeEnclosureDesign from '$lib/components/diagrams/PrototypeEnclosureDesign.svelte';

	const teamMembers = [
		{
			name: 'Anthony Fontana',
			major: 'CpE',
			role: 'Hardware Design Lead',
			focus: 'Phototransistor array, PCB planning, power system, and hardware connections.'
		},
		{
			name: 'DeLayne Russell',
			major: 'CpE',
			role: 'Software Design Lead',
			focus: 'Shot detection logic, scoring, calibration, display output, and user controls.'
		},
		{
			name: 'Kenn Pickavance',
			major: 'EE',
			role: 'Specifications and Research Lead',
			focus: 'Project goals, objectives, requirements, research, and measurable specs.'
		},
		{
			name: 'Nicolas Koteff',
			major: 'EE',
			role: 'Prototype and Enclosure Lead',
			focus: 'Target layout, enclosure design, mounting system, and physical structure.'
		}
	];

	const reviewers = ['Dr. Wayesh Qarony', 'Dr. Jaesung Lee', 'Dr. Hadi Kamali'];

    const resourceSections = [
        {
            title: 'Documents',
            description: 'Senior Design reports and written submissions.',
            items: [
                { title: 'Divide and Conquer Document', href: 'https://delayne.b-cdn.net/precisionshot/Divide%20%26%20Conquer%20Document%20and%20Committee%20Formation%20-%20Senior%20Design%201%20(12).pdf', phase: 'SD1', type: 'PDF Document', action: 'Download' },
                { title: 'Midterm Milestone Report', href: '', phase: 'SD1', type: 'PDF Document', action: 'Download' },
                { title: 'SD1 Final Report', href: '', phase: 'SD1', type: 'PDF Document', action: 'Download' },
                { title: '8-Page Conference Paper', href: '', phase: 'SD2', type: 'PDF Document', action: 'Download' },
                { title: 'SD2 Final Report', href: '', phase: 'SD2', type: 'PDF Document', action: 'Download' }
            ]
        },
        {
            title: 'Project Management',
            description: 'Public project planning views for task tracking and milestones.',
            items: [
                { title: 'Project Management List', href: 'https://sharing.clickup.com/9014347314/l/h/5-90149820943-1/262217573a79715', phase: 'SD1', type: 'Public Link', action: 'Open' },
                { title: 'Project Management Board', href: 'https://sharing.clickup.com/9014347314/b/h/5-90149820943-2/8e160dc482a03a9', phase: 'SD1', type: 'Public Link', action: 'Open' },
                { title: 'Project Management Gantt Chart', href: 'https://sharing.clickup.com/9014347314/g/h/8cmr1hj-874/21183ef8d0e8e99', phase: 'SD1', type: 'Public Link', action: 'Open' }
            ]
        },
        {
            title: 'Slides',
            description: 'Presentation slide decks for Senior Design checkpoints.',
            items: [
                { title: 'CDR Presentation Slides', href: '', phase: 'SD2', type: 'PowerPoint', action: 'Download' },
                { title: 'Final Presentation Slides', href: '', phase: 'SD2', type: 'PowerPoint', action: 'Download' }
            ]
        }
    ];

    const videos = [
        { title: 'Mini Demo Video', href: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ&list=RDdQw4w9WgXcQ&start_radio=1', phase: 'SD1', type: 'YouTube Video', action: 'Watch' },
        { title: 'CDR Presentation Video', href: '', phase: 'SD2', type: 'YouTube Video', action: 'Watch' },
        { title: 'Midterm Demonstration Video', href: '', phase: 'SD2', type: 'YouTube Video', action: 'Watch' },
        { title: 'Final Presentation Video', href: '', phase: 'SD2', type: 'YouTube Video', action: 'Watch' },
        { title: 'Final Demonstration Video', href: '', phase: 'SD2', type: 'YouTube Video', action: 'Watch' }
    ];

    const sd1Timeline = [
        { week: 'Week of May 25, 2026', dates: 'May 28 - May 29', title: 'Project Start', items: ['Begin Senior Design 1', 'Confirm project idea', 'Form group roles', 'Submit initial Divide and Conquer report'] },
        { week: 'Week of June 1, 2026', dates: 'June 1 - June 5', title: 'D&C Review and Planning', items: ['Attend D&C group meeting', 'Update project direction', 'Create task list', 'Start website structure'] },
        { week: 'Week of June 8, 2026', dates: 'June 8 - June 12', title: 'Website and D&C Update', items: ['Update Divide and Conquer document', 'Upload D&C document to website', 'Add project overview and team information'] },
        { week: 'Week of June 15, 2026', dates: 'June 15 - June 19', title: 'Early Design Work', items: ['Refine system requirements', 'Create early hardware diagram', 'Create early software diagram', 'Begin component research'] },
        { week: 'Week of June 22, 2026', dates: 'June 22 - June 26', title: 'Design and Research Push', items: ['Finish ABET lectures', 'Continue PCB and power research', 'Plan prototype approach', 'Update design outline'] },
        { week: 'Week of June 29, 2026', dates: 'June 29 - July 3', title: 'Midterm Report Prep', items: ['Draft midterm milestone report', 'Update diagrams', 'Review component choices', 'Prepare website updates'] },
        { week: 'Week of July 6, 2026', dates: 'July 6 - July 10', title: 'Midterm Report', items: ['Submit Midterm Report', 'Attend Midterm Report group meeting', 'Record instructor feedback', 'Update project plan'] },
        { week: 'Week of July 13, 2026', dates: 'July 13 - July 17', title: 'Midterm Website Update', items: ['Update and upload Midterm Report', 'Revise website content', 'Clean document and video placeholders', 'Continue final report writing'] },
        { week: 'Week of July 20, 2026', dates: 'July 20 - July 24', title: 'Final SD1 Push', items: ['Finish SD1 final report draft', 'Prepare mini demo plan', 'Finalize design sections', 'Review website for missing content'] },
        { week: 'Week of July 27, 2026', dates: 'July 27 - July 28', title: 'SD1 Final Submission', items: ['Submit SD1 Final Report', 'Submit Mini Demo Video', 'Finalize SD1 website content'] }
    ];

    const sd2Timeline = [
        { week: 'Week 1', dates: 'TBD', title: 'Component Ordering', items: ['Order required components', 'Confirm PCB/component availability', 'Prepare testing plan'] },
        { week: 'Week 2', dates: 'TBD', title: 'Sensor Testing', items: ['Test phototransistors with laser input', 'Test LED or display feedback', 'Record early testing results'] },
        { week: 'Week 3', dates: 'TBD', title: 'Small Prototype', items: ['Build small-scale sensor array', 'Test microcontroller input/output', 'Begin basic shot detection code'] },
        { week: 'Week 4', dates: 'TBD', title: 'PCB Design', items: ['Finish PCB schematic', 'Create PCB layout', 'Review power and signal routing'] },
        { week: 'Week 5', dates: 'TBD', title: 'PCB Assembly', items: ['Order PCB', 'Assemble board', 'Check voltage rails and sensor connections'] },
        { week: 'Week 6', dates: 'TBD', title: 'Software Integration', items: ['Program shot detection logic', 'Program scoring logic', 'Program user interface modes'] },
        { week: 'Week 7', dates: 'TBD', title: 'Enclosure Build', items: ['Build target enclosure', 'Mount PCB and sensors', 'Add display, buttons, and battery access'] },
        { week: 'Week 8', dates: 'TBD', title: 'System Integration', items: ['Combine hardware and software', 'Debug full prototype', 'Test calibration in different lighting conditions'] },
        { week: 'Week 9', dates: 'TBD', title: 'Final Testing', items: ['Test accuracy and response time', 'Fix prototype issues', 'Document results'] },
        { week: 'Week 10', dates: 'TBD', title: 'Final Presentation and Demo', items: ['Prepare final presentation', 'Record final demonstration', 'Complete final website updates'] }
    ];
</script>

<svelte:head>
	<title>PrecisionShot Training System</title>
	<meta name="description" content="PrecisionShot is a UCF Senior Design project focused on a smart laser target system that tracks shot accuracy and gives real-time feedback."/>
</svelte:head>

<main>
    <!-- MainHeor -->
    <section id="home" class="relative overflow-hidden border-b border-slate-800 bg-linear-to-br from-slate-950 via-slate-900 to-secondary/40">
        <div class="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-accent/20 blur-3xl"></div>
        <div class="pointer-events-none absolute -bottom-32 right-0 h-96 w-96 rounded-full bg-secondary/40 blur-3xl"></div>
        <div class="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-linear-to-t from-slate-950 to-transparent"></div>		
        
        <div class="mx-auto max-w-6xl px-6 py-20">
			<p class="mb-4 text-sm font-bold uppercase tracking-widest text-accent">
				UCF Senior Design - Group 13
			</p>

			<h1 class="text-4xl font-blackops text-white md:text-6xl">
				PrecisionShot Training System
			</h1>

			<p class="mt-6 max-w-3xl text-lg leading-8 text-slate-300">
				A smart laser-based target system that detects shot placement and provides real-time
				training feedback.
			</p>

			<div class="mt-8 flex flex-wrap gap-4">
                <a href="#documents" class="rounded bg-accent px-5 py-3 font-bold text-slate-950 transition-colors hover:bg-accent/80">
                    View Documents
                </a>

                <a href="#project" class="rounded border border-secondary px-5 py-3 font-bold text-slate-100 transition-colors hover:bg-secondary/30">
                    Project Overview
                </a>
			</div>
		</div>
	</section>

    <!-- Team -->
	<section id="team" class="border-b border-slate-800 bg-slate-900">
		<div class="mx-auto max-w-6xl px-6 py-16">
			<h2 class="text-3xl font-blackops text-accent">Team</h2>

			<div class="mt-8 grid gap-4 md:grid-cols-2">
				{#each teamMembers as member}
					<div class="rounded border border-slate-700 bg-slate-950 p-5">
						<p class="text-sm font-bold text-accent">{member.major}</p>
						<h3 class="mt-2 text-xl font-bold text-white">{member.name}</h3>
						<p class="mt-1 text-slate-300">{member.role}</p>
						<p class="mt-3 text-sm leading-6 text-slate-400">{member.focus}</p>
					</div>
				{/each}
			</div>

			<div class="mt-8 rounded border border-slate-700 bg-slate-950 p-5">
				<h3 class="text-xl font-bold text-white">Reviewers</h3>

				<ul class="mt-3 list-disc space-y-1 pl-5 text-slate-300">
					{#each reviewers as reviewer}
						<li>{reviewer}</li>
					{/each}
				</ul>
			</div>
		</div>
	</section>

    <!-- Project Overview -->
    <section id="project" class="scroll-mt-24 border-b border-slate-800 bg-slate-950">
        <div class="mx-auto max-w-6xl px-6 py-16">
            <h2 class="text-3xl font-blackops text-accent">Project Overview</h2>

            <div class="mt-6 flex flex-wrap gap-3">
                <a href="#project-description" class="rounded border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-bold text-slate-300 transition-colors hover:border-accent hover:bg-slate-800 hover:text-accent">
                    Description
                </a>

                <a href="#project-motivation" class="rounded border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-bold text-slate-300 transition-colors hover:border-accent hover:bg-slate-800 hover:text-accent">
                    Motivation
                </a>

                <a href="#project-functionality" class="rounded border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-bold text-slate-300 transition-colors hover:border-accent hover:bg-slate-800 hover:text-accent">
                    Functionality
                </a>

                <a href="#project-goals" class="rounded border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-bold text-slate-300 transition-colors hover:border-accent hover:bg-slate-800 hover:text-accent">
                    Goals
                </a>

                <a href="#project-objectives" class="rounded border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-bold text-slate-300 transition-colors hover:border-accent hover:bg-slate-800 hover:text-accent">
                    Objectives
                </a>

                <a href="#project-sponsorship" class="rounded border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-bold text-slate-300 transition-colors hover:border-accent hover:bg-slate-800 hover:text-accent">
                    Sponsorship
                </a>
            </div>

            <div class="mt-8 space-y-8 text-slate-300">
                <div id="project-description" class="scroll-mt-24 rounded border border-slate-800 bg-slate-900 p-5">
                    <h3 class="text-xl font-bold text-white">Project Description</h3>
                    <p class="mt-2 leading-7">
                        PrecisionShot is a smart laser-based training target designed to detect where a laser shot lands and provide real-time feedback to the user. The system is intended to make dry-fire training more useful by showing shot placement instead of only showing whether the target was hit or missed. The project combines a phototransistor sensor array, a microcontroller, visual feedback, a rechargeable power system, and a physical enclosure into one portable training device.
                    </p>
                    <p class="mt-2 text-sm text-slate-500">
                        Replace this with the final approved project description if the report wording changes.
                    </p>
                </div>

                <div id="project-motivation" class="scroll-mt-24 rounded border border-slate-800 bg-slate-900 p-5">
                    <h3 class="text-xl font-bold text-white">Motivation and Background</h3>
                    <p class="mt-2 leading-7">
                        Traditional firearm training usually requires live ammunition, a safe range location, and proper ventilation or safety equipment. This can make training expensive, less convenient, and harder to practice regularly. PrecisionShot is being designed as a lower-cost training option that allows users to practice aiming with a laser-based system instead of live ammunition.
                    </p>
                    <p class="mt-2 leading-7">
                        The goal is not to replace all live-fire training, but to provide a practical dry-fire tool that helps users practice more often and receive better feedback while training indoors or in controlled environments.
                    </p>
                </div>

                <div id="project-functionality" class="scroll-mt-24 rounded border border-slate-800 bg-slate-900 p-5">
                    <h3 class="text-xl font-bold text-white">Main Functionality</h3>
                    <ul class="mt-3 list-disc space-y-2 pl-5 leading-7">
                        <li>Detect incoming laser shots using a phototransistor sensor array.</li>
                        <li>Estimate the location of the laser impact on the target surface.</li>
                        <li>Show shot feedback using LEDs, a display, or another output method.</li>
                        <li>Allow the user to change modes, reset the system, and manage training feedback.</li>
                        <li>Run from a rechargeable battery so the target can be portable.</li>
                        <li>Use a physical enclosure that protects the electronics and helps control ambient light.</li>
                    </ul>
                </div>

                <div id="project-goals" class="scroll-mt-24 rounded border border-slate-800 bg-slate-900 p-5">
                    <h3 class="text-xl font-bold text-white">Project Goals</h3>
                    <ul class="mt-3 list-disc space-y-2 pl-5 leading-7">
                        <li>Develop a target system that can detect and show laser shot placement.</li>
                        <li>Create multiple settings or training modes for different practice options.</li>
                        <li>Make the system usable in indoor lighting and, if possible, outdoor daylight.</li>
                        <li>Design the system around rechargeable battery power.</li>
                        <li>Build a clean housing and stand or mounting system for the target.</li>
                    </ul>
                </div>

                <div id="project-objectives" class="scroll-mt-24 rounded border border-slate-800 bg-slate-900 p-5">
                    <h3 class="text-xl font-bold text-white">Project Objectives</h3>
                    <ul class="mt-3 list-disc space-y-2 pl-5 leading-7">
                        <li>Develop an array of phototransistors that can detect incoming laser shots.</li>
                        <li>Process sensor data with a microcontroller to determine shot location.</li>
                        <li>Display shot feedback clearly to the user.</li>
                        <li>Support buttons or controls for reset, mode selection, and calibration.</li>
                        <li>Target a response time of about 100 ms for detecting and displaying shot placement.</li>
                        <li>Design toward a usage distance of 10 meters or more.</li>
                        <li>Reduce false readings from ambient light through calibration and physical light control.</li>
                    </ul>
                </div>

                <div id="project-sponsorship" class="scroll-mt-24 rounded border border-slate-800 bg-slate-900 p-5">
                    <h3 class="text-xl font-bold text-white">Acknowledgment and Sponsorship</h3>
                    <p class="mt-2 leading-7">
                        This project is currently self-funded by the PrecisionShot team. The estimated prototype budget is around $500, with the cost shared between team members over the project timeline.
                    </p>
                    <p class="mt-2 leading-7">
                        If sponsorship or outside funding is received, sponsor information and at least one sponsor contact will be added here.
                    </p>
                    <p class="mt-2 text-sm text-slate-500">
                        Replace this section with final sponsor details if sponsorship is added.
                    </p>
                </div>
            </div>
        </div>
    </section>

    <!-- Design Outline -->
    <section id="design" class="scroll-mt-24 border-b border-slate-800 bg-slate-900">
        <div class="mx-auto max-w-6xl px-6 py-16">
            <h2 class="text-3xl font-blackops text-accent">Design Outline</h2>

            <p class="mt-3 max-w-3xl leading-7 text-slate-400">
                This section contains early demo diagrams and proof-of-concept design outlines. These diagrams are placeholders for now and will be updated as the final hardware, software, PCB, power, and enclosure designs become more complete.
            </p>

            <div class="mt-8 space-y-6">
                <SystemBlockDiagram />
                <PCBDesign />
                <SoftwareFlowchart />
                <PowerSystemDesign />
                <PrototypeEnclosureDesign />
            </div>
        </div>
    </section>

    <!-- Documents and Slides -->
    <section id="documents" class="scroll-mt-24 border-b border-slate-800 bg-slate-950">
        <div class="mx-auto max-w-6xl px-6 py-16">
            <h2 class="text-3xl font-blackops text-accent">Documents and Slides</h2>

            <p class="mt-3 max-w-3xl leading-7 text-slate-400">
                This section contains project documents, presentation materials, and public project management links.
            </p>

            <div class="mt-8 space-y-10">
                {#each resourceSections as section}
                    <div>
                        <div class="border-b border-slate-800 pb-3">
                            <h3 class="text-xl font-bold text-white">{section.title}</h3>
                            <p class="mt-1 text-sm text-slate-500">{section.description}</p>
                        </div>

                        <div class="mt-5 grid gap-4 md:grid-cols-2">
                            {#each section.items as item}
                                {#if item.href}
                                    <a href={item.href} target="_blank" rel="noreferrer" class="group rounded border border-slate-700 bg-slate-900 p-5 transition-colors hover:border-accent hover:bg-slate-800">
                                        <div class="flex flex-wrap items-center gap-2">
                                            <p class="rounded bg-accent px-2 py-1 text-xs font-bold text-slate-950">{item.phase}</p>
                                            <p class="rounded border border-slate-700 px-2 py-1 text-xs font-bold text-slate-400">{item.type}</p>
                                        </div>

                                        <h4 class="mt-4 font-bold text-white">{item.title}</h4>

                                        <p class="mt-3 text-sm text-slate-500">
                                            <span class="text-accent group-hover:underline">{item.action}</span>
                                            <span> this resource.</span>
                                        </p>
                                    </a>
                                {:else}
                                    <div class="rounded border border-slate-800 bg-slate-900/60 p-5 opacity-70">
                                        <div class="flex flex-wrap items-center gap-2">
                                            <p class="rounded bg-slate-700 px-2 py-1 text-xs font-bold text-slate-300">{item.phase}</p>
                                            <p class="rounded border border-slate-700 px-2 py-1 text-xs font-bold text-slate-500">{item.type}</p>
                                        </div>

                                        <h4 class="mt-4 font-bold text-slate-300">{item.title}</h4>

                                        <p class="mt-3 text-sm text-slate-500">
                                            Unavailable at this time.
                                        </p>
                                    </div>
                                {/if}
                            {/each}
                        </div>
                    </div>
                {/each}
            </div>
        </div>
    </section>

    <!-- Videos -->
    <section id="videos" class="scroll-mt-24 border-b border-slate-800 bg-slate-900">
        <div class="mx-auto max-w-6xl px-6 py-16">
            <h2 class="text-3xl font-blackops text-accent">Videos</h2>

            <p class="mt-3 max-w-3xl leading-7 text-slate-400">
                This section will include YouTube links for required Senior Design demonstration and presentation videos as they become available.
            </p>

            <div class="mt-8 grid gap-4 md:grid-cols-2">
                {#each videos as video}
                    {#if video.href}
                        <a href={video.href} target="_blank" rel="noreferrer" class="group rounded border border-slate-700 bg-slate-950 p-5 transition-colors hover:border-accent hover:bg-slate-800">
                            <div class="flex flex-wrap items-center gap-2">
                                <p class="rounded bg-accent px-2 py-1 text-xs font-bold text-slate-950">{video.phase}</p>
                                <p class="rounded border border-slate-700 px-2 py-1 text-xs font-bold text-slate-400">{video.type}</p>
                            </div>

                            <h3 class="mt-4 font-bold text-white">{video.title}</h3>

                            <p class="mt-3 text-sm text-slate-500">
                                <span class="text-accent group-hover:underline">{video.action}</span>
                                <span> this video.</span>
                            </p>
                        </a>
                    {:else}
                        <div class="rounded border border-slate-800 bg-slate-950/70 p-5 opacity-70">
                            <div class="flex flex-wrap items-center gap-2">
                                <p class="rounded bg-slate-700 px-2 py-1 text-xs font-bold text-slate-300">{video.phase}</p>
                                <p class="rounded border border-slate-700 px-2 py-1 text-xs font-bold text-slate-500">{video.type}</p>
                            </div>

                            <h3 class="mt-4 font-bold text-slate-300">{video.title}</h3>

                            <p class="mt-3 text-sm text-slate-500">
                                Unavailable at this time.
                            </p>
                        </div>
                    {/if}
                {/each}
            </div>
        </div>
    </section>

    <!-- Timeline -->
    <section id="timeline" class="scroll-mt-24 bg-slate-950">
        <div class="mx-auto max-w-6xl px-6 py-16">
            <h2 class="text-3xl font-blackops text-accent">Timeline</h2>

            <p class="mt-3 max-w-3xl leading-7 text-slate-400">
                This is a rough project timeline based on current Senior Design milestones.
            </p>

            <div class="mt-10 space-y-10">
                <div>
                    <div class="border-b border-slate-800 pb-3">
                        <h3 class="text-2xl font-bold text-white">Senior Design 1</h3>
                        <p class="mt-1 text-sm text-slate-500">Planning, research, documentation, website setup, and early design work.</p>
                    </div>

                    <div class="mt-6 space-y-4">
                        {#each sd1Timeline as item}
                            <div class="rounded border border-slate-700 bg-slate-900 p-5">
                                <div class="flex flex-wrap items-start justify-between gap-3">
                                    <div>
                                        <p class="text-sm font-bold text-accent">{item.week}</p>
                                        <h4 class="mt-1 text-xl font-bold text-white">{item.title}</h4>
                                    </div>

                                    <p class="rounded border border-slate-700 px-3 py-1 text-sm font-bold text-slate-400">{item.dates}</p>
                                </div>

                                <ul class="mt-4 list-disc space-y-2 pl-5 text-slate-300">
                                    {#each item.items as task}
                                        <li>{task}</li>
                                    {/each}
                                </ul>
                            </div>
                        {/each}
                    </div>
                </div>

                <div>
                    <div class="border-b border-slate-800 pb-3">
                        <h3 class="text-2xl font-bold text-white">Senior Design 2</h3>
                        <p class="mt-1 text-sm text-slate-500">Prototype build, integration, testing, final presentation, and demonstration.</p>
                    </div>

                    <div class="mt-6 space-y-4">
                        {#each sd2Timeline as item}
                            <div class="rounded border border-slate-700 bg-slate-900 p-5">
                                <div class="flex flex-wrap items-start justify-between gap-3">
                                    <div>
                                        <p class="text-sm font-bold text-accent">{item.week}</p>
                                        <h4 class="mt-1 text-xl font-bold text-white">{item.title}</h4>
                                    </div>

                                    <p class="rounded border border-slate-700 px-3 py-1 text-sm font-bold text-slate-400">{item.dates}</p>
                                </div>

                                <ul class="mt-4 list-disc space-y-2 pl-5 text-slate-300">
                                    {#each item.items as task}
                                        <li>{task}</li>
                                    {/each}
                                </ul>
                            </div>
                        {/each}
                    </div>
                </div>
            </div>
        </div>
    </section>
</main>