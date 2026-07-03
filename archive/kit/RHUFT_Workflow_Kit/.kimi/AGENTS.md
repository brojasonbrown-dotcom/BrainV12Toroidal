# .kimi/AGENTS.md — Kimi Code CLI Specific Enforcement

> **Read first:** `AGENTS.md` (root). This file adds Kimi-specific enforcement only.

---

## 1. Kimi Context Retention Protocol

### 1.1 Mandatory Files to Load on Every Session Start
Before responding to the first user prompt in a session, the agent MUST load:
1. `AGENTS.md` (root)
2. `.kimi/context/PROJECT_BRAINMAP.md`
3. `.kimi/context/ARCHITECTURE_AUDIT.md`
4. `.kimi/context/SECURITY_CHECKLIST.md`
5. `.kimi/context/UI_UX_RULES.md`
6. `.kimi/context/TRUTH_SOURCES.md`
7. Any active `.kimi/tasks/*.md` file (most recent modified)

### 1.2 Active Task File Rule
- If `.kimi/tasks/` contains any file with status `in_progress`, that task is ACTIVE.
- The agent MUST read the active task file before planning.
- The agent MUST update the task file after every meaningful progress step.
- If multiple tasks are `in_progress`, ask the user which to prioritize or merge them.

### 1.3 Context Compaction Safeguard
- If context grows large, summarize key decisions in the active task file rather than dropping them.
- Re-read the brainmap and task file after compaction.
- Never proceed with implementation after compaction without re-verifying the active plan.

---

## 2. Kimi Tool Usage Rules

### 2.1 Explore Agent Rule
- **Use `subagent_type="explore"`** for any investigation requiring more than 3 searches.
- Launch multiple explore agents in parallel for independent questions.
- Always specify thoroughness: `quick`, `medium`, or `thorough`.
- Explore agents are READ-ONLY. They do not write code.

### 2.2 Coder Agent Rule
- Use `subagent_type="coder"` for focused implementation tasks.
- Provide complete context because subagents do not see parent context automatically.
- Prefer resuming existing subagents when continuing prior work.

### 2.3 Plan Mode Rule
- Use `EnterPlanMode` for new features, architectural decisions, multi-file changes, or unclear requirements.
- Write the plan to a plan file inside `.kimi/plans/`.
- Use `ExitPlanMode` to request user approval.
- In AFK mode, plans auto-approve; still document them.

### 2.4 AskUserQuestion Rule
- Use `AskUserQuestion` when user input materially changes implementation direction.
- Do NOT use it for trivial decisions.
- Do NOT ask "Is this plan OK?" — use `ExitPlanMode` instead.

### 2.5 SetTodoList Rule
- Use `SetTodoList` for all multi-step tasks.
- Update the list after completing each step.
- Do NOT update the list repeatedly without real progress.

---

## 3. Kimi-Specific Workflow Additions

### 3.1 Session Start Checklist
```
[ ] Load AGENTS.md
[ ] Load brainmap and context files
[ ] Identify active task
[ ] Update todo list with current plan
[ ] Confirm toolchain available (node, docker, git)
```

### 3.2 Before Every Edit
```
[ ] Confirm impact analysis complete
[ ] Confirm related structures checked
[ ] Confirm truth-source labels preserved
[ ] Confirm security sweep passed
[ ] Confirm architecture audit passed
```

### 3.3 Before Declaring Completion
```
[ ] Typecheck passes
[ ] Tests pass
[ ] Lint passes
[ ] Security re-audit on diff passes
[ ] Documentation/brainmap updated if structure changed
[ ] Task file updated
[ ] Mandatory phrase spoken: finish plan recommendation
```

---

## 4. Subagent Delegation Pattern

When delegating, include in the prompt:
1. **Goal:** What the subagent must accomplish.
2. **Context:** Relevant files, decisions, and constraints.
3. **Authority:** Read-only or write-allowed.
4. **Output:** Expected format (summary, code, plan, audit report).
5. **Verification:** How the parent will check the result.

---

## 5. Persistent Memory Files

| File | Purpose | Update When |
|------|---------|-------------|
| `.kimi/context/PROJECT_BRAINMAP.md` | Structural map of the repo | Any structural change |
| `.kimi/context/ARCHITECTURE_AUDIT.md` | Architecture rules and current status | Any architecture change |
| `.kimi/context/SECURITY_CHECKLIST.md` | Security baseline and findings | Any security-relevant change |
| `.kimi/context/UI_UX_RULES.md` | UI/UX standards | Any UI work |
| `.kimi/context/TRUTH_SOURCES.md` | Non-mock truth-source policy | Any docs or data change |
| `.kimi/tasks/*.md` | Active task context | Every session on that task |
| `.kimi/plans/*.md` | Approved plans | Before implementation |

---

**End of .kimi/AGENTS.md — Kimi-specific enforcement layer.**
