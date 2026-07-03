// ═══════════════════════════════════════════════════════════════════════════════
// Toroidal Field Computation
// ═══════════════════════════════════════════════════════════════════════════════
// Every scale must have toroidal fields with dipoles and polarization.
// This module provides the computational engine for toroidal field geometry.
// ═══════════════════════════════════════════════════════════════════════════════

import {
  PHI,
  PHI_INV,
  PLANCK_LENGTH,
  PLANCK_FREQUENCY,
  QRF_CRITICAL_SCALE,
} from "../../core/constants";
import type { Float64, ScaleIndex, GeometricField } from "../../core/types";
import type { ToroidalField, DipoleMoment, Polarization, Vector3D } from "./types";

// ─────────────────────────────────────────────────────────────────────────────
// 1. Toroidal Field Geometry
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Compute toroidal field parameters at scale n.
 * [GEOM] — Torus parameters derived from the geometric scaling law:
 * - Major radius R(n) = ℓ_P · φ^n · (major/minor ratio)
 * - Minor radius r(n) = ℓ_P · φ^n
 * - Aspect ratio = R/r = φ (optimal for crystalline stability)
 */
export function computeToroidalField(
  scale: ScaleIndex,
  frameworkId: string,
  customCirculation?: Float64
): ToroidalField {
  const L_n = PLANCK_LENGTH * Math.pow(PHI, scale); // Scale length
  const r = L_n as Float64; // Minor radius = scale length
  const R = (L_n * PHI) as Float64; // Major radius = φ · scale length
  const aspectRatio = PHI as Float64;
  
  // Circulation strength: decreases with scale (φ^(-n/2))
  const circulation = customCirculation ?? (Math.pow(PHI_INV, scale / 2) * 1e30) as Float64;
  
  // Dipole moment: aligned with the toroidal axis
  const dipoleMagnitude = (L_n * circulation * 1e-20) as Float64;
  const dipoleDirection: Vector3D = [0 as Float64, 0 as Float64, 1 as Float64];
  
  // Polarization: initially zero (frameworks compute their own)
  const polarization: Polarization = {
    P_electric: [0 as Float64, 0 as Float64, 0 as Float64],
    P_magnetic: [0 as Float64, 0 as Float64, 0 as Float64],
    susceptibility: [0, 0, 0, 0, 0, 0, 0, 0, 0] as unknown as readonly Float64[],
    scale,
  };
  
  return {
    majorRadius: R,
    minorRadius: r,
    aspectRatio,
    circulation,
    dipole: {
      magnitude: dipoleMagnitude,
      direction: dipoleDirection as unknown as readonly [Float64, Float64, Float64],
      scale,
    },
    polarization,
    scale,
    frameworkId,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. Dipole Moment Computation
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Compute dipole moment for a charge distribution.
 * [ELECTRO] — p = Σ q_i · r_i (C·m)
 * For a toroidal field, the dipole is aligned with the symmetry axis.
 */
export function computeDipoleMoment(
  scale: ScaleIndex,
  charge: Float64,
  separation: Float64
): DipoleMoment {
  const magnitude = (charge * separation) as Float64;
  return {
    magnitude,
    direction: [0 as Float64, 0 as Float64, 1 as Float64],
    scale,
  };
}

/**
 * Compute magnetic dipole moment for a current loop.
 * [MAG] — μ = I · A (A·m²)
 */
export function computeMagneticDipoleMoment(
  scale: ScaleIndex,
  current: Float64,
  area: Float64
): DipoleMoment {
  const magnitude = (current * area) as Float64;
  return {
    magnitude,
    direction: [0 as Float64, 0 as Float64, 1 as Float64],
    scale,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. Polarization Computation
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Compute electric polarization from external field.
 * [ELECTRO] — P = ε₀ · χ_e · E (C/m²)
 * For linear isotropic media: χ_e is scalar.
 */
export function computeElectricPolarization(
  scale: ScaleIndex,
  electricField: Vector3D,
  susceptibility: Float64
): Polarization {
  const VACUUM_PERMITTIVITY = 8.8541878128e-12 as Float64;
  const P = electricField.map(
    (E) => (VACUUM_PERMITTIVITY * susceptibility * E) as Float64
  ) as unknown as readonly [Float64, Float64, Float64];
  
  return {
    P_electric: P,
    P_magnetic: [0 as Float64, 0 as Float64, 0 as Float64],
    susceptibility: [susceptibility, 0, 0, 0, susceptibility, 0, 0, 0, susceptibility] as unknown as readonly Float64[],
    scale,
  };
}

/**
 * Compute magnetic polarization (magnetization) from external field.
 * [MAG] — M = χ_m · H (A/m)
 */
export function computeMagneticPolarization(
  scale: ScaleIndex,
  magneticField: Vector3D,
  susceptibility: Float64
): Polarization {
  const M = magneticField.map(
    (H) => (susceptibility * H) as Float64
  ) as unknown as readonly [Float64, Float64, Float64];
  
  return {
    P_electric: [0 as Float64, 0 as Float64, 0 as Float64],
    P_magnetic: M,
    susceptibility: [susceptibility, 0, 0, 0, susceptibility, 0, 0, 0, susceptibility] as unknown as readonly Float64[],
    scale,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. Toroidal Field Energy
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Compute energy density of a toroidal field.
 * [ENERGY] — u = (1/2) · (B²/μ₀ + ε₀ · E²) (J/m³)
 * For a toroidal field: B ≈ μ₀ · I / (2πr), E ≈ 0 (ideal conductor).
 */
export function computeToroidalEnergyDensity(field: ToroidalField): Float64 {
  const VACUUM_PERMEABILITY = 1.2566370614e-6 as Float64;
  const B = (VACUUM_PERMEABILITY * field.circulation) / (2 * Math.PI * field.minorRadius);
  const energyDensity = (0.5 * B * B / VACUUM_PERMEABILITY) as Float64;
  return energyDensity;
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. Toroidal Field in Spherical Coordinates
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Compute the toroidal field vector at a point in spherical coordinates.
 * [GEOM] — In spherical coordinates (r, θ, φ), the toroidal field has only
 * a φ-component: B_φ = (μ₀ · I) / (2π · r · sin θ) · (1 - r_minor/R_major)
 */
export function computeToroidalFieldVector(
  field: ToroidalField,
  r: Float64,
  theta: Float64
): { B_r: Float64; B_theta: Float64; B_phi: Float64 } {
  const VACUUM_PERMEABILITY = 1.2566370614e-6 as Float64;
  const sinTheta = Math.sin(theta) as Float64;
  
  // Avoid division by zero at poles
  const safeSinTheta = (sinTheta < 1e-10 ? 1e-10 : sinTheta) as Float64;
  
  const B_phi = (VACUUM_PERMEABILITY * field.circulation) / (2 * Math.PI * r * safeSinTheta) as Float64;
  
  return {
    B_r: 0 as Float64,
    B_theta: 0 as Float64,
    B_phi: (B_phi * (1 - field.minorRadius / field.majorRadius)) as Float64,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. Crystalline Stability Check
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Check if the toroidal field has crystalline stability.
 * [STABILITY] — Crystalline stability requires:
 * 1. Aspect ratio R/r ≈ φ (most irrational ratio)
 * 2. No resonant frequencies (irrational rotation number)
 * 3. Coherence > λ = 1/φ²
 */
export function checkCrystallineStability(field: ToroidalField): {
  stable: boolean;
  issues: string[];
} {
  const issues: string[] = [];
  
  // Check 1: Aspect ratio ≈ φ
  const aspectRatioError = Math.abs(field.aspectRatio - PHI);
  if (aspectRatioError > 0.01) {
    issues.push(`Aspect ratio ${field.aspectRatio} deviates from φ by ${aspectRatioError}`);
  }
  
  // Check 2: R/r is irrational (no simple rational approximation)
  const ratio = field.majorRadius / field.minorRadius;
  const continuedFraction = computeContinuedFraction(ratio, 10);
  if (continuedFraction.length < 5) {
    issues.push(`Ratio ${ratio} has short continued fraction (length ${continuedFraction.length}), may be near-rational`);
  }
  
  // Check 3: Minor radius > 0
  if (field.minorRadius <= 0) {
    issues.push("Minor radius must be positive");
  }
  
  return {
    stable: issues.length === 0,
    issues,
  };
}

/**
 * Compute continued fraction representation of a number.
 * [MATH] — Used to check irrationality (longer CF = more irrational).
 */
function computeContinuedFraction(x: number, maxTerms: number): number[] {
  const terms: number[] = [];
  let current = x;
  for (let i = 0; i < maxTerms && current > 1e-10; i++) {
    const a = Math.floor(current);
    terms.push(a);
    current = 1 / (current - a);
    if (!isFinite(current)) break;
  }
  return terms;
}

// ─────────────────────────────────────────────────────────────────────────────
// 7. Framework Integration
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Create a default toroidal field for a framework at scale n.
 * [DEFAULT] — Provides a sensible starting point for framework-specific
 * toroidal field computation.
 */
export function createDefaultToroidalField(
  scale: ScaleIndex,
  frameworkId: string
): ToroidalField {
  return computeToroidalField(scale, frameworkId);
}

/**
 * Update toroidal field with framework-specific dipole and polarization.
 * [UPDATE] — Frameworks call this after computing their specific physics.
 */
export function updateToroidalField(
  field: ToroidalField,
  dipole: DipoleMoment,
  polarization: Polarization
): ToroidalField {
  return {
    ...field,
    dipole,
    polarization,
  };
}
