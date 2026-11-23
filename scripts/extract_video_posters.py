"""Extract selected, unaltered video frames for the local website posters."""
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path
import subprocess

root = Path(__file__).resolve().parents[1]
destination = root / 'static/images/videos'
destination.mkdir(parents=True, exist_ok=True)
selections = [
    ('final-demonstration', 'Group13_PrecisionShot_Final_Demonstration.mp4', 585),
    ('final-presentation', 'Group13_PrecisionShot_Final_Presentation.mp4', 5),
    ('mini-demo', 'PrecisionShot_SD1_Mini_Demo_2026-07-27.mp4', 8),
    ('cdr-presentation', 'Cdr%20V1-1200.mp4', 5),
    ('midterm-demonstration', 'Group13_PrecisionShot_Midterm_Demonstration.mp4', 12)
]


def extract(selection):
    name, filename, second = selection
    subprocess.run([
        'ffmpeg', '-hide_banner', '-loglevel', 'error', '-ss', str(second),
        '-i', 'https://delayne.b-cdn.net/precisionshot/' + filename,
        '-frames:v', '1', '-vf', 'scale=1280:-2', '-q:v', '2', '-y',
        str(destination / f'{name}.jpg')
    ], check=True, timeout=60)
    print(f'Extracted {name}.jpg', flush=True)


if __name__ == '__main__':
    with ThreadPoolExecutor(max_workers=3) as pool:
        list(pool.map(extract, selections))
