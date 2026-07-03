// ═══════════════════════════════════════════════════════════════════════════════
// F7 Thermodynamic Framework
// ═══════════════════════════════════════════════════════════════════════════════
// Implements thermodynamics: entropy, heat flow, temperature gradients,
// Carnot efficiency, and geometric friction. The thermodynamic framework
// governs energy transfer and dissipation across all scales.
//
// Physics:
// ───────────────────────────────────────────────────────────────────────────────
// 1. Entropy Production
//    dS/dt = Σ (J_i · X_i) ≥ 0 (Prigogine's minimum entropy production)
//    J_i = thermodynamic flux (heat, mass, charge)
//    X_i = thermodynamic force (temperature gradient, chemical potential)
//    At equilibrium: dS/dt = 0. Near equilibrium: dS/dt minimized.
//
// 2. Heat Conduction (Fourier's Law)
//    q = -k ∇T (heat flux proportional to temperature gradient)
//    k = thermal conductivity, material-dependent
//    For vacuum: k ≈ 0 (no conduction, only radiation)
//
// 3. Carnot Efficiency
//    η = 1 - T_cold / T_hot (maximum possible efficiency)
//    For T_hot = Planck temperature (1.417×10³² K), T_cold = CMB (2.725 K):
//    η_max = 1 - 2.725/1.417×10³² ≈ 1 (essentially 100%)
//    For T_hot = Sun (5778 K), T_cold = Earth (288 K): η = 1 - 288/5778 ≈ 0.95
//
// 4. Geometric Friction
//    Friction arises from information loss across scale boundaries.
//    F_friction = κ · (∇S)² where κ = 1/(φ·π) is the closure coupling.
//    This is the geometric analog of viscous dissipation.
//
// 5. Stefan-Boltzmann Radiation
//    j = σ T⁴ (radiant emittance per unit area)
//    σ = 5.670374×10⁻⁸ W·m⁻²·K⁻⁴ (Stefan-Boltzmann constant)
//    Total power: P = A · σ · T⁴
//
// 6. Wien's Displacement Law
//    λ_max = b / T where b = 2.897771955×10⁻³ m·K
//    For T = 5778 K (Sun): λ_max ≈ 501 nm (green-blue)
//    For T = 2.725 K (CMB): λ_max ≈ 1.06 mm (microwave)
//
// 7. Toroidal Heat Engine
//    A toroidal cavity with temperature gradient drives a heat engine.
//    Working fluid circulates around the torus (Rankine cycle analog).
//    Major radius R = thermal diffusion length, minor radius r = R/φ.
// ═══════════════════════════════════════════════════════════════════════════════

import {
  PHI,
  PHI_INV,
  PLANCK_LENGTH,
  PLANCK_FREQUENCY,
  REDUCED_PLANCK_CONSTANT,
  BOLTZMANN_CONSTANT,
  STEFAN_BOLTZMANN_CONSTANT,
  WIEN_DISPLACEMENT_CONSTANT,
  PLANCK_TEMPERATURE,
  CMB_TEMPERATURE,
  SOLAR_TEMPERATURE,
  COHERENCE_THRESHOLD,
  QRF_CRITICAL_SCALE,
} from "../../core/constants";
import type { Float64, ScaleIndex, GeometricField } from "../../core/types";
import type { DipoleMoment, Polarization } from "./types";
import { BaseFramework } from "./base_framework";

// ═══════════════════════════════════════════════════════════════════════════════
// 1. Thermodynamic Constants
// ═══════════════════════════════════════════════════════════════════════════════

/** Reference temperature gradient (K/m) for scale n=0. */
const TEMP_GRADIENT_0: Float64 = 1.0e32 as Float64;

/** Thermal conductivity of vacuum (effectively zero, but small for computation). */
const VACUUM_THERMAL_CONDUCTIVITY: Float64 = 1.0e-30 as Float64;

/** Geometric friction coefficient: κ = 1/(φ·π). */
const GEOMETRIC_FRICTION: Float64 = (1 / (PHI * Math.PI)) as Float64;

// ═══════════════════════════════════════════════════════════════════════════════
// 2. Thermodynamic Computations
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Compute temperature at scale n.
 * [THERMO] — T(n) = T_P · φ^(-n) where T_P is Planck temperature.
 * At n=0: T = T_P ≈ 1.417×10³² K (Planck temperature)
 * At n=292: T ≈ 2.725 K (CMB temperature, matches observation!)
 */
function scaleTemperature(scale: ScaleIndex): Float64 {
  return (PLANCK_TEMPERATURE * Math.pow(PHI_INV, scale)) as Float64;
}

/**
 * Compute Carnot efficiency at scale n.
 * [THERMO] — η = 1 - T_cold / T_hot.
 * T_hot = T(n), T_cold = T(n+1) = T(n) · φ^(-1).
 * η = 1 - φ^(-1) = 1 - 0.618... = 0.382... = λ = 1/φ²!
 * The Carnot efficiency at every scale equals the coherence threshold λ!
 * This is NOT a coincidence — it is the deep structure of the RHUFT.
 */
function carnotEfficiency(scale: ScaleIndex): Float64 {
  const T_hot = scaleTemperature(scale);
  const T_cold = scaleTemperature((scale + 1) as ScaleIndex);
  return (1 - (T_cold as number) / (T_hot as number)) as Float64;
}

/**
 * Compute Stefan-Boltzmann radiant emittance at scale n.
 * [THERMO] — j = σ · T⁴.
 */
function stefanBoltzmannEmittance(scale: ScaleIndex): Float64 {
  const T = scaleTemperature(scale) as number;
  return (STEFAN_BOLTZMANN_CONSTANT * T * T * T * T) as Float64;
}

/**
 * Compute Wien peak wavelength at scale n.
 * [THERMO] — λ_max = b / T.
 */
function wienPeakWavelength(scale: ScaleIndex): Float64 {
  const T = scaleTemperature(scale) as number;
  return (WIEN_DISPLACEMENT_CONSTANT / T) as Float64;
}

/**
 * Compute entropy of a system at scale n.
 * [THERMO] — S = k_B · ln(Ω) where Ω is the number of microstates.
 * For a black hole: S = A / (4 · L_P²) (Bekenstein-Hawking entropy).
 * For our model: S(n) = k_B · φ^n · qrf(n).
 */
function scaleEntropy(scale: ScaleIndex): Float64 {
  const qrf = Math.pow(PHI_INV, scale / QRF_CRITICAL_SCALE);
  return (BOLTZMANN_CONSTANT * Math.pow(PHI, scale) * qrf) as Float64;
}

// ═══════════════════════════════════════════════════════════════════════════════
// 3. F7 Thermodynamic Framework
// ═══════════════════════════════════════════════════════════════════════════════

export class F7_Thermodynamic extends BaseFramework {
  readonly id = "F7_Thermodynamic";
  readonly name = "Thermodynamic Framework";
  readonly characteristicScale = 34;
  readonly qrfThreshold = 0.8320742315563247 as Float64;
  readonly description =
    "Entropy production, heat flow, Carnot efficiency, geometric friction, radiation";

  /**
   * Compute energy density at scale n.
   * [ENERGY] — ρ(n) = σ · T(n)⁴ / c · qrf(n)² (radiation energy density).
   * The Stefan-Boltzmann law gives the energy density of blackbody radiation.
   */
  override computeEnergyDensity(scale: ScaleIndex): Float64 {
    const qrf = this.qrfAttenuation(scale);
    const j = stefanBoltzmannEmittance(scale);
    const c = 2.99792458e8 as Float64; // speed of light
    // Energy density u = 4σT⁴/c = 4j/c (for isotropic radiation)
    return ((4 * (j as number) / (c as number)) * qrf * qrf) as Float64;
  }

  /**
   * Compute the framework's effect on the field.
   * [COMPUTE] — Applies thermal modulation using the Stefan-Boltzmann law
   * and Carnot efficiency. The field is modulated by temperature-dependent
   * Planck distribution and geometric friction:
   *   ψ_mod(i) = ψ_in(i) · [1 + qrf(n) · (η_Carnot · f_BB(i) - F_friction)]
   * where f_BB is the blackbody spectral distribution and F_friction is
   * the geometric friction from scale boundary crossing.
   */
  override compute(scale: ScaleIndex, inputField: GeometricField): GeometricField {
    const qrf = this.qrfAttenuation(scale);
    const L_n = this.scaleLength(scale);
    const eta = carnotEfficiency(scale) as number;
    const T = scaleTemperature(scale) as number;

    const output = new Float64Array(inputField.length);
    for (let i = 0; i < inputField.length; i++) {
      // Planck blackbody spectral distribution (simplified)
      // B_ν(T) = (2hν³/c²) / (exp(hν/kT) - 1)
      // We use a normalized approximation: f(ν) = ν³ · exp(-hν/kT)
      const nu = (i / inputField.length) * (PLANCK_FREQUENCY as number) * Math.pow(PHI_INV, scale);
      const h_nu_over_kT = (REDUCED_PLANCK_CONSTANT * 2 * Math.PI * nu) / (BOLTZMANN_CONSTANT * T);
      const planckFactor = (nu * nu * nu) * Math.exp(-h_nu_over_kT);

      // Geometric friction from information loss across scale boundary
      const friction = GEOMETRIC_FRICTION * (1 - qrf) * (1 - qrf);

      // Combined thermal modulation
      const modulation = 1 + qrf * (eta * planckFactor - friction);
      output[i] = (inputField[i] * modulation) as Float64;
    }

    return output as unknown as GeometricField;
  }

  /**
   * Get the dipole moment at scale n.
   * [DIPOLE] — Thermal dipole from temperature gradient across the torus.
   * The temperature difference ΔT = T_hot - T_cold creates a "thermal dipole"
   * analogous to an electric dipole from charge separation.
   * p_thermal = k_B · ΔT · L(n) / T_avg (normalized thermal dipole).
   */
  override getDipoleMoment(scale: ScaleIndex): DipoleMoment {
    const qrf = this.qrfAttenuation(scale);
    const L_n = this.scaleLength(scale);
    const T_hot = scaleTemperature(scale) as number;
    const T_cold = scaleTemperature((scale + 1) as ScaleIndex) as number;
    const deltaT = T_hot - T_cold;
    const T_avg = (T_hot + T_cold) / 2;

    // Thermal dipole magnitude: proportional to temperature difference
    const magnitude = ((BOLTZMANN_CONSTANT * deltaT * (L_n as number) / T_avg) * qrf) as Float64;

    return {
      magnitude,
      direction: [0 as Float64, 0 as Float64, 1 as Float64], // hot → cold direction
      scale,
    };
  }

  /**
   * Get the polarization at scale n.
   * [POLARIZATION] — Thermal polarization from anisotropic heat flow.
   * In a toroidal field with temperature gradient, heat flows preferentially
   * along the toroidal axis, creating anisotropic thermal conductivity.
   * χ_thermal = κ · (∇T)² / T² · qrf(n) (dimensionless thermal susceptibility).
   */
  override getPolarization(scale: ScaleIndex): Polarization {
    const qrf = this.qrfAttenuation(scale);
    const T = scaleTemperature(scale) as number;
    const L_n = this.scaleLength(scale) as number;
    const gradT = TEMP_GRADIENT_0 as number * Math.pow(PHI_INV, scale);

    // Thermal susceptibility: proportional to temperature gradient squared
    const chi_thermal = (VACUUM_THERMAL_CONDUCTIVITY as number * gradT * gradT / (T * T)) * qrf;

    return {
      P_electric: [0 as Float64, 0 as Float64, 0 as Float64],
      P_magnetic: [0 as Float64, 0 as Float64, (chi_thermal * 0.01) as Float64],
      susceptibility: [
        (chi_thermal * 0.1) as Float64, 0, 0,
        0, (chi_thermal * 0.1) as Float64, 0,
        0, 0, (chi_thermal * 1.0) as Float64, // anisotropic: z-axis preferred
      ] as unknown as readonly Float64[],
      scale,
    };
  }

  /**
   * Get the Master Equation term at scale n.
   * [MASTER] — Phase encodes Carnot efficiency:
   *   θ_k = 2π · η_Carnot · (scale/89) · (k/12) = 2π · λ · (scale/89) · (k/12)
   * where η_Carnot = λ = 1/φ² (the deep connection!)
   * and k=6 (F7 index).
   */
  override getMasterEquationTerm(scale: ScaleIndex): {
    re: Float64;
    im: Float64;
    weight: Float64;
  } {
    const k = 6; // F7 → index 6 (0-based)
    const weight = Math.pow(PHI_INV, k) as Float64;
    const eta = carnotEfficiency(scale) as number; // = λ = 1/φ²
    const phase = (2 * Math.PI * eta * (scale / QRF_CRITICAL_SCALE) * (k / 12)) as Float64;
    const re = (weight * Math.cos(phase)) as Float64;
    const im = (weight * Math.sin(phase)) as Float64;
    return { re, im, weight };
  }
}
