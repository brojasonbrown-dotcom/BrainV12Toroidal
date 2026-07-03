# WORKFLOW.md — RHUFT v6.0 Deep-Dive Operating Manual

> **Purpose:** Human-readable guide for the foolproof VS Code + Docker + GitHub + Lovable workflow hardcoded in `AGENTS.md` and `.kimi/config.json`.

---

## 1. Philosophy

This workflow exists to make every edit **safe, traceable, and context-aware**. It is deliberately rigorous. The cost of a few extra checks is far lower than the cost of regressions, security bugs, or lost context on a complex project like RHUFT v6.0.

The workflow is **algorithmic**: every task runs through the same state machine. Subtasks and sub-subtasks inherit the same rules.

---

## 2. Toolchain Roles

| Tool | Role in the Workflow |
|------|----------------------|
| **VS Code** | Primary IDE. Loads workspace settings, recommended extensions, and Dev Container config. |
| **Docker + Dev Containers** | Guarantees a reproducible development environment across machines. |
| **GitHub** | Source of truth for code. All verified work lands here. |
| **Lovable** | Design and rapid UI prototyping. Exported code is reviewed, secured, and refactored in VS Code before merging. |
| **Node.js / TypeScript** | Runtime and language for RHUFT framework logic. |
| **npm** | Dependency and script runner. |

---

## 3. The 12-Step State Machine

```
0. INTAKE
1. CONTEXT_LOAD
2. IMPACT_ANALYSIS
3. SECURITY_AUDIT
4. ARCHITECTURE_AUDIT
5. BACKEND_AUDIT
6. FRONTEND_AUDIT
7. PLANNING
8. IMPLEMENTATION
9. VERIFICATION
10. DOCUMENTATION
11. COMPLETION
```

### 3.0 INTAKE
- Parse the user's request.
- Classify the task: `Bug`, `Feature`, `Refactor`, `Docs`, `Security`, `Audit`, `Integration`, `UI/UX`.
- Load `AGENTS.md`.

### 3.1 CONTEXT_LOAD
Mandatory files to read:
- `AGENTS.md`
- `.kimi/AGENTS.md`
- `.kimi/context/PROJECT_BRAINMAP.md`
- `.kimi/context/ARCHITECTURE_AUDIT.md`
- `.kimi/context/SECURITY_CHECKLIST.md`
- `.kimi/context/UI_UX_RULES.md`
- `.kimi/context/TRUTH_SOURCES.md`
- Any active `.kimi/tasks/*.md`

### 3.2 IMPACT_ANALYSIS
- Identify every file the change touches.
- Trace imports upward (who depends on this?) and downward (what does this depend on?).
- Check epistemic labels in docs if documentation is affected.
- Summarize impact before planning.

### 3.3 SECURITY_AUDIT
- Scan for secrets, unsafe eval, injection vectors, path traversal.
- Verify input validation.
- Vet new dependencies with `npm audit`.
- Update `.kimi/context/SECURITY_CHECKLIST.md` if security posture changes.

### 3.4 ARCHITECTURE_AUDIT
- Confirm modularity and separation of concerns.
- Verify no circular dependencies.
- Check that the change aligns with the target folder layout in `PROJECT_BRAINMAP.md`.
- Ensure microservice-ready boundaries are preserved.

### 3.5 BACKEND_AUDIT
- Check API contracts and data flows.
- Verify error handling, retries, timeouts.
- Check async paths for races and leaks.
- Confirm integrations are configurable, not hardcoded.

### 3.6 FRONTEND_AUDIT
- Confirm all meaningful options are discoverable.
- Apply progressive disclosure and sane defaults.
- Check accessibility (WCAG 2.1 AA).
- Verify responsive behavior.
- Ensure panels are modular and independent.

### 3.7 PLANNING
- Break the task into subtasks and, if needed, sub-subtasks.
- Each subtask gets: ID, Goal, Files, Verification Step, Risk.
- For significant architectural or behavioral changes, obtain user approval (use `EnterPlanMode` / `ExitPlanMode`).
- **Rule:** Once a plan is active, no subtask may be skipped without explicit authorization.

### 3.8 IMPLEMENTATION
- Make the minimum viable change.
- Follow existing style and epistemic tags.
- Preserve truth sources; do not mock production logic.
- Keep modules decoupled.
- Write or update tests.

### 3.9 VERIFICATION
Run, at minimum:
```bash
npm run typecheck
npm run test
npm run lint
```
If these scripts don't exist, run the equivalent commands.

Also run:
- Regression checks on affected modules.
- Security re-audit on the diff.

### 3.10 DOCUMENTATION
- Update `PROJECT_BRAINMAP.md` if structure changed.
- Update relevant docs if public interface or behavior changed.
- Update the active task file.
- Update `AGENTS.md` if conventions changed.

### 3.11 COMPLETION
- Summarize work, verification, and residual risks.
- State the next subtask if any remain.
- **MUST say:** "I RECOMMEND WE FULLY FINISH THE CURRENT PLAN BEFORE CHANGING DIRECTION UNLESS YOU EXPLICITLY CHANGE THE PLAN."

---

## 4. Context Retention System

### 4.1 Persistent Memory Files
| File | Purpose |
|------|---------|
| `AGENTS.md` | Universal rules. Loaded first every session. |
| `.kimi/AGENTS.md` | Kimi-specific enforcement. |
| `.kimi/context/PROJECT_BRAINMAP.md` | Structural map. |
| `.kimi/context/ARCHITECTURE_AUDIT.md` | Architecture rules and status. |
| `.kimi/context/SECURITY_CHECKLIST.md` | Security baseline. |
| `.kimi/context/UI_UX_RULES.md` | UI/UX standards. |
| `.kimi/context/TRUTH_SOURCES.md` | Non-mock truth-source policy. |
| `.kimi/tasks/*.md` | Active task context. |
| `.kimi/plans/*.md` | Approved plans. |

### 4.2 Task Lifecycle
1. **Create:** Copy `.kimi/tasks/TEMPLATE.md` → `.kimi/tasks/{slug}.md`.
2. **Activate:** Set status to `in_progress`.
3. **Work:** Update after every meaningful step.
4. **Complete:** Set status to `done`, run verification, archive to `.kimi/tasks/archive/`.

### 4.3 Context Compaction
If context grows too large:
- Summarize key decisions in the active task file.
- Re-read the brainmap and task file after compaction.
- Never implement after compaction without re-verifying the active plan.

---

## 5. VS Code + Docker Workflow

### 5.1 First-Time Setup
1. Open repository in VS Code.
2. Install recommended extensions (prompted by VS Code).
3. Run **"Dev Containers: Reopen in Container"**.
4. Container builds with Node.js, Git, Docker CLI, and extensions.
5. Run `npm install` inside the container.

### 5.2 Daily Development Loop
1. Pull latest from GitHub.
2. Check active task in `.kimi/tasks/`.
3. Make changes following the 12-step state machine.
4. Run verification suite inside the container.
5. Commit atomic changes (only when explicitly asked).
6. Push to GitHub (only when explicitly asked).

### 5.3 Docker Compose Services
```bash
# Development server
docker-compose up rhuft-dev

# Run tests
docker-compose --profile test up rhuft-test

# Serve docs
docker-compose --profile docs up rhuft-docs
```

---

## 6. GitHub + Lovable Integration

### 6.1 GitHub as Source of Truth
- All production code lives in the GitHub repository.
- Branches: `main` (stable), `feature/*` or `fix/*` (work in progress).
- Every merge requires passing typecheck, tests, lint, and security checklist.

### 6.2 Automated Daily Sync
To ensure the repository is never stale, an automated daily sync runs if no commit has been made in the last 24 hours.

**Triggers:**
- GitHub Actions: `.github/workflows/daily-sync.yml` runs on a schedule (`0 6 * * *`) and supports manual dispatch.
- Local/Cron: `scripts/daily-sync.sh` can be run manually or added to cron.

**Behavior:**
1. Check the timestamp of the last commit.
2. If it is less than 24 hours old, skip.
3. If it is 24 hours or older:
   - Pull the latest changes from the remote with `--rebase`.
   - Run the verification suite.
   - Create/update `.last-auto-sync` with the current UTC timestamp.
   - Commit with message: `chore: daily sync marker [skip ci]`.
   - Push to the current branch.

**Safety:**
- The sync only commits a marker file; it does not auto-commit human work in progress.
- If `git pull --rebase` encounters conflicts, the workflow fails and requires human intervention.
- Manual commits within the 24-hour window suppress the automated run.

### 6.3 Lovable Workflow
1. Design UI/prototype in Lovable.
2. Export/sync generated code to a feature branch.
3. Open the branch in VS Code Dev Container.
4. Review, refactor, and secure the exported code.
5. Run full verification suite.
6. Merge only after all audits pass.

**Never let Lovable output override verified framework logic without review.**

---

## 7. Subtask & Plan Fidelity Rules

- The active plan is the canonical plan.
- Subtasks and sub-subtasks inherit all workflow steps.
- A subtask may only be skipped if the user explicitly authorizes a plan change.
- When the user asks to switch context, the agent must recommend finishing the current plan first.

---

## 8. When Things Go Wrong

| Situation | Response |
|-----------|----------|
| Verification fails | Stop. Fix the issue. Do not document around it. |
| Security issue found | Stop. Patch or escalate. Do not proceed. |
| Architecture conflict | Stop. Discuss with user or revise plan. |
| Ambiguous requirements | Ask clarifying questions before planning. |
| Context lost/compacted | Re-read brainmap and active task file. |

---

## 9. Summary Checklist for Agents

- [ ] Loaded all mandatory context files.
- [ ] Performed impact analysis.
- [ ] Ran security audit.
- [ ] Ran architecture audit.
- [ ] Ran backend/integration audit.
- [ ] Ran frontend/UI/UX audit.
- [ ] Created or updated plan with subtasks.
- [ ] Implemented with minimal, safe changes.
- [ ] Verified with typecheck, tests, lint.
- [ ] Updated brainmap/docs if needed.
- [ ] Recommended finishing the plan.

---

**End of WORKFLOW.md — Follow this on every task.**
