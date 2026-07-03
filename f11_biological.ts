// ═══════════════════════════════════════════════════════════════════════════════
// F11 Biological Framework
// ═══════════════════════════════════════════════════════════════════════════════
// Implements biological-scale physics: cell membranes, ion channels, protein
// folding, ATP hydrolysis, neural action potentials, and genetic coding.
// The biological framework bridges molecular and human scales.
//
// Physics:
// ───────────────────────────────────────────────────────────────────────────────
// 1. Cell Membrane
//    Lipid bilayer: thickness ≈ 5 nm, capacitance C_m ≈ 1 μF/cm².
//    Resting potential: V_rest ≈ -70 mV (Na⁺/K⁺ ATPase pump).
//    Nernst equation: E_ion = (RT/zF) · ln([out]/[in]).
//    For K⁺: E_K ≈ -90 mV. For Na⁺: E_Na ≈ +60 mV.
//    Goldman-Hodgkin-Katz: V_m = (RT/F) · ln((P_K[K⁺]_out + P_Na[Na⁺]_out + P_Cl[Cl⁻]_in) / (...)).
//
// 2. Ion Channels
//    Voltage-gated: open/close based on membrane potential.
//    Ligand-gated: open/close based on neurotransmitter binding.
//    Mechanically-gated: respond to stretch/pressure.
//    Single-channel conductance: γ ≈ 10-50 pS.
//    Current: I = γ · (V_m - E_ion).
//
// 3. Action Potentials (Hodgkin-Huxley Model)
//    dV/dt = (I - I_Na - I_K - I_L) / C_m.
//    I_Na = g_Na · m³h · (V - E_Na), I_K = g_K · n⁴ · (V - E_K).
//    Threshold: ≈ -55 mV. Peak: ≈ +30 mV. Duration: ≈ 1-2 ms.
//    Propagation speed: ≈ 1-100 m/s (depends on myelination).
//
// 4. Protein Folding
//    ΔG = ΔH - TΔS < 0 for spontaneous folding.
//    Levinthal's paradox: 10^100 conformations, yet folding takes ms.
//    Solution: folding funnel, not random search.
//    Native state = minimum of free energy landscape.
//    α-helices: H-bonds between i and i+4 residues.
//    β-sheets: H-bonds between adjacent strands.
//
// 5. ATP Hydrolysis
//    ATP → ADP + P_i + energy. ΔG° ≈ -30.5 kJ/mol under standard conditions.
//    In cell: ΔG ≈ -50 to -60 kJ/mol (concentration-dependent).
//    ATP synthase: rotary mechanism, F0F1 complex.
//    Proton gradient drives rotation: ≈ 3 H⁺ / ATP.
//
// 6. Genetic Code
//    DNA: 4 bases (A, T, G, C). RNA: 4 bases (A, U, G, C).
//    Codon: 3 bases → 64 codons → 20 amino acids + stop.
//    Redundancy: degenerate code (multiple codons per amino acid).
//    Start: AUG (Met). Stop: UAA, UAG, UGA.
//    Chargaff's rules: A=T, G=C (Watson-Crick pairing).
//
// 7. Toroidal Cell Membrane
//    The cell membrane is topologically a sphere (S²), but locally toroidal.
//    Membrane invaginations (caveolae, vesicles) create toroidal topology.
//    Major radius R = cell radius ≈ 5-20 μm.
//    Minor radius r = membrane thickness ≈ 5 nm.
//    Aspect ratio R/r ≈ 10⁶ >> φ (not crystalline, but active transport maintains order).
// ═══════════════════════════════════════════════════════════════════════════════

import {
  PHI, PHI_INV,
  PLANCK_LENGTH, PLANCK_FREQUENCY, REDUCED_PLANCK_CONSTANT,
  BOLTZMANN_CONSTANT, ELEMENTARY_CHARGE,
  COHERENCE_THRESHOLD, QRF_CRITICAL_SCALE,
} from "../../core/constants";
import type { Float64, ScaleIndex, GeometricField } from "../../core/types";
import type { DipoleMoment, Polarization } from "./types";
import { BaseFramework } from "./base_framework";

// ═══════════════════════════════════════════════════════════════════════════════
// 1. Biological Constants
// ═══════════════════════════════════════════════════════════════════════════════

/** Cell membrane capacitance (F/m²). */
const MEMBRANE_CAPACITANCE: Float64 = 1.0e-2 as Float64; // 1 μF/cm² = 0.01 F/m²

/** Resting membrane potential (V). */
const RESTING_POTENTIAL: Float64 = -0.070 as Float64; // -70 mV

/** Action potential threshold (V). */
const THRESHOLD_POTENTIAL: Float64 = -0.055 as Float64; // -55 mV

/** Action potential peak (V). */
const PEAK_POTENTIAL: Float64 = 0.030 as Float64; // +30 mV

/** Sodium equilibrium potential (V). */
const E_NA: Float64 = 0.060 as Float64; // +60 mV

/** Potassium equilibrium potential (V). */
const E_K: Float64 = -0.090 as Float64; // -90 mV

/** Typical cell radius (m). */
const CELL_RADIUS: Float64 = 10.0e-6 as Float64; // 10 μm

/** ATP hydrolysis energy (J). */
const ATP_ENERGY: Float64 = 5.0e-20 as Float64; // ≈ 50 kJ/mol per molecule

// ═══════════════════════════════════════════════════════════════════════════════
// 2. Biological Physics Computations
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Compute Nernst potential for an ion.
 * [ELECTRO] — E = (RT/zF) · ln([out]/[in]).
 */
function nernstPotential(z: number, c_out: Float64, c_in: Float64, T: Float64 = 310 as Float64): Float64 {
  const ratio = (c_out as number) / (c_in as number);
  return ((BOLTZMANN_CONSTANT as number) * (T as number) / (z * (ELEMENTARY_CHARGE as number)) * Math.log(ratio)) as Float64;
}

/**
 * Compute Hodgkin-Huxley gating variable (steady-state).
 * [HH] — x_∞ = α_x / (α_x + β_x) where x = m, h, n.
 */
function gatingSteadyState(alpha: Float64, beta: Float64): Float64 {
  return ((alpha as number) / ((alpha as number) + (beta as number))) as Float64;
}

/**
 * Compute action potential waveform (simplified)..
 * [NEURO] — V(t) = V_rest + (V_peak - V_rest) · exp(-(t-t0)²/2σ²) · H(t-t0).
 * where H is the Heaviside step function and σ ≈ 0.5 ms.
 */
function actionPotential(t: number, t0: number = 0): Float64 {
  if (t < t0) return RESTING_POTENTIAL;
  const sigma = 0.0005; // 0.5 ms
  const peak = (PEAK_POTENTIAL as number) - (RESTING_POTENTIAL as number);
  const V = (RESTING_POTENTIAL as number) + peak * Math.exp(-((t - t0) ** 2) / (2 * sigma * sigma));
  return V as Float64;
}

/**
 * Compute protein folding free energy.
 * [THERMO] — ΔG = ΔH - TΔS.
 * For spontaneous folding: ΔG < 0.
 * ΔH ≈ -200 kJ/mol (enthalpy from H-bonds, van der Waals).
 * ΔS ≈ -600 J/(mol·K) (entropy loss from ordering).
 * At T = 310 K: ΔG ≈ -200 - 310·(-0.6) ≈ -14 kJ/mol < 0.
 */
function proteinFoldingEnergy(T: Float64): Float64 {
  const deltaH = -200e3; // J/mol
  const deltaS = -600; // J/(mol·K)
  const deltaG = deltaH - (T as number) * deltaS;
  return deltaG as Float64;
}

/**
 * Compute ATP synthesis rate (simplified).
 * [BIO] — Rate = k_cat · [ATP_synthase] · [H⁺]³ / (K_m + [H⁺]³).
 */
function atpSynthesisRate(h_concentration: Float64, enzyme_concentration: Float64): Float64 {
  const k_cat = 100; // s⁻¹
  const K_m = 1e-7; // M
  const h3 = (h_concentration as number) ** 3;
  const rate = k_cat * (enzyme_concentration as number) * h3 / (K_m + h3);
  return rate as Float64;
}

// ═══════════════════════════════════════════════════════════════════════════════
// 3. F11 Biological Framework
// ═══════════════════════════════════════════════════════════════════════════════

export class F11_Biological extends BaseFramework {
  readonly id = "F11_Biological";
  readonly name = "Biological Framework";
  readonly characteristicScale = 168;
  readonly qrfThreshold = 0.4031869593094707 as Float64;
  readonly description =
    "Cell membranes, ion channels, protein folding, ATP hydrolysis, action potentials";

  /**
   * Compute energy density at scale n.
   * [ENERGY] — ρ(n) = (membrane energy + ATP energy + protein energy) / cell_volume · qrf(n)².
   */
  override computeEnergyDensity(scale: ScaleIndex): Float64 {
    const qrf = this.qrfAttenuation(scale);
    const r = CELL_RADIUS as number;
    const cell_volume = (4 / 3) * Math.PI * r * r * r;

    // Membrane energy: C_m · V² / 2 per unit area
    const membrane_area = 4 * Math.PI * r * r;
    const membrane_energy = (MEMBRANE_CAPACITANCE as number) * (RESTING_POTENTIAL as number) ** 2 * membrane_area / 2;

    // ATP energy (assuming 10⁷ ATP molecules per cell)
    const atp_energy = (ATP_ENERGY as number) * 1e7;

    // Protein folding energy (assuming 10⁶ proteins)
    const protein_energy = (proteinFoldingEnergy(310 as Float64) as number) * 1e6;

    return ((membrane_energy + atp_energy + protein_energy) / cell_volume * qrf * qrf) as Float64;
  }

  /**
   * Compute the framework's effect on the field.
   * [COMPUTE] — Modulates the input field using action potential waveforms
   * and ion channel gating. The field is "neuralized" by Hodgkin-Huxley dynamics:
   *   ψ_mod(i) = ψ_in(i) · [1 + qrf(n) · (V_AP(i) - V_rest) / V_peak · g_ion(i)]
   * where V_AP is the action potential and g_ion is the ion channel conductance.
   */
  override compute(scale: ScaleIndex, inputField: GeometricField): GeometricField {
    const qrf = this.qrfAttenuation(scale);

    const output = new Float64Array(inputField.length);
    for (let i = 0; i < inputField.length; i++) {
      // Action potential waveform (deterministic, periodic)
      const t = (i / inputField.length) * 0.01; // 10 ms window
      const t0 = 0.002; // 2 ms delay
      const V_ap = actionPotential(t, t0) as number;

      // Ion channel gating (simplified: Na⁺ activation + K⁺ activation)
      const m_na = 1 / (1 + Math.exp(-100 * (V_ap - (THRESHOLD_POTENTIAL as number)))); // Na⁺ activation
      const n_k = 1 / (1 + Math.exp(-50 * (V_ap - (E_K as number)))); // K⁺ activation
      const g_ion = m_na * m_na * m_na * (1 - n_k); // Na⁺ conductance dominates early

      // Neural modulation
      const modulation = 1 + qrf * ((V_ap - (RESTING_POTENTIAL as number)) / (PEAK_POTENTIAL as number)) * g_ion;
      output[i] = (inputField[i] * modulation) as Float64;
    }

    return output as unknown as GeometricField;
  }

  /**
   * Get the dipole moment at scale n.
   * [DIPOLE] — Membrane dipole from charge separation across the lipid bilayer.
   * The resting potential creates a net dipole: p = C_m · V_rest · A · d.
   * where A = membrane area, d = membrane thickness.
   * At scale n, the dipole is attenuated by qrf(n).
   */
  override getDipoleMoment(scale: ScaleIndex): DipoleMoment {
    const qrf = this.qrfAttenuation(scale);
    const r = CELL_RADIUS as number;
    const A = 4 * Math.PI * r * r; // membrane area
    const d = 5e-9; // membrane thickness

    const magnitude = ((MEMBRANE_CAPACITANCE as number) * Math.abs(RESTING_POTENTIAL as number) * A * d * qrf) as Float64;

    return {
      magnitude,
      direction: [0 as Float64, 0 as Float64, 1 as Float64], // across membrane (z)
      scale,
    };
  }

  /**
   * Get the polarization at scale n.
   * [POLARIZATION] — Membrane polarization from ion concentration gradients.
   * The Nernst potentials create anisotropic susceptibility:
   * χ_membrane = C_m · (E_Na - E_K) / V_rest · qrf(n).
   * This reflects the differential response to Na⁺ and K⁺ fields.
   */
  override getPolarization(scale: ScaleIndex): Polarization {
    const qrf = this.qrfAttenuation(scale);
    const delta_E = Math.abs((E_NA as number) - (E_K as number));
    const chi_membrane = (MEMBRANE_CAPACITANCE as number) * delta_E / Math.abs(RESTING_POTENTIAL as number) * qrf;

    return {
      P_electric: [0 as Float64, 0 as Float64, (chi_membrane * 0.1) as Float64],
      P_magnetic: [0 as Float64, 0 as Float64, 0 as Float64],
      susceptibility: [
        (chi_membrane * 0.1) as Float64, 0, 0,
        0, (chi_membrane * 0.1) as Float64, 0,
        0, 0, (chi_membrane * 1.0) as Float64, // z-axis: across membrane
      ] as unknown as readonly Float64[],
      scale,
    };
  }

  /**
   * Get the Master Equation term at scale n.
   * [MASTER] — Phase encodes the action potential frequency:
   *   θ_k = 2π · (f_AP / f_0) · (scale/89) · (k/12)
   * where f_AP = action potential frequency (≈ 100 Hz max),
   * f_0 = reference frequency, and k=10 (F11 index).
   */
  override getMasterEquationTerm(scale: ScaleIndex): {
    re: Float64;
    im: Float64;
    weight: Float64;
  } {
    const k = 10; // F11 → index 10 (0-based)
    const weight = Math.pow(PHI_INV, k) as Float64;
    const f_ap = 100; // 100 Hz max firing rate
    const f_0 = PLANCK_FREQUENCY as number;
    const phase = (2 * Math.PI * (f_ap / f_0) * (scale / QRF_CRITICAL_SCALE) * (k / 12)) as Float64;
    const re = (weight * Math.cos(phase)) as Float64;
    const im = (weight * Math.sin(phase)) as Float64;
    return { re, im, weight };
  }
}
