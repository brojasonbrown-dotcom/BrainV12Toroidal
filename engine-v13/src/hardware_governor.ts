/**
 * RHUFT v6.0 — Fractal Node Engine: Hardware Governor (35% Adaptive Scaling)
 *
 * Epistemic Status: [SPEC] + [PHIL] — Mathematical ontology, not predictive physics.
 *
 * Detects hardware capabilities and enforces a deterministic resource budget
 * calibrated to ~35% of available system capacity. The governor scales the
 * fractal tree depth up or down to maintain the target usage, preventing
 * runaway memory growth and ensuring the engine remains responsive on all
 * hardware profiles. [SPEC]
 *
 * Critical Constraints:
 *   - TypeScript strict mode compliant (no `any`, explicit types everywhere).
 *   - IEEE-754 Float64 (≈15 significant digits) — explicitly noted in comments.
 *   - No random seeds — fully deterministic by construction.
 *   - φ-scale-proportional parameters throughout.
 *   - Scale-invariant by construction.
 */

import type {
  Float64,
  HardwareSpecs,
  ResourceBudget,
  ScalingDecision,
} from "./types.ts";

import { PHI, PHI_INV } from "./core/constants.ts";

// ═══════════════════════════════════════════════════════════════════════════════
// 1. Constants
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Default total RAM assumption (8 GB) when platform detection is unavailable.
 * [SPEC] — Deterministic fallback; not a runtime probe.
 */
const DEFAULT_TOTAL_RAM_BYTES: number = 8 * 1024 * 1024 * 1024;

/**
 * Default CPU core count when platform detection is unavailable.
 * [SPEC] — Deterministic fallback.
 */
const DEFAULT_CPU_CORES: number = 4;

/**
 * Estimated memory footprint per FractalNode (64 KB).
 * Derived from φ-scaled field allocation: 2·(N+1)·8 bytes ≈ 224 bytes per field,
 * plus overhead → ~64 KB conservative estimate. [SPEC]
 */
const BYTES_PER_NODE: number = 1024 * 64;

// ═══════════════════════════════════════════════════════════════════════════════
// 2. HardwareGovernor Class
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Hardware-adaptive resource governor.
 *
 * Maintains a target resource usage of ~35% (φ⁻² ≈ 0.382, rounded to 0.35).
 * The budget is derived deterministically from conservative hardware estimates.
 * Scaling decisions are binary: grow, shrink, or maintain based on measured
 * usage versus the target threshold. [SPEC]
 */
export class HardwareGovernor {
  /**
   * Target resource usage ratio.
   * [SPEC] — 0.35 = 35%, aligned with the RHUFT φ-scale heuristic.
   */
  readonly target_usage: Float64 = 0.35 as Float64;

  /** Detected hardware specifications. [SPEC] */
  private _specs: HardwareSpecs;

  /** Computed resource budget. [SPEC] */
  private _budget: ResourceBudget;

  constructor() {
    this._specs = this._detect_hardware();
    this._budget = this._compute_budget();
  }

  // ───────────────────────────────────────────────────────────────────────────
  // 3. Hardware Detection
  // ───────────────────────────────────────────────────────────────────────────

  /**
   * Detect hardware with deterministic fallbacks.
   *
   * [SPEC] — Uses platform globals only when available; never throws. Falls back
   * to conservative defaults to ensure cross-platform determinism.
   *
   * @returns HardwareSpecs record.
   */
  private _detect_hardware(): HardwareSpecs {
    let totalRam: number = DEFAULT_TOTAL_RAM_BYTES;
    let cpuCores: number = DEFAULT_CPU_CORES;

    // Attempt Node.js runtime detection (safe typeof check). [SPEC]
    if (typeof process !== "undefined" && process.memoryUsage) {
      try {
        const mem = process.memoryUsage();
        totalRam = Math.max(mem.heapTotal, DEFAULT_TOTAL_RAM_BYTES);
      } catch {
        // Fallback to default on any exception. [SPEC]
      }
    }

    // Attempt browser runtime detection (safe typeof check). [SPEC]
    if (typeof navigator !== "undefined" && navigator.hardwareConcurrency) {
      cpuCores = navigator.hardwareConcurrency;
    }

    const availableRam = Math.floor(totalRam * this.target_usage);

    return {
      total_ram_bytes: totalRam,
      cpu_cores: cpuCores,
      cpu_max_frequency_hz: 3.0e9 as Float64, // 3 GHz conservative estimate. [SPEC]
      available_ram_bytes: availableRam,
    };
  }

  /**
   * Compute the resource budget from detected hardware.
   *
   * [SPEC] — Budget caps max_nodes and max_depth based on RAM. The tree depth is
   * bounded by φ-scaled Fibonacci growth: total nodes grow exponentially with depth,
 * so depth is clamped to prevent overflow.
   *
   * @returns ResourceBudget record.
   */
  private _compute_budget(): ResourceBudget {
    const maxNodes = Math.floor(
      (this._specs.available_ram_bytes / BYTES_PER_NODE) * this.target_usage
    );

    // Depth cap: solve 2^(depth+1) - 1 ≈ maxNodes → depth ≈ log2(maxNodes+1) - 1.
    // Clamp to [1, 7] for safety. [SPEC]
    const rawDepth = Math.floor(Math.log2(maxNodes + 1)) - 1;
    const maxDepth = Math.max(1, Math.min(7, rawDepth));

    return {
      max_ram_bytes: this._specs.total_ram_bytes,
      max_cpu_percent: 100 as Float64,
      target_ram_bytes: this._specs.available_ram_bytes,
      target_cpu_percent: (this.target_usage * 100) as Float64,
      max_nodes: Math.max(maxNodes, 1),
      max_depth: maxDepth,
    };
  }

  // ───────────────────────────────────────────────────────────────────────────
  // 4. Public API: Budget & Usage
  // ───────────────────────────────────────────────────────────────────────────

  /**
   * Re-detect hardware and recompute budget (e.g., after external memory pressure).
   *
   * @returns Updated ResourceBudget.
   */
  detect_hardware(): ResourceBudget {
    this._specs = this._detect_hardware();
    this._budget = this._compute_budget();
    return this._budget;
  }

  /**
   * Return the current resource budget without re-detection.
   *
   * @returns Current ResourceBudget.
   */
  compute_budget(): ResourceBudget {
    return this._budget;
  }

  /**
   * Estimate current resource usage from total node count.
   *
   * [SPEC] — Linear RAM estimate: nodes × BYTES_PER_NODE. CPU percent is modeled
   * as proportional to RAM usage ratio for simplicity (single-threaded assumption).
   *
   * @param total_nodes — Total number of FractalNodes in the tree.
   * @returns Object with ram_bytes and cpu_percent.
   */
  estimate_usage(total_nodes: number): { ram_bytes: number; cpu_percent: Float64 } {
    const ramBytes = total_nodes * BYTES_PER_NODE;

    // [FIX] CPU is estimated independently from RAM (was previously computing
    // RAM% and calling it CPU%). Each FractalNode requires ~5e5 CPU cycles
    // per tick (field computation, membrane stabilization, framework
    // propagation, resonance sweep). [SPEC]
    const OPS_PER_NODE = 500000;
    const cpuCycles = total_nodes * OPS_PER_NODE;
    const cpuCapacity = this._specs.cpu_cores * this._specs.cpu_max_frequency_hz;
    const cpuPercent = cpuCapacity > 0 ? (cpuCycles / cpuCapacity) * 100 : 0;
    const clampedCpu = Math.min(Math.max(cpuPercent, 0), 100) as Float64;
    return {
      ram_bytes: ramBytes,
      cpu_percent: clampedCpu,
    };
  }

  // ───────────────────────────────────────────────────────────────────────────
  // 5. Public API: Scaling Decisions
  // ───────────────────────────────────────────────────────────────────────────

  /**
   * Decide whether to grow, shrink, or maintain the fractal tree depth.
   *
   * [SPEC] — Decision thresholds:
   *   - Shrink: RAM or CPU exceeds target (ratio > 1.0).
   *   - Grow: Both RAM and CPU are below 50% of target (ratio < 0.5).
   *   - Maintain: All other cases.
   *
   * @param current_usage — Current usage estimate from estimate_usage().
   * @param budget — ResourceBudget to compare against.
   * @returns ScalingDecision record, or null if no action is needed.
   */
  should_scale(
    current_usage: { ram_bytes: number; cpu_percent: Float64 },
    budget: ResourceBudget
  ): ScalingDecision | null {
    const ramRatio = current_usage.ram_bytes / budget.target_ram_bytes;
    const cpuRatio = current_usage.cpu_percent / budget.target_cpu_percent;

    if (ramRatio > 1.0 || cpuRatio > 1.0) {
      return {
        action: "shrink",
        target_depth: Math.max(budget.max_depth - 1, 1),
        reason: `Resource usage exceeded 35% target threshold (RAM ratio=${ramRatio.toFixed(3)}, CPU ratio=${cpuRatio.toFixed(3)})`,
        ram_bytes: current_usage.ram_bytes,
        cpu_percent: current_usage.cpu_percent,
      };
    }

    if (ramRatio < 0.5 && cpuRatio < 0.5) {
      return {
        action: "grow",
        target_depth: Math.min(budget.max_depth + 1, 7),
        reason: `Resource usage well below 35% target threshold (RAM ratio=${ramRatio.toFixed(3)}, CPU ratio=${cpuRatio.toFixed(3)})`,
        ram_bytes: current_usage.ram_bytes,
        cpu_percent: current_usage.cpu_percent,
      };
    }

    return {
      action: "maintain",
      target_depth: budget.max_depth,
      reason: `Resource usage within 35% target threshold (RAM ratio=${ramRatio.toFixed(3)}, CPU ratio=${cpuRatio.toFixed(3)})`,
      ram_bytes: current_usage.ram_bytes,
      cpu_percent: current_usage.cpu_percent,
    };
  }

  // ───────────────────────────────────────────────────────────────────────────
  // 6. Accessors
  // ───────────────────────────────────────────────────────────────────────────

  /** Detected hardware specifications (read-only). */
  get specs(): Readonly<HardwareSpecs> {
    return this._specs;
  }

  /** Current resource budget (read-only). */
  get budget(): Readonly<ResourceBudget> {
    return this._budget;
  }
}
