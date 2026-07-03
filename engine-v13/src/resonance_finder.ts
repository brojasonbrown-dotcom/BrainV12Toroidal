/**
 * RHUFT v6.0 — Fractal Node Engine: 144,000 Hz Resonance Convergence Finder
 *
 * Epistemic Status: [SPEC] + [PHIL] — Mathematical ontology, not predictive physics.
 *
 * The user's vision: "the engine finds a way to create a field almost like DNA and
 * biology programs cell membranes into stable positions... it finds its most absolute
 * complex and stable point resonance convergences of 144,000 Hz"
 *
 * In RHUFT:
 *   - 144 = F_12 (12th Fibonacci number). [SPEC]
 *   - 144,000 = 144 × 1000 = 12³ × 10³ (dozenal-decimal bridge). [PHIL]
 *   - Base frequency = 144 Hz. [SPEC]
 *   - 144,000 Hz = 144 × 1000 = 1000 × base frequency. [SPEC]
 *
 * The harmonic cascade follows: f(n) = f_P · φ^(-n) where f_P ≈ 1.855×10^43 Hz. [SPEC]
 * At scale n=192 (Human), f(n) ≈ 1.39 kHz. At n=168 (Biological), f(n) ≈ 144 MHz.
 * The 144,000 Hz target sits between these scales, requiring inter-scale resonance. [PHIL]
 *
 * Critical Constraints:
 *   - TypeScript strict mode compliant (no `any`, explicit types everywhere).
 *   - IEEE-754 Float64 (≈15 significant digits) — explicitly noted in comments.
 *   - No random seeds — fully deterministic by construction.
 *   - φ-scale-proportional parameters throughout.
 *   - Scale-invariant by construction.
 *   - All RHUFT claims tagged with epistemic labels in comments.
 */

import {
  RHUFT_CONSTANTS,
  PLANCK_FREQUENCY,
  qrf_attenuation,
  coherence,
  LAMBDA,
} from "./types.ts";

import type {
  FractalNode,
  ResonanceConvergence,
  MembraneGeometry,
} from "./types.ts";

import { MembraneStabilizer } from "./membrane_stabilizer.ts";

/** φ — exact to Float64 (≈15 digits). [SPEC] */
const PHI = RHUFT_CONSTANTS.PHI;

/** π — exact to Float64 (≈15 digits). [SPEC] */
const PI = RHUFT_CONSTANTS.PI;

/** Planck frequency f_P = c/ℓ_P — Float64 (≈15 digits). [PHIL] — Physical correspondence approximate. */
const F_P = PLANCK_FREQUENCY;

/** Coherence threshold λ = 1/φ² — Float64 (≈15 digits). [SPEC] */
const LAMBDA_VAL = LAMBDA;

/** 144 = F_12 (12th Fibonacci number) — exact integer. [SPEC] */
const F_12 = 144 as const;

/** Base frequency: 144 Hz. [SPEC] */
const BASE_FREQUENCY = F_12; // 144 Hz

/** 1000 = 10³ — decimal scaling factor. [SPEC] */
const THOUSAND = 1000 as const;

/**
 * 144,000 Hz Resonance Convergence Finder.
 *
 * Searches for resonant frequencies across a fractal node tree where multiple scales
 * align at harmonic frequencies, creating stable "absolute complex stable points." [PHIL]
 */
export class ResonanceFinder {
  /** Target frequency: 144,000 Hz = 144 × 1000. [SPEC] */
  readonly target_frequency: number = F_12 * THOUSAND; // 144000 Hz

  /** Base frequency: 144 Hz = F_12. [SPEC] */
  readonly base_frequency: number = BASE_FREQUENCY; // 144 Hz

  /**
   * Search for resonance convergences across a fractal node tree.
   *
   * A resonance convergence occurs when multiple scales align at harmonic
   * frequencies of the target cascade. [SPEC] + [PHIL]
   *
   * IEEE-754 Float64: all frequency computations are in log-space for numerical stability.
   *
   * @param root_node — Root of the fractal node tree.
   * @returns ResonanceConvergence record.
   */
  find_resonance(root_node: FractalNode): ResonanceConvergence {
    // First, find the absolute stable point (best possible convergence). [SPEC]
    const stable: ResonanceConvergence = this.find_absolute_stable_point(root_node);

    // If the stable point is close to target, return it; otherwise return
    // the best convergence near target_frequency. [SPEC]
    const target_log: number = Math.log(this.target_frequency);
    const stable_log: number = Math.log(stable.frequency);
    const log_diff: number = Math.abs(stable_log - target_log);

    // Tolerance: within φ semitones (log-scale). [SPEC]
    const log_tolerance: number = Math.log(PHI);

    if (log_diff <= log_tolerance) {
      return stable;
    }

    // Otherwise, sweep around target frequency and pick best. [SPEC]
    const sweep_results = this.sweep_frequencies(
      root_node,
      this.target_frequency / PHI,
      this.target_frequency * PHI,
      144 // [PHIL] — 144 steps (F_12 resolution)
    );

    let best_freq: number = this.target_frequency;
    let best_stability: number = 0.0;

    for (const result of sweep_results) {
      if (result.stability > best_stability) {
        best_stability = result.stability;
        best_freq = result.frequency;
      }
    }

    const measure = this.measure_stability(root_node, best_freq);

    return {
      frequency: best_freq,
      stability_score: measure.stability,
      convergence_depth: measure.participating_scales.length,
      participating_scales: measure.participating_scales,
      coherence_at_resonance: this._coherence_at_frequency(root_node, best_freq),
      harmonic_series: this.compute_harmonic_series(best_freq, 12), // [SPEC] — 12 harmonics (dozenal)
    };
  }

  /**
   * Sweep frequencies and measure stability at each step.
   *
   * Uses log-space spacing for numerical stability across the vast RHUFT frequency range.
   * [SPEC]
   *
   * IEEE-754 Float64: min_freq and max_freq may span many orders of magnitude;
   * log-space computation prevents overflow/underflow.
   *
   * @param node — Fractal node to sweep over.
   * @param min_freq — Minimum frequency (Hz).
   * @param max_freq — Maximum frequency (Hz).
   * @param steps — Number of sweep steps (must be positive integer).
   * @returns Array of {frequency, stability} pairs.
   */
  sweep_frequencies(
    node: FractalNode,
    min_freq: number,
    max_freq: number,
    steps: number
  ): Array<{ frequency: number; stability: number }> {
    if (steps <= 0 || min_freq <= 0.0 || max_freq <= 0.0 || !isFinite(min_freq) || !isFinite(max_freq)) {
      return [];
    }
    // [FIX] Ensure min <= max for valid log-space sweep.
    const safe_min = Math.min(min_freq, max_freq);
    const safe_max = Math.max(min_freq, max_freq);

    const results: Array<{ frequency: number; stability: number }> = [];

    // Log-space sweep: frequencies are geometrically spaced by φ^(1/steps). [SPEC]
    const log_min: number = Math.log(safe_min);
    const log_max: number = Math.log(safe_max);
    const log_step: number = (log_max - log_min) / steps;

    for (let i = 0; i <= steps; i++) {
      const log_freq: number = log_min + i * log_step;
      const freq: number = Math.exp(log_freq);
      const measure = this.measure_stability(node, freq);
      results.push({ frequency: freq, stability: measure.stability });
    }

    return results;
  }

  /**
   * Measure the stability of a resonance at a given frequency.
   *
   * Stability = geometric mean of coherences across all participating scales. [SPEC]
   *
   * A scale "participates" if the frequency is a golden harmonic at that scale:
   * f ≈ f_P · φ^(-n) · m for integer m. [SPEC]
   *
   * IEEE-754 Float64: geometric mean computed in log-space for numerical stability.
   *
   * @param node — Fractal node to measure.
   * @param frequency — Frequency to test (Hz).
   * @returns Object with stability score and participating scales.
   */
  measure_stability(
    node: FractalNode,
    frequency: number
  ): { stability: number; participating_scales: number[] } {
    const participating_scales: number[] = [];
    const coherences: number[] = [];

    // Collect all scales in the node tree via BFS/DFS traversal. [SPEC]
    const visited: Set<number> = new Set();
    const stack: FractalNode[] = [node];

    while (stack.length > 0) {
      const current: FractalNode | undefined = stack.pop();
      if (!current) continue;

      if (visited.has(current.scale)) {
        continue;
      }
      visited.add(current.scale);

      // Check if this frequency is a golden harmonic at this scale. [SPEC]
      if (this.is_golden_harmonic(frequency, current.scale)) {
        participating_scales.push(current.scale);
        coherences.push(current.state.coherence); // [FIX] coherence is a property, not a method
      }

      // Traverse children and parent. [SPEC]
      for (const child of current.children) {
        if (!visited.has(child.scale)) {
          stack.push(child);
        }
      }
      if (current.parent && !visited.has(current.parent.scale)) {
        stack.push(current.parent);
      }
    }

    // Stability = geometric mean of coherences. [SPEC]
    // Computed in log-space for Float64 numerical stability.
    let log_sum: number = 0.0;
    for (const c of coherences) {
      // Clamp coherence to avoid log(0) in IEEE-754 Float64.
      const safe_c: number = c > 0.0 ? c : 1e-300;
      log_sum += Math.log(safe_c);
    }

    const stability: number =
      coherences.length > 0
        ? Math.exp(log_sum / coherences.length)
        : 0.0;

    return { stability, participating_scales };
  }

  /**
   * Compute the harmonic series for a given frequency.
   *
   * Harmonics are φ-scaled: f_k = f_0 · φ^(-k) for k = 0, 1, 2, ... [SPEC]
   *
   * This is the "golden harmonic cascade" — each subsequent harmonic is
   * attenuated by φ, creating a self-similar spectrum. [SPEC]
   *
   * IEEE-754 Float64: computed in log-space for numerical stability.
   *
   * @param base_freq — Base frequency f_0 (Hz).
   * @param num_harmonics — Number of harmonics to generate (must be positive).
   * @returns Array of harmonic frequencies (Hz).
   */
  compute_harmonic_series(base_freq: number, num_harmonics: number): number[] {
    if (num_harmonics <= 0) {
      return [];
    }

    const harmonics: number[] = [];
    const log_base: number = Math.log(base_freq);

    for (let k = 0; k < num_harmonics; k++) {
      const log_freq: number = log_base - k * Math.log(PHI);
      harmonics.push(Math.exp(log_freq));
    }

    return harmonics;
  }

  /**
   * Check if a frequency is a "golden harmonic" at a given scale.
   *
   * A frequency f is a golden harmonic at scale n if:
   *   f ≈ f_P · φ^(-n) · m for integer m. [SPEC]
   *
   * Equivalently: m = f / (f_P · φ^(-n)) should be close to an integer.
   * The tolerance is φ-scale-proportional: ±1/(2φ). [SPEC]
   *
   * IEEE-754 Float64: log-space computation avoids overflow/underflow for large n.
   *
   * @param frequency — Frequency to test (Hz).
   * @param scale_n — Scale index n.
   * @returns True if the frequency is a golden harmonic at this scale.
   */
  is_golden_harmonic(frequency: number, scale_n: number): boolean {
    if (frequency <= 0.0 || !isFinite(frequency)) {
      return false;
    }
    // Expected scale frequency: f_scale = f_P · φ^(-n). [SPEC]
    const log_f_scale: number = Math.log(F_P) - scale_n * Math.log(PHI);

    // [FIX] Compute harmonic integer m = f / f_scale entirely in log-space
    // to avoid overflow/underflow when f_scale is extremely large or small.
    const log_m: number = Math.log(frequency) - log_f_scale;
    const m: number = Math.exp(log_m);

    if (!isFinite(m) || m <= 0.0) {
      return false;
    }

    // Check if m is close to an integer within tolerance 1/(2φ). [SPEC]
    const nearest_int: number = Math.round(m);
    const deviation: number = Math.abs(m - nearest_int);
    const tolerance: number = 1.0 / (2.0 * PHI);

    return deviation <= tolerance && nearest_int > 0;
  }

  /**
   * Find the "absolute complex stable point" — the frequency where:
   *   1. Coherence is maximum across all scales.
   *   2. The harmonic series aligns with physical scale frequencies.
   *   3. The toroidal closure is perfect (closure deviation = 0).
   *   4. The membrane energy is minimized. [SPEC] + [PHIL]
   *
   * This is the "DNA-like" stable position where the field finds its most
   * absolute complex and stable resonance convergence. [PHIL]
   *
   * IEEE-754 Float64: all optimization done in log-space for numerical stability.
   *
   * @param root_node — Root of the fractal node tree.
   * @returns ResonanceConvergence at the absolute stable point.
   */
  find_absolute_stable_point(root_node: FractalNode): ResonanceConvergence {
    // Collect all scales in the tree. [SPEC]
    const all_scales: number[] = this._collect_scales(root_node);

    if (all_scales.length === 0) {
      // Default: return target frequency with zero stability. [SPEC]
      return {
        frequency: this.target_frequency,
        stability_score: 0.0,
        convergence_depth: 0,
        participating_scales: [],
        coherence_at_resonance: 0.0,
        harmonic_series: this.compute_harmonic_series(this.target_frequency, 12),
      };
    }

    // The absolute stable point is where the target frequency aligns with the
    // geometric mean of the scale frequencies weighted by coherence. [SPEC]
    // In log-space: log(f_stable) = Σ [C(n) · log(f(n))] / Σ C(n). [SPEC]
    let log_weighted_sum: number = 0.0;
    let coherence_sum: number = 0.0;

    for (const n of all_scales) {
      const C_n: number = coherence(n); // C(n) = qrf(n) by construction. [SPEC]
      const log_f_n: number = Math.log(F_P) - n * Math.log(PHI);

      log_weighted_sum += C_n * log_f_n;
      coherence_sum += C_n;
    }

    const safe_coherence_sum: number =
      coherence_sum > 0.0 ? coherence_sum : 1e-300;

    const log_stable_freq: number = log_weighted_sum / safe_coherence_sum;
    const stable_freq: number = Math.exp(log_stable_freq);

    // Measure stability at this frequency. [SPEC]
    const measure = this.measure_stability(root_node, stable_freq);

    // Also evaluate membrane energy at this frequency (if nodes have membranes). [SPEC]
    let total_membrane_energy: number = 0.0;
    let total_closure_deviation: number = 0.0;
    const stabilizer: MembraneStabilizer = new MembraneStabilizer();

    for (const n of all_scales) {
      const node: FractalNode | null = this._find_node_at_scale(root_node, n);
      if (node && node.membrane) {
        total_membrane_energy += stabilizer.compute_membrane_energy(
          node.state.field_state, // [FIX] was node.field_state (does not exist)
          node.membrane
        );
        total_closure_deviation += stabilizer.compute_closure_deviation(
          node.state.field_state, // [FIX] was node.field_state (does not exist)
          node.membrane
        );
      }
    }

    // Energy penalty: if total energy is high, shift frequency toward lower energy. [SPEC]
    // This is a φ-scale-proportional correction.
    // [FIX] Guard against NaN/Infinity in membrane energy and log frequency.
    const safe_membrane_energy = isFinite(total_membrane_energy) && total_membrane_energy > 0.0
      ? total_membrane_energy
      : 0.0;
    const energy_penalty: number =
      safe_membrane_energy > 0.0 && all_scales.length > 0
        ? Math.log(PHI) * (total_closure_deviation / all_scales.length)
        : 0.0;

    const corrected_log_freq: number =
      isFinite(log_stable_freq) ? log_stable_freq - energy_penalty : Math.log(this.target_frequency);
    const corrected_freq: number =
      isFinite(corrected_log_freq) ? Math.exp(corrected_log_freq) : this.target_frequency;

    const final_measure = this.measure_stability(root_node, corrected_freq);

    return {
      frequency: corrected_freq,
      stability_score: final_measure.stability,
      convergence_depth: final_measure.participating_scales.length,
      participating_scales: final_measure.participating_scales,
      coherence_at_resonance: this._coherence_at_frequency(
        root_node,
        corrected_freq
      ),
      harmonic_series: this.compute_harmonic_series(corrected_freq, 12),
    };
  }

  /**
   * Compute the average coherence of all nodes at a given frequency.
   *
   * This is a utility method used for reporting coherence_at_resonance. [SPEC]
   *
   * IEEE-754 Float64.
   *
   * @param node — Root node of the tree.
   * @param frequency — Frequency (used to select participating scales).
   * @returns Average coherence across participating scales.
   */
  private _coherence_at_frequency(
    node: FractalNode,
    frequency: number
  ): number {
    const measure = this.measure_stability(node, frequency);
    if (measure.participating_scales.length === 0) {
      return 0.0;
    }

    let sum: number = 0.0;
    for (const n of measure.participating_scales) {
      sum += coherence(n);
    }

    return sum / measure.participating_scales.length;
  }

  /**
   * Collect all unique scale indices in the fractal node tree. [SPEC]
   *
   * @param node — Root node.
   * @returns Sorted array of scale indices.
   */
  private _collect_scales(node: FractalNode): number[] {
    const scales: Set<number> = new Set();
    const stack: FractalNode[] = [node];
    // [FIX] Track visited node IDs to prevent infinite loops from
    // parent-child bidirectional traversal.
    const visited: Set<string> = new Set([node.id]);

    while (stack.length > 0) {
      const current: FractalNode | undefined = stack.pop();
      if (!current) continue;

      scales.add(current.scale);

      for (const child of current.children) {
        if (!visited.has(child.id)) {
          visited.add(child.id);
          stack.push(child);
        }
      }
      if (current.parent && !visited.has(current.parent.id)) {
        visited.add(current.parent.id);
        stack.push(current.parent);
      }
    }

    return Array.from(scales).sort((a: number, b: number): number => a - b);
  }

  /**
   * Find a node at a specific scale in the tree. [SPEC]
   *
   * @param node — Root node to search from.
   * @param scale — Target scale index.
   * @returns The first node found at that scale, or null.
   */
  private _find_node_at_scale(
    node: FractalNode,
    scale: number
  ): FractalNode | null {
    const stack: FractalNode[] = [node];
    const visited: Set<number> = new Set();

    while (stack.length > 0) {
      const current: FractalNode | undefined = stack.pop();
      if (!current) continue;

      if (visited.has(current.scale)) {
        continue;
      }
      visited.add(current.scale);

      if (current.scale === scale) {
        return current;
      }

      for (const child of current.children) {
        stack.push(child);
      }
      if (current.parent) {
        stack.push(current.parent);
      }
    }

    return null;
  }
}
