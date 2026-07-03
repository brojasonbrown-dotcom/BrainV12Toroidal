# RHUFT v13 Engine — Support Modules Specialist Brainmap

> **Scope:** Deep analysis of the "support" modules extracted to `.tmp-extracted-brain/src/`.
> **Analyzed files:** `resonance_finder.ts`, `hardware_governor.ts`, `index.ts`, `test_engine.ts`, `test_robustness.ts`, plus connection context from `membrane_stabilizer.ts`.
> **Epistemic policy:** All source tags (`[SPEC]`, `[PHIL]`, `[MATH FACT]`, `[EST PHYS]`, `[OBSERVED]`) are preserved verbatim. No claim is strengthened beyond its source label.
> **Analysis date:** 2026-07-03.

---

## Executive Summary

The v13 engine is a deterministic, φ-scaled mathematical ontology runtime. The support modules examined here are not the core node/computation classes (`fractal_node.ts`, `fractal_node_engine.ts`, `frameworks.ts`, `scale_mapper.ts`), but they are load-bearing: they provide resonance search, hardware-adaptive resource capping, the public barrel, and the only verification tests.

The code is heavily commented with epistemic labels and explicitly targets IEEE-754 Float64 arithmetic. However, **the package does not currently compile**. `npm run build` emits **108 TypeScript errors** across the whole `src/` tree. The dominant failure mode is the use of `.ts` file extensions in import specifiers under `moduleResolution: "Node16"` (error TS5097), which affects every single internal import. Secondary failures include missing Node.js type definitions, framework/memory class implementations that do not satisfy their declared interfaces, unused locals/parameters under strict flags, and a few genuine type mismatches.

Consequently, `npm run test` cannot run from a clean build: the `dist/` files emitted by earlier (pre-strict) compilations still contain `.ts` import paths, so Node ESM resolution fails with `ERR_MODULE_NOT_FOUND` looking for `dist/index.ts`.

---

## 1. `resonance_finder.ts`

### 1.1 Responsibility and Public API

**Responsibility:** Search a `FractalNode` tree for harmonic alignments near the RHUFT canonical target of **144,000 Hz**. The class exposes two complementary search strategies:

1. `find_resonance(root_node)` — high-level API that either returns the absolute stable point (if it is within a log-φ tolerance of 144,000 Hz) or sweeps around the target and returns the best candidate.
2. `find_absolute_stable_point(root_node)` — computes a coherence-weighted geometric-mean frequency across all scales in the tree, then applies a membrane-energy correction.

**Public API surface:**

| Member | Type | Purpose |
|--------|------|---------|
| `target_frequency` | `readonly number` | Fixed at `144 * 1000 = 144000` Hz. `[SPEC]` |
| `base_frequency` | `readonly number` | Fixed at `144` Hz. `[SPEC]` |
| `find_resonance(root_node)` | method | Entry point: target-aligned search. |
| `find_absolute_stable_point(root_node)` | method | Computes the coherence-weighted stable point. |
| `sweep_frequencies(node, min, max, steps)` | method | Log-space geometric sweep. |
| `measure_stability(node, frequency)` | method | Computes geometric-mean coherence for scales that satisfy `is_golden_harmonic`. |
| `compute_harmonic_series(base_freq, num_harmonics)` | method | Generates φ-attenuated harmonics `f_k = f_0 · φ^(-k)`. `[SPEC]` |
| `is_golden_harmonic(frequency, scale_n)` | method | Tests whether `frequency ≈ f_P · φ^(-n) · m` for integer `m`. `[SPEC]` |

All public methods return plain objects or arrays; none are async. The class has no side effects on the input tree.

### 1.2 Algorithm Overview

**Golden-harmonic test (`is_golden_harmonic`):**
- Compute `log(f_scale) = log(f_P) - n · log(φ)`.
- Compute `log(m) = log(frequency) - log(f_scale)`.
- Round `m` to the nearest integer and check deviation `|m - round(m)| ≤ 1/(2φ)`. `[SPEC]`
- Guards: returns `false` for non-finite, zero, or negative frequencies.

**Stability metric (`measure_stability`):**
- Traverse the node tree by DFS using both `children` and `parent` links, deduplicated by `scale` (not by node id) in one method and by `id` in another.
- For every scale that passes `is_golden_harmonic`, collect the node's `state.coherence`.
- Return the geometric mean in log-space: `exp( mean( log(coherence_i) ) )`. `[SPEC]`

**Absolute stable point (`find_absolute_stable_point`):**
- Collect all unique scales in the tree (`_collect_scales`), sorted ascending.
- Compute `log(f_stable) = Σ [ C(n) · log(f(n)) ] / Σ C(n)` where `C(n) = coherence(n)` and `f(n) = f_P · φ^(-n)`. `[SPEC]`
- For every scale that has a node with a membrane, accumulate `MembraneStabilizer.compute_membrane_energy` and `compute_closure_deviation`.
- Apply an energy penalty: `energy_penalty = log(φ) · (mean closure deviation)` if membrane energy is positive. `[SPEC]`
- Return the corrected frequency with stability, participating scales, and a 12-entry harmonic series.

**Target-aligned search (`find_resonance`):**
- Compute the absolute stable point first.
- If `|log(stable) - log(target)| ≤ log(φ)`, return it.
- Otherwise sweep `[target/φ, target·φ]` in 144 log-spaced steps, pick the frequency with maximum stability, and re-measure.

### 1.3 Robust Features

- **Log-space arithmetic** throughout, explicitly motivated by IEEE-754 Float64 overflow/underflow concerns.
- **Input guards** on `is_golden_harmonic` and `sweep_frequencies` for non-finite, zero, and negative values.
- **Reversed-range tolerance** in `sweep_frequencies` (`safe_min`/`safe_max`).
- **Subnormal guard** `1e-300` before taking `Math.log` of coherence values.
- **Cycle-safe traversal** in `_collect_scales` via a `Set<string>` of visited node ids (added in a `[FIX]` comment), although other traversal methods still deduplicate by scale.
- **NaN/Infinity guards** on membrane energy and corrected log frequency before exponentiation.

### 1.4 Flaws, Inefficiencies, and Failure Modes

| # | Flaw | Severity | Detail |
|---|------|----------|--------|
| 1 | **Unused/phantom imports and variables** | Build-blocking under strict | `qrf_attenuation`, `PI`, `LAMBDA_VAL`, `MembraneGeometry`, and the intermediate `measure` in `find_absolute_stable_point` are declared but never read. These trigger `noUnusedLocals`. |
| 2 | **`.ts` extension imports** | Build-blocking | `import ... from "./types.ts"` and `import { MembraneStabilizer } from "./membrane_stabilizer.ts"` fail under `moduleResolution: "Node16"` (TS5097). |
| 3 | **Scale deduplication inconsistency** | Logical | `measure_stability` deduplicates by `scale`; `_collect_scales` deduplicates by `id`. If two nodes share a scale (e.g., siblings at the same scale), `measure_stability` only sees the first one visited, while `_collect_scales` collects the scale once. This is usually harmless but makes the two algorithms subtly inconsistent. |
| 4 | **`participating_scales` typed as plain `number[]`** | Build-blocking | The `ResonanceConvergence` interface requires `readonly ScaleIndex[]`; `resonance_finder.ts` returns plain `number[]` (TS2322). |
| 5 | **Membrane energy correction is under-specified** | Scientific/algorithmic | The penalty subtracts `log(φ) · mean_closure_deviation` from `log(f_stable)` only when `total_membrane_energy > 0`. The formula mixes a log-frequency shift with a dimensionless closure deviation without unit analysis. The `[SPEC]` label is appropriate. |
| 6 | **Integer harmonic test tolerance is generous** | Algorithmic | Tolerance `±1/(2φ) ≈ ±0.309` means a wide band of frequencies count as golden harmonics. This is intentional per source `[SPEC]`, but it inflates `convergence_depth`. |
| 7 | **`_find_node_at_scale` does not deduplicate by id** | Robustness | If the tree contains multiple nodes at the same scale, the first one found is used; visited set is keyed by `scale`, so parent links can cause revisits. |
| 8 | **No caching of tree traversals** | Performance | Every call to `measure_stability`, `_collect_scales`, and `_find_node_at_scale` re-traverses the entire tree. `find_resonance` can traverse the tree four or more times. |
| 9 | **Hard-coded sweep step count** | Maintainability | 144 steps and 12 harmonics are magic numbers tied to `F_12` and the dozenal motif. They are not configurable. |

### 1.5 Connections to Other Modules

- **Imports from `types.ts`:** Uses `RHUFT_CONSTANTS`, `PLANCK_FREQUENCY`, `qrf_attenuation`, `coherence`, `LAMBDA` (some unused), plus type-only imports for `FractalNode`, `ResonanceConvergence`, `MembraneGeometry`.
- **Imports `MembraneStabilizer` from `membrane_stabilizer.ts`:** Calls `compute_membrane_energy` and `compute_closure_deviation` on nodes that carry a membrane.
- **Consumed by `fractal_node_engine.ts`:** The engine instantiates `ResonanceFinder` as `this.resonance_finder` and calls `find_resonance` during `initialize()` and every `tick()`. It also exposes `engine.find_stable_point()` which delegates to `find_absolute_stable_point`.
- **Consumed by `test_engine.ts` and `test_robustness.ts`:** Both verify that returned frequencies and stability scores are finite and that harmonic series have the expected length.

### 1.6 Enhancement Opportunities

1. **Add a tree-caching visitor** so repeated traversals in a single `find_resonance` call share one `scale → node` map.
2. **Make sweep/harmonic counts configurable** via constructor options while preserving the `F_12` defaults.
3. **Unify traversal deduplication** on node `id` everywhere to prevent scale-keyed omissions.
4. **Validate the membrane-energy correction** with a dimensionally consistent derivation or clearly mark it as a heuristic `[SPEC]` placeholder.
5. **Export the golden-harmonic tolerance** as a configurable parameter to support stricter convergence criteria.

---

## 2. `hardware_governor.ts`

### 2.1 Responsibility and Public API

**Responsibility:** Detect runtime hardware conservatively and enforce a deterministic **~35% resource budget** (`target_usage = 0.35`). The class decides whether the fractal tree should grow, shrink, or maintain its current depth based on estimated RAM and CPU usage. `[SPEC]`

**Public API surface:**

| Member | Type | Purpose |
|--------|------|---------|
| `target_usage` | `readonly Float64` | Fixed at `0.35`. `[SPEC]` |
| `detect_hardware()` | method | Re-detects platform and recomputes budget. |
| `compute_budget()` | method | Returns the cached `ResourceBudget`. |
| `estimate_usage(total_nodes)` | method | Returns `{ ram_bytes, cpu_percent }` estimates. |
| `should_scale(current_usage, budget)` | method | Returns `ScalingDecision` (`grow`/`shrink`/`maintain`) or null. |
| `specs` | getter | Read-only `HardwareSpecs`. |
| `budget` | getter | Read-only `ResourceBudget`. |

### 2.2 Algorithm Overview

**Hardware detection (`_detect_hardware`):**
- Node.js: if `process.memoryUsage` exists, `totalRam = max(heapTotal, 8 GB)`. `[SPEC]`
- Browser: if `navigator.hardwareConcurrency` exists, use it for `cpu_cores`. `[SPEC]`
- `available_ram_bytes = floor(total_ram_bytes · 0.35)`.
- `cpu_max_frequency_hz` is hard-coded to `3.0e9` (3 GHz conservative estimate). `[SPEC]`

**Budget computation (`_compute_budget`):**
- `maxNodes = floor( (available_ram / BYTES_PER_NODE) · 0.35 )` where `BYTES_PER_NODE = 64 KB`. `[SPEC]`
- `rawDepth = floor(log2(maxNodes + 1)) - 1`.
- `maxDepth` clamped to `[1, 7]`. `[SPEC]`

**Usage estimation (`estimate_usage`):**
- `ram_bytes = total_nodes · BYTES_PER_NODE`.
- `cpu_percent = (total_nodes · OPS_PER_NODE) / (cpu_cores · cpu_max_frequency_hz) · 100`, clamped to `[0, 100]`. `[SPEC]` (a `[FIX]` separated CPU from RAM, which were previously the same value).

**Scaling decision (`should_scale`):**
- `ramRatio = ram_bytes / target_ram_bytes`.
- `cpuRatio = cpu_percent / target_cpu_percent`.
- `shrink` if either ratio > 1.0.
- `grow` if both ratios < 0.5.
- Otherwise `maintain`.
- Target depth is clamped to `[1, 7]`.

### 2.3 Robust Features

- **Cross-platform detection with safe `typeof` checks** — does not throw if `process` or `navigator` is absent.
- **Deterministic fallbacks:** 8 GB RAM and 4 CPU cores if detection fails. `[SPEC]`
- **CPU/RAM separation:** A previous bug that reported RAM% as CPU% is fixed; CPU is now modeled independently by `OPS_PER_NODE`. `[FIX]`
- **Depth clamping** prevents unbounded tree growth or degenerate depth-0 trees.
- **Usage clamping** ensures `cpu_percent` stays in `[0, 100]`.

### 2.4 Flaws, Inefficiencies, and Failure Modes

| # | Flaw | Severity | Detail |
|---|------|----------|--------|
| 1 | **Unused import `PHI_INV`** | Build-blocking under strict | `import { PHI, PHI_INV } from "./core/constants.ts"` triggers TS6192 because `PHI_INV` is never used. |
| 2 | **`.ts` extension imports** | Build-blocking | Same TS5097 issue as other modules. |
| 3 | **Missing Node.js types** | Build-blocking | References to `process.memoryUsage` and `process` fail with TS2580 because `@types/node` is not installed. |
| 4 | **`cpu_max_frequency_hz` is a hard-coded guess** | Accuracy | 3 GHz is a rough conservative estimate; no actual clock detection is performed. `[SPEC]` acknowledges this. |
| 5 | **`OPS_PER_NODE = 500000` is arbitrary** | Accuracy | The per-node operation count is not benchmarked; it is a placeholder. `[SPEC]` |
| 6 | **Double application of `target_usage`** | Algorithmic | `available_ram_bytes` is already `totalRam · 0.35`, then `maxNodes` multiplies by `0.35` again. The effective cap is ~12.25% of total RAM, not 35%. The source comment says "~35%" but the math does not match. |
| 7 | **Heap-based total RAM is misleading** | Robustness | `process.memoryUsage().heapTotal` is not system RAM; on a machine with 32 GB physical RAM but a 4 GB V8 heap, the governor will budget far less than intended. |
| 8 | **No async/callback API for real measurements** | Feature gap | The governor never samples actual CPU or GC pressure; it relies entirely on static estimates. |
| 9 | **`should_scale` returns `maintain` rather than `null`** | Minor | The docstring says it returns "`ScalingDecision` record, or null if no action is needed," but it always returns a record. |

### 2.5 Connections to Other Modules

- **Imports from `types.ts`:** Type-only imports for `Float64`, `HardwareSpecs`, `ResourceBudget`, `ScalingDecision`.
- **Imports from `core/constants.ts`:** `PHI`, `PHI_INV` (the latter unused).
- **Consumed by `fractal_node_engine.ts`:** Instantiated as `this.hardware_governor`. Used in `initialize()` to cap `max_depth` and in every `tick()` to decide whether to grow/shrink/maintain the tree.
- **Consumed by tests:** `test_robustness.ts` Test 1 specifically exercises the CPU/RAM separation, zero-node and extreme-node decisions, and depth bounds.

### 2.6 Enhancement Opportunities

1. **Fix the double 0.35 multiplication** so the budget actually targets 35% of available resources, or document that the effective target is 12.25%.
2. **Replace heap-based RAM detection** with `os.totalmem()` when available, falling back to `heapTotal` only as a last resort.
3. **Add runtime measurement hooks** (e.g., elapsed CPU time per tick, actual RSS) so scaling decisions are based on measured utilization rather than static models.
4. **Make `OPS_PER_NODE` and `BYTES_PER_NODE` configurable** and add a calibration routine.
5. **Install `@types/node`** or guard `process`/`navigator` access with proper type narrowing to satisfy TS2580.

---

## 3. `index.ts`

### 3.1 Responsibility and Public API

**Responsibility:** Barrel file — single public entry point that re-exports types, constants, classes, and framework/memory instances. The file has no runtime logic of its own. It is the only module downstream consumers are expected to import from.

**Public API surface (grouped):**

| Group | Exports |
|-------|---------|
| **Types** | `Float64`, `ScaleIndex`, `FrameworkId`, `MemoryId`, `ResonanceStrength`, `CoherenceStatus`, `ConstantSymbol`, `GeometricField`, `PhaseAngle`, `ComplexAmplitude`, `DimensionalResonance`, `ScaleConfig`, `ScaleConfigLocal`, `FrameworkCharacteristic`, `MemoryThreshold`, `FrameworkInstance`, `MemoryInstance`, `FractalNodeState`, `FractalTreeStats`, `NodeId`, `ComputeOptions`, `MasterEquationTerm`, `MasterEquationClosure`, `PropagationPacket`, `MembraneGeometry`, `MembraneStabilizationResult`, `ResonanceConvergence`, `FlowPacket`, `ToroidalFlowChannel`, `HardwareSpecs`, `ResourceBudget`, `ScalingDecision`, `EngineConfig`, `EngineState`, `EngineTickResult` |
| **Constants** | `PHI`, `PHI_INV`, `PHI_SQUARED`, `PHI_CUBED`, `PHI_NEG2`, `PHI_NEG3`, `PHI_NEG5`, `PHI_NEG8`, `PI`, `TWO_PI`, `GOLDEN_ANGLE_RAD`, `EULER`, `SILVER_RATIO`, `SQRT2`, `SQRT3`, `PLANCK_LENGTH`, `PLANCK_FREQUENCY`, `SPEED_OF_LIGHT`, `COHERENCE_THRESHOLD`, `CLOSURE_COUPLING`, `QRF_CRITICAL_SCALE`, `MASTER_EQUATION_N`, `SCALE_INDICES`, `SCALE_NAMES`, `FRAMEWORK_CHARACTERISTICS`, `MEMORY_THRESHOLDS`, `DOMINANT_CONSTANTS_BY_SCALE`, `DIMENSIONAL_RESONANCE_BY_SCALE`, `PHYSICAL_CONSTANTS_BY_SCALE`, `SCALE_CONFIG_SNAPSHOT` |
| **Classes** | `FractalNode`, `ScaleMapper`, `MembraneStabilizer`, `ResonanceFinder`, `InterdimensionalFlow`, `HardwareGovernor`, `FractalNodeEngine` |
| **Registry helpers** | `ALL_FRAMEWORKS`, `ALL_MEMORIES`, `get_active_frameworks`, `get_active_memories` |
| **Framework classes** | `F8_SubPlanckian`, `F4_Geometric`, `F5_ColorMusic`, `F6_Hebrew`, `F7_Thermodynamic`, `F1_Septenary`, `F9_Hypergalactic` |
| **Memory classes** | `L1_Pattern`, `L2_Hebbian`, `L3_Kuramoto`, `L4_Sensory`, `L4p_WeightedRAM` |

### 3.2 Algorithm Overview

No algorithms. The file is a pure re-export barrel. It does, however, encode the intended dependency graph:

```
index.ts
├── types.ts (types)
├── core/constants.ts (constants)
├── fractal_node.ts → ScaleMapper, MembraneStabilizer, ResonanceFinder, etc.
├── scale_mapper.ts
├── membrane_stabilizer.ts
├── resonance_finder.ts
├── interdimensional_flow.ts
├── hardware_governor.ts
├── fractal_node_engine.ts
└── frameworks.ts
```

### 3.3 Robust Features

- **Single entry point** simplifies downstream usage and enforces a minimal public surface.
- **Separation of type and value exports** — value exports and `export type` are distinguished.
- **Backward compatibility intent:** Re-exports `ScaleConfigLocal` and other compatibility aliases from `types.ts`.

### 3.4 Flaws, Inefficiencies, and Failure Modes

| # | Flaw | Severity | Detail |
|---|------|----------|--------|
| 1 | **`.ts` extension imports** | Build-blocking | All imports use `.ts` extensions, producing TS5097 under `moduleResolution: "Node16"`. |
| 2 | **Re-exports broken framework/memory classes** | Build-blocking / Runtime risk | `frameworks.ts` classes do not satisfy `FrameworkInstance`/`MemoryInstance` interfaces, so the barrel exposes types that cannot be safely used as declared. |
| 3 | **No runtime validation** | Maintainability | The barrel trusts that all re-exported modules compile; it does not provide a health check or version gate. |
| 4 | **Tight coupling to implementation layout** | Architecture | If the internal file layout changes, the barrel must be updated. There is no `internal/` boundary. |

### 3.5 Connections to Other Modules

- **Upstream dependency of all consumers:** `test_engine.ts`, `test_robustness.ts`, and any external code import exclusively from `./index.ts`.
- **Downstream dependency on every engine module:** Changes in any re-exported module ripple through the barrel's type surface.
- **Runtime failure path:** Because the barrel re-exports `frameworks.ts`, the broken framework/memory class implementations propagate to tests that iterate `ALL_FRAMEWORKS` and `ALL_MEMORIES`.

### 3.6 Enhancement Opportunities

1. **Switch imports to extensionless specifiers** (e.g., `./types`) for Node16 compatibility, or enable `allowImportingTsExtensions` and a bundler.
2. **Add a runtime `version` export and a health-check function** that validates the engine can instantiate without throwing.
3. **Split the barrel into sub-barrels** (`engine`, `math`, `frameworks`) once the module count grows.
4. **Do not re-export broken class instances until `frameworks.ts` satisfies its interfaces.**

---

## 4. `test_engine.ts`

### 4.1 Responsibility and Public API

**Responsibility:** Smoke-test / verification script. It is not a formal test framework; it prints a formatted report to stdout and relies on a human (or the absence of thrown exceptions) to judge success. It is the target of `npm run test`.

**Public API surface:** None. The file runs at the top level and uses `console.log` for all output. It exits implicitly at end-of-script.

### 4.2 Algorithm Overview

The script executes 13 numbered report sections in sequence:

1. Print core constants (`PHI`, `1/PHI`, `φ²`, `1/φ²`, `1/(φ·π)`).
2. Iterate 10 canonical scales through `ScaleMapper`.
3. List `ALL_FRAMEWORKS` (7 frameworks).
4. List `ALL_MEMORIES` (5 memory subsystems).
5. Create a standalone `FractalNode` at `n=192` and print its state and membrane.
6. Compute `get_master_equation_closure()` for the human node.
7. Run `MembraneStabilizer.stabilize()` on the closure's total field.
8. Run `ResonanceFinder.find_resonance()` and `find_absolute_stable_point()`.
9. Print `HardwareGovernor` budget.
10. Initialize a `FractalNodeEngine`.
11. Run 5 engine ticks.
12. Print final engine state.
13. Run `engine.find_stable_point()`.

### 4.3 Robust Features

- **End-to-end coverage:** Touches constants, mapper, frameworks, memories, node, membrane, resonance, governor, engine, and tick loop.
- **Deterministic inputs:** No randomness; output is reproducible if the engine compiles.
- **Formatted human-readable output** with section headers and summary statistics.

### 4.4 Flaws, Inefficiencies, and Failure Modes

| # | Flaw | Severity | Detail |
|---|------|----------|--------|
| 1 | **Not a real test harness** | Maintainability | It has no assertions, no pass/fail exit code, and cannot be integrated into CI without external log parsing. |
| 2 | **`.ts` extension import** | Build-blocking | `import ... from "./index.ts"` fails TS5097. |
| 3 | **Unused imports** | Build-blocking | `InterdimensionalFlow` and `SCALE_CONFIG_SNAPSHOT` are imported but never used. |
| 4 | **Unused variable `stats`** | Build-blocking | `const stats = humanNode.get_tree_stats()` is never read. |
| 5 | **Assumes `FrameworkInstance`/`MemoryInstance` have `name`/`scale`** | Build-blocking | Lines 64 and 69 access `.name` and `.scale` on registry instances, but the declared interfaces do not include these properties. This is an interface mismatch. |
| 6 | **Hard-coded array indices** | Fragility | `closure.terms[0]`, `closure.terms[13]`, and `validData[i]` assume length 28 and N=13. If constants change, the script may throw. |
| 7 | **No failure handling** | Robustness | If any step throws, the whole script crashes; there is no partial-report mode. |
| 8 | **`npm run test` points to it instead of `test_robustness.ts`** | Test coverage | The more comprehensive `test_robustness.ts` is not invoked by the `test` script. |

### 4.5 Connections to Other Modules

- **Imports exclusively from `./index.ts`** — exercises the public barrel.
- **Depends on every major subsystem:** Constants, `ScaleMapper`, `FractalNode`, `MembraneStabilizer`, `ResonanceFinder`, `HardwareGovernor`, `FractalNodeEngine`.
- **Does not exercise `InterdimensionalFlow`** despite importing it.

### 4.6 Enhancement Opportunities

1. **Convert to a real test file** using the built-in `node:test` runner or a lightweight assertion library.
2. **Add explicit assertions and a non-zero exit code on failure.**
3. **Remove unused imports** and replace hard-coded indices with constants from `MASTER_EQUATION_N`.
4. **Update `package.json` `test` script** to run `test_robustness.ts` (once build works) or both scripts.

---

## 5. `test_robustness.ts`

### 5.1 Responsibility and Public API

**Responsibility:** The actual robustness verification suite. It implements a tiny inline assertion framework and runs 13 test groups covering numerical stability, determinism, memory boundedness, input validation, and framework/memory determinism. It exits with code `1` if any assertion fails.

**Public API surface:** None. Top-level script with `passCount`/`failCount` and helper functions `assert`, `assertApprox`, `assertFinite`.

### 5.2 Algorithm Overview

The 13 test groups are:

1. **HardwareGovernor CPU/RAM separation** — verifies 0-node usage is zero, 1000-node RAM is exactly `1000·64·1024` bytes, CPU% ≠ RAM%, and grow/shrink decisions.
2. **FractalNode scale validation** — all 10 canonical scales succeed; invalid scale 999 throws.
3. **FractalNode stabilization state consistency** — coherence and energy_density remain finite and in expected ranges after `stabilize()`.
4. **Master equation closure integrity** — 14 terms, first amplitude `1.0`, last amplitude `φ^(-13)`, fields are `Float64Array` of length 28.
5. **Membrane geometry consistency** — aspect ratio, winding number, circumferences match torus formulas.
6. **InterdimensionalFlow pruning** — 100 packets, then 50, prune by age, prune all.
7. **ResonanceFinder numerical stability** — negative/zero/NaN/Infinity frequencies return false; sweeps handle reversed ranges; results are finite.
8. **Engine tick determinism** — two identically configured engines produce identical initial states and 5 tick coherence values.
9. **Engine memory boundedness** — 20 ticks keep node count ≤ `budget.max_nodes` and RAM < 10 MB.
10. **Engine `process()` validation** — valid `Float64Array(28)` succeeds; empty/null inputs throw.
11. **Framework compute determinism** — every framework returns identical finite output for identical input.
12. **Memory subsystem compute determinism** — every memory class returns identical finite recall after identical store.
13. **ScaleMapper boundary cases** — extreme scales clamp to Planck/Cosmic; framework/memory counts match expected values.

### 5.3 Robust Features

- **Self-contained assertion framework** — no external test dependency.
- **Determinism verification** — compares two independent engine instances bit-for-bit.
- **Boundary-case coverage** — negative frequencies, zero steps, reversed ranges, invalid scales, empty/null inputs.
- **Memory boundedness check** — asserts RAM < 10 MB over 20 ticks.
- **Exit-code reporting** — returns `process.exit(1)` on failure.

### 5.4 Flaws, Inefficiencies, and Failure Modes

| # | Flaw | Severity | Detail |
|---|------|----------|--------|
| 1 | **`.ts` extension import** | Build-blocking | Same TS5097 issue. |
| 2 | **Unused imports** | Build-blocking | `MembraneStabilizer`, `ALL_MEMORIES`, `SCALE_CONFIG_SNAPSHOT` imported but unused. |
| 3 | **Unused variables** | Build-blocking | `node` in Test 2, `maxNodes`/`minNodes` in Test 9 trigger `noUnusedLocals`. |
| 4 | **Unused `@ts-expect-error` directive** | Build-blocking | One of the two `@ts-expect-error` comments does not suppress an error (TS2578). |
| 5 | **Missing Node.js types** | Build-blocking | `process.exit(1)` triggers TS2580 because `@types/node` is absent. |
| 6 | **Tautological assertions** | Test quality | `assert("stabilize updates coherence", postCoherence !== preCoherence || postCoherence === preCoherence, ...)` is always true. The intent was likely to check finiteness/range, but the assertion is vacuous. |
| 7 | **Framework/memory interface mismatch** | Build-blocking / Runtime risk | Test 11 iterates `ALL_FRAMEWORKS` and calls `.compute` and `.name`, which do not exist on the declared `FrameworkInstance` interface. Test 12 uses `.name`, `.store`, `.recall` on memory instances that do not satisfy `MemoryInstance`. |
| 8 | **Implicit `any` parameters** | Build-blocking | `out1.every((v, i) => ...)` in Test 11 infers `any` for `v` and `i` under strict mode (TS7006). |
| 9 | **Hard-coded field length 28** | Fragility | Tests assume `MASTER_EQUATION_N = 13` without importing the constant. |
| 10 | **No isolated module tests** | Coverage gap | Tests are integration-level; individual functions like `sweep_frequencies` are only smoke-tested. |

### 5.5 Connections to Other Modules

- **Imports from `./index.ts`** — same public barrel as `test_engine.ts`.
- **Specifically exercises:** `HardwareGovernor`, `FractalNode`, `ScaleMapper`, `ResonanceFinder`, `InterdimensionalFlow`, `FractalNodeEngine`, all frameworks, all memory classes.
- **Not invoked by `package.json` `test` script** — currently only `test_engine.ts` is.

### 5.6 Enhancement Opportunities

1. **Add `@types/node`** to satisfy `process.exit` typing.
2. **Fix or remove tautological assertions** and add meaningful convergence checks.
3. **Import `MASTER_EQUATION_N` and derive field length** from it instead of hard-coding 28.
4. **Add per-module unit tests** for `ResonanceFinder`, `HardwareGovernor`, and `InterdimensionalFlow` in isolation.
5. **Make the test script the default `npm test`** and demote `test_engine.ts` to a demo/example.
6. **Resolve framework/memory interface mismatches** before relying on `ALL_FRAMEWORKS`/`ALL_MEMORIES` in tests.

---

## 6. `membrane_stabilizer.ts` — Connection Context

This module is analyzed only briefly because it is a dependency of `resonance_finder.ts` and `fractal_node_engine.ts`, not one of the primary targets.

### 6.1 Responsibility and Public API

**Responsibility:** Create toroidal membrane geometries for a scale and apply a gentle closure correction to a field state. The membrane is described as a "DNA-like" boundary condition that stabilizes the geometric field. `[PHIL]`

**Public API surface:**

| Member | Type | Purpose |
|--------|------|---------|
| `create_membrane(scale_n)` | static method | Returns a `MembraneGeometry` for scale `n`. `[SPEC]` |
| `stabilize(field_state, membrane)` | method | Computes closure deviation, applies correction, returns result. `[SPEC]` |
| `compute_closure_deviation(field_state, membrane)` | method | Discrete approximation of `∮∇Ψ·dS / (A · |Ψ|_avg)`. `[SPEC]` |
| `apply_closure_correction(...)` | method | Applies `ΔΨ = -∇Ψ · φ^(-k) · gain · (threshold - coherence)`. `[SPEC]` |
| `compute_membrane_energy(field_state, membrane)` | method | Returns `E_membrane = κ · (∮∇Ψ·dS)² / A`. `[SPEC]` |

### 6.2 Algorithm Overview

- Geometry: torus with `R = L(n)·φ`, `r = L(n)`, `aspect_ratio = φ`, `winding_number = φ`. `[SPEC]`
- Closure correction uses a golden-section gain `g = 1/φ` and φ-scale-proportional attenuation. `[SPEC]`
- Energy formula uses `κ = 1/(φ·π)`. `[SPEC]`

### 6.3 Robust Features

- Empty-field guards return zero deviation/energy for length-0 arrays.
- Toroidal wrap-around in `apply_closure_correction`.
- Subnormal guard `1e-300` before division.

### 6.4 Flaws and Connections

| Flaw | Detail |
|------|--------|
| **Interface mismatch** | `create_membrane` returns an object missing `curvature_coupling` and `boundary_field`, which the `MembraneGeometry` interface requires. This is a build-blocking TS2739 error. |
| **Unused constant imports** | `KAPPA_VAL` and `LAMBDA_VAL` are imported but never used (the code uses `KAPPA`/`LAMBDA` directly from `types.ts` or local constants). |
| **`.ts` extension imports** | Same TS5097 issue. |
| **Connection to `resonance_finder.ts`** | `ResonanceFinder.find_absolute_stable_point` instantiates `MembraneStabilizer` and calls `compute_membrane_energy` and `compute_closure_deviation` for every node that has a membrane. The membrane object it receives from `FractalNode` comes from `createDefaultMembrane` in `fractal_node.ts`, not from `MembraneStabilizer.create_membrane`, so the missing interface fields may or may not be present at runtime depending on which path created the node. |
| **Connection to `fractal_node_engine.ts`** | The engine owns `this.membrane_stabilizer` and calls it during tick stabilization. |

### 6.5 Enhancement Opportunities

1. Align `create_membrane` with the full `MembraneGeometry` interface (add `curvature_coupling` and `boundary_field`).
2. Remove unused local constants `KAPPA_VAL` and `LAMBDA_VAL` or use them consistently.
3. Harmonize membrane creation between `MembraneStabilizer.create_membrane` and `FractalNode.createDefaultMembrane` so there is a single source of truth for torus geometry.

---

## 7. Test Baseline

### 7.1 Test Inventory

| File | Kind | Assertions / Sections | Approx. Count |
|------|------|----------------------|---------------|
| `test_engine.ts` | Smoke / demo script | 13 numbered report sections, no formal assertions | ~30 individual `console.log` lines |
| `test_robustness.ts` | Inline assertion suite | 13 test groups | ~60 `assert`/`assertApprox`/`assertFinite` calls |

**Total distinct test groups:** 26 (13 smoke sections + 13 robustness groups).
**Total individual checks:** roughly 90–100 when counting manual `console.log` validations in `test_engine.ts`.

### 7.2 What They Cover

- **Constants and scale mapping:** `PHI`, π-derived values, 10 canonical scales, QRF attenuation, coherence status.
- **Framework and memory registry:** Listing of 7 frameworks and 5 memory subsystems.
- **Node construction:** `FractalNode.createAtScale(192)` and tree stats.
- **Master equation:** Closure terms, amplitude decay, field arrays.
- **Membrane stabilization:** Geometry consistency, closure deviation, energy.
- **Resonance search:** 144,000 Hz target, absolute stable point, golden-harmonic guards, sweep behavior.
- **Hardware governor:** Budget, usage estimation, CPU/RAM separation, scaling decisions, depth bounds.
- **Engine integration:** Initialization, tick loop, determinism, memory boundedness, `process()` validation.
- **Framework/memory determinism:** Identical inputs produce identical outputs.

### 7.3 What They Do NOT Cover

- **Formal unit tests** for `ResonanceFinder`, `HardwareGovernor`, or `InterdimensionalFlow` in isolation.
- **Error-message verification** beyond "throws / does not throw."
- **Performance regression benchmarks.**
- **Edge cases in tree topology:** cycles, orphaned nodes, very deep trees.
- **Numerical accuracy** of the master equation against an analytic reference.
- **Cross-platform hardware detection** (tests run only on the current platform).

### 7.4 Why the Build Currently Fails

Running `npm run build` in `.tmp-extracted-brain` produces **108 TypeScript errors**. The top categories are:

| Error Code | Count | Meaning |
|------------|-------|---------|
| TS5097 | 30 | Import paths end with `.ts`, which is only allowed when `allowImportingTsExtensions` is enabled. The project uses `moduleResolution: "Node16"` and `module: "Node16"`, so extensionless specifiers are required. |
| TS6133 / TS6196 | ~22 | Unused imports, unused locals, unused parameters (`noUnusedLocals`, `noUnusedParameters`). |
| TS2420 / TS2739 | ~14 | Framework and memory classes do not implement `FrameworkInstance`/`MemoryInstance` interfaces (missing `framework_id`, `partial_field`, `is_active`, `memory_id`, `memory_field`). |
| TS2580 | 4 | `process` is referenced but `@types/node` is not installed. |
| TS2322 | 2 | `number[]` returned where `readonly ScaleIndex[]` is expected (in `resonance_finder.ts`). |
| TS2339 | 5 | Access to `.name`, `.scale`, `.compute`, `.coherence` on interfaces that do not declare them. |
| TS7006 | 2 | Implicit `any` in `every` callbacks. |
| TS2578 | 1 | Unused `@ts-expect-error` directive. |

**Why `npm run test` also fails:**

The `test` script runs `node --experimental-specifier-resolution=node dist/test_engine.js`. Because the build fails, `dist/` is stale (from an earlier, less strict compilation). The stale files still contain `import ... from "./index.ts"`, so Node ESM resolution throws:

```
Error [ERR_MODULE_NOT_FOUND]: Cannot find module '...\.tmp-extracted-brain\dist\index.ts'
```

Node expects `./index.js` in `dist/`, not `./index.ts`.

### 7.5 Minimal Fix Path

To make the package compile and run tests, the following are necessary (not necessarily sufficient):

1. **Enable `allowImportingTsExtensions`** or remove `.ts` extensions from all imports.
2. **Install `@types/node`** as a devDependency.
3. **Clean up unused imports/locals** across all files, or relax `noUnusedLocals`/`noUnusedParameters`.
4. **Fix interface implementations** in `frameworks.ts` so classes satisfy `FrameworkInstance` and `MemoryInstance`.
5. **Fix `ResonanceConvergence.participating_scales`** to be `ScaleIndex[]` (cast or filter).
6. **Fix `MembraneGeometry` creation** to include `curvature_coupling` and `boundary_field`.
7. **Recompile** and update `package.json` `test` to run `test_robustness.ts` (or both).

---

## 8. Cross-Cutting Observations

### 8.1 Epistemic Hygiene

The source files rigorously tag claims:

- `[SPEC]` dominates mathematical/algorithmic constructions (φ-scaled laws, golden harmonics, 35% heuristic).
- `[PHIL]` labels metaphorical interpretations (DNA-like membrane, toroidal closure, interdimensional flow).
- `[MATH FACT]`/`[EST PHYS]` are rare in these support modules; most physics correspondences are marked `[SPEC]` or `[PHIL]`.
- `[FIX]` comments document prior bugs and their corrections.

No observed instance of a `[SPEC]` claim being promoted to `[EST PHYS]` or `[MATH FACT]`.

### 8.2 Determinism

All modules are deterministic by design: no `Math.random()`, no date/time dependence, no unseeded PRNG. The only external inputs are hardware-detection globals (`process.memoryUsage`, `navigator.hardwareConcurrency`), and those have deterministic fallbacks.

### 8.3 Float64 Consciousness

Every significant computation is annotated with "IEEE-754 Float64 (≈15 significant digits)." The code consistently uses `Float64Array` for field states and log-space arithmetic for multiplicative cascades. This is a strong stylistic consistency.

### 8.4 Architecture Alignment with RHUFT v6.0 Rules

From `AGENTS.md` / `ARCHITECTURE_AUDIT.md`:

- **Modularity:** The modules are reasonably decoupled, but the barrel `index.ts` is a single chokepoint.
- **No circular dependencies:** None detected among the support modules.
- **Public API via `index.ts`:** Satisfied.
- **No `any` in public APIs:** Mostly satisfied; a few implicit `any` parameters slipped into tests.
- **Separation of concerns:** `HardwareGovernor` does not touch physics logic; `ResonanceFinder` does not touch UI. Good.
- **Test coverage:** Falls short of the project standard (no formal test suite in `tests/`).

---

## 9. Summary Table

| Module | Primary Role | Biggest Strength | Biggest Risk | Build Status |
|--------|--------------|------------------|--------------|--------------|
| `resonance_finder.ts` | 144,000 Hz convergence search | Log-space numerical stability | Scale deduplication inconsistency; type mismatches | Fails (TS5097, TS6133, TS2322) |
| `hardware_governor.ts` | Adaptive 35% resource cap | Cross-platform safe detection | Double application of 0.35; missing Node types | Fails (TS5097, TS6192, TS2580) |
| `index.ts` | Public barrel | Single entry point | Re-exports broken framework classes | Fails (TS5097) |
| `test_engine.ts` | Smoke verification | End-to-end coverage | No assertions; unused imports | Fails (TS5097, TS6133, TS2339) |
| `test_robustness.ts` | Robustness suite | Determinism + boundedness checks | Tautological assertions; interface mismatches | Fails (TS5097, TS6133, TS2580, TS7006) |
| `membrane_stabilizer.ts` | Toroidal field stabilization | Deterministic correction | Interface mismatch with `MembraneGeometry` | Fails (TS5097, TS2739) |

**Overall verdict:** The v13 support modules are conceptually coherent, well-documented, and deterministic, but they are currently **non-compiling** due to a cluster of TypeScript configuration and interface-consistency issues. The fixes are mechanical and well-bounded; the deeper work is resolving the `frameworks.ts` interface contract and aligning the membrane geometry types across `fractal_node.ts` and `membrane_stabilizer.ts`.

---

**End of support_modules_brainmap.md**
