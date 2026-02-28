# Log Splitter PWA — Build Architecture

## File Structure
```
pwa/
├── src/
│   ├── data/
│   │   ├── wires.js          # Wire schedule (W01-W25)
│   │   ├── circuits.js       # Circuit path definitions for tracer
│   │   ├── troubleshoot.js   # Decision tree nodes
│   │   └── relay-pins.js     # K1/K2 pin assignments
│   ├── modules/
│   │   ├── tab-wiring.js     # Wiring reference tab renderer
│   │   ├── tab-tracer.js     # Circuit tracer tab renderer
│   │   ├── tab-troubleshoot.js # Troubleshoot decision tree
│   │   ├── tab-simulator.js  # Cycle simulator with animation
│   │   └── nav.js            # Tab navigation controller
│   ├── styles/
│   │   ├── base.css          # Reset, variables, layout, header, tabs
│   │   ├── wiring.css        # Table styles for wiring tab
│   │   ├── tracer.css        # Tracer component colors/layout
│   │   ├── troubleshoot.css  # Decision tree card styles
│   │   └── simulator.css     # Simulator grid/cylinder styles
│   └── shell.html            # HTML skeleton (tabs, panel divs)
├── build.sh                  # Concatenates everything into index.html
├── manifest.json             # PWA manifest
└── sw.js                     # Service worker for offline
```

## Build Process
1. build.sh reads shell.html
2. Injects all CSS into <style> block
3. Injects all JS data + modules into <script> block
4. Outputs single index.html
5. Copies manifest.json and sw.js alongside

## Design Decisions
- Dark industrial theme, high contrast for outdoor/sun
- Big touch targets (min 44px) for gloved hands
- All data is static JS objects (no fetch, no API)
- Each tab module exports a single init() function
- Simulator uses requestAnimationFrame for cylinder animation
- PWA installable, fully offline after first load
