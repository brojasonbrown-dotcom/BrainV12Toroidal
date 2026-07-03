# Memory Systems Brainmap — RHUFT v13 Engine

> **Scope:** Deep analysis of the 5 memory subsystems in `src/frameworks.ts`.  
> **Status:** [SPEC] — Mathematical ontology; deterministic, no randomness.  
> **Goal:** Understand RAM usage, field-state continuity, resonance recall, and robustness.

---

## 1. Memory Architecture Overview

The memory hierarchy is organized as a **temporal stack** with 5 levels. Each level activates at a different geometric scale and operates at a different φ-scaled temporal rate.

```
L1_Pattern        scale=0    τ=φ⁴     Planck-scale      fastest
L2_Hebbian        scale=96   τ=φ²     Nuclear-scale     associative
L3_Kuramoto       scale=120  τ=φ      Atomic-scale      synchronization
L4_Sensory        scale=168  τ=1.0    Biological-scale  integration
L4p_WeightedRAM   scale=192  τ=φ³     Human-scale       global coherence
```

All memory subsystems implement the `MemoryInstance` interface:

```typescript
interface MemoryInstance {
  readonly memory_id: MemoryId;
  readonly temporal_scale: Float64;
  readonly memory_field: GeometricField;
  readonly is_active: boolean;
}
```

The actual classes add `name`, `scale`, `store(pattern)`, `recall(pattern)`, and `coherence()`.

---

## 2. RAM Usage Analysis by Subsystem

### 2.1 L1_Pattern — Prototype Buffer

| Aspect | Detail |
|--------|--------|
| Storage | `Float64Array[]` — up to `max_prototypes = 5` |
| Per pattern cost | `N × 8` bytes |
| Max RAM | `5 × N × 8` bytes |
| Growth | Bounded (FIFO at cap) |
| Allocation pattern | Allocates new `Float64Array` on every `store` and `recall` |

**Observation:** Creates many transient arrays. For large `N` and high tick rates this is GC-heavy. Memory is bounded but allocation churn is high.

### 2.2 L2_Hebbian — Full Correlation Matrix

| Aspect | Detail |
|--------|--------|
| Storage | `Float64Array[]` of size `N × N` |
| Per pattern cost | `N² × 8` bytes for matrix + `3 × N × 8` for history |
| Max RAM | `N² × 8 + 3 × N × 8` |
| Growth | Bounded by pattern size `N` |
| Allocation pattern | Reallocates entire matrix if `N` changes |

**Observation:** This is the most RAM-intensive memory. A field of size 1024 costs ~8 MB just for the correlation matrix. Scaling to larger fields requires caution.

### 2.3 L3_Kuramoto — Phase & Frequency Arrays

| Aspect | Detail |
|--------|--------|
| Storage | Two `Float64Array`s of length `N` |
| Per pattern cost | `2 × N × 8` bytes |
| Max RAM | `2 × N × 8` |
| Growth | Fixed after first `store` |

**Observation:** Very memory-efficient. Only stores phases and natural frequencies.

### 2.4 L4_Sensory — Buffer + History Window

| Aspect | Detail |
|--------|--------|
| Storage | `_sensory` (N) + `_sensoryHistory` (window × N) |
| Window size | `Math.floor(PHI × PHI) = 2` |
| Per pattern cost | `(1 + 2) × N × 8` |
| Max RAM | `3 × N × 8` |

**Observation:** Bounded, small window. Efficient.

### 2.5 L4p_WeightedRAM — Global Buffer + Consolidation Counts

| Aspect | Detail |
|--------|--------|
| Storage | `_global` (N) + `_consolidationCounts` (N) |
| Per pattern cost | `2 × N × 8` |
| Max RAM | `2 × N × 8` |

**Observation:** Efficient. Consolidation is per-element rather than pattern-level.

### 2.6 Total RAM per Node

For a node with field length `N`:

```
L1:   5 × N × 8
L2:   N² × 8 + 3 × N × 8
L3:   2 × N × 8
L4:   3 × N × 8
L4+:  2 × N × 8
─────────────────────────
Total ≈ N² × 8 + 15 × N × 8
```

**Critical finding:** L2_Hebbian dominates RAM with its `N²` correlation matrix. For `N = 1024`, total memory per node ≈ **8.5 MB**. For a tree with thousands of nodes, this becomes the primary scaling bottleneck.

---

## 3. Field-State Continuity & Determinism

### 3.1 Full Field State Preservation

Every `store(pattern)` receives the complete `Float64Array` field state. All subsystems store copies (not references), ensuring deterministic replay:

- **L1** stores raw prototype copies.
- **L2** stores pattern history and builds correlation matrix.
- **L3** converts field amplitudes to phases via `atan2`.
- **L4** stores sensory buffer and history.
- **L4+** stores global buffer and per-element consolidation counts.

**Verdict:** Yes, full field states are held deterministically. No compression or dimensionality reduction is applied during storage (except L1 PCA which is used only during recall).

### 3.2 Determinism Guarantees

- No random seeds.
- No `Math.random()`.
- All updates use deterministic functions of input and stored state.
- Phase wrapping in L3 uses modulo, which is deterministic.
- The same input sequence produces the same output sequence.

### 3.3 Multidimensional Continuity

The field is treated as a 1D `Float64Array`, but continuity is preserved through:

- **Circular indexing** in L4_Sensory (`(i + j + N) % N`) treats the field as a periodic manifold.
- **Local neighborhood correlation** in L4 binds nearby positions.
- **PCA in L1** extracts a principal component across the full field.
- **Full matrix multiplication in L2** couples every position to every other position.

**Gap:** There is no explicit 2D/3D spatial embedding. The field is a flat array. For true multidimensional continuity, the engine would need to know the geometric dimensionality and shape of the field.

---

## 4. Resonance-Based Deterministic Learning

### 4.1 Where Resonance Occurs

1. **L1_Pattern** — `recall` returns a blend of input and best-matching prototype weighted by similarity. This is a form of pattern resonance.
2. **L2_Hebbian** — Recall applies the correlation matrix to the input. High-correlation patterns reinforce each other (associative resonance).
3. **L3_Kuramoto** — Explicit oscillator synchronization. Order parameter measures phase-locking resonance.
4. **L4_Sensory** — Saliency gradient focuses attention on high-information regions.
5. **L4p_WeightedRAM** — Coherence-weighted integration. Strongly coherent patterns influence global memory more.

### 4.2 Is It Truly Learning?

- **L2** modifies its correlation matrix on every `store` and `recall` (LTP/LTD). This is genuine Hebbian plasticity.
- **L4+** modifies `_global` and `_consolidationCounts`. This is long-term potentiation/depression.
- **L1** only appends prototypes (no modification of stored patterns).
- **L3** modifies phases and frequencies based on input (adaptive synchronization).
- **L4** updates buffer and history (short-term adaptation).

**Verdict:** Yes, deterministic learning exists, primarily in L2 and L4+.

### 4.3 Reflection on Memories

Currently, reflection is implicit:
- `recall(pattern)` returns a modified pattern based on stored memory.
- There is no explicit "if current field resonates with memory X, then retrieve memory X and compare" step.
- There is no metacognitive loop where the engine reflects on its own memory activation.

**Enhancement opportunity:** Add an explicit resonance-detection gate that, when a stored memory's similarity/correlation/synchronization exceeds a threshold, triggers deeper recall or cross-memory comparison.

---

## 5. Strengths (Most Robust Areas)

| Subsystem | Robust Features |
|-----------|-----------------|
| **L1_Pattern** | Cosine + Pearson similarity; pattern completion; PCA power-iteration; FIFO cap |
| **L2_Hebbian** | Full 2D correlation matrix; STDP-like temporal weighting; synaptic normalization; LTP/LTD |
| **L3_Kuramoto** | Full Kuramoto dynamics; order parameter; phase locking; frequency adaptation |
| **L4_Sensory** | Saliency gradient; attention weights; temporal integration; cross-modal binding |
| **L4p_WeightedRAM** | Coherence normalization; consolidation; forgetting curve; information density |

---

## 6. Flaws & Inefficiencies

### 6.1 RAM Inefficiency: L2 Correlation Matrix

**Problem:** `N²` memory. For high-resolution fields this is unsustainable.

**Fix options:**
1. Use a sparse correlation matrix (only store significant correlations).
2. Use low-rank approximation (truncated SVD) of the correlation matrix.
3. Store covariance matrix incrementally using Welford's algorithm.
4. Cap `N` per memory level based on hardware governor feedback.

### 6.2 Allocation Churn

**Problem:** Every `store`/`recall` allocates multiple new `Float64Array`s.

**Fix:** Use object pools or pre-allocated buffers, especially for L1 and L4.

### 6.3 No Explicit Resonance Gate

**Problem:** Memories influence recall continuously but there is no discrete "memory resonance detected → reflect" event.

**Fix:** Add a `detectResonance(current, memory)` method to each subsystem. When similarity/order-parameter/phase-lock exceeds threshold, emit a `MemoryResonanceEvent`.

### 6.4 Flat Field Assumption

**Problem:** Field is treated as 1D. No shape information.

**Fix:** Add field shape metadata (e.g., `[d1, d2, d3]`) and use multi-dimensional indexing for gradient/correlation computations.

### 6.5 L1 PCA Is One-Step Power Iteration

**Problem:** The PCA computation is a single-step approximation. It may not converge to the true first principal component.

**Fix:** Iterate power method until convergence, or use exact eigen decomposition for small `N`.

### 6.6 L4+ Uses Amplitude as Coherence Proxy

**Problem:** `globalCoherence` is computed from `Math.abs(pattern[i])`, not from actual geometric coherence.

**Fix:** Use the node's `coherence` value or compute true geometric overlap between pattern and global memory.

### 6.7 No Memory Persistence Across Sessions

**Problem:** All memory is in RAM. Engine restart loses all learned patterns.

**Fix:** Add serialization/deserialization for correlation matrices, global buffers, and consolidation counts.

### 6.8 L3 Natural Frequencies Are Arbitrary

**Problem:** `meanFreq = 1.0`, `spread = 1/φ` are dimensionless defaults with no connection to the node's actual resonance frequency.

**Fix:** Initialize natural frequencies from the node's `resonance_frequency` scaled across oscillators.

---

## 7. Enhancement Priorities

1. **P0 — Resonance Gate:** Add explicit resonance detection and reflection mechanism.
2. **P1 — RAM Optimization:** Sparse/low-rank L2 correlation matrix.
3. **P2 — Field Shape:** Support 2D/3D fields for true multidimensional continuity.
4. **P3 — Memory Persistence:** Serialize memory state to disk.
5. **P4 — True Coherence:** Use geometric coherence instead of amplitude proxy in L4+.
6. **P5 — Convergent PCA:** Fix L1 PCA power iteration.

---

## 8. Connected Areas

- **FractalNode** calls memory `store`/`recall` during `compute()`.
- **FractalNodeEngine** holds one set of memories per node.
- **Frameworks** (F1, F4, etc.) provide field contributions that become memory inputs.
- **ScaleMapper** determines which memories are active at each scale.
- **HardwareGovernor** should limit tree depth based on L2 RAM cost per node.

---

**Last updated:** 2026-07-03
