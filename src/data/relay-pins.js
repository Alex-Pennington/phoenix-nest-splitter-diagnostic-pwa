const RELAY_PINS = {
  K1: {
    label: "K1 \u2014 Cycle Latch Relay",
    pins: [
      {pin:"Coil (+)", wire:"W15", conn:"From Retract Limit NC pair"},
      {pin:"Coil (\u2212)", wire:"W16", conn:"Ground bus"},
      {pin:"Pair 1 COM", wire:"W12", conn:"+12V Bus (A)"},
      {pin:"Pair 1 NO", wire:"W13", conn:"Junction B (seal)"},
      {pin:"Pair 1 NC", wire:"\u2014", conn:"Not used"},
      {pin:"Pair 2 COM", wire:"W17", conn:"+12V Bus (A)"},
      {pin:"Pair 2 NO", wire:"W18", conn:"Node X (feeds K2 output, K2 coil via K3, K3 coil via extend lim)"},
      {pin:"Pair 2 NC", wire:"\u2014", conn:"Not used"},
    ]
  },
  K2: {
    label: "K2 \u2014 Direction Relay",
    pins: [
      {pin:"Coil (+)", wire:"W20", conn:"From K3 Pair 1 NC (locked off when K3 latches)"},
      {pin:"Coil (\u2212)", wire:"W21", conn:"Ground bus"},
      {pin:"Pair 1 COM", wire:"W26", conn:"Node X (solenoid output power)"},
      {pin:"Pair 1 NO", wire:"W27", conn:"SOL-A (+) \u2014 EXTEND"},
      {pin:"Pair 1 NC", wire:"W28", conn:"SOL-B (+) \u2014 RETRACT"},
      {pin:"Pair 2 COM", wire:"\u2014", conn:"Not used"},
      {pin:"Pair 2 NO", wire:"\u2014", conn:"Not used"},
      {pin:"Pair 2 NC", wire:"\u2014", conn:"Not used"},
    ]
  },
  K3: {
    label: "K3 \u2014 Extend Memory Latch",
    pins: [
      {pin:"Coil (+)", wire:"W23 + W24", conn:"From Extend Limit NO pair AND K3 Pair 2 NO (seal) \u2014 two wires on same terminal"},
      {pin:"Coil (\u2212)", wire:"W25", conn:"Ground bus"},
      {pin:"Pair 1 COM", wire:"W19", conn:"Node X (jumpered to Pair 2 COM)"},
      {pin:"Pair 1 NO", wire:"\u2014", conn:"Not used"},
      {pin:"Pair 1 NC", wire:"W20", conn:"K2 Coil (+) \u2014 THE LOCK"},
      {pin:"Pair 2 COM", wire:"jumper", conn:"Jumpered to Pair 1 COM"},
      {pin:"Pair 2 NO", wire:"W24", conn:"K3 Coil (+) \u2014 THE SEAL"},
      {pin:"Pair 2 NC", wire:"\u2014", conn:"Not used"},
    ]
  }
};
