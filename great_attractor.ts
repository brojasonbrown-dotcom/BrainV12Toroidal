// ═══════════════════════════════════════════════════════════════════════════════
// Great Attractor Model
// ═══════════════════════════════════════════════════════════════════════════════
// The Great Attractor is the center of 12 infinitely massive toroidal fields.
// It serves as the gravitational singularity around which all scales orbit.
// ═══════════════════════════════════════════════════════════════════════════════

import {
  GRAVITATIONAL_CONSTANT,
  SPEED_OF_LIGHT_EXACT,
  SOLAR_MASS,
  PARSEC,
  PHI,
  PHI_INV,
  PLANCK_LENGTH,
  QRF_CRITICAL_SCALE,
} from "../../core/constants";
import type { Float64, ScaleIndex } from "../../core/types";
import type { GreatAttractor, ToroidalField, Vector3D } from "./types";

// ─────────────────────────────────────────────────────────────────────────────
// 1. Great Attractor Physical Parameters
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Inferred mass of the Great Attractor from gravitational dynamics.
 * [COSM] — The Great Attractor has a mass of ~10¹⁶ solar masses based on
 * the velocity flow of galaxies in the Laniakea supercluster.
 * We model it as a supermassive black hole / dark matter concentration.
 */
const GREAT_ATTRACTOR_MASS_KG: Float64 = 1.0e16 * SOLAR_MASS as Float64;

/**
 * Distance to the Great Attractor from Earth.
 * [COSM] — ~250 million light-years ≈ 76.6 Mpc.
 */
const GREAT_ATTRACTOR_DISTANCE_M: Float64 = 76.6e6 * PARSEC as Float64;

/**
 * Direction to the Great Attractor in galactic coordinates (l, b).
 * [COSM] — Centaurus direction: l ≈ 307°, b ≈ 9°.
 * Converted to Cartesian unit vector.
 */
const GREAT_ATTRACTOR_DIRECTION: Vector3D = [
  (Math.cos(307 * Math.PI / 180) * Math.cos(9 * Math.PI / 180)) as Float64,
  (Math.sin(307 * Math.PI / 180) * Math.cos(9 * Math.PI / 180)) as Float64,
  (Math.sin(9 * Math.PI / 180)) as Float64,
];

// ─────────────────────────────────────────────────────────────────────────────
// 2. Schwarzschild Radius Computation
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Compute the Schwarzschild radius: r_s = 2GM / c².
 * [GR] — Event horizon radius of a black hole of mass M.
 * For the Great Attractor: r_s ≈ 2.96 × 10²⁵ m ≈ 3.1 × 10⁹ AU.
 */
function computeSchwarzschildRadius(mass: Float64): Float64 {
  return ((2 * GRAVITATIONAL_CONSTANT * mass) / (SPEED_OF_LIGHT_EXACT ** 2)) as Float64;
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. Gravitational Potential
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Compute gravitational potential: Φ = -GM / r.
 * [NEWTON] — Negative potential well; deeper = stronger attraction.
 */
function computeGravitationalPotential(mass: Float64, distance: Float64): Float64 {
  return (-GRAVITATIONAL_CONSTANT * mass / distance) as Float64;
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. Great Attractor Factory
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Create the Great Attractor model with 12 toroidal fields.
 * [COSM] — The 12 toroidal fields represent the 12 frameworks orbiting
 * the central singularity. Each framework contributes a toroidal field
 * with infinite mass in the limit (as r → 0, the field strength → ∞).
 */
export function createGreatAttractor(): GreatAttractor {
  const mass = GREAT_ATTRACTOR_MASS_KG;
  const distance = GREAT_ATTRACTOR_DISTANCE_M;
  const direction = GREAT_ATTRACTOR_DIRECTION;
  const schwarzschildRadius = computeSchwarzschildRadius(mass);
  const centralPotential = computeGravitationalPotential(mass, schwarzschildRadius);

  // Create 12 toroidal fields, one for each framework
  // Each toroidal field has:
  // - Major radius R = φ^k · r_s (where k is framework index 0..11)
  // - Minor radius r = R / φ (optimal aspect ratio)
  // - Infinite mass in the limit (M → ∞ as r → 0)
  const toroidalFields: ToroidalField[] = [];
  for (let k = 0; k < 12; k++) {
    const R = (Math.pow(PHI, k) * schwarzschildRadius) as Float64;
    const r = (R / PHI) as Float64;
    const aspectRatio = PHI as Float64;
    const circulation = (Math.pow(PHI_INV, k) * 1e40) as Float64; // Arbitrary large circulation
    
    // Dipole moment: aligned with Great Attractor direction
    const dipoleMagnitude = (mass * distance * Math.pow(PHI_INV, k)) as Float64;
    
    toroidalFields.push({
      majorRadius: R,
      minorRadius: r,
      aspectRatio,
      circulation,
      dipole: {
        magnitude: dipoleMagnitude,
        direction: direction as [Float64, Float64, Float64],
        scale: (k * 24) as ScaleIndex, // Distribute across scales
      },
      polarization: {
        P_electric: [0 as Float64, 0 as Float64, 0 as Float64],
        P_magnetic: [0 as Float64, 0 as Float64, 0 as Float64],
        susceptibility: [0, 0, 0, 0, 0, 0, 0, 0, 0] as unknown as readonly Float64[],
        scale: (k * 24) as ScaleIndex,
      },
      scale: (k * 24) as ScaleIndex,
      frameworkId: `F${k + 1}`,
    });
  }

  return {
    mass,
    distance,
    direction: direction as unknown as readonly [Float64, Float64, Float64],
    toroidalFields: toroidalFields as unknown as readonly ToroidalField[],
    centralPotential: centralPotential as Float64,
    schwarzschildRadius: schwarzschildRadius as Float64,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. Influence Computation
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Compute the Great Attractor's gravitational influence at scale n.
 * [COSM] — The influence decreases with distance from the center.
 * At scale n, the influence is: I(n) = φ^(-n/89) · (M_GA / M_scale)
 * where M_scale is the characteristic mass at scale n.
 */
export function computeGreatAttractorInfluence(
  greatAttractor: GreatAttractor,
  scale: ScaleIndex
): Float64 {
  const qrf = Math.pow(PHI_INV, scale / QRF_CRITICAL_SCALE);
  const scaleMass = computeCharacteristicMass(scale);
  const influence = (qrf * (greatAttractor.mass / scaleMass)) as Float64;
  return influence;
}

/**
 * Compute characteristic mass at scale n.
 * [PHYS] — M(n) = m_P · φ^(3n/2) where m_P is Planck mass.
 * This gives the mass scale where the framework operates.
 */
function computeCharacteristicMass(scale: ScaleIndex): Float64 {
  const PLANCK_MASS = 2.176434e-8 as Float64;
  return (PLANCK_MASS * Math.pow(PHI, (3 * scale) / 2)) as Float64;
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. Singleton Instance
// ─────────────────────────────────────────────────────────────────────────────

let _greatAttractor: GreatAttractor | null = null;

/**
 * Get the singleton Great Attractor instance.
 * [SINGLETON] — There is only ONE Great Attractor in the universe.
 */
export function getGreatAttractor(): GreatAttractor {
  if (_greatAttractor === null) {
    _greatAttractor = createGreatAttractor();
  }
  return _greatAttractor;
}

/**
 * Reset the Great Attractor (for testing).
 */
export function resetGreatAttractor(): void {
  _greatAttractor = null;
}
