# Phoenix Nest — Log Splitter Diagnostic PWA

Progressive Web App for installing, operating, and troubleshooting the Phoenix Nest log splitter auto-extend/return system.

**Drawing:** PN-LS-002 Rev A  
**System:** 12VDC · 2× DPDT DIN Rail Relay · Double Solenoid Hydraulic Valve  
**Owner:** Phoenix Nest LLC · Flatwoods, KY

## Install the App

Open `index.html` in any browser and tap **"Add to Home Screen"** to install as a standalone offline app. Or host on any static web server.

The app works fully offline after first load (service worker caches everything).

## Features

| Tab | Purpose |
|-----|---------|
| 🔨 **Install** | Step-by-step wiring instructions with checkboxes and test checkpoints. Wire and test one circuit at a time. |
| 🔧 **Troubleshoot** | Interactive decision tree. Tap the symptom, answer questions, get the specific wire or component to check. |
| 📋 **Wiring** | Complete wire schedule (W01–W25), relay pinout tables (K1/K2), flyback diode reference. Searchable. |
| ⚡ **Tracer** | Select a circuit or wire to see the full current path with color-coded components. |
| ▶ **Simulator** | Animated cycle simulator. Hold FWD/BWD to jog, tap CYCLE to watch auto sequence, E-STOP kills all. |

## System Overview

One press of the **CYCLE** button extends the hydraulic cylinder (splits wood), then automatically retracts to the home position. **FWD** and **BWD** buttons provide direct manual jog control independent of the relay logic.

- **K1** — Cycle latch relay (seals on CYCLE press, drops when LS2 opens at home)
- **K2** — Direction relay (DPDT changeover routes power to SOL-A or SOL-B)
- **LS1** — Limit switch at full extend (NC, opens to trigger retract)
- **LS2** — Limit switch at home (NC, opens to end cycle)
- **E-STOP** — Kills entire +12V bus

## Files

```
├── index.html              ← PWA app (single file, open in browser)
├── manifest.json           ← PWA manifest for home screen install
├── sw.js                   ← Service worker for offline support
├── src/                    ← Source modules (edit these, then rebuild)
│   ├── data/
│   │   ├── wires.js        ← Wire schedule W01–W25
│   │   ├── circuits.js     ← Circuit path definitions
│   │   ├── troubleshoot.js ← Decision tree nodes
│   │   ├── relay-pins.js   ← K1/K2 pin assignments
│   │   └── install-steps.js← Install procedure steps
│   ├── modules/
│   │   ├── nav.js          ← Tab navigation
│   │   ├── tab-install.js  ← Install checklist renderer
│   │   ├── tab-wiring.js   ← Wiring reference renderer
│   │   ├── tab-tracer.js   ← Circuit tracer renderer
│   │   ├── tab-troubleshoot.js ← Decision tree engine
│   │   └── tab-simulator.js   ← Cycle simulator with animation
│   ├── styles/
│   │   ├── base.css        ← Variables, layout, shared components
│   │   ├── install.css     ← Install tab styles
│   │   ├── wiring.css      ← Table styles
│   │   ├── tracer.css      ← Tracer component styles
│   │   ├── troubleshoot.css← Decision tree styles
│   │   └── simulator.css   ← Simulator styles
│   └── shell.html          ← HTML template
├── build.sh                ← Concatenates src/ into index.html
├── docs/
│   ├── log_splitter_install_manual.docx  ← Print manual for binder
│   └── log_splitter_print.html           ← Print schematic (landscape)
├── LOG_SPLITTER_AI_REFERENCE.md  ← Feed to any AI for troubleshooting
└── ARCHITECTURE.md               ← Build system documentation
```

## Modifying

Edit any file in `src/`, then rebuild:

```bash
bash build.sh
```

This concatenates all CSS and JS modules into the single `index.html`.

## Print Documents

The `docs/` folder contains printable versions for a physical binder kept near the equipment:

- **log_splitter_install_manual.docx** — 15-page install manual with wire labels, relay pinouts, test checkpoints, and troubleshooting matrix
- **log_splitter_print.html** — 2-page wiring schematic (print landscape)

## AI Agent Reference

`LOG_SPLITTER_AI_REFERENCE.md` contains the complete system specification, circuit paths, relay pin assignments, troubleshooting decision trees, and diagnostic procedures. Drop this file into any AI agent's context for remote troubleshooting support.

## License

Internal use — Phoenix Nest LLC
