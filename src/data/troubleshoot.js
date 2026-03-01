const TS_TREE = {
  start: {
    q: "\ud83d\udd27 What's the problem?",
    opts: [
      {label: "Nothing works \u2014 completely dead", next: "dead1"},
      {label: "FWD jog doesn't work", next: "fwd1"},
      {label: "BWD jog doesn't work", next: "bwd1"},
      {label: "CYCLE button does nothing", next: "cyc1"},
      {label: "Extends but won't auto-retract", next: "noret1"},
      {label: "Retracts but won't stop at home", next: "nostop1"},
      {label: "Cylinder chatters at extend limit", next: "chatter_ext"},
      {label: "Fuse keeps blowing", next: "fuse1"},
      {label: "Relay chatters or buzzes", next: "chatter1"},
      {label: "Solenoid hums, no cylinder movement", next: "hyd1"},
      {label: "Won't start from home position", next: "home_start"},
    ]
  },

  dead1: {
    q: "\u26a1 Measure battery voltage.",
    opts: [
      {label: "Less than 11V", next: "dead_batt"},
      {label: "12V+ at battery", next: "dead2"},
    ]
  },
  dead_batt: { answer: "Battery is dead or weak.|FIX: Charge or replace battery." },
  dead2: {
    q: "Check the fuse. Is it blown?",
    opts: [
      {label: "Fuse is blown", next: "dead_fuse"},
      {label: "Fuse is good", next: "dead3"},
    ]
  },
  dead_fuse: { answer: "Blown fuse = short circuit.|Do NOT just replace. Disconnect loads one at a time to find the short.|CHECK: flyback diode orientation on all five coils (D1\u2013D5). Reversed = dead short." },
  dead3: {
    q: "Is E-Stop pressed in?",
    opts: [
      {label: "Yes", next: "dead_estop"},
      {label: "No \u2014 released", next: "dead4"},
    ]
  },
  dead_estop: { answer: "FIX: Twist E-Stop to release. Power should return to Bus (A)." },
  dead4: {
    q: "Measure voltage at +12V Bus (A).",
    opts: [
      {label: "0V at Bus A", next: "dead_bus"},
      {label: "~12V at Bus A", next: "dead_busok"},
    ]
  },
  dead_bus: { answer: "Power not reaching Bus A.|TRACE: BATT(+) \u2192 W01 \u2192 FUSE \u2192 W02 \u2192 E-STOP NC \u2192 W03 \u2192 Bus A|Check each connection for continuity." },
  dead_busok: { answer: "Bus A has power \u2014 problem is downstream.|Go back and pick a more specific symptom." },

  fwd1: {
    q: "Hold FWD. Measure voltage at FWD button output.",
    opts: [
      {label: "0V at output", next: "fwd_nop"},
      {label: "~12V at output", next: "fwd2"},
    ]
  },
  fwd_nop: { answer: "No power through FWD.|CHECK: W04 from Bus A to FWD. Verify button works. Measure both sides." },
  fwd2: {
    q: "Does SOL-A click when FWD is pressed?",
    opts: [
      {label: "No click", next: "fwd_nosol"},
      {label: "Clicks but no movement", next: "hyd1"},
    ]
  },
  fwd_nosol: { answer: "Power not reaching SOL-A.|CHECK: W05 (FWD to SOL-A+) and W06 (SOL-A\u2212 to GND).|WARNING: If D1 reversed = dead short = blown fuse." },

  bwd1: { answer: "Same diagnostic as FWD but for retract circuit.|CHECK: W07, W08, W09, and D2 orientation." },

  cyc1: {
    q: "Is cylinder sitting on the retract limit?",
    opts: [
      {label: "Yes \u2014 fully retracted at home", next: "home_start"},
      {label: "No \u2014 cylinder is mid-stroke or extended", next: "cyc2"},
    ]
  },
  cyc2: {
    q: "Press CYCLE. Does K1 click?",
    opts: [
      {label: "K1 does NOT click", next: "cyc_nok1"},
      {label: "K1 clicks", next: "cyc3"},
    ]
  },
  cyc_nok1: { answer: "K1 not energizing.|TRACE while holding CYCLE: Bus A \u2192 W10 \u2192 CYCLE btn \u2192 W11 \u2192 Jct B \u2192 W14 \u2192 Retract Lim NC \u2192 W15 \u2192 K1 Coil|Find where voltage drops to 0." },
  cyc3: {
    q: "Release CYCLE. Does K1 stay latched?",
    opts: [
      {label: "K1 drops when released", next: "cyc_noseal"},
      {label: "K1 stays on", next: "cyc4"},
    ]
  },
  cyc_noseal: { answer: "Seal not working.|CHECK: W12 (Bus A \u2192 K1 Pair 1 COM) and W13 (K1 Pair 1 NO \u2192 Junction B)." },
  cyc4: {
    q: "Does K2 come on when K1 latches?",
    opts: [
      {label: "K2 does NOT come on", next: "cyc_nok2"},
      {label: "K2 comes on", next: "cyc5"},
    ]
  },
  cyc_nok2: { answer: "K2 coil not getting power.|CHECK: Node X has voltage (K1 Pair 2 NO output).|CHECK: K3 is OFF and K3 Pair 1 NC is closed.|TRACE: Node X \u2192 W19 \u2192 K3 P1 COM \u2192 K3 P1 NC \u2192 W20 \u2192 K2 Coil" },
  cyc5: {
    q: "Does the cylinder extend?",
    opts: [
      {label: "No movement", next: "cyc_nomove"},
      {label: "Yes \u2014 extends", next: "cyc_ok"},
    ]
  },
  cyc_nomove: { answer: "K2 on but SOL-A not firing.|CHECK: W26 (Node X \u2192 K2 P1 COM) and W27 (K2 P1 NO \u2192 SOL-A+).|Verify K2 changeover is switching to NO when energized." },
  cyc_ok: { answer: "Cycle starting correctly! If retract has issues, go back and pick that symptom." },

  noret1: {
    q: "At full extend, does K3 pick up?",
    opts: [
      {label: "K3 does NOT pick up", next: "noret_nok3"},
      {label: "K3 picks up but K2 stays on", next: "noret_k2stays"},
      {label: "K3 picks up, K2 drops, but no retract", next: "noret_nosolb"},
    ]
  },
  noret_nok3: { answer: "Extend limit not triggering K3.|CHECK: Extend limit NO pair \u2014 does it close when cylinder is at full extend?|CHECK: W22 (Node X \u2192 Extend Lim) and W23 (Extend Lim \u2192 K3 Coil+).|CHECK: W25 (K3 Coil\u2212 \u2192 GND)." },
  noret_k2stays: { answer: "K3 NC contact not breaking K2 coil circuit.|CHECK: W19 (Node X \u2192 K3 P1 COM) and W20 (K3 P1 NC \u2192 K2 Coil+).|Verify K3 P1 NC actually opens when K3 energizes. Test with multimeter." },
  noret_nosolb: { answer: "K2 dropped but SOL-B not firing.|CHECK: W28 (K2 P1 NC \u2192 SOL-B+). When K2 is off, P1 COM connects to P1 NC.|CHECK: SOL-B ground W09." },

  nostop1: {
    q: "At home, does K1 drop?",
    opts: [
      {label: "K1 does NOT drop", next: "nostop_k1"},
      {label: "K1 drops but cylinder keeps moving", next: "nostop_still"},
    ]
  },
  nostop_k1: { answer: "Retract limit not breaking K1.|CHECK: Retract limit NC pair \u2014 does it open when cylinder reaches home?|Adjust switch mounting position if needed." },
  nostop_still: { answer: "K1 dropped but solenoid still firing.|If K1 dropped, Node X should be dead, killing all relay outputs.|CHECK: Is BWD button stuck or held? BWD bypasses relays and feeds SOL-B directly." },

  chatter_ext: { answer: "K2 bouncing at extend limit = K3 not latching properly.|CHECK: K3 seal \u2014 W24 (K3 P2 NO \u2192 K3 Coil+). This holds K3 on after extend limit releases.|CHECK: K3 P2 COM is jumpered to K3 P1 COM (both fed from Node X).|If seal wire is missing, K3 drops when cylinder moves off extend limit, K2 comes back, and it bounces." },

  fuse1: { answer: "Repeated blown fuse = short circuit.|Disconnect all loads from Bus A. Reconnect one at a time.|CHECK: flyback diodes D1\u2013D5. Reversed diode = dead short across coil when energized.|Most common cause by far." },

  chatter1: { answer: "Relay chatter = low coil voltage.|CHECK: Battery voltage under load (>12V).|CHECK: Ground connections \u2014 W29 (BATT\u2212 to GND bus), W30 (GND bus to frame).|Clean frame ground bolt, use star washer." },

  hyd1: { answer: "Solenoid clicking but no movement = hydraulic issue.|CHECK: Fluid level, engine/PTO RPM, air in lines, relief valve, hose condition.|Electrical system is working if you hear the click." },

  home_start: { answer: "Normal behavior. Retract limit NC pair is open when cylinder is at home, which prevents K1 from latching.|FIX: Tap FWD briefly to nudge cylinder off the retract limit, then press CYCLE. This is the designed start procedure \u2014 FWD then CYCLE." },
};
