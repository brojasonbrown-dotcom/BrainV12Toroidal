// ═══════════════════════════════════════════════════════════════════════════════
// F3 Quantum Framework
// ═══════════════════════════════════════════════════════════════════════════════
// Handles quantum mechanical systems: wavefunctions, energy eigenstates,
// entanglement, uncertainty relations, and quantum vortex toroidal fields.
// This framework operates at the quantum scale (n_fw = 8), bridging the gap
// between sub-Planckian vacuum fluctuations and atomic-scale structure.
//
// Physics:
// ───────────────────────────────────────────────────────────────────────────────
// 1. Schrödinger Equation (Time-Independent)
//    Ĥψ = Eψ  with  Ĥ = -ℏ²/(2m) ∇² + V(r)
//    Harmonic oscillator potential: V(r) = ½ m ω² r²
//    Exact eigenvalues: E_n = ℏω (n + ½)  for n = 0, 1, 2, 3, 4
//
// 2. Wavefunctions (1D QHO)
//    ψ_n(x) = (1 / √(2ⁿ n!)) · (mω / πℏ)^(¼) · exp(-ξ²/2) · H_n(ξ)
//    where ξ = √(mω/ℏ) · x  and H_n are Hermite polynomials.
//
// 3. Hermite Polynomials
//    H₀(ξ) = 1
//    H₁(ξ) = 2ξ
//    H₂(ξ) = 4ξ² - 2
//
// 4. Bell-State Entanglement
//    |Φ⁺⟩ = (1/√2)(|00⟩ + |11⟩)
//    Maximally entangled two-qubit state; von Neumann entropy S = ln 2.
//
// 5. Heisenberg Uncertainty Principle
//    Δx · Δp ≥ ℏ/2
//    For the QHO ground state: Δx = √(ℏ/(2mω)), Δp = √(mℏω/2)
//    giving Δx·Δp = ℏ/2 (minimum-uncertainty / coherent state).
//
// 6. Gross-Pitaevskii Quantum Vortex (Toroidal BEC)
//    ψ_vortex(r,θ,z) = f(r) · exp(i κ θ)
//    Quantized circulation: κ = h/m = 2πℏ/m
//    Vortex core pinned at torus center; density vanishes on axis.
//
// 7. Quantum Electric Dipole Moment
//    p = q · ⟨ψ|r|ψ⟩
//    Parity forbids diagonal matrix elements ⟨ψ_n|r|ψ_n⟩ = 0.
//    Transition dipole ⟨ψ_0|r|ψ_1⟩ is non-zero and oscillates at ω.
//
// 8. Quantum Susceptibility (Lorentz Oscillator)
//    χ(ω) = ω_p² / (ω_0² - ω² - iγω)
//    Real part → dispersion; imaginary part → absorption.
//    At resonance ω = ω_0 the absorption peaks.
//
// 9. Aspect Ratio
//    The toroidal field maintains crystalline stability via aspect ratio = φ.
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
import type { DipoleMoment, Polarization, ToroidalField } from "./types";
import { BaseFramework } from "./base_framework";

// ═══════════════════════════════════════════════════════════════════════════════
// 1. Quantum Constants
// ═══════════════════════════════════════════════════════════════════════════════

/** Electron mass (kg) — used as the QHO mass parameter. */
const QHO_MASS: Float64 = 9.1093837015e-31 as Float64;

/** Elementary charge (C) — fundamental charge quantum. */
const ELEMENTARY_CHARGE: Float64 = 1.602176634e-19 as Float64;

/** Characteristic angular frequency of the quantum harmonic oscillator (rad/s). */
const QHO_OMEGA: Float64 = 1.0e15 as Float64;

/** Zero-point energy: E₀ = ℏω / 2. */
const ZERO_POINT_ENERGY: Float64 = (REDUCED_PLANCK_CONSTANT * QHO_OMEGA / 2) as Float64;

/** Plasma frequency for Lorentz susceptibility (rad/s). */
const PLASMA_FREQUENCY: Float64 = 5.7e15 as Float64;

/** Resonant frequency for Lorentz susceptibility (rad/s). */
const RESONANT_FREQUENCY: Float64 = 3.5e15 as Float64;

/** Damping coefficient for Lorentz susceptibility (rad/s). */
const DAMPING_GAMMA: Float64 = 1.0e12 as Float64;

// ═══════════════════════════════════════════════════════════════════════════════
// 2. Hermite Polynomials (H₀, H₁, H₂)
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Hermite polynomial H₀(ξ) = 1.
 * [PHYS] — The ground-state wavefunction of the quantum harmonic oscillator
 * is a pure Gaussian: ψ₀(x) ∝ exp(-ξ²/2), with no nodes.
 */
function hermite0(xi: Float64): Float64 {
  return 1.0 as Float64;
}

/**
 * Hermite polynomial H₁(ξ) = 2ξ.
 * [PHYS] — The first excited state has a single node at x = 0,
 * producing the characteristic double-lobed probability density |ψ₁|².
 */
function hermite1(xi: Float64): Float64 {
  return (2.0 * xi) as Float64;
}

/**
 * Hermite polynomial H₂(ξ) = 4ξ² - 2.
 * [PHYS] — The second excited state has two nodes, corresponding to
 * the n = 2 energy eigenstate E₂ = (5/2) ℏω.
 */
function hermite2(xi: Float64): Float64 {
  return ((4.0 * xi * xi) - 2.0) as Float64;
}

/**
 * Normalized wavefunction ψₙ(x) for the 1D quantum harmonic oscillator.
 * [PHYS] — Exact solution to the time-independent Schrödinger equation
 * Ĥψ = Eψ with Ĥ = -ℏ²/(2m) ∂²/∂x² + ½ mω²x².
 *
 * ψₙ(x) = (1 / √(2ⁿ n!)) · (mω / πℏ)^(¼) · exp(-ξ²/2) · Hₙ(ξ)
 * where ξ = √(mω/ℏ) · x.
 */
function wavefunctionQHO(n: number, x: Float64, omega: Float64, mass: Float64): Float64 {
  const alpha = Math.sqrt((mass * omega) / REDUCED_PLANCK_CONSTANT) as Float64;
  const xi = (alpha * x) as Float64;
  const normFactor = Math.pow((mass * omega) / (Math.PI * REDUCED_PLANCK_CONSTANT), 0.25) as Float64;
  const gaussian = Math.exp(-0.5 * xi * xi) as Float64;

  let hermite: Float64;
  switch (n) {
    case 0:
      hermite = hermite0(xi);
      break;
    case 1:
      hermite = hermite1(xi);
      break;
    case 2:
      hermite = hermite2(xi);
      break;
    default:
      hermite = hermite0(xi); // Fallback to ground state for safety
  }

  const factorialDenom = Math.sqrt(Math.pow(2, n) * factorial(n)) as Float64;
  return ((normFactor * gaussian * hermite) / factorialDenom) as Float64;
}

/** Small factorial helper for n ≤ 4. */
function factorial(n: number): number {
  if (n <= 1) return 1;
  return n * factorial(n - 1);
}

// ═══════════════════════════════════════════════════════════════════════════════
// 3. Bell State & Entanglement
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Bell state |Φ⁺⟩ = (1/√2)(|00⟩ + |11⟩).
 * [PHYS] — Maximally entangled two-qubit state. In the toroidal field model,
 * entanglement arises from correlated dipole oscillations across the torus.
 * The density matrix ρ = |Φ⁺⟩⟨Φ⁺| has von Neumann entropy S = ln 2.
 * The coefficients are ordered as [|00⟩, |01⟩, |10⟩, |11⟩].
 */
const BELL_STATE_PHI_PLUS: readonly [Float64, Float64, Float64, Float64] = [
  (1.0 / Math.SQRT2) as Float64,
  0 as Float64,
  0 as Float64,
  (1.0 / Math.SQRT2) as Float64,
];

// ═══════════════════════════════════════════════════════════════════════════════
// 4. F3 Quantum Framework
// ═══════════════════════════════════════════════════════════════════════════════

export class F3_Quantum extends BaseFramework {
  readonly id = "F3_Quantum";
  readonly name = "Quantum Framework";
  readonly characteristicScale = 8;
  readonly qrfThreshold = 0.9576671581030018 as Float64;
  readonly description =
    "Quantum wavefunctions, entanglement, uncertainty, and vortex toroidal fields";

  /**
   * Energy eigenvalue of the quantum harmonic oscillator at level n.
   * [PHYS] — E_n = ℏω (n + ½). This is the exact spectrum of the 1D QHO.
   * The spacing ΔE = ℏω is constant, reflecting the equally-spaced
   * energy ladder of the harmonic oscillator.
   *
   * For n = 0: E₀ = ½ ℏω  (zero-point energy)
   * For n = 1: E₁ = ³⁄₂ ℏω
   * For n = 2: E₂ = ⁵⁄₂ ℏω
   * For n = 3: E₃ = ⁷⁄₂ ℏω
   * For n = 4: E₄ = ⁹⁄₂ ℏω
   */
  energyLevel(n: number): Float64 {
    return (REDUCED_PLANCK_CONSTANT * QHO_OMEGA * (n + 0.5)) as Float64;
  }

  /**
   * Compute all energy levels n = 0 .. 4.
   * [PHYS] — Returns [E₀, E₁, E₂, E₃, E₄] in joules.
   * These are the five lowest eigenvalues of the QHO Hamiltonian.
   */
  energySpectrum(): readonly Float64[] {
    const levels: Float64[] = [];
    for (let n = 0; n <= 4; n++) {
      levels.push(this.energyLevel(n));
    }
    return levels as readonly Float64[];
  }

  /**
   * Heisenberg uncertainty principle: Δx · Δp ≥ ℏ/2.
   * [PHYS] — For the QHO ground state, the position and momentum uncertainties are
   *   Δx = √(ℏ / (2mω))   and   Δp = √(mℏω / 2)
   * giving Δx · Δp = ℏ/2 exactly — the minimum-uncertainty (coherent) state.
   * For excited states, the product grows linearly with n:
   *   Δxₙ · Δpₙ = (n + ½) ℏ.
   */
  uncertaintyProduct(n: number): Float64 {
    const deltaX0 = Math.sqrt(REDUCED_PLANCK_CONSTANT / (2 * QHO_MASS * QHO_OMEGA)) as Float64;
    const deltaP0 = Math.sqrt((QHO_MASS * REDUCED_PLANCK_CONSTANT * QHO_OMEGA) / 2) as Float64;
    const sqrtFactor = Math.sqrt(n + 0.5) as Float64;
    return ((deltaX0 * sqrtFactor) * (deltaP0 * sqrtFactor)) as Float64;
  }

  /**
   * Quantum transition dipole moment between n = 0 and n = 1.
   * [PHYS] — Parity forbids diagonal matrix elements ⟨ψₙ|r|ψₙ⟩ = 0.
   * Off-diagonal transitions are non-zero:
   *   ⟨ψₙ|r|ψₘ⟩ = √(ℏ/(2mω)) · (√n δ_{m,n-1} + √(n+1) δ_{m,n+1}).
   * This method returns the 0→1 transition dipole, which oscillates at ω
   * and drives the quantum electric dipole radiation in the toroidal field.
   */
  transitionDipoleMoment(): Float64 {
    const alpha = Math.sqrt((QHO_MASS * QHO_OMEGA) / REDUCED_PLANCK_CONSTANT) as Float64;
    const transitionLength = Math.sqrt(1 / (2 * alpha * alpha)) as Float64;
    return (ELEMENTARY_CHARGE * transitionLength) as Float64;
  }

  /**
   * Lorentz oscillator susceptibility: χ(ω) = ω_p² / (ω_0² - ω² - iγω).
   * [PHYS] — Classical Lorentz model for bound electrons in a polarizable medium.
   * Real part (dispersion):   χ' = ω_p² (ω_0² - ω²) / [(ω_0² - ω²)² + (γω)²]
   * Imaginary part (absorption): χ'' = ω_p² γω / [(ω_0² - ω²)² + (γω)²]
   * At resonance ω = ω_0, the imaginary part peaks (maximum absorption).
   */
  lorentzSusceptibility(omega: Float64): { re: Float64; im: Float64 } {
    const omegaSq = (omega * omega) as Float64;
    const omega0Sq = (RESONANT_FREQUENCY * RESONANT_FREQUENCY) as Float64;
    const denom =
      ((omega0Sq - omegaSq) * (omega0Sq - omegaSq) +
        DAMPING_GAMMA * DAMPING_GAMMA * omegaSq) as Float64;
    const re =
      ((PLASMA_FREQUENCY * PLASMA_FREQUENCY * (omega0Sq - omegaSq)) / denom) as Float64;
    const im =
      ((PLASMA_FREQUENCY * PLASMA_FREQUENCY * DAMPING_GAMMA * omega) / denom) as Float64;
    return { re, im };
  }

  /**
   * Gross-Pitaevskii vortex wavefunction for a toroidal BEC.
   * [PHYS] — In a Bose-Einstein condensate trapped in a toroidal geometry,
   * quantized vortices have the form ψ_vortex(r,θ) = f(r) · exp(i κ θ),
   * where κ ∈ ℤ is the winding number (vorticity).
   * The density |ψ|² vanishes at the vortex core (r ≈ 0) and peaks on the
   * toroidal ring, creating the quantum vortex toroidal field structure.
   */
  vortexWavefunction(
    r: Float64,
    theta: Float64,
    kappa: number = 1,
  ): { re: Float64; im: Float64 } {
    const r_core = (this.scaleLength(this.characteristicScale) * 0.1) as Float64;
    const density = ((r * r) / (r * r + r_core * r_core)) as Float64;
    const phase = (kappa * theta) as Float64;
    const re = (Math.sqrt(density) * Math.cos(phase)) as Float64;
    const im = (Math.sqrt(density) * Math.sin(phase)) as Float64;
    return { re, im };
  }

  // ───────────────────────────────────────────────────────────────────────────
  // BaseFramework overrides
  // ───────────────────────────────────────────────────────────────────────────

  /**
   * Compute energy density at scale n.
   * [ENERGY] — ρ(n) = (ℏω / 2) · qrf(n)² / L(n)³.
   * The vacuum energy density at the quantum scale is dominated by the
   * zero-point energy of the harmonic oscillator, attenuated by the QRF.
   */
  override computeEnergyDensity(scale: ScaleIndex): Float64 {
    const qrf = this.qrfAttenuation(scale);
    const L_n = this.scaleLength(scale);
    const volume = (L_n * L_n * L_n) as Float64;
    const energyDensity = ((ZERO_POINT_ENERGY / volume) * qrf * qrf) as Float64;
    return energyDensity;
  }

  /**
   * Compute the framework's effect on the field.
   * [COMPUTE] — Applies deterministic quantum harmonic oscillator modulation.
   * The field is modulated by the QHO ground-state wavefunction ψ₀(x) and
   * phase-locked via the Bell-state correlation pattern, ensuring deterministic,
   * reversible, and physically meaningful evolution.
   *
   * ψ_mod(i) = ψ_in(i) · [1 + qrf(n) · ψ₀(xᵢ) · Φ_Bell(i)]
   * where Φ_Bell(i) = sin(2πi/φ) + cos(2πi/φ²) encodes the entanglement phase.
   */
  override compute(scale: ScaleIndex, inputField: GeometricField): GeometricField {
    const qrf = this.qrfAttenuation(scale);
    const L_n = this.scaleLength(scale);
    const alpha = Math.sqrt((QHO_MASS * QHO_OMEGA) / REDUCED_PLANCK_CONSTANT) as Float64;
    const norm = Math.pow((QHO_MASS * QHO_OMEGA) / (Math.PI * REDUCED_PLANCK_CONSTANT), 0.25) as Float64;

    const output = new Float64Array(inputField.length);
    for (let i = 0; i < inputField.length; i++) {
      // Map index i to spatial coordinate x within [-L_n/2, L_n/2]
      const x = (((i / inputField.length) - 0.5) * L_n) as Float64;
      const xi = (alpha * x) as Float64;
      // QHO ground-state wavefunction ψ₀(x) = norm · exp(-ξ²/2)
      const psi = (norm * Math.exp(-0.5 * xi * xi)) as Float64;
      // Deterministic Bell-state correlation phase
      const bellPhase =
        (Math.sin((2 * Math.PI * i) / PHI) + Math.cos((2 * Math.PI * i) / (PHI * PHI))) as Float64;
      // Modulate input field with quantum wavefunction and entanglement phase
      output[i] = (inputField[i] * (1 + qrf * psi * bellPhase)) as Float64;
    }

    return output as unknown as GeometricField;
  }

  /**
   * Get the quantum vortex toroidal field at scale n.
   * [TOROIDAL] — Gross-Pitaevskii vortex in a toroidal BEC trap.
   * The aspect ratio is locked to φ for crystalline stability.
   * Circulation is quantized: κ = h / m = 2πℏ / m.
   */
  override getToroidalField(scale: ScaleIndex): ToroidalField {
    const baseField = super.getToroidalField(scale);
    // Quantized circulation for a quantum vortex (m²/s or A depending on context)
    const quantizedCirculation =
      ((2 * Math.PI * REDUCED_PLANCK_CONSTANT) / QHO_MASS) as Float64;

    return {
      majorRadius: baseField.majorRadius,
      minorRadius: baseField.minorRadius,
      aspectRatio: baseField.aspectRatio, // preserved as φ from base computation
      circulation: quantizedCirculation,
      dipole: baseField.dipole,
      polarization: baseField.polarization,
      scale: baseField.scale,
      frameworkId: baseField.frameworkId,
    };
  }

  /**
   * Get the dipole moment at scale n.
   * [DIPOLE] — Quantum electric dipole moment from the 0→1 transition of the
   * harmonic oscillator: p = q · ⟨ψ₀|r|ψ₁⟩.
   * The dipole oscillates at frequency ω and is aligned with the z-axis,
   * producing the characteristic toroidal dipole radiation pattern.
   */
  override getDipoleMoment(scale: ScaleIndex): DipoleMoment {
    const qrf = this.qrfAttenuation(scale);
    const baseDipole = this.transitionDipoleMoment();
    const magnitude = (baseDipole * qrf) as Float64;

    return {
      magnitude,
      direction: [0 as Float64, 0 as Float64, 1 as Float64],
      scale,
    };
  }

  /**
   * Get the polarization at scale n.
   * [POLARIZATION] — Quantum susceptibility from the Lorentz oscillator model.
   * Electric polarization: P = ε₀ χ E, where χ is evaluated at the QHO frequency ω.
   * Magnetic polarization arises from orbital currents in the toroidal vortex.
   */
  override getPolarization(scale: ScaleIndex): Polarization {
    const qrf = this.qrfAttenuation(scale);
    const chi = this.lorentzSusceptibility(QHO_OMEGA);
    const chiMagnitude = Math.sqrt(chi.re * chi.re + chi.im * chi.im) as Float64;
    const susceptibility = (chiMagnitude * qrf) as Float64;

    return {
      P_electric: [0 as Float64, 0 as Float64, (chi.re * qrf) as Float64],
      P_magnetic: [0 as Float64, 0 as Float64, (chi.im * qrf) as Float64],
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
   * [MASTER] — The phase includes the quantum harmonic oscillator ground-state
   * phase factor θ_k = 2π · (E₀/ℏω) · (scale/89) · (k/12) = π · (scale/89) · (k/12).
   * This encodes the quantum zero-point energy into the global coherence field.
   */
  override getMasterEquationTerm(scale: ScaleIndex): {
    re: Float64;
    im: Float64;
    weight: Float64;
  } {
    const k = 2; // F3 → index 2 (0-based)
    const weight = Math.pow(PHI_INV, k) as Float64;
    const energyRatio = 0.5; // E₀ / ℏω = ½
    const theta =
      (2 * Math.PI * energyRatio * (scale / QRF_CRITICAL_SCALE) * (k / 12)) as Float64;
    const re = (weight * Math.cos(theta)) as Float64;
    const im = (weight * Math.sin(theta)) as Float64;
    return { re, im, weight };
  }
}
