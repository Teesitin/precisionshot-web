<script lang="ts">
	import MermaidDiagram from '$lib/components/MermaidDiagram.svelte';
	import { flowcharts } from '$lib/flowcharts';

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

	const reviewers = [
		'Dr. Azadeh Vosoughi',
		'Dr. Hadi Mardani Kamali',
		'Dr. Jaesung Lee',
		'Dr. Kimia Zamiri Azar',
		'Dr. Saikat Dey',
		'Shady Elashhab',
		'Dr. Wayesh Qarony',
		'Dr. Lei Wei',
		'Sreeram Sundaresh'
	];

    const resourceSections = [
        {
            title: 'Documents',
            description: 'Senior Design reports and written submissions.',
            items: [
                { title: 'Divide and Conquer Document', href: 'https://delayne.b-cdn.net/precisionshot/Divide%20%26%20Conquer%20Document%20and%20Committee%20Formation%20-%20Senior%20Design%201%20(12).pdf', phase: 'SD1', type: 'PDF Document', action: 'Download' },
                { title: 'Midterm Report', href: 'https://delayne.b-cdn.net/precisionshot/Midterm%20Report%20-%20Senior%20Design%201%20(1).pdf', phase: 'SD1', type: 'PDF Document', action: 'Download' },
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
        { title: 'Mini Demo Video', href: 'https://delayne.b-cdn.net/precisionshot/PrecisionShot_SD1_Mini_Demo_2026-07-27.mp4', phase: 'SD1', type: 'Video', action: 'Watch' },
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
	<meta name="description" content="PrecisionShot is a UCF Senior Design project focused on a smart laser target system that tracks shot accuracy and gives real-time feedback." />
</svelte:head>

<main class="bg-slate-50 text-slate-950 transition-colors dark:bg-slate-950 dark:text-slate-100">
	<!-- MainHero -->
	<section id="home" class="relative isolate min-h-175 overflow-hidden border-b border-slate-200 bg-white transition-colors dark:border-slate-800 dark:bg-slate-950">
		<video class="absolute inset-0 h-full w-full object-cover" autoplay muted loop playsinline preload="metadata" aria-hidden="true">
			<source src="https://delayne.b-cdn.net/precisionshot/temporary-demo-ai-generated-not-finale.mp4" type="video/mp4" />
		</video>

		<div class="absolute inset-0 bg-white/48 dark:bg-slate-950/66"></div>
		<div class="absolute inset-0 bg-linear-to-r from-white via-white/85 to-white/30 dark:from-slate-950 dark:via-slate-950/76 dark:to-slate-950/28"></div>
		<div class="absolute inset-0 bg-linear-to-t from-white via-white/20 to-transparent dark:from-slate-950 dark:via-slate-950/30"></div>
		<div class="absolute inset-0 bg-[radial-gradient(circle_at_18%_22%,rgba(236,211,22,0.16),transparent_30%),radial-gradient(circle_at_88%_48%,rgba(236,211,22,0.16),transparent_34%),radial-gradient(circle_at_82%_58%,rgba(127,104,63,0.16),transparent_38%)] dark:bg-[radial-gradient(circle_at_18%_22%,rgba(236,211,22,0.14),transparent_30%),radial-gradient(circle_at_88%_48%,rgba(236,211,22,0.10),transparent_34%),radial-gradient(circle_at_82%_58%,rgba(127,104,63,0.24),transparent_38%)]"></div>

		<div class="pointer-events-none absolute -right-28 top-1/2 hidden aspect-square w-152 -translate-y-1/2 text-slate-950/14 opacity-70 lg:block dark:text-accent/10 dark:opacity-60">
			<svg class="h-full w-full drop-shadow-[0_18px_45px_rgba(15,23,42,0.16)] dark:drop-shadow-[0_0_36px_rgba(236,211,22,0.10)]" viewBox="0 0 600 600" fill="none" aria-hidden="true">
				<circle cx="300" cy="300" r="250" stroke="currentColor" stroke-width="2" />
				<circle cx="300" cy="300" r="185" stroke="currentColor" stroke-width="2" />
				<circle cx="300" cy="300" r="118" stroke="currentColor" stroke-width="2" />
				<circle cx="300" cy="300" r="52" stroke="currentColor" stroke-width="2" />
				<path d="M300 22V120" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
				<path d="M300 480V578" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
				<path d="M22 300H120" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
				<path d="M480 300H578" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
				<path d="M300 242V358" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
				<path d="M242 300H358" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
				<circle cx="300" cy="300" r="7" class="fill-accent text-accent opacity-80" />
			</svg>
		</div>

		<div class="pointer-events-none absolute right-10 top-1/2 hidden h-56 w-56 -translate-y-1/2 rounded-full bg-accent/10 blur-3xl lg:block dark:bg-accent/8"></div>

		<div class="relative z-10 mx-auto flex min-h-175 max-w-6xl items-center px-6 py-20">
			<div class="max-w-3xl">
				<div class="mb-5 inline-flex items-center gap-3 rounded-full border border-slate-950/10 bg-white/75 px-4 py-2 text-xs font-black uppercase tracking-widest text-slate-950 shadow-lg backdrop-blur-md dark:border-white/15 dark:bg-white/10 dark:text-accent">
					<span class="h-2 w-2 rounded-full bg-accent shadow-[0_0_14px_rgba(236,211,22,0.9)]"></span>
					UCF Senior Design - Group 13
				</div>

				<h1 class="font-blackops max-w-3xl text-4xl leading-tight text-slate-950 drop-shadow-[0_3px_18px_rgba(255,255,255,0.7)] sm:text-5xl md:text-6xl dark:text-white dark:drop-shadow-2xl">
					PrecisionShot Training System
				</h1>

				<p class="mt-5 max-w-2xl text-lg leading-8 text-slate-700 drop-shadow-[0_2px_12px_rgba(255,255,255,0.9)] md:text-xl dark:text-slate-200 dark:drop-shadow-lg">
					A smart laser-based target system that detects shot placement and provides real-time training feedback.
				</p>

				<div class="mt-8 flex flex-wrap gap-4">
					<a href="#documents" class="rounded bg-accent px-5 py-3 text-sm font-bold text-slate-950 shadow-[0_0_30px_rgba(236,211,22,0.24)] transition-all hover:-translate-y-0.5 hover:bg-accent/85 hover:shadow-[0_0_40px_rgba(236,211,22,0.38)]">
						View Documents
					</a>
					<a href="#project" class="rounded border border-slate-950/15 bg-white/70 px-5 py-3 text-sm font-bold text-slate-950 shadow-lg backdrop-blur-md transition-all hover:-translate-y-0.5 hover:border-accent/70 hover:bg-white/90 dark:border-white/25 dark:bg-white/10 dark:text-white dark:hover:bg-white/20">
						Project Overview
					</a>
				</div>

				<div class="mt-10 grid max-w-2xl grid-cols-1 gap-4 sm:grid-cols-3">
					<div class="rounded-xl border border-slate-950/10 bg-white/75 p-4 shadow-lg backdrop-blur-md transition-all hover:-translate-y-1 hover:bg-white/90 dark:border-white/10 dark:bg-white/10 dark:hover:bg-white/15">
						<p class="text-xl font-black text-slate-950 dark:text-white">Laser</p>
						<p class="mt-1 text-sm text-slate-600 dark:text-slate-300">Shot detection</p>
					</div>

					<div class="rounded-xl border border-slate-950/10 bg-white/75 p-4 shadow-lg backdrop-blur-md transition-all hover:-translate-y-1 hover:bg-white/90 dark:border-white/10 dark:bg-white/10 dark:hover:bg-white/15">
						<p class="text-xl font-black text-slate-950 dark:text-white">Real-Time</p>
						<p class="mt-1 text-sm text-slate-600 dark:text-slate-300">Training feedback</p>
					</div>

					<div class="rounded-xl border border-slate-950/10 bg-white/75 p-4 shadow-lg backdrop-blur-md transition-all hover:-translate-y-1 hover:bg-white/90 dark:border-white/10 dark:bg-white/10 dark:hover:bg-white/15">
						<p class="text-xl font-black text-slate-950 dark:text-white">Wireless</p>
						<p class="mt-1 text-sm text-slate-600 dark:text-slate-300">Portable system</p>
					</div>
				</div>
			</div>
		</div>
	</section>

	<!-- Team -->
	<section id="team" class="border-b border-slate-200 bg-white transition-colors dark:border-slate-800 dark:bg-slate-900">
		<div class="mx-auto max-w-6xl px-6 py-16">
			<h2 class="font-blackops text-3xl text-accent">Team</h2>

			<div class="mt-8 grid gap-4 md:grid-cols-2">
				{#each teamMembers as member}
					<div class="rounded border border-slate-200 bg-slate-50 p-5 transition-colors dark:border-slate-700 dark:bg-slate-950">
						<p class="text-sm font-bold text-accent">{member.major}</p>
						<h3 class="mt-2 text-xl font-bold text-slate-950 dark:text-white">{member.name}</h3>
						<p class="mt-1 text-slate-700 dark:text-slate-300">{member.role}</p>
						<p class="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">{member.focus}</p>
					</div>
				{/each}
			</div>

			<div class="mt-8 rounded border border-slate-200 bg-slate-50 p-5 transition-colors dark:border-slate-700 dark:bg-slate-950">
				<h3 class="text-xl font-bold text-slate-950 dark:text-white">Reviewers</h3>

				<ul class="mt-3 list-disc space-y-1 pl-5 text-slate-700 dark:text-slate-300">
					{#each reviewers as reviewer}
						<li>{reviewer}</li>
					{/each}
				</ul>
			</div>
		</div>
	</section>

	<!-- Project Overview -->
	<section id="project" class="scroll-mt-24 border-b border-slate-200 bg-slate-50 transition-colors dark:border-slate-800 dark:bg-slate-950">
		<div class="mx-auto max-w-6xl px-6 py-16">
			<h2 class="font-blackops text-3xl text-accent">Project Overview</h2>

			<div class="mt-6 flex flex-wrap gap-3">
				<a href="#project-description" class="rounded border border-slate-300 bg-white px-4 py-2 text-sm font-bold text-slate-700 transition-colors hover:border-accent hover:bg-slate-100 hover:text-accent dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800">Description</a>
				<a href="#project-motivation" class="rounded border border-slate-300 bg-white px-4 py-2 text-sm font-bold text-slate-700 transition-colors hover:border-accent hover:bg-slate-100 hover:text-accent dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800">Motivation</a>
				<a href="#project-functionality" class="rounded border border-slate-300 bg-white px-4 py-2 text-sm font-bold text-slate-700 transition-colors hover:border-accent hover:bg-slate-100 hover:text-accent dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800">Functionality</a>
				<a href="#project-goals" class="rounded border border-slate-300 bg-white px-4 py-2 text-sm font-bold text-slate-700 transition-colors hover:border-accent hover:bg-slate-100 hover:text-accent dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800">Goals</a>
				<a href="#project-objectives" class="rounded border border-slate-300 bg-white px-4 py-2 text-sm font-bold text-slate-700 transition-colors hover:border-accent hover:bg-slate-100 hover:text-accent dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800">Objectives</a>
				<a href="#project-requirements" class="rounded border border-slate-300 bg-white px-4 py-2 text-sm font-bold text-slate-700 transition-colors hover:border-accent hover:bg-slate-100 hover:text-accent dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800">Requirements</a>
				<a href="#project-sponsorship" class="rounded border border-slate-300 bg-white px-4 py-2 text-sm font-bold text-slate-700 transition-colors hover:border-accent hover:bg-slate-100 hover:text-accent dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800">Sponsorship</a>
			</div>

			<div class="mt-8 space-y-8 text-slate-700 dark:text-slate-300">
				<div id="project-description" class="scroll-mt-24 rounded border border-slate-200 bg-white p-5 transition-colors dark:border-slate-800 dark:bg-slate-900">
					<h3 class="text-xl font-bold text-slate-950 dark:text-white">Project Description</h3>

					<p class="mt-2 leading-7">
						PrecisionShot is a smart laser-based training system designed to detect where a laser shot lands on a physical target and provide real-time feedback to the user. Instead of functioning as a simple hit-or-miss target, the system is being developed as a complete training platform that can track shot placement, calculate scoring data, display immediate feedback, and send training information to a companion mobile application.
					</p>

					<p class="mt-2 leading-7">
						The target uses a dense phototransistor sensor array to detect incoming laser energy directly on the target surface. The embedded ESP32-S3 control system processes the sensor readings, filters out ambient light, estimates the shot location, updates the target display and LED feedback system, stores useful training data, and communicates with the mobile app through Bluetooth Low Energy.
					</p>
				</div>

				<div id="project-motivation" class="scroll-mt-24 rounded border border-slate-200 bg-white p-5 transition-colors dark:border-slate-800 dark:bg-slate-900">
					<h3 class="text-xl font-bold text-slate-950 dark:text-white">Motivation and Background</h3>

					<p class="mt-2 leading-7">
						Traditional firearm training often requires live ammunition, a safe range facility, travel time, range fees, and equipment capable of safely handling fired rounds. These requirements can make regular practice expensive and inconvenient. PrecisionShot is intended to provide a lower-cost and more accessible dry-fire training option by allowing users to practice with a laser-based system instead of live ammunition.
					</p>

					<p class="mt-2 leading-7">
						The system is also designed to improve the quality of training by giving users immediate feedback after each shot. Instead of interrupting practice to inspect a paper target, users can view shot placement, score, distance, session history, and performance trends directly through the target interface or the mobile app. This helps users identify patterns, make corrections faster, and track long-term improvement over multiple sessions.
					</p>
				</div>

				<div id="project-functionality" class="scroll-mt-24 rounded border border-slate-200 bg-white p-5 transition-colors dark:border-slate-800 dark:bg-slate-900">
					<h3 class="text-xl font-bold text-slate-950 dark:text-white">Main Functionality</h3>

					<ul class="mt-3 list-disc space-y-2 pl-5 leading-7">
						<li>Detect incoming laser shots using a phototransistor sensor array built into the target face.</li>
						<li>Estimate shot location using sensor readings, threshold filtering, and weighted position logic.</li>
						<li>Provide immediate physical feedback through the LED hit indicator system and onboard TFT display.</li>
						<li>Support multiple training modes such as Freestyle, Classic, Rapid, and Moving Target modes.</li>
						<li>Allow users to control target settings using physical buttons and the onboard display.</li>
						<li>Connect to a companion mobile app through Bluetooth Low Energy for remote control and training analytics.</li>
						<li>Store shot history, scores, distance settings, calibration values, and session data locally on the phone.</li>
						<li>Operate as a standalone target even when the mobile app is not connected.</li>
						<li>Use a rechargeable power source so the system can remain portable and wireless during training.</li>
						<li>Use a physical enclosure that protects the electronics while reducing unwanted ambient light exposure.</li>
					</ul>
				</div>

				<div id="project-goals" class="scroll-mt-24 rounded border border-slate-200 bg-white p-5 transition-colors dark:border-slate-800 dark:bg-slate-900">
					<h3 class="text-xl font-bold text-slate-950 dark:text-white">Project Goals</h3>

					<ul class="mt-3 list-disc space-y-2 pl-5 leading-7">
						<li>Develop a target system that can detect laser shots and show accurate shot placement.</li>
						<li>Provide real-time visual feedback using LEDs, an onboard display, and the companion mobile app.</li>
						<li>Use a rechargeable battery or commercial power bank so the target can operate wirelessly.</li>
						<li>Allow target modes and settings to be controlled using onboard buttons and a screen.</li>
						<li>Include user statistics and training history through the mobile app and local storage.</li>
						<li>Support distance settings so training data can be viewed with better performance context.</li>
						<li>Develop multiple training modes that simulate different practice and shooting drill styles.</li>
						<li>Keep the target functional as a standalone embedded system without requiring the mobile app.</li>
					</ul>
				</div>

				<div id="project-objectives" class="scroll-mt-24 rounded border border-slate-200 bg-white p-5 transition-colors dark:border-slate-800 dark:bg-slate-900">
					<h3 class="text-xl font-bold text-slate-950 dark:text-white">Project Objectives</h3>

					<ul class="mt-3 list-disc space-y-2 pl-5 leading-7">
						<li>Develop an array of phototransistors that can detect incoming laser shots while rejecting unrelated ambient light.</li>
						<li>Implement an LED array that can indicate the detected shot location within approximately 10 ms.</li>
						<li>Program the ESP32-S3 microcontroller to process sensor readings, shot detection, scoring, display output, and training modes.</li>
						<li>Use calibration logic to adjust the detection threshold for different lighting environments.</li>
						<li>Show accurate shot placement in both indoor and outdoor lighting conditions.</li>
						<li>Update the mobile app within approximately 1 second after a laser hit is detected.</li>
						<li>Support Bluetooth Low Energy communication between the target and the companion app.</li>
						<li>Store useful shot records, debug information, and training history for later review.</li>
					</ul>
				</div>

				<div id="project-requirements" class="scroll-mt-24 rounded border border-slate-200 bg-white p-5 transition-colors dark:border-slate-800 dark:bg-slate-900">
					<h3 class="text-xl font-bold text-slate-950 dark:text-white">Design Requirements</h3>

					<p class="mt-2 leading-7">
						The PrecisionShot Training System must provide fast, reliable, and accurate shot detection while remaining practical to use as a portable training device. The phototransistor array must detect the selected laser wavelength while minimizing false detections from room lighting, reflections, and sunlight. The software must support threshold calibration so the target can adapt to different lighting conditions without requiring hardware changes.
					</p>

					<p class="mt-2 leading-7">
						The embedded system must coordinate the sensor array, multiplexers, LED feedback, TFT display, physical controls, Bluetooth communication, local logging, and power system. The target must remain responsive during normal training while still supporting multiple modes, scoring logic, mobile app updates, and future software expansion.
					</p>

					<p class="mt-2 leading-7">
						The physical design must protect the internal electronics, align the sensor openings with the PCB-mounted phototransistors, reduce unwanted off-axis light, and remain serviceable for debugging, testing, firmware updates, and battery access.
					</p>
				</div>

				<div id="project-sponsorship" class="scroll-mt-24 rounded border border-slate-200 bg-white p-5 transition-colors dark:border-slate-800 dark:bg-slate-900">
					<h3 class="text-xl font-bold text-slate-950 dark:text-white">Acknowledgment and Sponsorship</h3>

					<p class="mt-2 leading-7">
						The PrecisionShot Training System is currently planned as a self-funded Senior Design project. The team expects to cover prototype costs out of pocket while continuing to refine the bill of materials, PCB design, enclosure requirements, testing needs, and replacement-part budget.
					</p>

					<p class="mt-2 leading-7">
						The current prototype estimate is expected to increase as the design becomes more finalized because of PCB revisions, sensor quantity, 3D-printed enclosure parts, power components, display hardware, connectors, spare parts, and possible prototyping mistakes. Outside sponsorship is not required at this stage, but it may help reduce personal costs and allow the team to improve the final prototype with higher-quality components.
					</p>
				</div>
			</div>
		</div>
	</section>

	<!-- Design Outline -->
	<section id="design" class="scroll-mt-24 border-b border-slate-200 bg-white transition-colors dark:border-slate-800 dark:bg-slate-900">
		<div class="mx-auto max-w-6xl px-6 py-16">
			<h2 class="font-blackops text-3xl text-accent">Design Outline</h2>

			<p class="mt-3 max-w-3xl leading-7 text-slate-600 dark:text-slate-400">
				This section contains the current software design flowcharts for the PrecisionShot system.
			</p>

			<div class="mt-8 space-y-6">
				{#each flowcharts as flowchart (flowchart.path)}
					<MermaidDiagram title={flowchart.title} chart={flowchart.chart} />
				{/each}
			</div>
		</div>
	</section>

	<!-- Documents and Slides -->
	<section id="documents" class="scroll-mt-24 border-b border-slate-200 bg-slate-50 transition-colors dark:border-slate-800 dark:bg-slate-950">
		<div class="mx-auto max-w-6xl px-6 py-16">
			<h2 class="font-blackops text-3xl text-accent">Documents and Slides</h2>

			<p class="mt-3 max-w-3xl leading-7 text-slate-600 dark:text-slate-400">
				This section contains project documents, presentation materials, and public project management links.
			</p>

			<div class="mt-8 space-y-10">
				{#each resourceSections as section}
					<div>
						<div class="border-b border-slate-200 pb-3 dark:border-slate-800">
							<h3 class="text-xl font-bold text-slate-950 dark:text-white">{section.title}</h3>
							<p class="mt-1 text-sm text-slate-500 dark:text-slate-500">{section.description}</p>
						</div>

						<div class="mt-5 grid gap-4 md:grid-cols-2">
							{#each section.items as item}
								{#if item.href}
									<a href={item.href} target="_blank" rel="noreferrer" class="group rounded border border-slate-200 bg-white p-5 transition-colors hover:border-accent hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800">
										<div class="flex flex-wrap items-center gap-2">
											<p class="rounded bg-accent px-2 py-1 text-xs font-bold text-slate-950">{item.phase}</p>
											<p class="rounded border border-slate-300 px-2 py-1 text-xs font-bold text-slate-600 dark:border-slate-700 dark:text-slate-400">{item.type}</p>
										</div>

										<h4 class="mt-4 font-bold text-slate-950 dark:text-white">{item.title}</h4>

										<p class="mt-3 text-sm text-slate-500 dark:text-slate-500">
											<span class="text-accent group-hover:underline">{item.action}</span>
											<span> this resource.</span>
										</p>
									</a>
								{:else}
									<div class="rounded border border-slate-200 bg-white/70 p-5 opacity-70 transition-colors dark:border-slate-800 dark:bg-slate-900/60">
										<div class="flex flex-wrap items-center gap-2">
											<p class="rounded bg-slate-200 px-2 py-1 text-xs font-bold text-slate-700 dark:bg-slate-700 dark:text-slate-300">{item.phase}</p>
											<p class="rounded border border-slate-300 px-2 py-1 text-xs font-bold text-slate-500 dark:border-slate-700">{item.type}</p>
										</div>

										<h4 class="mt-4 font-bold text-slate-700 dark:text-slate-300">{item.title}</h4>

										<p class="mt-3 text-sm text-slate-500">Unavailable at this time.</p>
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
	<section id="videos" class="scroll-mt-24 border-b border-slate-200 bg-white transition-colors dark:border-slate-800 dark:bg-slate-900">
		<div class="mx-auto max-w-6xl px-6 py-16">
			<h2 class="font-blackops text-3xl text-accent">Videos</h2>

			<p class="mt-3 max-w-3xl leading-7 text-slate-600 dark:text-slate-400">
				This section will include YouTube links for required Senior Design demonstration and presentation videos as they become available.
			</p>

			<div class="mt-8 grid gap-4 md:grid-cols-2">
				{#each videos as video}
					{#if video.href}
						<a href={video.href} target="_blank" rel="noreferrer" class="group rounded border border-slate-200 bg-slate-50 p-5 transition-colors hover:border-accent hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-950 dark:hover:bg-slate-800">
							<div class="flex flex-wrap items-center gap-2">
								<p class="rounded bg-accent px-2 py-1 text-xs font-bold text-slate-950">{video.phase}</p>
								<p class="rounded border border-slate-300 px-2 py-1 text-xs font-bold text-slate-600 dark:border-slate-700 dark:text-slate-400">{video.type}</p>
							</div>

							<h3 class="mt-4 font-bold text-slate-950 dark:text-white">{video.title}</h3>

							<p class="mt-3 text-sm text-slate-500">
								<span class="text-accent group-hover:underline">{video.action}</span>
								<span> this video.</span>
							</p>
						</a>
					{:else}
						<div class="rounded border border-slate-200 bg-slate-50 p-5 opacity-70 transition-colors dark:border-slate-800 dark:bg-slate-950/70">
							<div class="flex flex-wrap items-center gap-2">
								<p class="rounded bg-slate-200 px-2 py-1 text-xs font-bold text-slate-700 dark:bg-slate-700 dark:text-slate-300">{video.phase}</p>
								<p class="rounded border border-slate-300 px-2 py-1 text-xs font-bold text-slate-500 dark:border-slate-700">{video.type}</p>
							</div>

							<h3 class="mt-4 font-bold text-slate-700 dark:text-slate-300">{video.title}</h3>

							<p class="mt-3 text-sm text-slate-500">Unavailable at this time.</p>
						</div>
					{/if}
				{/each}
			</div>
		</div>
	</section>

	<!-- Timeline -->
	<section id="timeline" class="scroll-mt-24 bg-slate-50 transition-colors dark:bg-slate-950">
		<div class="mx-auto max-w-6xl px-6 py-16">
			<h2 class="font-blackops text-3xl text-accent">Timeline</h2>

			<p class="mt-3 max-w-3xl leading-7 text-slate-600 dark:text-slate-400">
				This is a rough project timeline based on current Senior Design milestones.
			</p>

			<div class="mt-10 space-y-10">
				<div>
					<div class="border-b border-slate-200 pb-3 dark:border-slate-800">
						<h3 class="text-2xl font-bold text-slate-950 dark:text-white">Senior Design 1</h3>
						<p class="mt-1 text-sm text-slate-500">Planning, research, documentation, website setup, and early design work.</p>
					</div>

					<div class="mt-6 space-y-4">
						{#each sd1Timeline as item}
							<div class="rounded border border-slate-200 bg-white p-5 transition-colors dark:border-slate-700 dark:bg-slate-900">
								<div class="flex flex-wrap items-start justify-between gap-3">
									<div>
										<p class="text-sm font-bold text-accent">{item.week}</p>
										<h4 class="mt-1 text-xl font-bold text-slate-950 dark:text-white">{item.title}</h4>
									</div>

									<p class="rounded border border-slate-300 px-3 py-1 text-sm font-bold text-slate-600 dark:border-slate-700 dark:text-slate-400">{item.dates}</p>
								</div>

								<ul class="mt-4 list-disc space-y-2 pl-5 text-slate-700 dark:text-slate-300">
									{#each item.items as task}
										<li>{task}</li>
									{/each}
								</ul>
							</div>
						{/each}
					</div>
				</div>

				<div>
					<div class="border-b border-slate-200 pb-3 dark:border-slate-800">
						<h3 class="text-2xl font-bold text-slate-950 dark:text-white">Senior Design 2</h3>
						<p class="mt-1 text-sm text-slate-500">Prototype build, integration, testing, final presentation, and demonstration.</p>
					</div>

					<div class="mt-6 space-y-4">
						{#each sd2Timeline as item}
							<div class="rounded border border-slate-200 bg-white p-5 transition-colors dark:border-slate-700 dark:bg-slate-900">
								<div class="flex flex-wrap items-start justify-between gap-3">
									<div>
										<p class="text-sm font-bold text-accent">{item.week}</p>
										<h4 class="mt-1 text-xl font-bold text-slate-950 dark:text-white">{item.title}</h4>
									</div>

									<p class="rounded border border-slate-300 px-3 py-1 text-sm font-bold text-slate-600 dark:border-slate-700 dark:text-slate-400">{item.dates}</p>
								</div>

								<ul class="mt-4 list-disc space-y-2 pl-5 text-slate-700 dark:text-slate-300">
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
