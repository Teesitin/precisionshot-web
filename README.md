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
- [Vite](https://vite.dev/)
- [pnpm](https://pnpm.io/)

## Getting Started

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
