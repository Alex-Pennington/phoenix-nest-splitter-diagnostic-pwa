# Phoenix Nest — Log Splitter Diagnostic PWA

Progressive Web App for installing, operating, and troubleshooting the Phoenix Nest log splitter auto-extend/return system.

**Drawing:** PN-LS-002 Rev C
**System:** 12VDC · 3× DPDT DIN Rail Relay · Double Solenoid Hydraulic Valve
**Owner:** Phoenix Nest LLC · Flatwoods, KY

**Live App:** https://alex-pennington.github.io/phoenix-nest-splitter-diagnostic-pwa/

## Install the App

Open the live link above (or `index.html` locally) and tap **"Add to Home Screen"** to install as a standalone offline app.

The app works fully offline after first load (service worker caches everything).

## Features

| Tab | Purpose |
|-----|---------|
| 🔨 **Install** | 6-phase wiring guide with checkboxes and test checkpoints. Wire and test one circuit at a time. |
| 🔧 **Troubleshoot** | Interactive decision tree. Tap the symptom, answer questions, get the specific wire or component to check. |
| 📋 **Wiring** | Complete wire schedule (W01–W30), relay pinout tables (K1/K2/K3), flyback diode reference. Searchable. |
| ⚡ **Tracer** | Select a circuit or wire to see the full current path with color-coded components. |
| ▶ **Simulator** | Animated cycle simulator. Hold FWD/BWD to jog, tap CYCLE to watch auto sequence with K3 anti-bounce logic. |

## System Overview

One press of the **CYCLE** button extends the hydraulic cylinder (splits wood), then automatically retracts to the home position. **FWD** and **BWD** buttons provide direct manual jog control independent of the relay logic.

**Start procedure:** Tap FWD to nudge off home, then press CYCLE. The retract limit NC pair prevents K1 from latching at home — this is by design.

### Relay Roles

- **K1** — Cycle latch (seals on CYCLE press, drops when retract limit opens at home)
- **K2** — Direction (changeover: ON=SOL-A extend, OFF=SOL-B retract, fed through K3 NC lock)
- **K3** — Extend memory latch (latches at extend limit, seal holds it, K3 NC locks K2 off permanently to prevent bounce)

### Why 3 Relays

Without K3, K2 bounces at the extend limit. When K2 drops (extend limit opens), the cylinder retracts, moves off the limit, the limit closes again, K2 picks back up — infinite chatter. K3 remembers that we reached extend and locks K2 off until K1 resets the whole cycle.

### Node X

K1 Pair 2 NO output. Only hot when K1 is latched. Powers K2 output COM, K2 coil via K3, and K3 coil via extend limit.

### Full Sequence

1. **IDLE** — K1 off, Node X dead, everything safe
2. **FWD nudge** — moves cylinder off retract limit
3. **CYCLE** — K1 latches, Node X hot, K2 on (via K3 NC closed), SOL-A extends
4. **Extend limit** — K3 latches and seals, K3 NC opens, K2 drops, SOL-B retracts
5. **Off extend limit** — K3 sealed, K2 locked off, no bounce
6. **Retract limit** — K1 drops, Node X dead, K3 seal lost, all off

## Files

```
├── index.html               ← PWA app (single file, open in browser)
├── manifest.json            ← PWA manifest for home screen install
├── sw.js                    ← Service worker for offline support
├── src/                     ← Source modules (edit these, then rebuild)
│   ├── data/
│   │   ├── wires.js         ← Wire schedule W01–W30
│   │   ├── circuits.js      ← Circuit path definitions (9 circuits)
│   │   ├── troubleshoot.js  ← Decision tree nodes
│   │   ├── relay-pins.js    ← K1/K2/K3 pin assignments
│   │   └── install-steps.js ← 6-phase install procedure
│   ├── modules/
│   │   ├── nav.js           ← Tab navigation
│   │   ├── tab-install.js   ← Install checklist renderer
│   │   ├── tab-wiring.js    ← Wiring reference renderer
│   │   ├── tab-tracer.js    ← Circuit tracer renderer
│   │   ├── tab-troubleshoot.js ← Decision tree engine
│   │   └── tab-simulator.js    ← Cycle simulator with K3 logic
│   ├── styles/              ← CSS modules (6 files)
│   └── shell.html           ← HTML template with injection points
├── build.sh                 ← Concatenates src/ into index.html
├── docs/
│   ├── log_splitter_install_manual.docx  ← Print manual for binder
│   ├── log_splitter_print.html           ← Print schematic (landscape)
│   └── log_splitter_work_order_2sided.pdf ← Field work order
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

- **log_splitter_install_manual.docx** — Install manual with wire labels, relay pinouts, test checkpoints
- **log_splitter_print.html** — Wiring schematic (print landscape)
- **log_splitter_work_order_2sided.pdf** — 2-sided field work order

## AI Agent Reference

`LOG_SPLITTER_AI_REFERENCE.md` contains the condensed Rev C system spec — relay roles, Node X, full sequence, limit switch wiring, flyback diodes, and diagnostic order. Drop this file into any AI agent's context for remote troubleshooting support.

## License

Internal use — Phoenix Nest LLC
