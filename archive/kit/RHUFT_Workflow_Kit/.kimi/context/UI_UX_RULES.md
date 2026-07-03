# UI_UX_RULES.md — RHUFT v6.0 User Interface & Experience Standards

> **Purpose:** Ensure all UI work is discoverable, friendly, accessible, modular, and truthful.

---

## 1. Core UX Principles

### 1.1 Discoverability
- **All meaningful options must be findable.**
- Primary actions are visible by default.
- Secondary/advanced actions are one click away (gear, "Advanced", ellipsis).
- Everything hidden must be documented via tooltip, label, or help text.

### 1.2 Sane Defaults
- The default configuration must satisfy 80% of users.
- Do not force users to configure before seeing value.
- Remember user preferences across sessions.

### 1.3 Progressive Disclosure
```
Level 0: Essential controls only (start, stop, main input)
Level 1: Common options (parameters, presets)
Level 2: Advanced options (tuning, export formats)
Level 3: Expert/debug options (logs, raw data, internals)
```

### 1.4 Truthful Feedback
- Status indicators reflect real state, never mocked.
- Use universal truth sources for displayed data.
- If data is stale or loading, say so clearly.

---

## 2. Accessibility (WCAG 2.1 AA)

- [ ] All interactive elements have accessible labels.
- [ ] Keyboard navigation works for every action.
- [ ] Focus indicators are visible.
- [ ] Color contrast ratio ≥ 4.5:1 for normal text.
- [ ] Do not rely on color alone to convey meaning.
- [ ] Provide ARIA roles/states where native semantics are insufficient.

---

## 3. Panel Modularity

Every UI panel MUST be:
- **Self-contained:** Own state, styles, and tests.
- **Lazy-loadable:** Can be rendered on demand.
- **Independent:** Failure of one panel does not crash others.
- **Communicative:** Uses typed events or a message bus; no direct DOM coupling.

---

## 4. Responsive Design

- [ ] Layout adapts to 320px–2560px widths.
- [ ] Touch targets are ≥ 44×44 px.
- [ ] Text remains readable without horizontal scrolling at mobile widths.
- [ ] Complex visualizations degrade gracefully on small screens.

---

## 5. Safety & Confirmation

- Destructive actions require confirmation.
- Long-running computations show progress and allow cancellation.
- Unexpected errors display friendly messages and log details internally.
- Auto-save drafts where data loss is possible.

---

## 6. RHUFT-Specific UI Guidelines

- Mathematical visualizations must label units and scales.
- Epistemic status of claims must be visible (e.g., `[SPEC]` patterns shown differently than `[OBSERVED]`).
- Do not present speculative framework outputs as empirical predictions.
- Provide export options for raw data and rendered images.

---

**Last updated:** 2026-07-01
