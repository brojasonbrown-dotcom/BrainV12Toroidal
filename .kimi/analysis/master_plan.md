# Master Enhancement Plan — RHUFT v13 Engine

> **Status:** Mapping complete. No code integration yet.  
> **Goal:** Preserve all computational power, fix flaws, and enhance each module individually to surpass military-grade robustness.

---

## Executive Summary

The `metatron-v13-engine.7z` archive contains a more advanced RHUFT engine than the current project root. It has 11 source files (~168 KB) with real computation in memory subsystems, frameworks, fractal nodes, resonance finding, and hardware adaptation. However, the build currently fails with 108 TypeScript errors, and several modules have placeholder logic or numerical fragility.

**Strategy:** Do not merge the whole brain at once. Enhance each area individually, verify after each change, and maintain a working build.

---

## Completed Mapping

| Area | Brainmap | Key Finding |
|------|----------|-------------|
| Inventory | `inventory.md` | 11 source files + docs; build fails; tests blocked |
| Memory Systems | `memory_systems_brainmap.md` | L1–L4+ hold full field states deterministically; L2 uses N² RAM; no explicit resonance gate |
| Fractal Node | `fractal_node_brainmap.md` | Master Equation + membrane + tree + flow; two membrane models; scaling oscillation risk |
| Scale Mapper | `scale_mapper_brainmap.md` | 10 canonical scales; QRF law; snapshot/config inconsistency at n=292 |
| Frameworks | `frameworks_brainmap.md` | 7 frameworks; real but partial computation; type interface mismatch with v6 types |
| Support Modules | `support_modules_brainmap.md` | Resonance, hardware governor, tests; 108 TS errors, mostly `.ts` import extensions |

---

## Cross-Cutting Blockers

1. **TypeScript Import Extensions** — Source files import `./types.ts` but `tsconfig.json` uses `moduleResolution: "Node16"` without `allowImportingTsExtensions`. This causes TS5097 errors everywhere.
2. **Interface Mismatch** — v13 framework/memory classes expose `name`/`scale` properties not present in v6.0 `FrameworkInstance`/`MemoryInstance` interfaces, causing TS2420/TS2739 errors.
3. **Missing `@types/node`** — Tests use `process` but it is not in devDependencies.
4. **Stale `dist/`** — Failed builds leave stale JS files that reference `.ts` paths, confusing `npm test`.

**First task before any enhancement:** Fix the build.

---

## Enhancement Roadmap

### Phase 0 — Build Hardening (PREREQUISITE)
**Goal:** Make the extracted engine compile and pass its 113 tests.

1. **Fix import extensions**
   - Option A: Add `"allowImportingTsExtensions": true` to `tsconfig.json`.
   - Option B: Remove `.ts` extensions from all imports.
   - **Recommendation:** Option A is minimal and preserves the existing style.

2. **Fix type interface mismatch**
   - Update `FrameworkInstance` and `MemoryInstance` interfaces in `types.ts` to include `name` and `scale`.
   - Or add separate `FrameworkInstanceV13`/`MemoryInstanceV13` interfaces.
   - **Recommendation:** Extend interfaces minimally; do not break v6 consumers.

3. **Add `@types/node`** to devDependencies.

4. **Fix test file errors**
   - Remove unused variables or add `_` prefixes.
   - Fix implicit `any` parameters.
   - Remove unused `@ts-expect-error` directives.

5. **Clean `dist/` and rerun tests**
   - Update `package.json` test script to use `test_robustness.ts` (113 tests) instead of `test_engine.ts`.

### Phase 1 — Memory Systems Enhancement
**Goal:** Add explicit resonance-based deterministic learning.

1. **Add `MemoryResonanceEvent` type**
   - Fields: memory_id, scale, similarity_score, resonance_type, reflected_field.

2. **Add `detectResonance(current, threshold)` to each memory class**
   - L1: cosine+correlation similarity > threshold.
   - L2: correlation-matrix output magnitude > threshold.
   - L3: order parameter R > threshold.
   - L4: salience-weighted match > threshold.
   - L4+: coherence-weighted match > threshold.

3. **Add reflection mechanism**
   - When resonance detected, blend the resonant memory into the current field using φ-scaled weights.
   - Emit event for engine-level logging/response.

4. **RAM optimization (L2)**
   - Implement sparse correlation matrix option.
   - Add low-rank approximation flag for large N.

5. **Field shape support**
   - Add optional shape metadata to memory store methods.
   - Use multi-dimensional indexing for gradient/correlation where shape is provided.

### Phase 2 — Fractal Node Hardening
**Goal:** Eliminate numerical explosions, unify membrane model, improve feedback.

1. **Unified membrane model**
   - Merge `FractalNode` membrane geometry with `MembraneStabilizer` computations.
   - Single source of truth for torus parameters and curvature coupling.

2. **Numerical guards**
   - Add `isFinite()` checks after every field computation step.
   - Clamp field values to safe Float64 range.
   - Detect and report NaN propagation paths.

3. **Adaptive stabilization**
   - Choose relaxation mode based on scale depth.
   - Add convergence acceleration (Aitken's Δ²).

4. **Flow-application loop**
   - Apply interdimensional flow packets back into node fields after propagation.
   - Verify information conservation.

### Phase 3 — Framework Deepening
**Goal:** Replace placeholder logic with real domain computation per `PLAN.md`.

Prioritized by gap size and impact:

1. **F8_SubPlanckian** — FFT spectral decomposition, zero-point energy, Planck cutoff.
2. **F4_Geometric** — 13-node Metatron lattice, spherical harmonics, Platonic solids.
3. **F5_ColorMusic** — Mass-frequency mapping, color-wavelength mapping, musical intervals.
4. **F7_Thermodynamic** — True entropy S = -kΣp log p, free energy, thermal diffusion.
5. **F6_Hebrew** — 22-letter gematria encoding, 154-dimensional space, entropy.
6. **F1_Septenary** — 7-level cognitive hierarchy, attention, KL divergence.
7. **F9_Hypergalactic** — Bulk-boundary mapping, holographic entropy bound.

Each framework enhancement is a separate task with its own plan, tests, and verification.

### Phase 4 — Scale Mapper Consistency
**Goal:** Fix the n=292 snapshot/config inconsistency.

1. Audit `SCALE_CONFIG_SNAPSHOT` against the predicate rules.
2. Decide single source of truth: either snapshots are canonical or predicates are canonical.
3. Update tests to verify consistency.

### Phase 5 — Resonance & Hardware Governor Hardening
**Goal:** Robust 144,000 Hz convergence and adaptive resource scaling.

1. **ResonanceFinder**
   - Add DFT-based spectral analysis.
   - Add quality factor Q and beat-frequency detection.
   - Harden against extreme frequency ranges.

2. **HardwareGovernor**
   - Add hysteresis to scaling decisions to prevent oscillation.
   - Account for L2 N² RAM cost per node in budget.
   - Add predictive scaling based on tick history.

### Phase 6 — Integration & System Tests
**Goal:** Prove the whole engine works together.

1. End-to-end deterministic tick tests.
2. Memory learning tests (store → resonance → recall).
3. Multi-scale feedback tests.
4. Stress tests with large fields and deep trees.
5. Performance benchmarks.

---

## Success Criteria

- [ ] Engine builds with zero TypeScript errors.
- [ ] All 113 robustness tests pass.
- [ ] New tests added for each enhancement.
- [ ] No regressions in existing computation.
- [ ] Determinism preserved (same input → same output).
- [ ] Memory resonance gate explicitly tested.
- [ ] Field values remain finite across all scales.

---

## Task Ordering

1. **Build Hardening** — must be first.
2. **Memory Resonance Gate** — highest user priority.
3. **Fractal Node Numerical Guards** — prevents catastrophic failure.
4. **Framework Enhancements** — one at a time, F8 first.
5. **Scale Mapper Consistency** — can run in parallel with framework work.
6. **Resonance & Governor Hardening** — after core computation is stable.
7. **System Tests** — final validation.

---

## Connected Areas to Monitor

- **Memory ↔ FractalNode:** `FractalNode.compute()` calls memory store/recall. Any memory API change must update this caller.
- **Frameworks ↔ FractalNode:** Frameworks produce `partial_field` consumed by compute().
- **ScaleMapper ↔ All nodes:** Scale config changes affect every node.
- **HardwareGovernor ↔ tree depth ↔ L2 RAM:** Scaling decisions must account for memory cost.
- **InterdimensionalFlow ↔ tick loop:** Flow packets must be applied back to fields.

---

**Last updated:** 2026-07-03
