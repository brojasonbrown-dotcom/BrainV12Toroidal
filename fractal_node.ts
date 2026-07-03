/**
 * RHUFT v6.0 — Fractal Node Engine
 *
 * Implements the FractalNode class with geometric field computation,
 * membrane stabilization, recursive child management, and the corrected
 * Master Equation:
 *
 *   Ψ_total(r,n) = Σ(k=0 to N) φ^(-k) · e^(i·θ_k(r,n))
 *                  + λ · Ψ_total(r,n-1)
 *                  + κ · (∮∇Ψ·dS) / A
 *
 * Where N = 13 (F_7 = 13), λ = 1/φ², κ = 1/(φ·π), A = surface area.
 *
 * Epistemic Status: [SPEC] + [PHIL] — Mathematical ontology, not predictive physics.
 * All numeric values are IEEE-754 Float64 (≈15 significant digits).
 * Strictly deterministic — no random seeds, no entropy injection.
 * Scale-invariant by construction: all parameters are φ-scale-proportional.
 */

import type {
  ComplexAmplitude,
  ComputeOptions,
  Float64,
  FrameworkId,
  FrameworkInstance,
  FractalNodeState,
  FractalTreeStats,
  GeometricField,
  MasterEquationClosure,
  MasterEquationTerm,
  MembraneGeometry,
  MemoryId,
  MemoryState,
  MemoryEngine,
  NodeId,
  PropagationPacket,
  ResonanceStrength,
  ScaleConfig,
  ScaleIndex,
} from "./types.ts";

import {
  CLOSURE_COUPLING,
  COHERENCE_THRESHOLD,
  MASTER_EQUATION_N,
  PHI,
  PHI_INV,
  PHI_NEG2,
  PI,
  SCALE_INDICES,
} from "./core/constants.ts";

import { ScaleMapper } from "./scale_mapper.ts";
import { createMemoryEngine } from "./memory_integration.ts";
import {
  L1_Pattern,
  L2_Hebbian,
  L3_Kuramoto,
  L4_Sensory,
  L4p_WeightedRAM,
} from "./frameworks.ts";

// ───────────────────────────────────────────────────────────────────────────────
// 1. Helper Functions (deterministic, no randomness)
// ───────────────────────────────────────────────────────────────────────────────

/**
 * Computes a deterministic node ID from scale index and path segments.
 * Format: "node_{scale}_{pathHash}" where pathHash is a deterministic hash.
 */
function computeNodeId(scale: ScaleIndex, pathSegments: readonly number[]): NodeId {
  // Simple deterministic hash: weighted sum of path segments with φ-proportional weights.
  let hash = 0;
  for (let i = 0; i < pathSegments.length; i++) {
    hash = (hash * 31 + pathSegments[i] * (i + 1)) & 0x7fffffff;
  }
  return `node_${scale}_${hash.toString(16).padStart(8, "0")}`;
}

/**
 * Computes a deterministic phase angle θ_k(r, n) for the Master Equation.
 *
 * [MATH] — Phase is derived from scale geometry: θ_k = 2π · k · φ^(-1) · n / 89.
 * This is a deterministic construction, not a random phase.
 */
function computePhaseAngle(k: number, n: number): Float64 {
  const base = (2 * PI * k * PHI_INV * n) / 89;
  // Normalize to [0, 2π) for periodicity
  const normalized = base % (2 * PI);
  return (normalized >= 0 ? normalized : normalized + 2 * PI) as Float64;
}

/**
 * Complex exponential e^(i·θ) = cos(θ) + i·sin(θ) as [Re, Im].
 */
function complexExp(theta: Float64): ComplexAmplitude {
  return [Math.cos(theta) as Float64, Math.sin(theta) as Float64];
}

/**
 * Complex multiplication: (a + bi) · (c + di) = (ac - bd) + (ad + bc)i.
 */
function complexMultiply(a: ComplexAmplitude, b: ComplexAmplitude): ComplexAmplitude {
  const [ar, ai] = a;
  const [br, bi] = b;
  return [(ar * br - ai * bi) as Float64, (ar * bi + ai * br) as Float64];
}

/**
 * Complex addition: (a + bi) + (c + di) = (a+c) + (b+d)i.
 */
function complexAdd(a: ComplexAmplitude, b: ComplexAmplitude): ComplexAmplitude {
  return [(a[0] + b[0]) as Float64, (a[1] + b[1]) as Float64];
}

/**
 * Complex scalar multiplication: c · (a + bi).
 */
function complexScalarMultiply(scalar: Float64, c: ComplexAmplitude): ComplexAmplitude {
  return [(scalar * c[0]) as Float64, (scalar * c[1]) as Float64];
}

/**
 * Computes the magnitude squared |z|² = Re² + Im².
 */
function complexMagnitudeSquared(c: ComplexAmplitude): Float64 {
  return (c[0] * c[0] + c[1] * c[1]) as Float64;
}

/**
 * Computes the geometric overlap |<Ψ_a | Ψ_b>|² between two fields.
 *
 * [SPEC] — Defined as the normalized dot product of the interleaved complex arrays.
 * This is a geometric construction, not a quantum mechanical Born rule.
 */
function computeGeometricOverlap(fieldA: GeometricField, fieldB: GeometricField): Float64 {
  const len = Math.min(fieldA.length, fieldB.length);
  if (len === 0) return 0 as Float64;

  let dotReal = 0;
  let dotImag = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < len; i += 2) {
    const aR = fieldA[i] ?? 0;
    const aI = fieldA[i + 1] ?? 0;
    const bR = fieldB[i] ?? 0;
    const bI = fieldB[i + 1] ?? 0;

    // Complex inner product: <a|b> = Σ a*_i · b_i
    dotReal += aR * bR + aI * bI; // conjugate(a) · b = (aR - i·aI)(bR + i·bI)
    dotImag += aR * bI - aI * bR;

    normA += aR * aR + aI * aI;
    normB += bR * bR + bI * bI;
  }

  const normProduct = Math.sqrt(normA * normB);
  if (normProduct === 0) return 0 as Float64;

  const overlap = Math.sqrt(dotReal * dotReal + dotImag * dotImag) / normProduct;
  return (overlap * overlap) as Float64; // |<a|b>|²
}

/**
 * Creates a default membrane geometry for a given scale.
 *
 * [PHIL] — The membrane is a toroidal closure surface that stabilizes the field.
 * Dimensions are φ-proportional to the characteristic length L(n).
 */
function createDefaultMembrane(scale: ScaleIndex, lengthM: Float64): MembraneGeometry {
  // Torus parameters: major radius = L(n)/φ, minor radius = L(n)/φ²
  const majorRadius = (lengthM * PHI_INV) as Float64;
  const minorRadius = (lengthM * PHI_NEG2) as Float64;
  // Surface area A = 4π² · R · r (torus surface area)
  const surfaceArea = (4 * PI * PI * majorRadius * minorRadius) as Float64;
  // Curvature coupling = 1 / (φ · surfaceArea) — scale-invariant by construction
  const curvatureCoupling = (1 / (PHI * surfaceArea)) as Float64;

  // Boundary field: deterministic complex array of size 2·(N+1) = 28 (for N=13)
  const boundarySize = 2 * (MASTER_EQUATION_N + 1);
  const boundaryField = new Float64Array(boundarySize);
  for (let i = 0; i < boundarySize; i += 2) {
    const k = i / 2;
    const theta = computePhaseAngle(k, scale);
    const [re, im] = complexExp(theta);
    const weight = Math.pow(PHI_INV, k);
    boundaryField[i] = weight * re;
    boundaryField[i + 1] = weight * im;
  }

  // Aspect ratio and toroidal metrics for MembraneStabilizer compatibility. [SPEC]
  const aspectRatio = (majorRadius / minorRadius) as Float64;
  const poloidalCircumference = (2 * PI * minorRadius) as Float64;
  const toroidalCircumference = (2 * PI * majorRadius) as Float64;
  const volume = (2 * PI * PI * majorRadius * minorRadius * minorRadius) as Float64;
  const windingNumber = aspectRatio;

  return {
    surface_area: surfaceArea,
    major_radius: majorRadius,
    minor_radius: minorRadius,
    curvature_coupling: curvatureCoupling,
    boundary_field: boundaryField,
    aspect_ratio: aspectRatio,
    poloidal_circumference: poloidalCircumference,
    toroidal_circumference: toroidalCircumference,
    volume: volume,
    winding_number: windingNumber,
  };
}

/**
 * Computes the surface closure term κ · (∮∇Ψ·dS) / A using a discrete approximation.
 *
 * [SPEC] — The surface integral is approximated as a weighted sum over the
 * boundary field, using the membrane's curvature coupling. This is a discrete
 * geometric construction, not a numerical PDE solver.
 */
function computeSurfaceClosure(
  field: GeometricField,
  membrane: MembraneGeometry
): GeometricField {
  const result = new Float64Array(field.length);
  const kappa = CLOSURE_COUPLING;
  const area = membrane.surface_area;

  if (area === 0) {
    return result; // Zero field if surface area is degenerate
  }

  // Discrete approximation: ∮∇Ψ·dS ≈ Σ (Ψ_boundary - Ψ_field) · curvature_coupling
  const boundary = membrane.boundary_field;
  const cc = membrane.curvature_coupling;
  const factor = (kappa * cc) / area;

  for (let i = 0; i < field.length; i++) {
    const bVal = boundary[i % boundary.length] ?? 0;
    const diff = bVal - field[i];
    result[i] = factor * diff;
  }

  return result;
}

// ───────────────────────────────────────────────────────────────────────────────
// 2. FractalNode Class
// ───────────────────────────────────────────────────────────────────────────────

/**
 * A FractalNode represents a single scale level in the RHUFT v6.0 geometric hierarchy.
 *
 * Each node:
 *   - Holds a geometric field state Ψ(r, n)
 *   - Maintains a membrane geometry (toroidal closure surface)
 *   - Tracks active frameworks and memory subsystems via the ScaleMapper
 *   - Can create child nodes at the next lower canonical scale
 *   - Propagates information up/down/horizontally based on dimensional resonance
 *
 * [PHIL] — The fractal tree is a recursive geometric structure, not a physical
 * spacetime manifold. Child nodes are conceptual sub-scales, not literal particles.
 */
export class FractalNode {
  /** Deterministic unique identifier */
  readonly id: NodeId;

  /** Scale index n (one of 0, 96, 120, 134, 168, 192, 235, 250, 270, 292) */
  readonly scale: ScaleIndex;

  /** Parent node in the fractal hierarchy (null for root / Cosmic scale) */
  readonly parent: FractalNode | null;

  /** Child nodes at the next lower canonical scale */
  readonly children: FractalNode[];

  /** Scale configuration for this node's scale index */
  readonly scale_config: ScaleConfig;

  /** Scale mapper singleton (shared across all nodes for consistency) */
  readonly scale_mapper: ScaleMapper;

  /** Private mutable state — updated by compute() and stabilize() */
  private _state: FractalNodeState;

  /** Membrane geometry — DNA-like boundary stabilization */
  private _membrane: MembraneGeometry;

  /** Active framework instances at this scale */
  private _frameworks: Map<FrameworkId, FrameworkInstance>;

  /** Active memory subsystems at this scale (data state) */
  private _memory: Map<MemoryId, MemoryState>;

  /** Active memory engines at this scale (Hebbian learning, recall) */
  private _memory_engines: Map<MemoryId, MemoryEngine>;

  /** Previous field state for recursive memory term (Ψ_total(r, n-1) in time iteration) */
  private _previousField: GeometricField | null;

  /** Path segments for deterministic ID generation */
  private readonly _pathSegments: readonly number[];

  /** Cached dimensional resonance for this scale */
  private readonly _resonance: {
    readonly up: ResonanceStrength;
    readonly down: ResonanceStrength;
    readonly horizontal: ResonanceStrength;
  };

  /**
   * Constructs a FractalNode.
   *
   * @param scale — Canonical scale index
   * @param parent — Parent node (null for root)
   * @param scaleMapper — Shared ScaleMapper instance
   * @param pathSegments — Path segments for deterministic ID generation
   */
  constructor(
    scale: ScaleIndex,
    parent: FractalNode | null,
    scaleMapper: ScaleMapper,
    pathSegments: readonly number[] = []
  ) {
    this.scale = scale;
    this.parent = parent;
    this.scale_mapper = scaleMapper;
    this._pathSegments = pathSegments;

    this.id = computeNodeId(scale, pathSegments);
    this.children = [];

    // Retrieve scale configuration
    this.scale_config = scaleMapper.get_config(scale);

    // Initialize membrane geometry
    this._membrane = createDefaultMembrane(scale, this.scale_config.length_m);

    // Initialize framework instances
    this._frameworks = new Map<FrameworkId, FrameworkInstance>();
    for (const fwId of this.scale_config.active_frameworks) {
      const fwChar = scaleMapper.get_active_frameworks(scale).includes(fwId)
        ? { qrf_threshold: scaleMapper.compute_qrf(scale) }
        : { qrf_threshold: 1.0 as Float64 }; // fallback

      // Create framework partial field (deterministic)
      const fwField = new Float64Array(2 * (MASTER_EQUATION_N + 1));
      for (let i = 0; i < fwField.length; i += 2) {
        const k = i / 2;
        const theta = computePhaseAngle(k, scale);
        const [re, im] = complexExp(theta);
        const weight = Math.pow(PHI_INV, k) * (0.5 + 0.5 / (k + 1)); // framework-specific weighting
        fwField[i] = weight * re;
        fwField[i + 1] = weight * im;
      }

      this._frameworks.set(fwId, {
        framework_id: fwId,
        qrf_threshold: fwChar.qrf_threshold,
        partial_field: fwField,
        is_active: true,
      });
    }

    // Initialize memory instances
    this._memory = new Map<MemoryId, MemoryState>();
    for (const memId of this.scale_config.active_memory) {
      const temporalScale = scaleMapper.get_memory_temporal_scale(memId);
      const memField = new Float64Array(2 * (MASTER_EQUATION_N + 1));
      for (let i = 0; i < memField.length; i += 2) {
        const k = i / 2;
        const theta = computePhaseAngle(k, scale * temporalScale * PHI_INV);
        const [re, im] = complexExp(theta);
        const weight = Math.pow(PHI_INV, k) * PHI_INV; // memory-specific attenuation
        memField[i] = weight * re;
        memField[i + 1] = weight * im;
      }

      this._memory.set(memId, {
        memory_id: memId,
        temporal_scale: temporalScale,
        memory_field: memField,
        is_active: true,
      });
    }

    // Initialize memory engines (Hebbian learning, recall)
    this._memory_engines = new Map<MemoryId, MemoryEngine>();
    for (const memId of this.scale_config.active_memory) {
      const engine = createMemoryEngine(memId);
      if (engine) {
        this._memory_engines.set(memId, engine);
      }
    }

    // Cache dimensional resonance
    this._resonance = scaleMapper.get_all_resonance(scale);

    // Initialize field state with zero field
    const initialField = new Float64Array(2 * (MASTER_EQUATION_N + 1));
    this._previousField = null;

    // Compute initial coherence (self-overlap = 1.0)
    this._state = {
      scale,
      field_state: initialField,
      coherence: 1.0 as Float64,
      resonance_frequency: this.scale_config.frequency_hz,
      energy_density: 0 as Float64,
    };

    // Run initial computation to populate the field
    this.compute();
  }

  // ───────────────────────────────────────────────────────────────────────────
  // 3. Accessors
  // ───────────────────────────────────────────────────────────────────────────

  get state(): Readonly<FractalNodeState> {
    return this._state;
  }

  get membrane(): Readonly<MembraneGeometry> {
    return this._membrane;
  }

  get frameworks(): ReadonlyMap<FrameworkId, FrameworkInstance> {
    return this._frameworks;
  }

  get memory(): ReadonlyMap<MemoryId, MemoryState> {
    return this._memory;
  }

  // ───────────────────────────────────────────────────────────────────────────
  // 4. Field Computation: Master Equation
  // ───────────────────────────────────────────────────────────────────────────

  /**
   * Computes the geometric field Ψ_total(r, n) using the corrected Master Equation:
   *
   *   Ψ_total(r,n) = Σ(k=0 to N) φ^(-k) · e^(i·θ_k(r,n))
   *                  + λ · Ψ_total(r, n-1)
   *                  + κ · (∮∇Ψ·dS) / A
   *
   * Where:
   *   N = 13 (F_7 = 13)
   *   λ = 1/φ² = PHI_NEG2
   *   κ = 1/(φ·π) = CLOSURE_COUPLING
   *   A = membrane surface area
   *
   * [SPEC] — This is a geometric identity, not a Schrödinger or wave equation.
   * The summation is a φ-weighted geometric series of complex phase terms.
   * The recursive memory term couples to the previous field state.
   * The surface term provides toroidal closure stabilization.
   */
  compute(options?: ComputeOptions): void {
    const opts = {
      include_surface_term: true,
      include_memory_term: true,
      max_k: MASTER_EQUATION_N,
      ...options,
    };

    const N = opts.max_k ?? MASTER_EQUATION_N;
    const fieldSize = 2 * (N + 1);

    // ── Term 1: Summation Σ(k=0 to N) φ^(-k) · e^(i·θ_k) ───────────────────
    const summationField = new Float64Array(fieldSize);
    const terms: MasterEquationTerm[] = [];

    for (let k = 0; k <= N; k++) {
      const amplitudeWeight = Math.pow(PHI_INV, k) as Float64;
      const phaseAngle = computePhaseAngle(k, this.scale);
      const [re, im] = complexExp(phaseAngle);
      const complexValue: ComplexAmplitude = [
        (amplitudeWeight * re) as Float64,
        (amplitudeWeight * im) as Float64,
      ];

      terms.push({
        k,
        amplitude_weight: amplitudeWeight,
        phase_angle: phaseAngle,
        complex_value: complexValue,
      });

      // Accumulate into summation field (interleaved complex)
      const idx = 2 * k;
      if (idx < fieldSize) {
        summationField[idx] = complexValue[0];
        summationField[idx + 1] = complexValue[1];
      }
    }

    // ── Term 2: Recursive memory λ · Ψ_previous ────────────────────────────
    let memoryField: GeometricField;
    if (opts.include_memory_term && this._previousField !== null) {
      memoryField = new Float64Array(fieldSize);
      const prev = this._previousField;
      for (let i = 0; i < fieldSize; i++) {
        memoryField[i] = (PHI_NEG2 * (prev[i] ?? 0)) as Float64;
      }
    } else {
      memoryField = new Float64Array(fieldSize); // zero field
    }

    // ── Term 3: Surface closure κ · (∮∇Ψ·dS) / A ───────────────────────────
    let surfaceField: GeometricField;
    if (opts.include_surface_term) {
      // Use current state field as the field to stabilize
      surfaceField = computeSurfaceClosure(this._state.field_state, this._membrane);
      // Pad or truncate to match fieldSize
      if (surfaceField.length !== fieldSize) {
        const padded = new Float64Array(fieldSize);
        const copyLen = Math.min(surfaceField.length, fieldSize);
        for (let i = 0; i < copyLen; i++) {
          padded[i] = surfaceField[i];
        }
        surfaceField = padded;
      }
    } else {
      surfaceField = new Float64Array(fieldSize); // zero field
    }

    // ── Total field: sum all three terms ───────────────────────────────────
    const totalField = new Float64Array(fieldSize);
    for (let i = 0; i < fieldSize; i++) {
      totalField[i] = (summationField[i] + memoryField[i] + surfaceField[i]) as Float64;
    }

    // ── Compute coherence C(n) = |<Ψ(n)|Ψ(n-1)>|² ──────────────────────────
    let coherence: Float64;
    if (this._previousField !== null) {
      coherence = computeGeometricOverlap(totalField, this._previousField);
    } else {
      coherence = 1.0 as Float64; // Self-overlap for first computation
    }

    // ── Compute energy density (geometric norm squared, normalized) ────────
    let energySum = 0;
    for (let i = 0; i < fieldSize; i += 2) {
      const re = totalField[i];
      const im = totalField[i + 1];
      energySum += re * re + im * im;
    }
    const energyDensity = (energySum / (N + 1)) as Float64;

    // ── Update state ───────────────────────────────────────────────────────
    this._previousField = new Float64Array(this._state.field_state); // copy old state
    this._state = {
      scale: this.scale,
      field_state: totalField,
      coherence,
      resonance_frequency: this.scale_config.frequency_hz,
      energy_density: energyDensity,
    };
  }

  /**
   * Returns the detailed Master Equation closure decomposition.
   * Useful for inspection, debugging, and ontology verification.
   */
  get_master_equation_closure(options?: ComputeOptions): MasterEquationClosure {
    // Re-run computation with detailed tracking
    const opts = {
      include_surface_term: true,
      include_memory_term: true,
      max_k: MASTER_EQUATION_N,
      ...options,
    };

    const N = opts.max_k ?? MASTER_EQUATION_N;
    const fieldSize = 2 * (N + 1);

    const terms: MasterEquationTerm[] = [];
    for (let k = 0; k <= N; k++) {
      const amplitudeWeight = Math.pow(PHI_INV, k) as Float64;
      const phaseAngle = computePhaseAngle(k, this.scale);
      const [re, im] = complexExp(phaseAngle);
      terms.push({
        k,
        amplitude_weight: amplitudeWeight,
        phase_angle: phaseAngle,
        complex_value: [(amplitudeWeight * re) as Float64, (amplitudeWeight * im) as Float64],
      });
    }

    // Memory term
    const memoryField = new Float64Array(fieldSize);
    if (opts.include_memory_term && this._previousField !== null) {
      for (let i = 0; i < fieldSize; i++) {
        memoryField[i] = (PHI_NEG2 * (this._previousField[i] ?? 0)) as Float64;
      }
    }

    // Surface term
    const surfaceField = opts.include_surface_term
      ? computeSurfaceClosure(this._state.field_state, this._membrane)
      : new Float64Array(fieldSize);

    // Summation field from terms
    const summationField = new Float64Array(fieldSize);
    for (const term of terms) {
      const idx = 2 * term.k;
      if (idx < fieldSize) {
        summationField[idx] = term.complex_value[0];
        summationField[idx + 1] = term.complex_value[1];
      }
    }

    // Total
    const totalField = new Float64Array(fieldSize);
    for (let i = 0; i < fieldSize; i++) {
      const s = summationField[i] ?? 0;
      const m = memoryField[i] ?? 0;
      const surf = surfaceField[i] ?? 0;
      totalField[i] = (s + m + surf) as Float64;
    }

    return {
      terms,
      memory_term: memoryField,
      surface_term: surfaceField,
      total_field: totalField,
    };
  }

  // ───────────────────────────────────────────────────────────────────────────
  // 5. Stabilization
  // ───────────────────────────────────────────────────────────────────────────

  /**
   * Applies membrane stabilization to the field state.
   *
   * The membrane acts as a DNA-like boundary: it corrects the field by
   * projecting it toward the boundary field, using the curvature coupling
   * as a relaxation parameter. This is analogous to a cell membrane maintaining
   * homeostasis against external perturbations.
   *
   * [PHIL] — Metaphorical stabilization; not a physical PDE boundary condition.
   */
  stabilize(options?: ComputeOptions): void {
    const opts = {
      tolerance: 1e-12 as Float64,
      max_iterations: 100,
      ...options,
    };

    const tolerance = opts.tolerance ?? (1e-12 as Float64);
    const maxIter = opts.max_iterations ?? 100;

    const field = this._state.field_state;
    const boundary = this._membrane.boundary_field;
    const cc = this._membrane.curvature_coupling;
    const fieldLen = field.length;

    let iteration = 0;
    let maxDelta = Infinity;

    // Iterative relaxation: field ← field + cc · (boundary - field)
    while (maxDelta > tolerance && iteration < maxIter) {
      maxDelta = 0;
      for (let i = 0; i < fieldLen; i++) {
        const bVal = boundary[i % boundary.length] ?? 0;
        const correction = cc * (bVal - field[i]);
        const newVal = (field[i] + correction) as Float64;
        const delta = Math.abs(newVal - field[i]);
        if (delta > maxDelta) {
          maxDelta = delta;
        }
        field[i] = newVal;
      }
      iteration++;
    }

    // Recompute coherence after stabilization
    if (this._previousField !== null) {
      const newCoherence = computeGeometricOverlap(field, this._previousField);
      this._state = {
        ...this._state,
        coherence: newCoherence,
      };
    }
  }

  // ───────────────────────────────────────────────────────────────────────────
  // 6. Resonance Computation
  // ───────────────────────────────────────────────────────────────────────────

  /**
   * Computes the stable resonance frequency for this node.
   *
   * The resonance frequency is derived from the characteristic frequency f(n)
   * modulated by the coherence: f_res = f(n) · C(n) · φ^(depth).
   *
   * [SPEC] — This is a geometric construction, not a physical eigenfrequency.
   */
  compute_resonance(): Float64 {
    const depth = this.get_depth();
    const baseFreq = this.scale_config.frequency_hz;
    const coherence = this._state.coherence;
    const depthFactor = Math.pow(PHI, depth) as Float64;

    return (baseFreq * coherence * depthFactor) as Float64;
  }

  // ───────────────────────────────────────────────────────────────────────────
  // 7. Propagation Methods
  // ───────────────────────────────────────────────────────────────────────────

  /**
   * Sends information to the parent node (upward propagation).
   *
   * Only propagates if the UP dimensional resonance is not "None".
   * Resonance strength determines the fidelity of the propagated packet.
   */
  propagate_up(): PropagationPacket | null {
    if (this._resonance.up === "None" || this.parent === null) {
      return null;
    }

    const fidelity = this._resonanceStrengthToFidelity(this._resonance.up);
    const packet = this._createPacket("up", fidelity);

    // In a full system, the parent would receive this packet.
    // Here we return it for external routing.
    return packet;
  }

  /**
   * Sends information to child nodes (downward propagation).
   *
   * Only propagates if the DOWN dimensional resonance is not "None".
   * Creates one packet per child, scaled by child count for conservation.
   */
  propagate_down(): readonly PropagationPacket[] {
    if (this._resonance.down === "None" || this.children.length === 0) {
      return [];
    }

    const fidelity = this._resonanceStrengthToFidelity(this._resonance.down);
    const childCount = this.children.length;
    const perChildFidelity = fidelity / childCount;

    const packets: PropagationPacket[] = [];
    for (const child of this.children) {
      const packet = this._createPacket("down", perChildFidelity, child.scale);
      packets.push(packet);
    }

    return packets;
  }

  /**
   * Returns a horizontal propagation packet (same-scale information transfer).
   *
   * Horizontal propagation represents peer-to-peer interaction at the same scale.
   */
  propagate_horizontal(): PropagationPacket | null {
    if (this._resonance.horizontal === "None") {
      return null;
    }

    const fidelity = this._resonanceStrengthToFidelity(this._resonance.horizontal);
    return this._createPacket("horizontal", fidelity);
  }

  /**
   * Converts a ResonanceStrength to a numeric fidelity factor (0.0–1.0).
   */
  private _resonanceStrengthToFidelity(strength: ResonanceStrength): Float64 {
    switch (strength) {
      case "Strong":
        return 1.0 as Float64;
      case "Moderate":
        return PHI_INV; // ≈ 0.618
      case "Weak":
        return PHI_NEG2; // ≈ 0.382
      case "None":
        return 0 as Float64;
      default:
        // Exhaustive check ensures this is unreachable in strict mode
        return 0 as Float64;
    }
  }

  /**
   * Creates a propagation packet with the given direction and fidelity.
   */
  private _createPacket(
    direction: "up" | "down" | "horizontal",
    fidelity: Float64,
    targetScale?: ScaleIndex
  ): PropagationPacket {
    const sourceScale = this.scale;
    const target = targetScale ?? this.scale;

    // Scale field amplitude by fidelity
    const fieldLen = this._state.field_state.length;
    const scaledField = new Float64Array(fieldLen);
    for (let i = 0; i < fieldLen; i++) {
      scaledField[i] = (this._state.field_state[i] * fidelity) as Float64;
    }

    return {
      source_scale: sourceScale,
      target_scale: target,
      direction,
      field_amplitude: scaledField,
      coherence: (this._state.coherence * fidelity) as Float64,
      iteration: 0, // deterministic iteration counter; external scheduler sets this
    };
  }

  // ───────────────────────────────────────────────────────────────────────────
  // 8. Recursive Child Management
  // ───────────────────────────────────────────────────────────────────────────

  /**
   * Creates child nodes at the next lower canonical scale.
   *
   * Child count is determined by the Fibonacci number F(depth+1), capped at 13.
   * [PHIL] — Children are conceptual sub-scales, not literal particles.
   * The fractal structure is a recursive geometric decomposition.
   */
  create_children(): void {
    const nextScale = this.scale_mapper.get_next_scale_down(this.scale);
    if (nextScale === null) {
      return; // Already at Planck scale — no children possible
    }

    // Determine child count from Fibonacci sequence: F(depth+1), capped at 13
    const depth = this.get_depth();
    const childCount = Math.min(this._fibonacci(depth + 1), 13);

    // Destroy existing children first (clean re-creation)
    this.destroy_children();

    for (let i = 0; i < childCount; i++) {
      const childPath = [...this._pathSegments, i];
      const child = new FractalNode(nextScale, this, this.scale_mapper, childPath);
      this.children.push(child);
    }
  }

  /**
   * Destroys all child nodes and clears the children array.
   */
  destroy_children(): void {
    // Explicitly clear children to allow GC (TypeScript/JS doesn't have RAII)
    this.children.length = 0;
  }

  /**
   * Returns the recursive depth from the root node (root = 0).
   */
  get_depth(): number {
    let depth = 0;
    let current: FractalNode | null = this.parent;
    while (current !== null) {
      depth++;
      current = current.parent;
    }
    return depth;
  }

  /**
   * Returns the total number of nodes in the subtree rooted at this node.
   */
  get_total_nodes(): number {
    let count = 1; // this node
    for (const child of this.children) {
      count += child.get_total_nodes();
    }
    return count;
  }

  /**
   * Returns the maximum depth of the subtree rooted at this node.
   */
  get_max_depth(): number {
    if (this.children.length === 0) {
      return 0;
    }
    let maxChildDepth = 0;
    for (const child of this.children) {
      const childDepth = child.get_max_depth();
      if (childDepth > maxChildDepth) {
        maxChildDepth = childDepth;
      }
    }
    return 1 + maxChildDepth;
  }

  /**
   * Collects aggregate statistics for the subtree rooted at this node.
   */
  get_tree_stats(): FractalTreeStats {
    let coherent = 0;
    let nearCritical = 0;
    let fwCount = 0;
    let memCount = 0;

    const visit = (node: FractalNode): void => {
      if (node._state.coherence > COHERENCE_THRESHOLD) {
        coherent++;
      } else {
        nearCritical++;
      }
      fwCount += node._frameworks.size;
      memCount += node._memory.size;
      for (const child of node.children) {
        visit(child);
      }
    };

    visit(this);

    return {
      total_nodes: this.get_total_nodes(),
      max_depth: this.get_max_depth(),
      coherent_nodes: coherent,
      near_critical_nodes: nearCritical,
      active_framework_count: fwCount,
      active_memory_count: memCount,
    };
  }

  // ───────────────────────────────────────────────────────────────────────────
  // 9. Private Helpers
  // ───────────────────────────────────────────────────────────────────────────

  /**
   * Computes the n-th Fibonacci number deterministically.
   * Used for child count determination.
   */
  private _fibonacci(n: number): number {
    if (n <= 0) return 0;
    if (n === 1) return 1;

    let a = 0;
    let b = 1;
    for (let i = 2; i <= n; i++) {
      const next = a + b;
      a = b;
      b = next;
    }
    return b;
  }

  // ───────────────────────────────────────────────────────────────────────────
  // 10. Static Factory Methods
  // ───────────────────────────────────────────────────────────────────────────

  /**
   * Creates a root FractalNode at the Cosmic scale (n = 292).
   *
   * This is the entry point for constructing a full fractal tree.
   */
  static createRoot(scaleMapper?: ScaleMapper): FractalNode {
    const mapper = scaleMapper ?? new ScaleMapper();
    return new FractalNode(292, null, mapper, []);
  }

  /**
   * Creates a FractalNode at a specific canonical scale.
   */
  static createAtScale(
    scale: ScaleIndex,
    parent: FractalNode | null = null,
    scaleMapper?: ScaleMapper,
    pathSegments: readonly number[] = []
  ): FractalNode {
    const mapper = scaleMapper ?? (parent ? parent.scale_mapper : new ScaleMapper());
    return new FractalNode(scale, parent, mapper, pathSegments);
  }

  // ───────────────────────────────────────────────────────────────────────────
  // 11. Memory Engine Integration (Hebbian Learning & Recall)
  // ───────────────────────────────────────────────────────────────────────────

  /**
   * Get active memory engines (Hebbian learning, pattern recall, etc.)
   */
  get memory_engines(): ReadonlyMap<MemoryId, MemoryEngine> {
    return this._memory_engines;
  }

  /**
   * Update all memory engines with the current field state.
   * This is the core learning step — stores the present moment in memory.
   */
  update_memory(): void {
    const currentField = this._state.field_state;
    for (const engine of this._memory_engines.values()) {
      engine.store(currentField);
    }
  }

  /**
   * Recall a pattern from memory using the current field as partial input.
   * Returns the reconstructed pattern from memory.
   */
  recall_memory(): GeometricField {
    const currentField = this._state.field_state;
    // Weighted recall: each memory engine contributes with φ-scaled weights
    const result = new Float64Array(currentField.length);
    let totalWeight = 0;

    const indices: Record<MemoryId, number> = {
      "L1_Pattern": 0,
      "L2_Hebbian": 1,
      "L3_Kuramoto": 2,
      "L4_Sensory": 3,
      "L4+_WeightedRAM": 4,
    };

    for (const [memId, engine] of this._memory_engines) {
      const recalled = engine.recall(currentField);
      const weight = Math.pow(PHI_INV, indices[memId] ?? 0) * engine.coherence();
      totalWeight += weight;
      for (let i = 0; i < result.length; i++) {
        result[i] += recalled[i] * weight;
      }
    }

    if (totalWeight > 0) {
      for (let i = 0; i < result.length; i++) {
        result[i] /= totalWeight;
      }
    }

    return result;
  }

  /**
   * Hebbian update: strengthens memory weights based on co-occurrence.
   * This implements the Hebbian learning rule: "neurons that fire together, wire together."
   * In RHUFT: weights are updated by dw_ij = η · coherence · φ^{-|i-j|} · |a_i| · |a_j| · cos(φ · dθ)
   */
  hebbian_update(): void {
    const hebbian = this._memory_engines.get("L2_Hebbian");
    if (!hebbian) return; // Hebbian not active at this scale

    const field = this._state.field_state;
    const coherence = this._state.coherence;
    const eta = PHI_NEG5; // η = φ^{-5} ≈ 0.09017 — learning rate
    const decay = PHI_NEG8; // decay = φ^{-8} ≈ 0.02129 — weight decay

    // Store current field in Hebbian memory (the engine handles weight updates)
    hebbian.store(field);

    // Update coherence-weighted memory state
    const memState = this._memory.get("L2_Hebbian");
    if (memState) {
      const newField = new Float64Array(memState.memory_field.length);
      for (let i = 0; i < newField.length; i++) {
        const dw = eta * coherence * field[i];
        const decayed = memState.memory_field[i] * (1 - decay);
        newField[i] = decayed + dw;
        // Ensure bounded [0, 1]
        newField[i] = Math.max(0, Math.min(1, newField[i]));
      }
      this._memory.set("L2_Hebbian", {
        ...memState,
        memory_field: newField,
      });
    }
  }

  /**
   * Get memory engine index for φ-decay weighting.
   */
  private _getMemoryEngineIndex(memId: MemoryId): number {
    const indices: Record<MemoryId, number> = {
      "L1_Pattern": 0,
      "L2_Hebbian": 1,
      "L3_Kuramoto": 2,
      "L4_Sensory": 3,
      "L4+_WeightedRAM": 4,
    };
    return indices[memId] ?? 0;
  }
}

