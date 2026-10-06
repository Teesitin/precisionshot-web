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

The Design Outline viewer loads the supplied OBJ/MTL pairs from `static/models/`.
Keep each original material file beside its matching OBJ when refreshing the
exports. The source geometry is unchanged; the viewer centers and fits it for
display. The current Fusion exports all use Z-up.

The main board viewer uses `static/models/2026-10-06/Main Board V4.obj` and its
matching MTL, exported from Fusion after refreshing P0008A in Main Board Library
and regenerating the 3D PCB. The amplifier's eight leads were visually checked
against the through holes. The earlier `Main Board` export is retained. This is
a visualization export; Fusion's electrical check still reports 33 airwires.

The viewer's current set was exported through Fusion on October 6, 2026 into
`static/models/2026-10-06/`. Each OBJ has its original matching MTL:

| Viewer model | Fusion source |
| --- | --- |
| Main board V4 | Main Board linked 3D PCB, regenerated after the amplifier package refresh |
| Sensor board | Phototransistor Sensor Board (PSB) / Sensor Board linked 3D PCB |
| 3.3 V / 5 V regulator board | Regulator / 3.3v & 5V Regulator 3D PCB |
| Top faceplate V3 | Enclosure / V3 Enclosure / SENIOR DESIGN 2 Faceplate Top V3 |
| Bottom faceplate V3 | Enclosure / V3 Enclosure / SENIOR DESIGN 2 Faceplate Bottom V3 |
| Enclosure container V3 | Enclosure / V3 Enclosure / SENIOR DESIGN 2 Container V3 |
| Diffuser | Enclosure / V3 Enclosure / SENIOR DESIGN 2 Diffuser |

The earlier exports remain in `static/models/` for reference. The V3 Assembly
document contains imported board STEP references, so it is not used as a complete
enclosure model. The enclosure parts are available individually in the selector.
The regulator pair is named `Regulator Board` to avoid an ampersand in asset URLs;
only its OBJ material-library filename was updated, with geometry and materials
preserved.
Fusion's `Clear` material is exported as opaque black; the viewer displays it
as a pale translucent surface for the diffuser while retaining the original MTL.

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

- Edit the main project copy, resource links, videos, and timelines in `src/routes/+page.svelte`.
- Edit navigation, theme behavior, or the footer in `src/routes/+layout.svelte`.
- Edit shared visual styles in `src/routes/layout.css`.
- Add or update design diagrams only in `flowcharts/`.

Some document and video entries intentionally remain unavailable until the corresponding Senior Design deliverables are complete.

## Deployment

Create the production output with:

```sh
pnpm build
```

SvelteKit currently uses `adapter-auto`. Select and configure the appropriate SvelteKit adapter if the final hosting provider requires a platform-specific deployment target.

## Project Context

PrecisionShot is an engineering prototype intended to explore accessible laser-based dry-fire training, embedded sensing, real-time feedback, and performance tracking. It does not replace proper firearm handling, training, or safety practices.
