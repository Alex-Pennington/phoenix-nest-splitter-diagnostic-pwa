# Log Splitter Auto-Extend/Return — AI Agent Troubleshooting Reference

> **Owner:** Phoenix Nest LLC — Alex "Rayven" Pennington
> **Drawing:** PN-LS-002 Rev D
> **System:** 12VDC, 3x DPDT DIN Rail Relays, Double Solenoid Hydraulic Valve
> **Date:** March 2026

## Start Procedure
Press CYCLE from any position including home. Hold until cylinder starts moving. Seal takes over once cylinder clears home limit. No nudge required (Rev D change).

## Jog Kill
Press FWD or BWD anytime during auto-cycle. NC contacts break K1 seal, killing the cycle. NO contacts fire solenoid for manual control. One button press does both.

## Relay Roles
- **K1** = Cycle latch. Two paths to coil: CYCLE btn direct (W11), seal chain (W12-W13-W31-W32-W14). Seal chain includes FWD NC, BWD NC, and Retract Lim NC in series.
- **K2** = Direction. Changeover: ON=SOL-A(extend), OFF=SOL-B(retract). Fed through K3 NC lock.
- **K3** = Extend memory. Latches when extend limit NO closes. Seal holds it. K3 NC opens to lock K2 off permanently. Prevents K2 bounce.

## Node X
K1 Pair 2 NO output. Only hot when K1 latched. Powers: K2 output COM, K2 coil via K3, K3 coil via extend limit.

## Why 3 Relays
Without K3, K2 bounces at the extend limit. K3 remembers that we reached extend and locks K2 off until K1 resets the whole cycle.

## Full Sequence
1. IDLE: K1 off, Node X dead, everything safe
2. CYCLE pressed: K1 energizes via direct path (W11). K2 picks up. SOL-A extends.
3. Cylinder moves off home: Retract lim NC closes. Seal chain takes over. Release CYCLE.
4. Extend limit: K3 latches and seals, K3 NC opens, K2 drops, SOL-B retracts
5. Off extend limit: K3 sealed, K2 locked off, no bounce
6. Retract limit: Retract lim NC opens, seal breaks, K1 drops, Node X dead, K3 seal lost, all off

## Jog Kill Sequence
1. Mid-cycle: operator presses FWD or BWD
2. Button NC contact opens, breaking K1 seal chain
3. K1 drops. Node X dead. K2/K3 lose power. Auto-cycle dead.
4. Button NO contact fires solenoid directly. Manual control.
5. Release button. Everything off. Press CYCLE to start new cycle.

## Limit Switches
- Extend limit: **NO pair** used (closes at full extend to trigger K3)
- Retract limit: **NC pair** used (opens at home to break K1 seal)

## Flyback Diodes: D1(SOL-A), D2(SOL-B), D3(K1), D4(K2), D5(K3). Cathode toward (+).

## Diagnostic Order
1. Bus (A) has power?
2. Jog buttons work (both extend and retract)?
3. K1 latches when CYCLE held?
4. K1 seal holds after CYCLE released (cylinder must be off home)?
5. Jog kill works (FWD or BWD drops K1)?
6. K2 comes on when K1 latched?
7. Cylinder extends?
8. K3 latches at extend?
9. K2 drops and stays off?
10. Everything off at home?
