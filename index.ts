// ═══════════════════════════════════════════════════════════════════════════════
// v10 Framework Registry
// ═══════════════════════════════════════════════════════════════════════════════
// Central registry for all 12 frameworks. This module imports and registers
// each framework, providing a single entry point for framework access.
// ═══════════════════════════════════════════════════════════════════════════════

import type { ScaleFramework, FrameworkRegistry } from "./types";
import type { GeometricField, ScaleIndex } from "../../core/types";

// Framework imports
import { F1_SubPlanckian } from "./f1_subplanckian";
import { F2_Septenary } from "./f2_septenary";
import { F3_Quantum } from "./f3_quantum";
import { F4_Geometric } from "./f4_geometric";
import { F5_ColorMusic } from "./f5_colormusic";
import { F6_Hebrew } from "./f6_hebrew";
import { F7_Thermodynamic } from "./f7_thermodynamic";
import { F8_Galactic } from "./f8_galactic";
import { F9_HyperGalactic } from "./f9_hypergalactic";
import { F10_Molecular } from "./f10_molecular";
import { F11_Biological } from "./f11_biological";
import { F12_Thermodynamic } from "./f12_thermodynamic";

// ═══════════════════════════════════════════════════════════════════════════════
// 1. Framework Registry Singleton
// ═══════════════════════════════════════════════════════════════════════════════

let _registry: FrameworkRegistry | null = null;

/**
 * Get the framework registry.
 * [REGISTRY] — Returns a Map of framework ID → framework instance.
 */
export function getFrameworkRegistry(): FrameworkRegistry {
  if (_registry === null) {
    _registry = createFrameworkRegistry();
  }
  return _registry;
}

/**
 * Create the framework registry with all 12 frameworks.
 * [FACTORY] — Instantiates each framework and registers it.
 */
function createFrameworkRegistry(): FrameworkRegistry {
  const registry = new Map<string, ScaleFramework>();
  
  // Register all 12 frameworks
  const frameworks: ScaleFramework[] = [
    new F1_SubPlanckian(),
    new F2_Septenary(),
    new F3_Quantum(),
    new F4_Geometric(),
    new F5_ColorMusic(),
    new F6_Hebrew(),
    new F7_Thermodynamic(),
    new F8_Galactic(),
    new F9_HyperGalactic(),
    new F10_Molecular(),
    new F11_Biological(),
    new F12_Thermodynamic(),
  ];
  
  for (const fw of frameworks) {
    registry.set(fw.id, fw);
  }
  
  return registry;
}

/**
 * Reset the framework registry (for testing).
 */
export function resetFrameworkRegistry(): void {
  _registry = null;
}

// ═══════════════════════════════════════════════════════════════════════════════
// 2. Framework Access Helpers
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Get a framework by ID.
 * [ACCESS] — Throws if framework not found.
 */
export function getFramework(id: string): ScaleFramework {
  const registry = getFrameworkRegistry();
  const fw = registry.get(id);
  if (!fw) {
    throw new Error(`Framework not found: ${id}`);
  }
  return fw;
}

/**
 * Get all frameworks active at a given scale.
 * [ACTIVE] — Returns frameworks where qrf(n) > qrf_fw.
 */
export function getActiveFrameworks(
  scale: ScaleIndex,
  field: GeometricField
): ScaleFramework[] {
  const registry = getFrameworkRegistry();
  const active: ScaleFramework[] = [];
  for (const fw of registry.values()) {
    if (fw.isActiveAtScale(scale, field)) {
      active.push(fw);
    }
  }
  return active;
}
