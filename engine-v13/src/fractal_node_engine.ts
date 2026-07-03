/**
 * RHUFT v6.0 — Fractal Node Engine: Main Engine & Integration
 *
 * Assembles ScaleMapper, FractalNode, MembraneStabilizer, ResonanceFinder,
 * InterdimensionalFlow, and HardwareGovernor into a single operational engine.
 *
 * The engine creates a fractal tree rooted at a target scale (default: 192 = Human)
 * with recursive children at the next lower canonical scales. Each tick computes
 * geometric fields bottom-up, applies membrane stabilization, propagates
 * interdimensional flows, searches for 144,000 Hz resonance convergence, and
 * enforces a 35% hardware-adaptive resource cap.
 *
 * Epistemic Status: [SPEC] + [PHIL] — Mathematical ontology, not predictive physics.
 * All numeric values are IEEE-754 Float64 (≈15 significant digits).
 * Strictly deterministic — no random seeds, no entropy injection.
 * Scale-invariant by construction; all parameters are φ-scale-proportional.
 */

import type {
  Float64,
  ScaleIndex,
  FlowPacket,
  ResonanceConvergence,
  ResourceBudget,
  ScalingDecision,
  EngineConfig,
  EngineState,
  EngineTickResult,
} from "./types.ts";

import { FractalNode } from "./fractal_node.ts";
import { ScaleMapper } from "./scale_mapper.ts";
import { MembraneStabilizer } from "./membrane_stabilizer.ts";
import { ResonanceFinder } from "./resonance_finder.ts";
import { InterdimensionalFlow } from "./interdimensional_flow.ts";
import { HardwareGovernor } from "./hardware_governor.ts";
import { L4_Sensory } from "./frameworks.ts";
import { COHERENCE_THRESHOLD } from "./core/constants.ts";

// ═══════════════════════════════════════════════════════════════════════════════
// 1. FractalNodeEngine Class
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Main operational engine for the RHUFT v6.0 fractal node hierarchy.
 *
 * The engine orchestrates:
 *   - Fractal tree construction (root scale → children at lower scales)
 *   - Bottom-up field computation (Master Equation at each node)
 *   - Membrane stabilization (DNA-like toroidal closure)
 *   - Interdimensional flow propagation (up, down, horizontal)
 *   - 144,000 Hz resonance convergence search
 *   - Hardware-adaptive scaling (~35% resource cap)
 *
 * [SPEC] + [PHIL] — Mathematical ontology; deterministic by construction.
 */
export class FractalNodeEngine {
  /** Engine configuration (immutable after construction). [SPEC] */
  readonly config: EngineConfig;

  /** Shared ScaleMapper instance (used by all nodes). [SPEC] */
  readonly scale_mapper: ScaleMapper;

  /** Membrane stabilizer for DNA-like boundary correction. [SPEC] */
  readonly membrane_stabilizer: MembraneStabilizer;

  /** Resonance finder for 144,000 Hz convergence. [SPEC] */
  readonly resonance_finder: ResonanceFinder;

  /** Toroidal interdimensional flow manager. [SPEC] */
  readonly interdimensional_flow: InterdimensionalFlow;

  /** Hardware governor enforcing ~35% adaptive resource cap. [SPEC] */
  readonly hardware_governor: HardwareGovernor;

  /** Root node of the fractal tree (target scale). [SPEC] */
  private _root_node: FractalNode;

  /** Deterministic tick counter (starts at 0, increments by 1 each tick). [SPEC] */
  private _tick_count: number;

  /** Current engine runtime state. [SPEC] */
  private _state: EngineState;

  /**
   * Constructs a FractalNodeEngine with optional partial configuration.
   *
   * Defaults:
   *   target_scale = 192 (Human)
   *   max_depth = 5
   *   target_frequency = 144 Hz
   *   resonance_target = 144,000 Hz
   *   hardware_adaptive = true
   *   target_resource_usage = 0.35 (35%)
   *
   * [SPEC] — All defaults are φ-scale-proportional or RHUFT canonical values.
   *
   * @param config — Partial EngineConfig overrides.
   */
  constructor(config?: Partial<EngineConfig>) {
    this.config = {
      target_scale: 192,
      max_depth: 5,
      target_frequency: 144,
      resonance_target: 144000,
      hardware_adaptive: true,
      target_resource_usage: 0.35,
      ...config,
    } as EngineConfig;

    this.scale_mapper = new ScaleMapper();
    this.membrane_stabilizer = new MembraneStabilizer();
    this.resonance_finder = new ResonanceFinder();
    this.interdimensional_flow = new InterdimensionalFlow();
    this.hardware_governor = new HardwareGovernor();

    this._root_node = FractalNode.createAtScale(
      this.config.target_scale as ScaleIndex,
      null,
      this.scale_mapper
    );
    this._tick_count = 0;
    this._state = this._createInitialState();
  }

  // ───────────────────────────────────────────────────────────────────────────
  // 2. Initialization
  // ───────────────────────────────────────────────────────────────────────────

  /**
   * Initialize the engine:
   *   1. Detect hardware and compute resource budget.
   *   2. Create root node at target scale.
   *   3. Create child nodes recursively up to max_depth (or hardware cap).
   *   4. Initialize frameworks and memory at each node (FractalNode constructor).
   *   5. Compute initial resonance convergence.
   *
   * [SPEC] — Deterministic and repeatable; no side effects outside the engine.
   *
   * @returns EngineState after initialization.
   */
  initialize(): EngineState {
    // 1. Detect hardware and compute budget
    const budget = this.hardware_governor.detect_hardware();
    const maxDepth = this.config.hardware_adaptive
      ? Math.min(this.config.max_depth, budget.max_depth)
      : this.config.max_depth;

    // 2. Create root node at target scale
    this._root_node = FractalNode.createAtScale(
      this.config.target_scale as ScaleIndex,
      null,
      this.scale_mapper
    );

    // 3. Build fractal tree recursively
    this._buildTree(this._root_node, maxDepth);

    // 4. Frameworks and memory are initialized in FractalNode constructor
    // 5. Compute initial resonance
    const initialResonance = this.resonance_finder.find_resonance(this._root_node);
    const stats = this._root_node.get_tree_stats();

    this._state = {
      tick_count: 0,
      root_node: this._root_node,
      current_resonance: initialResonance,
      global_coherence: this._computeGlobalCoherence(),
      active_nodes: stats.coherent_nodes,
      total_nodes: stats.total_nodes,
      resource_usage: this.hardware_governor.estimate_usage(stats.total_nodes),
      hardware_budget: budget,
      last_scaling_decision: null,
    };

    return this._state;
  }

  /**
   * Build the fractal tree by recursively creating children at the next lower scale.
   *
   * [SPEC] — Tree is built from the target scale DOWNWARD (toward smaller scales).
   * Child count is determined by Fibonacci(depth+1), capped at 13 per node.
   *
   * @param node — Current node to expand.
   * @param maxDepth — Maximum depth from the root.
   */
  private _buildTree(node: FractalNode, maxDepth: number): void {
    if (node.get_depth() >= maxDepth) {
      return;
    }
    node.create_children();
    for (const child of node.children) {
      this._buildTree(child, maxDepth);
    }
  }

  // ───────────────────────────────────────────────────────────────────────────
  // 3. Tick Loop
  // ───────────────────────────────────────────────────────────────────────────

  /**
   * Process one deterministic tick of the engine.
   *
   * Pipeline (in order):
   *   1. Compute field at each node (bottom-up: children first, then parent).
   *   2. Apply membrane stabilization at each node.
   *   3. Propagate information flows (up, down, horizontal).
   *   4. Compute resonance convergences (144,000 Hz target).
   *   5. Check hardware budget and scale tree if necessary.
   *   6. Update global coherence.
   *   7. Return tick result.
   *
   * [SPEC] — All operations are deterministic Float64 (≈15 digits).
   *
   * @returns EngineTickResult for this tick.
   */
  tick(): EngineTickResult {
    this._tick_count++;
    this.interdimensional_flow.advance_iteration();

    // 1. Compute field at each node (bottom-up)
    this._computeBottomUp(this._root_node);

    // 2. Apply membrane stabilization at each node
    this._stabilizeAll(this._root_node);

    // 3. Propagate information flows
    const flowPackets = this._propagateFlows();
    // [FIX] Prune flow channels to prevent unbounded memory growth across ticks.
    this.interdimensional_flow.prune(1);

    // 4. Compute resonance convergences
    const resonance = this.resonance_finder.find_resonance(this._root_node);

    // 5. Check hardware budget and scale if necessary
    const stats = this._root_node.get_tree_stats();
    const resourceUsage = this.hardware_governor.estimate_usage(stats.total_nodes);
    const scalingAction = this.hardware_governor.should_scale(
      resourceUsage,
      this._state.hardware_budget
    );

    if (scalingAction && scalingAction.action !== "maintain") {
      const newDepth = scalingAction.target_depth;
      this._root_node.destroy_children();
      this._buildTree(this._root_node, newDepth);
    }

    // 6. Update global coherence
    const globalCoherence = this._computeGlobalCoherence();

    // 7. Update engine state
    this._state = {
      ...this._state,
      tick_count: this._tick_count,
      current_resonance: resonance,
      global_coherence: globalCoherence,
      active_nodes: stats.coherent_nodes,
      total_nodes: stats.total_nodes,
      resource_usage: resourceUsage,
      last_scaling_decision: scalingAction,
    };

    return {
      tick: this._tick_count,
      coherence: globalCoherence,
      resonance,
      active_nodes: stats.coherent_nodes,
      total_nodes: stats.total_nodes,
      resource_usage: resourceUsage,
      scaling_action: scalingAction,
      flow_packets: flowPackets,
      stabilized: this._isStabilized(),
    };
  }

  /**
   * Compute geometric fields bottom-up: recursively process children, then parent.
   *
   * [SPEC] — Children must be computed before the parent so that the parent's
   * Master Equation can incorporate child-state information if needed.
   *
   * @param node — Current node to compute (and its subtree).
   */
  private _computeBottomUp(node: FractalNode): void {
    for (const child of node.children) {
      this._computeBottomUp(child);
    }
    node.compute();
  }

  /**
   * Apply membrane stabilization bottom-up: children first, then parent.
   *
   * [SPEC] — Stabilization corrects the field toward the toroidal boundary
   * condition using iterative relaxation.
   *
   * @param node — Current node to stabilize (and its subtree).
   */
  private _stabilizeAll(node: FractalNode): void {
    for (const child of node.children) {
      this._stabilizeAll(child);
    }
    node.stabilize();
  }

  /**
   * Propagate information flows across all three directions.
   *
   * [SPEC] — Flow order:
   *   a) Upward: each child sends a packet to its parent (bottom-up).
   *   b) Downward: each parent sends packets to its children (top-down).
   *   c) Horizontal: each node emits a same-scale packet (traversal).
   *
   * All packets are converted to canonical FlowPackets and routed through the
   * InterdimensionalFlow channels.
   *
   * @returns Array of all FlowPackets produced in this tick.
   */
  private _propagateFlows(): readonly FlowPacket[] {
    const packets: FlowPacket[] = [];

    // a) Upward flow (bottom-up)
    this._collectUpFlows(this._root_node, packets);

    // b) Downward flow (top-down)
    this._collectDownFlows(this._root_node, packets);

    // c) Horizontal flow (traversal)
    this._collectHorizontalFlows(this._root_node, packets);

    // Route all packets through the interdimensional flow manager
    this.interdimensional_flow.process_packets(packets);

    return this.interdimensional_flow.get_flows();
  }

  /**
   * Collect upward propagation packets (child → parent).
   *
   * @param node — Subtree root.
   * @param packets — Accumulator array.
   */
  private _collectUpFlows(node: FractalNode, packets: FlowPacket[]): void {
    for (const child of node.children) {
      this._collectUpFlows(child, packets);
      const up = child.propagate_up();
      if (up) {
        packets.push(InterdimensionalFlow.to_flow_packet(up, this._tick_count));
      }
    }
  }

  /**
   * Collect downward propagation packets (parent → children).
   *
   * @param node — Subtree root.
   * @param packets — Accumulator array.
   */
  private _collectDownFlows(node: FractalNode, packets: FlowPacket[]): void {
    const down = node.propagate_down();
    for (const packet of down) {
      packets.push(InterdimensionalFlow.to_flow_packet(packet, this._tick_count));
    }
    for (const child of node.children) {
      this._collectDownFlows(child, packets);
    }
  }

  /**
   * Collect horizontal propagation packets (same-scale).
   *
   * @param node — Subtree root.
   * @param packets — Accumulator array.
   */
  private _collectHorizontalFlows(node: FractalNode, packets: FlowPacket[]): void {
    const h = node.propagate_horizontal();
    if (h) {
      packets.push(InterdimensionalFlow.to_flow_packet(h, this._tick_count));
    }
    for (const child of node.children) {
      this._collectHorizontalFlows(child, packets);
    }
  }

  // ───────────────────────────────────────────────────────────────────────────
  // 4. Global Coherence & Stability
  // ───────────────────────────────────────────────────────────────────────────

  /**
   * Compute the arithmetic mean coherence across all nodes in the tree.
   *
   * [SPEC] — Global coherence is the average of per-node coherence C(n).
   * All values are IEEE-754 Float64 (≈15 digits).
   *
   * @returns Global coherence in [0, 1].
   */
  private _computeGlobalCoherence(): Float64 {
    let sum = 0;
    let count = 0;
    const visit = (n: FractalNode): void => {
      sum += n.state.coherence;
      count++;
      for (const child of n.children) {
        visit(child);
      }
    };
    visit(this._root_node);
    return count > 0 ? (sum / count) as Float64 : 0 as Float64;
  }

  /**
   * Determine if the engine is globally stabilized.
   *
   * [SPEC] — Stabilized iff global coherence exceeds the λ = 1/φ² threshold.
   *
   * @returns True if stabilized.
   */
  private _isStabilized(): boolean {
    return this._computeGlobalCoherence() > COHERENCE_THRESHOLD;
  }

  // ───────────────────────────────────────────────────────────────────────────
  // 5. Data Processing
  // ───────────────────────────────────────────────────────────────────────────

  /**
   * Process input data through the engine.
   *
   * Pipeline:
   *   1. Inject data into the root node's sensory memory (L4_Sensory framework).
   *   2. Merge processed sensory field into the root node's geometric field state.
   *   3. Run tick() to propagate the injected data through the fractal hierarchy.
   *   4. Return the processed tick result.
   *
   * [SPEC] — Data injection is deterministic: the sensory framework applies
   * exponential decay weighting, then the field is additively merged.
   *
   * @param data — Input Float64Array (sensory pattern).
   * @returns EngineTickResult after processing.
   */
  process(data: Float64Array): EngineTickResult {
    // [FIX] Guard against invalid input data to prevent downstream NaN propagation.
    if (!data || data.length === 0) {
      throw new Error(
        `FractalNodeEngine.process: input data must be a non-empty Float64Array. ` +
          `Received: ${data?.length ?? "null/undefined"}`
      );
    }

    // 1. Inject data into root node's sensory memory via L4_Sensory
    const sensory = new L4_Sensory();
    sensory.store(data);
    const processed = sensory.recall(data);

    // 2. Merge processed sensory data into the root node's field state
    const rootField = this._root_node.state.field_state;
    const minLen = Math.min(rootField.length, processed.length);
    for (let i = 0; i < minLen; i++) {
      rootField[i] = (rootField[i] + processed[i]) as Float64;
    }

    // 3. Run tick and return result
    return this.tick();
  }

  // ───────────────────────────────────────────────────────────────────────────
  // 6. Resonance Search
  // ───────────────────────────────────────────────────────────────────────────

  /**
   * Find the absolute stable point resonance across all nodes.
   *
   * Searches for the frequency that maximizes:
   *   - coherence across all scales
   *   - harmonic alignment with physical scale frequencies
   *   - perfect toroidal closure (minimum membrane energy)
   *   - minimized closure deviation
   *
   * [SPEC] + [PHIL] — The absolute stable point is the "DNA-like" stable
   * position where the field finds its most complex and stable resonance.
   *
   * @returns ResonanceConvergence at the absolute stable point.
   */
  find_stable_point(): ResonanceConvergence {
    return this.resonance_finder.find_absolute_stable_point(this._root_node);
  }

  // ───────────────────────────────────────────────────────────────────────────
  // 7. State & Lifecycle
  // ───────────────────────────────────────────────────────────────────────────

  /**
   * Get the current engine runtime state.
   *
   * @returns Readonly EngineState snapshot.
   */
  get_state(): EngineState {
    return this._state;
  }

  /**
   * Reset the engine to its initial state.
   *
   * Re-initializes the tree, clears flow channels, resets tick count, and
   * re-detects hardware. Equivalent to constructing a new engine with the
   * same configuration.
   *
   * [SPEC] — Deterministic reset; no memory leaks from prior ticks.
   */
  reset(): void {
    this._tick_count = 0;
    this.interdimensional_flow.clear();
    this._state = this._createInitialState();
    this.initialize();
  }

  /**
   * Shutdown the engine and release all resources.
   *
   * Destroys the fractal tree, clears flow channels, and resets counters.
   * After shutdown, the engine must be re-initialized before use.
   *
   * [SPEC] — Explicit cleanup to assist GC in memory-constrained environments.
   */
  shutdown(): void {
    this._root_node.destroy_children();
    this.interdimensional_flow.clear();
    this._tick_count = 0;
    this._state = this._createInitialState();
  }

  /**
   * Human-readable string representation.
   *
   * @returns Summary string with scale, depth, node count, tick, and coherence.
   */
  toString(): string {
    const stats = this._root_node.get_tree_stats();
    return (
      `FractalNodeEngine(` +
      `scale=${this.config.target_scale}, ` +
      `depth=${stats.max_depth}, ` +
      `nodes=${stats.total_nodes}, ` +
      `tick=${this._tick_count}, ` +
      `coherence=${this._state.global_coherence.toFixed(6)})`
    );
  }

  // ───────────────────────────────────────────────────────────────────────────
  // 8. Private Helpers
  // ───────────────────────────────────────────────────────────────────────────

  /**
   * Create the initial EngineState before any initialization or ticks.
   *
   * @returns Default EngineState with zeroed fields.
   */
  private _createInitialState(): EngineState {
    return {
      tick_count: 0,
      root_node: this._root_node,
      current_resonance: null,
      global_coherence: 0 as Float64,
      active_nodes: 1,
      total_nodes: 1,
      resource_usage: { ram_bytes: 0, cpu_percent: 0 as Float64 },
      hardware_budget: this.hardware_governor.compute_budget(),
      last_scaling_decision: null,
    };
  }
}
