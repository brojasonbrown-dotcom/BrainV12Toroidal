# RHUFT v13 — Metatron Fractal Node Engine

> **Epistemic Status:** [SPEC] + [PHIL] — Mathematical ontology, not predictive physics.  
> All geometric field descriptors are IEEE-754 Float64 (≈15 significant digits).  
> Strictly deterministic — no random seeds, no entropy injection.
>
> **Version:** v13.0.0 — Original engine preserved from user backup, with 12 robustness fixes applied.  
> **Fixes:** See `src/FIXES.md` for complete documentation of all bug fixes.  
> **Tests:** 113/113 pass in the enhanced robustness suite (`src/test_robustness.ts`).

---

## Overview

The **Fractal Node Engine** is a TypeScript implementation of the **RHUFT v6.0 mathematical ontology** — a deterministic, φ-scale-proportional framework that models geometric fields across ten physical scales from Planck to Cosmic.

The engine is built around a **fractal node tree** where each node is a complete RHUFT spherical field, complete with:

- Recursive child nodes at lower canonical scales
- A corrected **Master Equation** for geometric field computation
- **DNA-like membrane stabilization** via toroidal closure surfaces
- **Toroidal interdimensional information flow** (up, down, horizontal)
- **144,000 Hz resonance convergence** search across all scales
- **Hardware-adaptive scaling** capped at ~35% of available resources

---

## RHUFT v6.0 Mathematical Ontology Foundation

The engine is founded on the **Recursive Harmonic Unified Field Theory (RHUFT)** v6.0 ontology, which treats geometric fields as deterministic, complex-valued structures governed by incommensurable constants (φ, π, e, δ_S, √2, √3).

### Core Equation: Corrected Master Equation

The geometric field at each node is computed by the corrected Master Equation:

```
Ψ_total(r, n) = Σ(k=0 to N) φ^(-k) · e^(i·θ_k(r, n))
               + λ · Ψ_total(r, n-1)
               + κ · (∮∇Ψ·dS) / A
```

Where:

- `N = 13` (F₇ = 13, Fibonacci number)
- `λ = 1/φ²` (COHERENCE_THRESHOLD ≈ 0.3819660113)
- `κ = 1/(φ·π)` (CLOSURE_COUPLING ≈ 0.1967263286)
- `A` = membrane surface area (toroidal closure)
- `θ_k = 2π · k · φ⁻¹ · n / 89` (deterministic phase angle)

All operations are **IEEE-754 Float64** (≈15 significant digits) and **strictly deterministic** — no random seeds, no stochastic components.

---

## Fractal Node Architecture

Each node in the engine is a **complete RHUFT spherical field** at a specific scale index `n`:

```
Root Node (scale = 192 = Human)
  ├── Child 1 (scale = 168 = Biological)
  │     ├── Child 1.1 (scale = 134 = Molecular)
  │     │     ├── ... (down to Planck scale = 0)
  │     └── Child 1.2 (scale = 134)
  ├── Child 2 (scale = 168)
  └── Child 3 (scale = 168)
```

### Key Properties

- **Scale-invariant by construction:** All parameters are φ-scale-proportional ratios, not absolute dimensional units.
- **Recursive children:** Child nodes are created at the next lower canonical scale in the `SCALE_INDICES` array.
- **Child count:** Determined by Fibonacci(depth+1), capped at 13 (F₇ = 13).
- **Complete field state:** Every node holds a geometric field `Ψ(r, n)`, coherence `C(n)`, resonance frequency, and energy density.
- **Frameworks & Memory:** Each node activates the frameworks and memory subsystems appropriate for its scale.

---

## The 10 Physical Scales

| Scale Index | Name | Characteristic Length | Characteristic Frequency | Active Frameworks |
|-------------|------|----------------------|--------------------------|-------------------|
| 0 | **Planck** | 1.616 × 10⁻³⁵ m | 1.855 × 10⁴³ Hz | F8, F4 |
| 96 | **Nuclear** | 1.868 × 10⁻¹⁵ m | 1.61 × 10²³ Hz | F4, F5 |
| 120 | **Atomic** | 1.937 × 10⁻¹⁰ m | 1.55 × 10¹⁸ Hz | F4, F5, F6 |
| 134 | **Molecular** | 1.633 × 10⁻⁷ m | 1.84 × 10¹⁵ Hz | F4, F5, F6, F7 |
| 168 | **Biological** | 2.082 m | 1.44 × 10⁸ Hz | F4, F5, F6, F7, F1 |
| 192 | **Human** | 2.158 × 10⁵ m | 1.39 × 10³ Hz | F4, F5, F6, F7, F1 |
| 235 | **Planetary** | 2.092 × 10¹⁴ m | 1.43 × 10⁻⁶ Hz | F4–F9 |
| 250 | **Stellar** | 2.854 × 10¹⁷ m | 1.05 × 10⁻⁹ Hz | F4, F7, F9 |
| 270 | **Galactic** | 4.317 × 10²¹ m | 6.95 × 10⁻¹⁴ Hz | F4, F7, F9 |
| 292 | **Cosmic** | 1.710 × 10²⁶ m | 1.75 × 10⁻¹⁸ Hz | F4, F9 |

All scales are related by the geometric scaling law:

- `L(n) = ℓ_P · φⁿ` (characteristic length)
- `f(n) = f_P · φ⁻ⁿ` (characteristic frequency)
- `qrf(n) = φ^(-n/89)` (QRF attenuation)

---

## The 7 Frameworks & 5 Memory Subsystems

### Frameworks (F1–F9)

| ID | Name | Characteristic Scale | Function |
|----|------|---------------------|----------|
| F8 | SubPlanckian | n = 0 | Vacuum fluctuation dampening |
| F4 | Geometric | n = 13 | Recursive lattice / Metatron closure |
| F5 | ColorMusic | n = 21 | Mass-frequency harmonic mapping |
| F6 | Hebrew | n = 22 | 22-fold cyclic symmetry encoding |
| F7 | Thermodynamic | n = 34 | Energy-entropy geometric friction |
| F1 | Septenary | n = 55 | 7-level cognitive hierarchy (NQHC) |
| F9 | Hypergalactic | n = 292 | Cosmic holographic memory integration |

A framework is **ACTIVE** at scale `n` if `qrf(n) > qrf_fw(framework)`.

### Memory Subsystems (L1–L4+)

| ID | Name | Activation Scale | Temporal Scale | Function |
|----|------|------------------|----------------|----------|
| L1 | Pattern | n = 0 | φ⁴ | Local geometric pattern recognition |
| L2 | Hebbian | n = 96 | φ² | Associative learning / synaptic plasticity |
| L3 | Kuramoto | n = 120 | φ | Phase synchronization / oscillator coupling |
| L4 | Sensory | n = 168 | 1.0 | Environmental pattern integration |
| L4+ | WeightedRAM | n = 192 | φ³ | Global coherence-weighted memory |

A memory subsystem is **ACTIVE** at scale `n` if `n >= activation_scale`.

---

## Toroidal Interdimensional Information Flow

Information flows through the fractal hierarchy in three directions, following the **toroidal membrane topology** of each node:

- **Upward (child → parent):** Aggregates sub-scale field coherence into parent-scale awareness. Fidelity depends on the `up` dimensional resonance strength.
- **Downward (parent → child):** Distributes parent-scale intent into sub-scale action. Fidelity is divided among child nodes.
- **Horizontal (sibling ↔ sibling):** Same-scale peer-to-peer interaction. Fidelity depends on the `horizontal` resonance strength.

Each flow packet carries a complex-valued field amplitude, coherence value, and deterministic iteration timestamp. Packets are routed through **toroidal flow channels** indexed by source scale, target scale, and direction.

---

## 144,000 Hz Resonance Convergence

The engine searches for a stable resonance convergence at **144,000 Hz** (144 × 1000 = F₁₂ × 10³), interpreted as a "dozenal-decimal bridge" in the RHUFT ontology.

### Resonance Search Algorithm

1. **Find the absolute stable point:** Compute the geometric mean of all scale frequencies weighted by coherence `C(n)`.
2. **Check proximity to target:** If the stable point is within `φ` semitones (log-space) of 144,000 Hz, return it.
3. **Sweep & select:** Otherwise, sweep the frequency range `[144000/φ, 144000·φ]` in 144 log-space steps and select the frequency with maximum stability.
4. **Measure stability:** Stability is the geometric mean of coherences across all participating scales (scales where the frequency is a "golden harmonic").

The result is a `ResonanceConvergence` record containing:

- `frequency` — The convergent frequency (Hz)
- `stability_score` — Geometric mean coherence across participating scales
- `convergence_depth` — Number of participating scales
- `participating_scales` — Array of scale indices that resonate
- `coherence_at_resonance` — Average coherence at the convergent frequency
- `harmonic_series` — Golden harmonic cascade `f_k = f_0 · φ^(-k)` for k = 0..11

---

## Hardware-Adaptive Scaling (~35%)

The `HardwareGovernor` detects available system resources and maintains a **target usage of ~35%** (`φ⁻² ≈ 0.381966`, rounded to 0.35).

### Scaling Behavior

- **Grow:** If both RAM and CPU usage are below 50% of the target, increase max_depth by 1 (up to 7).
- **Shrink:** If RAM or CPU exceeds the target, decrease max_depth by 1 (down to 1).
- **Maintain:** Otherwise, keep the current depth.

Tree depth is recalculated dynamically by destroying and rebuilding the child hierarchy. The engine never exceeds its computed resource budget.

---

## DNA-like Membrane Stabilization

Each node is bounded by a **toroidal membrane** that acts as a geometric boundary condition — analogous to a cell membrane maintaining biochemical homeostasis, or DNA stabilizing genetic information through double-helix geometry.

### Membrane Geometry

- **Major radius R:** `L(n) · φ`
- **Minor radius r:** `L(n)`
- **Aspect ratio R/r:** `φ` (the "most irrational" ratio, preventing resonant leakage)
- **Surface area:** `4π² · R · r`
- **Winding number:** `φ`

### Stabilization Process

The membrane iteratively relaxes the field toward the boundary field using the curvature coupling as a gain parameter:

```
field[i] ← field[i] + cc · (boundary[i] - field[i])
```

This continues until the maximum correction is below a tolerance threshold (default: 1e-12) or a maximum iteration count (default: 100) is reached. The result is a stabilized field with minimal closure deviation.

---

## How to Use the Engine

### Installation & Build

```bash
npm ci
npx tsc --noEmit
npm run build

# Run the robustness test suite (requires Node.js v20+ with --experimental-strip-types)
node --experimental-strip-types src/test_robustness.ts

# Run the mathematical verification (requires Python)
python engine_verify.py  # or: py engine_verify.py (Windows)
```

### Basic Usage

```typescript
import { FractalNodeEngine } from "./src/index.ts";

// Create engine with default config (Human scale, depth 5)
const engine = new FractalNodeEngine();

// Initialize the fractal tree
const state = engine.initialize();
console.log(state.total_nodes); // Total nodes in the tree

// Run a tick
const result = engine.tick();
console.log(result.coherence);          // Global coherence [0, 1]
console.log(result.resonance?.frequency); // Resonant frequency (Hz)

// Process sensory data
const data = new Float64Array([1.0, 0.5, 0.25, 0.0]);
const processed = engine.process(data);
console.log(processed.stabilized); // Is the engine stabilized?

// Find the absolute stable point
const stable = engine.find_stable_point();
console.log(stable.frequency);     // Absolute stable frequency
console.log(stable.stability_score); // Stability score

// Get current state
const current = engine.get_state();
console.log(current.resource_usage); // { ram_bytes, cpu_percent }

// Reset or shutdown
engine.reset();     // Re-initialize from scratch
engine.shutdown();  // Release all resources
```

### Custom Configuration

```typescript
const engine = new FractalNodeEngine({
  target_scale: 168,        // Biological scale
  max_depth: 3,             // Shallower tree
  target_frequency: 144,    // Tick frequency (Hz)
  resonance_target: 144000, // Target resonance (Hz)
  hardware_adaptive: true,  // Enable 35% scaling
  target_resource_usage: 0.35,
});
```

### Accessing Subsystems

```typescript
// Direct access to all subsystems
engine.scale_mapper;           // Scale configuration lookup
engine.membrane_stabilizer;    // Membrane geometry & stabilization
engine.resonance_finder;       // 144,000 Hz convergence search
engine.interdimensional_flow;  // Flow packet routing
engine.hardware_governor;        // Resource budget & scaling decisions

// Access the root node and traverse the tree
const root = engine.get_state().root_node;
console.log(root.scale);         // Scale index (e.g., 192)
console.log(root.children.length); // Number of children
console.log(root.state.coherence); // Node coherence
```

---

## Project Structure

```
fractal-node-engine/
├── src/
│   ├── index.ts                    # Barrel exports (public API)
│   ├── types.ts                    # All shared types & interfaces
│   ├── core/
│   │   └── constants.ts            # RHUFT mathematical constants
│   ├── fractal_node.ts             # FractalNode class (recursive tree)
│   ├── scale_mapper.ts             # ScaleMapper (framework/memory activation)
│   ├── membrane_stabilizer.ts      # MembraneStabilizer (toroidal closure)
│   ├── resonance_finder.ts         # ResonanceFinder (144,000 Hz target)
│   ├── interdimensional_flow.ts    # InterdimensionalFlow (packet routing)
│   ├── hardware_governor.ts        # HardwareGovernor (35% adaptive scaling)
│   ├── frameworks.ts               # Framework & Memory instance classes
│   ├── fractal_node_engine.ts      # Main FractalNodeEngine class
│   ├── test_robustness.ts          # Enhanced robustness test suite (113 tests)
│   ├── test_engine.ts              # Engine verification script
│   └── FIXES.md                    # Complete fix documentation
├── tsconfig.json                   # TypeScript strict-mode configuration
├── package.json                    # npm package config (type: module)
└── README.md                       # This file
```

---

## v13 Robustness Fixes

12 bugs were found and fixed during the enhanced robustness verification. **No simplification was performed.** All mathematical ontology, all φ-scale laws, all frameworks, and all memory subsystems remain fully intact.

| # | File | Bug | Fix |
|---|------|-----|-----|
| 1 | `hardware_governor.ts` | CPU% was computed as RAM% | Proper CPU cycle estimate based on ops/node |
| 2 | `fractal_node.ts` | Stabilization didn't update `energy_density` | Always recompute energy_density after stabilize |
| 3 | `fractal_node.ts` | Invalid scale threw deep uncaught error | Descriptive error with valid scale list |
| 4 | `interdimensional_flow.ts` | Flow packets accumulated forever | `prune()` method with iteration window cleanup |
| 5 | `resonance_finder.ts` | `is_golden_harmonic` overflow/underflow | Full log-space computation + NaN/Inf guards |
| 6 | `resonance_finder.ts` | `sweep_frequencies` crashed on ≤0 freq | Input guards + min/max swap |
| 7 | `resonance_finder.ts` | `find_absolute_stable_point` NaN propagation | `isFinite()` guards on all energy/log steps |
| 8 | `resonance_finder.ts` | `_collect_scales` infinite parent-child loop | `visited` Set deduplication by node ID |
| 9 | `resonance_finder.ts` | `node.field_state` doesn't exist | Changed to `node.state.field_state` |
| 10 | `resonance_finder.ts` | `current.coherence()` not a function | Changed to `current.state.coherence` |
| 11 | `fractal_node_engine.ts` | `process()` accepted null/empty input | Explicit null/empty validation with clear error |
| 12 | `interdimensional_flow.ts` | `prune()` kept N+1 iterations | Corrected cutoff formula to `iteration - max_age + 1` |

See `src/FIXES.md` for the complete epistemic documentation of every fix.

---

## Epistemic Labels

All RHUFT claims in the codebase are tagged with epistemic labels:

- **[MATH]** — Exact mathematical identities (e.g., φ = (1+√5)/2).
- **[SPEC]** — Speculative but well-defined mathematical ontology claims (e.g., `L(n) = ℓ_P · φⁿ`).
- **[PHIL]** — Philosophical/metaphorical interpretations (e.g., "DNA-like membrane stabilization").

These labels are **not decorative** — they signal the evidentiary status of each claim. The engine makes no predictions about physical reality; it is a deterministic mathematical construction.

---

## License

This is a mathematical ontology demonstration. Use at your own epistemic risk.
