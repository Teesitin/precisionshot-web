from pathlib import Path
import re
import shutil
import subprocess
import tempfile

# =========================
# Export settings
# =========================

SCALE = 4
WIDTH = 2400
HEIGHT = 1600
BACKGROUND = "white"
THEME = None

# =========================
# Locate project folders
# =========================

SCRIPT_DIR = Path(__file__).resolve().parent
CURRENT_DIR = Path.cwd().resolve()

POSSIBLE_FLOWCHART_FOLDERS = [
    CURRENT_DIR / "flowcharts",
    SCRIPT_DIR / "flowcharts",
    SCRIPT_DIR.parent / "flowcharts",
]

FLOWCHARTS_FOLDER = next(
    (folder for folder in POSSIBLE_FLOWCHART_FOLDERS if folder.exists()),
    None
)

if FLOWCHARTS_FOLDER is None:
    searched = "\n".join(str(folder) for folder in POSSIBLE_FLOWCHART_FOLDERS)
    raise FileNotFoundError(
        "Could not find a folder called 'flowcharts'.\n\n"
        f"Searched:\n{searched}"
    )

PROJECT_ROOT = FLOWCHARTS_FOLDER.parent
OUTPUT_FOLDER = PROJECT_ROOT / "flowcharts_png"

SUPPORTED_EXTENSIONS = {".mmd", ".mermaid"}

# =========================
# Helpers
# =========================

def clean_mermaid_code(raw_text: str) -> str:
    text = raw_text.strip()

    fenced_match = re.search(
        r"^```(?:mermaid|mmd)?\s*([\s\S]*?)\s*```$",
        text,
        re.IGNORECASE
    )

    if fenced_match:
        text = fenced_match.group(1).strip()

    return text


def find_mermaid_command() -> list[str]:
    mmdc = shutil.which("mmdc")
    if mmdc:
        return [mmdc]

    npx = shutil.which("npx")
    if npx:
        return [npx, "-y", "-p", "@mermaid-js/mermaid-cli", "mmdc"]

    raise RuntimeError(
        "Mermaid CLI was not found.\n\n"
        "Install it with:\n"
        "npm install -D @mermaid-js/mermaid-cli\n\n"
        "or globally:\n"
        "npm install -g @mermaid-js/mermaid-cli"
    )


def render_mermaid(input_file: Path, output_file: Path, command_base: list[str]) -> None:
    output_file.parent.mkdir(parents=True, exist_ok=True)

    command = [
        *command_base,
        "-i", str(input_file),
        "-o", str(output_file),
        "-s", str(SCALE),
        "-w", str(WIDTH),
        "-H", str(HEIGHT),
        "-b", BACKGROUND,
    ]

    if THEME:
        command.extend(["-t", THEME])

    print(f"Rendering: {input_file.name} -> {output_file.name}")

    result = subprocess.run(
        command,
        text=True,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE
    )

    if result.returncode != 0:
        print("\nFAILED")
        print(f"Input:  {input_file}")
        print(f"Output: {output_file}")

        if result.stdout.strip():
            print("\nSTDOUT:")
            print(result.stdout)

        if result.stderr.strip():
            print("\nSTDERR:")
            print(result.stderr)

        raise RuntimeError(f"Mermaid render failed for {output_file.name}")


# =========================
# Main
# =========================

def main() -> int:
    diagram_files = sorted(
        file
        for file in FLOWCHARTS_FOLDER.iterdir()
        if file.is_file() and file.suffix.lower() in SUPPORTED_EXTENSIONS
    )

    if not diagram_files:
        print(f"No .mmd or .mermaid files found in: {FLOWCHARTS_FOLDER}")
        return 0

    OUTPUT_FOLDER.mkdir(parents=True, exist_ok=True)

    command_base = find_mermaid_command()

    print(f"Flowcharts folder: {FLOWCHARTS_FOLDER}")
    print(f"Output folder:     {OUTPUT_FOLDER}")
    print(f"Found {len(diagram_files)} Mermaid file(s).")

    with tempfile.TemporaryDirectory(prefix="mermaid_export_") as temp_dir:
        temp_dir = Path(temp_dir)

        for diagram_file in diagram_files:
            raw_text = diagram_file.read_text(encoding="utf-8", errors="replace")
            clean_text = clean_mermaid_code(raw_text)

            if not clean_text:
                print(f"Skipping empty file: {diagram_file.name}")
                continue

            temp_input = temp_dir / f"{diagram_file.stem}.mmd"
            temp_input.write_text(clean_text, encoding="utf-8")

            output_png = OUTPUT_FOLDER / f"{diagram_file.stem}.png"

            render_mermaid(
                input_file=temp_input,
                output_file=output_png,
                command_base=command_base
            )

    print("\nDone!")
    print(f"PNG files saved to: {OUTPUT_FOLDER.resolve()}")
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except Exception as error:
        print("\nExport failed:")
        print(error)
        raise SystemExit(1)