/**
 * RHUFT v6.0 — Fractal Node Engine: Shared Types
 *
 * Epistemic Status: [SPEC] + [PHIL] — Mathematical ontology, not predictive physics
 * All geometric field descriptors are IEEE-754 Float64 (≈15 significant digits)
 * Strictly deterministic — no random seeds, no entropy injection
 */

import type { FractalNode } from "./fractal_node.ts";

import {
  PHI,
  PI,
  EULER,
  SQRT2,
  SQRT3,
  CLOSURE_COUPLING,
  COHERENCE_THRESHOLD,
  PLANCK_FREQUENCY,
  PLANCK_LENGTH,
} from "./core/constants.ts";

// ───────────────────────────────────────────────────────────────────────────────
// 1. Core Primitive Types
// ───────────────────────────────────────────────────────────────────────────────

/** IEEE-754 Float64 scalar — explicit precision annotation */
export type Float64 = number;

/** Scale index n in the φ-scaled hierarchy */
export type ScaleIndex = 0 | 96 | 120 | 134 | 168 | 192 | 235 | 250 | 270 | 292;

/** Framework identifier in the RHUFT v6.0 ontology */
export type FrameworkId =
  | "F8_SubPlanckian"
  | "F4_Geometric"
  | "F5_ColorMusic"
  | "F6_Hebrew"
  | "F7_Thermodynamic"
  | "F1_Septenary"
  | "F9_Hypergalactic";

/** Memory subsystem identifier in the CEAI 4-layer nested architecture */
export type MemoryId =
  | "L1_Pattern"
  | "L2_Hebbian"
  | "L3_Kuramoto"
  | "L4_Sensory"
  | "L4+_WeightedRAM";

/** Resonance strength for dimensional information transfer */
export type ResonanceStrength = "Strong" | "Moderate" | "Weak" | "None";

/** Coherence status relative to λ = 1/φ² threshold */
export type CoherenceStatus = "COHERENT" | "NEAR-CRITICAL";

/** RHUFT incommensurable constant symbol */
export type ConstantSymbol = "φ" | "π" | "e" | "δ_S" | "√2" | "√3";

// ───────────────────────────────────────────────────────────────────────────────
// 2. Geometric Field Types
// ───────────────────────────────────────────────────────────────────────────────

/**
 * Geometric field descriptor Ψ(r, n) as a complex-valued Float64 array.
 * Stored as interleaved [Re(Ψ₀), Im(Ψ₀), Re(Ψ₁), Im(Ψ₁), ...].
 * [SPEC] — Mathematical ontology structure, not a physical quantum wavefunction.
 */
export type GeometricField = Float64Array;

/**
 * Phase angle θ_k(r, n) for the k-th term in the Master Equation summation.
 * Deterministically derived from scale geometry — no stochastic component.
 */
export type PhaseAngle = Float64;

/**
 * Complex amplitude a_k = φ^(-k) · e^(i·θ_k) as an interleaved [Re, Im] pair.
 */
export type ComplexAmplitude = readonly [Float64, Float64]; // [Re, Im]

// ───────────────────────────────────────────────────────────────────────────────
// 3. Scale Configuration Types
// ───────────────────────────────────────────────────────────────────────────────

/**
 * Dimensional resonance directions for information transfer at a given scale.
 * [PHIL] — Directions are metaphorical labels for scale-coupling strength.
 */
export interface DimensionalResonance {
  /** Information transfer strength to the next larger scale (n → n+1) */
  readonly up: ResonanceStrength;
  /** Information transfer strength to the next smaller scale (n → n-1) */
  readonly down: ResonanceStrength;
  /** Information transfer strength within the same scale (n ↔ n) */
  readonly horizontal: ResonanceStrength;
}

/**
 * Complete scale configuration for a single φ-scaled level in the RHUFT hierarchy.
 * All numeric values are IEEE-754 Float64 (≈15 significant digits).
 */
export interface ScaleConfig {
  /** Scale index n in the L(n) = ℓ_P · φ^n law */
  readonly n: ScaleIndex;
  /** Human-readable scale name */
  readonly name: string;
  /** Characteristic length L(n) in meters [m] */
  readonly length_m: Float64;
  /** Characteristic frequency f(n) = f_P · φ^(-n) in Hertz [Hz] */
  readonly frequency_hz: Float64;
  /** QRF attenuation qrf(n) = φ^(-n/89) */
  readonly qrf_attenuation: Float64;
  /** Coherence status relative to λ = 1/φ² threshold */
  readonly coherence_status: CoherenceStatus;
  /** Frameworks active at this scale (qrf(n) > qrf_fw) */
  readonly active_frameworks: readonly FrameworkId[];
  /** Memory subsystems active at this scale (scale-dependent thresholds) */
  readonly active_memory: readonly MemoryId[];
  /** Dominant incommensurable constants at this scale */
  readonly dominant_constants: readonly ConstantSymbol[];
  /** Dimensional resonance strengths for information transfer */
  readonly dimensional_resonance: DimensionalResonance;
  /** Physical constants associated with this scale (approximate correspondences) [SPEC] */
  readonly physical_constants: Readonly<Record<string, Float64>>;
}

// ───────────────────────────────────────────────────────────────────────────────
// 4. Node State Types
// ───────────────────────────────────────────────────────────────────────────────

/**
 * Membrane geometry — a DNA-like boundary stabilization structure.
 * [PHIL] — Metaphorical: the membrane acts as a toroidal closure surface
 * that stabilizes the geometric field against decoherence.
 */
export interface MembraneGeometry {
  /** Surface area A of the closure torus (used in κ·(∮∇Ψ·dS)/A term) */
  readonly surface_area: Float64;
  /** Major radius R of the torus (φ-proportional) */
  readonly major_radius: Float64;
  /** Minor radius r of the torus (φ-proportional) */
  readonly minor_radius: Float64;
  /** Curvature coupling coefficient (scale-invariant by construction) */
  readonly curvature_coupling: Float64;
  /** Stabilization field — a corrective geometric boundary condition */
  readonly boundary_field: GeometricField;
  /** Aspect ratio R/r (φ in ideal construction). [SPEC] */
  readonly aspect_ratio: Float64;
  /** Poloidal circumference 2πr. [SPEC] */
  readonly poloidal_circumference: Float64;
  /** Toroidal circumference 2πR. [SPEC] */
  readonly toroidal_circumference: Float64;
  /** Torus volume 2π²Rr². [SPEC] */
  readonly volume: Float64;
  /** Winding number R/r = aspect_ratio. [SPEC] */
  readonly winding_number: Float64;
}

/**
 * Framework instance — an active framework at a specific node scale.
 */
export interface FrameworkInstance {
  /** Framework identifier */
  readonly framework_id: FrameworkId;
  /** Characteristic QRF threshold qrf_fw for this framework */
  readonly qrf_threshold: Float64;
  /** Framework-specific field contribution (partial Ψ) */
  readonly partial_field: GeometricField;
  /** Framework activation status (derived from qrf comparison) */
  readonly is_active: boolean;
}

/**
 * Memory instance — an active memory subsystem at a specific node scale.
 */
export interface MemoryInstance {
  /** Memory subsystem identifier */
  readonly memory_id: MemoryId;
  /** Temporal scale factor (φ-scaled temporal hierarchy) */
  readonly temporal_scale: Float64;
  /** Memory field — stored geometric pattern state */
  readonly memory_field: GeometricField;
  /** Memory activation status (derived from scale thresholds) */
  readonly is_active: boolean;
}

/**
 * Fractal node state — the complete geometric descriptor at scale n.
 * [SPEC] — Mathematical ontology; C(n) is a geometric overlap, not a Born probability.
 */
export interface FractalNodeState {
  /** Scale index n */
  readonly scale: ScaleIndex;
  /** Geometric field descriptor Ψ(r, n) — complex-valued Float64 array */
  readonly field_state: GeometricField;
  /** Coherence C(n) = |<Ψ(n)|Ψ(n-1)>|² */
  readonly coherence: Float64;
  /** Characteristic resonance frequency at this scale [Hz] */
  readonly resonance_frequency: Float64;
  /** Field energy density (arbitrary geometric units, φ-scaled) [PHIL] */
  readonly energy_density: Float64;
}

// ───────────────────────────────────────────────────────────────────────────────
// 5. Propagation & Event Types
// ───────────────────────────────────────────────────────────────────────────────

/**
 * Information packet propagated between nodes in the fractal hierarchy.
 * Deterministic — contains no stochastic or random components.
 */
export interface PropagationPacket {
  /** Source scale index */
  readonly source_scale: ScaleIndex;
  /** Target scale index */
  readonly target_scale: ScaleIndex;
  /** Direction of propagation */
  readonly direction: "up" | "down" | "horizontal";
  /** Field amplitude being propagated (complex interleaved) */
  readonly field_amplitude: GeometricField;
  /** Coherence value carried with the packet */
  readonly coherence: Float64;
  /** Timestamp in deterministic simulation units (φ-scaled iteration count) */
  readonly iteration: number;
}

/**
 * Master Equation term descriptor.
 * Ψ_total(r,n) = Σ(k=0 to N) term_k + λ·Ψ_total(r,n-1) + κ·(∮∇Ψ·dS)/A
 */
export interface MasterEquationTerm {
  /** Term index k in the summation */
  readonly k: number;
  /** Amplitude weight φ^(-k) */
  readonly amplitude_weight: Float64;
  /** Phase angle θ_k(r, n) */
  readonly phase_angle: PhaseAngle;
  /** Complex amplitude [Re, Im] */
  readonly complex_value: ComplexAmplitude;
}

/**
 * Master Equation closure — the complete decomposition of Ψ_total.
 */
export interface MasterEquationClosure {
  /** Summation terms Σ(k=0 to N) φ^(-k)·e^(i·θ_k) */
  readonly terms: readonly MasterEquationTerm[];
  /** Recursive memory term λ·Ψ_total(r, n-1) */
  readonly memory_term: GeometricField;
  /** Surface closure term κ·(∮∇Ψ·dS)/A */
  readonly surface_term: GeometricField;
  /** Total field Ψ_total(r, n) */
  readonly total_field: GeometricField;
}

// ───────────────────────────────────────────────────────────────────────────────
// 6. Mapper & Engine Types
// ───────────────────────────────────────────────────────────────────────────────

/**
 * Scale mapper configuration — read-only map of scale index to ScaleConfig.
 */
export type ScaleConfigMap = Readonly<Record<ScaleIndex, ScaleConfig>>;

/**
 * Framework characteristic scale entry.
 */
export interface FrameworkCharacteristic {
  readonly id: FrameworkId;
  readonly n_fw: number;
  readonly qrf_fw: Float64;
  readonly description: string;
}

/**
 * Memory threshold entry — scale index at which a memory level activates.
 */
export interface MemoryThreshold {
  readonly id: MemoryId;
  readonly activation_scale: ScaleIndex;
  readonly temporal_scale_factor: Float64;
  readonly description: string;
}

/**
 * Node identifier — deterministic UUID-like string derived from scale and path.
 */
export type NodeId = string;

/**
 * Fractal tree statistics — aggregated metrics over a node subtree.
 */
export interface FractalTreeStats {
  readonly total_nodes: number;
  readonly max_depth: number;
  readonly coherent_nodes: number;
  readonly near_critical_nodes: number;
  readonly active_framework_count: number;
  readonly active_memory_count: number;
}

/**
 * Options for FractalNode field computation.
 */
export interface ComputeOptions {
  /** Include surface closure term (default: true) */
  readonly include_surface_term?: boolean;
  /** Include recursive memory term (default: true) */
  readonly include_memory_term?: boolean;
  /** Maximum summation index N (default: 13 = F_7) */
  readonly max_k?: number;
  /** Convergence tolerance for iterative stabilization (default: 1e-12) */
  readonly tolerance?: Float64;
  /** Maximum stabilization iterations (default: 100) */
  readonly max_iterations?: number;
}

// ═══════════════════════════════════════════════════════════════════════════════
// 7. Re-exports for Module Compatibility
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Namespace object for RHUFT constants (backward compatibility). [SPEC]
 */
export const RHUFT_CONSTANTS = {
  PHI: PHI,
  PI: PI,
  E: EULER,
  SQRT2: SQRT2,
  SQRT3: SQRT3,
} as const;

/**
 * Re-exported constants for backward-compatible module imports.
 * [SPEC] — These aliases allow existing modules to import from ./types.ts.
 */
export {
  PHI,
  PI,
  EULER,
  SQRT2,
  SQRT3,
  CLOSURE_COUPLING as KAPPA,
  COHERENCE_THRESHOLD as LAMBDA,
  PLANCK_FREQUENCY,
  PLANCK_LENGTH,
};

export type { FractalNode };

/** QRF attenuation qrf(n) = φ^(-n/89). [SPEC] */
export function qrf_attenuation(n: number): Float64 {
  return Math.pow(PHI, -n / 89) as Float64;
}

/** Coherence C(n) = qrf(n). [SPEC] */
export function coherence(n: number): Float64 {
  return qrf_attenuation(n);
}

/** Characteristic length L(n) = ℓ_P · φⁿ. [SPEC] */
export function scale_length(n: number): Float64 {
  return (PLANCK_LENGTH * Math.pow(PHI, n)) as Float64;
}

// ═══════════════════════════════════════════════════════════════════════════════
// 8. Membrane & Resonance Types
// ═══════════════════════════════════════════════════════════════════════════════

/** Result of membrane stabilization. [SPEC] */
export interface MembraneStabilizationResult {
  readonly stabilized: boolean;
  readonly new_field_state: GeometricField;
  readonly closure_deviation: Float64;
  readonly membrane_energy: Float64;
}

/** Resonance convergence descriptor. [SPEC] */
export interface ResonanceConvergence {
  readonly frequency: Float64;
  readonly stability_score: Float64;
  readonly convergence_depth: number;
  readonly participating_scales: readonly ScaleIndex[];
  readonly coherence_at_resonance: Float64;
  readonly harmonic_series: readonly Float64[];
}

// ═══════════════════════════════════════════════════════════════════════════════
// 9. Interdimensional Flow Types
// ═══════════════════════════════════════════════════════════════════════════════

/** Information flow packet between scales. [SPEC] */
export interface FlowPacket {
  readonly source_scale: ScaleIndex;
  readonly target_scale: ScaleIndex;
  readonly direction: "up" | "down" | "horizontal";
  readonly field_amplitude: GeometricField;
  readonly coherence: Float64;
  readonly iteration: number;
}

/** Toroidal flow channel connecting two scales. [SPEC] */
export interface ToroidalFlowChannel {
  readonly channel_id: string;
  readonly source_scale: ScaleIndex;
  readonly target_scale: ScaleIndex;
  readonly packets: readonly FlowPacket[];
  readonly cumulative_coherence: Float64;
}

// ═══════════════════════════════════════════════════════════════════════════════
// 10. Hardware Governor Types
// ═══════════════════════════════════════════════════════════════════════════════

/** Hardware specifications. [SPEC] */
export interface HardwareSpecs {
  readonly total_ram_bytes: number;
  readonly cpu_cores: number;
  readonly cpu_max_frequency_hz: Float64;
  readonly available_ram_bytes: number;
}

/** Resource budget computed by the hardware governor. [SPEC] */
export interface ResourceBudget {
  readonly max_ram_bytes: number;
  readonly max_cpu_percent: Float64;
  readonly target_ram_bytes: number;
  readonly target_cpu_percent: Float64;
  readonly max_nodes: number;
  readonly max_depth: number;
}

/** Scaling decision returned by the hardware governor. [SPEC] */
export interface ScalingDecision {
  readonly action: "grow" | "shrink" | "maintain";
  readonly target_depth: number;
  readonly reason: string;
  readonly ram_bytes: number;
  readonly cpu_percent: Float64;
}

// ═══════════════════════════════════════════════════════════════════════════════
// 11. Engine Types
// ═══════════════════════════════════════════════════════════════════════════════

/** ScaleConfigLocal alias for module compatibility. [SPEC] */
export interface ScaleConfigLocal extends ScaleConfig {}

/** Engine configuration. [SPEC] */
export interface EngineConfig {
  readonly target_scale: number;
  readonly max_depth: number;
  readonly target_frequency: number;
  readonly resonance_target: number;
  readonly hardware_adaptive: boolean;
  readonly target_resource_usage: number;
}

/** Engine runtime state. [SPEC] */
export interface EngineState {
  readonly tick_count: number;
  readonly root_node: FractalNode;
  readonly current_resonance: ResonanceConvergence | null;
  readonly global_coherence: Float64;
  readonly active_nodes: number;
  readonly total_nodes: number;
  readonly resource_usage: { readonly ram_bytes: number; readonly cpu_percent: Float64 };
  readonly hardware_budget: ResourceBudget;
  readonly last_scaling_decision: ScalingDecision | null;
}

/** Result of a single engine tick. [SPEC] */
export interface EngineTickResult {
  readonly tick: number;
  readonly coherence: Float64;
  readonly resonance: ResonanceConvergence | null;
  readonly active_nodes: number;
  readonly total_nodes: number;
  readonly resource_usage: { readonly ram_bytes: number; readonly cpu_percent: Float64 };
  readonly scaling_action: ScalingDecision | null;
  readonly flow_packets: readonly FlowPacket[];
  readonly stabilized: boolean;
}
