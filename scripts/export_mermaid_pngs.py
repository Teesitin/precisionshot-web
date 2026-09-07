from pathlib import Path
import argparse
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

SUPPORTED_EXTENSIONS = {".mmd", ".mermaid"}

# =========================
# Project locations
# =========================

SCRIPT_DIR = Path(__file__).resolve().parent
CURRENT_DIR = Path.cwd().resolve()


# =========================
# Arguments
# =========================

def parse_arguments() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description=(
            "Export Mermaid diagrams to PNG. "
            "Optionally provide the path to one Mermaid file."
        )
    )

    parser.add_argument(
        "input_path",
        nargs="?",
        help=(
            "Optional path to a .mmd or .mermaid file. "
            "When omitted, every Mermaid file in the flowcharts folder is exported."
        ),
    )

    return parser.parse_args()


# =========================
# File and folder handling
# =========================

def find_default_flowcharts_folder() -> Path:
    possible_flowchart_folders = [
        CURRENT_DIR / "flowcharts",
        SCRIPT_DIR / "flowcharts",
        SCRIPT_DIR.parent / "flowcharts",
    ]

    flowcharts_folder = next(
        (
            folder
            for folder in possible_flowchart_folders
            if folder.exists() and folder.is_dir()
        ),
        None,
    )

    if flowcharts_folder is None:
        searched = "\n".join(
            str(folder) for folder in possible_flowchart_folders
        )

        raise FileNotFoundError(
            "Could not find a folder called 'flowcharts'.\n\n"
            f"Searched:\n{searched}"
        )

    return flowcharts_folder.resolve()


def resolve_input_file(path_text: str) -> Path:
    input_file = Path(path_text).expanduser()

    if not input_file.is_absolute():
        input_file = CURRENT_DIR / input_file

    input_file = input_file.resolve()

    if not input_file.exists():
        raise FileNotFoundError(
            f"The selected Mermaid file does not exist:\n{input_file}"
        )

    if not input_file.is_file():
        raise ValueError(
            f"The selected path is not a file:\n{input_file}"
        )

    if input_file.suffix.lower() not in SUPPORTED_EXTENSIONS:
        raise ValueError(
            "The selected file must use one of these extensions:\n"
            ".mmd\n"
            ".mermaid\n\n"
            f"Selected file:\n{input_file}"
        )

    return input_file


def get_output_folder(source_folder: Path) -> Path:
    # Preserve the original project layout:
    #
    # project/
    # ├── flowcharts/
    # └── flowcharts_png/
    if source_folder.name.lower() == "flowcharts":
        return source_folder.parent / "flowcharts_png"

    # For Mermaid files outside a folder named "flowcharts",
    # create the output folder beside the source file.
    return source_folder / "flowcharts_png"


def get_diagram_files(input_path: str | None) -> tuple[list[Path], Path]:
    if input_path:
        selected_file = resolve_input_file(input_path)
        output_folder = get_output_folder(selected_file.parent)

        return [selected_file], output_folder

    flowcharts_folder = find_default_flowcharts_folder()

    diagram_files = sorted(
        file
        for file in flowcharts_folder.iterdir()
        if file.is_file()
        and file.suffix.lower() in SUPPORTED_EXTENSIONS
    )

    output_folder = get_output_folder(flowcharts_folder)

    return diagram_files, output_folder


# =========================
# Mermaid helpers
# =========================

def clean_mermaid_code(raw_text: str) -> str:
    text = raw_text.strip()

    fenced_match = re.search(
        r"^```(?:mermaid|mmd)?\s*([\s\S]*?)\s*```$",
        text,
        re.IGNORECASE,
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
        return [
            npx,
            "-y",
            "-p",
            "@mermaid-js/mermaid-cli",
            "mmdc",
        ]

    raise RuntimeError(
        "Mermaid CLI was not found.\n\n"
        "Install it with:\n"
        "npm install -D @mermaid-js/mermaid-cli\n\n"
        "or globally:\n"
        "npm install -g @mermaid-js/mermaid-cli"
    )


def render_mermaid(
    input_file: Path,
    output_file: Path,
    command_base: list[str],
) -> None:
    output_file.parent.mkdir(parents=True, exist_ok=True)

    command = [
        *command_base,
        "-i",
        str(input_file),
        "-o",
        str(output_file),
        "-s",
        str(SCALE),
        "-w",
        str(WIDTH),
        "-H",
        str(HEIGHT),
        "-b",
        BACKGROUND,
    ]

    if THEME:
        command.extend(["-t", THEME])

    print(f"Rendering: {input_file.name} -> {output_file.name}")

    result = subprocess.run(
        command,
        text=True,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
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

        raise RuntimeError(
            f"Mermaid render failed for {output_file.name}"
        )


# =========================
# Main
# =========================

def main() -> int:
    arguments = parse_arguments()

    diagram_files, output_folder = get_diagram_files(
        arguments.input_path
    )

    if not diagram_files:
        print("No .mmd or .mermaid files were found.")
        return 0

    output_folder.mkdir(parents=True, exist_ok=True)

    command_base = find_mermaid_command()

    print(f"Output folder: {output_folder}")
    print(f"Found {len(diagram_files)} Mermaid file(s).")

    with tempfile.TemporaryDirectory(
        prefix="mermaid_export_"
    ) as temp_directory:
        temp_folder = Path(temp_directory)

        for index, diagram_file in enumerate(diagram_files):
            raw_text = diagram_file.read_text(
                encoding="utf-8",
                errors="replace",
            )

            clean_text = clean_mermaid_code(raw_text)

            if not clean_text:
                print(f"Skipping empty file: {diagram_file.name}")
                continue

            temp_input = (
                temp_folder
                / f"{index}_{diagram_file.stem}.mmd"
            )

            temp_input.write_text(
                clean_text,
                encoding="utf-8",
            )

            output_png = (
                output_folder
                / f"{diagram_file.stem}.png"
            )

            render_mermaid(
                input_file=temp_input,
                output_file=output_png,
                command_base=command_base,
            )

    print("\nDone!")
    print(f"PNG files saved to: {output_folder.resolve()}")

    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except Exception as error:
        print("\nExport failed:")
        print(error)
        raise SystemExit(1)