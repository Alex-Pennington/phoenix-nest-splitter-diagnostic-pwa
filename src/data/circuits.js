const CIRCUITS = {
  power: {
    label: "Power Bus",
    path: [
      {type:"power",name:"BATT(+)"},{wire:"W01"},{type:"power",name:"FUSE 15A"},{wire:"W02"},
      {type:"switch",name:"E-STOP NC"},{wire:"W03"},{type:"power",name:"+12V BUS (A)"}
    ]
  },
  fwd: {
    label: "Manual FWD Jog \u2192 SOL-A",
    path: [
      {type:"power",name:"BUS (A)"},{wire:"W04"},{type:"switch",name:"FWD btn NO"},{wire:"W05"},
      {type:"solenoid",name:"SOL-A"},{wire:"W06"},{type:"ground",name:"GND"}
    ]
  },
  bwd: {
    label: "Manual BWD Jog \u2192 SOL-B",
    path: [
      {type:"power",name:"BUS (A)"},{wire:"W07"},{type:"switch",name:"BWD btn NO"},{wire:"W08"},
      {type:"solenoid",name:"SOL-B"},{wire:"W09"},{type:"ground",name:"GND"}
    ]
  },
  k1: {
    label: "K1 Coil (Cycle Latch)",
    note: "Two parallel paths to Junction B: CYCLE button OR K1 Pair 1 NO seal",
    path: [
      {type:"power",name:"BUS (A)"},{wire:"W10"},{type:"switch",name:"CYCLE btn NO"},{wire:"W11"},
      {type:"relay",name:"Jct B"},{wire:"W14"},{type:"switch",name:"Retract Lim NC"},{wire:"W15"},
      {type:"relay",name:"K1 COIL"},{wire:"W16"},{type:"ground",name:"GND"}
    ],
    alt: {
      label: "K1 Seal Path (parallel to CYCLE btn)",
      path: [
        {type:"power",name:"BUS (A)"},{wire:"W12"},{type:"relay",name:"K1 P1 NO"},{wire:"W13"},
        {type:"relay",name:"Jct B"}
      ]
    }
  },
  nodex: {
    label: "Node X (K1 Pair 2 NO \u2014 hot when cycle active)",
    path: [
      {type:"power",name:"BUS (A)"},{wire:"W17"},{type:"relay",name:"K1 P2 NO"},{wire:"W18"},
      {type:"power",name:"NODE X"}
    ]
  },
  k2: {
    label: "K2 Coil (Direction \u2014 through K3 NC lock)",
    note: "K3 Pair 1 NC opens when K3 latches at extend, locking K2 OFF permanently",
    path: [
      {type:"power",name:"NODE X"},{wire:"W19"},{type:"relay",name:"K3 P1 NC"},{wire:"W20"},
      {type:"relay",name:"K2 COIL"},{wire:"W21"},{type:"ground",name:"GND"}
    ]
  },
  k3: {
    label: "K3 Coil (Extend Memory Latch)",
    note: "Triggered by extend limit NO. Seal (K3 P2 NO) holds K3 on after limit releases.",
    path: [
      {type:"power",name:"NODE X"},{wire:"W22"},{type:"switch",name:"Extend Lim NO"},{wire:"W23"},
      {type:"relay",name:"K3 COIL"},{wire:"W25"},{type:"ground",name:"GND"}
    ],
    alt: {
      label: "K3 Seal Path (parallel to Extend Limit)",
      path: [
        {type:"power",name:"NODE X"},{wire:"W24 (via P2 COM)"},{type:"relay",name:"K3 P2 NO"},{wire:"W24"},
        {type:"relay",name:"K3 COIL"}
      ]
    }
  },
  k2_extend: {
    label: "K2 Output \u2192 SOL-A (K2 ON = Extend)",
    path: [
      {type:"power",name:"NODE X"},{wire:"W26"},{type:"relay",name:"K2 P1 NO"},{wire:"W27"},
      {type:"solenoid",name:"SOL-A"},{wire:"W06"},{type:"ground",name:"GND"}
    ]
  },
  k2_retract: {
    label: "K2 Output \u2192 SOL-B (K2 OFF = Retract)",
    path: [
      {type:"power",name:"NODE X"},{wire:"W26"},{type:"relay",name:"K2 P1 NC"},{wire:"W28"},
      {type:"solenoid",name:"SOL-B"},{wire:"W09"},{type:"ground",name:"GND"}
    ]
  }
};

function findCircuitsForWire(wireId) {
  const found = [];
  for (const [k, v] of Object.entries(CIRCUITS)) {
    if (v.path.some(s => s.wire === wireId)) found.push(v.label);
    if (v.alt && v.alt.path.some(s => s.wire === wireId)) found.push(v.alt.label);
  }
  return found;
}
