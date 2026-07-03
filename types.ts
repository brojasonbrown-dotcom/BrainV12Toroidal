// ═══════════════════════════════════════════════════════════════════════════════
// v10 Framework Base Types & Interfaces
// ═══════════════════════════════════════════════════════════════════════════════
// This file defines the contract that ALL 12 frameworks must implement.
// Each framework is a toroidal field with dipoles, polarization, and
// deep physics computation at its characteristic scale.
// ═══════════════════════════════════════════════════════════════════════════════

import type { Float64, ScaleIndex, GeometricField } from "../../core/types";

// ─────────────────────────────────────────────────────────────────────────────
// 1. Toroidal Field Components
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Dipole moment vector at a given scale.
 * [PHYS] — Represents the separation of positive and negative charge/mass
 * within a toroidal field, creating the characteristic dipole pattern.
 */
export interface DipoleMoment {
  /** Magnitude of the dipole moment (C·m or A·m² depending on context) */
  readonly magnitude: Float64;
  /** Direction vector (unit length) */
  readonly direction: readonly [Float64, Float64, Float64];
  /** Scale index where this dipole is defined */
  readonly scale: ScaleIndex;
}

/**
 * Polarization tensor at a given scale.
 * [PHYS] — Represents the response of the medium to an external field.
 * For linear media: P = ε₀ χ_e E
 */
export interface Polarization {
  /** Electric polarization (C/m²) */
  readonly P_electric: readonly [Float64, Float64, Float64];
  /** Magnetic polarization / magnetization (A/m) */
  readonly P_magnetic: readonly [Float64, Float64, Float64];
  /** Susceptibility tensor (dimensionless, 3×3) */
  readonly susceptibility: readonly Float64[]; // 9 elements for 3×3 matrix
  /** Scale index */
  readonly scale: ScaleIndex;
}

/**
 * Toroidal field at a given scale.
 * [PHYS] — A toroidal field is a field with rotational symmetry around an axis,
 * like a smoke ring or magnetic field around a current loop.
 * At every scale, the universe exhibits toroidal structure:
 * - Sub-Planckian: quantum foam vortices
 * - Quantum: electron orbitals (toroidal in certain states)
 * - Atomic: magnetic dipoles
 * - Molecular: ring currents, aromatic systems
 * - Biological: cell membranes (toroidal topology)
 * - Galactic: spiral galaxies (toroidal magnetic fields)
 * - Cosmic: large-scale structure (toroidal voids)
 */
export interface ToroidalField {
  /** Major radius R (distance from center of tube to center of torus) */
  readonly majorRadius: Float64;
  /** Minor radius r (radius of the tube) */
  readonly minorRadius: Float64;
  /** Aspect ratio R/r (optimal = φ for crystalline stability) */
  readonly aspectRatio: Float64;
  /** Circulation strength (m²/s for fluid, A for magnetic) */
  readonly circulation: Float64;
  /** Dipole moment at this scale */
  readonly dipole: DipoleMoment;
  /** Polarization at this scale */
  readonly polarization: Polarization;
  /** Scale index */
  readonly scale: ScaleIndex;
  /** Framework ID that owns this toroidal field */
  readonly frameworkId: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. Spherical Infinity
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Spherical infinity representation at a given scale.
 * [PHYS] — Each scale is spherically infinite in the sense that it extends
 * to the horizon of its own observable universe, bounded by the next scale.
 * The spherical infinity is the boundary where the scale's physics transitions
 * to the next scale's physics.
 */
export interface SphericalInfinity {
  /** Radius of the spherical horizon at this scale (m) */
  readonly horizonRadius: Float64;
  /** Surface area of the spherical horizon (m²) */
  readonly horizonArea: Float64;
  /** Volume enclosed by the spherical horizon (m³) */
  readonly enclosedVolume: Float64;
  /** Energy density at the horizon (J/m³) */
  readonly horizonEnergyDensity: Float64;
  /** Scale index */
  readonly scale: ScaleIndex;
  /** Next scale index (null if cosmic scale) */
  readonly nextScale: ScaleIndex | null;
  /** Previous scale index (null if Planck scale) */
  readonly prevScale: ScaleIndex | null;
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. Great Attractor
// ─────────────────────────────────────────────────────────────────────────────

/**
 * The Great Attractor is the center of 12 infinitely massive toroidal fields.
 * [COSM] — In the Laniakea supercluster, the Great Attractor is a gravitational
 * anomaly. In this engine, it represents the central singularity around which
 * all 12 toroidal frameworks orbit.
 * 
 * Properties:
 * - Mass: ~10¹⁶ M_☉ (inferred from gravitational pull)
 * - Distance: ~250 million light-years
 * - Direction: Centaurus constellation
 * - Nature: Likely a supermassive black hole or dark matter concentration
 */
export interface GreatAttractor {
  /** Mass of the Great Attractor (kg) — inferred from gravitational dynamics */
  readonly mass: Float64;
  /** Distance from Earth (m) */
  readonly distance: Float64;
  /** Direction vector (galactic coordinates) */
  readonly direction: readonly [Float64, Float64, Float64];
  /** 12 toroidal fields orbiting the Great Attractor */
  readonly toroidalFields: readonly ToroidalField[];
  /** Gravitational potential at the center (J/kg) */
  readonly centralPotential: Float64;
  /** Event horizon radius if it were a black hole (m) */
  readonly schwarzschildRadius: Float64;
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. Framework Interface (Contract for ALL 12 frameworks)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Base interface that ALL 12 frameworks MUST implement.
 * Each framework is responsible for:
 * 1. Computing its physics at its characteristic scale
 * 2. Providing its toroidal field with dipoles and polarization
 * 3. Computing spherical infinity at its scale
 * 4. Participating in the Great Attractor's gravitational field
 */
export interface ScaleFramework {
  /** Unique framework ID (e.g., "F1_SubPlanckian") */
  readonly id: string;
  /** Human-readable name */
  readonly name: string;
  /** Characteristic scale index n_fw */
  readonly characteristicScale: number;
  /** QRF threshold qrf_fw */
  readonly qrfThreshold: Float64;
  /** Description of the framework's domain */
  readonly description: string;

  /**
   * Compute the framework's contribution to the field at scale n.
   * [COMPUTE] — This is the main computation method. It must be:
   * - Deterministic (no randomness)
   - idempotent for same inputs
   * - Physically meaningful at the scale
   * 
   * @param scale — The scale index n
   * @param inputField — The incoming geometric field state
   * @returns — The computed field after framework application
   */
  compute(scale: ScaleIndex, inputField: GeometricField): GeometricField;

  /**
   * Get the toroidal field at scale n.
   * [TOROIDAL] — Every framework MUST provide a toroidal field with:
   * - Major/minor radii
   * - Dipole moment
   * - Polarization tensor
   * - Aspect ratio ≈ φ for crystalline stability
   */
  getToroidalField(scale: ScaleIndex): ToroidalField;

  /**
   * Get the dipole moment at scale n.
   * [DIPOLE] — Dipoles exist at ALL scales:
   * - Sub-Planckian: quantum foam dipoles
   * - Quantum: virtual particle dipoles
   * - Atomic: electron-proton dipoles
   * - Molecular: bond dipoles
   * - Biological: ion channel dipoles
   * - Galactic: magnetic dipoles
   * - Cosmic: dark matter dipoles
   */
  getDipoleMoment(scale: ScaleIndex): DipoleMoment;

  /**
   * Get the polarization at scale n.
   * [POLARIZATION] — Polarization exists at ALL scales:
   * - Electric polarization (charge separation)
   * - Magnetic polarization (spin alignment)
   * - Gravitational polarization (mass distribution)
   */
  getPolarization(scale: ScaleIndex): Polarization;

  /**
   * Get the spherical infinity at scale n.
   * [SPHERICAL] — Each scale is a sphere with its own horizon.
   * The spherical infinity defines the boundary of the scale's domain.
   */
  getSphericalInfinity(scale: ScaleIndex): SphericalInfinity;

  /**
   * Compute the coherence of this framework at scale n.
   * [COHERENCE] — C(n) = |⟨Ψ|Ψ_framework⟩|² / (|Ψ|² · |Ψ_framework|²)
   * Must return a value in [0, 1].
   * Framework is ACTIVE if C(n) > λ = 1/φ².
   */
  computeCoherence(scale: ScaleIndex, field: GeometricField): number;

  /**
   * Check if the framework is active at scale n.
   * [ACTIVE] — A framework is active if qrf(n) > qrf_fw AND C(n) > λ.
   */
  isActiveAtScale(scale: ScaleIndex, field: GeometricField): boolean;

  /**
   * Compute the energy density of the framework at scale n.
   * [ENERGY] — ρ(n) = ℏ · f(n) / L(n)³ (J/m³)
   * This is the energy density of the vacuum at that scale.
   */
  computeEnergyDensity(scale: ScaleIndex): Float64;

  /**
   * Compute the information density at scale n.
   * [INFO] — I(n) = A(n) / (4 L_P²) where A(n) is the horizon area
   * This is the holographic information bound.
   */
  computeInformationDensity(scale: ScaleIndex): Float64;

  /**
   * Get the framework's contribution to the Master Equation at scale n.
   * [MASTER] — Returns the complex amplitude Ψ_fw(n) = φ^(-k) · e^(i·θ_k)
   * where k is the framework's index in the summation.
   */
  getMasterEquationTerm(scale: ScaleIndex): { re: Float64; im: Float64; weight: Float64 };
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. Framework Registry
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Registry of all 12 frameworks.
 * This is populated at runtime by the framework loader.
 */
export type FrameworkRegistry = ReadonlyMap<string, ScaleFramework>;

/**
 * Factory function type for creating framework instances.
 */
export type FrameworkFactory = () => ScaleFramework;

// ─────────────────────────────────────────────────────────────────────────────
// 6. Computation Result Types
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Result of a framework computation at a specific scale.
 */
export interface FrameworkComputationResult {
  /** Framework ID */
  readonly frameworkId: string;
  /** Scale index */
  readonly scale: ScaleIndex;
  /** Output field */
  readonly outputField: GeometricField;
  /** Coherence at this scale */
  readonly coherence: number;
  /** Energy density (J/m³) */
  readonly energyDensity: Float64;
  /** Information density (bits/m³) */
  readonly informationDensity: Float64;
  /** Toroidal field at this scale */
  readonly toroidalField: ToroidalField;
  /** Spherical infinity at this scale */
  readonly sphericalInfinity: SphericalInfinity;
  /** Whether the framework was active */
  readonly wasActive: boolean;
  /** Computation timestamp (deterministic, monotonic) */
  readonly timestamp: number;
}

/**
 * Result of computing ALL frameworks at a specific scale.
 */
export interface ScaleComputationResult {
  /** Scale index */
  readonly scale: ScaleIndex;
  /** Results from all active frameworks */
  readonly frameworkResults: readonly FrameworkComputationResult[];
  /** Combined field (sum of all framework contributions) */
  readonly combinedField: GeometricField;
  /** Overall coherence */
  readonly overallCoherence: number;
  /** Total energy density */
  readonly totalEnergyDensity: Float64;
  /** Total information density */
  readonly totalInformationDensity: Float64;
  /** Great Attractor influence at this scale */
  readonly greatAttractorInfluence: Float64;
}

// ─────────────────────────────────────────────────────────────────────────────
// 7. Utility Types
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Vector3D type for Cartesian coordinates.
 */
export type Vector3D = readonly [Float64, Float64, Float64];

/**
 * Tensor3x3 type for 3×3 matrices (e.g., susceptibility, stress tensor).
 */
export type Tensor3x3 = readonly [
  Float64, Float64, Float64,
  Float64, Float64, Float64,
  Float64, Float64, Float64
];

/**
 * Complex number representation.
 */
export interface Complex {
  readonly re: Float64;
  readonly im: Float64;
}

/**
 * Spherical coordinates (r, θ, φ) where:
 * - r ≥ 0 is the radial distance
 * - θ ∈ [0, π] is the polar angle (colatitude)
 * - φ ∈ [0, 2π) is the azimuthal angle
 */
export interface SphericalCoords {
  readonly r: Float64;
  readonly theta: Float64; // polar angle
  readonly phi: Float64;   // azimuthal angle
}
