// ═══════════════════════════════════════════════════════════════════════════════
// F10 Molecular Framework
// ═══════════════════════════════════════════════════════════════════════════════
// Implements molecular-scale physics: chemical bonds, molecular orbitals,
// dipole moments, polarization, vibrational modes, and reaction kinetics.
// The molecular framework bridges quantum and biological scales.
//
// Physics:
// ─────────────────────────────────══════════════════════════════════════════════
// 1. Chemical Bonds
//    Covalent: sharing of electron pairs. Bond lengths: C-C ≈ 1.54 Å, C=C ≈ 1.34 Å.
//    Ionic: electrostatic attraction. Lattice energy: U ≈ -N_A M z⁺ z⁻ e² / (4πε₀ r₀) (1 - 1/n).
//    Metallic: electron sea, Fermi energy E_F = ℏ² k_F² / (2m).
//    Hydrogen: special case, directional, strength ≈ 10-40 kJ/mol.
//    Bond energy: C-C ≈ 347 kJ/mol, H-H ≈ 436 kJ/mol, O-H ≈ 463 kJ/mol.
//
// 2. Molecular Orbitals (LCAO-MO)
//    ψ_MO = Σ c_i · ψ_AO (linear combination of atomic orbitals).
//    Bonding: constructive interference, lower energy.
//    Antibonding: destructive interference, higher energy, node between nuclei.
//    σ bonds: head-on overlap (s-s, s-p, p-p along axis).
//    π bonds: side-on overlap (p-p perpendicular to axis).
//    Hybridization: sp, sp², sp³ — determines molecular geometry.
//
// 3. Dipole Moments
//    p = Σ q_i · r_i (vector sum of bond dipoles).
//    Water: p ≈ 1.85 D (1 D = 3.336×10⁻³⁰ C·m).
//    CO₂: p = 0 (symmetric cancellation).
//    NH₃: p ≈ 1.47 D (trigonal pyramidal, lone pair contribution).
//
// 4. Vibrational Modes
//    Harmonic oscillator: E_v = ℏω(v + 1/2) where v = vibrational quantum number.
//    ω = √(k/μ) where k = force constant, μ = reduced mass.
//    IR active: dipole moment change during vibration.
//    Raman active: polarizability change during vibration.
//
// 5. Reaction Kinetics
//    Arrhenius: k = A · exp(-E_a / (k_B T)).
//    Transition state: ΔG‡ = ΔH‡ - TΔS‡.
//    Eyring equation: k = (k_B T / h) · exp(-ΔG‡ / (k_B T)).
//
// 6. Toroidal Molecular Structure
//    Aromatic rings (benzene, naphthalene) have delocalized π electrons
//    forming a toroidal current. Ring current = I = e · v / (2πr).
//    Major radius R = C-C bond length × number of atoms / (2π).
//    Minor radius r = p orbital extent ≈ 1 Å.
//    Aspect ratio R/r ≈ φ for benzene (R ≈ 1.4 Å, r ≈ 0.9 Å).
// ═══════════════════════════════════════════════════════════════════════════════

import {
  PHI, PHI_INV,
  PLANCK_LENGTH, PLANCK_FREQUENCY, REDUCED_PLANCK_CONSTANT,
  ELEMENTARY_CHARGE, BOLTZMANN_CONSTANT, AVOGADRO_NUMBER,
  COHERENCE_THRESHOLD, QRF_CRITICAL_SCALE,
} from "../../core/constants";
import type { Float64, ScaleIndex, GeometricField } from "../../core/types";
import type { DipoleMoment, Polarization } from "./types";
import { BaseFramework } from "./base_framework";

// ═══════════════════════════════════════════════════════════════════════════════
// 1. Molecular Constants
// ═══════════════════════════════════════════════════════════════════════════════

/** C-C bond length (m). */
const BOND_C_C: Float64 = 1.54e-10 as Float64;

/** C=C bond length (m). */
const BOND_C_DOUBLE: Float64 = 1.34e-10 as Float64;

/** O-H bond length (m). */
const BOND_O_H: Float64 = 0.96e-10 as Float64;

/** Water dipole moment (C·m) ≈ 1.85 D = 6.17×10⁻³⁰ C·m. */
const DIPOLE_WATER: Float64 = 6.17e-30 as Float64;

/** Ammonia dipole moment (C·m) ≈ 1.47 D = 4.90×10⁻³⁰ C·m. */
const DIPOLE_AMMONIA: Float64 = 4.90e-30 as Float64;

/** Typical vibrational frequency (Hz) for C-H stretch. */
const VIBRATION_CH: Float64 = 9.0e13 as Float64; // ≈ 3000 cm⁻¹

/** Benzene ring radius (m). */
const BENZENE_RADIUS: Float64 = 1.40e-10 as Float64;

// ═══════════════════════════════════════════════════════════════════════════════
// 2. Molecular Physics Computations
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Compute bond energy from bond length (Morse potential approximation).
 * [CHEM] — E(r) = D_e · [1 - exp(-a(r - r_e))]² where D_e = dissociation energy.
 * Simplified: E ≈ D_e · (1 - r/r_e)² for small displacements.
 */
function bondEnergy(r: Float64, r_e: Float64, D_e: Float64): Float64 {
  const ratio = (r as number) / (r_e as number);
  return (D_e * (1 - ratio) * (1 - ratio)) as Float64;
}

/**
 * Compute vibrational frequency from force constant and reduced mass.
 * [PHYS] — ω = √(k/μ).
 */
function vibrationalFrequency(k: Float64, mu: Float64): Float64 {
  return Math.sqrt((k as number) / (mu as number)) as Float64;
}

/**
 * Compute molecular orbital energy (LCAO approximation).
 * [QM] — E = (H_aa ± H_ab) / (1 ± S) where S = overlap integral.
 * For bonding: E = (H_aa + H_ab) / (1 + S) (lower energy).
 * For antibonding: E = (H_aa - H_ab) / (1 - S) (higher energy).
 */
function molecularOrbitalEnergy(
  H_aa: Float64, H_ab: Float64, S: Float64, bonding: boolean
): Float64 {
  if (bonding) {
    return ((H_aa as number + H_ab as number) / (1 + (S as number))) as Float64;
  }
  return ((H_aa as number - H_ab as number) / (1 - (S as number))) as Float64;
}

/**
 * Compute Arrhenius rate constant.
 * [KINETICS] — k = A · exp(-E_a / (k_B T)).
 */
function arrheniusRate(A: Float64, E_a: Float64, T: Float64): Float64 {
  const exp_arg = -(E_a as number) / (BOLTZMANN_CONSTANT as number) / (T as number);
  return ((A as number) * Math.exp(exp_arg)) as Float64;
}

/**
 * Compute ring current for aromatic molecule.
 * [AROMATIC] — I = n · e · v / (2πr) where n = delocalized electrons.
 * For benzene: n = 6 π electrons, v ≈ c/137 (velocity in ground state).
 */
function ringCurrent(n_electrons: number, radius: Float64): Float64 {
  const v = (2.99792458e8 / 137) as number; // α·c ≈ c/137
  return ((n_electrons * (ELEMENTARY_CHARGE as number) * v) / (2 * Math.PI * (radius as number))) as Float64;
}

// ═══════════════════════════════════════════════════════════════════════════════
// 3. F10 Molecular Framework
// ═══════════════════════════════════════════════════════════════════════════════

export class F10_Molecular extends BaseFramework {
  readonly id = "F10_Molecular";
  readonly name = "Molecular Framework";
  readonly characteristicScale = 134;
  readonly qrfThreshold = 0.4845565312899482 as Float64;
  readonly description =
    "Chemical bonds, molecular orbitals, dipole moments, polarization, vibrational modes";

  /**
   * Compute energy density at scale n.
   * [ENERGY] — ρ(n) = (bond energy density + vibrational energy density) · qrf(n)².
   * Bond energy density ≈ bond energy / bond volume.
   * Vibrational energy density ≈ ℏω · (v + 1/2) / molecular volume.
   */
  override computeEnergyDensity(scale: ScaleIndex): Float64 {
    const qrf = this.qrfAttenuation(scale);
    const L_n = this.scaleLength(scale);
    const volume = (L_n * L_n * L_n) as Float64;

    // Bond energy density (C-C bond ≈ 347 kJ/mol)
    const bond_E = 347e3 * (AVOGADRO_NUMBER as number); // J/mol → J/molecule
    const bond_volume = (BOND_C_C as number) ** 3;
    const rho_bond = bond_E / bond_volume;

    // Vibrational energy density (ground state)
    const E_vib = REDUCED_PLANCK_CONSTANT * VIBRATION_CH * 0.5;
    const rho_vib = (E_vib as number) / bond_volume;

    return ((rho_bond + rho_vib) * qrf * qrf) as Float64;
  }

  /**
   * Compute the framework's effect on the field.
   * [COMPUTE] — Modulates the input field using molecular orbital interference
   * and vibrational mode coupling. The field is decomposed into "bonding"
   * and "antibonding" components (constructive and destructive interference):
   *   ψ_mod(i) = ψ_in(i) · [1 + qrf(n) · (c_bond · ψ_bond(i) + c_antibond · ψ_antibond(i))]
   * where ψ_bond = cos(π·i/N) and ψ_antibond = sin(π·i/N) (LCAO basis functions).
   */
  override compute(scale: ScaleIndex, inputField: GeometricField): GeometricField {
    const qrf = this.qrfAttenuation(scale);
    const L_n = this.scaleLength(scale);

    const output = new Float64Array(inputField.length);
    for (let i = 0; i < inputField.length; i++) {
      // LCAO basis functions (bonding and antibonding)
      const psi_bond = Math.cos(Math.PI * i / inputField.length);
      const psi_antibond = Math.sin(Math.PI * i / inputField.length);

      // Molecular orbital coefficients (φ-weighted)
      const c_bond = Math.pow(PHI_INV, 1) * (1 + 0.1 * Math.cos(2 * Math.PI * i / inputField.length));
      const c_antibond = Math.pow(PHI_INV, 2) * (1 - 0.1 * Math.cos(2 * Math.PI * i / inputField.length));

      // Vibrational mode (harmonic oscillator ground state)
      const omega = (VIBRATION_CH as number) * Math.pow(PHI_INV, scale / 10);
      const x = ((i / inputField.length) - 0.5) * (L_n as number);
      const vib_mode = Math.exp(-0.5 * omega * x * x / (REDUCED_PLANCK_CONSTANT as number));

      // Combined molecular modulation
      const modulation = 1 + qrf * (c_bond * psi_bond + c_antibond * psi_antibond) * vib_mode;
      output[i] = (inputField[i] * modulation) as Float64;
    }

    return output as unknown as GeometricField;
  }

  /**
   * Get the dipole moment at scale n.
   * [DIPOLE] — Molecular dipole from water molecule (asymmetric charge distribution).
   * The water dipole is the archetype: p = 1.85 D aligned along the C₂ axis.
   * At scale n, the dipole is qrf-attenuated: p(n) = p_0 · qrf(n) · (L(n)/L_mol).
   */
  override getDipoleMoment(scale: ScaleIndex): DipoleMoment {
    const qrf = this.qrfAttenuation(scale);
    const L_n = this.scaleLength(scale);
    const L_mol = BOND_C_C as number; // molecular length scale

    const magnitude = ((DIPOLE_WATER as number) * qrf * ((L_n as number) / L_mol)) as Float64;

    return {
      magnitude,
      direction: [0 as Float64, 0 as Float64, 1 as Float64], // along molecular axis
      scale,
    };
  }

  /**
   * Get the polarization at scale n.
   * [POLARIZATION] — Molecular polarization from bond polarizability.
   * α = α_0 + α_vib · q(v) where α_0 = electronic polarizability,
   * α_vib = vibrational polarizability, q(v) = vibrational coordinate.
   * For water: α ≈ 1.5×10⁻⁴⁰ C·m²/V (isotropic average).
   * Anisotropic: α_xx ≠ α_yy ≠ α_zz (tensor).
   */
  override getPolarization(scale: ScaleIndex): Polarization {
    const qrf = this.qrfAttenuation(scale);
    const alpha_0 = 1.5e-40; // electronic polarizability (C·m²/V)
    const alpha_vib = 0.3e-40; // vibrational polarizability

    // Vibrational coordinate (deterministic oscillation)
    const q_vib = Math.cos(2 * Math.PI * scale / 10);
    const alpha = (alpha_0 + alpha_vib * q_vib) * qrf;

    return {
      P_electric: [0 as Float64, 0 as Float64, 0 as Float64],
      P_magnetic: [0 as Float64, 0 as Float64, (alpha * 1e5) as Float64],
      susceptibility: [
        (alpha * qrf * 0.8) as Float64, 0, 0,
        0, (alpha * qrf * 0.9) as Float64, 0,
        0, 0, (alpha * qrf * 1.0) as Float64, // anisotropic: z > y > x
      ] as unknown as readonly Float64[],
      scale,
    };
  }

  /**
   * Get the Master Equation term at scale n.
   * [MASTER] — Phase encodes molecular vibrational frequency:
   *   θ_k = 2π · (ω_vib / ω_0) · (scale/89) · (k/12)
   * where ω_vib = vibrational frequency, ω_0 = reference frequency,
   * and k=9 (F10 index).
   */
  override getMasterEquationTerm(scale: ScaleIndex): {
    re: Float64;
    im: Float64;
    weight: Float64;
  } {
    const k = 9; // F10 → index 9 (0-based)
    const weight = Math.pow(PHI_INV, k) as Float64;
    const omega_ratio = (VIBRATION as number) / (PLANCK_FREQUENCY as number);
    const phase = (2 * Math.PI * omega_ratio * (scale / QRF_CRITICAL_SCALE) * (k / 12)) as Float64;
    const re = (weight * Math.cos(phase)) as Float64;
    const im = (weight * Math.sin(phase)) as Float64;
    return { re, im, weight };
  }
}
