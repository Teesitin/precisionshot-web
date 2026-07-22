<script lang="ts">
	import { onMount, tick } from 'svelte';

	const CSV_PATH = '/clickup-tasks-static/export-7-22-26.csv';
	const SNAPSHOT_CREATED = 'July 22, 2026';
	const FINAL_REPORT_DUE = 'July 28, 2026 at 12:00 PM EDT';
	const PROJECT_WEBSITE = 'https://www.precisionshot.xyz/';

	type RawRecord = Record<string, string>;

	type TaskComment = {
		text: string;
		by: string;
		date: string;
		assigned?: boolean;
		resolved?: string;
	};

	type Task = {
		id: string;
		link: string;
		type: string;
		name: string;
		content: string;
		status: string;
		statusCategory: 'open' | 'active' | 'complete';
		createdTimestamp: number | null;
		createdDate: string;
		startTimestamp: number | null;
		startDate: string;
		dueTimestamp: number | null;
		dueDate: string;
		assignees: string[];
		priority: number | null;
		listName: string;
		listKey: string;
		folderName: string;
		folderPath: string;
		spaceName: string;
		location: string;
		timeEstimate: string;
		timeSpent: string;
		rolledUpTime: string;
		comments: TaskComment[];
		attachmentCount: number;
		checklistCount: number;
		tagCount: number;
		raw: RawRecord;
	};

	type ListGroup = {
		key: string;
		name: string;
		tasks: Task[];
		total: number;
		completed: number;
		active: number;
		urgent: number;
	};

	type FolderGroup = {
		name: string;
		lists: ListGroup[];
		total: number;
		completed: number;
		active: number;
		urgent: number;
	};

	type DetailRow = {
		label: string;
		value: string;
	};

	let tasks = $state<Task[]>([]);
	let exportedColumns = $state<string[]>([]);
	let loading = $state(true);
	let loadError = $state('');
	let searchQuery = $state('');
	let selectedFolder = $state('all');
	let selectedList = $state('all');
	let selectedAssignee = $state('all');
	let selectedPriority = $state('all');
	let selectedStatus = $state('all');
	let openFolders = $state<Set<string>>(new Set());
	let openGroups = $state<Set<string>>(new Set());

	const formalNames: Record<string, string> = {
		Teesitin: 'DeLayne Russell',
		'Anthony F': 'Anthony Fontana',
		'Kenn Pickavance': 'Kenn Pickavance',
		'Nick Koteff': 'Nicolas Koteff'
	};

	const commentAuthorNames: Record<string, string> = {
		'teesitin.russell@gmail.com': 'DeLayne Russell',
		'anthony.fontana500000@gmail.com': 'Anthony Fontana',
		'kennp2924@gmail.com': 'Kenn Pickavance',
		'283koteff@gmail.com': 'Nicolas Koteff'
	};

	const priorityLabels: Record<number, string> = {
		1: 'Urgent',
		2: 'High',
		3: 'Normal',
		4: 'Low'
	};

	const fieldLabels: Record<string, string> = {
		'Task ID': 'Task ID',
		'Task Type': 'Task type',
		'Date Created Text': 'Created',
		'Start Date Text': 'Start date',
		'Due Date Text': 'Due date',
		'Parent ID': 'Parent task ID',
		'Subtasks IDs': 'Subtask IDs',
		Attachments: 'Attachments',
		Tags: 'Tags',
		'Time Estimated Text': 'Time estimate',
		Checklists: 'Checklists',
		'Assigned Comments': 'Assigned comments',
		'Time Spent Text': 'Time spent',
		'Rolled Up Time Text': 'Rolled-up time',
		'Folder Name/Path': 'Folder path',
		'Space Name': 'Space',
		'Home Location': 'Home location',
		'Other Locations': 'Other locations'
	};

	const readableDetailFields = [
		'Task ID',
		'Task Type',
		'Date Created Text',
		'Start Date Text',
		'Due Date Text',
		'Parent ID',
		'Subtasks IDs',
		'Attachments',
		'Tags',
		'Time Estimated Text',
		'Checklists',
		'Assigned Comments',
		'Time Spent Text',
		'Rolled Up Time Text',
		'Folder Name/Path',
		'Space Name',
		'Home Location',
		'Other Locations'
	];

	const knownColumns = new Set([
		'Task ID',
		'Task Link',
		'Task Type',
		'Task Name',
		'Task Content',
		'Status',
		'Date Created',
		'Date Created Text',
		'Due Date',
		'Due Date Text',
		'Start Date',
		'Start Date Text',
		'Parent ID',
		'Subtasks IDs',
		'Attachments',
		'Assignees',
		'Tags',
		'Priority',
		'List Name',
		'Folder Name/Path',
		'Space Name',
		'Time Estimated',
		'Time Estimated Text',
		'Checklists',
		'Comments',
		'Assigned Comments',
		'Time Spent',
		'Time Spent Text',
		'Rolled Up Time',
		'Rolled Up Time Text',
		'Home Location ID',
		'Home Location',
		'Other Location IDs',
		'Other Locations'
	]);

	onMount(async () => {
		try {
			const response = await fetch(CSV_PATH, { cache: 'no-store' });
			if (!response.ok) throw new Error(`Could not load task export (${response.status}).`);

			const csv = await response.text();
			const rows = parseCsv(csv);
			if (rows.length < 2) throw new Error('The task export did not contain any task rows.');

			const headers = rows[0].map((header) => header.replace(/^\uFEFF/, '').trim());
			exportedColumns = headers;
			tasks = rows
				.slice(1)
				.map((row) => rowToRecord(headers, row))
				.filter((record) => record['Task Name']?.trim())
				.map(toTask);

			const preferredFolder = folderNamesFrom(tasks).find((name) => name === 'Final Report') ?? folderNamesFrom(tasks)[0];
			if (preferredFolder) {
				openFolders = new Set([preferredFolder]);
				const preferredList = buildFolders(tasks)
					.find((folder) => folder.name === preferredFolder)
					?.lists[0];
				if (preferredList) openGroups = new Set([preferredList.key]);
			}
		} catch (error) {
			loadError = error instanceof Error ? error.message : 'The task export could not be loaded.';
		} finally {
			loading = false;
		}
	});

	function parseCsv(input: string): string[][] {
		const rows: string[][] = [];
		let row: string[] = [];
		let field = '';
		let quoted = false;

		for (let index = 0; index < input.length; index += 1) {
			const character = input[index];
			const nextCharacter = input[index + 1];

			if (character === '"') {
				if (quoted && nextCharacter === '"') {
					field += '"';
					index += 1;
				} else {
					quoted = !quoted;
				}
			} else if (character === ',' && !quoted) {
				row.push(field);
				field = '';
			} else if ((character === '\n' || character === '\r') && !quoted) {
				if (character === '\r' && nextCharacter === '\n') index += 1;
				row.push(field);
				if (row.some((value) => value.length > 0)) rows.push(row);
				row = [];
				field = '';
			} else {
				field += character;
			}
		}

		if (field.length > 0 || row.length > 0) {
			row.push(field);
			rows.push(row);
		}

		return rows;
	}

	function rowToRecord(headers: string[], row: string[]): RawRecord {
		return Object.fromEntries(headers.map((header, index) => [header, row[index] ?? '']));
	}

	function parseTimestamp(raw: string): number | null {
		const value = Number(raw);
		return Number.isFinite(value) && value > 0 ? value : null;
	}

	function formatTimestamp(timestamp: number | null, fallback = ''): string {
		if (!timestamp || !Number.isFinite(timestamp)) return cleanDateText(fallback);

		return new Intl.DateTimeFormat('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric',
			hour: 'numeric',
			minute: '2-digit',
			timeZone: 'America/New_York',
			timeZoneName: 'short'
		}).format(new Date(timestamp));
	}

	function cleanDateText(value: string): string {
		return value?.trim() ?? '';
	}

	function parseJsonValue(raw: string): unknown {
		const value = raw?.trim();
		if (!value || value === 'null' || value === 'NaN') return null;

		try {
			return JSON.parse(value);
		} catch {
			return null;
		}
	}

	function parseAssignees(raw: string): string[] {
		return [...new Set(
			raw
				.replace(/^\[/, '')
				.replace(/\]$/, '')
				.split(',')
				.map((name) => name.trim())
				.filter(Boolean)
				.map((name) => formalNames[name] ?? name)
		)];
	}

	function parseFolderPath(raw: string): string[] {
		const parsed = parseJsonValue(raw);
		if (Array.isArray(parsed)) return parsed.map(String).filter(Boolean);

		return raw
			.replace(/^\[/, '')
			.replace(/\]$/, '')
			.replaceAll('"', '')
			.split(',')
			.map((part) => part.trim())
			.filter(Boolean);
	}

	function parseComments(raw: string): TaskComment[] {
		const parsed = parseJsonValue(raw);
		if (!Array.isArray(parsed)) return [];

		return parsed
			.filter((item): item is Record<string, unknown> => typeof item === 'object' && item !== null)
			.map((item) => ({
				text: String(item.text ?? '').trim(),
				by: commentAuthorNames[String(item.by ?? '')] ?? String(item.by ?? 'Unknown'),
				date: String(item.date ?? ''),
				assigned: Boolean(item.assigned),
				resolved: String(item.resolved ?? '')
			}))
			.filter((comment) => comment.text && comment.text.toLowerCase() !== 'undefined');
	}

	function collectionSize(raw: string): number {
		const parsed = parseJsonValue(raw);
		if (Array.isArray(parsed)) return parsed.length;
		if (parsed && typeof parsed === 'object') return Object.keys(parsed).length;
		return 0;
	}

	function normalizeStatus(status: string): string {
		return status
			.trim()
			.split(/\s+/)
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
			.join(' ');
	}

	function getStatusCategory(status: string): 'open' | 'active' | 'complete' {
		const normalized = status.trim().toLowerCase();
		if (['complete', 'completed', 'done', 'closed', 'shipped'].includes(normalized)) return 'complete';
		if (
			[
				'in progress',
				'active',
				'review',
				'under review',
				'writing',
				'approval',
				'scoping',
				'in development',
				'in review',
				'testing'
			].includes(normalized)
		) return 'active';
		return 'open';
	}

	function cleanOptionalValue(value: string): string {
		const cleaned = value?.trim() ?? '';
		if (['', 'null', 'NaN', '[]', '{}', '""', '" "'].includes(cleaned)) return '';
		return cleaned;
	}

	function toTask(record: RawRecord): Task {
		const priorityValue = Number(record['Priority']);
		const createdTimestamp = parseTimestamp(record['Date Created']);
		const startTimestamp = parseTimestamp(record['Start Date']);
		const dueTimestamp = parseTimestamp(record['Due Date']);
		const folderParts = parseFolderPath(record['Folder Name/Path']);
		const folderName = folderParts.at(-1) || deriveFolderFromLocation(record['Home Location']) || 'Uncategorized';
		const folderPath = folderParts.join(' > ') || folderName;
		const listName = record['List Name']?.trim() || 'Uncategorized';
		const status = normalizeStatus(record['Status'] || 'To do');

		return {
			id: record['Task ID']?.trim() ?? '',
			link: record['Task Link']?.trim() ?? '',
			type: record['Task Type']?.trim() || 'Task',
			name: record['Task Name']?.trim() || 'Untitled task',
			content: record['Task Content']?.trim() ?? '',
			status,
			statusCategory: getStatusCategory(status),
			createdTimestamp,
			createdDate: formatTimestamp(createdTimestamp, record['Date Created Text']),
			startTimestamp,
			startDate: formatTimestamp(startTimestamp, record['Start Date Text']),
			dueTimestamp,
			dueDate: formatTimestamp(dueTimestamp, record['Due Date Text']),
			assignees: parseAssignees(record['Assignees'] ?? ''),
			priority: Number.isFinite(priorityValue) && priorityValue > 0 ? priorityValue : null,
			listName,
			listKey: `${folderName}::${listName}`,
			folderName,
			folderPath,
			spaceName: record['Space Name']?.trim() || 'Senior Design',
			location: record['Home Location']?.trim() || `${folderName} > ${listName}`,
			timeEstimate: cleanOptionalValue(record['Time Estimated Text']),
			timeSpent: cleanOptionalValue(record['Time Spent Text']),
			rolledUpTime: cleanOptionalValue(record['Rolled Up Time Text']),
			comments: parseComments(record['Comments']),
			attachmentCount: collectionSize(record['Attachments']),
			checklistCount: collectionSize(record['Checklists']),
			tagCount: collectionSize(record['Tags']),
			raw: record
		};
	}

	function deriveFolderFromLocation(location: string): string {
		const parts = location
			.split('>')
			.map((part) => part.trim())
			.filter(Boolean);
		return parts.length >= 2 ? parts.at(-2) ?? '' : '';
	}

	function isComplete(task: Task): boolean {
		return task.statusCategory === 'complete';
	}

	function isActive(task: Task): boolean {
		return task.statusCategory === 'active';
	}

	function folderOrder(name: string): number {
		if (name === 'Final Report') return 1;
		if (name === 'Midterm Report') return 2;
		if (name === 'PrecisionShot Project') return 3;
		return 100;
	}

	function listOrder(name: string): number {
		const chapterMatch = name.match(/^Chapter\s+(\d+)/i);
		if (chapterMatch) return Number(chapterMatch[1]);
		if (name.toLowerCase().includes('front matter')) return 1001;
		if (name.toLowerCase().includes('appendices')) return 1002;
		if (name.toLowerCase().includes('final assembly')) return 1003;
		return 2000;
	}

	function folderNamesFrom(source: Task[]): string[] {
		return [...new Set(source.map((task) => task.folderName))].sort(
			(a, b) => folderOrder(a) - folderOrder(b) || a.localeCompare(b)
		);
	}

	function buildFolders(source: Task[]): FolderGroup[] {
		const folderMap = new Map<string, Map<string, Task[]>>();

		for (const task of source) {
			const listMap = folderMap.get(task.folderName) ?? new Map<string, Task[]>();
			const listTasks = listMap.get(task.listName) ?? [];
			listTasks.push(task);
			listMap.set(task.listName, listTasks);
			folderMap.set(task.folderName, listMap);
		}

		return [...folderMap.entries()]
			.sort(([folderA], [folderB]) => folderOrder(folderA) - folderOrder(folderB) || folderA.localeCompare(folderB))
			.map(([folderName, listMap]) => {
				const lists = [...listMap.entries()]
					.sort(([listA], [listB]) => listOrder(listA) - listOrder(listB) || listA.localeCompare(listB))
					.map(([listName, listTasks]) => {
						const sortedTasks = [...listTasks].sort((a, b) => {
							const priorityA = a.priority ?? 99;
							const priorityB = b.priority ?? 99;
							return priorityA - priorityB || (a.dueTimestamp ?? Number.MAX_SAFE_INTEGER) - (b.dueTimestamp ?? Number.MAX_SAFE_INTEGER) || a.name.localeCompare(b.name);
						});

						return {
							key: `${folderName}::${listName}`,
							name: listName,
							tasks: sortedTasks,
							total: sortedTasks.length,
							completed: sortedTasks.filter(isComplete).length,
							active: sortedTasks.filter(isActive).length,
							urgent: sortedTasks.filter((task) => task.priority === 1 && !isComplete(task)).length
						};
					});

				const folderTasks = lists.flatMap((list) => list.tasks);
				return {
					name: folderName,
					lists,
					total: folderTasks.length,
					completed: folderTasks.filter(isComplete).length,
					active: folderTasks.filter(isActive).length,
					urgent: folderTasks.filter((task) => task.priority === 1 && !isComplete(task)).length
				};
			});
	}

	function matchesSearch(task: Task): boolean {
		const query = searchQuery.trim().toLowerCase();
		if (!query) return true;

		return [
			task.name,
			task.content,
			task.folderName,
			task.listName,
			task.status,
			task.assignees.join(' '),
			...Object.values(task.raw)
		]
			.join(' ')
			.toLowerCase()
			.includes(query);
	}

	function toggleFolder(name: string) {
		const next = new Set(openFolders);
		if (next.has(name)) next.delete(name);
		else next.add(name);
		openFolders = next;
	}

	function toggleGroup(key: string) {
		const next = new Set(openGroups);
		if (next.has(key)) next.delete(key);
		else next.add(key);
		openGroups = next;
	}

	function selectFolder(name: string) {
		selectedFolder = name;
		selectedList = 'all';
		if (name !== 'all') openFolders = new Set([...openFolders, name]);
	}

	function handleFolderFilterChange() {
		selectedList = 'all';
		if (selectedFolder !== 'all') openFolders = new Set([...openFolders, selectedFolder]);
	}

	function expandAll() {
		openFolders = new Set(filteredFolders.map((folder) => folder.name));
		openGroups = new Set(filteredFolders.flatMap((folder) => folder.lists.map((list) => list.key)));
	}

	function collapseAll() {
		openFolders = new Set();
		openGroups = new Set();
	}

	function resetFilters() {
		searchQuery = '';
		selectedFolder = 'all';
		selectedList = 'all';
		selectedAssignee = 'all';
		selectedPriority = 'all';
		selectedStatus = 'all';
	}

	async function printPage() {
		expandAll();
		await tick();
		window.print();
	}

	function priorityLabel(priority: number | null): string {
		return priority ? priorityLabels[priority] ?? `Priority ${priority}` : 'No priority';
	}

	function priorityClasses(priority: number | null): string {
		if (priority === 1) return 'border-red-400/50 bg-red-500/10 text-red-700 dark:text-red-300';
		if (priority === 2) return 'border-orange-400/50 bg-orange-500/10 text-orange-700 dark:text-orange-300';
		if (priority === 3) return 'border-blue-400/50 bg-blue-500/10 text-blue-700 dark:text-blue-300';
		if (priority === 4) return 'border-slate-400/50 bg-slate-500/10 text-slate-700 dark:text-slate-300';
		return 'border-slate-300 bg-slate-100 text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400';
	}

	function statusClasses(task: Task): string {
		if (task.statusCategory === 'complete') return 'border-emerald-400/50 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300';
		if (task.statusCategory === 'active') return 'border-sky-400/50 bg-sky-500/10 text-sky-700 dark:text-sky-300';
		return 'border-slate-300 bg-slate-100 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300';
	}

	function progressPercent(completed: number, total: number): number {
		return total ? Math.round((completed / total) * 100) : 0;
	}

	function isMeaningfulExportValue(value: string): boolean {
		const cleaned = value?.trim() ?? '';
		return !['', 'null', 'NaN', '[]', '{}', '""', '" "', '0'].includes(cleaned);
	}

	function formatExportValue(field: string, raw: string): string {
		if (field === 'Assignees') return parseAssignees(raw).join(', ');
		if (field === 'Folder Name/Path') return parseFolderPath(raw).join(' > ');
		if (field === 'Priority') {
			const priority = Number(raw);
			return Number.isFinite(priority) && priority > 0 ? priorityLabel(priority) : 'No priority';
		}
		if (field === 'Status') return normalizeStatus(raw);

		const parsed = parseJsonValue(raw);
		if (Array.isArray(parsed)) {
			if (parsed.length === 0) return '';
			if (parsed.every((item) => ['string', 'number', 'boolean'].includes(typeof item))) return parsed.map(String).join(', ');
			return JSON.stringify(parsed, null, 2);
		}
		if (parsed && typeof parsed === 'object') {
			if (Object.keys(parsed).length === 0) return '';
			return JSON.stringify(parsed, null, 2);
		}

		return raw.trim();
	}

	function detailRows(task: Task): DetailRow[] {
		const rows: DetailRow[] = [];

		for (const field of readableDetailFields) {
			const rawValue = task.raw[field] ?? '';
			if (!isMeaningfulExportValue(rawValue)) continue;
			const value = formatExportValue(field, rawValue);
			if (!value) continue;
			rows.push({ label: fieldLabels[field] ?? field, value });
		}

		for (const [field, rawValue] of Object.entries(task.raw)) {
			if (knownColumns.has(field) || !isMeaningfulExportValue(rawValue)) continue;
			const value = formatExportValue(field, rawValue);
			if (value) rows.push({ label: field, value });
		}

		return rows;
	}

	const folderOptions = $derived(folderNamesFrom(tasks));

	const listOptions = $derived.by(() => {
		const options = new Map<string, string>();
		for (const task of tasks) {
			if (selectedFolder !== 'all' && task.folderName !== selectedFolder) continue;
			const label = selectedFolder === 'all' ? `${task.folderName} — ${task.listName}` : task.listName;
			options.set(task.listKey, label);
		}
		return [...options.entries()]
			.map(([value, label]) => ({ value, label }))
			.sort((a, b) => {
				const [folderA, listA] = a.value.split('::');
				const [folderB, listB] = b.value.split('::');
				return folderOrder(folderA) - folderOrder(folderB) || listOrder(listA) - listOrder(listB) || a.label.localeCompare(b.label);
			});
	});

	$effect(() => {
		if (selectedList !== 'all' && !listOptions.some((option) => option.value === selectedList)) {
			selectedList = 'all';
		}
	});

	const assigneeOptions = $derived([...new Set(tasks.flatMap((task) => task.assignees))].sort());
	const statusOptions = $derived([...new Set(tasks.map((task) => task.status))].sort());

	const filteredTasks = $derived(
		tasks.filter((task) => {
			const folderMatch = selectedFolder === 'all' || task.folderName === selectedFolder;
			const listMatch = selectedList === 'all' || task.listKey === selectedList;
			const assigneeMatch = selectedAssignee === 'all' || task.assignees.includes(selectedAssignee);
			const priorityMatch = selectedPriority === 'all' || String(task.priority) === selectedPriority;
			const statusMatch = selectedStatus === 'all' || task.status === selectedStatus;
			return folderMatch && listMatch && assigneeMatch && priorityMatch && statusMatch && matchesSearch(task);
		})
	);

	const filteredFolders = $derived(buildFolders(filteredTasks));
	const allFolders = $derived(buildFolders(tasks));
	const completedCount = $derived(tasks.filter(isComplete).length);
	const activeCount = $derived(tasks.filter(isActive).length);
	const openCount = $derived(tasks.length - completedCount - activeCount);
	const urgentOpenCount = $derived(tasks.filter((task) => task.priority === 1 && !isComplete(task)).length);
	const dueDateCount = $derived(tasks.filter((task) => task.dueTimestamp).length);
	const commentedTaskCount = $derived(tasks.filter((task) => task.comments.length > 0).length);
	const overallProgress = $derived(tasks.length ? Math.round((completedCount / tasks.length) * 100) : 0);
	const totalListCount = $derived(new Set(tasks.map((task) => task.listKey)).size);
	const latestTaskCreated = $derived.by(() => {
		const timestamps = tasks
			.map((task) => task.createdTimestamp)
			.filter((value): value is number => value !== null && value > 0);
		return timestamps.length ? formatTimestamp(Math.max(...timestamps)) : 'Not available';
	});

	const finalReportTasks = $derived(tasks.filter((task) => task.folderName === 'Final Report'));
	const finalReportChapterCount = $derived(
		new Set(finalReportTasks.filter((task) => /^Chapter\s+\d+/i.test(task.listName)).map((task) => task.listName)).size
	);
	const finalReportSupportCount = $derived(
		new Set(finalReportTasks.filter((task) => !/^Chapter\s+\d+/i.test(task.listName)).map((task) => task.listName)).size
	);

	const assigneeSummary = $derived(
		assigneeOptions.map((name) => {
			const assignedTasks = tasks.filter((task) => task.assignees.includes(name));
			return {
				name,
				total: assignedTasks.length,
				completed: assignedTasks.filter(isComplete).length,
				active: assignedTasks.filter(isActive).length,
				urgent: assignedTasks.filter((task) => task.priority === 1 && !isComplete(task)).length
			};
		})
	);
</script>

<svelte:head>
	<title>Project Task Register | PrecisionShot</title>
	<meta
		name="description"
		content="A public, read-only register of PrecisionShot Senior Design project, midterm report, and final report tasks."
	/>
</svelte:head>

<main class="min-h-screen bg-slate-50 text-slate-950 transition-colors dark:bg-slate-950 dark:text-slate-100">
	<section class="relative isolate overflow-hidden border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
		<div class="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,rgba(236,211,22,0.18),transparent_30%),radial-gradient(circle_at_90%_25%,rgba(127,104,63,0.14),transparent_32%)]"></div>
		<div class="pointer-events-none absolute -right-24 top-1/2 size-96 -translate-y-1/2 rounded-full border border-accent/15"></div>
		<div class="pointer-events-none absolute -right-4 top-1/2 size-64 -translate-y-1/2 rounded-full border border-accent/20"></div>

		<div class="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16">
			<div class="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
				<div class="max-w-3xl">
					<div class="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-3 py-1.5 text-xs font-black uppercase tracking-[0.18em] text-slate-800 dark:text-accent">
						<span class="size-2 rounded-full bg-accent shadow-[0_0_12px_rgba(236,211,22,0.9)]"></span>
						Public reviewer snapshot
					</div>

					<p class="mt-5 text-sm font-bold uppercase tracking-[0.2em] text-secondary dark:text-accent/80">UCF Senior Design · Group 13</p>
					<h1 class="font-blackops mt-2 text-4xl leading-tight text-slate-950 sm:text-5xl dark:text-white">
						Project Task Register
					</h1>
					<p class="mt-4 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg dark:text-slate-300">
						A complete, read-only view of the exported ClickUp tasks for the PrecisionShot project, including the original project plan, Midterm Report work, and Final Report work.
					</p>
				</div>

				<div class="flex flex-wrap gap-3 print:hidden">
					<a href={PROJECT_WEBSITE} class="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-accent hover:text-slate-950 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200" rel="noreferrer">
						Project website
					</a>
					<a href={CSV_PATH} download class="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-accent hover:text-slate-950 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
						Download full CSV
					</a>
					<button type="button" onclick={printPage} class="rounded-lg bg-accent px-4 py-2.5 text-sm font-black text-slate-950 shadow-[0_0_24px_rgba(236,211,22,0.24)] transition hover:-translate-y-0.5 hover:bg-accent/85">
						Print / Save PDF
					</button>
				</div>
			</div>

			<div class="mt-9 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
				<div class="rounded-xl border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/75">
					<p class="text-xs font-bold uppercase tracking-wider text-slate-500">Snapshot created</p>
					<p class="mt-2 text-lg font-black text-slate-950 dark:text-white">{SNAPSHOT_CREATED}</p>
				</div>
				<div class="rounded-xl border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/75">
					<p class="text-xs font-bold uppercase tracking-wider text-slate-500">Latest task in export</p>
					<p class="mt-2 text-lg font-black text-slate-950 dark:text-white">{latestTaskCreated}</p>
				</div>
				<div class="rounded-xl border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/75">
					<p class="text-xs font-bold uppercase tracking-wider text-slate-500">Final report due</p>
					<p class="mt-2 text-lg font-black text-slate-950 dark:text-white">{FINAL_REPORT_DUE}</p>
				</div>
				<div class="rounded-xl border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/75">
					<p class="text-xs font-bold uppercase tracking-wider text-slate-500">Final report structure</p>
					<p class="mt-2 text-lg font-black text-slate-950 dark:text-white">{finalReportChapterCount} chapters + {finalReportSupportCount} support lists</p>
				</div>
				<div class="rounded-xl border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur sm:col-span-2 xl:col-span-1 dark:border-slate-800 dark:bg-slate-900/75">
					<p class="text-xs font-bold uppercase tracking-wider text-slate-500">Export coverage</p>
					<p class="mt-2 text-lg font-black text-slate-950 dark:text-white">{exportedColumns.length} fields per record</p>
				</div>
			</div>

			<div class="mt-4 rounded-xl border border-amber-300/70 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-950 dark:border-amber-400/25 dark:bg-amber-500/10 dark:text-amber-100">
				<strong>Reviewer note:</strong> This page is a static, read-only export and does not automatically update with ClickUp. It includes all three project folders. Direct ClickUp task links may require workspace access, but the task descriptions and exported details remain visible here.
			</div>
		</div>
	</section>

	{#if loading}
		<section class="mx-auto max-w-7xl px-4 py-20 sm:px-6">
			<div class="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
				<div class="mx-auto size-10 animate-spin rounded-full border-4 border-slate-200 border-t-accent dark:border-slate-700 dark:border-t-accent"></div>
				<p class="mt-4 font-bold text-slate-700 dark:text-slate-200">Loading the complete task register…</p>
			</div>
		</section>
	{:else if loadError}
		<section class="mx-auto max-w-7xl px-4 py-20 sm:px-6">
			<div class="rounded-2xl border border-red-300 bg-red-50 p-8 dark:border-red-500/30 dark:bg-red-500/10">
				<h2 class="text-xl font-black text-red-900 dark:text-red-200">Task data unavailable</h2>
				<p class="mt-2 text-red-800 dark:text-red-100">{loadError}</p>
				<p class="mt-3 text-sm text-red-700 dark:text-red-200">Confirm that <code class="rounded bg-black/5 px-1.5 py-0.5 dark:bg-white/10">static{CSV_PATH}</code> exists.</p>
			</div>
		</section>
	{:else}
		<section class="border-b border-slate-200 bg-slate-100/70 dark:border-slate-800 dark:bg-slate-900/40">
			<div class="mx-auto max-w-7xl px-4 py-8 sm:px-6">
				<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
					<div class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
						<p class="text-xs font-black uppercase tracking-wider text-slate-500">Total tasks</p>
						<p class="mt-2 text-3xl font-black text-slate-950 dark:text-white">{tasks.length}</p>
						<p class="mt-1 text-xs text-slate-500">Across {folderOptions.length} folders and {totalListCount} lists</p>
					</div>
					<div class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
						<p class="text-xs font-black uppercase tracking-wider text-slate-500">Completed</p>
						<p class="mt-2 text-3xl font-black text-emerald-600 dark:text-emerald-300">{completedCount}</p>
					</div>
					<div class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
						<p class="text-xs font-black uppercase tracking-wider text-slate-500">Active</p>
						<p class="mt-2 text-3xl font-black text-sky-600 dark:text-sky-300">{activeCount}</p>
					</div>
					<div class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
						<p class="text-xs font-black uppercase tracking-wider text-slate-500">Open / queued</p>
						<p class="mt-2 text-3xl font-black text-slate-700 dark:text-slate-200">{openCount}</p>
					</div>
					<div class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
						<p class="text-xs font-black uppercase tracking-wider text-slate-500">Urgent open</p>
						<p class="mt-2 text-3xl font-black text-red-600 dark:text-red-300">{urgentOpenCount}</p>
					</div>
					<div class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:col-span-2 lg:col-span-1 dark:border-slate-800 dark:bg-slate-900">
						<div class="flex items-center justify-between gap-3">
							<p class="text-xs font-black uppercase tracking-wider text-slate-500">Overall completion</p>
							<p class="text-sm font-black text-slate-700 dark:text-slate-200">{overallProgress}%</p>
						</div>
						<div class="mt-4 h-2.5 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
							<div class="h-full rounded-full bg-accent transition-all" style={`width: ${overallProgress}%`}></div>
						</div>
						<p class="mt-2 text-xs text-slate-500">{dueDateCount} tasks have due dates · {commentedTaskCount} include comments</p>
					</div>
				</div>
			</div>
		</section>

		<section class="mx-auto max-w-7xl px-4 py-10 sm:px-6">
			<div class="grid gap-4 lg:grid-cols-3">
				{#each allFolders as folder}
					<button
						type="button"
						onclick={() => selectFolder(selectedFolder === folder.name ? 'all' : folder.name)}
						class={`rounded-2xl border p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-accent ${selectedFolder === folder.name ? 'border-accent bg-accent/10' : 'border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900'}`}
					>
						<div class="flex items-start justify-between gap-3">
							<div>
								<p class="text-xs font-black uppercase tracking-wider text-slate-500">ClickUp folder</p>
								<h2 class="mt-1 text-xl font-black text-slate-950 dark:text-white">{folder.name}</h2>
							</div>
							<span class="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-black text-slate-700 dark:bg-slate-800 dark:text-slate-200">{folder.total}</span>
						</div>
						<div class="mt-4 h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
							<div class="h-full rounded-full bg-accent" style={`width: ${progressPercent(folder.completed, folder.total)}%`}></div>
						</div>
						<div class="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
							<span>{folder.completed} complete</span>
							<span>{folder.active} active</span>
							<span>{folder.urgent} urgent open</span>
							<span>{folder.lists.length} lists</span>
						</div>
					</button>
				{/each}
			</div>
		</section>

		<section class="mx-auto max-w-7xl px-4 pb-6 sm:px-6">
			<div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
				<div class="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
					<div>
						<p class="text-xs font-black uppercase tracking-wider text-accent">Filter the full export</p>
						<h2 class="mt-1 text-2xl font-black text-slate-950 dark:text-white">Find any task, list, folder, or owner</h2>
					</div>
					<div class="flex flex-wrap gap-2 print:hidden">
						<button type="button" onclick={expandAll} class="rounded-lg border border-slate-300 px-3 py-2 text-sm font-bold text-slate-700 transition hover:border-accent hover:text-slate-950 dark:border-slate-700 dark:text-slate-200">Expand all</button>
						<button type="button" onclick={collapseAll} class="rounded-lg border border-slate-300 px-3 py-2 text-sm font-bold text-slate-700 transition hover:border-accent hover:text-slate-950 dark:border-slate-700 dark:text-slate-200">Collapse all</button>
						<button type="button" onclick={resetFilters} class="rounded-lg border border-slate-300 px-3 py-2 text-sm font-bold text-slate-700 transition hover:border-accent hover:text-slate-950 dark:border-slate-700 dark:text-slate-200">Reset</button>
					</div>
				</div>

				<div class="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-6 print:hidden">
					<label class="md:col-span-2 xl:col-span-2">
						<span class="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-500">Search</span>
						<input bind:value={searchQuery} type="search" placeholder="Task, description, chapter, comment, or keyword…" class="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-accent focus:ring-2 focus:ring-accent/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white" />
					</label>
					<label>
						<span class="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-500">Folder</span>
						<select bind:value={selectedFolder} onchange={handleFolderFilterChange} class="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-950 outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white">
							<option value="all">All folders</option>
							{#each folderOptions as folder}
								<option value={folder}>{folder}</option>
							{/each}
						</select>
					</label>
					<label>
						<span class="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-500">List / chapter</span>
						<select bind:value={selectedList} class="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-950 outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white">
							<option value="all">All lists</option>
							{#each listOptions as option}
								<option value={option.value}>{option.label}</option>
							{/each}
						</select>
					</label>
					<label>
						<span class="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-500">Assignee</span>
						<select bind:value={selectedAssignee} class="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-950 outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white">
							<option value="all">All team members</option>
							{#each assigneeOptions as assignee}
								<option value={assignee}>{assignee}</option>
							{/each}
						</select>
					</label>
					<label>
						<span class="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-500">Priority</span>
						<select bind:value={selectedPriority} class="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-950 outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white">
							<option value="all">All priorities</option>
							<option value="1">Urgent</option>
							<option value="2">High</option>
							<option value="3">Normal</option>
							<option value="4">Low</option>
							<option value="null">No priority</option>
						</select>
					</label>
					<label>
						<span class="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-500">Status</span>
						<select bind:value={selectedStatus} class="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-950 outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white">
							<option value="all">All statuses</option>
							{#each statusOptions as status}
								<option value={status}>{status}</option>
							{/each}
						</select>
					</label>
				</div>

				<p class="mt-4 text-sm text-slate-500">
					Showing <strong class="text-slate-800 dark:text-slate-200">{filteredTasks.length}</strong> of {tasks.length} tasks across <strong class="text-slate-800 dark:text-slate-200">{filteredFolders.length}</strong> folders.
				</p>
			</div>
		</section>

		<section class="mx-auto max-w-7xl px-4 pb-4 sm:px-6">
			<div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
				{#each assigneeSummary as member}
					<div class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
						<div class="flex items-start justify-between gap-3">
							<div>
								<p class="font-black text-slate-950 dark:text-white">{member.name}</p>
								<p class="mt-1 text-sm text-slate-500">{member.total} assigned tasks</p>
							</div>
							<div class="grid size-11 place-items-center rounded-full bg-accent/15 text-sm font-black text-slate-800 dark:text-accent">
								{member.completed}/{member.total}
							</div>
						</div>
						<div class="mt-4 flex items-center justify-between text-xs">
							<span class="text-slate-500">Active</span>
							<span class="font-black text-sky-600 dark:text-sky-300">{member.active}</span>
						</div>
						<div class="mt-2 flex items-center justify-between text-xs">
							<span class="text-slate-500">Open urgent items</span>
							<span class="font-black text-red-600 dark:text-red-300">{member.urgent}</span>
						</div>
					</div>
				{/each}
			</div>
		</section>

		<section class="mx-auto max-w-7xl px-4 py-10 sm:px-6">
			<div class="space-y-5">
				{#each filteredFolders as folder}
					<article class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
						<button
							type="button"
							onclick={() => toggleFolder(folder.name)}
							aria-expanded={openFolders.has(folder.name)}
							class="flex w-full items-center justify-between gap-4 p-5 text-left transition hover:bg-slate-50 dark:hover:bg-slate-800/60"
						>
							<div class="min-w-0 flex-1">
								<div class="flex flex-wrap items-center gap-2">
									<p class="text-xs font-black uppercase tracking-[0.16em] text-accent">Folder</p>
									<h2 class="text-xl font-black text-slate-950 sm:text-2xl dark:text-white">{folder.name}</h2>
									<span class="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">{folder.total} tasks</span>
									<span class="rounded-full bg-sky-500/10 px-2.5 py-1 text-xs font-black text-sky-700 dark:text-sky-300">{folder.active} active</span>
									{#if folder.urgent > 0}
										<span class="rounded-full bg-red-500/10 px-2.5 py-1 text-xs font-black text-red-700 dark:text-red-300">{folder.urgent} urgent</span>
									{/if}
								</div>
								<div class="mt-3 flex items-center gap-3">
									<div class="h-2 flex-1 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
										<div class="h-full rounded-full bg-accent" style={`width: ${progressPercent(folder.completed, folder.total)}%`}></div>
									</div>
									<p class="shrink-0 text-xs font-bold text-slate-500">{folder.completed}/{folder.total} complete · {folder.lists.length} lists</p>
								</div>
							</div>
							<svg class={`size-5 shrink-0 text-slate-400 transition-transform ${openFolders.has(folder.name) ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
								<path d="m6 9 6 6 6-6" stroke-linecap="round" stroke-linejoin="round" />
							</svg>
						</button>

						{#if openFolders.has(folder.name)}
							<div class="space-y-4 border-t border-slate-200 bg-slate-100/60 p-4 sm:p-5 dark:border-slate-800 dark:bg-slate-950/45">
								{#each folder.lists as list}
									<section class="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
										<button
											type="button"
											onclick={() => toggleGroup(list.key)}
											aria-expanded={openGroups.has(list.key)}
											class="flex w-full items-center justify-between gap-4 p-4 text-left transition hover:bg-slate-50 dark:hover:bg-slate-800/60"
										>
											<div class="min-w-0 flex-1">
												<div class="flex flex-wrap items-center gap-2">
													<h3 class="text-lg font-black text-slate-950 dark:text-white">{list.name}</h3>
													<span class="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">{list.total} tasks</span>
													{#if list.active > 0}
														<span class="rounded-full bg-sky-500/10 px-2.5 py-1 text-xs font-black text-sky-700 dark:text-sky-300">{list.active} active</span>
													{/if}
													{#if list.urgent > 0}
														<span class="rounded-full bg-red-500/10 px-2.5 py-1 text-xs font-black text-red-700 dark:text-red-300">{list.urgent} urgent</span>
													{/if}
												</div>
												<div class="mt-3 flex items-center gap-3">
													<div class="h-2 flex-1 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
														<div class="h-full rounded-full bg-accent" style={`width: ${progressPercent(list.completed, list.total)}%`}></div>
													</div>
													<p class="shrink-0 text-xs font-bold text-slate-500">{list.completed}/{list.total} complete</p>
												</div>
											</div>
											<svg class={`size-5 shrink-0 text-slate-400 transition-transform ${openGroups.has(list.key) ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
												<path d="m6 9 6 6 6-6" stroke-linecap="round" stroke-linejoin="round" />
											</svg>
										</button>

										{#if openGroups.has(list.key)}
											<div class="border-t border-slate-200 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-950/40">
												<div class="grid gap-4 xl:grid-cols-2">
													{#each list.tasks as task}
														{@const taskDetails = detailRows(task)}
														<div class="flex h-full min-w-0 flex-col rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-accent/70 hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
															<div class="flex flex-wrap items-center gap-2">
																<span class={`rounded-full border px-2.5 py-1 text-[11px] font-black uppercase tracking-wide ${priorityClasses(task.priority)}`}>{priorityLabel(task.priority)}</span>
																<span class={`rounded-full border px-2.5 py-1 text-[11px] font-black uppercase tracking-wide ${statusClasses(task)}`}>{task.status}</span>
																{#if task.dueDate}
																	<span class="rounded-full border border-slate-300 bg-white px-2.5 py-1 text-[11px] font-bold text-slate-600 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300">Due {task.dueDate}</span>
																{/if}
																{#if task.comments.length > 0}
																	<span class="rounded-full border border-violet-300 bg-violet-500/10 px-2.5 py-1 text-[11px] font-bold text-violet-700 dark:border-violet-400/30 dark:text-violet-300">{task.comments.length} comment{task.comments.length === 1 ? '' : 's'}</span>
																{/if}
															</div>

															{#if task.link}
																<a href={task.link} target="_blank" rel="noreferrer" class="mt-3 text-base font-black leading-6 text-slate-950 transition hover:text-secondary hover:underline dark:text-white dark:hover:text-accent">{task.name}</a>
															{:else}
																<h4 class="mt-3 text-base font-black leading-6 text-slate-950 dark:text-white">{task.name}</h4>
															{/if}

															{#if task.content}
																<p class="mt-2 whitespace-pre-line text-sm leading-6 text-slate-600 dark:text-slate-300">{task.content}</p>
															{/if}

															<div class="mt-4 grid gap-2 text-xs sm:grid-cols-2">
																<div class="rounded-lg bg-slate-50 px-3 py-2 dark:bg-slate-950/60">
																	<p class="font-black uppercase tracking-wider text-slate-400">Created</p>
																	<p class="mt-1 font-bold text-slate-700 dark:text-slate-200">{task.createdDate || 'Not provided'}</p>
																</div>
																{#if task.startDate}
																	<div class="rounded-lg bg-slate-50 px-3 py-2 dark:bg-slate-950/60">
																		<p class="font-black uppercase tracking-wider text-slate-400">Starts</p>
																		<p class="mt-1 font-bold text-slate-700 dark:text-slate-200">{task.startDate}</p>
																	</div>
																{/if}
																{#if task.timeEstimate}
																	<div class="rounded-lg bg-slate-50 px-3 py-2 dark:bg-slate-950/60">
																		<p class="font-black uppercase tracking-wider text-slate-400">Estimate</p>
																		<p class="mt-1 font-bold text-slate-700 dark:text-slate-200">{task.timeEstimate}</p>
																	</div>
																{/if}
																<div class="rounded-lg bg-slate-50 px-3 py-2 dark:bg-slate-950/60">
																	<p class="font-black uppercase tracking-wider text-slate-400">Location</p>
																	<p class="mt-1 break-words font-bold text-slate-700 dark:text-slate-200">{task.location}</p>
																</div>
															</div>

															<div class="mt-4 border-t border-slate-100 pt-3 dark:border-slate-800">
																<p class="text-[11px] font-black uppercase tracking-wider text-slate-400">Assigned to</p>
																<div class="mt-2 flex flex-wrap gap-2">
																	{#if task.assignees.length > 0}
																		{#each task.assignees as assignee}
																			<span class="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-200">{assignee}</span>
																		{/each}
																	{:else}
																		<span class="text-sm text-slate-500">Unassigned</span>
																	{/if}
																</div>
															</div>

															{#if task.attachmentCount > 0 || task.checklistCount > 0 || task.tagCount > 0}
																<div class="mt-3 flex flex-wrap gap-2 text-xs font-bold text-slate-500">
																	{#if task.attachmentCount > 0}<span>{task.attachmentCount} attachment{task.attachmentCount === 1 ? '' : 's'}</span>{/if}
																	{#if task.checklistCount > 0}<span>{task.checklistCount} checklist item{task.checklistCount === 1 ? '' : 's'}</span>{/if}
																	{#if task.tagCount > 0}<span>{task.tagCount} tag{task.tagCount === 1 ? '' : 's'}</span>{/if}
																</div>
															{/if}

															{#if taskDetails.length > 0 || task.comments.length > 0}
																<details class="mt-4 rounded-lg border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950/50">
																	<summary class="cursor-pointer px-3 py-2.5 text-sm font-black text-slate-700 marker:text-accent dark:text-slate-200">View all exported details</summary>
																	<div class="space-y-4 border-t border-slate-200 p-3 dark:border-slate-800">
																		{#if task.comments.length > 0}
																			<div>
																				<p class="text-xs font-black uppercase tracking-wider text-slate-400">Comments</p>
																				<div class="mt-2 space-y-2">
																					{#each task.comments as comment}
																						<div class="rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900">
																							<p class="whitespace-pre-line text-sm leading-6 text-slate-700 dark:text-slate-200">{comment.text}</p>
																							<p class="mt-2 text-xs text-slate-500">{comment.by}{comment.date ? ` · ${comment.date}` : ''}</p>
																						</div>
																					{/each}
																				</div>
																			</div>
																		{/if}

																		{#if taskDetails.length > 0}
																			<dl class="grid gap-3 sm:grid-cols-2">
																				{#each taskDetails as detail}
																					<div class="min-w-0 rounded-lg bg-white p-3 dark:bg-slate-900">
																						<dt class="text-[11px] font-black uppercase tracking-wider text-slate-400">{detail.label}</dt>
																						<dd class="mt-1 whitespace-pre-wrap break-words text-sm text-slate-700 dark:text-slate-200">{detail.value}</dd>
																					</div>
																				{/each}
																			</dl>
																		{/if}
																	</div>
																</details>
															{/if}
														</div>
													{/each}
												</div>
											</div>
										{/if}
									</section>
								{/each}
							</div>
						{/if}
					</article>
				{/each}

				{#if filteredFolders.length === 0}
					<div class="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center dark:border-slate-700 dark:bg-slate-900">
						<h2 class="text-xl font-black text-slate-950 dark:text-white">No matching tasks</h2>
						<p class="mt-2 text-slate-500">Try clearing a filter or using a broader search.</p>
						<button type="button" onclick={resetFilters} class="mt-5 rounded-lg bg-accent px-4 py-2.5 text-sm font-black text-slate-950">Reset filters</button>
					</div>
				{/if}
			</div>
		</section>
	{/if}
</main>

<style>
	@media print {
		:global(header),
		:global(footer) {
			display: none !important;
		}

		main {
			background: white !important;
			color: black !important;
		}

		article,
		section,
		div {
			box-shadow: none !important;
		}

		details {
			display: block !important;
		}

		details > * {
			display: block !important;
		}

		a[href]::after {
			content: none !important;
		}
	}
</style>
