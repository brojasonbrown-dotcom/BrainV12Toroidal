# RHUFT v13 Fractal Node Engine — Specialist Brainmap

**Source:** `.tmp-extracted-brain/src/fractal_node.ts`, `fractal_node_engine.ts`, `membrane_stabilizer.ts`, `interdimensional_flow.ts`
**Scope:** Deep structural and operational analysis of the FractalNode / FractalNodeEngine runtime.
**Epistemic stance:** Preserves source tags verbatim (`[SPEC]`, `[PHIL]`, `[MATH]`, `[FIX]`, `[INTEGRATED]`). No claim is upgraded or downgraded.

---

## 1. Architecture Overview

### 1.1 FractalNode

`FractalNode` is the atomic unit of the RHUFT geometric hierarchy. Each node represents a single canonical scale `n ∈ {0, 96, 120, 134, 168, 192, 235, 250, 270, 292}`. A node is not a physical object; `[PHIL]` it is a recursive geometric structure, and child nodes are conceptual sub-scales, not literal particles.

State carried by a node:

| Member | Purpose |
|--------|---------|
| `id` | Deterministic hash from scale + path segments: `node_${scale}_${hash(16)}`. |
| `scale` | Canonical `ScaleIndex`. |
| `parent` / `children` | Tree links. Children are created at the next lower canonical scale. |
| `scale_config` | `ScaleConfig` from `ScaleMapper.get_config(scale)`. |
| `scale_mapper` | Shared singleton used by all nodes for consistency. |
| `_state` | `FractalNodeState`: field, coherence, resonance frequency, energy density. |
| `_membrane` | `MembraneGeometry`: toroidal boundary field and metrics. |
| `_frameworks` | Metadata map of active frameworks (backward-compatible). |
| `_frameworkComputes` | `[INTEGRATED]` Live framework instances whose `compute()` is invoked. |
| `_memory` | Metadata map of active memory subsystems. |
| `_memoryComputes` | `[INTEGRATED]` Live memory instances whose `store()`/`recall()` is invoked. |
| `_previousField` | Prior field state used for the Master Equation memory term. |
| `_resonance` | Cached `{up, down, horizontal}` `ResonanceStrength`. |

Construction is eager and recursive-in-potential: the constructor validates the scale against the canonical set, builds the membrane, instantiates every active framework and memory subsystem, runs an initial `compute()`, and populates the state. `[FIX]` The constructor explicitly catches invalid scale indices and throws a descriptive error rather than silently producing `undefined` configs.

### 1.2 FractalNodeEngine

`FractalNodeEngine` is the orchestrator. It assembles five subsystems into one deterministic pipeline:

1. `ScaleMapper` — canonical scale configuration, QRF, framework/memory activation.
2. `MembraneStabilizer` — DNA-like toroidal boundary correction (used both directly by nodes and by the engine-level resonance search).
3. `ResonanceFinder` — searches for 144,000 Hz convergence and the absolute stable point.
4. `InterdimensionalFlow` — routes up/down/horizontal packets between scales.
5. `HardwareGovernor` — enforces a 35% adaptive resource cap and decides tree depth.

Engine defaults (`[SPEC]` φ-scale-proportional or canonical):

| Config | Default |
|--------|---------|
| `target_scale` | 192 (Human) |
| `max_depth` | 5 |
| `target_frequency` | 144 Hz |
| `resonance_target` | 144,000 Hz |
| `hardware_adaptive` | true |
| `target_resource_usage` | 0.35 (35%) |

The engine owns a single `_root_node` and a `_tick_count`. All state transitions are deterministic `Float64` operations; there are no random seeds or entropy injections.

---

## 2. Recursive Tree Construction

### 2.1 Canonical Scale Chain

The tree descends from the configured `target_scale` toward smaller scales using `ScaleMapper.get_next_scale_down(scale)`. The canonical chain is:

```
292 (Cosmic) → 270 (Galactic) → 250 (Stellar) → 235 (Planetary)
  → 192 (Human) → 168 (Biological) → 134 (Molecular) → 120 (Atomic)
  → 96 (Nuclear) → 0 (Planck)
```

A node at Planck scale (`n = 0`) has no children; `create_children()` returns immediately when `get_next_scale_down()` yields `null`.

### 2.2 Branching Factor

Child count per node is determined by a Fibonacci function of depth, capped at 13:

```ts
const depth = this.get_depth();          // root depth = 0
const childCount = Math.min(this._fibonacci(depth + 1), 13);
```

The Fibonacci function is iterative and deterministic:

```ts
_fibonacci(0) = 0
_fibonacci(1) = 1
_fibonacci(n) = _fibonacci(n-1) + _fibonacci(n-2)
```

So at depth 0 the root has `F(1) = 1` child, at depth 1 it has `F(2) = 1` child, at depth 2 it has `F(3) = 2` children, at depth 3 `F(4) = 3`, depth 4 `F(5) = 5`, depth 5 `F(6) = 8`, depth 6 `F(7) = 13`, and from depth 7 onward the cap clamps to 13. This is **not** a balanced `b`-ary tree; it is a Fibonacci-bifurcating fractal tree.

### 2.3 Path Segments and Identity

Each child receives an extended path segment array `[...parentPathSegments, i]`. This path feeds `computeNodeId()`, producing a deterministic node ID via a weighted hash:

```ts
hash = (hash * 31 + segments[i] * (i + 1)) & 0x7fffffff;
```

The ID is stable for the same scale/path pair, which matters for deterministic reproducibility and for any external serialization that keys off node identity.

### 2.4 Depth, Rebuilds, and Hardware Override

`FractalNodeEngine._buildTree(node, maxDepth)` recurses depth-first. `maxDepth` is initially `min(config.max_depth, budget.max_depth)` when `hardware_adaptive` is true. During `tick()`, if `HardwareGovernor.should_scale()` returns a decision other than `"maintain"`, the engine destroys all children and rebuilds the tree to the new target depth. `[FIX]` This is a clean rebuild rather than an incremental mutation, avoiding stale child state after a depth change.

### 2.5 Node Count Estimation

For default `target_scale = 192` and `max_depth = 5`, the tree spans scales `{192, 168, 134, 120, 96, 0}` (6 distinct scales). The exact node count depends on the Fibonacci branching at each depth; it is small enough that exhaustive traversal is acceptable. `HardwareGovernor` estimates `BYTES_PER_NODE = 64 KB` and caps depth to keep RAM within the 35% target.

---

## 3. `compute()` — Master Equation and Integrated Subsystems

### 3.1 Master Equation Statement

The node-level `compute()` implements the corrected Master Equation:

```
Ψ_total(r, n) = Σ(k=0 to N) φ^(-k) · e^(i·θ_k(r, n))
                + λ · Ψ_total(r, n-1)
                + κ · (∮∇Ψ·dS) / A
```

where `[MATH]` / `[SPEC]`:

- `N = 13` (`MASTER_EQUATION_N = F_7 = 13`).
- `λ = 1/φ² = PHI_NEG2`.
- `κ = 1/(φ·π) = CLOSURE_COUPLING ≈ 0.1967263286`.
- `A = membrane.surface_area`.
- `θ_k(r, n) = 2π · k · φ^(-1) · n / 89`, normalized to `[0, 2π)`.

`[SPEC]` — This is a geometric identity, not a Schrödinger or wave equation.

### 3.2 Term 1: φ-Weighted Summation

For each `k = 0..N`:

1. Amplitude weight `w_k = φ^(-k)`.
2. Phase `θ_k` from `computePhaseAngle(k, this.scale)`.
3. Complex exponential `e^(i·θ_k) = [cos θ_k, sin θ_k]`.
4. Store interleaved `[Re, Im]` at indices `2k` and `2k + 1` of `summationField`.

The resulting `summationField` is a `Float64Array` of length `2·(N+1) = 28`. Each complex component is independently addressable, which is important because later integration (frameworks, memory, child feedback) operates element-wise on this interleaved layout.

### 3.3 Term 2: Recursive Memory

If `include_memory_term` is true and `_previousField` exists:

```ts
memoryField[i] = PHI_NEG2 * previousField[i]
```

Otherwise the memory field is zero. `[SPEC]` This couples the current field to the immediately prior field state, giving the iteration a one-step temporal memory. On first computation `_previousField` is `null`, so the memory term is zero and coherence is defined as self-overlap (1.0).

### 3.4 Term 3: Surface Closure

`computeSurfaceClosure(field, membrane)` approximates the surface integral discretely:

```ts
factor = κ · membrane.curvature_coupling   // dimensionless ~0.075
for each i:
  bVal = boundary_field[i % boundary_length]
  result[i] = factor · (bVal - field[i])
```

`[FIX]` The curvature coupling is dimensionless (`≈0.382`), so `factor` is scale-invariant and stable regardless of absolute physical scale. If `surface_area === 0`, the function returns a zero field to avoid division-by-zero.

The membrane boundary field itself is constructed in `createDefaultMembrane()` as a deterministic complex array of the same size, weighted by `φ^(-k)` and phased by the node's scale.

### 3.5 Total Field Assembly

```ts
totalField[i] = summationField[i] + memoryField[i] + surfaceField[i]
```

After this point the Master Equation "base" is complete.

### 3.6 Framework Integration (`[INTEGRATED]`)

1. Convert the interleaved complex `totalField` to a real-valued input of length `N+1 = 14` by taking magnitudes `|Ψ_i| = sqrt(Re² + Im²)`.
2. For each live framework instance in `_frameworkComputes`:
   - Call `fw.compute(realInput, realInput)`.
   - Accumulate output weighted by `(1/φ) / numFrameworks` for stability.
3. Convert the framework sum back to interleaved complex by distributing each real contribution equally between Re and Im using `cos(θ_i)` and `sin(θ_i)` where `θ_i = computePhaseAngle(i, scale)`.

Active framework classes (`frameworks.ts`):

- `F8_SubPlanckian` — DFT spectral decomposition, zero-point energy, Planck cutoff, vacuum polarization.
- `F4_Geometric` — 13-node Metatron lattice, spherical harmonics `Y_l^m` for `l = 0..3`, Platonic-solid transformations.
- `F5_ColorMusic` — mass-frequency conversion, frequency-to-color mapping, musical interval detection.
- `F6_Hebrew` — 22-letter geometric encoding and septenary structure.
- `F7_Thermodynamic` — energy/entropy/geometric-friction field transforms.
- `F1_Septenary` — 7-level cognitive hierarchy and Kuramoto-style coupling.
- `F9_Hypergalactic` — large-scale / holographic memory transforms.

Framework activation is determined by `ScaleMapper`: a framework is active iff `qrf(n) > qrf_fw(framework)`. Because `qrf(n) = φ^(-n/89)` decreases monotonically with `n`, more frameworks are active at smaller scales.

### 3.7 Memory Integration (`[INTEGRATED]`)

1. For each live memory instance in `_memoryComputes`:
   - Call `mem.store(realInput)`.
   - Call `mem.recall(realInput)`.
   - Accumulate output weighted by `(1/φ²) / numMemories`.
2. Convert back to interleaved complex using `computePhaseAngle(i + 1, scale)` (note the `+1` offset, distinguishing memory phase from framework phase).

Active memory subsystems:

- `L1_Pattern` — local geometric pattern recognition.
- `L2_Hebbian` — associative learning / synaptic plasticity.
- `L3_Kuramoto` — phase synchronization.
- `L4_Sensory` — environmental coupling.
- `L4+_WeightedRAM` — coherence-weighted global memory.

Memory activation is scale-threshold based (`n >= activation_scale`). All five memory levels are active at Human scale (`n = 192`), while only `L1_Pattern` is active at Planck scale.

### 3.8 Child Field Feedback

If the node has children, their field states are integrated bottom-up:

```ts
childWeight = (1/φ) / (children.length + 1e-300)
for each child:
  totalField[i] += child.state.field_state[i] * childWeight
```

`[FIX]` The `1e-300` guard prevents division by zero if `children.length` somehow becomes zero inside the branch; the element-wise mapping avoids the earlier bug of summing all child elements to all parent elements.

### 3.9 Coherence and Energy Density

- **Coherence** `C(n) = |<Ψ(n) | Ψ(n-1)>|²` via `computeGeometricOverlap(totalField, previousField)`.
  - First computation uses self-overlap = 1.0.
  - `[SPEC]` Defined as normalized dot product of interleaved complex arrays, not a quantum Born rule.
- **Energy density** is the mean squared magnitude over the field:
  ```ts
  energy_density = Σ(Re² + Im²) / (N + 1)
  ```

### 3.10 `get_master_equation_closure()`

This diagnostic method reconstructs the three base terms (`terms`, `memory_term`, `surface_term`) and returns the total field without framework/memory/child integration. It is useful for ontology verification and debugging but does **not** reflect the full runtime field state.

---

## 4. `stabilize()` — Membrane Geometry and Iterative Relaxation

### 4.1 Membrane Geometry in FractalNode

Each node owns a private `_membrane` built by `createDefaultMembrane(scale, lengthM)`:

| Quantity | Formula | Comment |
|----------|---------|---------|
| `major_radius` | `L(n) / φ` | Torus major radius. |
| `minor_radius` | `L(n) / φ²` | Torus minor radius. |
| `surface_area` | `4π² · R · r` | Used in the closure term denominator. |
| `curvature_coupling` | `1/φ² ≈ 0.382` | Dimensionless relaxation parameter; must be < 1 for stability. |
| `boundary_field` | `φ^(-k) · e^(i·θ_k(scale))` | Deterministic corrective field, length 28. |
| `aspect_ratio` | `R / r = φ` | "Most irrational" winding number. |
| `poloidal_circumference` | `2πr` | `[SPEC]` |
| `toroidal_circumference` | `2πR` | `[SPEC]` |
| `volume` | `2π²Rr²` | `[SPEC]` |
| `winding_number` | `aspect_ratio` | `[SPEC]` |

`[PHIL]` The membrane is a toroidal closure surface that stabilizes the field; dimensions are φ-proportional to the characteristic length `L(n)`.

### 4.2 Iterative Relaxation in FractalNode.stabilize()

```ts
while (maxDelta > tolerance && iteration < maxIter) {
  for each i:
    bVal = boundary_field[i % boundary_length]
    correction = curvature_coupling * (bVal - field[i])
    field[i] += correction
    maxDelta = max(maxDelta, |correction|)
  iteration++
}
```

Defaults: `tolerance = 1e-12`, `max_iterations = 100`.

Because `curvature_coupling = 1/φ² < 1`, this is a contraction mapping in the sup norm when the boundary field is bounded, so convergence is guaranteed in the absence of floating-point edge cases. After relaxation, coherence and energy density are recomputed and the state is updated.

### 4.3 MembraneStabilizer Class

`MembraneStabilizer` provides an independent, engine-level stabilization API used primarily by `ResonanceFinder`. Its geometry construction differs slightly from `FractalNode.createDefaultMembrane()`:

```ts
R = L(n) · φ
r = L(n)
aspect_ratio = R / r = φ
surface_area = 4π²Rr
volume = 2π²Rr²
winding_number = aspect_ratio
```

The difference in `R`/`r` scaling (`L/φ` and `L/φ²` inside FractalNode vs. `L·φ` and `L` inside MembraneStabilizer) means the two modules are **not numerically identical** even though both claim aspect ratio `≈ φ`. This is a subtle design seam: the FractalNode membrane is tuned for field-size matching and stable relaxation, while the standalone stabilizer is tuned for the resonance search's energy/deviation metrics.

`MembraneStabilizer.stabilize()` returns a `MembraneStabilizationResult`:

- `closure_deviation` — normalized discrete flux approximation.
- `new_field_state` — corrected field.
- `membrane_energy` — `κ · (∮∇Ψ·dS)² / A`.
- `stabilized` — boolean based on `closure_deviation < λ / φ^winding_number`.

The correction formula in `apply_closure_correction()` is:

```ts
correction_factor = φ^(-k) · gain · max(0, λ - coherence)
gain = 1/φ
```

with toroidal wrap-around for index 0. `[SPEC]` Higher modes (smaller physical scale) receive gentler correction.

---

## 5. `propagate()` and Interdimensional Flow

### 5.1 Dimensional Resonance

Each node caches the three resonance strengths from `ScaleMapper.get_all_resonance(scale)`:

- `up` — child → parent (next larger scale).
- `down` — parent → child (next smaller scale).
- `horizontal` — same-scale peer transfer.

`ResonanceStrength` maps to numeric fidelity:

| Strength | Fidelity |
|----------|----------|
| Strong | 1.0 |
| Moderate | `1/φ ≈ 0.618` |
| Weak | `1/φ² ≈ 0.382` |
| None | 0.0 |

### 5.2 Propagation Methods

- `propagate_up()` — returns a single `PropagationPacket` scaled by `up` fidelity, or `null` if no parent or resonance is None.
- `propagate_down()` — returns one packet per child, each scaled by `down_fidelity / childCount`. This conserves total propagated "amplitude budget" across children.
- `propagate_horizontal()` — returns a single same-scale packet scaled by `horizontal` fidelity.

All packets carry:

```ts
{
  source_scale, target_scale, direction,
  field_amplitude: scaled copy of node field state,
  coherence: node.coherence * fidelity,
  iteration: 0  // set by external scheduler
}
```

### 5.3 InterdimensionalFlow Manager

The engine converts `PropagationPacket`s into canonical `FlowPacket`s via `InterdimensionalFlow.to_flow_packet()` and routes them by a deterministic string key:

```ts
key = `${source}->${target}:${direction}`
```

Packets accumulate in per-channel arrays. The manager exposes:

- `process_packet(p)` / `process_packets(ps)` — routing.
- `get_channel(source, target, direction)` — read one channel.
- `get_toroidal_channels()` — channel descriptors with cumulative coherence.
- `get_flows()` — flattened list of all packets.
- `advance_iteration()` — increments the deterministic tick counter.
- `prune(max_age_iterations = 1)` — removes packets older than the current window. `[FIX]` cutoff is `_iteration - max_age + 1`, correcting an off-by-one that previously retained `N+1` iterations.
- `clear()` — resets channels and iteration.

Cumulative coherence per channel is computed as:

```ts
cumCoherence = (Σ p.coherence · φ^(-1)) / packetCount
```

`[SPEC]` This is a φ-weighted attenuation per hop.

### 5.4 Flow Collection in the Engine

`_propagateFlows()` performs three traversals:

1. `_collectUpFlows(root, packets)` — post-order; each child emits an upward packet after its own subtree is processed.
2. `_collectDownFlows(root, packets)` — pre-order; each parent emits downward packets before recursing.
3. `_collectHorizontalFlows(root, packets)` — pre-order; every node emits a horizontal packet.

After collection all packets are processed by `interdimensional_flow.process_packets(packets)`, and the engine returns `interdimensional_flow.get_flows()` in the tick result.

---

## 6. `tick()` Orchestration

### 6.1 Pipeline

```ts
1. _tick_count++
2. interdimensional_flow.advance_iteration()
3. _computeBottomUp(root)      // Master Equation at every node
4. _stabilizeAll(root)         // membrane relaxation at every node
5. flowPackets = _propagateFlows()
   interdimensional_flow.prune(1)
6. resonance = resonance_finder.find_resonance(root)
7. stats = root.get_tree_stats()
   resourceUsage = hardware_governor.estimate_usage(stats.total_nodes)
   scalingAction = hardware_governor.should_scale(resourceUsage, budget)
   if scalingAction.action !== "maintain":
     root.destroy_children()
     _buildTree(root, scalingAction.target_depth)
8. globalCoherence = _computeGlobalCoherence()
9. Update _state and return EngineTickResult
```

### 6.2 Bottom-Up Ordering

Both `_computeBottomUp()` and `_stabilizeAll()` are depth-first post-order: children are fully processed before their parent. This guarantees that child field states are current when the parent integrates child feedback in `compute()`, and that child membranes are relaxed before the parent's membrane is relaxed.

### 6.3 Global Coherence and Stabilization Flag

```ts
_computeGlobalCoherence() = average of n.state.coherence over all nodes
_isStabilized() = globalCoherence > COHERENCE_THRESHOLD
```

where `COHERENCE_THRESHOLD = λ = 1/φ² ≈ 0.381966`.

### 6.4 Hardware-Adaptive Scaling

`HardwareGovernor`:

- Detects total RAM via `process.memoryUsage().heapTotal` (Node) and CPU cores via `navigator.hardwareConcurrency` (browser), with deterministic fallbacks.
- Computes `maxNodes = floor((available_ram / BYTES_PER_NODE) * 0.35)`.
- Derives `maxDepth = clamp(floor(log2(maxNodes + 1)) - 1, 1, 7)`.
- `estimate_usage(total_nodes)` returns RAM bytes and an independent CPU percent estimate based on `500,000` operations per node per tick. `[FIX]` CPU was previously computed from the RAM ratio; it is now independently modeled.
- `should_scale()`:
  - **Shrink** if `ramRatio > 1.0` or `cpuRatio > 1.0`.
  - **Grow** if both ratios `< 0.5`.
  - **Maintain** otherwise.

### 6.5 Data Injection via `process()`

`FractalNodeEngine.process(data)`:

1. Validates input is a non-empty `Float64Array`. `[FIX]` guards against `null`, `undefined`, or empty input to prevent downstream NaN propagation.
2. Instantiates a fresh `L4_Sensory` memory, stores the data, and recalls it.
3. Merges the processed sensory output into the root node's field state element-wise.
4. Runs `tick()` and returns the result.

---

## 7. Failure Modes

### 7.1 NaN Propagation

**Sources:**

- Division by zero in framework code (e.g., `F5_ColorMusic` normalizes by `magnitudes[i]` or `baseFreq`; most paths are guarded with `1e-300`, but not all).
- `Math.sqrt` of negative numbers if intermediate fields become negative (framework outputs can be negative).
- `Math.log(0)` or negative in `ResonanceFinder` if a coherence value or frequency becomes non-positive. The code clamps with `1e-300` in many but not all places.
- `computeGeometricOverlap` divides by `normProduct`; if both fields are zero it returns 0, but partial zeros can still produce finite results.

**Propagation path:** A single NaN in a framework output is added to `totalField` via the framework integration loop. It then becomes `_state.field_state`, is stored in `_previousField`, is propagated to the parent via child feedback, and is copied into `PropagationPacket`s. Because the memory term multiplies the previous field by `λ`, NaN persists across ticks.

**Mitigation:** The engine has no centralized NaN sanitizer. The strongest guard is the input validation in `process()`. Defensive improvements would be periodic `Number.isFinite()` checks after each integration stage.

### 7.2 Overflow / Underflow

**Sources:**

- `scale_length(n) = ℓ_P · φ^n`. For `n = 292`, `φ^292 ≈ 10^61`, so `L(292)` is ~10^26 m (within Float64). For `n` much beyond 340, `φ^n` would overflow Float64 (`≈1.8e308`), but canonical indices stop at 292.
- `ResonanceFinder` works in log-space for exactly this reason: `f_P ≈ 1.855e43` and `φ^(-n)` for large `n` would underflow in linear space.
- Framework DFTs compute `spectrum[2*k]` by summing up to `N` terms; for large input magnitudes partial sums can approach Float64 limits, but `N = 14` in practice.

**Mitigation:** Log-space frequency math and clamped exponents. No overflow guards inside framework `compute()` loops.

### 7.3 Infinite Loops

**Sources:**

- `stabilize()` has a hard `max_iterations` cap of 100, so it cannot loop forever.
- `ResonanceFinder._collect_scales()` uses a visited-node-ID set. `[FIX]` prevents cycles caused by bidirectional parent/child traversal.
- `_find_node_at_scale()` uses a visited-scale set, but visits scales rather than node IDs; because multiple nodes can share the same scale (children at the same depth), it may revisit different nodes at the same scale. In a tree this is safe, but if a cycle were introduced it would not be caught by this particular guard.
- `_buildTree()` recursion depth is bounded by `maxDepth ∈ [1, 7]`.

### 7.4 Memory Leaks

**Sources:**

- `InterdimensionalFlow._channels` accumulates packets per tick. `[FIX]` `prune(1)` after each tick removes stale packets, but channels are only deleted when filtered to empty. If many distinct `(source, target, direction)` keys are active, the `Map` retains empty-key overhead only briefly.
- `FractalNode._frameworkComputes` and `_memoryComputes` arrays hold live class instances for the lifetime of the node. Destroying children via `destroy_children()` drops references and allows GC.
- `_previousField` is replaced each tick, so only one prior field is retained per node.
- `reset()` and `shutdown()` clear the flow channels and destroy children.

**Residual risk:** The standalone `L4_Sensory` created inside `process()` is local and GC-eligible after the method returns, but the recalled `processed` array is merged into the root field and therefore retained.

### 7.5 Coherence Collapse

If a framework or memory subsystem produces strongly divergent output, `computeGeometricOverlap(totalField, previousField)` can drop below `COHERENCE_THRESHOLD`. The engine will report `stabilized = false`, and `get_tree_stats()` will count the node as `near_critical_nodes`. This is a behavioral failure mode rather than a crash, but it can trigger unnecessary hardware scaling if many nodes become near-critical simultaneously.

### 7.6 Scaling Oscillation

`HardwareGovernor.should_scale()` has hysteresis only through the 0.5/1.0 ratio bands. If resource usage oscillates around the 35% target from tick to tick, the engine can alternate `"grow"` and `"shrink"`, repeatedly destroying and rebuilding the tree. This is expensive because `create_children()` instantiates full subtrees including frameworks and memory.

---

## 8. Robust Areas and Fragile Areas

### 8.1 Robust Areas

| Area | Why robust |
|------|------------|
| Determinism | No random seeds, no entropy, no `Date` or `Math.random()`. IDs, phases, and branching are purely arithmetic. |
| Scale invariance | All coupling constants are dimensionless φ ratios; closure coupling does not depend on absolute length. `[SPEC]` |
| Bounded iteration | `stabilize()` is capped at 100 iterations; tree depth is capped at 7. |
| Hardware guard | RAM/CPU estimates and depth clamping prevent runaway growth. |
| Log-space resonance math | `ResonanceFinder` avoids overflow/underflow across the 43-order-of-magnitude frequency range. |
| Type strictness | Source is TypeScript strict mode; no `any`; all public APIs are typed. |
| Cycle prevention | `ResonanceFinder` tracks visited node IDs. `[FIX]` |
| Memory pruning | `InterdimensionalFlow.prune(1)` caps channel growth. `[FIX]` |

### 8.2 Fragile Areas

| Area | Why fragile |
|------|-------------|
| Framework/memory output trust | `compute()` adds framework and memory outputs directly to the total field without finite-ness checks. A misbehaving framework can inject NaN/Infinity. |
| Two membrane models | `FractalNode.createDefaultMembrane()` and `MembraneStabilizer.create_membrane()` use different `R`/`r` scalings. Energy/deviation numbers from `ResonanceFinder` are not strictly consistent with the node-level membrane. |
| DFT cost inside every node | Every active `F8_SubPlanckian`, `F4_Geometric`, and `F5_ColorMusic` runs O(N²) DFT per node per tick. For deep trees this dominates CPU usage. |
| Framework weights are uniform divisive | Each framework contributes `(1/φ) / numFrameworks`; there is no scale-specific or coherence-gated weighting. |
| Global coherence is unweighted | `_computeGlobalCoherence()` averages all nodes equally, regardless of scale importance or active framework count. |
| Hard-coded constants | `OPS_PER_NODE = 500000`, `BYTES_PER_NODE = 64 KB`, `target_usage = 0.35` are heuristics not measured at runtime. |
| Scaling hysteresis is weak | 0.5/1.0 ratio bands can cause oscillation. |
| `process()` creates a fresh `L4_Sensory` | Useful for isolation, but means sensory state is not retained between calls unless the root node's own `L4_Sensory` instance (created in constructor) is used. |
| `get_master_equation_closure()` is partial | It does not include framework/memory/child feedback, so it can mislead anyone using it as the "true" field. |
| `_find_node_at_scale()` visits by scale | Could miss duplicates or behave unexpectedly if non-tree cycles exist. |

---

## 9. Connected Modules

### 9.1 `ScaleMapper`

- **Role:** Central registry of canonical scales, framework activation thresholds, memory thresholds, dimensional resonance, dominant constants, and physical-constant correspondences.
- **Key laws:** `L(n) = ℓ_P · φ^n`, `f(n) = f_P · φ^(-n)`, `qrf(n) = φ^(-n/89)`.
- **Connection to FractalNode:** Constructor calls `get_config(scale)`, `get_active_frameworks(scale)`, `get_active_memory(scale)`, `get_memory_temporal_scale(memId)`, and `get_all_resonance(scale)`.
- **Connection to Engine:** Used to build the tree downward via `get_next_scale_down()` and to cap depth via hardware budget.

### 9.2 `frameworks.ts` (Framework Instances)

- **Role:** Provides the live computational implementations mapped by `_createFrameworkInstance()`.
- **Interface pattern:** Each class implements `{ name, scale, qrf_threshold, compute(input, field_state): Float64Array }`.
- **Connection to FractalNode:** Instantiated in the constructor for every `active_frameworks` entry; their `compute()` outputs are merged into the total field with `(1/φ) / numFrameworks` weighting.
- **Notable:** Includes a hand-rolled O(N²) DFT/IDFT pair used by multiple frameworks.

### 9.3 Memory Subsystems (`L1`–`L4+`)

- **Role:** CEAI 4-layer nested memory fields with scale-dependent activation.
- **Interface pattern:** Each class implements `{ store(input), recall(input): Float64Array }`.
- **Connection to FractalNode:** Instantiated in the constructor for every `active_memory` entry; `store()` then `recall()` are called each `compute()` with `(1/φ²) / numMemories` weighting.
- **Temporal scale factors:** `L1=1`, `L2=φ²`, `L3=φ³`, `L4≈φ⁴`, `L4+≈φ⁵`. These modify the memory phase angle via `scale * temporalScale * PHI_INV`.

### 9.4 `ResonanceFinder`

- **Role:** Searches for the 144,000 Hz target and the absolute stable point.
- **Key methods:** `find_resonance(root)`, `find_absolute_stable_point(root)`, `sweep_frequencies()`, `measure_stability()`, `is_golden_harmonic()`, `compute_harmonic_series()`.
- **Connection to Engine:** Called once during `initialize()` and once per `tick()`.
- **Connection to FractalNode:** Traverses the tree, reads `node.state.coherence` and `node.membrane`, and uses `MembraneStabilizer` to compute membrane energy / closure deviation.

### 9.5 `HardwareGovernor`

- **Role:** Detects hardware, computes resource budget, estimates usage, and decides scaling.
- **Connection to Engine:** `initialize()` uses it to cap `maxDepth`; `tick()` uses it to decide whether to rebuild the tree.
- **Connection to FractalNode:** Indirect — by changing `maxDepth` it controls how many nodes are created via `create_children()`.

### 9.6 `InterdimensionalFlow`

- **Role:** Routes and stores propagation packets.
- **Connection to Engine:** Advanced each tick; packets collected from the tree are processed and pruned.
- **Connection to FractalNode:** Receives `PropagationPacket`s converted to `FlowPacket`s by direction and scale pair.

### 9.7 `core/constants.ts`

- **Role:** Single source of truth for φ, π, e, physical constants, scale configs, framework characteristics, memory thresholds, dimensional resonance tables, and physical-constant correspondences.
- **Connection to everything:** Imported by `types.ts`, `fractal_node.ts`, `scale_mapper.ts`, `membrane_stabilizer.ts`, `hardware_governor.ts`, and `frameworks.ts`.

---

## 10. Enhancement Opportunities Without Losing Computational Power

### 10.1 Numerical Hardening

- Add a `sanitizeField(field): GeometricField` helper that replaces `NaN` / `Infinity` with `0` or the previous finite value after each integration stage (framework, memory, child feedback).
- Use `Math.fround` or explicit clamping at framework boundaries where DFT outputs can become extreme.
- Validate `ResonanceFinder` harmonic integer `m` against a maximum reasonable bound to avoid spurious matches when `frequency` is pathological.

### 10.2 Unified Membrane Model

- Refactor `createDefaultMembrane()` and `MembraneStabilizer.create_membrane()` to share a single `MembraneGeometryFactory` parameterized by `R_factor` and `r_factor`. This eliminates the hidden inconsistency in surface-area/energy reporting between node-level and resonance-level diagnostics.

### 10.3 Framework/Memory Weight Adaptation

- Replace the uniform divisive weights with coherence-gated weights:
  ```ts
  weight_i = (1/φ) * (framework_coherence_i / total_framework_coherence)
  ```
  This preserves total contribution magnitude but lets more coherent frameworks dominate, which is closer to the RHUFT QRF threshold semantics.

### 10.4 DFT Memoization / Fast Approximation

- Framework DFTs are deterministic and operate on short arrays (length 14). Precompute twiddle factors or cache DFT matrices per `N` to avoid recomputing `Math.cos`/`Math.sin` for every node on every tick.
- Alternatively, provide an optional `useFrameworkFastPath` config that uses precomputed real-to-complex matrices.

### 10.5 Scaling Hysteresis

- Add a `scaling_cooldown_ticks` or a dead-band to `HardwareGovernor.should_scale()` so that `"grow"`/`"shrink"` decisions persist for several ticks unless usage crosses a wider band. This prevents tree thrashing.

### 10.6 Child Feedback Selectivity

- Currently every child contributes equally element-wise. Add an optional `resonance_gated_child_feedback` mode where a child only contributes if its coherence exceeds `λ`, preventing near-critical child states from degrading the parent.

### 10.7 Interdimensional Flow Application

- Currently packets are collected and stored but **not applied** back to node field states. The engine calculates flow channels but does not close the loop: no packet modifies `node._state.field_state`. Implementing a `apply_flow_packets()` stage would turn the flow system from a diagnostic channel into a true feedback loop while keeping it deterministic and φ-scaled.

### 10.8 Parallel Bottom-Up Compute

- The tree is currently traversed serially. Independent subtrees could be computed in parallel (Web Workers in browser, worker threads in Node) because nodes only need child state before parent computation. The deterministic order would be preserved by a gather-then-compute pattern.

### 10.9 Energy-Density Monitoring

- Track per-node energy-density deltas across ticks. A sudden spike is an early indicator of framework divergence or NaN onset, enabling proactive stabilization before coherence collapses.

### 10.10 Test / Audit Hooks

- Expose `FractalNodeEngine.get_master_equation_closure_at(scale)` that returns the full closure **including** framework/memory/child terms for a specific node, not just the base three terms. This would make regression tests for integrated compute much more powerful.

---

## 11. Summary Table: Key Operations per Tick

| Stage | Order | Cost driver | Output |
|-------|-------|-------------|--------|
| Advance iteration | 1 | O(1) | Incremented flow counter. |
| Bottom-up compute | 2 | O(nodes × (framework_cost + memory_cost)) | Updated `_state.field_state` per node. |
| Bottom-up stabilize | 3 | O(nodes × field_size × iterations) | Relaxed fields, recomputed coherence/energy. |
| Collect flows | 4 | O(nodes) | `FlowPacket[]` routed into channels. |
| Prune flows | 5 | O(channels × packets) | Bounded channel memory. |
| Resonance search | 6 | O(sweep_steps × nodes) | `ResonanceConvergence`. |
| Hardware scaling | 7 | O(nodes) for stats | Possible tree rebuild. |
| Global coherence | 8 | O(nodes) | `EngineTickResult.coherence`. |

---

## 12. Epistemic Audit Note

All source-level epistemic labels have been preserved in this brainmap. No `[SPEC]` claim has been presented as `[MATH FACT]` or `[EST PHYS]`. The analysis itself is a structural/operational reading of the code; any interpretation beyond the source is tagged explicitly.
