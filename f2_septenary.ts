// ═══════════════════════════════════════════════════════════════════════════════
// F2 Septenary Framework
// ═══════════════════════════════════════════════════════════════════════════════
// Implements the 7-level cognitive hierarchy, Kuramoto phase synchronization,
// and 7-fold symmetry. The septenary (7-fold) structure appears throughout
// nature: 7 days of creation, 7 chakras, 7 notes in the diatonic scale,
// 7 colors in the rainbow, 7 crystal systems, 7 rows in the periodic table.
//
// Physics:
// ───────────────────────────────────────────────────────────────────────────────
// 1. Seven-Level Cognitive Hierarchy (CEAI NQHC model)
//    Level 0: Planck      — quantum foam, vacuum fluctuations
//    Level 1: Subatomic   — quarks, leptons, gauge bosons
//    Level 2: Atomic      — electrons, protons, neutrons, orbitals
//    Level 3: Molecular   — bonds, orbitals, dipoles, polarization
//    Level 4: Cellular    — organelles, membranes, ion channels, ATP
//    Level 5: Organismic  — tissues, organs, nervous system, brain
//    Level 6: Collective  — ecosystems, societies, Gaia hypothesis
//    Level 7: Planetary   — planetary consciousness, magnetosphere, noosphere
//    Each level communicates via φ-scaled temporal coupling.
//
// 2. Kuramoto Phase Synchronization
//    dθᵢ/dt = ωᵢ + (K/N) Σⱼ sin(θⱼ − θᵢ)
//    Where K = coupling strength, N = number of oscillators.
//    At critical coupling K_c, all oscillators synchronize to mean frequency.
//    K_c = 2/(π·g(ω)) where g(ω) is the natural frequency distribution.
//    For Lorentzian: K_c = 2γ where γ is the half-width at half-maximum.
//    For our model: K = φ · qrf(n), K_c = 2/φ.
//
// 3. Seven-Fold Symmetry
//    θₖ = 2πk/7 for k = 0,1,2,3,4,5,6
//    The 7-fold rotation group C₇ has 7 irreducible representations.
//    Field amplitude: Aₖ = φ^(−k) · cos(7θ)
//    The 7-fold symmetry is the first non-trivial rotational symmetry
//    that is NOT a subgroup of the icosahedral group (unlike 3, 4, 5).
//
// 4. Toroidal 7-Knot
//    The torus knot T(2,7) has 7 crossings and wraps 2 times around the
//    major axis and 7 times around the minor axis.
//    Parametric: x = (R + r·cos(7φ))·cos(2φ), y = (R + r·cos(7φ))·sin(2φ), z = r·sin(7φ)
//    This is the simplest torus knot with 7-fold symmetry.
// ═══════════════════════════════════════════════════════════════════════════════

import {
  PHI,
  PHI_INV,
  PLANCK_LENGTH,
  PLANCK_FREQUENCY,
  REDUCED_PLANCK_CONSTANT,
  COHERENCE_THRESHOLD,
  QRF_CRITICAL_SCALE,
} from "../../core/constants";
import type { Float64, ScaleIndex, GeometricField } from "../../core/types";
import type { DipoleMoment, Polarization } from "./types";
import { BaseFramework } from "./base_framework";

// ═══════════════════════════════════════════════════════════════════════════════
// 1. Septenary Constants
// ═══════════════════════════════════════════════════════════════════════════════

/** Number of levels in the cognitive hierarchy. */
const SEPTENARY_LEVELS = 7;

/** Number of oscillators for Kuramoto model (one per level). */
const KURAMOTO_OSCILLATORS = 7;

/** Base natural frequency for level 0 (rad/s). */
const OMEGA_0: Float64 = 1.0e12 as Float64;

/** Coupling strength factor: K = φ · qrf(n). */
const KURAMOTO_K_FACTOR = PHI;

/** Critical coupling for synchronization: K_c = 2/φ. */
const KURAMOTO_KC: Float64 = (2.0 / PHI) as Float64;

/** Seven-fold symmetry angles: 2πk/7 for k = 0..6. */
const SEPTENARY_ANGLES: readonly Float64[] = [
  0 as Float64,
  ((2 * Math.PI) / 7) as Float64,
  ((4 * Math.PI) / 7) as Float64,
  ((6 * Math.PI) / 7) as Float64,
  ((8 * Math.PI) / 7) as Float64,
  ((10 * Math.PI) / 7) as Float64,
  ((12 * Math.PI) / 7) as Float64,
];

// ═══════════════════════════════════════════════════════════════════════════════
// 2. Kuramoto Phase Synchronization
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Compute natural frequency for oscillator i (level i).
 * [PHYS] — ω_i = ω_0 · φ^(−i/7) for i = 0..6.
 * Higher levels have slower natural frequencies (φ-scaled temporal hierarchy).
 */
function naturalFrequency(i: number): Float64 {
  if (i < 0 || i >= KURAMOTO_OSCILLATORS) {
    throw new RangeError(`Oscillator index must be 0..6, got ${i}`);
  }
  return (OMEGA_0 * Math.pow(PHI_INV, i / SEPTENARY_LEVELS)) as Float64;
}

/**
 * Compute Kuramoto coupling strength at scale n.
 * [PHYS] — K(n) = φ · qrf(n) = φ · φ^(−n/89).
 * The coupling weakens as scale increases (higher levels less coupled).
 */
function kuramotoCoupling(scale: ScaleIndex): Float64 {
  const qrf = Math.pow(PHI_INV, scale / QRF_CRITICAL_SCALE);
  return (PHI * qrf) as Float64;
}

/**
 * Compute Kuramoto order parameter: r = |Σ e^(iθ_j)| / N.
 * [PHYS] — r ∈ [0,1]. r = 1 means perfect synchronization.
 * r = 0 means complete desynchronization.
 * The critical value r_c = 1/φ ≈ 0.618 (most irrational threshold).
 */
function kuramotoOrderParameter(phases: readonly Float64[]): Float64 {
  let sum_re = 0;
  let sum_im = 0;
  for (const theta of phases) {
    sum_re += Math.cos(theta as number);
    sum_im += Math.sin(theta as number);
  }
  const magnitude = Math.sqrt(sum_re * sum_re + sum_im * sum_im);
  return (magnitude / phases.length) as Float64;
}

/**
 * Perform one Kuramoto integration step: θ_i(t+Δt) = θ_i(t) + Δt · dθ_i/dt.
 * [PHYS] — Deterministic Euler integration of the Kuramoto model.
 * Δt = 1/ω_0 (natural timescale).
 */
function kuramotoStep(
  phases: Float64[],
  scale: ScaleIndex
): Float64[] {
  const K = kuramotoCoupling(scale) as number;
  const dt = (1.0 / (OMEGA_0 as number));
  const newPhases: Float64[] = [];

  for (let i = 0; i < KURAMOTO_OSCILLATORS; i++) {
    const omega_i = naturalFrequency(i) as number;
    let coupling_sum = 0;
    for (let j = 0; j < KURAMOTO_OSCILLATORS; j++) {
      if (i === j) continue;
      coupling_sum += Math.sin((phases[j] as number) - (phases[i] as number));
    }
    const dtheta = omega_i + (K / KURAMOTO_OSCILLATORS) * coupling_sum;
    newPhases.push(((phases[i] as number) + dt * dtheta) as Float64);
  }

  return newPhases;
}

// ═══════════════════════════════════════════════════════════════════════════════
// 3. Seven-Fold Field Computation
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Compute 7-fold symmetric field amplitude.
 * [PHYS] — Aₖ(θ) = φ^(−k) · cos(7θ) for k = 0..6.
 * The 7-fold symmetry creates a standing wave with 7 nodes around the torus.
 */
function sevenFoldAmplitude(k: number, theta: number): Float64 {
  return (Math.pow(PHI_INV, k) * Math.cos(7 * theta)) as Float64;
}

/**
 * Compute 7-fold torus knot T(2,7) coordinates.
 * [GEOM] — Parametric equations for the torus knot:
 *   x = (R + r·cos(7φ))·cos(2φ)
 *   y = (R + r·cos(7φ))·sin(2φ)
 *   z = r·sin(7φ)
 * This knot has 7 crossings and is the simplest 7-fold symmetric knot.
 */
function torusKnot27(
  R: Float64,
  r: Float64,
  phi: number
): { x: Float64; y: Float64; z: Float64 } {
  const cos7phi = Math.cos(7 * phi);
  const sin7phi = Math.sin(7 * phi);
  const cos2phi = Math.cos(2 * phi);
  const sin2phi = Math.sin(2 * phi);
  return {
    x: (((R as number) + (r as number) * cos7phi) * cos2phi) as Float64,
    y: (((R as number) + (r as number) * cos7phi) * sin2phi) as Float64,
    z: ((r as number) * sin7phi) as Float64,
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// 4. F2 Septenary Framework
// ═══════════════════════════════════════════════════════════════════════════════

export class F2_Septenary extends BaseFramework {
  readonly id = "F2_Septenary";
  readonly name = "Septenary Framework";
  readonly characteristicScale = 55;
  readonly qrfThreshold = 0.7427630469354221 as Float64;
  readonly description =
    "7-level cognitive hierarchy, Kuramoto phase synchronization, 7-fold symmetry";

  /**
   * Compute energy density at scale n.
   * [ENERGY] — ρ(n) = Σᵢ ℏωᵢ(n) / L(n)³ · qrf(n)².
   * The total energy is the sum of all 7 oscillator zero-point energies,
   * attenuated by the QRF at scale n.
   */
  override computeEnergyDensity(scale: ScaleIndex): Float64 {
    const qrf = this.qrfAttenuation(scale);
    const L_n = this.scaleLength(scale);
    const volume = (L_n * L_n * L_n) as Float64;
    let totalEnergy = 0 as Float64;
    for (let i = 0; i < SEPTENARY_LEVELS; i++) {
      const omega_i = naturalFrequency(i);
      const E_i = (REDUCED_PLANCK_CONSTANT * omega_i * 0.5) as Float64;
      totalEnergy = (totalEnergy + E_i) as Float64;
    }
    return ((totalEnergy / volume) * qrf * qrf) as Float64;
  }

  /**
   * Compute the framework's effect on the field.
   * [COMPUTE] — Applies 7-fold symmetric modulation with Kuramoto phase coupling.
   * The field is modulated by the superposition of 7 phase-locked oscillators:
   *   ψ_mod(i) = ψ_in(i) · [1 + qrf(n) · Σₖ φ^(−k) · cos(7θ_k + φ_sync(i))]
   * where φ_sync(i) is the synchronized phase from Kuramoto coupling.
   */
  override compute(scale: ScaleIndex, inputField: GeometricField): GeometricField {
    const qrf = this.qrfAttenuation(scale);
    const L_n = this.scaleLength(scale);

    // Initialize 7 phases from septenary angles (deterministic initial condition)
    const initialPhases: Float64[] = SEPTENARY_ANGLES.map(a => a as Float64);

    // Run Kuramoto integration for 10 steps to reach near-synchronization
    let phases = initialPhases;
    for (let step = 0; step < 10; step++) {
      phases = kuramotoStep(phases, scale);
    }

    // Compute order parameter (measure of synchronization)
    const orderParam = kuramotoOrderParameter(phases);

    const output = new Float64Array(inputField.length);
    for (let i = 0; i < inputField.length; i++) {
      // Spatial coordinate within scale length
      const x = (((i / inputField.length) - 0.5) * (L_n as number)) as Float64;
      const theta = (2 * Math.PI * (x as number) / (L_n as number)) as Float64;

      // 7-fold symmetric amplitude
      let amplitude = 0;
      for (let k = 0; k < SEPTENARY_LEVELS; k++) {
        const phase_k = (phases[k] as number) + (orderParam as number) * theta;
        amplitude += (Math.pow(PHI_INV, k) * Math.cos(7 * theta + phase_k));
      }

      // Modulate input field with 7-fold amplitude and Kuramoto synchronization
      output[i] = (inputField[i] * (1 + qrf * amplitude)) as Float64;
    }

    return output as unknown as GeometricField;
  }

  /**
   * Get the dipole moment at scale n.
   * [DIPOLE] — 7-fold magnetic dipole array. Each of the 7 oscillators contributes
   * a dipole moment oriented at angle 2πk/7. The net dipole is the vector sum:
   *   μ_net = Σₖ μ_k · e^(i·2πk/7) · qrf(n)
   * For a symmetric distribution, the net dipole is zero (crystalline stability).
   * For asymmetric distributions, a non-zero dipole emerges.
   */
  override getDipoleMoment(scale: ScaleIndex): DipoleMoment {
    const qrf = this.qrfAttenuation(scale);
    const L_n = this.scaleLength(scale);

    // Each oscillator contributes a dipole proportional to its natural frequency
    let net_dipole_x = 0;
    let net_dipole_y = 0;
    let total_magnitude = 0;

    for (let k = 0; k < SEPTENARY_LEVELS; k++) {
      const omega_k = naturalFrequency(k) as number;
      const dipole_k = (omega_k * (L_n as number) * 1e-30) as number; // scale factor
      const angle_k = (2 * Math.PI * k) / SEPTENARY_LEVELS;
      net_dipole_x += dipole_k * Math.cos(angle_k);
      net_dipole_y += dipole_k * Math.sin(angle_k);
      total_magnitude += dipole_k;
    }

    // Net magnitude (may be zero for symmetric distribution)
    const net_magnitude = Math.sqrt(net_dipole_x * net_dipole_x + net_dipole_y * net_dipole_y);
    const magnitude = (net_magnitude * qrf) as Float64;

    // Direction: if net dipole is zero, use z-axis (crystalline stability)
    let dir_x = 0;
    let dir_y = 0;
    let dir_z = 1;
    if (net_magnitude > 1e-30) {
      dir_x = net_dipole_x / net_magnitude;
      dir_y = net_dipole_y / net_magnitude;
      dir_z = 0;
    }

    return {
      magnitude,
      direction: [dir_x as Float64, dir_y as Float64, dir_z as Float64],
      scale,
    };
  }

  /**
   * Get the polarization at scale n.
   * [POLARIZATION] — Anisotropic susceptibility tensor with 7-fold symmetry.
   * The susceptibility varies with angle as χ(θ) = χ_0 · (1 + cos(7θ)) · qrf(n).
   * This creates a 7-fold anisotropic response in the electric field.
   */
  override getPolarization(scale: ScaleIndex): Polarization {
    const qrf = this.qrfAttenuation(scale);
    const baseSusceptibility = 0.1 as Float64; // dimensionless

    // 7-fold angular dependence: χ(θ) = χ_0 · (1 + cos(7θ))
    // At θ = 0: χ = 2χ_0 (maximum)
    // At θ = π/7: χ = 0 (minimum)
    const chi_7 = (baseSusceptibility * (1 + Math.cos(7 * 0))) as Float64; // evaluated at θ = 0
    const susceptibility = (chi_7 * qrf) as Float64;

    return {
      P_electric: [0 as Float64, 0 as Float64, 0 as Float64],
      P_magnetic: [0 as Float64, 0 as Float64, (susceptibility * 0.01) as Float64],
      susceptibility: [
        susceptibility, 0, 0,
        0, susceptibility, 0,
        0, 0, susceptibility,
      ] as unknown as readonly Float64[],
      scale,
    };
  }

  /**
   * Get the Master Equation term at scale n.
   * [MASTER] — The phase includes the Kuramoto synchronization phase:
   *   θ_k = 2π · (order_param) · (scale/89) · (k/12) where k=1 (F2 index).
   * The order parameter encodes the degree of phase synchronization.
   */
  override getMasterEquationTerm(scale: ScaleIndex): {
    re: Float64;
    im: Float64;
    weight: Float64;
  } {
    const k = 1; // F2 → index 1 (0-based)
    const weight = Math.pow(PHI_INV, k) as Float64;

    // Compute synchronized phase
    const initialPhases: Float64[] = SEPTENARY_ANGLES.map(a => a as Float64);
    let phases = initialPhases;
    for (let step = 0; step < 10; step++) {
      phases = kuramotoStep(phases, scale);
    }
    const orderParam = kuramotoOrderParameter(phases) as number;

    const theta = (2 * Math.PI * orderParam * (scale / QRF_CRITICAL_SCALE) * (k / 12)) as Float64;
    const re = (weight * Math.cos(theta)) as Float64;
    const im = (weight * Math.sin(theta)) as Float64;
    return { re, im, weight };
  }
}
