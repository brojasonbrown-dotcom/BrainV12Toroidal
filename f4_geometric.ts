// ═══════════════════════════════════════════════════════════════════════════════
// F4 Geometric Framework
// ═══════════════════════════════════════════════════════════════════════════════
// Implements sacred geometry: Platonic solids, Flower of Life, golden spiral,
// Penrose tiling, and recursive lattice structures. The geometric framework
// provides the spatial organization pattern that all other frameworks inherit.
//
// Physics:
// ───────────────────────────────────────────────────────────────────────────────
// 1. Platonic Solids (5 regular polyhedra)
//    Tetrahedron: 4 faces, 4 vertices, 6 edges, dihedral angle ≈ 70.5288°
//    Cube: 6 faces, 8 vertices, 12 edges, dihedral angle = 90°
//    Octahedron: 8 faces, 6 vertices, 12 edges, dihedral angle ≈ 109.471°
//    Dodecahedron: 12 faces, 20 vertices, 30 edges, dihedral angle ≈ 116.565°
//    Icosahedron: 20 faces, 12 vertices, 30 edges, dihedral angle ≈ 138.190°
//    All vertices on unit sphere. Dual pairs: (tetrahedron, tetrahedron),
//    (cube, octahedron), (dodecahedron, icosahedron).
//
// 2. Flower of Life
//    Pattern of 7 overlapping circles: 1 center + 6 surrounding.
//    Each circle has radius R. Centers are at distance R from each other.
//    Intersections create vesica piscis (fish bladder) lens shapes.
//    The pattern contains: Seed of Life (7 circles), Egg of Life (19 circles),
//    Fruit of Life (61 circles), and Metatron's Cube.
//
// 3. Golden Spiral
//    r(θ) = a · φ^(2θ/π) — logarithmic spiral with growth factor φ per half-turn.
//    Approximated by Fibonacci spiral: squares with side lengths F_n,
//    quarter-circle arcs connecting corners.
//
// 4. Penrose Tiling
//    Aperiodic tiling with rhombic tiles (thin and thick) with angles
//    36°/144° (thin) and 72°/108° (thick). The ratio of thick to thin tiles
//    is φ. No translational symmetry, but has 5-fold rotational symmetry
//    at isolated points (deflation symmetry).
//
// 5. Toroidal Trefoil Knot T(2,3)
//    The simplest non-trivial torus knot. Parametric equations:
//    x = (R + r·cos(3φ))·cos(2φ), y = (R + r·cos(3φ))·sin(2φ), z = r·sin(3φ)
//    Has 3 crossings. Trefoil is chiral (left-handed and right-handed forms).
// ═══════════════════════════════════════════════════════════════════════════════

import {
  PHI,
  PHI_INV,
  PLANCK_LENGTH,
  PLANCK_FREQUENCY,
  REDUCED_PLANCK_CONSTANT,
  SPEED_OF_LIGHT,
  COHERENCE_THRESHOLD,
  QRF_CRITICAL_SCALE,
  SQRT2, SQRT3,
} from "../../core/constants";
import type { Float64, ScaleIndex, GeometricField } from "../../core/types";
import type { DipoleMoment, Polarization } from "./types";
import { BaseFramework } from "./base_framework";

// ═══════════════════════════════════════════════════════════════════════════════
// 1. Platonic Solid Geometry
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Vertex coordinates for the 5 Platonic solids inscribed in unit sphere.
 * [GEOM] — All vertices are normalized to unit length.
 */

/** Tetrahedron: 4 vertices (simplex in 3D). */
const TETRAHEDRON_VERTICES: readonly Vector3[] = [
  [1, 1, 1], [1, -1, -1], [-1, 1, -1], [-1, -1, 1],
].map(v => normalizeVector(v)) as unknown as readonly Vector3[];

/** Cube: 8 vertices. */
const CUBE_VERTICES: readonly Vector3[] = [
  [1, 1, 1], [1, 1, -1], [1, -1, 1], [1, -1, -1],
  [-1, 1, 1], [-1, 1, -1], [-1, -1, 1], [-1, -1, -1],
].map(v => normalizeVector(v)) as unknown as readonly Vector3[];

/** Octahedron: 6 vertices (dual of cube). */
const OCTAHEDRON_VERTICES: readonly Vector3[] = [
  [1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1],
] as unknown as readonly Vector3[];

/** Icosahedron: 12 vertices (φ-based coordinates). */
const ICOSAHEDRON_VERTICES: readonly Vector3[] = [
  [0, 1, PHI], [0, 1, -PHI], [0, -1, PHI], [0, -1, -PHI],
  [1, PHI, 0], [1, -PHI, 0], [-1, PHI, 0], [-1, -PHI, 0],
  [PHI, 0, 1], [PHI, 0, -1], [-PHI, 0, 1], [-PHI, 0, -1],
].map(v => normalizeVector(v)) as unknown as readonly Vector3[];

/** Dodecahedron: 20 vertices (reciprocal of icosahedron). */
const DODECAHEDRON_VERTICES: readonly Vector3[] = [
  [1, 1, 1], [1, 1, -1], [1, -1, 1], [1, -1, -1],
  [-1, 1, 1], [-1, 1, -1], [-1, -1, 1], [-1, -1, -1],
  [0, PHI_INV, PHI], [0, PHI_INV, -PHI], [0, -PHI_INV, PHI], [0, -PHI_INV, -PHI],
  [PHI_INV, PHI, 0], [PHI_INV, -PHI, 0], [-PHI_INV, PHI, 0], [-PHI_INV, -PHI, 0],
  [PHI, 0, PHI_INV], [PHI, 0, -PHI_INV], [-PHI, 0, PHI_INV], [-PHI, 0, -PHI_INV],
].map(v => normalizeVector(v)) as unknown as readonly Vector3[];

/** 3D vector type for geometry computation. */
type Vector3 = [number, number, number];

/**
 * Normalize a 3D vector to unit length.
 * [MATH] — v̂ = v / |v| where |v| = √(x² + y² + z²).
 */
function normalizeVector(v: Vector3): Vector3 {
  const len = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
  if (len === 0) return [0, 0, 1];
  return [v[0] / len, v[1] / len, v[2] / len];
}

/**
 * Compute dihedral angle of a Platonic solid.
 * [GEOM] — The angle between two adjacent faces.
 * Formula: cos(θ) = cos(π/p) / sin(π/q) where {p,q} is the Schläfli symbol.
 *   Tetrahedron {3,3}: cos(θ) = 1/3 → θ ≈ 70.53°
 *   Cube {4,3}: cos(θ) = 0 → θ = 90°
 *   Octahedron {3,4}: cos(θ) = -1/3 → θ ≈ 109.47°
 *   Dodecahedron {5,3}: cos(θ) = -√5/5 → θ ≈ 116.57°
 *   Icosahedron {3,5}: cos(θ) = -√5/3 → θ ≈ 138.19°
 */
function dihedralAngle(p: number, q: number): number {
  return Math.acos(Math.cos(Math.PI / p) / Math.sin(Math.PI / q));
}

// ═══════════════════════════════════════════════════════════════════════════════
// 2. Flower of Life
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Generate the 7 circles of the Seed of Life.
 * [GEOM] — 1 center circle + 6 surrounding circles at 60° intervals.
 * Each circle has radius R. Surrounding centers are at distance R from center.
 */
function seedOfLife(radius: number): { centers: Vector3[]; radius: number } {
  const centers: Vector3[] = [[0, 0, 0]]; // Center circle
  for (let k = 0; k < 6; k++) {
    const angle = (2 * Math.PI * k) / 6;
    centers.push([radius * Math.cos(angle), radius * Math.sin(angle), 0]);
  }
  return { centers, radius };
}

/**
 * Compute vesica piscis intersection points of two circles.
 * [GEOM] — Two circles of radius R with centers at distance d.
 * Intersection exists when d < 2R. The lens height is h = √(R² - (d/2)²).
 */
function vesicaPiscis(c1: Vector3, c2: Vector3, R: number): Vector3[] {
  const d = Math.sqrt(
    (c1[0] - c2[0]) ** 2 + (c1[1] - c2[1]) ** 2 + (c1[2] - c2[2]) ** 2
  );
  if (d >= 2 * R || d === 0) return [];
  const h = Math.sqrt(R * R - (d / 2) * (d / 2));
  const midX = (c1[0] + c2[0]) / 2;
  const midY = (c1[1] + c2[1]) / 2;
  const dx = (c2[1] - c1[1]) / d;
  const dy = -(c2[0] - c1[0]) / d;
  return [
    [midX + h * dx, midY + h * dy, 0],
    [midX - h * dx, midY - h * dy, 0],
  ];
}

// ═══════════════════════════════════════════════════════════════════════════════
// 3. Golden Spiral
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Golden spiral in polar coordinates: r(θ) = a · φ^(2θ/π).
 * [GEOM] — Logarithmic spiral with growth factor φ per half-turn (π radians).
 * For a = 1: r(0) = 1, r(π) = φ² ≈ 2.618, r(2π) = φ⁴ ≈ 6.854.
 */
function goldenSpiral(theta: number, a: number = 1): number {
  return a * Math.pow(PHI, (2 * theta) / Math.PI);
}

/**
 * Fibonacci spiral approximation: quarter-circle arcs in Fibonacci squares.
 * [GEOM] — Squares with side lengths F_n = 1, 1, 2, 3, 5, 8, 13, 21...
 * Each quarter-circle has radius F_n and connects to the next square.
 */
function fibonacciSpiralPoint(n: number, t: number): Vector3 {
  const F = [1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89];
  if (n < 0 || n >= F.length) return [0, 0, 0];
  const r = F[n];
  const angle = (Math.PI / 2) * t; // t ∈ [0,1] for quarter circle
  return [r * Math.cos(angle), r * Math.sin(angle), 0];
}

// ═══════════════════════════════════════════════════════════════════════════════
// 4. Penrose Tiling (Rhombic)
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Penrose rhombus tile angles.
 * [GEOM] — Thin rhombus: 36° and 144°. Thick rhombus: 72° and 108°.
 * The ratio of thick to thin tiles in an infinite tiling is φ.
 */
const PENROSE_THIN_ANGLE = (Math.PI / 5) as Float64; // 36°
const PENROSE_THICK_ANGLE = (2 * Math.PI / 5) as Float64; // 72°

/**
 * Generate a Penrose rhombus vertex set.
 * [GEOM] — Rhombus with side length s and acute angle α.
 * Vertices: (0,0), (s,0), (s + s·cos(α), s·sin(α)), (s·cos(α), s·sin(α)).
 */
function penroseRhombus(s: number, alpha: number): Vector3[] {
  return [
    [0, 0, 0],
    [s, 0, 0],
    [s + s * Math.cos(alpha), s * Math.sin(alpha), 0],
    [s * Math.cos(alpha), s * Math.sin(alpha), 0],
  ];
}

// ═══════════════════════════════════════════════════════════════════════════════
// 5. F4 Geometric Framework
// ═══════════════════════════════════════════════════════════════════════════════

export class F4_Geometric extends BaseFramework {
  readonly id = "F4_Geometric";
  readonly name = "Geometric Framework";
  readonly characteristicScale = 13;
  readonly qrfThreshold = 0.9321238246563715 as Float64;
  readonly description =
    "Platonic solids, Flower of Life, golden spiral, Penrose tiling, recursive lattice";

  /**
   * Compute geometric energy density at scale n.
   * [ENERGY] — ρ(n) = ℏ · f_geom(n) / L(n)³ where f_geom is the characteristic
   * geometric frequency. The geometric frequency is derived from the
   * Platonic solid vibrational modes: f = c · φ^(n/2) / L(n).
   */
  override computeEnergyDensity(scale: ScaleIndex): Float64 {
    const qrf = this.qrfAttenuation(scale);
    const L_n = this.scaleLength(scale);
    const f_geom = (SPEED_OF_LIGHT * Math.pow(PHI, scale / 2) / (L_n as number)) as Float64;
    const volume = (L_n * L_n * L_n) as Float64;
    return ((REDUCED_PLANCK_CONSTANT * f_geom / volume) * qrf * qrf) as Float64;
  }

  /**
   * Compute the framework's effect on the field.
   * [COMPUTE] — Modulates the input field using Platonic solid vertex projection
   * and golden spiral phase. The modulation is deterministic:
   *   ψ_mod(i) = ψ_in(i) · [1 + qrf(n) · Σ_v A_v · cos(k·r_v + φ_spiral(i))]
   * where A_v are vertex amplitudes and φ_spiral is the golden spiral phase.
   */
  override compute(scale: ScaleIndex, inputField: GeometricField): GeometricField {
    const qrf = this.qrfAttenuation(scale);
    const L_n = this.scaleLength(scale);

    // Use icosahedron vertices (12 vertices, most complex Platonic solid)
    const vertices = ICOSAHEDRON_VERTICES;

    const output = new Float64Array(inputField.length);
    for (let i = 0; i < inputField.length; i++) {
      // Map index to 3D position within scale cube
      const x = (((i % 4) / 4 - 0.5) * (L_n as number)) as Float64;
      const y = (((Math.floor(i / 4) % 4) / 4 - 0.5) * (L_n as number)) as Float64;
      const z = (((Math.floor(i / 16) % 4) / 4 - 0.5) * (L_n as number)) as Float64;

      // Golden spiral phase at this position
      const r_pos = Math.sqrt((x as number) ** 2 + (y as number) ** 2 + (z as number) ** 2);
      const theta_pos = Math.atan2(y as number, x as number);
      const spiralPhase = goldenSpiral(theta_pos, r_pos);

      // Sum contributions from all 12 icosahedron vertices
      let vertexSum = 0;
      for (let v = 0; v < vertices.length; v++) {
        const vx = vertices[v][0] * (L_n as number) * 0.5;
        const vy = vertices[v][1] * (L_n as number) * 0.5;
        const vz = vertices[v][2] * (L_n as number) * 0.5;
        const dist = Math.sqrt((x as number - vx) ** 2 + (y as number - vy) ** 2 + (z as number - vz) ** 2);
        const amp = Math.pow(PHI_INV, v) * Math.exp(-dist / (L_n as number));
        vertexSum += amp;
      }

      // Modulate with geometric pattern
      const modulation = 1 + qrf * (vertexSum / vertices.length) * Math.cos(spiralPhase);
      output[i] = (inputField[i] * modulation) as Float64;
    }

    return output as unknown as GeometricField;
  }

  /**
   * Get the dipole moment at scale n.
   * [DIPOLE] — Geometric dipole from asymmetric vertex charge distribution.
   * For symmetric solids (all vertices equivalent), the net dipole is zero.
   * For asymmetric charge distributions, a non-zero dipole emerges.
   * We assign alternating charges ±q to vertices to create a dipole.
   */
  override getDipoleMoment(scale: ScaleIndex): DipoleMoment {
    const qrf = this.qrfAttenuation(scale);
    const L_n = this.scaleLength(scale);

    // Use icosahedron with alternating vertex charges
    const vertices = ICOSAHEDRON_VERTICES;
    let dipole_x = 0;
    let dipole_y = 0;
    let dipole_z = 0;

    for (let v = 0; v < vertices.length; v++) {
      const charge = (v % 2 === 0 ? 1 : -1) * 1e-20; // alternating charges
      const vx = vertices[v][0] * (L_n as number) * 0.5;
      const vy = vertices[v][1] * (L_n as number) * 0.5;
      const vz = vertices[v][2] * (L_n as number) * 0.5;
      dipole_x += charge * vx;
      dipole_y += charge * vy;
      dipole_z += charge * vz;
    }

    const magnitude = Math.sqrt(dipole_x ** 2 + dipole_y ** 2 + dipole_z ** 2) * qrf;

    // Normalize direction
    if (magnitude > 1e-30) {
      dipole_x /= magnitude / qrf;
      dipole_y /= magnitude / qrf;
      dipole_z /= magnitude / qrf;
    } else {
      dipole_x = 0; dipole_y = 0; dipole_z = 1;
    }

    return {
      magnitude: magnitude as Float64,
      direction: [dipole_x as Float64, dipole_y as Float64, dipole_z as Float64],
      scale,
    };
  }

  /**
   * Get the polarization at scale n.
   * [POLARIZATION] — Geometric susceptibility tensor from vertex distribution.
   * χ_ij = Σ_v (r_v)_i · (r_v)_j / |r_v|² where r_v are vertex positions.
   * For the icosahedron, this gives an isotropic tensor (all directions equivalent).
   * For lower symmetry solids, it gives anisotropic response.
   */
  override getPolarization(scale: ScaleIndex): Polarization {
    const qrf = this.qrfAttenuation(scale);
    const baseChi = 0.05 as Float64; // dimensionless geometric susceptibility

    // Compute geometric susceptibility from icosahedron vertices
    const vertices = ICOSAHEDRON_VERTICES;
    let chi_xx = 0, chi_yy = 0, chi_zz = 0;
    let chi_xy = 0, chi_xz = 0, chi_yz = 0;

    for (const v of vertices) {
      chi_xx += v[0] * v[0];
      chi_yy += v[1] * v[1];
      chi_zz += v[2] * v[2];
      chi_xy += v[0] * v[1];
      chi_xz += v[0] * v[2];
      chi_yz += v[1] * v[2];
    }

    // Normalize by number of vertices and scale by qrf
    const norm = vertices.length;
    const susceptibility = (baseChi * qrf) as Float64;

    return {
      P_electric: [0 as Float64, 0 as Float64, 0 as Float64],
      P_magnetic: [0 as Float64, 0 as Float64, 0 as Float64],
      susceptibility: [
        (chi_xx / norm * susceptibility) as Float64,
        (chi_xy / norm * susceptibility) as Float64,
        (chi_xz / norm * susceptibility) as Float64,
        (chi_xy / norm * susceptibility) as Float64,
        (chi_yy / norm * susceptibility) as Float64,
        (chi_yz / norm * susceptibility) as Float64,
        (chi_xz / norm * susceptibility) as Float64,
        (chi_yz / norm * susceptibility) as Float64,
        (chi_zz / norm * susceptibility) as Float64,
      ] as unknown as readonly Float64[],
      scale,
    };
  }

  /**
   * Get the Master Equation term at scale n.
   * [MASTER] — Phase encodes the icosahedral symmetry:
   *   θ_k = 2π · (12/20) · (scale/89) · (k/12) = 2π · (3/5) · (scale/89) · (k/12)
   * where 12 vertices, 20 faces, and 3/5 = φ⁻² (approximate).
   */
  override getMasterEquationTerm(scale: ScaleIndex): {
    re: Float64;
    im: Float64;
    weight: Float64;
  } {
    const k = 3; // F4 → index 3 (0-based)
    const weight = Math.pow(PHI_INV, k) as Float64;
    const phase = (2 * Math.PI * (3 / 5) * (scale / QRF_CRITICAL_SCALE) * (k / 12)) as Float64;
    const re = (weight * Math.cos(phase)) as Float64;
    const im = (weight * Math.sin(phase)) as Float64;
    return { re, im, weight };
  }
}

