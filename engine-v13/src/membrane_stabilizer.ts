/**
 * RHUFT v6.0 — Fractal Node Engine: DNA-like Membrane Stabilizer
 *
 * Epistemic Status: [SPEC] + [PHIL] — Mathematical ontology, not predictive physics.
 * The "membrane" is a geometric boundary condition (toroidal closure) that stabilizes
 * the field inside a fractal node, analogous to a cell membrane stabilizing biochemical
 * environment. The torus is the fundamental closure structure in RHUFT.
 *
 * Critical Constraints:
 *   - TypeScript strict mode compliant (no `any`, explicit types everywhere).
 *   - IEEE-754 Float64 (≈15 significant digits) — explicitly noted in comments.
 *   - No random seeds — fully deterministic by construction.
 *   - φ-scale-proportional parameters throughout.
 *   - Scale-invariant by construction.
 */

import {
  RHUFT_CONSTANTS,
  KAPPA,
  LAMBDA,
  scale_length,
} from "./types.ts";

import type {
  MembraneGeometry,
  MembraneStabilizationResult,
} from "./types.ts";

/** φ — exact to Float64 (≈15 digits). [SPEC] */
const PHI = RHUFT_CONSTANTS.PHI;

/** π — exact to Float64 (≈15 digits). [SPEC] */
const PI = RHUFT_CONSTANTS.PI;

/** Closure coupling κ = 1/(φπ) — exact to Float64 (≈15 digits). [SPEC] */
const KAPPA_VAL = KAPPA;

/** Coherence threshold λ = 1/φ² — exact to Float64 (≈15 digits). [SPEC] */
const LAMBDA_VAL = LAMBDA;

/**
 * DNA-like Membrane Stabilizer for Fractal Nodes.
 *
 * The membrane is a toroidal boundary condition. Its aspect ratio R/r = φ
 * yields the "most irrational" winding number, preventing resonant leakage
 * across the boundary (analogous to DNA double-helix stability via non-repeating
 * angular relationships). [SPEC] + [PHIL]
 */
export class MembraneStabilizer {
  /**
   * Create a toroidal membrane geometry for a given scale n.
   *
   * The characteristic length at scale n is L(n) = ℓ_P · φ^n.
   * The major radius R = L(n) · φ (scaled up by φ for closure).
   * The minor radius r = L(n) (characteristic scale length).
   * Thus the aspect ratio R/r = φ for optimal incommensurability. [SPEC]
   *
   * IEEE-754 Float64: all computed values are Float64 (≈15 digits).
   *
   * @param scale_n — Scale index n.
   * @returns MembraneGeometry for this scale.
   */
  static create_membrane(scale_n: number): MembraneGeometry {
    // Characteristic length at this scale: L(n) = ℓ_P · φ^n. [SPEC]
    const L_n: number = scale_length(scale_n);

    // Major radius R = L(n) · φ — scales the torus up by φ for closure. [SPEC]
    const R: number = L_n * PHI;

    // Minor radius r = L(n) — the characteristic scale length. [SPEC]
    const r: number = L_n;

    // Aspect ratio = R/r = φ — optimal for most-irrational winding. [SPEC]
    const aspect_ratio: number = R / r; // = φ exactly in ideal arithmetic; Float64 yields ≈ φ.

    // Poloidal circumference = 2πr. [SPEC]
    const poloidal_circumference: number = 2.0 * PI * r;

    // Toroidal circumference = 2πR. [SPEC]
    const toroidal_circumference: number = 2.0 * PI * R;

    // Surface area = 4π²Rr. [SPEC]
    const surface_area: number = 4.0 * PI * PI * R * r;

    // Volume = 2π²Rr². [SPEC]
    const volume: number = 2.0 * PI * PI * R * r * r;

    // Winding number = toroidal-to-poloidal turns = R/r = φ. [SPEC]
    // This is the "most irrational" ratio, preventing resonant leakage. [PHIL]
    const winding_number: number = aspect_ratio;

    return {
      major_radius: R,
      minor_radius: r,
      aspect_ratio,
      poloidal_circumference,
      toroidal_circumference,
      surface_area,
      volume,
      winding_number,
    };
  }

  /**
   * Stabilize a field state within the membrane boundaries.
   *
   * The stabilization applies a gentle restoring force when the field deviates
   * from the toroidal closure condition: ∮∇Ψ·dS = 0 (no flux through membrane). [SPEC]
   *
   * The correction is φ-scale-proportional: higher modes (smaller scales)
   * receive gentler correction, preventing destructive interference. [SPEC]
   *
   * IEEE-754 Float64: all operations use Float64Array and scalar Float64.
   *
   * @param field_state — Input field state vector (Float64).
   * @param membrane — Membrane geometry defining the boundary.
   * @returns MembraneStabilizationResult with corrected state and diagnostics.
   */
  stabilize(
    field_state: Float64Array,
    membrane: MembraneGeometry
  ): MembraneStabilizationResult {
    const closure_deviation: number = this.compute_closure_deviation(
      field_state,
      membrane
    );

    const coherence: number = this._estimate_coherence_from_field(field_state);
    const threshold: number = LAMBDA_VAL;

    const new_field_state: Float64Array = this.apply_closure_correction(
      field_state,
      membrane,
      coherence,
      threshold
    );

    const membrane_energy: number = this.compute_membrane_energy(
      new_field_state,
      membrane
    );

    // Stabilized if closure deviation is within φ-scale-proportional tolerance. [SPEC]
    const stabilized: boolean =
      closure_deviation < threshold / Math.pow(PHI, membrane.winding_number);

    return {
      stabilized,
      new_field_state,
      closure_deviation,
      membrane_energy,
    };
  }

  /**
   * Compute the closure deviation: how much the field violates the boundary condition.
   *
   * Boundary condition: ∮∇Ψ·dS = 0 (no flux through the membrane). [SPEC]
   *
   * In the discretized representation, we approximate the flux integral by summing
   * the absolute differences between adjacent field values (discrete ∇Ψ) weighted
   * by the membrane surface area. The deviation is normalized by the field magnitude
   * and membrane surface area to ensure scale invariance. [SPEC]
   *
   * IEEE-754 Float64: all intermediate values are Float64.
   *
   * @param field_state — Field state vector (Float64).
   * @param membrane — Membrane geometry.
   * @returns Closure deviation (non-negative Float64).
   */
  compute_closure_deviation(
    field_state: Float64Array,
    membrane: MembraneGeometry
  ): number {
    if (field_state.length === 0) {
      return 0.0;
    }

    // Compute discrete gradient magnitude: Σ |Ψ[i] - Ψ[i-1]|.
    // This approximates |∇Ψ| along the field discretization. [SPEC]
    let grad_sum: number = 0.0;
    for (let i = 1; i < field_state.length; i++) {
      const diff: number = field_state[i] - field_state[i - 1];
      grad_sum += Math.abs(diff);
    }

    // The flux through the membrane is approximated as grad_sum · (A / N) where
    // A = membrane surface area and N = field_state.length. [SPEC]
    const avg_flux: number =
      grad_sum * (membrane.surface_area / field_state.length);

    // Normalize by field magnitude to get relative deviation. [SPEC]
    let field_magnitude: number = 0.0;
    for (let i = 0; i < field_state.length; i++) {
      field_magnitude += Math.abs(field_state[i]);
    }
    field_magnitude = field_magnitude / field_state.length;

    // Avoid division by zero (IEEE-754 Float64: 1e-300 is safe subnormal guard).
    const safe_mag: number = field_magnitude > 0.0 ? field_magnitude : 1e-300;

    // Closure deviation = (∮∇Ψ·dS) / (A · |Ψ|_avg) — dimensionless. [SPEC]
    const deviation: number = avg_flux / (membrane.surface_area * safe_mag);

    return deviation;
  }

  /**
   * Apply gentle correction to restore toroidal closure, like DNA repairing itself.
   *
   * Correction formula: ΔΨ = -∇Ψ·n̂ · φ^(-k) · gain · (threshold - coherence). [SPEC]
   *
   * Where:
   *   - ∇Ψ·n̂ is approximated by the local gradient.
   *   - k = scale index (higher k = smaller physical scale = gentler correction).
   *   - gain = φ / (1 + φ) = 1/φ (golden-section gain for stability). [SPEC]
   *   - (threshold - coherence) modulates correction strength based on node health.
   *
   * IEEE-754 Float64: all operations are Float64.
   *
   * @param field_state — Input field state vector (Float64).
   * @param membrane — Membrane geometry.
   * @param coherence — Current coherence of the node (0–1).
   * @param threshold — Coherence threshold λ = 1/φ².
   * @returns Corrected field state vector (Float64).
   */
  apply_closure_correction(
    field_state: Float64Array,
    membrane: MembraneGeometry,
    coherence: number,
    threshold: number
  ): Float64Array {
    const N: number = field_state.length;
    if (N === 0) {
      return new Float64Array(0);
    }

    // Estimate scale index from aspect ratio: k ≈ log_φ(R/r) = log_φ(φ) = 1.
    // For general membranes, k = log_φ(aspect_ratio). [SPEC]
    const k: number =
      Math.log(membrane.aspect_ratio) / Math.log(PHI);

    // Golden-section gain: g = φ / (1 + φ) = 1/φ ≈ 0.618. [SPEC]
    const gain: number = 1.0 / PHI;

    // Correction amplitude factor: φ^(-k) · gain · (threshold - coherence). [SPEC]
    // Higher k (smaller scale) → φ^(-k) is smaller → gentler correction.
    const correction_factor: number =
      Math.pow(PHI, -k) * gain * Math.max(0.0, threshold - coherence);

    const corrected: Float64Array = new Float64Array(N);

    // Apply correction to each element.
    // ΔΨ[i] = -(Ψ[i] - Ψ[i-1]) · correction_factor for i > 0.
    // ΔΨ[0] = -(Ψ[0] - Ψ[N-1]) · correction_factor (toroidal wrap-around). [SPEC]
    for (let i = 0; i < N; i++) {
      const prev: number = i > 0 ? field_state[i - 1] : field_state[N - 1];
      const gradient: number = field_state[i] - prev;
      // Gentle correction: push field back toward previous value.
      corrected[i] = field_state[i] - gradient * correction_factor;
    }

    return corrected;
  }

  /**
   * Compute membrane energy: the energy required to maintain the boundary.
   *
   * Formula: E_membrane = κ · (∮∇Ψ·dS)² / A. [SPEC]
   *
   * Where:
   *   - κ = 1/(φπ) — closure coupling constant. [SPEC]
   *   - ∮∇Ψ·dS — total flux through membrane (approximated by discrete gradient). [SPEC]
   *   - A — membrane surface area. [SPEC]
   *
   * IEEE-754 Float64: all operations are Float64.
   *
   * @param field_state — Field state vector (Float64).
   * @param membrane — Membrane geometry.
   * @returns Membrane energy (non-negative Float64).
   */
  compute_membrane_energy(
    field_state: Float64Array,
    membrane: MembraneGeometry
  ): number {
    if (field_state.length === 0) {
      return 0.0;
    }

    // Approximate ∮∇Ψ·dS by discrete gradient sum scaled by surface area element.
    let flux_integral: number = 0.0;
    for (let i = 1; i < field_state.length; i++) {
      const diff: number = field_state[i] - field_state[i - 1];
      flux_integral += Math.abs(diff);
    }
    // Close the toroidal loop.
    const loop_diff: number = field_state[0] - field_state[field_state.length - 1];
    flux_integral += Math.abs(loop_diff);

    // Scale by surface area per element to approximate flux through boundary.
    const area_element: number = membrane.surface_area / field_state.length;
    flux_integral *= area_element;

    // E_membrane = κ · (∮∇Ψ·dS)² / A. [SPEC]
    const energy: number =
      KAPPA_VAL * (flux_integral * flux_integral) / membrane.surface_area;

    return energy;
  }

  /**
   * Estimate coherence from field state.
   *
   * Coherence is approximated as the ratio of the mean field magnitude to the
   * gradient magnitude, normalized by φ. This is a heuristic proxy for the
   * formal C(n) = qrf(n) when the field state is not directly tied to a scale. [SPEC]
   *
   * IEEE-754 Float64.
   *
   * @param field_state — Field state vector (Float64).
   * @returns Estimated coherence in [0, 1] (Float64).
   */
  private _estimate_coherence_from_field(field_state: Float64Array): number {
    if (field_state.length === 0) {
      return 0.0;
    }

    let mean_mag: number = 0.0;
    let grad_mag: number = 0.0;

    for (let i = 0; i < field_state.length; i++) {
      mean_mag += Math.abs(field_state[i]);
      const prev: number =
        i > 0 ? field_state[i - 1] : field_state[field_state.length - 1];
      grad_mag += Math.abs(field_state[i] - prev);
    }

    mean_mag = mean_mag / field_state.length;
    grad_mag = grad_mag / field_state.length;

    // Coherence ≈ mean_mag / (mean_mag + grad_mag/φ) — sigmoid-like in [0,1]. [SPEC]
    const safe_grad: number = grad_mag > 0.0 ? grad_mag : 1e-300;
    const coherence: number = mean_mag / (mean_mag + safe_grad / PHI);

    return coherence;
  }
}
