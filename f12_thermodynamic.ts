// ═══════════════════════════════════════════════════════════════════════════════
// F12 Thermodynamic Framework (Cosmic Scale)
// ═══════════════════════════════════════════════════════════════════════════════
// Implements cosmic thermodynamics: entropy production, heat death, Hawking
// radiation, black hole thermodynamics, and the arrow of time. This is the
// thermodynamic framework at the cosmic scale, complementing F7 at the mesoscale.
//
// Physics:
// ─────────────────────────────────══════════════════════════════════════════════
// 1. Black Hole Thermodynamics
//    Hawking temperature: T_H = ℏc³ / (8πGMk_B).
//    For Sgr A* (M ≈ 4×10⁶ M_☉): T_H ≈ 10⁻¹⁷ K (essentially zero).
//    For stellar BH (M ≈ 10 M_☉): T_H ≈ 10⁻⁸ K.
//    For primordial BH (M ≈ 10¹² kg): T_H ≈ 10¹¹ K (would evaporate now!).
//    Entropy: S = A / (4Gℏ) = 4πGM² / (ℏc) (in units where G=ℏ=c=1: S = 4πM²).
//    Bekenstein bound: S ≤ 2πk_B R E / (ℏc).
//
// 2. Hawking Radiation
//    Power: P = ℏc⁶ / (15360πG²M²).
//    For Sgr A*: P ≈ 10⁻⁶⁷ W (essentially no radiation).
//    For primordial BH: P ≈ 10⁶ W (explosive evaporation!).
//    Lifetime: τ = 5120πG²M³ / (ℏc⁴) ≈ 10⁶⁷ years · (M / M_☉)³.
//    The universe will outlive all black holes by many orders of magnitude.
//
// 3. Heat Death of the Universe
//    Final state: all black holes evaporated, all matter decayed, maximum entropy.
//    Temperature: T_final ≈ 10⁻³⁰ K (from vacuum fluctuations, if ever reached).
//    Time to heat death: t ≈ 10¹⁰⁰ years (from Hawking evaporation of largest BHs).
//    The universe approaches a de Sitter vacuum with T = H / (2π) ≈ 10⁻²⁹ K.
//
// 4. Arrow of Time
//    Entropy always increases: dS/dt ≥ 0 (second law).
//    The arrow of time is the direction of increasing entropy.
//    In the RHUFT: the arrow of time is the direction of increasing scale n.
//    This is the deep connection: time IS scale evolution in the RHUFT ontology.
//
// 5. Cosmic Entropy Budget
//    CMB entropy: S_CMB ≈ 10⁸⁸ k_B (dominant entropy reservoir today).
//    BH entropy: S_BH ≈ 10¹⁰⁰ k_B (if all matter collapsed into BHs).
//    Dark energy entropy: S_Λ = 3π / (GℏΛ) ≈ 10¹²³ k_B (Gibbons-Hawking).
//    Total cosmic entropy: S_total ≈ S_Λ (dominated by dark energy horizon).
//
// 6. Toroidal Black Hole
//    The Kerr black hole (rotating) has a toroidal ergosphere.
//    The event horizon is a sphere, but the ergosphere is oblate and
//    touches the horizon at the poles, creating a toroidal region
//    where frame-dragging is so strong that no static observer can exist.
//    Major radius R = a = J/(Mc) (specific angular momentum).
//    Minor radius r = √(r_+² - a²) where r_+ = GM/c² + √((GM/c²)² - a²).
//    Aspect ratio R/r → φ as a → GM/c (maximal rotation).
// ═══════════════════════════════════════════════════════════════════════════════

import {
  PHI, PHI_INV,
  PLANCK_LENGTH, PLANCK_FREQUENCY, REDUCED_PLANCK_CONSTANT,
  GRAVITATIONAL_CONSTANT, SPEED_OF_LIGHT_EXACT,
  BOLTZMANN_CONSTANT, STEFAN_BOLTZMANN_CONSTANT,
  PLANCK_TEMPERATURE, PLANCK_MASS, PLANCK_TIME,
  CMB_TEMPERATURE, COSMOLOGICAL_CONSTANT,
  UNIVERSE_AGE, HUBBLE_CONSTANT,
  SOLAR_MASS, SOLAR_SCHWARZSCHILD_RADIUS,
  SGR_A_MASS, M87_MASS,
  COHERENCE_THRESHOLD, QRF_CRITICAL_SCALE,
} from "../../core/constants";
import type { Float64, ScaleIndex, GeometricField } from "../../core/types";
import type { DipoleMoment, Polarization } from "./types";
import { BaseFramework } from "./base_framework";

// ═══════════════════════════════════════════════════════════════════════════════
// 1. Cosmic Thermodynamic Constants
// ═══════════════════════════════════════════════════════════════════════════════

/** Sgr A* mass in kg. */
const SGR_A_MASS_KG: Float64 = (SGR_A_MASS * SOLAR_MASS) as Float64;

/** M87* mass in kg. */
const M87_MASS_KG: Float64 = (M87_MASS * SOLAR_MASS) as Float64;

/** Characteristic black hole mass for evaporation (M ≈ 10¹² kg). */
const PRIMORDIAL_BH_MASS: Float64 = 1.0e12 as Float64;

// ═══════════════════════════════════════════════════════════════════════════════
// 2. Black Hole Thermodynamics
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Compute Hawking temperature for a black hole of mass M.
 * [BH] — T_H = ℏc³ / (8πGMk_B).
 */
function hawkingTemperature(M: Float64): Float64 {
  const numerator = (REDUCED_PLANCK_CONSTANT as number) * (SPEED_OF_LIGHT_EXACT as number) ** 3;
  const denominator = 8 * Math.PI * (GRAVITATIONAL_CONSTANT as number) * (M as number) * (BOLTZMANN_CONSTANT as number);
  return (numerator / denominator) as Float64;
}

/**
 * Compute Hawking radiation power for a black hole of mass M.
 * [BH] — P = ℏc⁶ / (15360πG²M²).
 */
function hawkingPower(M: Float64): Float64 {
  const numerator = (REDUCED_PLANCK_CONSTANT as number) * (SPEED_OF_LIGHT_EXACT as number) ** 6;
  const denominator = 15360 * Math.PI * (GRAVITATIONAL_CONSTANT as number) ** 2 * (M as number) ** 2;
  return (numerator / denominator) as Float64;
}

/**
 * Compute black hole entropy (Bekenstein-Hawking).
 * [BH] — S = 4πG M² / (ℏc).
 */
function blackHoleEntropy(M: Float64): Float64 {
  const S = 4 * Math.PI * (GRAVITATIONAL_CONSTANT as number) * (M as number) ** 2 / ((REDUCED_PLANCK_CONSTANT as number) * (SPEED_OF_LIGHT_EXACT as number));
  return S as Float64;
}

/**
 * Compute black hole evaporation time.
 * [BH] — τ = 5120π G² M³ / (ℏ c⁴).
 */
function evaporationTime(M: Float64): Float64 {
  const tau = 5120 * Math.PI * (GRAVITATIONAL_CONSTANT as number) ** 2 * (M as number) ** 3 / ((REDUCED_PLANCK_CONSTANT as number) * (SPEED_OF_LIGHT_EXACT as number) ** 4);
  return tau as Float64;
}

/**
 * Compute Schwarzschild radius.
 * [GR] — r_s = 2GM / c².
 */
function schwarzschildRadius(M: Float64): Float64 {
  return ((2 * (GRAVITATIONAL_CONSTANT as number) * (M as number)) / (SPEED_OF_LIGHT_EXACT as number) ** 2) as Float64;
}

// ═══════════════════════════════════════════════════════════════════════════════
// 3. Cosmic Thermodynamic Computations
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Compute de Sitter temperature from cosmological constant.
 * [COSM] — T_dS = H / (2π) = ℏ √(Λ/3) / (2π k_B).
 */
function deSitterTemperature(): Float64 {
  const Lambda = COSMOLOGICAL_CONSTANT as number;
  const H = Math.sqrt(Lambda / 3) * (SPEED_OF_LIGHT_EXACT as number);
  return (H / (2 * Math.PI)) as Float64;
}

/**
 * Compute Gibbons-Hawking entropy of de Sitter space.
 * [COSM] — S = A / (4 L_P²) = 3π / (G ℏ Λ).
 */
function gibbonsHawkingEntropy(): Float64 {
  const Lambda = COSMOLOGICAL_CONSTANT as number;
  const S = 3 * Math.PI / ((GRAVITATIONAL_CONSTANT as number) * (REDUCED_PLANCK_CONSTANT as number) * Lambda);
  return S as Float64;
}

/**
 * Compute CMB entropy.
 * [COSM] — S_CMB = (4/3) · (u_CMB / T_CMB) · V_Hubble.
 */
function cmbEntropy(): Float64 {
  const T = CMB_TEMPERATURE as number;
  const a = 4 * (STEFAN_BOLTZMANN_CONSTANT as number) / (SPEED_OF_LIGHT_EXACT as number); // radiation constant
  const u = a * T ** 4; // energy density
  const R_H = (SPEED_OF_LIGHT_EXACT as number) / (HUBBLE_CONSTANT as number); // Hubble radius
  const V = (4 / 3) * Math.PI * R_H ** 3; // Hubble volume
  const S = (4 / 3) * (u / T) * V;
  return S as Float64;
}

// ═══════════════════════════════════════════════════════════════════════════════
// 4. F12 Thermodynamic Framework (Cosmic)
// ═══════════════════════════════════════════════════════════════════════════════

export class F12_Thermodynamic extends BaseFramework {
  readonly id = "F12_Thermodynamic";
  readonly name = "Cosmic Thermodynamic Framework";
  readonly characteristicScale = 270;
  readonly qrfThreshold = 0.2322696962837574 as Float64;
  readonly description =
    "Cosmic entropy, heat death, Hawking radiation, black hole thermodynamics, arrow of time";

  /**
   * Compute energy density at scale n.
   * [ENERGY] — ρ(n) = (ρ_CMB + ρ_Λ + ρ_BH) · qrf(n)².
   * Dark energy dominates; CMB is negligible; BH radiation is tiny.
   */
  override computeEnergyDensity(scale: ScaleIndex): Float64 {
    const qrf = this.qrfAttenuation(scale);
    const rho_cmb = (STEFAN_BOLTZMANN_CONSTANT as number) * (CMB_TEMPERATURE as number) ** 4 * 4 / (SPEED_OF_LIGHT_EXACT as number);
    const rho_lambda = (COSMOLOGICAL_CONSTANT as number) * (SPEED_OF_LIGHT_EXACT as number) ** 2 / (8 * Math.PI * (GRAVITATIONAL_CONSTANT as number));
    const rho_bh = (hawkingPower(SGR_A_MASS_KG) as number) / ((4 / 3) * Math.PI * (schwarzschildRadius(SGR_A_MASS_KG) as number) ** 3);
    return ((rho_cmb + rho_lambda + rho_bh) * qrf * qrf) as Float64;
  }

  /**
   * Compute the framework's effect on the field.
   * [COMPUTE] — Modulates the input field using Hawking radiation temperature
   * and cosmic entropy gradient. The field is "heated" by the Hawking flux
   * and "cooled" by the dark energy expansion:
   *   ψ_mod(i) = ψ_in(i) · [1 + qrf(n) · (T_Hawking/T_P · f_rad(i) - S_dot(i)/S_max)]
   * where f_rad is the Hawking radiation spectral distribution and S_dot is
   * the entropy production rate.
   */
  override compute(scale: ScaleIndex, inputField: GeometricField): GeometricField {
    const qrf = this.qrfAttenuation(scale);
    const T_H = hawkingTemperature(SGR_A_MASS_KG) as number;
    const T_P = PLANCK_TEMPERATURE as number;

    // Cosmic entropy production rate (simplified: dS/dt = S_Λ · H_0)
    const S_dot = (gibbonsHawkingEntropy() as number) * (HUBBLE_CONSTANT as number);
    const S_max = 1e123; // maximum entropy reference

    const output = new Float64Array(inputField.length);
    for (let i = 0; i < inputField.length; i++) {
      // Hawking radiation spectral distribution (blackbody at T_H)
      // B_ν(T) = (2hν³/c²) / (exp(hν/kT) - 1)
      // We use a normalized approximation
      const nu = (i / inputField.length) * (PLANCK_FREQUENCY as number) * Math.pow(PHI_INV, scale);
      const h_nu_over_kT = (REDUCED_PLANCK_CONSTANT as number) * 2 * Math.PI * nu / (BOLTZMANN_CONSTANT as number) * T_H;
      const hawkingFactor = (nu ** 3) * Math.exp(-h_nu_over_kT); // Rayleigh-Jeans tail approximation

      // Entropy production imprint
      const entropyFactor = S_dot / S_max * (i / inputField.length);

      // Combined cosmic thermodynamic modulation
      const modulation = 1 + qrf * ((T_H / T_P) * hawkingFactor - entropyFactor);
      output[i] = (inputField[i] * modulation) as Float64;
    }

    return output as unknown as GeometricField;
  }

  /**
   * Get the dipole moment at scale n.
   * [DIPOLE] — Cosmic dipole from CMB temperature anisotropy (already computed
   * in F9, but here we compute the thermal dipole from entropy gradient).
   * The entropy gradient across the Hubble sphere creates an effective thermal
   * dipole: p_thermal = k_B · T_dS · R_H (de Sitter thermal dipole).
   */
  override getDipoleMoment(scale: ScaleIndex): DipoleMoment {
    const qrf = this.qrfAttenuation(scale);
    const R_H = (SPEED_OF_LIGHT_EXACT as number) / (HUBBLE_CONSTANT as number);
    const T_dS = deSitterTemperature() as number;

    const magnitude = ((BOLTZMANN_CONSTANT as number) * T_dS * R_H * qrf) as Float64;

    return {
      magnitude,
      direction: [0 as Float64, 0 as Float64, 1 as Float64],
      scale,
    };
  }

  /**
   * Get the polarization at scale n.
   * [POLARIZATION] — Cosmic polarization from gravitational wave imprint on CMB.
   * B-mode polarization: primordial gravitational waves from inflation create
     a curl pattern in the CMB polarization (B-modes, not E-modes).
   * The B-mode amplitude is proportional to the tensor-to-scalar ratio r.
   * Current upper bound: r < 0.06 (Planck 2018 + BICEP/Keck).
   */
  override getPolarization(scale: ScaleIndex): Polarization {
    const qrf = this.qrfAttenuation(scale);
    const r_tensor = 0.06; // upper bound on tensor-to-scalar ratio
    const chi_bmode = (r_tensor * qrf * 1e-7) as Float64; // B-mode is ~10⁻⁷ of temperature

    return {
      P_electric: [0 as Float64, 0 as Float64, 0 as Float64],
      P_magnetic: [0 as Float64, 0 as Float64, (chi_bmode * 0.01) as Float64],
      susceptibility: [
        (chi_bmode * 0.1) as Float64, 0, 0,
        0, (chi_bmode * 0.1) as Float64, 0,
        0, 0, (chi_bmode * 1.0) as Float64,
      ] as unknown as readonly Float64[],
      scale,
    };
  }

  /**
   * Get the Master Equation term at scale n.
   * [MASTER] — Phase encodes the arrow of time (entropy increase):
   *   θ_k = 2π · (S_now / S_max) · (scale/89) · (k/12)
   * where S_now = current cosmic entropy, S_max = maximum entropy,
   * and k=11 (F12 index, the last framework).
   */
  override getMasterEquationTerm(scale: ScaleIndex): {
    re: Float64;
    im: Float64;
    weight: Float64;
  } {
    const k = 11; // F12 → index 11 (0-based, last framework)
    const weight = Math.pow(PHI_INV, k) as Float64;
    const S_now = (cmbEntropy() as number) + (gibbonsHawkingEntropy() as number);
    const S_max = 1e123;
    const phase = (2 * Math.PI * (S_now / S_max) * (scale / QRF_CRITICAL_SCALE) * (k / 12)) as Float64;
    const re = (weight * Math.cos(phase)) as Float64;
    const im = (weight * Math.sin(phase)) as Float64;
    return { re, im, weight };
  }
}
