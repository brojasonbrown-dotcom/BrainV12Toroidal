/**
 * RHUFT v6.0 — Fractal Node Engine: Interdimensional Flow (Toroidal Information Flow)
 *
 * Epistemic Status: [SPEC] + [PHIL] — Mathematical ontology, not predictive physics.
 *
 * Implements the toroidal interdimensional information flow system that propagates
 * geometric field packets between scales: upward (child → parent), downward
 * (parent → child), and horizontal (sibling ↔ sibling). The flow topology follows
 * the toroidal closure structure of the RHUFT membrane — information circulates
 * through the poloidal and toroidal channels without leakage, analogous to a
 * superconducting current loop. [PHIL]
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
  FlowPacket,
  ScaleIndex,
  PropagationPacket,
  ToroidalFlowChannel,
} from "./types.ts";

import { PHI, PHI_INV, COHERENCE_THRESHOLD } from "./core/constants.ts";

// ───────────────────────────────────────────────────────────────────────────────
// 1. InterdimensionalFlow Class
// ───────────────────────────────────────────────────────────────────────────────

/**
 * Toroidal interdimensional information flow manager.
 *
 * Routes FlowPackets through poloidal (up/down) and toroidal (horizontal)
 * channels. Each channel accumulates coherence-weighted packets, forming a
 * cumulative resonance field that couples adjacent scales. [SPEC] + [PHIL]
 *
 * The flow is deterministic: packet routing depends only on the source/target
 * scale pair and the directional resonance strength encoded in the packet.
 */
export class InterdimensionalFlow {
  /** Active flow channels indexed by "{source}->{target}:{direction}". [SPEC] */
  private readonly _channels: Map<string, FlowPacket[]>;

  /** Monotonically increasing deterministic iteration counter. [SPEC] */
  private _iteration: number;

  constructor() {
    this._channels = new Map();
    this._iteration = 0;
  }

  // ───────────────────────────────────────────────────────────────────────────
  // 2. Packet Processing
  // ───────────────────────────────────────────────────────────────────────────

  /**
   * Process a single FlowPacket into the appropriate toroidal channel.
   *
   * Packets are indexed by a deterministic channel key derived from source scale,
   * target scale, and direction. [SPEC]
   *
   * @param packet — FlowPacket to route.
   */
  process_packet(packet: FlowPacket): void {
    const key = this._channelKey(packet.source_scale, packet.target_scale, packet.direction);
    const existing = this._channels.get(key);
    if (existing) {
      existing.push(packet);
    } else {
      this._channels.set(key, [packet]);
    }
  }

  /**
   * Process multiple FlowPackets in batch order.
   *
   * @param packets — Array of FlowPackets to route.
   */
  process_packets(packets: readonly FlowPacket[]): void {
    for (const packet of packets) {
      this.process_packet(packet);
    }
  }

  /**
   * Convert a PropagationPacket (from FractalNode) into a canonical FlowPacket.
   *
   * [SPEC] — The conversion is a deterministic 1-to-1 mapping; no information is
   * added or removed. The iteration counter stamps the packet for causality ordering.
   *
   * @param packet — PropagationPacket from a FractalNode.
   * @param iteration — Deterministic tick iteration index.
   * @returns Canonical FlowPacket.
   */
  static to_flow_packet(packet: PropagationPacket, iteration: number): FlowPacket {
    return {
      source_scale: packet.source_scale,
      target_scale: packet.target_scale,
      direction: packet.direction,
      field_amplitude: packet.field_amplitude,
      coherence: packet.coherence,
      iteration,
    };
  }

  // ───────────────────────────────────────────────────────────────────────────
  // 3. Channel Retrieval
  // ───────────────────────────────────────────────────────────────────────────

  /**
   * Retrieve all packets flowing along a specific channel.
   *
   * @param source — Source scale index.
   * @param target — Target scale index.
   * @param direction — Flow direction.
   * @returns Array of FlowPackets on that channel (empty if none).
   */
  get_channel(
    source: ScaleIndex,
    target: ScaleIndex,
    direction: "up" | "down" | "horizontal"
  ): readonly FlowPacket[] {
    const key = this._channelKey(source, target, direction);
    return this._channels.get(key) ?? [];
  }

  /**
   * Retrieve all active channels as ToroidalFlowChannel descriptors.
   *
   * [SPEC] — Cumulative coherence is the φ-weighted sum of individual packet
   * coherences, normalized by channel packet count.
   *
   * @returns Array of ToroidalFlowChannel records.
   */
  get_toroidal_channels(): readonly ToroidalFlowChannel[] {
    const results: ToroidalFlowChannel[] = [];
    for (const [key, packets] of this._channels.entries()) {
      if (packets.length === 0) continue;

      const [sourceStr, targetDir] = key.split("->");
      const [targetStr, direction] = targetDir.split(":");
      const source = Number(sourceStr) as ScaleIndex;
      const target = Number(targetStr) as ScaleIndex;

      let cumCoherence = 0;
      for (const p of packets) {
        cumCoherence += p.coherence * PHI_INV; // φ-weighted attenuation per hop. [SPEC]
      }
      cumCoherence = (cumCoherence / packets.length) as Float64;

      results.push({
        channel_id: key,
        source_scale: source,
        target_scale: target,
        packets: packets.slice(), // copy for immutability. [SPEC]
        cumulative_coherence: cumCoherence,
      });
    }
    return results;
  }

  /**
   * Get all FlowPackets across all channels, flattened.
   *
   * @returns Array of all FlowPackets in the flow system.
   */
  get_flows(): readonly FlowPacket[] {
    const all: FlowPacket[] = [];
    for (const packets of this._channels.values()) {
      all.push(...packets);
    }
    return all;
  }

  // ───────────────────────────────────────────────────────────────────────────
  // 4. Lifecycle
  // ───────────────────────────────────────────────────────────────────────────

  /**
   * Advance the deterministic iteration counter.
   *
   * @returns The new iteration index.
   */
  advance_iteration(): number {
    this._iteration++;
    return this._iteration;
  }

  /**
   * Prune flow packets from channels older than the specified iteration window.
   * Prevents unbounded memory growth across engine ticks. [FIX]
   *
   * @param max_age_iterations — Maximum number of iterations to retain (default: 1).
   */
  prune(max_age_iterations: number = 1): void {
    // [FIX] cutoff = _iteration - max_age + 1 keeps exactly the last N iterations.
    // Previously: cutoff = _iteration - max_age incorrectly kept N+1 iterations.
    const cutoff = this._iteration - max_age_iterations + 1;
    for (const [key, packets] of this._channels.entries()) {
      const filtered = packets.filter((p) => p.iteration >= cutoff);
      if (filtered.length === 0) {
        this._channels.delete(key);
      } else {
        this._channels.set(key, filtered);
      }
    }
  }

  /**
   * Current deterministic iteration index.
   */
  get iteration(): number {
    return this._iteration;
  }

  /**
   * Clear all channels and reset iteration to zero.
   */
  clear(): void {
    this._channels.clear();
    this._iteration = 0;
  }

  // ───────────────────────────────────────────────────────────────────────────
  // 5. Private Helpers
  // ───────────────────────────────────────────────────────────────────────────

  /**
   * Deterministic channel key: "source->target:direction".
   * [SPEC] — Keys are string-encoded scale pairs; no hashing, no randomness.
   */
  private _channelKey(
    source: ScaleIndex,
    target: ScaleIndex,
    direction: "up" | "down" | "horizontal"
  ): string {
    return `${source}->${target}:${direction}`;
  }
}
