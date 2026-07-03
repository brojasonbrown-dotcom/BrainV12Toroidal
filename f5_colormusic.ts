// ═══════════════════════════════════════════════════════════════════════════════
// F5 Color/Music Framework
// ═══════════════════════════════════════════════════════════════════════════════
// Handles the intersection of electromagnetic radiation (visible spectrum),
// acoustic resonance, and the golden ratio in wave phenomena.
// This framework operates at the atomic-to-molecular scale (n_fw = 21),
// bridging quantum electrodynamics and macroscopic wave physics.
//
// Physics:
// — Mass–frequency equivalence: m = ℏω/c² (Einstein–Planck–de Broglie unification)
//   • Electron eigenfrequency: ω_e ≈ 7.76×10²⁰ rad/s  →  m_e ≈ 9.109×10⁻³¹ kg
//   • Proton eigenfrequency:  ω_p ≈ 1.43×10²⁴ rad/s  →  m_p ≈ 1.673×10⁻²⁷ kg
// — Golden-ratio musical scale: f_n = f₀·φ^(n/7) for n = 0…7
//   • Octave divided by φ rather than 2, producing a "natural" scale
// — Visible spectrum: λ ∈ [380 nm, 750 nm] → E = hc/λ ∈ [1.65, 3.26] eV
// — Harmonic resonance: Q = ω₀/γ = φ^n (quality factor grows with the golden ratio)
// — Helmholtz resonator toroidal field: f_H = (c/2π)·√(A/(V·L_eff))
// — EM dipole antenna: L = c/(2f) (half-wave resonance)
// — Optical polarization: linear, circular, elliptical (Stokes parameters)
// ═══════════════════════════════════════════════════════════════════════════════

import {
  PHI,
  PHI_INV,
  PLANCK_LENGTH,
  PLANCK_FREQUENCY,
  REDUCED_PLANCK_CONSTANT,
  SPEED_OF_LIGHT_EXACT,
  VACUUM_PERMITTIVITY,
  COHERENCE_THRESHOLD,
  QRF_CRITICAL_SCALE,
} from "../../core/constants";
import type { Float64, ScaleIndex, GeometricField } from "../../core/types";
import type { DipoleMoment, Polarization } from "./types";
import { BaseFramework } from "./base_framework";

// ═══════════════════════════════════════════════════════════════════════════════
// 1. Color/Music Physical Constants
// ═══════════════════════════════════════════════════════════════════════════════

/** Speed of light c (m/s) — exact by SI definition */
const C: Float64 = SPEED_OF_LIGHT_EXACT;

/** Reduced Planck constant ℏ (J·s) */
const HBAR: Float64 = REDUCED_PLANCK_CONSTANT;

/** Planck constant h (J·s) */
const H: Float64 = (6.62607015e-34) as Float64;

/** Vacuum permittivity ε₀ (F/m) */
const EPSILON_0: Float64 = VACUUM_PERMITTIVITY;

/** Electron rest mass m_e (kg) — derived from ω_e = m_e c²/ℏ */
const ELECTRON_MASS: Float64 = 9.10938356e-31 as Float64;

/** Proton rest mass m_p (kg) — derived from ω_p = m_p c²/ℏ */
const PROTON_MASS: Float64 = 1.67262192369e-27 as Float64;

/** Electron eigenfrequency ω_e = m_e c²/ℏ ≈ 7.76×10²⁰ rad/s */
const ELECTRON_OMEGA: Float64 = (ELECTRON_MASS * C * C / HBAR) as Float64;

/** Proton eigenfrequency ω_p = m_p c²/ℏ ≈ 1.43×10²⁴ rad/s */
const PROTON_OMEGA: Float64 = (PROTON_MASS * C * C / HBAR) as Float64;

/** Visible spectrum boundaries (nm) — 380 nm (violet) to 750 nm (red) */
const VISIBLE_VIOLET_NM: Float64 = 380.0 as Float64;
const VISIBLE_RED_NM: Float64 = 750.0 as Float64;

/** Reference frequency for the golden musical scale (A4 = 440 Hz) */
const MUSICAL_F0: Float64 = 440.0 as Float64;

/** Number of notes in the golden scale octave */
const GOLDEN_SCALE_STEPS = 7;

/** Dipole antenna efficiency factor */
const ANTENNA_EFFICIENCY: Float64 = 0.95 as Float64;

// ═══════════════════════════════════════════════════════════════════════════════
// 2. Color/Music Framework
// ═══════════════════════════════════════════════════════════════════════════════

export class F5_ColorMusic extends BaseFramework {
  readonly id = "F5_ColorMusic";
  readonly name = "Color/Music Framework";
  readonly characteristicScale = 21;
  readonly qrfThreshold = 0.8926654244026953 as Float64;
  readonly description =
    "Visible spectrum electromagnetic waves, golden-ratio musical scales, " +
    "optical polarization, harmonic resonance, and toroidal Helmholtz acoustics";

  // ───────────────────────────────────────────────────────────────────────────
  // 2.1 Mass–Frequency Correspondence  m = ℏω / c²
  // ───────────────────────────────────────────────────────────────────────────

  /**
   * Convert angular frequency ω (rad/s) to equivalent mass via m = ℏω/c².
   * [PHYS] — This is the Planck–Einstein relation E = ℏω combined with E = mc²,
   * giving a direct mass–frequency equivalence.  In the de Broglie picture,
   * every massive particle has an internal clock ticking at ω = mc²/ℏ.
   *
   * @param omega — angular frequency in rad/s
   * @returns equivalent mass in kg
   */
  frequencyToMass(omega: Float64): Float64 {
    return (HBAR * omega / (C * C)) as Float64;
  }

  /**
   * Convert mass m (kg) to angular frequency via ω = mc²/ℏ.
   * [PHYS] — Inverse of the mass–frequency correspondence.
   *
   * @param mass — mass in kg
   * @returns angular frequency in rad/s
   */
  massToFrequency(mass: Float64): Float64 {
    return (mass * C * C / HBAR) as Float64;
  }

  // ───────────────────────────────────────────────────────────────────────────
  // 2.2 Golden-Ratio Musical Scale
  // ───────────────────────────────────────────────────────────────────────────

  /**
   * Compute the n-th note of the golden-ratio musical scale.
   * [MUSIC] — f_n = f₀ · φ^(n/7) for n = 0…7.
   * Instead of the equal-tempered octave factor 2, the golden scale uses φ.
   * The 7-step division is chosen because 7 is a natural harmonic number
   * (diatonic scale) and φ^(1/7) ≈ 1.057, close to the semitone ratio 2^(1/12).
   *
   * @param n — step index 0…7 (0 = f₀, 7 = f₀·φ)
   * @returns frequency in Hz
   */
  goldenScaleFrequency(n: number): Float64 {
    if (n < 0 || n > GOLDEN_SCALE_STEPS) {
      throw new RangeError(
        `Golden scale index n must be 0…${GOLDEN_SCALE_STEPS}, got ${n}`
      );
    }
    return (MUSICAL_F0 * Math.pow(PHI, n / GOLDEN_SCALE_STEPS)) as Float64;
  }

  /**
   * Return all 8 frequencies of the golden scale as a deterministic array.
   */
  getGoldenScale(): Float64[] {
    const scale: Float64[] = [];
    for (let n = 0; n <= GOLDEN_SCALE_STEPS; n++) {
      scale.push(this.goldenScaleFrequency(n));
    }
    return scale;
  }

  // ───────────────────────────────────────────────────────────────────────────
  // 2.3 Visible Spectrum & RGB Conversion
  // ───────────────────────────────────────────────────────────────────────────

  /**
   * Convert wavelength λ (nm) to photon energy E = hc/λ (eV).
   * [OPTICS] — hc ≈ 1239.841984 eV·nm.  Violet (380 nm) ≈ 3.26 eV,
   * red (750 nm) ≈ 1.65 eV.  These energies correspond to molecular
   * electronic transitions and are the primary channel of visual perception.
   *
   * @param wavelengthNm — wavelength in nanometers
   * @returns photon energy in electron-volts (eV)
   */
  wavelengthToEnergyEV(wavelengthNm: Float64): Float64 {
    const HC_EV_NM: Float64 = 1239.841984 as Float64;
    return (HC_EV_NM / wavelengthNm) as Float64;
  }

  /**
   * Convert wavelength λ (nm) to an approximate [R, G, B] triplet.
   * [COLOR] — Uses a deterministic piecewise linear approximation of the
   * CIE 1931 colour-matching functions.  The mapping is analytical,
   * not table-driven, so it is fully reproducible at any precision.
   *
   * @param wavelengthNm — wavelength in nanometers (380–750)
   * @returns [R, G, B] in [0, 1] range
   */
  wavelengthToRGB(wavelengthNm: Float64): [Float64, Float64, Float64] {
    const λ = wavelengthNm as number;
    let r = 0.0;
    let g = 0.0;
    let b = 0.0;

    if (λ >= 380 && λ < 440) {
      // Violet → blue transition; red rises
      r = (440 - λ) / (440 - 380);
      g = 0.0;
      b = 1.0;
    } else if (λ >= 440 && λ < 490) {
      // Blue → cyan; green rises
      r = 0.0;
      g = (λ - 440) / (490 - 440);
      b = 1.0;
    } else if (λ >= 490 && λ < 510) {
      // Cyan → green; blue falls
      r = 0.0;
      g = 1.0;
      b = (510 - λ) / (510 - 490);
    } else if (λ >= 510 && λ < 580) {
      // Green → yellow; red rises
      r = (λ - 510) / (580 - 510);
      g = 1.0;
      b = 0.0;
    } else if (λ >= 580 && λ < 645) {
      // Yellow → orange → red; green falls
      r = 1.0;
      g = (645 - λ) / (645 - 580);
      b = 0.0;
    } else if (λ >= 645 && λ <= 750) {
      // Deep red
      r = 1.0;
      g = 0.0;
      b = 0.0;
    }

    // Intensity falloff at the edges of human photopic vision
    let intensity = 1.0;
    if (λ >= 380 && λ < 420) {
      intensity = 0.3 + (0.7 * (λ - 380)) / (420 - 380);
    } else if (λ > 700 && λ <= 750) {
      intensity = 0.3 + (0.7 * (750 - λ)) / (750 - 700);
    }

    return [
      (r * intensity) as Float64,
      (g * intensity) as Float64,
      (b * intensity) as Float64,
    ];
  }

  /**
   * Compute the visible-spectrum bandwidth as a fraction of the EM spectrum.
   * [OPTICS] — Δλ/λ ≈ 0.97 octaves (a bit less than one musical octave).
   */
  visibleBandwidthFraction(): Float64 {
    return ((VISIBLE_RED_NM as number) / (VISIBLE_VIOLET_NM as number) - 1.0) as Float64;
  }

  // ───────────────────────────────────────────────────────────────────────────
  // 2.4 Harmonic Resonance  Q = ω₀/γ = φ^n
  // ───────────────────────────────────────────────────────────────────────────

  /**
   * Quality factor of a harmonic oscillator at framework scale n.
   * [RESONANCE] — Q = ω₀/γ = φ^n.  A higher Q means a sharper resonance.
   * At n = 21 (this framework): Q = φ²¹ ≈ 24,492, giving extremely
   * narrow linewidths comparable to optical cavities.
   *
   * @param n — scale index (default = characteristicScale = 21)
   * @returns dimensionless quality factor
   */
  qualityFactor(n: number = this.characteristicScale): Float64 {
    return Math.pow(PHI, n) as Float64;
  }

  /**
   * Resonance linewidth Δω = ω₀ / Q = ω₀ · φ^(-n).
   *
   * @param omega0 — resonant angular frequency (rad/s)
   * @param n — scale index
   */
  resonanceLinewidth(omega0: Float64, n: number = this.characteristicScale): Float64 {
    return (omega0 / this.qualityFactor(n)) as Float64;
  }

  // ───────────────────────────────────────────────────────────────────────────
  // 2.5 Helmholtz Resonator Toroidal Field
  // ───────────────────────────────────────────────────────────────────────────

  /**
   * Helmholtz resonator frequency: f_H = (c / 2π) · √(A / (V · L_eff)).
   * [ACOUSTICS] — Models a toroidal cavity as a Helmholtz resonator where
   * the neck cross-section A, cavity volume V, and effective neck length L_eff
   * set the acoustic eigenfrequency.  In the toroidal picture, the "neck" is
   * the minor-tube cross-section and the cavity is the torus volume.
   *
   * @param area — neck cross-sectional area A (m²)
   * @param volume — cavity volume V (m³)
   * @param lengthEff — effective neck length L_eff (m)
   * @returns resonant frequency in Hz
   */
  helmholtzFrequency(area: Float64, volume: Float64, lengthEff: Float64): Float64 {
    const term = Math.sqrt((area as number) / ((volume as number) * (lengthEff as number))) as Float64;
    return ((C / (2 * Math.PI)) * term) as Float64;
  }

  /**
   * Build a toroidal Helmholtz resonator from major radius R and minor radius r.
   * [TOROIDAL] — A = πr², V = 2π²Rr², L_eff = 2πR (circumference).
   * The aspect ratio is locked to φ for crystalline stability.
   *
   * @param majorRadius — R (m)
   * @param minorRadius — r (m)
   * @returns resonant frequency in Hz
   */
  toroidalHelmholtzFrequency(majorRadius: Float64, minorRadius: Float64): Float64 {
    const R = majorRadius as number;
    const r = minorRadius as number;
    const A = Math.PI * r * r;
    const V = 2 * Math.PI * Math.PI * R * r * r;
    const L_eff = 2 * Math.PI * R;
    return this.helmholtzFrequency(A as Float64, V as Float64, L_eff as Float64);
  }

  // ───────────────────────────────────────────────────────────────────────────
  // 2.6 Electromagnetic Dipole Antenna
  // ───────────────────────────────────────────────────────────────────────────

  /**
   * Half-wave dipole antenna length: L = c / (2f).
   * [ANTENNA] — At resonance, the dipole is exactly λ/2.  This is the
   * classic EM dipole formula used from radio antennas to optical nano-antennas.
   *
   * @param frequency — in Hz
   * @returns dipole length in meters
   */
  dipoleAntennaLength(frequency: Float64): Float64 {
    return (C / (2 * frequency)) as Float64;
  }

  /**
   * Radiation resistance of a half-wave dipole: R_rad ≈ 73.1 Ω.
   * Scaled by antenna efficiency at the framework's characteristic scale.
   */
  dipoleRadiationResistance(): Float64 {
    return (73.1 * ANTENNA_EFFICIENCY) as Float64;
  }

  // ───────────────────────────────────────────────────────────────────────────
  // 2.7 Optical Polarization (Linear, Circular, Elliptical)
  // ───────────────────────────────────────────────────────────────────────────

  /**
   * Stokes parameters for a pure polarized wave with given orientation ψ
   * and ellipticity χ.
   * [POLARIZATION] — Stokes vector S = [I, Q, U, V] where:
   *   I = total intensity
   *   Q = I · cos(2χ) · cos(2ψ)
   *   U = I · cos(2χ) · sin(2ψ)
   *   V = I · sin(2χ)
   * For linear polarization χ = 0; for circular χ = ±π/4.
   *
   * @param intensity — total intensity I (W/m²)
   * @param psi — orientation angle (rad)
   * @param chi — ellipticity angle (rad)
   * @returns [I, Q, U, V] Stokes parameters
   */
  stokesParameters(
    intensity: Float64,
    psi: Float64,
    chi: Float64
  ): [Float64, Float64, Float64, Float64] {
    const I = intensity as number;
    const twoPsi = 2 * (psi as number);
    const twoChi = 2 * (chi as number);
    const Q = I * Math.cos(twoChi) * Math.cos(twoPsi);
    const U = I * Math.cos(twoChi) * Math.sin(twoPsi);
    const V = I * Math.sin(twoChi);
    return [I as Float64, Q as Float64, U as Float64, V as Float64];
  }

  /**
   * Degree of polarization: P = √(Q² + U² + V²) / I.
   * Returns 1 for fully polarized light, 0 for unpolarized.
   */
  degreeOfPolarization(
    I: Float64,
    Q: Float64,
    U: Float64,
    V: Float64
  ): Float64 {
    const num = Math.sqrt(
      (Q as number) ** 2 + (U as number) ** 2 + (V as number) ** 2
    );
    return (num / (I as number)) as Float64;
  }

  /**
   * Build a linear polarization state at angle ψ.
   */
  linearPolarization(intensity: Float64, psi: Float64): [Float64, Float64, Float64, Float64] {
    return this.stokesParameters(intensity, psi, 0 as Float64);
  }

  /**
   * Build a circular polarization state (right-handed: +π/4, left-handed: –π/4).
   */
  circularPolarization(intensity: Float64, handedness: "right" | "left"): [Float64, Float64, Float64, Float64] {
    const chi = (handedness === "right" ? Math.PI / 4 : -Math.PI / 4) as Float64;
    return this.stokesParameters(intensity, 0 as Float64, chi);
  }

  /**
   * Build an elliptical polarization state with given orientation and ellipticity.
   */
  ellipticalPolarization(
    intensity: Float64,
    psi: Float64,
    ellipticity: Float64
  ): [Float64, Float64, Float64, Float64] {
    // ellipticity e = tan(χ)  →  χ = arctan(e)
    const chi = Math.atan(ellipticity as number) as Float64;
    return this.stokesParameters(intensity, psi, chi);
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // 3. Framework Computation Overrides
  // ═══════════════════════════════════════════════════════════════════════════════

  /**
   * Override energy density with the photon energy density of the visible field.
   * [ENERGY] — ρ_vis(n) = (ℏ · f_vis(n)) / L(n)³  where f_vis is the
   * centre frequency of the visible band at scale n.
   */
  override computeEnergyDensity(scale: ScaleIndex): Float64 {
    const centreWavelengthNm = ((VISIBLE_VIOLET_NM as number) + (VISIBLE_RED_NM as number)) / 2;
    const centreFrequency = (C / (centreWavelengthNm * 1e-9)) as Float64;
    const L_n = this.scaleLength(scale);
    return (HBAR * centreFrequency / (L_n * L_n * L_n)) as Float64;
  }

  /**
   * Compute the framework's effect on the geometric field.
   * [COMPUTE] — The Color/Music framework modulates the input field by:
   * 1. A visible-spectrum carrier wave  sin(2π · f_vis · t)
   * 2. A golden-scale envelope           φ^(-n/89) · cos(2π · f_n · t)
   * 3. An optical polarization rotation  determined by Stokes V
   *
   * The result is deterministic: same input → same output, no randomness.
   */
  override compute(scale: ScaleIndex, inputField: GeometricField): GeometricField {
    const qrf = this.qrfAttenuation(scale);
    const L_n = this.scaleLength(scale);

    // Centre frequency of visible band at this scale
    const centreWavelength = ((VISIBLE_VIOLET_NM as number) + (VISIBLE_RED_NM as number)) / 2 * 1e-9;
    const f_vis = (C / centreWavelength) as Float64;

    // Golden-scale envelope frequency (n = 4, the "middle" note of the scale)
    const f_env = this.goldenScaleFrequency(4);

    // Polarization rotation angle derived from scale index (deterministic)
    const polAngle = (scale * Math.PI / PHI) as Float64;
    const stokes = this.linearPolarization(1.0 as Float64, polAngle);
    const polFactor = (stokes[1] as number) / 1.0; // Q/I

    const output = new Float64Array(inputField.length);
    for (let i = 0; i < inputField.length; i++) {
      // Visible carrier: sin(2π · f_vis · i · dt) where dt = L_n / c
      const dt = (L_n / C) as number;
      const carrier = Math.sin(2 * Math.PI * (f_vis as number) * i * dt);

      // Golden envelope: φ^(-n/89) · cos(2π · f_env · i · dt)
      const envelope = qrf * Math.cos(2 * Math.PI * (f_env as number) * i * dt);

      // Combined modulation with polarization factor
      output[i] = (inputField[i] + (inputField[i] * carrier * envelope * polFactor)) as Float64;
    }

    return output as unknown as GeometricField;
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // 4. Dipole & Polarization Overrides
  // ═══════════════════════════════════════════════════════════════════════════════

  /**
   * Get the dipole moment at scale n.
   * [DIPOLE] — The Color/Music framework models an electromagnetic dipole antenna
   * resonant with the visible spectrum.  The dipole length is L = c/(2f_vis),
   * and the dipole moment is p = q · L where q is the effective charge
   * (scaled by the QRF attenuation).
   */
  override getDipoleMoment(scale: ScaleIndex): DipoleMoment {
    const qrf = this.qrfAttenuation(scale);
    const centreWavelength = ((VISIBLE_VIOLET_NM as number) + (VISIBLE_RED_NM as number)) / 2 * 1e-9;
    const f_vis = (C / centreWavelength) as Float64;
    const dipoleLength = this.dipoleAntennaLength(f_vis);

    // Effective charge: e · qrf(n)  (attenuated elementary charge)
    const ELEMENTARY_CHARGE: Float64 = 1.602176634e-19 as Float64;
    const effectiveCharge = (ELEMENTARY_CHARGE * qrf) as Float64;
    const magnitude = (effectiveCharge * dipoleLength) as Float64;

    // Direction aligned with the optical axis (z)
    return {
      magnitude,
      direction: [0 as Float64, 0 as Float64, 1 as Float64],
      scale,
    };
  }

  /**
   * Get the polarization at scale n.
   * [POLARIZATION] — Optical polarization tensor for the visible field.
   * The electric susceptibility is derived from the Lorentz oscillator model
   * χ_e(ω) = (Ne² / (ε₀m_e)) · 1 / (ω₀² – ω² – iγω).
   * At resonance (ω = ω₀), the real part of χ_e peaks, giving the
   * characteristic dispersive behaviour of colour media.
   */
  override getPolarization(scale: ScaleIndex): Polarization {
    const qrf = this.qrfAttenuation(scale);

    // Electron plasma frequency squared: ω_pe² = N e² / (ε₀ m_e)
    // Using a typical bound-electron density N ≈ 10²⁹ m⁻³ (solid/liquid)
    const N: Float64 = 1e29 as Float64;
    const E_CHARGE: Float64 = 1.602176634e-19 as Float64;
    const omegaPeSquared = (N * E_CHARGE * E_CHARGE / (EPSILON_0 * ELECTRON_MASS)) as Float64;

    // Resonant frequency of visible centre
    const centreWavelength = ((VISIBLE_VIOLET_NM as number) + (VISIBLE_RED_NM as number)) / 2 * 1e-9;
    const omega0 = (2 * Math.PI * C / centreWavelength) as Float64;
    const gamma = (omega0 / this.qualityFactor(scale)) as Float64; // damping

    // Real part of Lorentz susceptibility at ω = ω₀ (peak dispersion)
    // Re(χ) = ω_pe² / (ω₀² – ω²)  →  at ω → ω₀, the peak value is ω_pe² / (γ ω₀)
    const susceptibility = (omegaPeSquared / (gamma * omega0) * qrf) as Float64;

    // Polarization vector aligned with the optical axis, scaled by QRF
    const P_mag = (susceptibility * EPSILON_0 * 1e5 * qrf) as Float64; // 1e5 V/m reference field

    return {
      P_electric: [0 as Float64, 0 as Float64, P_mag],
      P_magnetic: [0 as Float64, 0 as Float64, 0 as Float64],
      susceptibility: [
        susceptibility, 0, 0,
        0, susceptibility, 0,
        0, 0, susceptibility,
      ] as unknown as readonly Float64[],
      scale,
    };
  }
}
