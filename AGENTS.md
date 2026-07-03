# AGENTS.md — RHUFT v6.0 | Universal Agent Operating Rules

> **Status:** MANDATORY — These rules are non-negotiable for every agent session.
> **Applies to:** All AI agents, subagents, copilots, and automated tooling operating on this repository.
> **Version:** 1.0.0 — Foolproof / Regression-Free / Context-Holding Protocol

---

## 1. ABSOLUTE MANDATES

### 1.1 Zero-Regression Doctrine
- **No change may break existing functionality.**
- Every edit requires a pre-change impact map and a post-change verification sweep.
- If a change cannot be made safely, the agent MUST halt, explain why, and request direction.

### 1.2 Context-Holding Doctrine
- The agent MUST load the full project brainmap, architecture audit, and active task context before planning or editing.
- The agent MUST keep the most relevant structural information in working memory throughout the session.
- The agent MUST update the brainmap if any structural change is made.

### 1.3 Plan-Fidelity Doctrine
- **Once a plan is approved, NO task or subtask may be skipped without explicit user authorization to change the plan.**
- If a task is broken into subtasks or sub-subtasks, the official plan remains active until explicitly closed.
- The agent MUST, in capitals, recommend fully finishing the plan before deviating: **"I RECOMMEND WE FULLY FINISH THE CURRENT PLAN BEFORE CHANGING DIRECTION UNLESS YOU EXPLICITLY CHANGE THE PLAN."**

### 1.4 No-Shortcuts Doctrine
- Every edit must consider related structures, downstream consumers, security, backend integrations, frontend UX, and documentation.
- **Shortcuts are prohibited.** If the agent detects a temptation to shortcut, it must document the risk and either mitigate it or escalate.

---

## 2. PROJECT IDENTITY & TRUTH SOURCES

### 2.1 Project Identity
| Field | Value |
|-------|-------|
| **Name** | RHUFT v6.0 — Recursive Harmonic Unified Field Theory |
| **Type** | Mathematical ontology + TypeScript computational framework |
| **Primary Language** | TypeScript |
| **Documentation** | Markdown (122+ docs) |
| **Core Principle** | Physical reality approximates underlying mathematical perfection. |

### 2.2 Universal Truth Sources (NON-MOCK)
The following are the ONLY acceptable sources of truth. Mocks are forbidden in production logic and documentation claims.

| Category | Truth Source | Rule |
|----------|--------------|------|
| **Mathematics** | Peer-reviewed mathematical definitions (π, φ, e, √2, √3, etc.) | Label with `[MATH FACT]` |
| **Physics** | Established, experimentally validated physics | Label with `[EST PHYS]` |
| **Observations** | Peer-reviewed empirical data | Label with `[OBSERVED]` |
| **Code Behavior** | Compiled and tested runtime output | Verified via `npm run typecheck` + `npm run test` |
| **Framework Internals** | This `AGENTS.md`, `PROJECT_BRAINMAP.md`, and architecture docs | Checked before every edit |

### 2.3 Forbidden Patterns
- **No numerology presented as physics.**
- **No mock data in production paths.**
- **No hardcoded secrets, credentials, or API keys.**
- **No `eval()`, `Function()`, or unsafe dynamic execution.**
- **No direct DOM manipulation in framework logic.**
- **No circular dependencies between modules.**

---

## 3. MANDATORY WORKFLOW — EXECUTED FOR EVERY TASK

This workflow is **algorithmic and non-skippable**. Treat it as a state machine.

```
STATE MACHINE: MANDATORY_TASK_PROTOCOL
├── 0. INTAKE
│   ├── Parse user request.
│   ├── Classify task type: {Bug, Feature, Refactor, Docs, Security, Audit, Integration, UI/UX}.
│   └── Load AGENTS.md (this file) first.
│
├── 1. CONTEXT_LOAD
│   ├── Read .kimi/context/PROJECT_BRAINMAP.md
│   ├── Read .kimi/context/ARCHITECTURE_AUDIT.md
│   ├── Read .kimi/context/SECURITY_CHECKLIST.md
│   ├── Read .kimi/context/UI_UX_RULES.md
│   ├── Read .kimi/context/TRUTH_SOURCES.md
│   ├── Read active task file in .kimi/tasks/*.md (use .kimi/tasks/TEMPLATE.md for new tasks)
│   ├── Read README or RHUFT_v6.0_Integrated_Framework.md if no README.
│   └── Identify relevant framework files (f1–f12, base_framework.ts, constants.ts, etc.).
│
├── 2. IMPACT_ANALYSIS
│   ├── Map all files/modules touched or influenced.
│   ├── Trace dependency graph upward and downward.
│   ├── Check truth-source labels on any modified documentation.
│   └── Produce an impact summary before planning.
│
├── 3. SECURITY_AUDIT (MANDATORY)
│   ├── Scan changed/new code for secrets, injection, unsafe eval, path traversal.
│   ├── Verify input validation on all public functions.
│   ├── Check dependency imports for known-risk packages.
│   ├── Ensure no hardcoded credentials or env leaks.
│   └── Record findings in .kimi/context/SECURITY_CHECKLIST.md.
│
├── 4. ARCHITECTURE_AUDIT (MANDATORY)
│   ├── Verify modularity and service boundaries.
│   ├── Ensure folder structure matches the brainmap.
│   ├── Check for separation of concerns (logic vs. UI vs. I/O).
│   ├── Confirm microservice-ready boundaries (no tangled cross-cutting state).
│   └── Record findings in .kimi/context/ARCHITECTURE_AUDIT.md.
│
├── 5. BACKEND & INTEGRATION AUDIT
│   ├── Check API contracts, data flows, and connection lifecycle.
│   ├── Verify error handling, retries, timeouts, and logging.
│   ├── Check event-driven or async paths for race conditions.
│   └── Ensure integrations are configurable, not hardcoded.
│
├── 6. FRONTEND & UI/UX AUDIT
│   ├── Check that all meaningful options are discoverable (progressive disclosure).
│   ├── Ensure defaults are sane; advanced options do not overwhelm new users.
│   ├── Verify accessibility (ARIA labels, keyboard navigation, contrast).
│   ├── Verify responsive behavior if UI is involved.
│   └── Reference .kimi/context/UI_UX_RULES.md.
│
├── 7. PLANNING
│   ├── For non-trivial tasks, produce a written plan.
│   ├── Break plan into subtasks and, if needed, sub-subtasks.
│   ├── Each subtask must have: ID, Goal, Files, Verification Step, Risk (see .kimi/tasks/TEMPLATE.md).
│   ├── Ask clarifying questions if requirements are ambiguous.
│   └── Obtain user approval for significant architectural or behavioral changes.
│
├── 8. IMPLEMENTATION
│   ├── Use the minimum viable change.
│   ├── Follow existing code style and epistemic tags.
│   ├── Preserve truth sources; do not weaken epistemic labels.
│   ├── Keep modules decoupled; do not violate service boundaries.
│   └── Write/update tests for new behavior.
│
├── 9. VERIFICATION
│   ├── Run `npm run typecheck` (or `tsc --noEmit`).
│   ├── Run `npm run test`.
│   ├── Run `npm run lint` if available.
│   ├── Run regression checks on affected modules.
│   ├── Re-run SECURITY_AUDIT on the diff.
│   └── Do NOT declare completion until all checks pass.
│
├── 10. DOCUMENTATION & BRAINMAP UPDATE
│   ├── Update PROJECT_BRAINMAP.md if structure changed.
│   ├── Update relevant docs if public interface or behavior changed.
│   ├── Update active task file with status and decisions.
│   └── Update AGENTS.md if conventions changed.
│
└── 11. COMPLETION & NEXT-STEP RECOMMENDATION
    ├── Summarize what was done, verified, and any residual risks.
    ├── If subtasks remain, state the next subtask explicitly.
    ├── State: "I RECOMMEND WE FULLY FINISH THE CURRENT PLAN BEFORE CHANGING DIRECTION UNLESS YOU EXPLICITLY CHANGE THE PLAN."
    └── Do NOT silently drop unfinished subtasks.
```

---

## 4. SPECIALIZED HANDLING RULES

### 4.1 Before Planning — Structural Deep-Dive
Before writing any plan, the agent MUST:
1. Read the immediate target files.
2. Read files that import or are imported by the target files.
3. Read related framework files (e.g., changing `f3_quantum.ts` implies checking `base_framework.ts`, `constants.ts`, `f4_geometric.ts`).
4. Identify whether the change affects documentation epistemic labels.
5. Summarize the structural context in the plan.

### 4.2 During Implementation — Specialized Approach
- Match the implementation style to the module's role:
  - **Core math:** Exact types, high precision, no silent rounding.
  - **Framework logic:** Abstract classes, overrides, coherence checks.
  - **I/O / integration:** Validation, error handling, configurable endpoints.
  - **UI:** Progressive disclosure, sane defaults, accessibility.
  - **Docs:** Preserve `[PHIL]`, `[MATH FACT]`, `[EST PHYS]`, `[SPEC]`, `[OBSERVED]` labels.

### 4.3 Subtask / Sub-Subtask Handling
- Every parent task must maintain a canonical task file.
- Subtasks are tracked in the same file with `## Subtask X.Y` headers.
- Status values: `pending`, `in_progress`, `blocked`, `done`, `deferred`.
- A deferred subtask requires explicit user approval to skip.

---

## 5. TOOLCHAIN & ENVIRONMENT

### 5.1 Approved Stack
| Layer | Tool | Purpose |
|-------|------|---------|
| Editor | VS Code | Primary IDE |
| Containerization | Docker + Dev Containers | Reproducible environment |
| Version Control | Git → GitHub | Source of truth |
| Design / UI | Lovable | Design/export; code is reviewed and refactored in VS Code |
| Runtime | Node.js LTS | TypeScript execution |
| Package Manager | npm / yarn / pnpm (match lockfile) | Dependency management |

### 5.2 Dev Container Rule
- All development SHOULD happen inside the Dev Container defined in `.devcontainer/devcontainer.json`.
- The container must include: Node.js LTS, Git, Docker CLI, VS Code extensions.
- Host secrets MUST NOT be baked into the image.

### 5.2.5 Machine-Readable Workflow Config
- The canonical workflow is also encoded in `.kimi/config.json`.
- Agents must treat `.kimi/config.json` as the ground-truth automation contract.
- Any structural change to the workflow must be reflected in both `AGENTS.md` and `.kimi/config.json`.

### 5.3 Git & GitHub Rules
- Source of truth is the GitHub remote.
- **Do NOT run `git commit`, `git push`, `git reset`, `git rebase` unless explicitly asked.**
- **Exception:** The automated daily sync process is explicitly authorized by the project workflow.
  - It runs via `.github/workflows/daily-sync.yml` (GitHub Actions) or `scripts/daily-sync.sh` (local cron).
  - It only commits if no human commit has occurred in the last 24 hours.
  - It pulls latest changes before committing to avoid diverging.
  - The marker commit message is `chore: daily sync marker [skip ci]`.
- Use atomic commits with Conventional Commits format when committing.
- Every PR must pass typecheck, tests, lint, and security checklist before merge.

### 5.4 Lovable Integration Protocol
1. Design in Lovable.
2. Export/sync generated code into a feature branch.
3. Review, refactor, and secure the exported code in VS Code.
4. Run full verification suite.
5. Merge only after all audits pass.
6. Never let Lovable output override verified production logic without review.

---

## 6. MODULARITY & FOLDER STRUCTURE

### 6.1 Service/Module Boundaries
The repository is organized so that any folder can become an independent microservice without surgery:

```
brainv12vscode/
├── core/                  → Constants, types, math primitives (truth-source logic)
├── frameworks/            → f1–f12 scale frameworks (isolated, each extends BaseFramework)
├── engine/                → fractal_node, fractal_node_engine (computation orchestration)
├── docs/                  → Markdown documentation (phenomena, tech, v6 framework)
├── tests/                 → Unit, integration, and regression tests
├── .kimi/                 → Agent context, brainmap, tasks, audit rules
├── .vscode/               → Workspace settings and recommended extensions
├── .devcontainer/         → Reproducible dev environment
└── docker-compose.yml     → Local orchestration
```

### 6.2 Folder Rules
- Each top-level functional folder MUST have a single responsibility.
- Cross-folder imports are allowed only through well-defined public interfaces.
- No file may import from a sibling module's `internal/` or `private/` subtree.
- UI panels, if introduced, MUST be self-contained modules with clear inputs/outputs.

### 6.3 Panel Modularity
If building any UI:
- Each panel is a standalone component/service.
- Panels communicate via events or a typed message bus, not direct DOM coupling.
- Panels can be toggled, lazy-loaded, and unit-tested independently.
- All options are either visible by default or discoverable within one click/interaction.

---

## 7. UI / UX RULES

All UI work MUST satisfy:

1. **Discoverability:** All meaningful options must be findable. Use progressive disclosure: primary actions visible, advanced actions in "Advanced" or gear menus.
2. **Sane Defaults:** The default view must work for 80% of users without configuration.
3. **No Hidden Traps:** If an option can cause data loss or expensive computation, warn the user.
4. **Accessibility:** WCAG 2.1 AA minimum (labels, keyboard nav, color contrast, focus states).
5. **Responsiveness:** UI must adapt to desktop, tablet, and mobile widths.
6. **Truthful Feedback:** Status messages must reflect real state, not mocked or optimistic data.
7. **Modular Panels:** Each UI panel loads, errors, and refreshes independently.

See `.kimi/context/UI_UX_RULES.md` for the full checklist.
See `.kimi/context/TRUTH_SOURCES.md` for the non-mock truth-source policy.

---

## 8. SECURITY & AUDIT RULES

### 8.1 Mandatory Security Sweep
Before any code is considered complete:
- [ ] No secrets in source files.
- [ ] No `eval`, `new Function`, or `innerHTML` with untrusted input.
- [ ] All external inputs validated and sanitized.
- [ ] No SQL/NoSQL/Command injection vectors.
- [ ] No path traversal from user input.
- [ ] Dependencies scanned (use `npm audit` if available).
- [ ] Error messages do not leak internal paths or stack traces to users.

### 8.2 Backend & Integration Audit
- [ ] API contracts are explicit and versioned.
- [ ] Timeouts, retries, and circuit breakers configured.
- [ ] Async operations handle cancellation and cleanup.
- [ ] Logs do not contain PII or secrets.
- [ ] Database/connection lifecycle is managed (open/close correctly).

### 8.3 Frontend Audit
- [ ] No inline scripts or styles that bypass CSP.
- [ ] Sensitive operations require confirmation.
- [ ] Client-side validation mirrors server-side validation.
- [ ] Third-party scripts loaded with integrity attributes when possible.

---

## 9. DOCUMENTATION & LABELING

### 9.1 Epistemic Tags (RHUFT-specific)
Use these tags precisely in code comments and docs:

| Tag | Meaning |
|-----|---------|
| `[MATH FACT]` | Established mathematical truth |
| `[EST PHYS]` | Established, experimentally validated physics |
| `[EST MATH]` | Established mathematical derivation |
| `[OBSERVED]` | Empirical measurement |
| `[SPEC]` | Speculative hypothesis |
| `[PHIL]` | Philosophical claim |
| `[OVERRIDE]` | Must be implemented by subclass |
| `[ACTIVE]` | Runtime activation check |
| `[TOROIDAL]` | Toroidal field computation |
| `[SPHERICAL]` | Spherical infinity computation |
| `[COHERENCE]` | Coherence computation |
| `[TODO]` | Outstanding work |
| `[DEPRECATED]` | Do not use in new code |
| `[SECURITY]` | Security-critical code |

### 9.2 Change Log Convention
For any non-trivial change, add a brief note to the active task file and, if user-facing, to the relevant markdown doc.

---

## 10. COMMUNICATION RULES

1. **Same language as the user.**
2. **Be concise but complete.** Avoid fluff; include verification evidence.
3. **Explain trade-offs** when multiple valid approaches exist.
4. **Escalate, don't guess.** If a requirement conflicts with these rules, say so.
5. **MANDATORY PHRASE:** When a plan is active and the user asks to do something else, say:  
   **"I RECOMMEND WE FULLY FINISH THE CURRENT PLAN BEFORE CHANGING DIRECTION UNLESS YOU EXPLICITLY CHANGE THE PLAN."**

---

## 11. PROHIBITED ACTIONS

- Do NOT run destructive git commands without explicit user approval.
- Do NOT install global packages or modify the host outside the working directory.
- Do NOT write code in chat without saving it to the file system.
- Do NOT skip verification steps.
- Do NOT weaken epistemic labels in documentation.
- Do NOT introduce circular dependencies.
- Do NOT mock truth sources in production code.
- Do NOT skip the mandatory workflow for "quick" tasks.
- Do NOT interfere with the automated daily sync process unless authorized.

---

## 12. CONFIG VERSIONING

| Version | Date | Change |
|---------|------|--------|
| 1.0.0 | 2026-07-01 | Initial foolproof / regression-free / context-holding protocol |
| 1.1.0 | 2026-07-01 | Added automated daily sync policy and GitHub Actions workflow |

---

**End of AGENTS.md — These rules are binding for every agent session on this repository.**
