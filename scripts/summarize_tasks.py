"""Build the concise website archive from the unchanged ClickUp CSV export."""
import csv
import json
from collections import defaultdict
from pathlib import Path

root = Path(__file__).resolve().parents[1]
groups = defaultdict(lambda: {'total': 0, 'complete': 0})
with (root / 'static/clickup-tasks-static/export-7-22-26.csv').open(encoding='utf-8-sig', newline='') as source:
    for task in csv.DictReader(source):
        if not task['Task Name'].strip():
            continue
        path = json.loads(task['Folder Name/Path'])
        group = groups[path[-1] if path else 'Other']
        group['total'] += 1
        group['complete'] += task['Status'].strip().lower() in {'closed', 'done', 'shipped', 'complete', 'completed'}
summary = [{'name': name, **counts} for name, counts in sorted(groups.items())]
(root / 'src/lib/task-summary.json').write_text(json.dumps(summary, indent=2) + '\n', encoding='utf-8')
print(f'Summarized {sum(group["total"] for group in summary)} tasks in {len(summary)} folders.')
