# ARCHITECTURE_AUDIT.md — RHUFT v6.0 Architecture Rules & Status

> **Purpose:** Define and enforce microservice-ready, modular, regression-resistant architecture. Read before structural changes.

---

## 1. Architectural Principles

### 1.1 Separation of Concerns
| Concern | Allowed Location | Forbidden Location |
|---------|------------------|-------------------|
| Math primitives | `core/` | UI files, framework logic |
| Scale physics | `frameworks/` | UI files, I/O adapters |
| Computation orchestration | `engine/` | Direct UI coupling |
| Documentation | `docs/` | Source code strings |
| UI / Panels | `ui/` or `panels/` | Core math or framework logic |
| I/O / Integration | `adapters/` or `services/` | UI components |
| Configuration | `config/` or environment | Hardcoded in logic |

### 1.2 Microservice-Ready Boundaries
Every top-level functional folder must be independently deployable:
- Own `package.json` if it has distinct dependencies.
- Clear public API surface (`index.ts`).
- No shared mutable state with siblings.
- Communication via explicit interfaces, not global singletons.

### 1.3 Dependency Direction
```
ui/ → adapters/ → engine/ → frameworks/ → core/
                  ↑
                config/
```
Lower layers MUST NOT import from higher layers.

---

## 2. Module Contract Rules

### 2.1 Public API Surface
- Each module exposes its public API through `index.ts`.
- Internal helpers live in `internal/` or `private/` subfolders.
- Sibling modules may only import from the public `index.ts`.

### 2.2 Type Safety
- All public functions must have explicit return types.
- All public interfaces must be exported types.
- `any` is forbidden in public APIs.
- Use `readonly` for immutable data structures.

### 2.3 Error Handling
- Errors are typed and never swallowed.
- All async functions handle rejection paths.
- User-facing errors are sanitized; internal errors are logged.

---

## 3. Current Architecture Status

| Area | Status | Notes |
|------|--------|-------|
| Core math primitives | PARTIAL | `constants.ts` still at root |
| Framework modularity | GOOD | 12 isolated frameworks |
| Engine orchestration | PARTIAL | Files at root, needs tests |
| Documentation | GOOD | Rich, labeled docs |
| Test coverage | MISSING | No visible test suite |
| UI / Panels | MISSING | No UI yet |
| I/O adapters | MISSING | No external integrations yet |
| Microservice packaging | MISSING | Single root package |

---

## 4. Audit Checklist

Before approving any structural change:

- [ ] Does it preserve or improve separation of concerns?
- [ ] Does it avoid circular dependencies?
- [ ] Does it keep modules independently testable?
- [ ] Does it avoid shared mutable state?
- [ ] Does it keep the public API surface minimal?
- [ ] Does it align with the target folder layout in `PROJECT_BRAINMAP.md`?
- [ ] Does it not introduce framework logic into UI or I/O layers?
- [ ] Are all new files assigned to a module?

---

## 5. Anti-Patterns (Forbidden)

1. **God files** — files exceeding ~500 lines without clear sub-module separation.
2. **Spaghetti imports** — imports crossing more than two conceptual layers.
3. **Global state** — mutable variables accessible across modules.
4. **Secret leakage** — credentials in source or logs.
5. **Tight coupling** — UI directly calling framework internals.
6. **Mock truth sources** — production logic relying on fake data.

---

**Last updated:** 2026-07-01
