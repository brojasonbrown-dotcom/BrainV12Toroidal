/**
 * RHUFT v6.0 — Fractal Node Engine: Barrel Exports
 *
 * Single entry point for all public APIs, types, constants, and classes.
 * Import from this file to access the complete engine surface.
 *
 * Epistemic Status: [SPEC] + [PHIL] — Mathematical ontology, not predictive physics.
 */

// ───────────────────────────────────────────────────────────────────────────────
// 1. Types
// ───────────────────────────────────────────────────────────────────────────────

export type {
  Float64,
  ScaleIndex,
  FrameworkId,
  MemoryId,
  ResonanceStrength,
  CoherenceStatus,
  ConstantSymbol,
  GeometricField,
  PhaseAngle,
  ComplexAmplitude,
  DimensionalResonance,
  ScaleConfig,
  ScaleConfigLocal,
  FrameworkCharacteristic,
  MemoryThreshold,
  FrameworkInstance,
  MemoryInstance,
  FractalNodeState,
  FractalTreeStats,
  NodeId,
  ComputeOptions,
  MasterEquationTerm,
  MasterEquationClosure,
  PropagationPacket,
  MembraneGeometry,
  MembraneStabilizationResult,
  ResonanceConvergence,
  FlowPacket,
  ToroidalFlowChannel,
  HardwareSpecs,
  ResourceBudget,
  ScalingDecision,
  EngineConfig,
  EngineState,
  EngineTickResult,
} from "./types.ts";

// ───────────────────────────────────────────────────────────────────────────────
// 2. Constants
// ───────────────────────────────────────────────────────────────────────────────

export {
  PHI,
  PHI_INV,
  PHI_SQUARED,
  PHI_CUBED,
  PHI_NEG2,
  PHI_NEG3,
  PHI_NEG5,
  PHI_NEG8,
  PI,
  TWO_PI,
  GOLDEN_ANGLE_RAD,
  EULER,
  SILVER_RATIO,
  SQRT2,
  SQRT3,
  PLANCK_LENGTH,
  PLANCK_FREQUENCY,
  SPEED_OF_LIGHT,
  COHERENCE_THRESHOLD,
  CLOSURE_COUPLING,
  QRF_CRITICAL_SCALE,
  MASTER_EQUATION_N,
  SCALE_INDICES,
  SCALE_NAMES,
  FRAMEWORK_CHARACTERISTICS,
  MEMORY_THRESHOLDS,
  DOMINANT_CONSTANTS_BY_SCALE,
  DIMENSIONAL_RESONANCE_BY_SCALE,
  PHYSICAL_CONSTANTS_BY_SCALE,
  SCALE_CONFIG_SNAPSHOT,
} from "./core/constants.ts";

// ───────────────────────────────────────────────────────────────────────────────
// 3. Classes
// ───────────────────────────────────────────────────────────────────────────────

export { FractalNode } from "./fractal_node.ts";
export { ScaleMapper } from "./scale_mapper.ts";
export { MembraneStabilizer } from "./membrane_stabilizer.ts";
export { ResonanceFinder } from "./resonance_finder.ts";
export { InterdimensionalFlow } from "./interdimensional_flow.ts";
export { HardwareGovernor } from "./hardware_governor.ts";
export { FractalNodeEngine } from "./fractal_node_engine.ts";

// ───────────────────────────────────────────────────────────────────────────────
// 4. Framework & Memory Instances
// ───────────────────────────────────────────────────────────────────────────────

export {
  ALL_FRAMEWORKS,
  ALL_MEMORIES,
  get_active_frameworks,
  get_active_memories,
  F8_SubPlanckian,
  F4_Geometric,
  F5_ColorMusic,
  F6_Hebrew,
  F7_Thermodynamic,
  F1_Septenary,
  F9_Hypergalactic,
  L1_Pattern,
  L2_Hebbian,
  L3_Kuramoto,
  L4_Sensory,
  L4p_WeightedRAM,
} from "./frameworks.ts";
