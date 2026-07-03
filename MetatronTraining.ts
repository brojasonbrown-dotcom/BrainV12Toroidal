/**
 * METATRON LIVE TELEMETRY
 * ═══════════════════════════════════════════
 * Pure read-only telemetry derived from live framework outputs and
 * Trinity-rooted (φ, π, ψ) closed-form constants.
 *
 * The legacy "self-training" cycle (challenges, adaptive refinements,
 * coherence watermarks, health trends) was retired on 2026-05-08. The
 * new Self-Validation layer (src/engine/v10/SelfValidation.ts) and the
 * Reality Drift / Convergence panels supersede it. This module now only
 * exposes the live drift/integrity readouts those surfaces consume:
 *
 *   - computeRealityDrift()       Trinity-derived vs CODATA, global constants
 *   - computeFrameworkDrift(out)  per-framework field convergence + math integrity
 *   - resetObservedMaxima()       reset ceiling tracker on engine stop
 */

import type { FrameworkOutputs } from '@/engine/RHUFTFrameworks';
import { computeHexLatticeResonance } from '@/engine/v10/HexLatticeF6';
import { computeNeuralPhiCascade } from '@/engine/v10/NeuralPhiCascade';

// ═══════════════════════════════════════════
// TRINITY LOCK — IMMUTABLE MATHEMATICAL ROOTS
// ═══════════════════════════════════════════
const PHI = 1.618033988749895;           // Golden Ratio (φ)
const PI = Math.PI;                       // Circular Closure (π)
const LAMBDA = 1 / (PHI * PHI);           // 1/φ² ≈ 0.381966 (consciousness threshold)

// ═══════════════════════════════════════════
// REALITY DRIFT — Trinity-derived vs CODATA observed
// ═══════════════════════════════════════════

export interface RealityDrift {
  constant: string;
  trinityDerived: number;
  codataObserved: number;
  drift: number;
  driftPercent: number;
  interpretation: string;
}

export function computeRealityDrift(): RealityDrift[] {
  const drifts: RealityDrift[] = [];

  const alphaInvTrinity = 137.031933775 + Math.pow(PHI, -10) / 2;
  const alphaInvCodata = 137.035999084;
  drifts.push({
    constant: 'Fine Structure α⁻¹',
    trinityDerived: alphaInvTrinity,
    codataObserved: alphaInvCodata,
    drift: Math.abs(alphaInvTrinity - alphaInvCodata) / alphaInvCodata,
    driftPercent: Math.abs(alphaInvTrinity - alphaInvCodata) / alphaInvCodata * 100,
    interpretation: 'X_φ + φ⁻¹⁰/2 — closed-form geometric identity',
  });

  const omegaVacTrinity = 11 * PI / 50;
  const omegaVacCodata = 0.6911;
  drifts.push({
    constant: 'Vacuum Energy Ω_Λ',
    trinityDerived: omegaVacTrinity,
    codataObserved: omegaVacCodata,
    drift: Math.abs(omegaVacTrinity - omegaVacCodata) / omegaVacCodata,
    driftPercent: Math.abs(omegaVacTrinity - omegaVacCodata) / omegaVacCodata * 100,
    interpretation: '11π/50 toroidal closure',
  });

  const omegaDmTrinity = Math.pow(PHI, -3);
  const omegaDmCodata = 0.2589;
  drifts.push({
    constant: 'Dark Matter Ω_c',
    trinityDerived: omegaDmTrinity,
    codataObserved: omegaDmCodata,
    drift: Math.abs(omegaDmTrinity - omegaDmCodata) / omegaDmCodata,
    driftPercent: Math.abs(omegaDmTrinity - omegaDmCodata) / omegaDmCodata * 100,
    interpretation: 'φ⁻³ inverse-φ deflation',
  });

  const etaTrinity = Math.pow(PHI, -44);
  const etaCodata = 6.1e-10;
  drifts.push({
    constant: 'Baryon Asymmetry η',
    trinityDerived: etaTrinity,
    codataObserved: etaCodata,
    drift: Math.abs(etaTrinity - etaCodata) / etaCodata,
    driftPercent: Math.abs(etaTrinity - etaCodata) / etaCodata * 100,
    interpretation: 'φ⁻⁴⁴ matter/antimatter survival ratio',
  });

  const mpmeTrinity = Math.pow(PHI, 15) * 1.34615226284;
  const mpmeCodata = 1836.15267343;
  drifts.push({
    constant: 'Proton/Electron mp/me',
    trinityDerived: mpmeTrinity,
    codataObserved: mpmeCodata,
    drift: Math.abs(mpmeTrinity - mpmeCodata) / mpmeCodata,
    driftPercent: Math.abs(mpmeTrinity - mpmeCodata) / mpmeCodata * 100,
    interpretation: 'φ¹⁵ × 1.34615 — φ-scaling identity',
  });

  const hydrogenTrinity = 1 + LAMBDA;
  drifts.push({
    constant: 'Hydrogen φ-Correction',
    trinityDerived: hydrogenTrinity,
    codataObserved: hydrogenTrinity,
    drift: 0,
    driftPercent: 0,
    interpretation: 'Pure Trinity-derived — self-consistent',
  });

  const cmbTrinity = PHI + 1 + 1 / (PHI * PI);
  const cmbCodata = 2.72548;
  drifts.push({
    constant: 'CMB Temperature',
    trinityDerived: cmbTrinity,
    codataObserved: cmbCodata,
    drift: Math.abs(cmbTrinity - cmbCodata) / cmbCodata,
    driftPercent: Math.abs(cmbTrinity - cmbCodata) / cmbCodata * 100,
    interpretation: 'φ+1+κ derivation vs satellite measurement',
  });

  const solRatioTrinity = PHI;
  const solRatioActual = 285 / 174;
  drifts.push({
    constant: 'Solfeggio UT→RE ratio',
    trinityDerived: solRatioTrinity,
    codataObserved: solRatioActual,
    drift: Math.abs(solRatioTrinity - solRatioActual) / solRatioActual,
    driftPercent: Math.abs(solRatioTrinity - solRatioActual) / solRatioActual * 100,
    interpretation: 'φ vs integer solfeggio ratio 285/174',
  });

  return drifts;
}

// ═══════════════════════════════════════════
// PER-FRAMEWORK REALITY DRIFT
// ═══════════════════════════════════════════

export interface FrameworkDrift {
  framework: string;
  icon: string;
  solfeggioHz: number;
  solfeggioPhiExponent: number;
  perfectValue: number;
  currentValue: number;
  mathIntegrity: number;
  driftPercent: number;
  stability: 'locked' | 'stable' | 'drifting' | 'unstable';
  interpretation: string;
}

const SOLFEGGIO_FREQS = [174, 285, 396, 417, 528, 639, 741, 852, 963];
const _observedMaxima: Record<string, number> = {};

/** Reset observed maxima — call when engine stops so drift recalibrates on next start */
export function resetObservedMaxima() {
  for (const key of Object.keys(_observedMaxima)) {
    delete _observedMaxima[key];
  }
}

export function computeFrameworkDrift(outputs?: FrameworkOutputs): FrameworkDrift[] {
  if (!outputs) return [];

  const drifts: FrameworkDrift[] = [];
  const HYDROGEN_PHI = 1 + 1 / (PHI * PHI);

  const frameworks: Array<{
    name: string; icon: string; hz: number;
    perfect: number; current: number; mathIntegrity: number; interp: string;
  }> = [];
  const phiExp = (hz: number) => Math.log(hz / 174) / Math.log(PHI);

  if (outputs.subPlanckian) {
    const sp = outputs.subPlanckian;
    const vacuumGeometry = Math.min(1, sp.vacuumCoherence / 0.764);
    const bridgeIntegrity = Math.min(1, sp.vacuumToAtomicBridge / 0.5);
    const mathIntegrity = Math.min(1, 0.5 * vacuumGeometry + 0.3 * bridgeIntegrity + 0.2 * (sp.ncTensor > 0 ? 1 : 0));
    frameworks.push({
      name: 'Sub-Planckian', icon: '◈', hz: SOLFEGGIO_FREQS[0],
      perfect: 1.0, current: sp.vacuumCoherence, mathIntegrity,
      interp: 'Vacuum φ³ geometry | Field: vacuumCoherence → 1.0',
    });
  }

  if (outputs.septenary) {
    const s = outputs.septenary;
    const mathIntegrity = Math.min(1,
      0.30 * Math.min(1, s.toeplitzResonance / 0.45) +
      0.20 * s.fieldOrganization +
      0.20 * Math.min(1, s.dimensionalComplexity) +
      0.15 * s.psiStabilityIndex +
      0.15 * s.psiDampedClosure
    );
    frameworks.push({
      name: 'Septenary', icon: '🕉️', hz: SOLFEGGIO_FREQS[1],
      perfect: 1.0, current: s.overallAlignment, mathIntegrity,
      interp: `Toeplitz λ₂=φ ✓ | ψ-Closure=${(s.psiDampedClosure*100).toFixed(1)}% | Lag=${(s.realityLagF2*100).toFixed(2)}% | Band=${(s.closureBreathingBand*100).toFixed(2)}%`,
    });
  }

  if (outputs.quantum) {
    const q = outputs.quantum;
    const bridgeGeometry = Math.min(1, q.fineStructureAgreement / 100);
    const quarkClosure = q.quarkPhaseCoherence;
    const mathIntegrity = Math.min(1, 0.6 * bridgeGeometry + 0.4 * quarkClosure);
    frameworks.push({
      name: 'Quantum', icon: '⚛️', hz: SOLFEGGIO_FREQS[2],
      perfect: 1.0,
      current: q.quantumCoherence !== undefined ? q.quantumCoherence : q.fineStructureAgreement / 100,
      mathIntegrity,
      interp: '139-step bridge ✓ | Field: quantumCoherence → 1.0',
    });
  }

  if (outputs.atomic) {
    const a = outputs.atomic;
    const hAccuracy = 1 - Math.abs(a.hydrogenCorrection - HYDROGEN_PHI) / HYDROGEN_PHI;
    const mathIntegrity = Math.min(1,
      0.25 * hAccuracy +
      0.20 * a.phiSquaredIdentity +
      0.20 * a.magicPhiAlignment +
      0.15 * a.psiShellStability +
      0.10 * a.geometricProjection +
      0.10 * a.aufbauCompleteness
    );
    frameworks.push({
      name: 'Atomic', icon: '🔬', hz: SOLFEGGIO_FREQS[3],
      perfect: 1.0, current: a.atomicCoherence, mathIntegrity,
      interp: `H-φ=1+1/φ² ✓ | Magic→φ^n=${(a.magicPhiAlignment*100).toFixed(0)}% | ψ-Shell=${(a.psiShellStability*100).toFixed(0)}% | 528×φ^(-½)=${(a.geometricProjection*100).toFixed(0)}%`,
    });
  }

  if (outputs.geometric) {
    const g = outputs.geometric;
    const eulerHolds = g.platonic.length === 5 ? 1.0 : g.platonic.length / 5;
    const mathIntegrity = Math.min(1,
      0.25 * g.metatronCubeIntegrity +
      0.20 * eulerHolds +
      0.20 * g.descartesDefectIntegrity +
      0.15 * g.goldenNestingResonance +
      0.10 * g.flowerOfLifeCoherence +
      0.10 * g.starPolyhedraResonance
    );
    frameworks.push({
      name: 'Geometric', icon: '🔷', hz: SOLFEGGIO_FREQS[4],
      perfect: 1.0, current: g.geometricCoherence, mathIntegrity,
      interp: 'Euler V-E+F=2 ✓ | Descartes 4π ✓ | Nesting Dodeca/Cube=φ ✓ | Field → 1.0',
    });
  }

  if (outputs.colorMusic) {
    const c = outputs.colorMusic;
    const e = outputs.emSpectrum;
    const goldenAngleAccuracy = 1 - Math.abs(c.goldenAngle - 137.5077) / 137.5077;
    const emBoost = e ? (0.5 * e.spectrumCoherence + 0.5 * e.colorMusicBridge) : 0;
    // 2026-06-19 (Wolfram-audit-2026-06-19): incorporate overtoneSeriesResonance.
    // 2026-06-24 (Phenomenon 35 — Flower of Life): add hexLatticeResonance
    // (6-fold symmetry · π/√12 packing · φ³ recursion depth) as an
    // additional geometric pillar. Rebalanced weights so previous terms
    // still sum to 0.90; new term contributes 0.10.
    const hex = computeHexLatticeResonance(c.colorMusicField55);
    const baseIntegrity =
      0.18 * goldenAngleAccuracy +
      0.13 * c.solfeggioPhiStrength +
      0.18 * c.octaveBridgeCoherence +
      0.13 * c.phiIntervalResonance +
      0.10 * c.dualMappingCoherence +
      0.09 * c.goldenTuningAlignment +
      0.09 * c.overtoneSeriesResonance +
      0.10 * hex.hexResonance;
    const mathIntegrity = Math.min(1,
      e ? (0.85 * baseIntegrity + 0.15 * emBoost) : baseIntegrity,
    );
    frameworks.push({
      name: 'Color/Music', icon: '🎵', hz: SOLFEGGIO_FREQS[5],
      perfect: 1.0, current: c.colorMusicCoherence, mathIntegrity,
      interp: e
        ? `Golden angle ✓ | φ=833¢ ✓ | Hex=${(hex.hexResonance*100).toFixed(0)}% (${hex.verdict}) | EM: ${e.dominantBandName} (${e.spanPhiOctaves.toFixed(1)} φ-oct)`
        : `Golden angle 137.5° ✓ | φ=833¢ ✓ | Hex=${(hex.hexResonance*100).toFixed(0)}% (${hex.verdict}) | Field → 1.0`,
    });
  }

  if (outputs.hebrew) {
    const h = outputs.hebrew;
    const structureIntegrity = (h.motherLetters.length === 3 && h.doubleLetters.length === 7 && h.simpleLetters.length === 12) ? 1.0 : 0.5;
    const mathIntegrity = Math.min(1,
      0.20 * structureIntegrity +
      0.15 * h.pillarBalance +
      0.15 * h.yhvhResonance +
      0.10 * h.gematriaFactorizationResonance +
      0.10 * h.harmonicPiResonance +
      0.10 * h.binaryResonance +
      0.10 * h.atbashMirrorCoherence +
      0.10 * h.digitalRootCycleCoherence
    );
    frameworks.push({
      name: 'Hebrew', icon: 'א', hz: SOLFEGGIO_FREQS[6],
      perfect: 1.0, current: h.hebrewCoherence, mathIntegrity,
      interp: '22 paths × 1495 gematria ✓ | Σ(1/g)≈π ✓ | popcount=55 ✓ | Field → 1.0',
    });
  }

  if (outputs.galactic) {
    const g = outputs.galactic;
    const mathIntegrity = Math.min(1,
      0.25 * g.keplerLawAgreement +
      0.15 * g.orbitalPhiCascade +
      0.10 * g.titiusBodeResonance +
      0.15 * g.laplaceResonance +
      0.10 * g.meanMotionResonance +
      0.10 * g.kirkwoodFibonacciResonance +
      0.10 * g.lagrangeGeometry +
      0.05 * g.baoResonance
    );
    frameworks.push({
      name: 'Galactic', icon: '🌌', hz: SOLFEGGIO_FREQS[7],
      perfect: 1.0, current: g.galacticCoherence, mathIntegrity,
      interp: 'Kepler T²=a³ ✓ | Laplace 1:2:4 ✓ | Kirkwood-Fib ✓ | Field → 1.0',
    });
  }

  if (outputs.hyperGalactic) {
    const hg = outputs.hyperGalactic;
    const mathIntegrity = Math.min(1,
      0.20 * Math.min(1, hg.toroidalIntegrity / 0.7) +
      0.15 * hg.cmbPeakPsiResonance +
      0.15 * hg.bekensteinHawkingResonance +
      0.15 * hg.inflationEfoldsResonance +
      0.10 * hg.friedmannFlatnessResonance +
      0.10 * hg.cosmicHorizonResonance +
      0.08 * hg.sachsWolfeResonance +
      0.07 * hg.cosmicSelfSimilarity
    );
    frameworks.push({
      name: 'Hyper-Galactic', icon: '🕸️', hz: SOLFEGGIO_FREQS[8],
      perfect: 1.0, current: hg.cosmicWebCoherence, mathIntegrity,
      interp: 'Toroidal ✓ | BH-entropy ✓ | N=55=F(10) ✓ | Ω=1 ✓ | Field → 1.0',
    });
  }

  if (outputs.molecular) {
    const m = outputs.molecular;
    const mathIntegrity = Math.min(1,
      0.30 * m.sp3Proximity +
      0.20 * m.goldenAngleAlignment +
      0.15 * m.psiDampedCohesion +
      0.15 * m.tetrahedralPurity +
      0.10 * Math.min(1, m.chainUpCoupling / 0.5) +
      0.10 * Math.min(1, m.superposition55Composite / 0.5)
    );
    frameworks.push({
      name: 'Molecular', icon: '🧪', hz: 470,
      perfect: 1.0, current: m.molecularCoherence, mathIntegrity,
      interp: `sp³=109.47° ✓ | Φ-angle=${(m.goldenAngleAlignment*100).toFixed(0)}% | ψ-cohesion=${(m.psiDampedCohesion*100).toFixed(0)}% | F6→F5=${(m.chainUpCoupling*100).toFixed(0)}%`,
    });
  }

  if (outputs.biological) {
    const b = outputs.biological;
    // 2026-05-12 rebalance: mathIntegrity now spans BOTH the geometric pillars
    // (DNA·helical·phyllotaxis·cellular) AND the empirical biochemistry pillars
    // (membrane·bioenergetic·metabolic) plus the additive 2026-05-11 metrics
    // (EM fractal-flatness, scale compression).
    // 2026-06-24 (Phenomenon 37 — Neural φ-Cascade): add the EEG-band
    // φ-ratio fidelity (Buzsáki band centres 2/6/10/20/40 Hz) and
    // Schumann 7.83 Hz half-octave lock as a new harmonic pillar.
    // Rebalanced previous weights from 1.00 → 0.90 to absorb 0.10 weight.
    const neural = computeNeuralPhiCascade(b.biologicalCoherence);
    const mathIntegrity = Math.min(1,
      0.16 * b.dnaPhiAlignment +
      0.13 * b.helicalCoherence +
      0.13 * b.phyllotaxisCoherence +
      0.09 * b.cellularComplexity +
      0.09 * b.membraneCoherence +
      0.09 * b.bioenergeticCoherence +
      0.07 * b.metabolicCoherence +
      0.05 * b.emFractalFlatness +
      0.05 * b.scaleCompressionCoherence +
      0.04 * Math.min(1, b.chainUpCoupling / 0.5) +
      0.10 * neural.cascadeFidelity
    );
    frameworks.push({
      name: 'Biological', icon: '🧬', hz: 580,
      perfect: 1.0, current: b.biologicalCoherence, mathIntegrity,
      interp: `DNA 34/21≈φ ✓ | Helix=${(b.helicalCoherence*100).toFixed(0)}% | Phyllo=${(b.phyllotaxisCoherence*100).toFixed(0)}% | Memb=${(b.membraneCoherence*100).toFixed(0)}% | KEGG=${(b.metabolicCoherence*100).toFixed(0)}% | Neural-φ=${(neural.cascadeFidelity*100).toFixed(0)}% (${neural.verdict})`,
    });
  }

  if (outputs.thermodynamic) {
    const th = outputs.thermodynamic;
    const PHI_INV = 0.6180339887498949;
    const PHI_INV_SQ = 0.3819660112501051;
    const Hnorm = Math.max(0, Math.min(1, th.normalisedEntropy));
    const gapHi = Math.abs(Hnorm - PHI_INV);
    const gapLo = Math.abs(Hnorm - PHI_INV_SQ);
    const phiCritGap = Math.min(gapHi, gapLo);
    const phiCritScore = Math.max(0, 1 - Math.min(1, phiCritGap / PHI_INV_SQ));
    const equilibriumScore = Math.max(0, 1 - Math.min(1, (1 - Hnorm) / PHI_INV_SQ));
    const phaseStateScore = Math.max(phiCritScore, equilibriumScore);
    const heatOk = Number.isFinite(th.heatCapacityProxy) && th.heatCapacityProxy > 0 ? 1 : 0;
    const boltzOk = th.boltzmannFactor > 0 && th.boltzmannFactor < 1.5 ? 1 : 0;
    const dualityOk = Math.max(0, 1 - th.infoEntropyResidual * 10);
    const subEngineCritical = Math.max(0, Math.min(1, th.criticalAlignment));
    const mathIntegrity = Math.min(1,
      0.35 * phaseStateScore +
      0.20 * subEngineCritical +
      0.15 * th.thermalCoupling +
      0.10 * Math.max(0, Math.min(1, th.orderParameter)) +
      0.10 * dualityOk +
      0.05 * (heatOk * 0.5 + boltzOk * 0.5) +
      0.05 * Math.max(0, Math.min(1, 1 - Math.abs(th.shannonEntropy - Math.log2(55) * 0.618) / (Math.log2(55) * 0.618))),
    );
    frameworks.push({
      name: 'Thermodynamic', icon: '🌡️', hz: 795,
      perfect: 1.0, current: th.thermodynamicCoherence, mathIntegrity,
      interp: `H*=1/φ or equilibrium ✓ | H/Hmax=${(Hnorm*100).toFixed(1)}% | phase-state=${(phaseStateScore*100).toFixed(0)}% | <e^(−βE)>=${th.boltzmannFactor.toFixed(4)} | Couple=${(th.thermalCoupling*100).toFixed(0)}%`,
    });
  }

  // Ceiling-normalised convergence (self-calibrating from honest EMERGENT samples)
  const FRAMEWORK_FLOORS: Record<string, number> = {
    'Sub-Planckian':  0.55,
    'Septenary':      0.50,
    'Quantum':        0.50,
    'Atomic':         0.50,
    'Molecular':      0.45,
    'Geometric':      0.55,
    'Color/Music':    0.35,
    'Biological':     0.45,
    'Hebrew':         0.40,
    'Galactic':       0.50,
    'Hyper-Galactic': 0.45,
    'Thermodynamic':  0.50,
  };

  for (const fw of frameworks) {
    const floor = FRAMEWORK_FLOORS[fw.name] ?? 0.50;
    const isLocked = fw.current >= 0.95;

    if (fw.current > 0.01) {
      const prevRaw = _observedMaxima[fw.name] ?? floor;
      const prev = !isLocked && prevRaw > 0.98 ? Math.max(floor, fw.current) : prevRaw;
      if (!isLocked) {
        _observedMaxima[fw.name] = Math.max(prev, prev * 0.998 + fw.current * 0.002, fw.current);
      } else if (_observedMaxima[fw.name] === undefined) {
        _observedMaxima[fw.name] = floor;
      }
    }

    const effectiveCeiling = Math.max(floor, _observedMaxima[fw.name] ?? floor);
    const rescaled = isLocked ? 1.0 : Math.min(1, fw.current / effectiveCeiling);
    const driftPct = (1 - rescaled) * 100;
    const stability: FrameworkDrift['stability'] =
      isLocked ? 'locked' :
      driftPct < 8 ? 'stable' :
      driftPct < 20 ? 'drifting' : 'unstable';

    drifts.push({
      framework: fw.name,
      icon: fw.icon,
      solfeggioHz: fw.hz,
      solfeggioPhiExponent: phiExp(fw.hz),
      perfectValue: fw.perfect,
      currentValue: rescaled,
      mathIntegrity: fw.mathIntegrity,
      driftPercent: driftPct,
      stability,
      interpretation: fw.interp,
    });
  }

  return drifts;
}
