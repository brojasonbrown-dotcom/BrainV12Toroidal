// ═══════════════════════════════════════════════════════════════════════════════
// F8 Galactic Framework
// ═══════════════════════════════════════════════════════════════════════════════
// Implements galactic-scale physics: spiral structure, magnetic dynamo,
// dark matter halo, rotation curves, and stellar population synthesis.
// The galactic framework bridges stellar and cosmic scales.
//
// Physics:
// ───────────────────────────────────────────────────────────────────────────────
// 1. Spiral Galaxy Structure
//    Spiral arms are density waves (Lin-Shu hypothesis), not material arms.
//    Pattern speed Ω_p ≈ constant. Stars move through arms at Ω - Ω_p.
//    Pitch angle i ≈ 15-20° for grand-design spirals.
//    Logarithmic spiral: r(θ) = r_0 · exp(θ · tan(i)).
//    For Milky Way: r_0 ≈ 2.5 kpc, i ≈ 12°.
//
// 2. Galactic Rotation Curve
//    V(r) = √(GM(r)/r) where M(r) is enclosed mass.
//    For visible matter: V(r) ∝ r^(-1/2) at large r (Keplerian falloff).
//    Observed: V(r) ≈ constant (flat rotation curve) → dark matter required.
//    Dark matter halo: ρ(r) = ρ_0 / (1 + (r/r_s)²) (isothermal sphere approx).
//
// 3. Magnetic Dynamo
//    α-Ω dynamo: toroidal field from differential rotation, poloidal from α-effect.
//    B_toroidal ≈ B_0 · sin(2π · r / r_gal) (antisymmetric across galactic plane).
//    Dynamo number D = α · Ω · h³ / η² (must exceed critical value for amplification).
//    Pitch angle of magnetic spiral ≈ pitch angle of stellar spiral.
//
// 4. Dark Matter Halo
//    NFW profile: ρ(r) = ρ_c / ((r/r_s)(1 + r/r_s)²)
//    ρ_c = characteristic density, r_s = scale radius.
//    Concentration c = r_vir / r_s ≈ 10-15 for Milky Way.
//    Mass within r_vir: M_vir = (4π/3) · ρ_c · r_vir³ (with overdensity factor).
//
// 5. Stellar Population Synthesis
//    Initial mass function (IMF): dN/dM ∝ M^(-α)
//    Salpeter: α = 2.35. Kroupa: α = 1.3 (M<0.5), 2.3 (M>0.5).
//    Metallicity gradient: [Fe/H] decreases with galactocentric radius.
//
// 6. Toroidal Galactic Magnetic Field
//    The galaxy's magnetic field has a toroidal component (azimuthal)
//    and a poloidal component (meridional). The toroidal field dominates
//    in the disk, while the poloidal field dominates in the halo.
//    Major radius R = galactic radius ≈ 15-20 kpc.
//    Minor radius r = disk thickness ≈ 300 pc (thin disk) + 3 kpc (thick disk).
//    Aspect ratio R/r ≈ φ (optimal for dynamo stability).
// ═══════════════════════════════════════════════════════════════════════════════

import {
  PHI,
  PHI_INV,
  PLANCK_LENGTH,
  PLANCK_FREQUENCY,
  REDUCED_PLANCK_CONSTANT,
  GRAVITATIONAL_CONSTANT,
  SOLAR_MASS,
  PARSEC,
  HUBBLE_CONSTANT,
  DARK_MATTER_DENSITY_PARAMETER,
  TOTAL_MATTER_DENSITY,
  COHERENCE_THRESHOLD,
  QRF_CRITICAL_SCALE,
} from "../../core/constants";
import type { Float64, ScaleIndex, GeometricField } from "../../core/types";
import type { DipoleMoment, Polarization } from "./types";
import { BaseFramework } from "./base_framework";

// ═══════════════════════════════════════════════════════════════════════════════
// 1. Galactic Constants
// ═══════════════════════════════════════════════════════════════════════════════

/** Milky Way total mass (visible + dark) ≈ 1.5 × 10¹² M_☉. */
const MW_TOTAL_MASS: Float64 = (1.5e12 * SOLAR_MASS) as Float64;

/** Milky Way virial radius ≈ 250 kpc. */
const MW_VIRIAL_RADIUS: Float64 = (250e3 * PARSEC) as Float64;

/** Milky Way disk radius ≈ 15 kpc. */
const MW_DISK_RADIUS: Float64 = (15e3 * PARSEC) as Float64;

/** Milky Way disk thickness (thin + thick) ≈ 3 kpc. */
const MW_DISK_THICKNESS: Float64 = (3e3 * PARSEC) as Float64;

/** NFW scale radius ≈ 20 kpc. */
const NFW_SCALE_RADIUS: Float64 = (20e3 * PARSEC) as Float64;

/** Characteristic density for NFW profile. */
const NFW_RHO_C: Float64 = 1.0e4 as Float64; // arbitrary, rescaled by qrf

/** Magnetic field strength in galactic disk ≈ 10 μG. */
const MW_DISK_B_FIELD: Float64 = 1.0e-10 as Float64; // 10 μG = 1 nT

// ═══════════════════════════════════════════════════════════════════════════════
// 2. Galactic Physics Computations
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * NFW dark matter density profile.
 * [COSM] — ρ(r) = ρ_c / ((r/r_s)(1 + r/r_s)²).
 */
function nfwDensity(r: Float64): Float64 {
  const r_rs = (r as number) / (NFW_SCALE_RADIUS as number);
  return (NFW_RHO_C / (r_rs * (1 + r_rs) * (1 + r_rs))) as Float64;
}

/**
 * Enclosed mass within radius r (NFW profile).
 * [COSM] — M(r) = 4π · ρ_c · r_s³ · [ln(1 + r/r_s) - (r/r_s)/(1 + r/r_s)].
 */
function nfwEnclosedMass(r: Float64): Float64 {
  const x = (r as number) / (NFW_SCALE_RADIUS as number);
  const mass = 4 * Math.PI * (NFW_RHO_C as number) * Math.pow(NFW_SCALE_RADIUS as number, 3) *
    (Math.log(1 + x) - x / (1 + x));
  return mass as Float64;
}

/**
 * Rotation velocity from enclosed mass.
 * [DYNAMICS] — V(r) = √(G · M(r) / r).
 */
function rotationVelocity(r: Float64): Float64 {
  const M = nfwEnclosedMass(r);
  return Math.sqrt((GRAVITATIONAL_CONSTANT as number) * (M as number) / (r as number)) as Float64;
}

/**
 * Logarithmic spiral for galactic arms.
 * [STRUCTURE] — r(θ) = r_0 · exp(θ · tan(i)) where i is pitch angle.
 */
function spiralArmRadius(theta: number, r0: number, pitchAngle: number): number {
  return r0 * Math.exp(theta * Math.tan(pitchAngle));
}

/**
 * Magnetic field strength as function of galactocentric radius.
 * [DYNAMO] — B(r) ≈ B_0 · exp(-r / r_B) · sin(2π · r / r_arm).
 * Exponential decay with radius, modulated by spiral arm pattern.
 */
function magneticFieldStrength(r: Float64): Float64 {
  const r_kpc = (r as number) / (1e3 * PARSEC as number);
  const decay = Math.exp(-r_kpc / 5); // 5 kpc decay length
  const armModulation = Math.sin(2 * Math.PI * r_kpc / 3); // 3 kpc arm spacing
  return ((MW_DISK_B_FIELD as number) * decay * armModulation) as Float64;
}

// ═══════════════════════════════════════════════════════════════════════════════
// 3. F8 Galactic Framework
// ═══════════════════════════════════════════════════════════════════════════════

export class F8_Galactic extends BaseFramework {
  readonly id = "F8_Galactic";
  readonly name = "Galactic Framework";
  readonly characteristicScale = 250;
  readonly qrfThreshold = 0.2587951104439505 as Float64;
  readonly description =
    "Galactic spiral structure, magnetic dynamo, dark matter halo, rotation curves";

  /**
   * Compute energy density at scale n.
   * [ENERGY] — ρ(n) = ρ_DM(n) + ρ_B²(n) / (2μ₀) + ρ_*(n).
   * Dark matter density + magnetic energy density + stellar energy density.
   */
  override computeEnergyDensity(scale: ScaleIndex): Float64 {
    const qrf = this.qrfAttenuation(scale);
    const r = MW_DISK_RADIUS;
    const rho_dm = nfwDensity(r) as number;
    const B = magneticFieldStrength(r) as number;
    const mu0 = 1.2566370614e-6; // vacuum permeability
    const u_B = B * B / (2 * mu0); // magnetic energy density
    const u_star = 1.0e-10; // approximate stellar energy density
    return ((rho_dm + u_B + u_star) * qrf * qrf) as Float64;
  }

  /**
   * Compute the framework's effect on the field.
   * [COMPUTE] — Modulates the input field using galactic rotation curve
   * and magnetic spiral structure. The field is wrapped onto the galactic
   * disk and modulated by spiral arm density waves:
   *   ψ_mod(i) = ψ_in(i) · [1 + qrf(n) · (V_rot(r_i)/V_0 · cos(θ_i · n_arms) + B(r_i)/B_0)]
   * where n_arms = 2 (Milky Way has 2 major spiral arms).
   */
  override compute(scale: ScaleIndex, inputField: GeometricField): GeometricField {
    const qrf = this.qrfAttenuation(scale);
    const L_n = this.scaleLength(scale);
    const r_gal = (MW_DISK_RADIUS as number);

    const output = new Float64Array(inputField.length);
    for (let i = 0; i < inputField.length; i++) {
      // Map index to galactocentric radius and angle
      const r = ((i / inputField.length) * r_gal);
      const theta = (2 * Math.PI * i / inputField.length) * 2; // 2 arms

      // Rotation velocity (flat curve)
      const v_rot = rotationVelocity(r as Float64) as number;
      const v_0 = 220e3; // 220 km/s characteristic velocity

      // Spiral arm density wave
      const spiralDensity = Math.cos(theta);

      // Magnetic field modulation
      const B_mag = magneticFieldStrength(r as Float64) as number;
      const B_0 = MW_DISK_B_FIELD as number;

      // Combined galactic modulation
      const modulation = 1 + qrf * ((v_rot / v_0) * spiralDensity + (B_mag / B_0) * 0.1);
      output[i] = (inputField[i] * modulation) as Float64;
    }

    return output as unknown as GeometricField;
  }

  /**
   * Get the dipole moment at scale n.
   * [DIPOLE] — Galactic magnetic dipole from the toroidal field component.
   * The galactic magnetic field has a toroidal (azimuthal) component that
   * creates a net dipole moment along the rotation axis (z-axis).
   * μ = I · A ≈ (B · L / μ₀) · π · R² where L is the toroidal circumference.
   */
  override getDipoleMoment(scale: ScaleIndex): DipoleMoment {
    const qrf = this.qrfAttenuation(scale);
    const R = MW_DISK_RADIUS as number;
    const B = MW_DISK_B_FIELD as number;
    const mu0 = 1.2566370614e-6;
    const current = (B * 2 * Math.PI * R) / mu0; // Ampere's law: I = B·L/μ₀
    const area = Math.PI * R * R;
    const magnitude = (current * area * qrf) as Float64;

    return {
      magnitude,
      direction: [0 as Float64, 0 as Float64, 1 as Float64], // along rotation axis
      scale,
    };
  }

  /**
   * Get the polarization at scale n.
   * [POLARIZATION] — Galactic magnetic polarization from the dynamo field.
   * The magnetic field is primarily toroidal (azimuthal) in the disk,
   * with a poloidal (meridional) component in the halo.
   * χ_magnetic = B / (μ₀ · H) = 1 + χ_m (for ferromagnetic-like alignment).
   */
  override getPolarization(scale: ScaleIndex): Polarization {
    const qrf = this.qrfAttenuation(scale);
    const B = MW_DISK_B_FIELD as number;
    const mu0 = 1.2566370614e-6;
    const H = B / mu0; // magnetic field strength
    const chi_m = (B / H) * qrf * 1e-5; // dimensionless magnetic susceptibility

    return {
      P_electric: [0 as Float64, 0 as Float64, 0 as Float64],
      P_magnetic: [0 as Float64, 0 as Float64, (chi_m * B) as Float64],
      susceptibility: [
        (chi_m * 0.1) as Float64, 0, 0,
        0, (chi_m * 0.1) as Float64, 0,
        0, 0, (chi_m * 1.0) as Float64, // z-axis aligned with rotation
      ] as unknown as readonly Float64[],
      scale,
    };
  }

  /**
   * Get the Master Equation term at scale n.
   * [MASTER] — Phase encodes galactic rotation:
   *   θ_k = 2π · (V_rot / V_P) · (scale/89) · (k/12)
   * where V_P = √(G·M_P/r_P) is the Planck velocity scale.
   * and k=7 (F8 index).
   */
  override getMasterEquationTerm(scale: ScaleIndex): {
    re: Float64;
    im: Float64;
    weight: Float64;
  } {
    const k = 7; // F8 → index 7 (0-based)
    const weight = Math.pow(PHI_INV, k) as Float64;
    const v_rot = rotationVelocity(MW_DISK_RADIUS) as number;
    const v_planck = 2.99792458e8; // c
    const phase = (2 * Math.PI * (v_rot / v_planck) * (scale / QRF_CRITICAL_SCALE) * (k / 12)) as Float64;
    const re = (weight * Math.cos(phase)) as Float64;
    const im = (weight * Math.sin(phase)) as Float64;
    return { re, im, weight };
  }
}
