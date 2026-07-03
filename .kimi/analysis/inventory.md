# RHUFT v13 Engine Inventory

> **Source:** `metatron-v13-engine.7z` extracted to `.tmp-extracted-brain/`
> **Epistemic status:** [SPEC] + [PHIL] — Mathematical ontology, not predictive physics.
> **Baseline test status:** Build fails (TypeScript errors); tests cannot run until build fixed.

---

## Files

| File | Size | Responsibility |
|------|------|----------------|
| `src/core/constants.ts` | 23,532 B | Mathematical/physical constants, scale configurations, framework/memory characteristics |
| `src/types.ts` | 20,225 B | TypeScript interfaces and types for field, node, memory, framework, packets |
| `src/frameworks.ts` | 78,528 B | 7 frameworks (F8, F4, F5, F6, F7, F1, F9) + 5 memory subsystems (L1–L4+) |
| `src/fractal_node.ts` | 42,798 B | Single fractal node: field compute, stabilization, membrane, state |
| `src/fractal_node_engine.ts` | 21,840 B | Engine orchestration: tree build, tick, process, information flow |
| `src/membrane_stabilizer.ts` | 12,491 B | Toroidal membrane boundary-condition stabilization |
| `src/interdimensional_flow.ts` | 9,655 B | Packet routing up/down/horizontal between nodes |
| `src/resonance_finder.ts` | 18,314 B | 144,000 Hz resonance convergence search |
| `src/scale_mapper.ts` | 17,232 B | Scale index → config, QRF, framework/memory activation |
| `src/hardware_governor.ts` | 11,463 B | Adaptive resource scaling (~35% target) |
| `src/index.ts` | 4,277 B | Public API exports |
| `src/test_engine.ts` | 11,493 B | Basic test suite |
| `src/test_robustness.ts` | 19,140 B | Enhanced robustness suite (113 tests) |
| `src/FIXES.md` | 18,128 B | Fix log documenting 12 robustness corrections |
| `README.md` | 15,850 B | Engine overview and architecture |
| `PLAN.md` | 7,659 B | Enhancement implementation plan |
| `AUDIT.md` | 20,186 B | Gap audit (~60% computation missing) |
| `package.json` | 506 B | Project manifest |
| `tsconfig.json` | 550 B | TypeScript config |

---

## Build Baseline

```
npm install: OK (typescript installed)
npm run build: FAIL
  - TS2339: MemoryInstance missing name/scale (test_engine.ts)
  - TS6133: Unused variables in test files
  - TS5097: .ts extension imports not allowed
  - TS2578: Unused @ts-expect-error
  - TS2580: process not found (missing @types/node)
  - TS7006: Implicit any parameters
npm test: FAIL (build failed)
```

**Important:** The engine source itself is more complete than `AUDIT.md` suggests. The audit appears to describe an earlier state. The current `frameworks.ts` memory classes implement real computation (PCA, full correlation matrix, Kuramoto dynamics, saliency attention, coherence-weighted integration).

---

## Structural Notes

- Uses ES modules (`"type": "module"`).
- Imports use `.ts` extensions which TypeScript 5.4 rejects without `allowImportingTsExtensions`.
- No `@types/node` dependency despite using `process` in tests.
- Constants are centralized in `src/core/constants.ts`.
- Types are centralized in `src/types.ts`.
- Memory subsystems are co-located with frameworks in `src/frameworks.ts`.
