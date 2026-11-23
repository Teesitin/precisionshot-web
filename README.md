# PrecisionShot Training System

[PrecisionShot](https://www.precisionshot.xyz/) is a University of Central Florida Senior Design project by EEL 4914 Group 13. The project is developing a portable, laser-based target that detects shot placement and provides immediate feedback without requiring live ammunition or a traditional shooting range.

This repository contains the public project website. It documents the team, project goals, engineering design, software flowcharts, reports, videos, and development timeline.

## Project Overview

PrecisionShot is designed as a complete dry-fire training platform rather than a simple hit-or-miss target. A dense phototransistor array detects incoming laser strikes directly on the target. Embedded software filters ambient light, estimates the impact coordinates, calculates a score, and updates the target's visual feedback.

The target is intended to work as a standalone device. A companion mobile application expands the experience with session history, performance analytics, configurable training modes, remote controls, and debugging information, but it is not required for normal target operation.

### Planned System

- A phototransistor sensor array for detecting laser impacts
- Analog multiplexers for scanning the sensor array efficiently
- An ESP32-S3 microcontroller for detection, scoring, and system control
- Addressable LEDs for immediate shot-location feedback
- An onboard LCD and physical controls for modes, calibration, and session management
- Bluetooth Low Energy communication with a companion mobile application
- Local microSD storage for shot records and development logs
- A rechargeable battery and regulated 3.3 V and 5 V power rails
- A durable enclosure designed to reduce ambient-light interference

### Engineering Goals

- Detect and display laser-shot placement with low latency
- Reject ambient light in varied indoor and outdoor conditions
- Provide useful operation even when no phone is connected
- Support multiple training and scoring modes
- Store shot history and expose meaningful performance analytics
- Remain portable through rechargeable battery power
- Keep the hardware and software modular enough for future expansion

The project is in active design and prototyping, so specifications and component choices may continue to evolve as the team tests the system.

## Website

The website serves as the central public record for the project and includes:

- Team members, reviewers, and areas of responsibility
- Project motivation, goals, objectives, and functionality
- Current software architecture and design flowcharts
- Senior Design reports, presentations, and project-management resources
- Presentation and demonstration videos
- Senior Design I and II milestones
- Light and dark display modes
- Interactive Mermaid diagrams with fullscreen zooming and panning
- An interactive OBJ viewer for the main, sensor, and regulator boards and enclosure parts

## Team

| Member | Discipline | Primary responsibility |
| --- | --- | --- |
| DeLayne Russell | Computer Engineering | Team lead and software design |
| Anthony Fontana | Computer Engineering | Hardware and PCB design |
| Kenn Pickavance | Electrical Engineering | Specifications and research |
| Nicolas Koteff | Electrical Engineering | Prototype and enclosure design |

## Technology

The website is built with:

- [SvelteKit](https://svelte.dev/docs/kit)
- [Svelte 5](https://svelte.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Mermaid](https://mermaid.js.org/)
- [Three.js](https://threejs.org/)
- [Vite](https://vite.dev/)
- [pnpm](https://pnpm.io/)

## Getting Started

### 3D Model Assets

The Design Outline viewer defaults to the **V8 assembled enclosure**, with all
ten V8 enclosure parts and the three circuit boards available in the selector.
The supplied `PrecisionShot_V8_Enclosure_STEP_STL_OBJ.zip` is extracted unchanged
into `static/models/v8/`, including the assembled OBJ, STEP, and STL, the
individual `OBJ/`, `STEP/`, and `STL/` folders, and the source README.

The V8 OBJ exports contain geometry without material files; the viewer uses
the OBJ loader's default surface material and does not request an MTL. The
assembled export retains the installed part positions and is displayed upright
with its optical face forward. Individual parts retain their supplied print
orientations and use Z-up for display. Coordinates are in millimeters. Display
centering, scaling, and rotation never change the source geometry.

The main board viewer uses `static/models/2026-10-06/Main Board V4.obj` and its
matching MTL, exported from Fusion after refreshing P0008A in Main Board Library
and regenerating the 3D PCB. The amplifier's eight leads were visually checked
against the through holes. The earlier `Main Board` export is retained. This is
a visualization export; Fusion's electrical check still reports 33 airwires.

The circuit boards were exported through Fusion on October 6, 2026 into
`static/models/2026-10-06/`. Each board OBJ keeps its original matching MTL
and uses Z-up for display:

| Viewer model | Fusion source |
| --- | --- |
| Main board V4 | Main Board linked 3D PCB, regenerated after the amplifier package refresh |
| Sensor board | Phototransistor Sensor Board (PSB) / Sensor Board linked 3D PCB |
| 3.3 V / 5 V regulator board | Regulator / 3.3v & 5V Regulator 3D PCB |

The earlier enclosure exports remain in `static/models/` for reference; the
viewer now shows V8 instead of the V3 enclosure parts.
The regulator pair is named `Regulator Board` to avoid an ampersand in asset URLs;
only its OBJ material-library filename was updated, with geometry and materials
preserved.

The 3D code and first model load when the viewer approaches the viewport. Only
the selected model is loaded, previous loads are cancelled when switching, and
the scene renders on interaction or resize rather than in a continuous loop.

### Requirements

- A current Node.js release
- pnpm

### Install and Run

```sh
pnpm install
pnpm dev
```

The development server prints the local URL after startup.

To expose the site to other devices on the same network:

```sh
pnpm dev --host
```

## Available Commands

| Command | Purpose |
| --- | --- |
| `pnpm dev` | Start the local development server |
| `pnpm check` | Run Svelte and TypeScript diagnostics |
| `pnpm build` | Create a production build |
| `pnpm preview` | Preview the production build locally |

Before submitting website changes, run:

```sh
pnpm check
pnpm build
```

## Project Structure

```text
precisionshot-web/
|-- flowcharts/                   Canonical Mermaid diagram sources
|-- flowcharts_png/               Exported diagram images
|-- scripts/
|   `-- export_mermaid_pngs.py    Mermaid PNG export helper
|-- src/
|   |-- lib/
|   |   |-- components/
|   |   |   `-- MermaidDiagram.svelte
|   |   `-- flowcharts.ts         Automatic flowchart discovery and titles
|   `-- routes/
|       |-- +layout.svelte        Navigation, theme controls, and footer
|       |-- +page.svelte          Main website content
|       `-- layout.css            Shared site styles
|-- static/                       Fonts and public static files
|-- package.json
`-- vite.config.ts
```

## Managing Flowcharts

The `.mermaid` files in `flowcharts/` are the source of truth for diagrams displayed on the website. The site discovers them automatically, sorts them by filename, and renders each one using the shared interactive diagram viewer.

To add a diagram:

1. Create a valid `.mermaid` file in `flowcharts/`.
2. Name it using the report section and a descriptive slug:

   ```text
   4_25_new_flowchart_title.mermaid
   ```

3. Run the development server or rebuild the site.

The example above is displayed as `4.25 New Flowchart Title`. No new Svelte component or manual import is required.

To update a diagram, edit its existing `.mermaid` file. Do not create a duplicate chart inside `src/`.

The PNG export helper can also generate static copies of every diagram:

```sh
python scripts/export_mermaid_pngs.py
```

## Updating Website Content

- Edit the main project copy and timelines in `src/routes/+page.svelte`.
- Edit document, slide, and video links in `src/lib/resources.ts`. Store downloadable assets in the Bunny `delayne/precisionshot` folder and use public `https://delayne.b-cdn.net/precisionshot/` URLs.
- Give each available PDF or MP4 a unique `downloadId`. The `/downloads/[id]` endpoint streams that allowlisted file from Bunny with an attachment header, so the download action saves a file instead of opening a PDF or video tab. It requires no Bunny credentials at runtime.
- Edit navigation, theme behavior, or the footer in `src/routes/+layout.svelte`.
- Edit shared visual styles in `src/routes/layout.css`.
- Add or update design diagrams only in `flowcharts/`.

The final documentation list contains all 12 required deliverables. As of November 23, 2026, 11 have downloadable Bunny files; only the SD2 Final Report is awaiting its file. Keep `downloadId` unset until a downloadable file is available; the page derives its availability counts from this inventory.

The final presentation slides were exported from the shared Google Slides deck (last modified November 17, 2026) and uploaded as `Group13_PrecisionShot_Final_Presentation.pdf`. The midterm video link comes from the submitted Webcourses Midterm Demo Form, and the final video and conference-paper links come from the submitted Final Presentation Form. Webcourses and Google Drive were used read-only.

The three SD2 videos were downloaded from those YouTube links as 1080p H.264/AAC MP4s and uploaded to Bunny with fast-start metadata. Their source IDs are `K3y44JINBK8` (midterm demo), `2viNiAzjPvQ` (final presentation), and `4HD-EzRiYyo` (final demo). Both Watch and Download actions now use the Bunny copies.

The SD2 timeline uses approximate historical milestone dates. ClickUp mostly has no completion timestamps, so the dates use the due dates for [bench hardware and procurement](https://app.clickup.com/t/wdy2xh0kyg), [PCB fabrication and parts](https://app.clickup.com/t/wdy2xh0kyq), [integrated detection and app workflow](https://app.clickup.com/t/wdy2xh0kzq), [midterm hardware build](https://app.clickup.com/t/wdy2xh0kzu), [final enclosure](https://app.clickup.com/t/wdy2xh0m09), and [final retests](https://app.clickup.com/t/wdy2xh0m08). Course anchors are the September 23 CDR package, October 9 PCB assembly deadline, and November 13 final-form submission / November 18 review meeting. Sensor testing and the small prototype are approximate dates around the bench and CDR milestones. ClickUp and Webcourses were read-only.

## Deployment

Create the production output with:

```sh
pnpm build
```

SvelteKit currently uses `adapter-auto`. Select and configure the appropriate SvelteKit adapter if the final hosting provider requires a platform-specific deployment target.

## Project Context

PrecisionShot is an engineering prototype intended to explore accessible laser-based dry-fire training, embedded sensing, real-time feedback, and performance tracking. It does not replace proper firearm handling, training, or safety practices.
