/**
 * RHUFT v6.0 — Scale Mapper
 *
 * Maps scale indices n to their complete configuration, determines framework
 * activation, memory activation, dimensional resonance, and dominant constants.
 *
 * Epistemic Status: [SPEC] + [PHIL] — Mathematical ontology, not predictive physics.
 * All numeric values are IEEE-754 Float64 (≈15 significant digits).
 * Strictly deterministic — no random seeds.
 */

import type {
  Float64,
  FrameworkCharacteristic,
  FrameworkId,
  MemoryId,
  MemoryThreshold,
  ResonanceStrength,
  ScaleConfig,
  ScaleIndex,
} from "./types.ts";

import {
  COHERENCE_THRESHOLD,
  DIMENSIONAL_RESONANCE_BY_SCALE,
  DOMINANT_CONSTANTS_BY_SCALE,
  FRAMEWORK_CHARACTERISTICS,
  MEMORY_THRESHOLDS,
  PHI,
  PHYSICAL_CONSTANTS_BY_SCALE,
  PLANCK_FREQUENCY,
  PLANCK_LENGTH,
  QRF_CRITICAL_SCALE,
  SCALE_CONFIG_SNAPSHOT,
  SCALE_INDICES,
  SCALE_NAMES,
} from "./core/constants.ts";

// ───────────────────────────────────────────────────────────────────────────────
// 1. ScaleConfig Interface (re-exported for local reference)
// ───────────────────────────────────────────────────────────────────────────────

export interface ScaleConfigLocal extends ScaleConfig {}

// ───────────────────────────────────────────────────────────────────────────────
// 2. ScaleMapper Class
// ───────────────────────────────────────────────────────────────────────────────

/**
 * Maps scale indices to their RHUFT v6.0 configurations.
 *
 * [SPEC] — The scale law L(n) = ℓ_P · φⁿ and QRF attenuation qrf(n) = φ^(-n/89)
 * produce order-of-magnitude alignments with observed physical scales.
 * This class is scale-invariant by construction: all computations use φ-scaled
 * ratios, not absolute dimensional units.
 */
export class ScaleMapper {
  /**
   * Read-only map of framework characteristics indexed by framework ID.
   * Deterministically initialized from FRAMEWORK_CHARACTERISTICS array.
   */
  private readonly _frameworkMap: ReadonlyMap<FrameworkId, FrameworkCharacteristic>;

  /**
   * Read-only map of memory thresholds indexed by memory ID.
   * Deterministically initialized from MEMORY_THRESHOLDS array.
   */
  private readonly _memoryMap: ReadonlyMap<MemoryId, MemoryThreshold>;

  /**
   * Read-only set of canonical scale indices for O(1) membership testing.
   */
  private readonly _scaleIndexSet: ReadonlySet<ScaleIndex>;

  constructor() {
    // Build deterministic lookup maps from the constant arrays.
    const fwMap = new Map<FrameworkId, FrameworkCharacteristic>();
    for (const fw of FRAMEWORK_CHARACTERISTICS) {
      fwMap.set(fw.id, fw);
    }
    this._frameworkMap = fwMap;

    const memMap = new Map<MemoryId, MemoryThreshold>();
    for (const mem of MEMORY_THRESHOLDS) {
      memMap.set(mem.id, mem);
    }
    this._memoryMap = memMap;

    this._scaleIndexSet = new Set<ScaleIndex>(SCALE_INDICES);
  }

  // ───────────────────────────────────────────────────────────────────────────
  // 3. Public API: Scale Configuration Retrieval
  // ───────────────────────────────────────────────────────────────────────────

  /**
   * Returns the canonical ScaleConfig for the exact scale index n.
   * Throws if n is not one of the 10 canonical scale indices.
   *
   * @param n — Scale index (must be 0, 96, 120, 134, 168, 192, 235, 250, 270, or 292)
   */
  get_config(n: ScaleIndex): ScaleConfig {
    if (!this._scaleIndexSet.has(n)) {
      throw new Error(
        `ScaleMapper.get_config: invalid scale index ${n}. ` +
          `Must be one of: ${SCALE_INDICES.join(", ")}.`
      );
    }
    return SCALE_CONFIG_SNAPSHOT[n];
  }

  /**
   * Returns the ScaleConfig for the scale index closest to n.
   * If n exactly matches a canonical scale, returns that config.
   * Otherwise, selects the canonical scale with the smallest absolute difference.
   *
   * [SPEC] — Scale indices are order-of-magnitude alignments; interpolation
   * between canonical scales is not physically meaningful in this ontology.
   */
  get_closest_config(n: number): ScaleConfig {
    // Fast path: exact match
    if (this._scaleIndexSet.has(n as ScaleIndex)) {
      return SCALE_CONFIG_SNAPSHOT[n as ScaleIndex];
    }

    // Search for closest canonical scale by absolute difference.
    let closestN: ScaleIndex = SCALE_INDICES[0];
    let minDiff: number = Math.abs(n - closestN);

    for (const candidate of SCALE_INDICES) {
      const diff = Math.abs(n - candidate);
      if (diff < minDiff) {
        minDiff = diff;
        closestN = candidate;
      }
    }

    return SCALE_CONFIG_SNAPSHOT[closestN];
  }

  /**
   * Returns all canonical scale configurations in ascending order of n.
   */
  get_all_configs(): readonly ScaleConfig[] {
    return SCALE_INDICES.map((n) => SCALE_CONFIG_SNAPSHOT[n]);
  }

  // ───────────────────────────────────────────────────────────────────────────
  // 4. Public API: Framework Activation
  // ───────────────────────────────────────────────────────────────────────────

  /**
   * Computes QRF attenuation qrf(n) = φ^(-n/89) for an arbitrary scale index.
   *
   * [MATH] — Deterministic power law; no randomness or approximation beyond Float64.
   */
  compute_qrf(n: number): Float64 {
    const exponent = -n / QRF_CRITICAL_SCALE;
    return Math.pow(PHI, exponent) as Float64;
  }

  /**
   * Determines if a framework is ACTIVE at scale n.
   *
   * Activation rule: framework is ACTIVE iff qrf(n) > qrf_fw(framework).
   * [SPEC] — Framework activation is a binary threshold determined by comparing
   * the scale's QRF attenuation to the framework's characteristic QRF threshold.
   */
  is_framework_active(n: number, framework: FrameworkId): boolean {
    const fw = this._frameworkMap.get(framework);
    if (!fw) {
      throw new Error(
        `ScaleMapper.is_framework_active: unknown framework "${framework}". ` +
          `Known frameworks: ${Array.from(this._frameworkMap.keys()).join(", ")}.`
      );
    }
    const qrfN = this.compute_qrf(n);
    return qrfN > fw.qrf_fw;
  }

  /**
   * Returns all frameworks active at scale n, sorted by qrf_fw descending.
   */
  get_active_frameworks(n: number): readonly FrameworkId[] {
    const active: FrameworkId[] = [];
    for (const fw of FRAMEWORK_CHARACTERISTICS) {
      if (this.is_framework_active(n, fw.id)) {
        active.push(fw.id);
      }
    }
    // Sort by characteristic qrf_fw descending (most fundamental first)
    return active.sort((a, b) => {
      const fwA = this._frameworkMap.get(a)!;
      const fwB = this._frameworkMap.get(b)!;
      return fwB.qrf_fw - fwA.qrf_fw;
    });
  }

  /**
   * Returns the characteristic scale n_fw for a given framework.
   */
  get_framework_scale(framework: FrameworkId): number {
    const fw = this._frameworkMap.get(framework);
    if (!fw) {
      throw new Error(
        `ScaleMapper.get_framework_scale: unknown framework "${framework}".`
      );
    }
    return fw.n_fw;
  }

  // ───────────────────────────────────────────────────────────────────────────
  // 5. Public API: Memory Activation
  // ───────────────────────────────────────────────────────────────────────────

  /**
   * Determines if a memory subsystem is ACTIVE at scale n.
   *
   * Activation rule: memory is ACTIVE iff n >= activation_scale(memory).
   * [SPEC] — Based on CEAI 4-layer nested memory fields (v6_tech_05).
   * Memory levels activate at progressively larger scales (φ-scaled temporal hierarchy).
   */
  is_memory_active(n: number, memory: MemoryId): boolean {
    const mem = this._memoryMap.get(memory);
    if (!mem) {
      throw new Error(
        `ScaleMapper.is_memory_active: unknown memory "${memory}". ` +
          `Known memory levels: ${Array.from(this._memoryMap.keys()).join(", ")}.`
      );
    }
    return n >= mem.activation_scale;
  }

  /**
   * Returns all memory subsystems active at scale n, sorted by activation_scale ascending.
   */
  get_active_memory(n: number): readonly MemoryId[] {
    const active: MemoryId[] = [];
    for (const mem of MEMORY_THRESHOLDS) {
      if (this.is_memory_active(n, mem.id)) {
        active.push(mem.id);
      }
    }
    // Already in ascending order by activation_scale (constructor ordering)
    return active;
  }

  /**
   * Returns the temporal scale factor for a given memory subsystem.
   */
  get_memory_temporal_scale(memory: MemoryId): Float64 {
    const mem = this._memoryMap.get(memory);
    if (!mem) {
      throw new Error(
        `ScaleMapper.get_memory_temporal_scale: unknown memory "${memory}".`
      );
    }
    return mem.temporal_scale_factor;
  }

  // ───────────────────────────────────────────────────────────────────────────
  // 6. Public API: Dimensional Resonance
  // ───────────────────────────────────────────────────────────────────────────

  /**
   * Returns the dimensional resonance strength for a given scale and direction.
   *
   * [PHIL] — Resonance strengths are metaphorical labels for scale-coupling:
   *   "Strong"    → high-fidelity information transfer
   *   "Moderate"  → partial information transfer with some attenuation
   *   "Weak"      → low-fidelity transfer, mostly noise
   *   "None"      → no information transfer across this boundary
   */
  get_dimensional_resonance(
    n: ScaleIndex,
    direction: "up" | "down" | "horizontal"
  ): ResonanceStrength {
    const resonance = DIMENSIONAL_RESONANCE_BY_SCALE[n];
    if (!resonance) {
      throw new Error(
        `ScaleMapper.get_dimensional_resonance: unknown scale ${n}.`
      );
    }
    const strength = resonance[direction];
    // Type narrowing: assert that the stored value is a valid ResonanceStrength
    if (
      strength !== "Strong" &&
      strength !== "Moderate" &&
      strength !== "Weak" &&
      strength !== "None"
    ) {
      throw new Error(
        `ScaleMapper.get_dimensional_resonance: invalid resonance strength "${strength}" for scale ${n}, direction ${direction}.`
      );
    }
    return strength;
  }

  /**
   * Returns the complete DimensionalResonance record for a given scale.
   */
  get_all_resonance(n: ScaleIndex): {
    readonly up: ResonanceStrength;
    readonly down: ResonanceStrength;
    readonly horizontal: ResonanceStrength;
  } {
    return {
      up: this.get_dimensional_resonance(n, "up"),
      down: this.get_dimensional_resonance(n, "down"),
      horizontal: this.get_dimensional_resonance(n, "horizontal"),
    };
  }

  // ───────────────────────────────────────────────────────────────────────────
  // 7. Public API: Dominant Constants
  // ───────────────────────────────────────────────────────────────────────────

  /**
   * Returns the dominant incommensurable constants at scale n.
   *
   * [PHIL] — These assignments are interpretive mappings from the geometric
   * ontology to scale-specific phenomena; not derivable from first principles.
   */
  get_dominant_constants(n: ScaleIndex): readonly string[] {
    const constants = DOMINANT_CONSTANTS_BY_SCALE[n];
    if (!constants) {
      throw new Error(
        `ScaleMapper.get_dominant_constants: unknown scale ${n}.`
      );
    }
    return constants;
  }

  // ───────────────────────────────────────────────────────────────────────────
  // 8. Public API: Scale Law Computations
  // ───────────────────────────────────────────────────────────────────────────

  /**
   * Computes the scale law L(n) = ℓ_P · φⁿ.
   *
   * [SPEC] — Characteristic length at scale n. Returns Float64 (≈15 digits).
   */
  compute_length(n: number): Float64 {
    return (PLANCK_LENGTH * Math.pow(PHI, n)) as Float64;
  }

  /**
   * Computes the harmonic cascade f(n) = f_P · φ⁻ⁿ.
   *
   * [SPEC] — Characteristic frequency at scale n. Returns Float64 (≈15 digits).
   */
  compute_frequency(n: number): Float64 {
    return (PLANCK_FREQUENCY * Math.pow(PHI, -n)) as Float64;
  }

  /**
   * Computes the coherence value C(n) = qrf(n) = φ^(-n/89).
   *
   * [SPEC] — In the RHUFT ontology, C(n) is identified with qrf(n) for the
   * canonical scales; this is a geometric simplification, not a physical claim.
   */
  compute_coherence(n: number): Float64 {
    return this.compute_qrf(n);
  }

  /**
   * Determines coherence status: COHERENT if C(n) > λ, else NEAR-CRITICAL.
   */
  get_coherence_status(n: number): "COHERENT" | "NEAR-CRITICAL" {
    const c = this.compute_coherence(n);
    return c > COHERENCE_THRESHOLD ? "COHERENT" : "NEAR-CRITICAL";
  }

  // ───────────────────────────────────────────────────────────────────────────
  // 9. Public API: Physical Constants
  // ───────────────────────────────────────────────────────────────────────────

  /**
   * Returns the physical constants associated with a canonical scale.
   *
   * [SPEC] — Order-of-magnitude correspondences; not predictive of precise values.
   */
  get_physical_constants(n: ScaleIndex): Readonly<Record<string, Float64>> {
    const constants = PHYSICAL_CONSTANTS_BY_SCALE[n];
    if (!constants) {
      throw new Error(
        `ScaleMapper.get_physical_constants: unknown scale ${n}.`
      );
    }
    return constants;
  }

  // ───────────────────────────────────────────────────────────────────────────
  // 10. Utility Methods
  // ───────────────────────────────────────────────────────────────────────────

  /**
   * Returns the canonical scale name for a given scale index.
   */
  get_scale_name(n: ScaleIndex): string {
    return SCALE_NAMES[n] ?? `Unknown(${n})`;
  }

  /**
   * Returns the next larger canonical scale index, or null if at Cosmic scale.
   */
  get_next_scale_up(n: ScaleIndex): ScaleIndex | null {
    const idx = SCALE_INDICES.indexOf(n);
    if (idx < 0 || idx >= SCALE_INDICES.length - 1) {
      return null;
    }
    return SCALE_INDICES[idx + 1];
  }

  /**
   * Returns the next smaller canonical scale index, or null if at Planck scale.
   */
  get_next_scale_down(n: ScaleIndex): ScaleIndex | null {
    const idx = SCALE_INDICES.indexOf(n);
    if (idx <= 0) {
      return null;
    }
    return SCALE_INDICES[idx - 1];
  }

  /**
   * Returns the total number of canonical scales (10).
   */
  get_scale_count(): number {
    return SCALE_INDICES.length;
  }
}
