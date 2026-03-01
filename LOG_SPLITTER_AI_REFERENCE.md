# Log Splitter Auto-Extend/Return — AI Agent Troubleshooting Reference

> **Owner:** Phoenix Nest LLC — Alex "Rayven" Pennington
> **Drawing:** PN-LS-002 Rev C
> **System:** 12VDC, 3x DPDT DIN Rail Relays, Double Solenoid Hydraulic Valve
> **Date:** February 2026

## Start Procedure
FWD nudge off home, then CYCLE. Retract limit NC prevents K1 latch at home — this is by design.

## Relay Roles
- **K1** = Cycle latch. Seals on CYCLE press, drops when retract limit opens at home.
- **K2** = Direction. Changeover: ON=SOL-A(extend), OFF=SOL-B(retract). Fed through K3 NC lock.
- **K3** = Extend memory. Latches when extend limit NO closes. Seal holds it. K3 NC opens to lock K2 off permanently. Prevents K2 bounce.

## Node X
K1 Pair 2 NO output. Only hot when K1 latched. Powers: K2 output COM, K2 coil via K3, K3 coil via extend limit.

## Why 3 Relays
Without K3, K2 bounces at the extend limit. When K2 drops (extend limit opens), cylinder retracts, moves off limit, limit closes, K2 picks back up, extends again — infinite chatter. K3 remembers that we reached extend and locks K2 off until K1 resets the whole cycle.

## Full Sequence
1. IDLE: K1 off, Node X dead, everything safe
2. FWD nudge moves cylinder off retract limit
3. CYCLE: K1 latches, Node X hot, K2 on (via K3 NC closed), SOL-A extends
4. Extend limit: K3 latches and seals, K3 NC opens, K2 drops, SOL-B retracts
5. Off extend limit: K3 sealed, K2 locked off, no bounce
6. Retract limit: K1 drops, Node X dead, K3 seal lost, all off

## Limit Switches
- Extend limit: **NO pair** used (closes at full extend to trigger K3)
- Retract limit: **NC pair** used (opens at home to drop K1)

## Flyback Diodes: D1(SOL-A), D2(SOL-B), D3(K1), D4(K2), D5(K3). Cathode toward (+).

## Diagnostic Order
1. Bus (A) has power?
2. Jog buttons work?
3. Cylinder off retract limit?
4. K1 latches and holds?
5. K2 comes on?
6. Cylinder extends?
7. K3 latches at extend?
8. K2 drops and stays off?
9. Everything off at home?
