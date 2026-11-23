export interface Resource {
	title: string;
	href: string;
	phase: string;
	type: string;
	action: string;
	downloadId?: string;
}

export interface ResourceSection {
	title: string;
	description: string;
	items: Resource[];
}

export const resourceSections: ResourceSection[] = [
	{
		title: 'Project Links',
		description: 'Official website, task dashboard, and public source-code repositories.',
		items: [
			{
				title: 'Official PrecisionShot Website',
				href: '/',
				phase: 'Ongoing',
				type: 'Project Website',
				action: 'Open'
			},
			{
				title: 'Project Tasks Dashboard',
				href: '/tasks',
				phase: 'Ongoing',
				type: 'Task Dashboard',
				action: 'Open'
			},
			{
				title: 'Website Source Code',
				href: 'https://github.com/Teesitin/precisionshot-web',
				phase: 'Ongoing',
				type: 'GitHub Repository',
				action: 'Open'
			},
			{
				title: 'Mobile Application Source Code',
				href: 'https://github.com/Teesitin/precisionshot-app',
				phase: 'Ongoing',
				type: 'GitHub Repository',
				action: 'Open'
			},
			{
				title: 'Embedded Firmware Source Code',
				href: 'https://github.com/Teesitin/precisionshot-firmware',
				phase: 'Ongoing',
				type: 'GitHub Repository',
				action: 'Open'
			}
		]
	},
	{
		title: 'Documents',
		description: 'Senior Design reports and written submissions.',
		items: [
			{
				title: 'Divide and Conquer Document',
				downloadId: 'divide-and-conquer',
				href: 'https://delayne.b-cdn.net/precisionshot/Divide%20%26%20Conquer%20Document%20and%20Committee%20Formation%20-%20Senior%20Design%201%20(12).pdf',
				phase: 'SD1',
				type: 'PDF Document',
				action: 'Download'
			},
			{
				title: 'Midterm Milestone Report',
				downloadId: 'midterm-milestone-report',
				href: 'https://delayne.b-cdn.net/precisionshot/Midterm%20Report%20-%20Senior%20Design%201%20(1).pdf',
				phase: 'SD1',
				type: 'PDF Document',
				action: 'Download'
			},
			{
				title: 'SD1 Final Report',
				downloadId: 'sd1-final-report',
				href: 'https://delayne.b-cdn.net/precisionshot/Group13_PrecisionShot_Final_Report.pdf',
				phase: 'SD1',
				type: 'PDF Document',
				action: 'Download'
			},
			{
				title: '8-Page Conference Paper',
				downloadId: 'conference-paper',
				href: 'https://delayne.b-cdn.net/precisionshot/Group13_PrecisionShot_Conference_Paper_v2.pdf',
				phase: 'SD2',
				type: 'PDF Document',
				action: 'Download'
			},
			{
				title: 'SD2 Final Report',
				href: '',
				phase: 'SD2',
				type: 'PDF Document',
				action: 'Download'
			}
		]
	},
	{
		title: 'Slides',
		description: 'Presentation slide decks for Senior Design checkpoints.',
		items: [
			{
				title: 'CDR Presentation Slides',
				downloadId: 'cdr-slides',
				href: 'https://delayne.b-cdn.net/precisionshot/SD2%20-%20CDR%20Presentation%20(3).pdf',
				phase: 'SD2',
				type: 'PDF Document',
				action: 'Download'
			},
			{
				title: 'Final Presentation Slides',
				downloadId: 'final-slides',
				href: 'https://delayne.b-cdn.net/precisionshot/Group13_PrecisionShot_Final_Presentation.pdf',
				phase: 'SD2',
				type: 'PDF Document',
				action: 'Download'
			}
		]
	}
];

export const videos: Resource[] = [
	{ title: 'Mini Demo Video', href: 'https://delayne.b-cdn.net/precisionshot/PrecisionShot_SD1_Mini_Demo_2026-07-27.mp4', downloadId: 'mini-demo', phase: 'SD1', type: 'MP4 Video', action: 'Watch' },
	{ title: 'CDR Presentation Video', href: 'https://delayne.b-cdn.net/precisionshot/Cdr%20V1-1200.mp4', downloadId: 'cdr-presentation', phase: 'SD2', type: 'MP4 Video', action: 'Watch' },
	{ title: 'Midterm Demonstration Video', href: 'https://delayne.b-cdn.net/precisionshot/Group13_PrecisionShot_Midterm_Demonstration.mp4', downloadId: 'midterm-demonstration', phase: 'SD2', type: 'MP4 Video', action: 'Watch' },
	{ title: 'Final Presentation Video', href: 'https://delayne.b-cdn.net/precisionshot/Group13_PrecisionShot_Final_Presentation.mp4', downloadId: 'final-presentation', phase: 'SD2', type: 'MP4 Video', action: 'Watch' },
	{ title: 'Final Demonstration Video', href: 'https://delayne.b-cdn.net/precisionshot/Group13_PrecisionShot_Final_Demonstration.mp4', downloadId: 'final-demonstration', phase: 'SD2', type: 'MP4 Video', action: 'Watch' }
];
