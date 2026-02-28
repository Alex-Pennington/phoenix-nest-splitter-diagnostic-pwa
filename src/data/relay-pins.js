const RELAY_PINS = {
  K1: {
    label: "K1 — Cycle Latch Relay",
    pins: [
      {pin:1, func:"Pole 1 COM", wire:"W12", conn:"+12V Bus (A)"},
      {pin:2, func:"Coil (+)",   wire:"W15", conn:"From LS2"},
      {pin:3, func:"Pole 1 NC",  wire:"—",   conn:"Not used"},
      {pin:4, func:"Pole 1 NO",  wire:"W13", conn:"Junction B (seal)"},
      {pin:5, func:"Pole 2 NO",  wire:"W18", conn:"To LS1"},
      {pin:6, func:"Pole 2 NC",  wire:"—",   conn:"Not used (jog interlock)"},
      {pin:7, func:"Coil (−)",   wire:"W16", conn:"Ground bus"},
      {pin:8, func:"Pole 2 COM", wire:"W17", conn:"+12V Bus (A)"},
    ]
  },
  K2: {
    label: "K2 — Direction Relay",
    pins: [
      {pin:1, func:"Pole 1 COM", wire:"W21", conn:"+12V Bus (A)"},
      {pin:2, func:"Coil (+)",   wire:"W19", conn:"From LS1"},
      {pin:3, func:"Pole 1 NC",  wire:"W23", conn:"SOL-B (+)"},
      {pin:4, func:"Pole 1 NO",  wire:"W22", conn:"SOL-A (+)"},
      {pin:5, func:"Pole 2 NO",  wire:"—",   conn:"Not used"},
      {pin:6, func:"Pole 2 NC",  wire:"—",   conn:"Not used"},
      {pin:7, func:"Coil (−)",   wire:"W20", conn:"Ground bus"},
      {pin:8, func:"Pole 2 COM", wire:"—",   conn:"Not used"},
    ]
  }
};
