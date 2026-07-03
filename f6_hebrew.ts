// ═══════════════════════════════════════════════════════════════════════════════
// F6 Hebrew Framework
// ═══════════════════════════════════════════════════════════════════════════════
// Implements the 22-letter Hebrew alphabet structure, Tree of Life (Sefirot),
// gematria numerology, and septenary (7-fold) encoding. The Hebrew framework
// encodes linguistic structure as geometric pattern — language as crystalline code.
//
// Physics:
// ───────────────────────────────────────────────────────────────────────────────
// 1. 22-Letter Alphabet Structure
//    3 Mother Letters (Aleph, Mem, Shin) → Air, Water, Fire → elements
//    7 Double Letters (Bet, Gimel, Dalet, Kaf, Peh, Resh, Tav) → planets/days
//    12 Simple Letters (Heh, Vav, Zayin, Chet, Tet, Yud, Lamed, Nun,
//                       Samech, Ayin, Tsade, Kuf) → zodiac signs/months
//    Total: 3 + 7 + 12 = 22 (3×7 + 1 = 22, the "living letter")
//
// 2. Gematria — Letter Numerology
//    Standard values: Aleph=1, Bet=2, ..., Yud=10, Kaf=20, ..., Quf=100,
//    Resh=200, Shin=300, Tav=400.
//    Word value = sum of letter values. Divine names have specific gematria.
//    Example: Elohim = 1+30+5+10+40 = 86; YHWH = 10+5+6+5 = 26.
//
// 3. Tree of Life (Etz Chaim)
//    10 Sefirot: Keter, Chokhmah, Binah, Chesed, Gevurah, Tiferet,
//                Netzach, Hod, Yesod, Malkhut.
//    22 Paths connecting Sefirot (corresponding to 22 letters).
//    3 Columns: Right (expanding), Left (contracting), Center (balancing).
//    4 Worlds: Atziluth, Beriah, Yetzirah, Assiah.
//
// 4. Septenary (7-Fold) Encoding
//    7 Double Letters correspond to 7 days of creation, 7 classical planets,
//    7 orifices in the head, 7 directions (6 + center).
//    Each double letter has two pronunciations: hard (stop) and soft (spirant).
//    This creates a binary encoding within the alphabet.
//
// 5. Toroidal Tree of Life
//    The 10 Sefirot arranged on a torus with 22 paths forming toroidal knot.
//    Knot type T(3,7) or T(2,11): 3×7 = 21 + 1 center = 22 paths.
// ═══════════════════════════════════════════════════════════════════════════════

import {
  PHI,
  PHI_INV,
  PLANCK_LENGTH,
  PLANCK_FREQUENCY,
  REDUCED_PLANCK_CONSTANT,
  COHERENCE_THRESHOLD,
  QRF_CRITICAL_SCALE,
} from "../../core/constants";
import type { Float64, ScaleIndex, GeometricField } from "../../core/types";
import type { DipoleMoment, Polarization } from "./types";
import { BaseFramework } from "./base_framework";

// ═══════════════════════════════════════════════════════════════════════════════
// 1. Hebrew Letter Gematria
// ═══════════════════════════════════════════════════════════════════════════════

/** Hebrew letter with name, value, and category. */
interface HebrewLetter {
  readonly name: string;
  readonly value: number;
  readonly category: "Mother" | "Double" | "Simple";
}

/** The 22 Hebrew letters with standard gematria values. */
const HEBREW_ALPHABET: readonly HebrewLetter[] = [
  // 3 Mother Letters
  { name: "Aleph",   value: 1,   category: "Mother" },
  { name: "Mem",     value: 40,  category: "Mother" },
  { name: "Shin",    value: 300, category: "Mother" },
  // 7 Double Letters
  { name: "Bet",     value: 2,   category: "Double" },
  { name: "Gimel",   value: 3,   category: "Double" },
  { name: "Dalet",   value: 4,   category: "Double" },
  { name: "Kaf",     value: 20,  category: "Double" },
  { name: "Peh",     value: 80,  category: "Double" },
  { name: "Resh",    value: 200, category: "Double" },
  { name: "Tav",     value: 400, category: "Double" },
  // 12 Simple Letters
  { name: "Heh",     value: 5,   category: "Simple" },
  { name: "Vav",     value: 6,   category: "Simple" },
  { name: "Zayin",   value: 7,   category: "Simple" },
  { name: "Chet",    value: 8,   category: "Simple" },
  { name: "Tet",     value: 9,   category: "Simple" },
  { name: "Yud",     value: 10,  category: "Simple" },
  { name: "Lamed",   value: 30,  category: "Simple" },
  { name: "Nun",     value: 50,  category: "Simple" },
  { name: "Samech",  value: 60,  category: "Simple" },
  { name: "Ayin",    value: 70,  category: "Simple" },
  { name: "Tsade",   value: 90,  category: "Simple" },
  { name: "Kuf",     value: 100, category: "Simple" },
] as const;

/** Total gematria value of all 22 letters. */
const TOTAL_GEMATRIA: number = HEBREW_ALPHABET.reduce((sum, l) => sum + l.value, 0); // = 1495

/** Compute gematria of a word (array of letter indices). */
function gematria(letterIndices: readonly number[]): number {
  return letterIndices.reduce((sum, idx) => {
    if (idx < 0 || idx >= HEBREW_ALPHABET.length) return sum;
    return sum + HEBREW_ALPHABET[idx].value;
  }, 0);
}

// ═══════════════════════════════════════════════════════════════════════════════
// 2. Tree of Life (Sefirot) Geometry
// ═══════════════════════════════════════════════════════════════════════════════

/** Sefira (emanation) with position and properties. */
interface Sefira {
  readonly name: string;
  readonly number: number;
  readonly x: number; // horizontal position (-1 left, 0 center, 1 right)
  readonly y: number; // vertical position (1 top, 0 middle, -1 bottom)
  readonly column: "Left" | "Center" | "Right";
}

/** The 10 Sefirot with their Tree of Life positions. */
const SEFIROT: readonly Sefira[] = [
  { name: "Keter",     number: 1,  x: 0,  y: 1.0,  column: "Center" },  // Crown
  { name: "Chokhmah",  number: 2,  x: -1, y: 0.75, column: "Left" },    // Wisdom
  { name: "Binah",     number: 3,  x: 1,  y: 0.75, column: "Right" },   // Understanding
  { name: "Chesed",    number: 4,  x: -1, y: 0.25, column: "Left" },    // Mercy
  { name: "Gevurah",   number: 5,  x: 1,  y: 0.25, column: "Right" },   // Severity
  { name: "Tiferet",   number: 6,  x: 0,  y: 0.0,  column: "Center" },  // Beauty
  { name: "Netzach",   number: 7,  x: -1, y: -0.25, column: "Left" },   // Victory
  { name: "Hod",       number: 8,  x: 1,  y: -0.25, column: "Right" },  // Splendor
  { name: "Yesod",     number: 9,  x: 0,  y: -0.75, column: "Center" }, // Foundation
  { name: "Malkhut",   number: 10, x: 0,  y: -1.0, column: "Center" },  // Kingdom
] as const;

/** The 22 Paths connecting Sefirot (Hebrew letter associations). */
const TREE_OF_LIFE_PATHS: readonly { from: number; to: number; letterIdx: number }[] = [
  // Vertical paths (3 pillars)
  { from: 1, to: 6, letterIdx: 0 },   // Aleph (Air) — Keter to Tiferet
  { from: 6, to: 9, letterIdx: 1 },   // Mem (Water) — Tiferet to Yesod
  { from: 9, to: 10, letterIdx: 2 },  // Shin (Fire) — Yesod to Malkhut
  // Horizontal paths (3 triads)
  { from: 2, to: 3, letterIdx: 3 },   // Bet — Chokhmah to Binah
  { from: 4, to: 5, letterIdx: 4 },   // Gimel — Chesed to Gevurah
  { from: 7, to: 8, letterIdx: 5 },   // Dalet — Netzach to Hod
  // Diagonal paths (remaining letters)
  { from: 1, to: 2, letterIdx: 6 },   // Kaf
  { from: 1, to: 3, letterIdx: 7 },     // Peh
  { from: 2, to: 4, letterIdx: 8 },     // Resh
  { from: 3, to: 5, letterIdx: 9 },     // Tav
  { from: 2, to: 6, letterIdx: 10 },    // Heh
  { from: 3, to: 6, letterIdx: 11 },    // Vav
  { from: 4, to: 7, letterIdx: 12 },    // Zayin
  { from: 5, to: 8, letterIdx: 13 },    // Chet
  { from: 6, to: 7, letterIdx: 14 },    // Tet
  { from: 6, to: 8, letterIdx: 15 },    // Yud
  { from: 4, to: 6, letterIdx: 16 },    // Lamed
  { from: 5, to: 6, letterIdx: 17 },    // Nun
  { from: 7, to: 9, letterIdx: 18 },    // Samech
  { from: 8, to: 9, letterIdx: 19 },    // Ayin
  { from: 3, to: 9, letterIdx: 20 },     // Tsade
  { from: 2, to: 5, letterIdx: 21 },    // Kuf
] as const;

/**
 * Compute path length between two Sefirot.
 * [GEOM] — Euclidean distance in the Tree of Life coordinate system.
 */
function pathLength(from: number, to: number): number {
  const s1 = SEFIROT[from - 1]; // Sefirot numbers are 1-based
  const s2 = SEFIROT[to - 1];
  if (!s1 || !s2) return 0;
  const dx = s2.x - s1.x;
  const dy = s2.y - s1.y;
  return Math.sqrt(dx * dx + dy * dy);
}

// ═══════════════════════════════════════════════════════════════════════════════
// 3. Septenary (7-Fold) Encoding
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Seven double letters and their dual pronunciations.
 * [LING] — Each double letter has both a hard (stop) and soft (spirant) form.
 * This creates a 7-bit binary code within the Hebrew alphabet.
 */
const DOUBLE_LETTER_PRONUNCIATIONS: readonly { hard: string; soft: string }[] = [
  { hard: "B", soft: "V" },   // Bet
  { hard: "G", soft: "Gh" },  // Gimel
  { hard: "D", soft: "Dh" },  // Dalet
  { hard: "K", soft: "Kh" },  // Kaf
  { hard: "P", soft: "F" },   // Peh
  { hard: "R", soft: "R" },   // Resh (no soft form, but included for completeness)
  { hard: "T", soft: "Th" },  // Tav
] as const;

/**
 * Encode a 7-bit value using the double letters.
 * [CODE] — Each bit corresponds to one double letter: 1 = hard, 0 = soft.
 * This maps any number 0-127 to a Hebrew word of 7 letters.
 */
function septenaryEncode(value: number): string[] {
  const result: string[] = [];
  for (let i = 0; i < 7; i++) {
    const bit = (value >> i) & 1;
    const pronunciations = DOUBLE_LETTER_PRONUNCIATIONS[i];
    result.push(bit === 1 ? pronunciations.hard : pronunciations.soft);
  }
  return result;
}

// ═══════════════════════════════════════════════════════════════════════════════
// 4. F6 Hebrew Framework
// ═══════════════════════════════════════════════════════════════════════════════

export class F6_Hebrew extends BaseFramework {
  readonly id = "F6_Hebrew";
  readonly name = "Hebrew Framework";
  readonly characteristicScale = 22;
  readonly qrfThreshold = 0.8878508836021354 as Float64;
  readonly description =
    "22-letter alphabet structure, Tree of Life, gematria, septenary encoding";

  /**
   * Compute energy density at scale n.
   * [ENERGY] — ρ(n) = (total gematria / 22) · ℏ · f(n) / L(n)³ · qrf(n)².
   * The average letter value (1495/22 ≈ 67.95) sets the energy scale.
   */
  override computeEnergyDensity(scale: ScaleIndex): Float64 {
    const qrf = this.qrfAttenuation(scale);
    const L_n = this.scaleLength(scale);
    const volume = (L_n * L_n * L_n) as Float64;
    const avgGematria = TOTAL_GEMATRIA / 22;
    const f_n = this.scaleFrequency(scale);
    return ((avgGematria * REDUCED_PLANCK_CONSTANT * f_n / volume) * qrf * qrf) as Float64;
  }

  /**
   * Compute the framework's effect on the field.
   * [COMPUTE] — Modulates the input field using Tree of Life path structure.
   * The field is encoded as a 22-dimensional vector (one dimension per Hebrew letter).
   * Each path contributes a phase factor based on the connecting letter's gematria.
   *   ψ_mod(i) = ψ_in(i) · [1 + qrf(n) · Σ_paths (gematria(letter) · sin(2π·i·path_length/φ))]
   */
  override compute(scale: ScaleIndex, inputField: GeometricField): GeometricField {
    const qrf = this.qrfAttenuation(scale);
    const L_n = this.scaleLength(scale);

    // Compute path phases from Tree of Life structure
    const pathPhases: number[] = [];
    for (const path of TREE_OF_LIFE_PATHS) {
      const length = pathLength(path.from, path.to);
      const letter = HEBREW_ALPHABET[path.letterIdx];
      const phase = (letter.value * length * PHI_INV) / TOTAL_GEMATRIA;
      pathPhases.push(phase);
    }

    const output = new Float64Array(inputField.length);
    for (let i = 0; i < inputField.length; i++) {
      // Sum contributions from all 22 paths
      let pathSum = 0;
      for (let p = 0; p < pathPhases.length; p++) {
        pathSum += Math.sin(2 * Math.PI * i * pathPhases[p] / PHI);
      }

      // Modulate with Hebrew path structure and 7-fold septenary encoding
      const septenaryFactor = Math.cos(7 * Math.PI * (i / inputField.length));
      output[i] = (inputField[i] * (1 + qrf * (pathSum / 22) * septenaryFactor)) as Float64;
    }

    return output as unknown as GeometricField;
  }

  /**
   * Get the dipole moment at scale n.
   * [DIPOLE] — Sefirotic dipole from Keter (Crown) to Malkhut (Kingdom).
   * The vertical axis (Keter-Malkhut) is the primary dipole.
   * Horizontal dipoles: Chokhmah-Binah (Wisdom-Understanding),
   * Chesed-Gevurah (Mercy-Severity), Netzach-Hod (Victory-Splendor).
   * Dipole magnitude = gematria(Tav) - gematria(Aleph) = 400 - 1 = 399 · qrf(n).
   */
  override getDipoleMoment(scale: ScaleIndex): DipoleMoment {
    const qrf = this.qrfAttenuation(scale);
    const L_n = this.scaleLength(scale);

    // Keter-Malkhut vertical dipole: difference between highest and lowest Sefira
    const keter = SEFIROT[0];
    const malkhut = SEFIROT[9];
    const vertical_dipole = (malkhut.y - keter.y) * (L_n as number);

    // Gematria difference: Tav(400) - Aleph(1) = 399
    const gematria_dipole = 399 * 1e-22 * (L_n as number); // scaled to physical units
    const magnitude = (gematria_dipole * qrf) as Float64;

    // Direction: vertical (Keter to Malkhut is top to bottom, so -z)
    return {
      magnitude,
      direction: [0 as Float64, 0 as Float64, (-1) as Float64],
      scale,
    };
  }

  /**
   * Get the polarization at scale n.
   * [POLARIZATION] — Sefirotic susceptibility from the 3 columns of the Tree of Life.
   * Right column (expanding): Chesed, Netzach → positive susceptibility
   * Left column (contracting): Gevurah, Hod → negative susceptibility
   * Center column (balancing): Keter, Tiferet, Yesod, Malkhut → neutral
   * The total susceptibility is weighted by gematria of each column.
   */
  override getPolarization(scale: ScaleIndex): Polarization {
    const qrf = this.qrfAttenuation(scale);

    // Compute column gematria totals
    let rightGematria = 0;
    let leftGematria = 0;
    let centerGematria = 0;

    for (const sefira of SEFIROT) {
      const sefiraGematria = sefira.number * 10; // Sefira number × 10 as placeholder
      if (sefira.column === "Right") rightGematria += sefiraGematria;
      else if (sefira.column === "Left") leftGematria += sefiraGematria;
      else centerGematria += sefiraGematria;
    }

    const totalGematria = rightGematria + leftGematria + centerGematria;
    const chi_right = (rightGematria / totalGematria) * 0.1;
    const chi_left = (leftGematria / totalGematria) * 0.1;
    const chi_center = (centerGematria / totalGematria) * 0.1;

    const susceptibility = (chi_center * qrf) as Float64;

    // Anisotropic tensor: right-left imbalance creates off-diagonal terms
    return {
      P_electric: [0 as Float64, 0 as Float64, 0 as Float64],
      P_magnetic: [
        ((chi_right - chi_left) * qrf) as Float64,
        0 as Float64,
        0 as Float64,
      ],
      susceptibility: [
        (chi_right * qrf) as Float64, 0, 0,
        0, (chi_left * qrf) as Float64, 0,
        0, 0, susceptibility,
      ] as unknown as readonly Float64[],
      scale,
    };
  }

  /**
   * Get the Master Equation term at scale n.
   * [MASTER] — Phase encodes the 22-letter structure:
   *   θ_k = 2π · (22/10) · (scale/89) · (k/12) = 2π · (2.2) · (scale/89) · (k/12)
   * where 22 letters, 10 Sefirot, and k=5 (F6 index).
   */
  override getMasterEquationTerm(scale: ScaleIndex): {
    re: Float64;
    im: Float64;
    weight: Float64;
  } {
    const k = 5; // F6 → index 5 (0-based)
    const weight = Math.pow(PHI_INV, k) as Float64;
    const phase = (2 * Math.PI * (22 / 10) * (scale / QRF_CRITICAL_SCALE) * (k / 12)) as Float64;
    const re = (weight * Math.cos(phase)) as Float64;
    const im = (weight * Math.sin(phase)) as Float64;
    return { re, im, weight };
  }
}
