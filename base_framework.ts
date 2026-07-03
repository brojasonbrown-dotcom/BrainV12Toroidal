// ═══════════════════════════════════════════════════════════════════════════════
// Base Framework Implementation
// ═══════════════════════════════════════════════════════════════════════════════
// All 12 frameworks extend this base class to get common functionality:
// - Toroidal field computation
// - Spherical infinity computation
// - Coherence checking
// - Master Equation term generation
// - Energy and information density computation
// ═══════════════════════════════════════════════════════════════════════════════

import {
  PHI,
  PHI_INV,
  PLANCK_LENGTH,
  PLANCK_FREQUENCY,
  COHERENCE_THRESHOLD,
  QRF_CRITICAL_SCALE,
} from "../../core/constants";
import type { Float64, ScaleIndex, GeometricField } from "../../core/types";
import type {
  ScaleFramework,
  ToroidalField,
  DipoleMoment,
  Polarization,
  SphericalInfinity,
  Vector3D,
} from "./types";
import { computeToroidalField, updateToroidalField } from "./toroidal_field";
import { createSphericalInfinity, getNextScale, getPreviousScale } from "./spherical_infinity";

// ─────────────────────────────────────────────────────────────────────────────
// 1. Abstract Base Framework
// ─────────────────────────────────────────────────────────────────────────────

export abstract class BaseFramework implements ScaleFramework {
  abstract readonly id: string;
  abstract readonly name: string;
  abstract readonly characteristicScale: number;
  abstract readonly qrfThreshold: Float64;
  abstract readonly description: string;

  /**
   * Framework-specific computation.
   * [OVERRIDE] — Each framework MUST override this to implement its physics.
   */
  abstract compute(scale: ScaleIndex, inputField: GeometricField): GeometricField;

  /**
   * Framework-specific dipole computation.
   * [OVERRIDE] — Each framework MUST override this for its dipole moment.
   */
  abstract getDipoleMoment(scale: ScaleIndex): DipoleMoment;

  /**
   * Framework-specific polarization computation.
   * [OVERRIDE] — Each framework MUST override this for its polarization.
   */
  abstract getPolarization(scale: ScaleIndex): Polarization;

  // ─────────────────────────────────────────────────────────────────────────
  // Common implementations (not abstract)
  // ─────────────────────────────────────────────────────────────────────────

  /**
   * Get the toroidal field at scale n.
   * [TOROIDAL] — Uses the base toroidal field computation with framework-specific
   * dipole and polarization.
   */
  getToroidalField(scale: ScaleIndex): ToroidalField {
    const baseField = computeToroidalField(scale, this.id);
    const dipole = this.getDipoleMoment(scale);
    const polarization = this.getPolarization(scale);
    return updateToroidalField(baseField, dipole, polarization);
  }

  /**
   * Get the spherical infinity at scale n.
   * [SPHERICAL] — Uses the common spherical infinity computation.
   */
  getSphericalInfinity(scale: ScaleIndex): SphericalInfinity {
    return createSphericalInfinity(scale, getNextScale(scale), getPreviousScale(scale));
  }

  /**
   * Compute coherence at scale n.
   * [COHERENCE] — C = |⟨Ψ|Ψ_framework⟩|² / (|Ψ|² · |Ψ_framework|²)
   * Default implementation: returns qrf(n) as a proxy for coherence.
   */
  computeCoherence(scale: ScaleIndex, field: GeometricField): number {
    const qrf = Math.pow(PHI_INV, scale / QRF_CRITICAL_SCALE);
    // Framework coherence is weighted by how close the scale is to the framework's characteristic scale
    const scaleProximity = Math.exp(-Math.abs(scale - this.characteristicScale) / 10);
    return qrf * scaleProximity;
  }

  /**
   * Check if the framework is active at scale n.
   * [ACTIVE] — Active if qrf(n) > qrf_fw AND C(n) > λ.
   */
  isActiveAtScale(scale: ScaleIndex, field: GeometricField): boolean {
    const qrf = Math.pow(PHI_INV, scale / QRF_CRITICAL_SCALE);
    const coherence = this.computeCoherence(scale, field);
    return qrf > this.qrfThreshold && coherence > COHERENCE_THRESHOLD;
  }

  /**
   * Compute energy density at scale n.
   * [ENERGY] — ρ(n) = ℏ · f(n) / L(n)³ (J/m³)
   * Default: vacuum energy density at that scale.
   */
  computeEnergyDensity(scale: ScaleIndex): Float64 {
    const f_n = PLANCK_FREQUENCY * Math.pow(PHI_INV, scale);
    const L_n = PLANCK_LENGTH * Math.pow(PHI, scale);
    const REDUCED_PLANCK_CONSTANT = 1.054571817e-34 as Float64;
    const energyDensity = (REDUCED_PLANCK_CONSTANT * f_n / (L_n * L_n * L_n)) as Float64;
    return energyDensity;
  }

  /**
   * Compute information density at scale n.
   * [INFO] — I(n) = A(n) / (4 · L_P²) / V(n)
   * Default: holographic bound divided by volume.
   */
  computeInformationDensity(scale: ScaleIndex): Float64 {
    const sphericalInfinity = this.getSphericalInfinity(scale);
    const PLANCK_AREA = (PLANCK_LENGTH * PLANCK_LENGTH) as Float64;
    const I_max = (sphericalInfinity.horizonArea / (4 * PLANCK_AREA)) as Float64;
    return (I_max / sphericalInfinity.enclosedVolume) as Float64;
  }

  /**
   * Get the Master Equation term at scale n.
   * [MASTER] — Ψ_fw(n) = φ^(-k) · e^(i·θ_k) where k is framework index.
   * Default: phase angle = 2π · (scale / 89) · (framework index / 12).
   */
  getMasterEquationTerm(scale: ScaleIndex): { re: Float64; im: Float64; weight: Float64 } {
    const k = this.getFrameworkIndex();
    const weight = Math.pow(PHI_INV, k) as Float64;
    const theta = (2 * Math.PI * (scale / QRF_CRITICAL_SCALE) * (k / 12)) as Float64;
    const re = (weight * Math.cos(theta)) as Float64;
    const im = (weight * Math.sin(theta)) as Float64;
    return { re, im, weight };
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Helper methods
  // ─────────────────────────────────────────────────────────────────────────

  /**
   * Get the framework index (0-11) based on ID.
   * [INDEX] — F1=0, F2=1, ..., F12=11.
   */
  private getFrameworkIndex(): number {
    const match = this.id.match(/F(\d+)/);
    if (match) {
      return parseInt(match[1], 10) - 1;
    }
    return 0;
  }

  /**
   * Scale length: L(n) = ℓ_P · φ^n.
   */
  protected scaleLength(scale: ScaleIndex): Float64 {
    return (PLANCK_LENGTH * Math.pow(PHI, scale)) as Float64;
  }

  /**
   * Scale frequency: f(n) = f_P · φ^(-n).
   */
  protected scaleFrequency(scale: ScaleIndex): Float64 {
    return (PLANCK_FREQUENCY * Math.pow(PHI_INV, scale)) as Float64;
  }

  /**
   * QRF attenuation: qrf(n) = φ^(-n/89).
   */
  protected qrfAttenuation(scale: ScaleIndex): number {
    return Math.pow(PHI_INV, scale / QRF_CRITICAL_SCALE);
  }
}
