# TRUTH_SOURCES.md — RHUFT v6.0 Non-Mock Truth Source Policy

> **Purpose:** Guarantee that every claim and data flow is backed by a valid, non-mocked source of truth.

---

## 1. Truth Hierarchy

```
1. ESTABLISHED MATHEMATICS  [MATH FACT]
2. ESTABLISHED PHYSICS      [EST PHYS]
3. EMPIRICAL OBSERVATIONS   [OBSERVED]
4. COMPUTED/TESTED OUTPUT   (verified by test suite)
5. CONFIGURED PARAMETERS    (user/environment supplied)
6. SPECULATIVE HYPOTHESES   [SPEC] — clearly labeled
7. PHILOSOPHICAL CLAIMS     [PHIL] — clearly labeled
```

Lower numbers override higher numbers when in conflict. Speculative content must never be presented as established.

---

## 2. Rules for Code

1. **No mock data in production paths.**
   - Mocks are allowed ONLY in `*.test.ts` or `__mocks__/` directories.
2. **Constants are truth sources.**
   - `constants.ts` is the single source for π, φ, e, Planck values, etc.
3. **Computed values must be testable.**
   - Every non-trivial computation has a corresponding unit test.
4. **External data must be validated.**
   - Schemas validate all inputs from files, APIs, or user entry.

---

## 3. Rules for Documentation

1. Every factual claim must carry an epistemic tag:
   - `[MATH FACT]` — proven mathematical statement
   - `[EST PHYS]` — established physics
   - `[EST MATH]` — established mathematical derivation
   - `[OBSERVED]` — empirical measurement
   - `[SPEC]` — speculation, clearly marked
   - `[PHIL]` — philosophical interpretation
2. Numerical coincidences must be labeled as such.
3. Do not blur the line between benchmark and prediction.

---

## 4. Rules for UI/Data Visualization

1. Displayed data must come from verified computation or validated input.
2. If a value is interpolated or estimated, label it.
3. If a visualization represents a speculative model, show the `[SPEC]` status.
4. Exportable data must include provenance metadata.

---

## 5. Enforcement

- Any PR adding or modifying truth-critical code or docs must pass a truth-source review.
- Agents must verify labels are preserved during edits.
- Agents must not remove `[SPEC]` or `[PHIL]` tags to make claims appear stronger.

---

**Last updated:** 2026-07-01
