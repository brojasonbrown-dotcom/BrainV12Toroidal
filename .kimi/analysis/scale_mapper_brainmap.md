# RHUFT v13 — Scale Mapper Specialist Brainmap

> **Scope:** Deep analysis of `.tmp-extracted-brain/src/scale_mapper.ts` and the scale-relevant section of `.tmp-extracted-brain/src/core/constants.ts`.
> **Epistemic status:** The source files themselves tag the ontology as `[SPEC] + [PHIL]`; this brainmap preserves those tags and adds `[CODE]` for implementation-level observations and `[MATH FACT]` for established mathematics.
> **Note on version coherence:** `scale_mapper.ts` and `core/constants.ts` are labelled **RHUFT v6.0**, while `frameworks.ts` and the audit/plan documents are labelled **RHUFT v13**. This version discontinuity is a structural finding in its own right and is discussed under *Robustness and Flaws*.

---

## 1. The 10 Canonical Scale Indices and Their Physical Analogues

The registry `SCALE_INDICES` in `core/constants.ts` fixes the discrete hierarchy:

```typescript
export const SCALE_INDICES: readonly ScaleIndex[] = [
  0, 96, 120, 134, 168, 192, 235, 250, 270, 292,
] as const;
```

Each index `n` is mapped to a human-readable name and to a set of approximate physical constants. The correspondence is **order-of-magnitude only** and is explicitly tagged `[SPEC]` in the source.

| `n` | Name | Physical Analogue | Representative Constants from `PHYSICAL_CONSTANTS_BY_SCALE` |
|-----|------|-------------------|--------------------------------------------------------------|
| 0 | Planck | Quantum foam / Planck-scale structure | `planck_length` 1.616e-35 m, `planck_time` 5.391e-44 s, `planck_energy` 1.956e9 J, `reduced_planck_constant` 1.055e-34 J·s |
| 96 | Nuclear | Proton/neutron scale | `proton_radius` 8.414e-16 m, `proton_mass` 1.673e-27 kg, `strong_coupling` 1.0 |
| 120 | Atomic | Electron orbital structure | `bohr_radius` 5.29e-11 m, `fine_structure_inverse` 137.036, `electron_mass` 9.109e-31 kg |
| 134 | Molecular | Chemistry / statistical mechanics | `boltzmann_constant` 1.381e-23 J/K, `avogadro_number` 6.022e23, `gas_constant` 8.314 J/(mol·K) |
| 168 | Biological | Cells / membranes / metabolism | `cell_size` 1.0e-5 m, `atp_hydrolysis` 2.0e4 J/mol, `action_potential` 7.0e-2 V |
| 192 | Human | Brain / body thermodynamics | `brain_mass` 1.4 kg, `neural_firing_max` 1.0e2 Hz, `body_temperature` 3.1e2 K |
| 235 | Planetary | Earth-scale geophysics | `earth_gravity` 9.807 m/s², `earth_radius` 6.371e6 m, `earth_mass` 5.972e24 kg |
| 250 | Stellar | Solar astrophysics | `solar_mass` 1.989e30 kg, `solar_radius` 6.957e8 m, `solar_luminosity` 3.828e26 W |
| 270 | Galactic | Milky Way / cosmological large-scale structure | `milky_way_mass` 1.0e42 kg, `hubble_constant` 2.184e-18 Hz, dark matter/energy fractions |
| 292 | Cosmic | Observable universe / CMB | `cmb_temperature` 2.725 K, `universe_age` 4.354e17 s, `observable_radius` 4.4e26 m |

`[SPEC]` — These are not predictions derived from first principles within the RHUFT ontology; they are order-of-magnitude alignments between the geometric scaling law and observed scales. The source explicitly warns: "Order-of-magnitude correspondences; not predictive of precise physical values."

`[MATH FACT]` — The set of 10 indices is closed and finite. `ScaleMapper.get_scale_count()` returns `SCALE_INDICES.length` (10). No interpolation between canonical scales is admitted as physically meaningful; `get_closest_config(n)` performs nearest-neighbour selection by absolute difference, not interpolation.

---

## 2. Scale Law `L(n) = ℓ_P · φⁿ` and Frequency Law `f(n) = f_P · φ⁻ⁿ`

### 2.1 Length Law

```typescript
compute_length(n: number): Float64 {
  return (PLANCK_LENGTH * Math.pow(PHI, n)) as Float64;
}
```

where `PLANCK_LENGTH = 1.616e-35` m and `PHI = 1.618033988749895`.

`[SPEC]` — `L(n)` is interpreted as the characteristic length at scale `n`. Because the law is multiplicative in `φⁿ`, adjacent canonical scales are separated by powers of φ, not by equal linear steps. This is the origin of the "φ-scaled hierarchy" claim.

Pre-computed snapshot values (`SCALE_CONFIG_SNAPSHOT`):

| `n` | `length_m` (snapshot) | Approximate `1.616e-35 · φⁿ` |
|-----|-----------------------|-------------------------------|
| 0 | 1.616e-35 | 1.616e-35 |
| 96 | 1.868e-15 | ~1.87e-15 |
| 120 | 1.937e-10 | ~1.94e-10 |
| 134 | 1.633e-7 | ~1.63e-7 |
| 168 | 2.082e0 | ~2.08 |
| 192 | 2.158e5 | ~2.16e5 |
| 235 | 2.092e14 | ~2.09e14 |
| 250 | 2.854e17 | ~2.85e17 |
| 270 | 4.317e21 | ~4.32e21 |
| 292 | 1.710e26 | ~1.71e26 |

`[MATH FACT]` — The values are consistent with `φ⁹⁶ ≈ 1.156e35`, `φ¹²⁰ ≈ 1.199e25`, etc. Because IEEE-754 Float64 has ~15 decimal digits of precision, values at large `n` lose relative precision; the snapshot hardcodes rounded mantissas rather than recomputing at runtime.

### 2.2 Frequency Law

```typescript
compute_frequency(n: number): Float64 {
  return (PLANCK_FREQUENCY * Math.pow(PHI, -n)) as Float64;
}
```

where `PLANCK_FREQUENCY = 1.855e43` Hz, derived in the comments from `c / ℓ_P`.

`[SPEC]` — `f(n)` is the characteristic frequency at scale `n`. The inverse relationship to length (`f ∝ φ⁻ⁿ` while `L ∝ φⁿ`) enforces the scale-invariant reciprocal structure of the ontology.

Pre-computed snapshot values:

| `n` | `frequency_hz` (snapshot) |
|-----|---------------------------|
| 0 | 1.855e43 |
| 96 | 1.61e23 |
| 120 | 1.55e18 |
| 134 | 1.84e15 |
| 168 | 1.44e8 |
| 192 | 1.39e3 |
| 235 | 1.43e-6 |
| 250 | 1.05e-9 |
| 270 | 6.95e-14 |
| 292 | 1.75e-18 |

`[MATH FACT]` — `f(n)` and `L(n)` are not rigorously inverse of one another in the code because `PLANCK_FREQUENCY` is hardcoded independently of `SPEED_OF_LIGHT / PLANCK_LENGTH` (which would be ~1.855e43 Hz, coincidentally similar). The product `L(n) · f(n)` is therefore not exactly `c` and varies with `n`. This is a consistency detail the ontology does not enforce.

---

## 3. QRF Attenuation `qrf(n) = φ^(-n/89)`

### 3.1 Definition and Implementation

```typescript
compute_qrf(n: number): Float64 {
  const exponent = -n / QRF_CRITICAL_SCALE;
  return Math.pow(PHI, exponent) as Float64;
}
```

`QRF_CRITICAL_SCALE = 89`, identified in the source as the Fibonacci number `F₁₁`.

`[SPEC]` — QRF (presumably "Quantum Recursive Field" or similar) attenuation measures how much the geometric field retains coherence as scale increases. At `n = 0`, `qrf(0) = 1.0`; as `n → ∞`, `qrf(n) → 0`.

`[MATH FACT]` — Because `φ⁻¹ ≈ 0.618`, the base attenuation per unit `n/89` is `0.618`. The half-life in `n` is `89 · log(0.5) / log(φ⁻¹) ≈ 127.4`, meaning `qrf(n)` falls by half every ~127 scale units.

Computed values at canonical scales and framework thresholds:

| `n` | `qrf(n)` |
|-----|----------|
| 0 | 1.000000 |
| 13 (F4) | 0.932124 |
| 21 (F5) | 0.892665 |
| 22 (F6) | 0.887851 |
| 34 (F7) | 0.832074 |
| 55 (F1) | 0.742763 |
| 89 (`n_c`) | 0.500000 |
| 96 | 0.595080 |
| 120 | 0.522660 |
| 134 | 0.484557 |
| 168 | 0.403187 |
| 192 | 0.354120 |
| 235 | 0.280659 |
| 250 | 0.258795 |
| 270 | 0.232270 |
| 292 (F9) | 0.206221 |

### 3.2 Coherence Status

```typescript
get_coherence_status(n: number): "COHERENT" | "NEAR-CRITICAL" {
  const c = this.compute_coherence(n);
  return c > COHERENCE_THRESHOLD ? "COHERENT" : "NEAR-CRITICAL";
}
```

`COHERENCE_THRESHOLD = λ = 1/φ² ≈ 0.381966`.

`[SPEC]` — A scale is `COHERENT` when `qrf(n) > λ` and `NEAR-CRITICAL` otherwise. This threshold is the same `λ` that appears in the Master Equation as the memory coupling coefficient.

Snapshot coherence statuses:

| `n` | `qrf(n)` | Status |
|-----|----------|--------|
| 0 | 1.000000 | COHERENT |
| 96 | 0.595080 | COHERENT |
| 120 | 0.522660 | COHERENT |
| 134 | 0.484557 | COHERENT |
| 168 | 0.403187 | COHERENT |
| 192 | 0.354120 | NEAR-CRITICAL |
| 235 | 0.280659 | NEAR-CRITICAL |
| 250 | 0.258795 | NEAR-CRITICAL |
| 270 | 0.232270 | NEAR-CRITICAL |
| 292 | 0.206221 | NEAR-CRITICAL |

The transition occurs between `n = 168` and `n = 192`. `n = 192` (Human scale) is the first canonical scale to be classified as near-critical.

---

## 4. Framework Activation Logic

### 4.1 Rule

A framework `fw` is `ACTIVE` at scale `n` iff:

```
qrf(n) > qrf_fw(fw)
```

where `qrf_fw(fw) = qrf(n_fw) = φ^(-n_fw/89)` is the framework's characteristic QRF threshold.

```typescript
is_framework_active(n: number, framework: FrameworkId): boolean {
  const fw = this._frameworkMap.get(framework);
  const qrfN = this.compute_qrf(n);
  return qrfN > fw.qrf_fw;
}
```

`[SPEC]` — Framework activation is a binary threshold. The ordering of activation is determined by each framework's characteristic scale `n_fw`.

### 4.2 Framework Characteristic Scales

| Framework ID | `n_fw` | `qrf_fw` | Description |
|--------------|--------|----------|-------------|
| F8_SubPlanckian | 0 | 1.000000 | Vacuum fluctuations, quantum foam, Planck-scale structure |
| F4_Geometric | 13 | 0.932124 | Structural/spatial organization, recursive lattice, Flower of Life |
| F5_ColorMusic | 21 | 0.892665 | Frequency/wavelength harmonic relationships, mass-frequency correspondence |
| F6_Hebrew | 22 | 0.887851 | Sacred geometry, septenary linguistic encoding, 22-letter structure |
| F7_Thermodynamic | 34 | 0.832074 | Energy, entropy, heat flow, geometric friction, vacuum energy |
| F1_Septenary | 55 | 0.742763 | 7-level cognitive hierarchy, NQHC, Kuramoto coupling |
| F9_Hypergalactic | 292 | 0.206221 | Large-scale structure, cosmic memory, holographic principle |

`[MATH FACT]` — The framework scales `n_fw` are themselves Fibonacci-like numbers: 0, 13, 21, 22, 34, 55, 292. (Note: 22 is not a Fibonacci number; it sits between 21 and 34.)

### 4.3 Active Frameworks by Canonical Scale

| `n` | `qrf(n)` | Active Frameworks (`qrf(n) > qrf_fw`) |
|-----|----------|----------------------------------------|
| 0 | 1.000000 | F8, F4 |
| 96 | 0.595080 | F4, F5 |
| 120 | 0.522660 | F4, F5, F6 |
| 134 | 0.484557 | F4, F5, F6, F7 |
| 168 | 0.403187 | F4, F5, F6, F7, F1 |
| 192 | 0.354120 | F4, F5, F6, F7, F1 |
| 235 | 0.280659 | F4, F5, F6, F7, F1, F9 |
| 250 | 0.258795 | F4, F7, F9 |
| 270 | 0.232270 | F4, F7, F9 |
| 292 | 0.206221 | F4, F9 |

Important observations:

- **F8 is active only at `n = 0`** because its threshold is exactly 1.0 and `qrf(n)` is strictly decreasing. This makes F8 a boundary-only framework in the canonical set.
- **F4 is active at every canonical scale** because its threshold (0.932) is below `qrf(292)` (0.206) — wait, no: 0.932 > 0.206, so at `n = 292` we have `qrf(292) = 0.206` which is **not** greater than 0.932. Yet the snapshot lists F4 at Cosmic scale. This is an inconsistency. `is_framework_active(292, "F4_Geometric")` would return `false` because `0.206221 > 0.932124` is false. The snapshot hardcodes F4 as active at all scales, contradicting the threshold rule.
- **F9 first activates at `n = 235`** and remains active through `n = 292`. Because its threshold is 0.206221, it is active whenever `qrf(n) > 0.206221`, i.e., for all `n < 292`. The snapshot lists F9 only at 235, 250, 270, 292, which is consistent with `qrf(n) > qrf_fw(292)` for those scales.

`[CODE]` — The hand-authored `SCALE_CONFIG_SNAPSHOT` contains at least one internal inconsistency with respect to the activation rule it claims to implement. F4 is listed as active at Cosmic scale (`n = 292`) where the threshold rule says it should be inactive. This is not merely a philosophical choice; it is a violation of the documented `qrf(n) > qrf_fw` predicate.

### 4.4 Sorting

`get_active_frameworks(n)` returns frameworks sorted by `qrf_fw` descending (most fundamental first). This is deterministic and O(7) per call.

---

## 5. Memory Activation Logic

### 5.1 Rule

A memory subsystem `mem` is `ACTIVE` at scale `n` iff:

```
n >= activation_scale(mem)
```

```typescript
is_memory_active(n: number, memory: MemoryId): boolean {
  const mem = this._memoryMap.get(memory);
  return n >= mem.activation_scale;
}
```

`[SPEC]` — Based on the CEAI 4-layer nested memory fields. Memory levels activate at progressively larger scales, forming a φ-scaled temporal hierarchy.

### 5.2 Memory Thresholds

| Memory ID | `activation_scale` | `temporal_scale_factor` | Description |
|-----------|--------------------|-------------------------|-------------|
| L1_Pattern | 0 | 1.0 | Local geometric pattern recognition at Planck scale |
| L2_Hebbian | 96 | φ² ≈ 2.618 | Associative learning, synaptic plasticity at Nuclear scale |
| L3_Kuramoto | 120 | φ³ ≈ 4.236 | Phase synchronization, oscillator coupling at Atomic scale |
| L4_Sensory | 168 | φ⁴ ≈ 6.854 | Environmental coupling, sensory integration at Biological scale |
| L4+_WeightedRAM | 192 | φ⁵ ≈ 11.090 | Coherence-weighted global memory integration at Human scale |

`[MATH FACT]` — The temporal scale factors are consecutive powers of φ: `φ⁰`, `φ²`, `φ³`, `φ⁴`, `φ⁵`. (There is no `φ¹` factor; the sequence jumps from 1 to φ².)

### 5.3 Active Memory by Canonical Scale

| `n` | Active Memory Subsystems (`n >= activation_scale`) |
|-----|-----------------------------------------------------|
| 0 | L1_Pattern |
| 96 | L1_Pattern, L2_Hebbian |
| 120 | L1_Pattern, L2_Hebbian, L3_Kuramoto |
| 134 | L1_Pattern, L2_Hebbian, L3_Kuramoto |
| 168 | L1_Pattern, L2_Hebbian, L3_Kuramoto, L4_Sensory |
| 192 | L1_Pattern, L2_Hebbian, L3_Kuramoto, L4_Sensory, L4+_WeightedRAM |
| 235 | L1, L2, L3, L4, L4+ |
| 250 | L1, L2, L3, L4, L4+ |
| 270 | L1, L2, L3, L4, L4+ |
| 292 | — (snapshot lists only L4+_WeightedRAM) |

`[CODE]` — At `n = 292`, the threshold rule `n >= activation_scale` would activate **all five** memory levels, because 292 >= 0, 96, 120, 168, 192. However, the `SCALE_CONFIG_SNAPSHOT` for `n = 292` lists only `L4+_WeightedRAM` as active. This is a second hardcoded deviation from the activation rule. The comment in `get_active_memory` says results are sorted by `activation_scale` ascending, but the snapshot overrides the rule at the largest scale.

---

## 6. Scale Coupling / Dimensional Resonance

### 6.1 Resonance Strength Model

```typescript
get_dimensional_resonance(
  n: ScaleIndex,
  direction: "up" | "down" | "horizontal"
): ResonanceStrength
```

Returns one of `"Strong"`, `"Moderate"`, `"Weak"`, `"None"`.

`[PHIL]` — The source explicitly labels these strengths as "metaphorical labels for scale-coupling strength in information transfer." They are not derived from a field equation; they are a qualitative lookup table.

### 6.2 Resonance by Scale

| `n` | Up | Down | Horizontal | Interpretation |
|-----|----|------|------------|----------------|
| 0 | Strong | None | None | Planck scale couples strongly upward but has no smaller scale |
| 96 | Strong | Weak | Moderate | Nuclear scale couples up strongly, down weakly |
| 120 | Strong | Moderate | Strong | Atomic scale has strong horizontal coupling (chemical bonds) |
| 134 | Moderate | Strong | Strong | Molecular scale couples down strongly to atomic structure |
| 168 | Moderate | Moderate | Strong | Biological scale has strong internal/horizontal coupling |
| 192 | Moderate | Weak | Strong | Human scale has strong internal coupling, weak downward |
| 235 | Weak | Weak | Moderate | Planetary scale weakly couples in all directions |
| 250 | Weak | Weak | Moderate | Stellar scale weak coupling |
| 270 | Weak | None | Weak | Galactic scale weak horizontal, no upward |
| 292 | None | None | Weak | Cosmic scale is top boundary with only weak horizontal resonance |

### 6.3 Structural Observations

- **Upward coupling** weakens monotonically as `n` increases, reaching `"None"` at Cosmic scale.
- **Downward coupling** is `"None"` at both extremes (`n = 0` has no smaller scale; `n = 292` is the largest scale and is treated as having no downward information transfer).
- **Horizontal coupling** is strongest at intermediate scales (Atomic, Molecular, Biological, Human), which the ontology treats as scales where complex internal structure dominates.

`[PHIL]` — The resonance table encodes a philosophical intuition: information transfer is strongest within scales that have rich internal structure and weakest across the largest boundaries.

### 6.4 Dominant Constants

`DOMINANT_CONSTANTS_BY_SCALE` assigns an interpretive set of incommensurable constants to each scale:

| `n` | Dominant Constants |
|-----|-------------------|
| 0 | φ |
| 96 | φ |
| 120 | π |
| 134 | π, e |
| 168 | e |
| 192 | e, φ |
| 235 | π, √3 |
| 250 | π |
| 270 | π |
| 292 | φ |

`[PHIL]` — The source says these assignments are "interpretive mappings from the geometric ontology to scale-specific phenomena; not derivable from first principles." They function as labels, not as computational selectors (the code does not branch on dominant constants).

---

## 7. Robustness and Flaws

### 7.1 Robust Features

1. **Determinism.** All computations are pure functions of `n` and the input arrays. No random seeds, no `Math.random()`, no external state.
2. **Lookup-map acceleration.** `ScaleMapper` pre-builds `Map<FrameworkId, FrameworkCharacteristic>`, `Map<MemoryId, MemoryThreshold>`, and `Set<ScaleIndex>` in the constructor, giving O(1) membership testing and O(7) / O(5) linear scans for activation.
3. **Type narrowing on resonance.** `get_dimensional_resonance` explicitly asserts that the stored value is one of the four allowed strengths, throwing on corruption.
4. **Boundary handling.** `get_next_scale_up` and `get_next_scale_down` return `null` at the extremes rather than throwing.
5. **Exact-scale enforcement.** `get_config(n)` throws if `n` is not canonical, preventing silent use of interpolated or invalid configurations.
6. **Scale-invariant formulation.** All activation comparisons are ratios (`qrf(n) / qrf_fw` or `n >= activation_scale`), not dimensional comparisons.

### 7.2 Flaws and Inconsistencies

1. **Hardcoded snapshot contradicts activation rules.**
   - `SCALE_CONFIG_SNAPSHOT[292].active_frameworks` lists `F4_Geometric`, but `is_framework_active(292, "F4_Geometric")` returns `false` because `qrf(292) = 0.206221` is not greater than `qrf_fw(F4) = 0.932124`.
   - `SCALE_CONFIG_SNAPSHOT[292].active_memory` lists only `L4+_WeightedRAM`, but `is_memory_active(292, "L1_Pattern")` returns `true` because `292 >= 0`.
   - `[CODE]` — This means there are **two competing truths** in the codebase: the snapshot and the predicate. Consumers that call `get_config(292)` receive a different active-set than consumers that call `get_active_frameworks(292)` or `get_active_memories(292)`.

2. **Version discontinuity with `frameworks.ts`.**
   - `scale_mapper.ts` / `core/constants.ts` are v6.0; `frameworks.ts` is v13.
   - In v6.0 `types.ts`, `FrameworkInstance` requires `framework_id`, `partial_field`, `is_active`. The v13 framework classes define `name`, `scale`, `qrf_threshold`, `compute(input, field_state)` and do **not** implement the v6.0 interface.
   - Running `tsc --noEmit` on the extracted tree reports `TS2420` for every framework and memory class, plus `TS2739` for `ALL_FRAMEWORKS` and `ALL_MEMORIES` arrays.
   - `[CODE]` — The ScaleMapper cannot be used with the v13 framework classes without an adapter layer, because the type systems disagree on what a framework instance is.

3. **F4 activation anomaly at large scales.** Even if the snapshot were corrected, the threshold rule implies F4 (the geometric lattice framework) is active only for `n` such that `φ^(-n/89) > 0.932124`, i.e., `n < 13`. This would make F4 active only at `n = 0` among canonical scales, contradicting the ontology's intent that geometry operates at all scales. The snapshot may have been a deliberate hack to keep F4 active everywhere, but it is not documented as such.

4. **Length-frequency inconsistency.** `PLANCK_FREQUENCY` is hardcoded independently; `L(n) · f(n) ≠ c` in general. The ontology presents them as reciprocal but does not enforce reciprocity.

5. **QRF critical scale is arbitrary within the ontology.** `QRF_CRITICAL_SCALE = 89` is identified as `F₁₁`, but the choice of the 11th Fibonacci number as the denominator is not derived from any stated axiom. It is a structural choice, not a theorem.

6. **Physical constants are not truth-source labelled individually.** While the file-level epistemic tag is `[SPEC]`, individual entries such as `fine_structure_inverse: 137.036` or `cmb_temperature: 2.725` are `[OBSERVED]` values in mainstream physics. The code does not distinguish observed constants from speculative correspondences.

7. **`get_closest_config` admits non-canonical scales.** Although the ontology says interpolation is not meaningful, `get_closest_config(n)` accepts any `number`. This could allow downstream code to operate on non-canonical scales without understanding the epistemic caveat.

8. **No caching of `compute_qrf`.** `compute_qrf` recomputes `Math.pow(PHI, -n/89)` on every call. For repeated queries this is wasteful; the snapshot pre-computes values only for canonical scales.

### 7.3 Enhancement Path for the Scale Mapper

1. **Reconcile snapshot and predicate.** Either generate `SCALE_CONFIG_SNAPSHOT` deterministically from the activation rules, or document and justify every manual override.
2. **Version alignment.** Decide whether the project is v6.0 or v13. If v13, update `types.ts` (`FrameworkInstance` / `MemoryInstance` interfaces) to match the v13 class shape. If v6.0, port the v13 framework classes to the v6.0 interface.
3. **Add a truth-source label per physical constant.** Mark `[MATH FACT]` for π/φ/e, `[OBSERVED]` for measured constants, `[SPEC]` for the correspondences.
4. **Validate `get_closest_config` callers.** Ensure non-canonical scale usage is logged or restricted to debug/diagnostic paths.
5. **Memoize `compute_qrf` for repeated queries** or provide a pre-computed lookup for the framework threshold scales.
6. **Document the rationale for `QRF_CRITICAL_SCALE = 89`** if it is intended as more than a numerological choice.

---

## 8. Quick Reference: Scale Mapper API Surface

| Method | Input | Output | Notes |
|--------|-------|--------|-------|
| `get_config(n)` | `ScaleIndex` | `ScaleConfig` | Throws on non-canonical `n` |
| `get_closest_config(n)` | `number` | `ScaleConfig` | Nearest canonical scale |
| `get_all_configs()` | — | `readonly ScaleConfig[]` | Canonical order |
| `compute_qrf(n)` | `number` | `Float64` | `φ^(-n/89)` |
| `is_framework_active(n, fw)` | `number`, `FrameworkId` | `boolean` | `qrf(n) > qrf_fw` |
| `get_active_frameworks(n)` | `number` | `FrameworkId[]` | Sorted by `qrf_fw` desc |
| `is_memory_active(n, mem)` | `number`, `MemoryId` | `boolean` | `n >= activation_scale` |
| `get_active_memory(n)` | `number` | `MemoryId[]` | Sorted by `activation_scale` asc |
| `get_dimensional_resonance(n, dir)` | `ScaleIndex`, direction | `ResonanceStrength` | Lookup table |
| `compute_length(n)` | `number` | `Float64` | `ℓ_P · φⁿ` |
| `compute_frequency(n)` | `number` | `Float64` | `f_P · φ⁻ⁿ` |
| `compute_coherence(n)` | `number` | `Float64` | Alias for `compute_qrf` |
| `get_coherence_status(n)` | `number` | `COHERENT \| NEAR-CRITICAL` | Threshold `λ = 1/φ²` |

---

*End of scale_mapper_brainmap.md*
