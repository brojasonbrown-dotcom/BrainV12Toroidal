/**
 * RHUFT v6.0 — Core Mathematical Constants
 *
 * All values exported as IEEE-754 Float64 (≈15 significant digits).
 * Strictly deterministic — no random seeds, no runtime computation of constants.
 *
 * Epistemic Status: [SPEC] + [PHIL] — Mathematical ontology constants.
 * The incommensurable constants (φ, π, e, δ_S, √2, √3) are treated as
 * primitive generators of the geometric scaling law; their physical
 * correspondences are approximate [SPEC].
 */

import type { Float64, FrameworkCharacteristic, MemoryThreshold, ScaleIndex, ScaleConfigMap } from "../types.ts";

// ═══════════════════════════════════════════════════════════════════════════════
// 1. Golden Ratio & Powers
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Golden ratio φ = (1 + √5) / 2.
 * [MATH] — Exact irrational; truncated to Float64 ≈ 1.618033988749895.
 */
export const PHI: Float64 = 1.618033988749895 as Float64;

/**
 * Reciprocal of the golden ratio: 1/φ = φ - 1.
 * [MATH] — Exact value: 0.6180339887498949.
 */
export const PHI_INV: Float64 = 0.6180339887498949 as Float64;

/**
 * φ² = φ + 1.
 * [MATH] — Exact irrational; truncated to Float64 ≈ 2.618033988749895.
 */
export const PHI_SQUARED: Float64 = 2.618033988749895 as Float64;

/**
 * φ³.
 * [MATH] — Exact irrational; truncated to Float64 ≈ 4.23606797749979.
 */
export const PHI_CUBED: Float64 = 4.23606797749979 as Float64;

/**
 * φ⁻² = 1/φ².
 * [MATH] — This is the coherence threshold λ = 1/φ² ≈ 0.3819660113.
 * Appears in the Master Equation as the memory coupling coefficient.
 */
export const PHI_NEG2: Float64 = 0.3819660112501051 as Float64;

/**
 * φ⁻³.
 * [MATH] — Exact irrational; truncated to Float64 ≈ 0.2360679774997897.
 */
export const PHI_NEG3: Float64 = 0.2360679774997897 as Float64;

/**
 * φ⁻⁵.
 * [MATH] — Exact irrational; truncated to Float64 ≈ 0.09016994374947424.
 */
export const PHI_NEG5: Float64 = 0.09016994374947424 as Float64;

/**
 * φ⁻⁸.
 * [MATH] — Exact irrational; truncated to Float64 ≈ 0.0344418537486347.
 */
export const PHI_NEG8: Float64 = 0.0344418537486347 as Float64;

// ═══════════════════════════════════════════════════════════════════════════════
// 2. Other Incommensurable Constants
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Circle constant π.
 * [MATH] — Truncated to Float64 ≈ 3.141592653589793.
 */
export const PI: Float64 = 3.141592653589793 as Float64;

/**
 * 2π — the full circle in radians.
 * [MATH] — Truncated to Float64 ≈ 6.283185307179586.
 */
export const TWO_PI: Float64 = 6.283185307179586 as Float64;

/**
 * Golden angle in radians: π·(3 - √5) ≈ 2.3999632297 rad ≈ 137.507764°.
 * [MATH] — Appears in phyllotaxis and optimal packing problems.
 */
export const GOLDEN_ANGLE_RAD: Float64 = 2.39996322972865332 as Float64;

/**
 * Euler's number e.
 * [MATH] — Truncated to Float64 ≈ 2.718281828459045.
 */
export const EULER: Float64 = 2.718281828459045 as Float64;

/**
 * Silver ratio δ_S = 1 + √2.
 * [MATH] — NOT 1 - φ; the silver ratio is a distinct incommensurable constant.
 * Truncated to Float64 ≈ 2.414213562373095.
 */
export const SILVER_RATIO: Float64 = 2.414213562373095 as Float64;

/**
 * Square root of 2.
 * [MATH] — Truncated to Float64 ≈ 1.4142135623730951.
 */
export const SQRT2: Float64 = 1.4142135623730951 as Float64;

/**
 * Square root of 3.
 * [MATH] — Truncated to Float64 ≈ 1.7320508075688772.
 */
export const SQRT3: Float64 = 1.7320508075688772 as Float64;

// ═══════════════════════════════════════════════════════════════════════════════
// 3. Physical Scale Constants (approximate correspondences [SPEC])
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Planck length ℓ_P ≈ 1.616 × 10⁻³⁵ m.
 * [SPEC] — Physical constant used as the base of the geometric scaling law L(n) = ℓ_P · φⁿ.
 */
export const PLANCK_LENGTH: Float64 = 1.616e-35 as Float64;

/**
 * Planck frequency f_P = c / ℓ_P ≈ 1.855 × 10⁴³ Hz.
 * [SPEC] — Derived from the speed of light and Planck length; base of f(n) = f_P · φ⁻ⁿ.
 */
export const PLANCK_FREQUENCY: Float64 = 1.855e43 as Float64;

/**
 * Speed of light c ≈ 2.998 × 10⁸ m/s.
 * [SPEC] — Used for consistency checks; not a primitive generator in the RHUFT ontology.
 */
export const SPEED_OF_LIGHT: Float64 = 2.998e8 as Float64;

// ═══════════════════════════════════════════════════════════════════════════════
// 4. RHUFT Threshold & Coupling Parameters
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Coherence threshold λ = 1/φ² ≈ 0.3819660113.
 * [MATH] — A framework is COHERENT if C(n) > λ; NEAR-CRITICAL otherwise.
 * Appears as the memory coupling coefficient in the Master Equation.
 */
export const COHERENCE_THRESHOLD: Float64 = PHI_NEG2;

/**
 * Closure coupling κ = 1/(φ·π) ≈ 0.1967263286.
 * [MATH] — Couples the surface closure term in the Master Equation.
 */
export const CLOSURE_COUPLING: Float64 = 0.1967263286200249 as Float64;

/**
 * QRF critical scale n_c = F(11) = 89.
 * [MATH] — Fibonacci number F₁₁ = 89; used as the QRF attenuation denominator.
 */
export const QRF_CRITICAL_SCALE: number = 89;

/**
 * Master Equation summation upper bound N = F₇ = 13.
 * [MATH] — Fibonacci number F₇ = 13; number of terms in the geometric series Σ φ⁻ᵏ.
 */
export const MASTER_EQUATION_N: number = 13;

// ═══════════════════════════════════════════════════════════════════════════════
// 5. Scale Index Registry
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * All canonical scale indices in ascending order.
 * [SPEC] — Order-of-magnitude alignments between geometric scaling law and observed scales.
 */
export const SCALE_INDICES: readonly ScaleIndex[] = [
  0, 96, 120, 134, 168, 192, 235, 250, 270, 292,
] as const;

/**
 * Human-readable scale names indexed by n.
 */
export const SCALE_NAMES: Readonly<Record<ScaleIndex, string>> = {
  0: "Planck",
  96: "Nuclear",
  120: "Atomic",
  134: "Molecular",
  168: "Biological",
  192: "Human",
  235: "Planetary",
  250: "Stellar",
  270: "Galactic",
  292: "Cosmic",
} as const;

// ═══════════════════════════════════════════════════════════════════════════════
// 6. Framework Characteristic Scales
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Framework characteristic QRF thresholds.
 * A framework is ACTIVE at scale n if qrf(n) > qrf_fw(framework).
 * [SPEC] — Derived from framework-specific characteristic scales n_fw.
 */
export const FRAMEWORK_CHARACTERISTICS: readonly FrameworkCharacteristic[] = [
  {
    id: "F8_SubPlanckian",
    n_fw: 0,
    qrf_fw: 1.0 as Float64,
    description: "Vacuum fluctuations, quantum foam, Planck-scale structure",
  },
  {
    id: "F4_Geometric",
    n_fw: 13,
    qrf_fw: 0.9321238246563715 as Float64,
    description: "Structural/spatial organization, recursive lattice, Flower of Life",
  },
  {
    id: "F5_ColorMusic",
    n_fw: 21,
    qrf_fw: 0.8926654244026953 as Float64,
    description: "Frequency/wavelength harmonic relationships, mass-frequency correspondence",
  },
  {
    id: "F6_Hebrew",
    n_fw: 22,
    qrf_fw: 0.8878508836021354 as Float64,
    description: "Sacred geometry, septenary linguistic encoding, 22-letter structure",
  },
  {
    id: "F7_Thermodynamic",
    n_fw: 34,
    qrf_fw: 0.8320742315563247 as Float64,
    description: "Energy, entropy, heat flow, geometric friction, vacuum energy",
  },
  {
    id: "F1_Septenary",
    n_fw: 55,
    qrf_fw: 0.7427630469354221 as Float64,
    description: "7-level cognitive hierarchy, NQHC, Kuramoto coupling",
  },
  {
    id: "F9_Hypergalactic",
    n_fw: 292,
    qrf_fw: 0.20622109538707316 as Float64,
    description: "Large-scale structure, cosmic memory, holographic principle",
  },
] as const;

// ═══════════════════════════════════════════════════════════════════════════════
// 7. Memory Subsystem Thresholds
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Memory subsystem activation thresholds by scale index.
 * [SPEC] — Based on CEAI 4-layer nested memory fields (v6_tech_05).
 * Memory levels are φ-scaled temporal hierarchies.
 */
export const MEMORY_THRESHOLDS: readonly MemoryThreshold[] = [
  {
    id: "L1_Pattern",
    activation_scale: 0,
    temporal_scale_factor: 1.0 as Float64,
    description: "Local geometric pattern recognition at Planck scale",
  },
  {
    id: "L2_Hebbian",
    activation_scale: 96,
    temporal_scale_factor: PHI_SQUARED, // φ² · τ_L1
    description: "Associative learning, synaptic plasticity at Nuclear scale",
  },
  {
    id: "L3_Kuramoto",
    activation_scale: 120,
    temporal_scale_factor: PHI_CUBED, // φ · τ_L2 ≈ φ³ · τ_L1
    description: "Phase synchronization, oscillator coupling at Atomic scale",
  },
  {
    id: "L4_Sensory",
    activation_scale: 168,
    temporal_scale_factor: 6.854101966249685 as Float64, // φ⁴ · τ_L0 ≈ 6.854
    description: "Environmental coupling, sensory integration at Biological scale",
  },
  {
    id: "L4+_WeightedRAM",
    activation_scale: 192,
    temporal_scale_factor: 11.090169943749475 as Float64, // φ⁵ · τ_L0 ≈ 11.090
    description: "Coherence-weighted global memory integration at Human scale",
  },
] as const;

// ═══════════════════════════════════════════════════════════════════════════════
// 8. Dominant Constants by Scale
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Dominant incommensurable constants per scale.
 * [PHIL] — These assignments are interpretive mappings from the geometric
 * ontology to scale-specific phenomena; not derivable from first principles.
 */
export const DOMINANT_CONSTANTS_BY_SCALE: Readonly<Record<ScaleIndex, readonly string[]>> = {
  0: ["φ"],
  96: ["φ"],
  120: ["π"],
  134: ["π", "e"],
  168: ["e"],
  192: ["e", "φ"],
  235: ["π", "√3"],
  250: ["π"],
  270: ["π"],
  292: ["φ"],
} as const;

// ═══════════════════════════════════════════════════════════════════════════════
// 9. Dimensional Resonance Configuration
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Dimensional resonance strengths per scale.
 * [PHIL] — Metaphorical labels for scale-coupling strength in information transfer.
 */
export const DIMENSIONAL_RESONANCE_BY_SCALE: Readonly<
  Record<ScaleIndex, { up: string; down: string; horizontal: string }>
> = {
  0: { up: "Strong", down: "None", horizontal: "None" },
  96: { up: "Strong", down: "Weak", horizontal: "Moderate" },
  120: { up: "Strong", down: "Moderate", horizontal: "Strong" },
  134: { up: "Moderate", down: "Strong", horizontal: "Strong" },
  168: { up: "Moderate", down: "Moderate", horizontal: "Strong" },
  192: { up: "Moderate", down: "Weak", horizontal: "Strong" },
  235: { up: "Weak", down: "Weak", horizontal: "Moderate" },
  250: { up: "Weak", down: "Weak", horizontal: "Moderate" },
  270: { up: "Weak", down: "None", horizontal: "Weak" },
  292: { up: "None", down: "None", horizontal: "Weak" },
} as const;

// ═══════════════════════════════════════════════════════════════════════════════
// 10. Physical Constants by Scale (approximate correspondences [SPEC])
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Physical constants associated with each scale.
 * [SPEC] — Order-of-magnitude correspondences; not predictive of precise values.
 * All values are IEEE-754 Float64 (≈15 significant digits).
 */
export const PHYSICAL_CONSTANTS_BY_SCALE: Readonly<Record<ScaleIndex, Readonly<Record<string, Float64>>>> = {
  0: {
    planck_length: 1.616e-35 as Float64,
    planck_time: 5.391e-44 as Float64,
    planck_energy: 1.956e9 as Float64,
    reduced_planck_constant: 1.055e-34 as Float64,
    gravitational_constant: 6.674e-11 as Float64,
  },
  96: {
    proton_radius: 8.414e-16 as Float64,
    proton_mass: 1.673e-27 as Float64,
    strong_coupling: 1.0 as Float64,
    neutron_radius: 1.0e-15 as Float64,
    nuclear_magneton: 5.051e-27 as Float64,
  },
  120: {
    bohr_radius: 5.29e-11 as Float64,
    fine_structure_inverse: 137.036 as Float64,
    electron_mass: 9.109e-31 as Float64,
    rydberg_constant: 1.097e7 as Float64,
    compton_wavelength: 2.426e-12 as Float64,
  },
  134: {
    boltzmann_constant: 1.381e-23 as Float64,
    avogadro_number: 6.022e23 as Float64,
    gas_constant: 8.314 as Float64,
    planck_constant: 6.626e-34 as Float64,
    elementary_charge: 1.602e-19 as Float64,
  },
  168: {
    cell_size: 1.0e-5 as Float64,
    atp_hydrolysis: 2.0e4 as Float64,
    action_potential: 7.0e-2 as Float64,
    membrane_capacitance: 1.0e-6 as Float64,
    protein_folding_dg: -1.0e1 as Float64,
  },
  192: {
    brain_mass: 1.4 as Float64,
    neural_firing_max: 1.0e2 as Float64,
    body_temperature: 3.1e2 as Float64,
    metabolic_rate: 1.0e2 as Float64,
    blood_flow: 5.0e-3 as Float64, // m³/s = 5 L/min
  },
  235: {
    earth_gravity: 9.807 as Float64,
    earth_radius: 6.371e6 as Float64,
    earth_mass: 5.972e24 as Float64,
    orbital_period: 3.154e7 as Float64, // 1 year in seconds
    surface_temperature: 2.88e2 as Float64,
  },
  250: {
    gravitational_constant: 6.674e-11 as Float64,
    solar_mass: 1.989e30 as Float64,
    solar_radius: 6.957e8 as Float64,
    solar_luminosity: 3.828e26 as Float64,
    solar_temperature: 5778.0 as Float64,
  },
  270: {
    milky_way_mass: 1.0e42 as Float64,
    milky_way_radius: 5.0e20 as Float64,
    hubble_constant: 2.184e-18 as Float64, // 67.4 km/s/Mpc in Hz
    dark_matter_fraction: 0.27 as Float64,
    dark_energy_fraction: 0.68 as Float64,
  },
  292: {
    cmb_temperature: 2.725 as Float64,
    cosmological_constant: 1.1e-52 as Float64,
    universe_age: 4.354e17 as Float64, // 13.8 Gyr in seconds
    observable_radius: 4.4e26 as Float64,
    critical_density: 8.6e-27 as Float64, // converted from g/cm³ to kg/m³
  },
} as const;

// ═══════════════════════════════════════════════════════════════════════════════
// 11. Pre-Computed Scale Configurations (read-only snapshot)
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Pre-computed scale configurations for all 10 canonical scales.
 * Values derived from L(n) = ℓ_P · φⁿ, f(n) = f_P · φ⁻ⁿ, qrf(n) = φ^(-n/89).
 * [SPEC] — Order-of-magnitude alignments; not predictive of precise physical values.
 */
export const SCALE_CONFIG_SNAPSHOT: ScaleConfigMap = {
  0: {
    n: 0,
    name: "Planck",
    length_m: 1.616e-35 as Float64,
    frequency_hz: 1.855e43 as Float64,
    qrf_attenuation: 1.0 as Float64,
    coherence_status: "COHERENT",
    active_frameworks: ["F8_SubPlanckian", "F4_Geometric"],
    active_memory: ["L1_Pattern"],
    dominant_constants: ["φ"],
    dimensional_resonance: { up: "Strong", down: "None", horizontal: "None" },
    physical_constants: PHYSICAL_CONSTANTS_BY_SCALE[0],
  },
  96: {
    n: 96,
    name: "Nuclear",
    length_m: 1.868e-15 as Float64,
    frequency_hz: 1.61e23 as Float64,
    qrf_attenuation: 0.595080 as Float64,
    coherence_status: "COHERENT",
    active_frameworks: ["F4_Geometric", "F5_ColorMusic"],
    active_memory: ["L1_Pattern", "L2_Hebbian"],
    dominant_constants: ["φ"],
    dimensional_resonance: { up: "Strong", down: "Weak", horizontal: "Moderate" },
    physical_constants: PHYSICAL_CONSTANTS_BY_SCALE[96],
  },
  120: {
    n: 120,
    name: "Atomic",
    length_m: 1.937e-10 as Float64,
    frequency_hz: 1.55e18 as Float64,
    qrf_attenuation: 0.522660 as Float64,
    coherence_status: "COHERENT",
    active_frameworks: ["F4_Geometric", "F5_ColorMusic", "F6_Hebrew"],
    active_memory: ["L1_Pattern", "L2_Hebbian", "L3_Kuramoto"],
    dominant_constants: ["π"],
    dimensional_resonance: { up: "Strong", down: "Moderate", horizontal: "Strong" },
    physical_constants: PHYSICAL_CONSTANTS_BY_SCALE[120],
  },
  134: {
    n: 134,
    name: "Molecular",
    length_m: 1.633e-7 as Float64,
    frequency_hz: 1.84e15 as Float64,
    qrf_attenuation: 0.484557 as Float64,
    coherence_status: "COHERENT",
    active_frameworks: ["F4_Geometric", "F5_ColorMusic", "F6_Hebrew", "F7_Thermodynamic"],
    active_memory: ["L1_Pattern", "L2_Hebbian", "L3_Kuramoto"],
    dominant_constants: ["π", "e"],
    dimensional_resonance: { up: "Moderate", down: "Strong", horizontal: "Strong" },
    physical_constants: PHYSICAL_CONSTANTS_BY_SCALE[134],
  },
  168: {
    n: 168,
    name: "Biological",
    length_m: 2.082e0 as Float64,
    frequency_hz: 1.44e8 as Float64,
    qrf_attenuation: 0.403187 as Float64,
    coherence_status: "COHERENT",
    active_frameworks: ["F4_Geometric", "F5_ColorMusic", "F6_Hebrew", "F7_Thermodynamic", "F1_Septenary"],
    active_memory: ["L1_Pattern", "L2_Hebbian", "L3_Kuramoto", "L4_Sensory"],
    dominant_constants: ["e"],
    dimensional_resonance: { up: "Moderate", down: "Moderate", horizontal: "Strong" },
    physical_constants: PHYSICAL_CONSTANTS_BY_SCALE[168],
  },
  192: {
    n: 192,
    name: "Human",
    length_m: 2.158e5 as Float64,
    frequency_hz: 1.39e3 as Float64,
    qrf_attenuation: 0.354120 as Float64,
    coherence_status: "NEAR-CRITICAL",
    active_frameworks: ["F4_Geometric", "F5_ColorMusic", "F6_Hebrew", "F7_Thermodynamic", "F1_Septenary"],
    active_memory: ["L1_Pattern", "L2_Hebbian", "L3_Kuramoto", "L4_Sensory", "L4+_WeightedRAM"],
    dominant_constants: ["e", "φ"],
    dimensional_resonance: { up: "Moderate", down: "Weak", horizontal: "Strong" },
    physical_constants: PHYSICAL_CONSTANTS_BY_SCALE[192],
  },
  235: {
    n: 235,
    name: "Planetary",
    length_m: 2.092e14 as Float64,
    frequency_hz: 1.43e-6 as Float64,
    qrf_attenuation: 0.280659 as Float64,
    coherence_status: "NEAR-CRITICAL",
    active_frameworks: ["F4_Geometric", "F5_ColorMusic", "F6_Hebrew", "F7_Thermodynamic", "F1_Septenary", "F9_Hypergalactic"],
    active_memory: ["L1_Pattern", "L2_Hebbian", "L3_Kuramoto", "L4_Sensory", "L4+_WeightedRAM"],
    dominant_constants: ["π", "√3"],
    dimensional_resonance: { up: "Weak", down: "Weak", horizontal: "Moderate" },
    physical_constants: PHYSICAL_CONSTANTS_BY_SCALE[235],
  },
  250: {
    n: 250,
    name: "Stellar",
    length_m: 2.854e17 as Float64,
    frequency_hz: 1.05e-9 as Float64,
    qrf_attenuation: 0.258795 as Float64,
    coherence_status: "NEAR-CRITICAL",
    active_frameworks: ["F4_Geometric", "F7_Thermodynamic", "F9_Hypergalactic"],
    active_memory: ["L1_Pattern", "L2_Hebbian", "L3_Kuramoto", "L4_Sensory", "L4+_WeightedRAM"],
    dominant_constants: ["π"],
    dimensional_resonance: { up: "Weak", down: "Weak", horizontal: "Moderate" },
    physical_constants: PHYSICAL_CONSTANTS_BY_SCALE[250],
  },
  270: {
    n: 270,
    name: "Galactic",
    length_m: 4.317e21 as Float64,
    frequency_hz: 6.95e-14 as Float64,
    qrf_attenuation: 0.232270 as Float64,
    coherence_status: "NEAR-CRITICAL",
    active_frameworks: ["F4_Geometric", "F7_Thermodynamic", "F9_Hypergalactic"],
    active_memory: ["L1_Pattern", "L2_Hebbian", "L3_Kuramoto", "L4_Sensory", "L4+_WeightedRAM"],
    dominant_constants: ["π"],
    dimensional_resonance: { up: "Weak", down: "None", horizontal: "Weak" },
    physical_constants: PHYSICAL_CONSTANTS_BY_SCALE[270],
  },
  292: {
    n: 292,
    name: "Cosmic",
    length_m: 1.710e26 as Float64,
    frequency_hz: 1.75e-18 as Float64,
    qrf_attenuation: 0.206221 as Float64,
    coherence_status: "NEAR-CRITICAL",
    active_frameworks: ["F4_Geometric", "F9_Hypergalactic"],
    active_memory: ["L4+_WeightedRAM"],
    dominant_constants: ["φ"],
    dimensional_resonance: { up: "None", down: "None", horizontal: "Weak" },
    physical_constants: PHYSICAL_CONSTANTS_BY_SCALE[292],
  },
} as const;
