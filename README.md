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

The engineering section defaults to the complete V8 enclosure supplied on November 23, 2026 in `PrecisionShot_V8_Enclosure_STEP_STL_OBJ.zip`. The original assembled OBJ and all ten individual OBJs are stored in `static/models/2026-11-23-v8/`, with the package README. The unchanged full ZIP is available from Project Resources and the engineering page at `/downloads/PrecisionShot_V8_Enclosure_STEP_STL_OBJ.zip`. It includes assembled and individual STEP, STL, and OBJ exports. The complete package is included with the website assets.

`src/lib/models.ts` defines the model selector, download link, source paths, sizes, and orientation. The assembled V8 OBJ uses Y-up with its front facing negative Z; the individual parts use their original Z-up print orientations. The viewer centers and fits geometry for display without modifying the source files. The V8 exports have no MTL library, so the viewer applies a neutral display finish. The prior V3 enclosure assets remain in the repository as historical exports and are no longer offered in the current selector.

The electronics models remain the October 6 Fusion exports in `static/models/2026-10-06/`, with each original matching MTL:

| Viewer model | Fusion source |
| --- | --- |
| Main board V4 | Main Board linked 3D PCB, regenerated after the amplifier package refresh |
| Sensor board | Phototransistor Sensor Board (PSB) / Sensor Board linked 3D PCB |
| 3.3 V / 5 V regulator board | Regulator / 3.3v & 5V Regulator 3D PCB |

The main board was exported after refreshing P0008A in Main Board Library and regenerating the 3D PCB. The amplifier's eight leads were visually checked against the through holes. This is a visualization export; Fusion's electrical check still reports 33 airwires. The regulator pair is named `Regulator Board` to avoid an ampersand in asset URLs; only its OBJ material-library filename was updated.

The V8 homepage and engineering images are rendered directly from the assembled OBJ by `python scripts/render_enclosure.py` (NumPy and Pillow required). The assembled view preserves installed positions; the exploded view separates the named parts for visibility. Colors are a neutral visualization finish. The original CAD geometry and downloadable package are unchanged.

The 3D viewer is visible by default; its code and first model load as it approaches the viewport. Only the selected model is loaded, previous loads are cancelled when switching, and the scene renders on interaction or resize rather than in a continuous loop.

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

- Edit the main project copy and homepage milestone highlights in `src/routes/+page.svelte`.
- The polished showcase keeps the team, reviewer list, and full milestone dates in `src/lib/project.ts`. All engineering content, diagrams, 3D models, and the task archive are on the homepage. Previous `/engineering` and `/tasks` URLs redirect to their corresponding homepage sections.
- Edit document, slide, and video links in `src/lib/resources.ts`. Store downloadable assets in the Bunny `delayne/precisionshot` folder and use public `https://delayne.b-cdn.net/precisionshot/` URLs.
- Give each available PDF or MP4 a unique `downloadId`. The `/downloads/[id]` endpoint streams that allowlisted file from Bunny with an attachment header, so the download action saves a file instead of opening a PDF or video tab. It requires no Bunny credentials at runtime.
- Edit navigation, theme behavior, or the footer in `src/routes/+layout.svelte`.
- Edit shared visual styles in `src/routes/layout.css`.
- Add or update design diagrams only in `flowcharts/`.

The final documentation list contains all 12 required deliverables. As of November 23, 2026, 11 have downloadable Bunny files; only the SD2 Final Report is awaiting its file. Keep `downloadId` unset until a downloadable file is available; the page keeps pending resources visible.

The final presentation slides were exported from the shared Google Slides deck (last modified November 17, 2026) and uploaded as `Group13_PrecisionShot_Final_Presentation.pdf`. The midterm video link comes from the submitted Webcourses Midterm Demo Form, and the final video and conference-paper links come from the submitted Final Presentation Form. Webcourses and Google Drive were used read-only.

The three SD2 videos were downloaded from those YouTube links as 1080p H.264/AAC MP4s and uploaded to Bunny with fast-start metadata. Their source IDs are `K3y44JINBK8` (midterm demo), `2viNiAzjPvQ` (final presentation), and `4HD-EzRiYyo` (final demo). Both Watch and Download actions now use the Bunny copies.

The one-page showcase uses short copy, visible system cards, in-page video playback, and a grouped download library. `static/images/showcase/` contains original CAD renders, app screenshots, and team portraits extracted from the shared final presentation, plus a still from the final demo. These are project visuals, not generated product photography. The homepage captions distinguish CAD renders from the working prototype. The website serves these showcase images and captions directly.

`static/captions/` contains YouTube's auto-generated English VTT tracks for the two final recordings; the video player labels them accordingly. The approved gold (`#ecd316`), brown (`#7f683f`), and slate theme is preserved, with self-hosted BlackOpsOne branding and the original dark default. Layout revisions must retain this theme. Interface icons use Google Material Symbols Outlined, self-hosted as a 15-icon WOFF2 subset with its Apache 2.0 license. `Icon.svelte` maps to the bundled ligatures; update the subset when adding symbols. The homepage shows all three system cards and opens the videos, reviewers, and timeline by default. The engineering section shows all five diagrams and the 3D viewer without an expand button; the selected 3D model loads as it approaches the viewport. A gallery displays all ten V8 parts separately. The header keeps the approved translucent blur, and the hero displays the target and app side by side without overlap.

The SD2 timeline uses approximate historical milestone dates. ClickUp mostly has no completion timestamps, so the dates use the due dates for [bench hardware and procurement](https://app.clickup.com/t/wdy2xh0kyg), [PCB fabrication and parts](https://app.clickup.com/t/wdy2xh0kyq), [integrated detection and app workflow](https://app.clickup.com/t/wdy2xh0kzq), [midterm hardware build](https://app.clickup.com/t/wdy2xh0kzu), [final enclosure](https://app.clickup.com/t/wdy2xh0m09), and [final retests](https://app.clickup.com/t/wdy2xh0m08). Course anchors are the September 23 CDR package, October 9 PCB assembly deadline, and November 13 final-form submission / November 18 review meeting. Sensor testing and the small prototype are approximate dates around the bench and CDR milestones. ClickUp and Webcourses were read-only.

## Deployment

Create the production output with:

```sh
pnpm build
```

SvelteKit currently uses `adapter-auto`. Select and configure the appropriate SvelteKit adapter if the final hosting provider requires a platform-specific deployment target.

## Project Context

PrecisionShot is an engineering prototype intended to explore accessible laser-based dry-fire training, embedded sensing, real-time feedback, and performance tracking. It does not replace proper firearm handling, training, or safety practices.

The site uses one continuous page. Keep internal navigation as section anchors. `EngineeringSection.svelte` contains the model viewer, part gallery, and all five diagrams. The task archive shows folder totals and links to the unchanged full CSV export; rebuild its concise snapshot with `python scripts/summarize_tasks.py`. Keep section headings brief and avoid repeated subtitles or explanatory marketing copy.

Light-mode text accents use slate (`#334155`) instead of brown, per the headline-color revision. Dark-mode text accents retain the approved gold.

All file download actions belong in `Downloads.svelte`, grouped into one column at half the page width on desktop and full width on mobile. Keep download buttons out of engineering, video cards, the task archive, and the player. Video posters are selected frames from the actual recordings; regenerate them with `python scripts/extract_video_posters.py` (FFmpeg required). Poster paths, accessible descriptions, and durations are in `src/lib/resources.ts`.

The existing `static/models/v8/` exports from main are preserved alongside the dated display meshes and the complete ZIP download. The current model selector is defined in `src/lib/models.ts` and retains the V8 assembly, all ten parts, and the electronics models.

Dark-mode charts adapt explicit source colors through `src/lib/diagram-colors.ts`, since Mermaid source styles override theme defaults. Muted group and node colors apply to both the page and fullscreen viewer; light-mode source colors are preserved.
