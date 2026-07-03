# PROJECT_BRAINMAP.md — RHUFT v6.0 Structural Map

> **Purpose:** This is the canonical structural memory of the repository. Every agent MUST read this before editing. Update it when structure changes.

---

## 1. Repository Overview

```
brainv12vscode/
├── AGENTS.md                          → Universal agent rules (MANDATORY)
├── .github/                           → GitHub Actions and templates
│   └── workflows/
│       └── daily-sync.yml             → Automated daily sync workflow
├── .kimi/                             → Agent context & memory
│   ├── AGENTS.md                      → Kimi-specific enforcement
│   ├── config.json                    → Workflow config
│   ├── context/                       → Persistent context files
│   │   ├── PROJECT_BRAINMAP.md        → This file
│   │   ├── ARCHITECTURE_AUDIT.md      → Architecture rules & status
│   │   ├── SECURITY_CHECKLIST.md      → Security baseline
│   │   ├── UI_UX_RULES.md             → UI/UX standards
│   │   └── TRUTH_SOURCES.md           → Non-mock truth-source policy
│   ├── plans/                         → Approved implementation plans
│   └── tasks/                         → Active and archived tasks
├── .vscode/                           → VS Code workspace config
│   ├── settings.json                  → Editor & extension settings
│   └── extensions.json                → Recommended extensions
├── .devcontainer/                     → Docker dev container
│   └── devcontainer.json
├── docker-compose.yml                 → Local service orchestration
├── scripts/
│   └── daily-sync.sh                  → Local daily sync script
│
├── core/                              → [CONCEPTUAL] Math primitives, constants, types
│   ├── constants.ts                   → Physical & mathematical constants
│   └── types.ts                       → Shared TypeScript types
│
├── frameworks/                        → [CONCEPTUAL] 12 scale frameworks
│   ├── base_framework.ts              → Abstract base class
│   ├── types.ts                       → Framework-specific types
│   ├── f1_subplanckian.ts
│   ├── f2_septenary.ts
│   ├── f3_quantum.ts
│   ├── f4_geometric.ts
│   ├── f5_colormusic.ts
│   ├── f6_hebrew.ts
│   ├── f7_thermodynamic.ts
│   ├── f8_galactic.ts
│   ├── f9_hypergalactic.ts
│   ├── f10_molecular.ts
│   ├── f11_biological.ts
│   └── f12_thermodynamic.ts
│
├── engine/                            → [CONCEPTUAL] Computation orchestration
│   ├── fractal_node.ts
│   └── fractal_node_engine.ts
│
├── docs/                              → [CONCEPTUAL] Markdown documentation
│   ├── 01_introduction.md
│   ├── 02_geometric_framework.md
│   ├── 03_frequency_correction.md
│   ├── 04_master_equation.md
│   ├── PHILOSOPHICAL_FOUNDATION.md
│   ├── RHUFT_ONTOLOGY.md
│   ├── RHUFT_v6.0_Integrated_Framework.md
│   ├── RHUFT_v6.0_Master_Index.md
│   ├── phenomenon_*.md                → 38 phenomenon docs
│   ├── tech_*.md                      → 16 technology docs
│   └── v6_*.md                        → v6 variant docs
│
├── tests/                             → [CONCEPTUAL] Test suite
│   (to be created/expanded)
│
└── MetatronTraining.ts
    RHUFTFrameworks.ts
    base_framework.ts                  → Currently at root; consider moving to frameworks/
    fractal_node.ts                    → Currently at root; consider moving to engine/
    fractal_node_engine.ts             → Currently at root; consider moving to engine/
    constants.ts                       → Currently at root; consider moving to core/
    Particle computation.txt
```

> **Note:** The current root layout mixes source files at the top level. The `[CONCEPTUAL]` folders above represent the target microservice-ready layout. Migration must be done carefully to avoid breaking imports.

---

## 2. Dependency Graph

### 2.1 Core Import Map
```
constants.ts
    ↑
    ├── base_framework.ts
    ├── f1–f12 frameworks
    ├── fractal_node.ts
    └── fractal_node_engine.ts

base_framework.ts
    ↑
    ├── f1–f12 frameworks (extend BaseFramework)
    └── RHUFTFrameworks.ts (registry)

fractal_node.ts
    ↑
    └── fractal_node_engine.ts
```

### 2.2 Framework Inheritance
All `f*.ts` files:
- Import from `constants.ts`
- Import from `base_framework.ts` (or its types)
- Extend `BaseFramework`
- Override `compute()`, `getDipoleMoment()`, `getPolarization()`

### 2.3 Documentation Relationships
- `RHUFT_v6.0_Integrated_Framework.md` is the master document.
- `phenomenon_*.md` are derived explanations.
- `tech_*.md` are application projections.
- `v6_*.md` are variant/speculative versions.

---

## 3. Key Files & Responsibilities

| File | Responsibility | Risk Level |
|------|----------------|------------|
| `constants.ts` | Source of mathematical/physical constants. Truth-critical. | HIGH |
| `base_framework.ts` | Abstract contract for all 12 frameworks. Breaking changes ripple widely. | HIGH |
| `f1_subplanckian.ts`–`f12_thermodynamic.ts` | Scale-specific physics implementations. | MEDIUM |
| `fractal_node_engine.ts` | Orchestrates recursive computation. | HIGH |
| `RHUFTFrameworks.ts` | Registry/dispatcher for frameworks. | MEDIUM |
| `RHUFT_v6.0_Integrated_Framework.md` | Canonical human-readable framework. | MEDIUM |

---

## 4. Structural Rules

1. **No circular imports** between `core/`, `frameworks/`, and `engine/`.
2. **Constants are read-only** after initialization.
3. **Frameworks are stateless** except for configuration parameters.
4. **Docs and code must stay aligned** on epistemic labels.
5. **Any new top-level file must be assigned to a conceptual folder** in this brainmap.

---

## 5. Migration Backlog

- [ ] Move `constants.ts` → `core/constants.ts`
- [ ] Move `base_framework.ts` → `frameworks/base_framework.ts`
- [ ] Move `f*.ts` → `frameworks/`
- [ ] Move `fractal_node.ts`, `fractal_node_engine.ts` → `engine/`
- [ ] Update all relative imports after migration.
- [ ] Add `tests/` with framework unit tests.

---

**Last updated:** 2026-07-01
