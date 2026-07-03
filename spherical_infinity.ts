// ═══════════════════════════════════════════════════════════════════════════════
// Spherical Infinity Computation
// ═══════════════════════════════════════════════════════════════════════════════
// Each scale is spherically infinite — it has its own horizon beyond which
// the next scale takes over. This module computes the spherical infinity
// parameters for every scale.
// ═══════════════════════════════════════════════════════════════════════════════

import {
  PHI,
  PLANCK_LENGTH,
  SPEED_OF_LIGHT_EXACT,
  HUBBLE_CONSTANT,
  CRITICAL_DENSITY,
  QRF_CRITICAL_SCALE,
} from "../../core/constants";
import type { Float64, ScaleIndex } from "../../core/types";
import type { SphericalInfinity } from "./types";

// ─────────────────────────────────────────────────────────────────────────────
// 1. Horizon Radius Computation
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Compute the spherical horizon radius at scale n.
 * [COSM] — The horizon is the boundary where the scale's physics transitions
 * to the next scale. For the cosmic scale, this is the Hubble horizon.
 * 
 * Formula: R_H(n) = L(n) · φ^(89-n) = ℓ_P · φ^n · φ^(89-n) = ℓ_P · φ^89
 * Wait, that's constant. Let me reconsider.
 * 
 * Actually, the horizon radius at scale n is:
 * R_H(n) = L(n) · φ^2 = ℓ_P · φ^(n+2)
 * This gives the "radius of influence" of the scale.
 * For the cosmic scale (n=292): R_H = c/H_0 ≈ 4.4 × 10^26 m (observable universe)
 */
export function computeHorizonRadius(scale: ScaleIndex): Float64 {
  if (scale === 292) {
    // Cosmic scale: Hubble horizon
    return (SPEED_OF_LIGHT_EXACT / HUBBLE_CONSTANT) as Float64;
  }
  
  // General formula: R_H(n) = ℓ_P · φ^(n+2)
  // This ensures each scale's horizon is φ² times its characteristic length
  const horizonRadius = (PLANCK_LENGTH * Math.pow(PHI, scale + 2)) as Float64;
  return horizonRadius;
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. Horizon Surface Area and Volume
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Compute surface area of spherical horizon: A = 4πR².
 * [GEOM] — Standard formula for sphere surface area.
 */
export function computeHorizonArea(radius: Float64): Float64 {
  return (4 * Math.PI * radius * radius) as Float64;
}

/**
 * Compute volume enclosed by spherical horizon: V = (4/3)πR³.
 * [GEOM] — Standard formula for sphere volume.
 */
export function computeEnclosedVolume(radius: Float64): Float64 {
  return ((4 / 3) * Math.PI * radius * radius * radius) as Float64;
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. Energy Density at Horizon
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Compute energy density at the horizon.
 * [ENERGY] — ρ_H = ρ_c · qrf(n) where ρ_c is critical density.
 * This represents the energy density at the boundary of the scale.
 */
export function computeHorizonEnergyDensity(scale: ScaleIndex): Float64 {
  const qrf = Math.pow(PHI, -scale / QRF_CRITICAL_SCALE);
  return (CRITICAL_DENSITY * qrf) as Float64;
}

// ─────────────────────────────────══════════════════════════════════════════════
// 4. Spherical Infinity Factory
// ─────────────────══════════════════════════════════════════════════════════════

/**
 * Create the spherical infinity for scale n.
 * [FACTORY] — Computes all spherical infinity parameters.
 */
export function createSphericalInfinity(
  scale: ScaleIndex,
  nextScale: ScaleIndex | null,
  prevScale: ScaleIndex | null
): SphericalInfinity {
  const horizonRadius = computeHorizonRadius(scale);
  const horizonArea = computeHorizonArea(horizonRadius);
  const enclosedVolume = computeEnclosedVolume(horizonRadius);
  const horizonEnergyDensity = computeHorizonEnergyDensity(scale);
  
  return {
    horizonRadius,
    horizonArea,
    enclosedVolume,
    horizonEnergyDensity,
    scale,
    nextScale,
    prevScale,
  };
}

// ─────────────────────────────────══════════════════════════════════════════════
// 5. Scale Chain
// ─────────────────────────────────══════════════════════════════════════════════

/**
 * All canonical scale indices in order.
 * [SPEC] — The chain of scales from Planck to Cosmic.
 */
export const SCALE_CHAIN: readonly ScaleIndex[] = [
  0, 96, 120, 134, 168, 192, 235, 250, 270, 292,
] as const;

/**
 * Get the next scale in the chain.
 * [CHAIN] — Returns null if cosmic scale.
 */
export function getNextScale(scale: ScaleIndex): ScaleIndex | null {
  const index = SCALE_CHAIN.indexOf(scale);
  if (index === -1 || index === SCALE_CHAIN.length - 1) return null;
  return SCALE_CHAIN[index + 1];
}

/**
 * Get the previous scale in the chain.
 * [CHAIN] — Returns null if Planck scale.
 */
export function getPreviousScale(scale: ScaleIndex): ScaleIndex | null {
  const index = SCALE_CHAIN.indexOf(scale);
  if (index <= 0) return null;
  return SCALE_CHAIN[index - 1];
}

/**
 * Create spherical infinity for all scales in the chain.
 * [BATCH] — Pre-computes all spherical infinities.
 */
export function createAllSphericalInfinities(): Map<ScaleIndex, SphericalInfinity> {
  const map = new Map<ScaleIndex, SphericalInfinity>();
  for (const scale of SCALE_CHAIN) {
    const next = getNextScale(scale);
    const prev = getPreviousScale(scale);
    map.set(scale, createSphericalInfinity(scale, next, prev));
  }
  return map;
}

// ─────────────────────────────────══════════════════════════════════════════════
// 6. Holographic Information Bound
// ─────────────────────────────────══════════════════════════════════════════════

/**
 * Compute the holographic information bound at scale n.
 * [INFO] — I_max = A / (4 · L_P²) where A is the horizon area.
 * This is the maximum information that can be stored within the horizon.
 */
export function computeHolographicInformationBound(
  sphericalInfinity: SphericalInfinity
): Float64 {
  const PLANCK_AREA = (PLANCK_LENGTH * PLANCK_LENGTH) as Float64;
  return (sphericalInfinity.horizonArea / (4 * PLANCK_AREA)) as Float64;
}

/**
 * Compute information density: I / V (bits/m³).
 * [INFO] — ρ_I = I_max / V = 1 / (4 · L_P² · R) (for spherical horizon)
 */
export function computeInformationDensity(
  sphericalInfinity: SphericalInfinity
): Float64 {
  const I_max = computeHolographicInformationBound(sphericalInfinity);
  return (I_max / sphericalInfinity.enclosedVolume) as Float64;
}
