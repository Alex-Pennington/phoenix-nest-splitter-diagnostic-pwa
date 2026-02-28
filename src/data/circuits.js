const CIRCUITS = {
  power: {
    label: "Power Bus",
    path: [
      {type:"power",name:"BATT(+)"},{wire:"W01"},{type:"power",name:"FUSE 15A"},{wire:"W02"},
      {type:"switch",name:"E-STOP NC"},{wire:"W03"},{type:"power",name:"+12V BUS (A)"}
    ]
  },
  fwd: {
    label: "Manual FWD Jog → SOL-A",
    path: [
      {type:"power",name:"BUS (A)"},{wire:"W04"},{type:"switch",name:"FWD btn"},{wire:"W05"},
      {type:"solenoid",name:"SOL-A"},{wire:"W06"},{type:"ground",name:"GND"}
    ]
  },
  bwd: {
    label: "Manual BWD Jog → SOL-B",
    path: [
      {type:"power",name:"BUS (A)"},{wire:"W07"},{type:"switch",name:"BWD btn"},{wire:"W08"},
      {type:"solenoid",name:"SOL-B"},{wire:"W09"},{type:"ground",name:"GND"}
    ]
  },
  k1: {
    label: "K1 Coil (Cycle Latch)",
    note: "Parallel paths: CYCLE btn (W10→W11) OR K1-1 seal (W12→pin1→pin4→W13) both reach Junction B",
    path: [
      {type:"power",name:"BUS (A)"},{wire:"W10"},{type:"switch",name:"CYCLE btn"},{wire:"W11"},
      {type:"relay",name:"Jct B"},{wire:"W14"},{type:"switch",name:"LS2 NC"},{wire:"W15"},
      {type:"relay",name:"K1 COIL"},{wire:"W16"},{type:"ground",name:"GND"}
    ],
    alt: {
      label: "Seal Path (parallel to CYCLE btn)",
      path: [
        {type:"power",name:"BUS (A)"},{wire:"W12"},{type:"relay",name:"K1-1 COM→NO"},{wire:"W13"},
        {type:"relay",name:"Jct B"}
      ]
    }
  },
  k2: {
    label: "K2 Coil (Direction)",
    path: [
      {type:"power",name:"BUS (A)"},{wire:"W17"},{type:"relay",name:"K1-2 COM→NO"},{wire:"W18"},
      {type:"switch",name:"LS1 NC"},{wire:"W19"},{type:"relay",name:"K2 COIL"},{wire:"W20"},
      {type:"ground",name:"GND"}
    ]
  },
  k2_extend: {
    label: "K2 Output → SOL-A (K2 Energized)",
    path: [
      {type:"power",name:"BUS (A)"},{wire:"W21"},{type:"relay",name:"K2-1 COM→NO"},{wire:"W22"},
      {type:"solenoid",name:"SOL-A"},{wire:"W06"},{type:"ground",name:"GND"}
    ]
  },
  k2_retract: {
    label: "K2 Output → SOL-B (K2 De-energized)",
    path: [
      {type:"power",name:"BUS (A)"},{wire:"W21"},{type:"relay",name:"K2-1 COM→NC"},{wire:"W23"},
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
