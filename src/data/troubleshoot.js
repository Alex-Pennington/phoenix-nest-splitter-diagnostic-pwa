const TS_TREE = {
  start: {
    q: "🔧 What's the problem?",
    opts: [
      {label: "Nothing works — completely dead", next: "dead1"},
      {label: "FWD jog doesn't work", next: "fwd1"},
      {label: "BWD jog doesn't work", next: "bwd1"},
      {label: "CYCLE button does nothing", next: "cyc1"},
      {label: "Extends but won't auto-retract", next: "noret1"},
      {label: "Retracts but won't stop at home", next: "nostop1"},
      {label: "Fuse keeps blowing", next: "fuse1"},
      {label: "Relay chatters or buzzes", next: "chatter1"},
      {label: "Solenoid hums, no cylinder movement", next: "hyd1"},
    ]
  },

  // === DEAD SYSTEM ===
  dead1: {
    q: "⚡ Measure battery voltage with a multimeter.",
    opts: [
      {label: "Less than 11V", next: "dead_batt"},
      {label: "12V+ at battery terminals", next: "dead2"},
    ]
  },
  dead_batt: {
    answer: "Battery is dead or weak.|FIX: Charge or replace battery. Check for parasitic draw if it keeps dying."
  },
  dead2: {
    q: "Check the fuse. Is it blown?",
    opts: [
      {label: "Fuse is blown", next: "dead_fuse"},
      {label: "Fuse is good", next: "dead3"},
    ]
  },
  dead_fuse: {
    answer: "Blown fuse = short circuit somewhere.|Do NOT just replace the fuse. Disconnect all loads from Bus (A). Reconnect one at a time to isolate the short.|Most common cause: reversed flyback diode (D1-D4). Check cathode band orientation on all four."
  },
  dead3: {
    q: "Is the E-Stop pressed in (locked)?",
    opts: [
      {label: "Yes — it's pressed in", next: "dead_estop"},
      {label: "No — E-Stop is released", next: "dead4"},
    ]
  },
  dead_estop: {
    answer: "FIX: Twist the E-Stop to release it.|Power should restore to Bus (A). Verify with multimeter."
  },
  dead4: {
    q: "Measure voltage at +12V Bus (A) terminal block.",
    opts: [
      {label: "0V at Bus (A)", next: "dead_bus"},
      {label: "~12V at Bus (A)", next: "dead_busok"},
    ]
  },
  dead_bus: {
    answer: "Power not reaching Bus (A).|TRACE: BATT(+) → W01 → FUSE → W02 → E-STOP NC → W03 → Bus (A)|Check each wire and terminal for continuity. Look for corroded terminals, loose crimps, or broken wire."
  },
  dead_busok: {
    answer: "Bus (A) has power — problem is downstream.|Go back and select a more specific symptom (FWD, CYCLE, etc.) to narrow it down."
  },

  // === FWD JOG ===
  fwd1: {
    q: "Hold FWD. Measure voltage at FWD button output terminal.",
    opts: [
      {label: "0V at FWD output", next: "fwd_nopower"},
      {label: "~12V at FWD output", next: "fwd2"},
    ]
  },
  fwd_nopower: {
    answer: "No power through FWD button.|CHECK: W04 from Bus (A) to FWD terminal 1. Verify button is NO type.|Measure at FWD terminal 1 — if 12V there but 0V at terminal 2 when pressed → button is bad."
  },
  fwd2: {
    q: "Listen at SOL-A. Does it click when FWD is pressed?",
    opts: [
      {label: "No click from SOL-A", next: "fwd_nosol"},
      {label: "SOL-A clicks but cylinder doesn't move", next: "hyd1"},
    ]
  },
  fwd_nosol: {
    answer: "Power not reaching SOL-A or coil is dead.|CHECK: W05 (FWD → SOL-A+) and W06 (SOL-A− → GND).|WARNING: If D1 is backwards it's a dead short — fuse should blow. Check diode orientation.|Test: swap SOL-A and SOL-B connections briefly to see if SOL-A coil itself is dead."
  },

  // === BWD JOG ===
  bwd1: {
    answer: "Same diagnostic as FWD but for retract circuit.|CHECK: W07 (Bus A → BWD), W08 (BWD → SOL-B+), W09 (SOL-B− → GND), D2 orientation.|If BWD works but FWD doesn't (or vice versa), the problem is isolated to that specific button/solenoid/wire path."
  },

  // === CYCLE ===
  cyc1: {
    q: "Is the cylinder at HOME (fully retracted)?",
    opts: [
      {label: "No — cylinder is out or mid-stroke", next: "cyc_nothome"},
      {label: "Yes — fully retracted at home", next: "cyc2"},
    ]
  },
  cyc_nothome: {
    answer: "FIX: Jog cylinder to HOME using BWD button.|LS2 must be closed (cylinder at home) for CYCLE to work. K1 cannot latch if LS2 is open."
  },
  cyc2: {
    q: "Press CYCLE. Does K1 relay click?",
    opts: [
      {label: "K1 does NOT click", next: "cyc_nok1"},
      {label: "K1 clicks ON", next: "cyc3"},
    ]
  },
  cyc_nok1: {
    answer: "K1 coil not energizing.|TRACE while holding CYCLE: Bus(A) → W10 → CYCLE btn → W11 → Jct B → W14 → LS2 → W15 → K1 pin 2|Measure voltage at K1 pin 2 while holding CYCLE. If 12V there → check W16 (pin 7 → GND). If 0V → work backwards to find open connection."
  },
  cyc3: {
    q: "Release CYCLE. Does K1 stay latched?",
    opts: [
      {label: "K1 drops when I release", next: "cyc_noseal"},
      {label: "K1 stays ON — latched", next: "cyc4"},
    ]
  },
  cyc_noseal: {
    answer: "Seal contact (K1-1) not holding.|CHECK: W12 (Bus A → K1 pin 1 COM) and W13 (K1 pin 4 NO → Junction B).|Verify pin 1 = COM and pin 4 = NO on your specific relay. Use continuity test with K1 energized to confirm contact closes."
  },
  cyc4: {
    q: "Does K2 click on when K1 latches?",
    opts: [
      {label: "K2 does NOT click", next: "cyc_nok2"},
      {label: "K2 clicks ON — both relays on", next: "cyc5"},
    ]
  },
  cyc_nok2: {
    answer: "K2 coil not energizing.|TRACE: Bus(A) → W17 → K1 pin 8 (COM) → pin 5 (NO) → W18 → LS1 → W19 → K2 pin 2|K1-2 must be closed (K1 latched) and LS1 must be closed (not at full extend). Check W17, W18, W19, W20."
  },
  cyc5: {
    q: "Does the cylinder start extending?",
    opts: [
      {label: "No movement", next: "cyc_nomove"},
      {label: "Yes — extends fine", next: "cyc_ok"},
    ]
  },
  cyc_nomove: {
    answer: "K2 output not reaching SOL-A.|CHECK: W21 (Bus A → K2 pin 1 COM), W22 (K2 pin 4 NO → SOL-A+).|Verify pin 4 = NO on your relay. When K2 energized, pin 1 should connect to pin 4.|Also confirm SOL-A ground W06 is connected."
  },
  cyc_ok: {
    answer: "Cycle is starting correctly!|If the problem is with the return stroke, go back and select 'Extends but won't auto-retract'."
  },

  // === NO AUTO-RETRACT ===
  noret1: {
    q: "At full extend, does LS1 actuate? (listen for click)",
    opts: [
      {label: "LS1 does NOT click", next: "noret_ls1"},
      {label: "LS1 clicks but K2 stays on", next: "noret_wiring"},
      {label: "LS1 clicks, K2 drops, but SOL-B doesn't fire", next: "noret_solb"},
    ]
  },
  noret_ls1: {
    answer: "LS1 not being activated at full extend.|FIX: Adjust LS1 mounting position. The cylinder rod/wedge must physically trigger LS1. Jog slowly with FWD and watch."
  },
  noret_wiring: {
    answer: "LS1 may be wired NO instead of NC.|LS1 MUST be NC (closed at rest, opens when hit). If wired to the NO terminal of the switch, swap to NC terminal.|With switch not actuated, you should have continuity across the two wired terminals."
  },
  noret_solb: {
    answer: "K2 dropped but SOL-B not firing on the NC path.|CHECK: W23 (K2 pin 3 NC → SOL-B+). When K2 de-energized, pin 1 (COM) connects to pin 3 (NC).|Verify pin 3 = NC on your relay. Also check SOL-B ground (W09)."
  },

  // === NO STOP AT HOME ===
  nostop1: {
    q: "When cylinder reaches home, does LS2 actuate?",
    opts: [
      {label: "LS2 does NOT click", next: "nostop_ls2"},
      {label: "LS2 clicks but K1 stays latched", next: "nostop_wiring"},
    ]
  },
  nostop_ls2: {
    answer: "LS2 not being activated.|FIX: Adjust LS2 mounting position. Jog slowly with BWD and verify LS2 triggers at correct home position."
  },
  nostop_wiring: {
    answer: "LS2 may be wired NO instead of NC.|LS2 MUST be NC (closed at rest, opens when cylinder reaches home). If wired to the wrong terminal, K1 will never unlatch.|Check: with switch not actuated, you should have continuity across wired terminals."
  },

  // === FUSE ===
  fuse1: {
    answer: "Repeated blown fuse = short circuit.|Do NOT keep replacing fuse without finding cause.|Disconnect all loads from Bus (A). Reconnect one at a time:|1. FWD jog (W04/W05/W06) — check D1|2. BWD jog (W07/W08/W09) — check D2|3. K1 circuit — check D3|4. K2 circuit — check D4|5. K2 outputs (W21/W22/W23)|Most common cause: reversed flyback diode. Backwards diode = dead short across coil."
  },

  // === CHATTER ===
  chatter1: {
    answer: "Relay chatter = insufficient coil voltage.|CHECK: Battery voltage under load (engine running) — should be >12V.|Check for voltage drop at relay coil pins — should be >10V.|Look for corroded terminals and loose connections on ground circuit (W24, W25).|Clean frame ground bolt (bare metal, star washer)."
  },

  // === HYDRAULIC ===
  hyd1: {
    answer: "Solenoid clicking but no cylinder movement = hydraulic issue, not electrical.|CHECK:|• Hydraulic fluid level|• Engine/PTO RPM sufficient|• Air in hydraulic lines (bleed if needed)|• Relief valve setting|• Hydraulic hoses for kinks or damage|The electrical system is working correctly if you hear the solenoid click."
  },
};
