# Log Splitter Auto-Extend/Return — AI Agent Troubleshooting Reference

> **Owner:** Phoenix Nest LLC — Alex "Rayven" Pennington  
> **Drawing:** PN-LS-002 Rev A  
> **System:** 12VDC, 2× DPDT DIN Rail Relays, Double Solenoid Hydraulic Valve  
> **Date:** February 2026  
> **Location:** Flatwoods, KY

---

## System Purpose

This relay logic circuit automates a hydraulic log splitter's extend-and-return cycle. One press of the CYCLE button extends the cylinder (splits wood), then automatically retracts to the home position. Manual jog buttons (FWD/BWD) provide direct solenoid control independent of the relay logic.

---

## Components

| ID | Component | Type | Function |
|----|-----------|------|----------|
| FUSE | 15A inline blade fuse | Protection | Overcurrent protection for entire system |
| E-STOP | Pushbutton, twist-release | NC/NO contacts | NC contact in series with +12V bus; kills all power |
| FWD | Momentary pushbutton | NO | Direct-wires +12V to SOL-A (manual extend jog) |
| BWD | Momentary pushbutton | NO | Direct-wires +12V to SOL-B (manual retract jog) |
| CYCLE | Momentary pushbutton | NO | Initiates auto extend/return cycle |
| LS1 | Limit switch at full extend | NC | Opens when cylinder reaches full extension; drops K2 |
| LS2 | Limit switch at full retract | NC | Opens when cylinder reaches home position; drops K1 |
| K1 | 12VDC DPDT DIN rail relay | Cycle latch | Latches on CYCLE press; holds cycle active until LS2 opens |
| K2 | 12VDC DPDT DIN rail relay | Direction | Routes power to SOL-A (energized) or SOL-B (de-energized) via changeover |
| SOL-A | Hydraulic solenoid coil | Extend | Mounted on valve body; extends cylinder |
| SOL-B | Hydraulic solenoid coil | Retract | Mounted on valve body; retracts cylinder |
| D1 | 1N4007 flyback diode | Protection | Across SOL-A; cathode to (+) |
| D2 | 1N4007 flyback diode | Protection | Across SOL-B; cathode to (+) |
| D3 | 1N4007 flyback diode | Protection | Across K1 coil (pins 2/7); cathode to pin 2 |
| D4 | 1N4007 flyback diode | Protection | Across K2 coil (pins 2/7); cathode to pin 2 |

---

## Relay Pin Assignments

Standard 8-pin DPDT DIN rail relay. **Verify against actual relay datasheet — pin numbers vary by manufacturer.**

### K1 — Cycle Latch Relay

| Pin | Function | Wire | Connection |
|-----|----------|------|------------|
| 1 | Pole 1 COM | W12 | +12V bus (A) |
| 2 | Coil (+) | W15 | From LS2 terminal 2 |
| 3 | Pole 1 NC | — | Not used |
| 4 | Pole 1 NO | W13 | Junction B (seal path) |
| 5 | Pole 2 NO | W18 | To LS1 terminal 1 |
| 6 | Pole 2 NC | — | Not used (available for jog interlock mod) |
| 7 | Coil (−) | W16 | Ground bus |
| 8 | Pole 2 COM | W17 | +12V bus (A) |

**K1 contact usage:**
- K1-1 (pins 1/4): NO seal contact — latches K1 after CYCLE button is released
- K1-2 (pins 8/5): NO feed contact — provides +12V to K2 coil circuit only during auto cycle

### K2 — Direction Relay

| Pin | Function | Wire | Connection |
|-----|----------|------|------------|
| 1 | Pole 1 COM | W21 | +12V bus (A) |
| 2 | Coil (+) | W19 | From LS1 terminal 2 |
| 3 | Pole 1 NC | W23 | SOL-B coil (+) terminal |
| 4 | Pole 1 NO | W22 | SOL-A coil (+) terminal |
| 5 | Pole 2 NO | — | Not used |
| 6 | Pole 2 NC | — | Not used |
| 7 | Coil (−) | W20 | Ground bus |
| 8 | Pole 2 COM | — | Not used |

**K2 contact usage:**
- K2-1 (pins 1/3/4): DPDT changeover — COM to NO (SOL-A) when energized; COM to NC (SOL-B) when de-energized
- Only one solenoid can be powered at a time during auto cycle (mechanical interlock)

---

## Circuit Paths

### Power Bus
```
BATT(+) → W01 → FUSE 15A → W02 → E-STOP NC(C1→C2) → W03 → +12V BUS (A)
BATT(−) → W24 → GND BUS → W25 → CHASSIS FRAME
```

### Manual Forward Jog (direct, no relays)
```
+12V BUS (A) → W04 → FWD btn → W05 → SOL-A(+) → SOL-A(−) → W06 → GND
```

### Manual Backward Jog (direct, no relays)
```
+12V BUS (A) → W07 → BWD btn → W08 → SOL-B(+) → SOL-B(−) → W09 → GND
```

### K1 Coil (Cycle Latch)
```
+12V BUS (A) → [CYCLE btn (W10→W11) ‖ K1-1 seal (W12→pin1→pin4→W13)] → Junction B → W14 → LS2 NC → W15 → K1 coil pin 2 → pin 7 → W16 → GND

Parallel paths to Junction B:
  Path 1: W10 → CYCLE btn → W11 → Junction B  (momentary start)
  Path 2: W12 → K1 pin 1 (COM) → pin 4 (NO) → W13 → Junction B  (seal/latch)
```

### K2 Coil (Direction)
```
+12V BUS (A) → W17 → K1 pin 8 (COM) → pin 5 (NO) → W18 → LS1 NC → W19 → K2 coil pin 2 → pin 7 → W20 → GND
```
K2 only energizes when K1 is latched (K1-2 closed) AND LS1 is closed (cylinder not at full extend).

### K2 Switched Outputs (Auto Cycle Solenoid Drive)
```
+12V BUS (A) → W21 → K2 pin 1 (COM) → pin 4 (NO) → W22 → SOL-A(+)  [K2 energized = EXTEND]
+12V BUS (A) → W21 → K2 pin 1 (COM) → pin 3 (NC) → W23 → SOL-B(+)  [K2 de-energized = RETRACT]

SOL-A(−) → W06 → GND  (shared with jog circuit)
SOL-B(−) → W09 → GND  (shared with jog circuit)
```

---

## Auto Cycle Sequence (Normal Operation)

| Step | Event | K1 | K2 | SOL-A | SOL-B | Cylinder |
|------|-------|----|----|-------|-------|----------|
| 0 | IDLE — cylinder at home | OFF | OFF | OFF | OFF | Home (LS2 closed) |
| 1 | Operator presses CYCLE | ON (latches via seal) | ON (K1-2 feeds through LS1) | ON (K2 NO) | OFF | Begins extending |
| 2 | Operator releases CYCLE | ON (held by seal) | ON | ON | OFF | Extending |
| 3 | Cylinder reaches full extend | ON | OFF (LS1 opens) | OFF | ON (K2 NC) | Begins retracting |
| 4 | Cylinder reaches home | OFF (LS2 opens) | OFF | OFF | OFF | Home — cycle complete |

### Key State Transitions
- **LS1 opens** → K2 drops → changeover flips → SOL-A off, SOL-B on (direction reversal)
- **LS2 opens** → K1 drops → K1-1 seal breaks → K1-2 opens → K2 loses power feed → all dead (cycle end)

---

## Wire Schedule

| Wire ID | Description | Color | Gauge | From → To |
|---------|-------------|-------|-------|-----------|
| W01 | +12V BATT to FUSE | RED | 12 AWG | Battery (+) → Fuse input |
| W02 | FUSE to E-STOP | RED | 12 AWG | Fuse output → E-Stop NC (C1) |
| W03 | E-STOP to BUS (A) | RED | 12 AWG | E-Stop NC (C2) → Bus junction A |
| W04 | BUS (A) to FWD btn | RED | 14 AWG | Bus A → FWD button terminal 1 |
| W05 | FWD btn to SOL-A | RED | 14 AWG | FWD button terminal 2 → SOL-A (+) |
| W06 | SOL-A to GND | BLACK | 14 AWG | SOL-A (−) → Ground bus |
| W07 | BUS (A) to BWD btn | RED | 14 AWG | Bus A → BWD button terminal 1 |
| W08 | BWD btn to SOL-B | RED | 14 AWG | BWD button terminal 2 → SOL-B (+) |
| W09 | SOL-B to GND | BLACK | 14 AWG | SOL-B (−) → Ground bus |
| W10 | BUS (A) to CYCLE btn | RED | 14 AWG | Bus A → CYCLE button terminal 1 |
| W11 | CYCLE btn to jct B | RED | 16 AWG | CYCLE button terminal 2 → Junction B |
| W12 | BUS (A) to K1-1 COM | RED | 16 AWG | Bus A → K1 pin 1 |
| W13 | K1-1 NO to jct B | RED | 16 AWG | K1 pin 4 → Junction B |
| W14 | Jct B to LS2 | RED | 16 AWG | Junction B → LS2 terminal 1 |
| W15 | LS2 to K1 COIL (+) | RED | 16 AWG | LS2 terminal 2 → K1 pin 2 |
| W16 | K1 COIL (−) to GND | BLACK | 16 AWG | K1 pin 7 → Ground bus |
| W17 | BUS (A) to K1-2 COM | RED | 14 AWG | Bus A → K1 pin 8 |
| W18 | K1-2 NO to LS1 | RED | 16 AWG | K1 pin 5 → LS1 terminal 1 |
| W19 | LS1 to K2 COIL (+) | RED | 16 AWG | LS1 terminal 2 → K2 pin 2 |
| W20 | K2 COIL (−) to GND | BLACK | 16 AWG | K2 pin 7 → Ground bus |
| W21 | BUS (A) to K2-1 COM | RED | 14 AWG | Bus A → K2 pin 1 |
| W22 | K2-1 NO to SOL-A | GREEN | 14 AWG | K2 pin 4 → SOL-A (+) |
| W23 | K2-1 NC to SOL-B | GREEN | 14 AWG | K2 pin 3 → SOL-B (+) |
| W24 | BATT (−) to GND BUS | BLACK | 12 AWG | Battery (−) → Ground bus |
| W25 | GND BUS to CHASSIS | BLACK | 12 AWG | Ground bus → Frame bolt |

**Note:** SOL-A has two hot feeds: W05 (from FWD jog) and W22 (from K2 NO). SOL-B has two hot feeds: W08 (from BWD jog) and W23 (from K2 NC). This is intentional — jog buttons bypass relay logic entirely.

---

## Troubleshooting Decision Tree

### No Power at All
```
Check battery voltage (should be ~12.5V)
├── Battery dead → charge/replace
└── Battery OK
    Check fuse
    ├── Blown → replace, investigate short (check for pinched wires, reversed diodes)
    └── Fuse OK
        Check E-STOP
        ├── E-STOP pressed in → twist to release
        └── E-STOP released
            Measure voltage at +12V Bus (A) terminal
            ├── 0V → check W01, W02, W03 continuity
            └── ~12V → power circuit is good, problem is downstream
```

### FWD Button Does Nothing
```
Measure voltage at FWD button terminal 2 while pressed
├── 0V → check W04, verify button is NO type and working
└── ~12V at button output
    Listen for SOL-A click
    ├── No click → check W05 to SOL-A(+), check W06 SOL-A(−) to GND
    │             check D1 orientation (reversed = dead short = blown fuse)
    └── SOL-A clicks but cylinder doesn't move
        → Hydraulic issue: check fluid level, PTO/engine RPM, relief valve
```

### BWD Button Does Nothing
```
Same diagnostic as FWD but check W07, W08, W09, SOL-B, D2
```

### CYCLE Button — Nothing Happens
```
Press CYCLE and listen for K1 click
├── K1 does NOT click
│   Is cylinder at HOME? (LS2 must be closed for K1 to energize)
│   ├── Not at home → jog to home with BWD, then retry
│   └── At home (LS2 closed)
│       Measure voltage at K1 pin 2 while holding CYCLE
│       ├── 0V → trace path: Bus(A) → W10 → CYCLE btn → W11 → Jct B → W14 → LS2 → W15 → K1 pin 2
│       │       One of those connections is open
│       └── ~12V at pin 2
│           Measure voltage at K1 pin 7
│           ├── Not 0V → check W16 to ground bus, check ground bus continuity
│           └── Pin 2 = 12V, Pin 7 = 0V → relay coil has 12V across it but not energizing
│               → Bad relay, replace K1
│
└── K1 clicks ON
    Does K1 STAY on after releasing CYCLE?
    ├── K1 drops when CYCLE released → seal contact not working
    │   Check W12 (bus A to K1 pin 1) and W13 (K1 pin 4 to Junction B)
    │   Verify pin 1 is COM and pin 4 is NO on your relay
    │
    └── K1 stays latched — good
        Does K2 click on?
        ├── K2 does NOT click
        │   Check W17 (bus A to K1 pin 8), W18 (K1 pin 5 to LS1)
        │   Is LS1 closed? (should be, cylinder is not at full extend)
        │   Check W19 (LS1 to K2 pin 2), W20 (K2 pin 7 to GND)
        │
        └── K2 clicks — both relays on
            Does cylinder extend?
            ├── No → check W21 (bus A to K2 pin 1), W22 (K2 pin 4 to SOL-A)
            │        Verify K2 pin 4 is NO on your relay
            └── Yes — cylinder extends. Continue to next tree...
```

### Cylinder Extends but Doesn't Auto-Retract
```
Does K2 drop when cylinder reaches full extend?
├── LS1 not actuating → adjust LS1 position, verify it clicks at full extend
├── LS1 actuates (you hear click) but K2 stays on → LS1 wired wrong (may be using NO instead of NC)
└── K2 drops (you hear click)
    Does SOL-B fire?
    ├── No → check W23 (K2 pin 3 to SOL-B), verify pin 3 is NC on your relay
    └── SOL-B fires, cylinder retracts — continue to next tree...
```

### Cylinder Retracts but Doesn't Stop at Home
```
Does K1 drop when cylinder reaches home?
├── LS2 not actuating → adjust LS2 position
├── LS2 actuates but K1 stays latched → LS2 wired wrong (may be using NO instead of NC)
└── K1 drops — cycle should end. If cylinder still moving:
    Check that SOL-B is actually de-energized (K2 should be off since K1-2 is open)
    If SOL-B still energized → possible short or wiring error on W23, or K2 mechanically stuck
```

### E-STOP Doesn't Stop Everything
```
E-STOP NC contact may be wired to wrong terminals
Verify E-STOP is in series with main +12V bus (between fuse and Bus A)
Measure: press E-STOP, voltage at Bus (A) should be 0V
If still ~12V → E-STOP bypass or wrong terminals used
```

### Fuse Keeps Blowing
```
Disconnect all loads from Bus (A)
├── Fuse still blows → short in W01, W02, or W03 (power wiring)
└── Fuse holds
    Reconnect one circuit at a time:
    1. FWD jog (W04/W05/W06) → press FWD → fuse blows? → check D1 polarity, check for pinched wire
    2. BWD jog (W07/W08/W09) → same checks with D2
    3. K1 circuit → check D3 polarity
    4. K2 circuit → check D4 polarity
    5. K2 outputs (W21/W22/W23) → check for crossed wires
```

### Relay Chatters or Buzzes
```
Low voltage at relay coil (should be >10V under load)
├── Battery weak → charge or replace
├── Voltage drop in wiring → check for corroded terminals, undersized wire, loose connections
└── Bad ground → clean frame ground connection, check W24/W25
```

---

## Safety-Critical Design Notes

1. **Both limit switches are NC (normally closed).** A broken wire or disconnected switch = open circuit = cycle stops. This is fail-safe by design. If an AI agent or user suggests changing to NO switches, this breaks the fail-safe behavior.

2. **Flyback diodes (D1–D4) are essential.** Without them, relay contact arcing will pit and destroy contacts within weeks of use. If a user reports intermittent relay failure, check diode presence and polarity first.

3. **FWD and BWD jog buttons are intentionally direct-wired**, bypassing all relay logic. This is the manual override / backup. If relay logic fails completely, the operator can still move the cylinder. Do not suggest routing jog buttons through the relays unless the user explicitly wants the jog interlock modification.

4. **K2 changeover provides mechanical solenoid interlock.** During auto cycle, it is physically impossible for both SOL-A and SOL-B to be energized simultaneously through K2. However, if the operator presses FWD during auto-retract (or BWD during auto-extend), both solenoids CAN be energized simultaneously — one from the jog button, one from K2. This is why the optional jog interlock modification exists.

5. **LS2 must be closed (cylinder at home) for CYCLE to work.** If the user reports "CYCLE button does nothing," the first question is always: "Is the cylinder at the home position?" Jog it home with BWD first.

6. **The E-STOP NO contact is unused** in the base design. It is available for indicator lights, horns, or external shutdown signals.

---

## Optional Modifications (Installed or Not — Ask User)

### Jog Interlock
Routes FWD/BWD power through K1 pole 2 NC (pin 6). Disables jog during auto cycle. Trade-off: loses manual override during auto cycle.

### Safety Timer
Time-delay relay (15-20s TON) in series with K1 coil. NC timer contact opens after timeout, killing K1 if LS1 never trips (jammed log, broken switch).

### Pressure Switch Replacing LS1
Adjustable NC pressure switch set ~200 PSI below system relief. Triggers on backpressure rather than position. Better for variable-length wood. Wiring identical to LS1.

### Cycle Indicator Light
12V LED from K1 pin 5 (pole 2 NO, powered during cycle) through 1K resistor to ground.

---

## Physical Layout

- **Relays and fuse:** DIN rail on open mounting plate, bolted to splitter frame
- **Pushbuttons:** All four (E-STOP, FWD, BWD, CYCLE) in single operator panel box
- **Solenoids:** Pre-mounted on hydraulic valve body
- **Limit switches:** LS1 at full-extend position, LS2 at full-retract (home) position
- **Wire labels:** Heat-shrink markers on both ends of every wire, labeled with wire ID (W01–W25)
- **Reference drawing:** PN-LS-002 Rev A kept in binder near equipment

---

## Common Misdiagnosis Patterns

| User Says | Likely Actual Problem | Why It's Misdiagnosed |
|-----------|----------------------|----------------------|
| "Relay is bad" | Loose wire or corroded terminal | Intermittent contact mimics relay failure |
| "Solenoid is dead" | Wiring issue upstream | Solenoid rarely fails; trace power to it first |
| "Limit switch doesn't work" | Mounting position shifted | Vibration moves brackets; switch is fine, just not actuating |
| "Fuse keeps blowing — must be too small" | Reversed flyback diode | Dead short across coil when energized; fuse is correct at 15A |
| "System worked yesterday, dead today" | Battery/ground issue | Overnight discharge, corroded ground bolt, loose battery terminal |
| "Cylinder moves slow" | Not electrical | Hydraulic: low fluid, cavitation, relief valve, engine RPM |

---

## Diagnostic Quick-Reference Commands

For an AI agent helping remotely, these are the key questions to ask in order:

1. **Does the +12V bus have power?** → Measure at Bus (A) terminal block
2. **Do jog buttons work?** → FWD extends, BWD retracts? (Tests power, solenoids, and ground in one step)
3. **Is the cylinder at HOME?** → LS2 must be closed for CYCLE to work
4. **Does K1 click when CYCLE is pressed?** → If not, trace K1 coil circuit
5. **Does K1 STAY latched after releasing CYCLE?** → If not, seal contact issue (W12/W13)
6. **Does K2 click when K1 latches?** → If not, trace K2 coil circuit (W17/W18/W19)
7. **Does the cylinder extend during auto cycle?** → If not, K2 output issue (W21/W22)
8. **Does it auto-retract at full extend?** → If not, LS1 issue
9. **Does it stop at home?** → If not, LS2 issue
