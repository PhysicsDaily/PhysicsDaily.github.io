# Raw Notes Cleanup and Integration Plan

This document classifies each extracted fragment from the provided raw notes into:
- ✅ Correct (kept as-is or with minor polishing)
- ✏️ Corrected (had errors now fixed)
- 🚩 Incorrect (conceptually wrong)
- ⛔ Incomplete (needs completion / clarified)

---
## 1. Core Definitions
| Raw Fragment | Status | Corrected / Clarified Version | Notes |
|--------------|--------|--------------------------------|-------|
| "Physical quantity A number or set of numbers ... is called physical quantity." | ✏️ | A **physical quantity** is a property of a phenomenon, body, or substance that can be measured and expressed as a number times a unit. | Original phrasing grammatically broken. |
| Numerical magnitude definition | ✅ | The numerical value (pure number) in a measurement is the **numerical magnitude** n. |  |
| Unit definition | ✏️ | A **unit** is an established reference standard for a physical quantity. | Removed repetition. |
| Relation: n inversely proportional to u | ✏️ | For the same physical quantity: n₁u₁ = n₂u₂ (product constant). | Provide proper mathematical basis. |
| Statement: "n < 1" line | 🚩 | Removed. | Meaningless in context. |
| Formula shown as `Inu = constant` | ✏️ | Corrected to n × u = constant. | Stray capital I removed. |

## 2. Fundamental vs Supplementary Quantities
| Raw Fragment | Status | Corrected / Clarified Version | Notes |
|--------------|--------|--------------------------------|-------|
| 7 SI base quantities list | ✅ | Mass (kg), Length (m), Time (s), Electric current (A), Thermodynamic temperature (K), Amount of substance (mol), Luminous intensity (cd). | Already present in chapter. |
| "Two supplementary" (plane & solid angle) | ✏️ | Plane angle (radian, rad) and solid angle (steradian, sr) are **dimensionless derived quantities** (not SI base). | Modern SI: treated as dimensionless. |
| Incorrect dimensional symbols: Plane angle [MLT°] | 🚩 | Removed. | Wrong dimension notation. |

## 3. Derived Quantity Unit Construction Examples
| Raw Fragment | Status | Corrected / Clarified Version | Notes |
|--------------|--------|--------------------------------|-------|
| Speed expression garbled | ✏️ | speed v = distance / time → [v] = [L][T⁻¹] | Cleaned. |
| Potential difference derivation messy | ✏️ | V = W/Q; [V] = [ML²T⁻³A⁻¹] | Standard. |
| Resistance expression scrambled | ✏️ | R = V/I → [R] = [ML²T⁻³A⁻²] | Correct. |
| Angle unitless explanation | ✅ | θ = arc length / radius → dimensionless. | Good. |
| Planck constant h expression | ✅ | h = E/f → [h] = [ML²T⁻¹] | Present already. |

## 4. Dimensional Definitions and Examples
| Raw Fragment | Status | Corrected / Clarified Version | Notes |
|--------------|--------|--------------------------------|-------|
| Force dimensional equation (typos) | ✏️ | F = m a → [F] = [MLT⁻²]. | Fixed formatting. |
| Speed dimension wrongly shown as [L] | 🚩 | Correct: [v] = [LT⁻¹] | Fixed. |
| Acceleration dimension partially broken | ✏️ | a = Δv/Δt → [a] = [LT⁻²] |  |
| Work/Energy derivation scrambled | ✏️ | W = F s → [W] = [ML²T⁻²] |  |
| Power derivation messy | ✏️ | P = W/t = F v → [P] = [ML²T⁻³] |  |
| Pressure derivation | ✅ | P = F/A → [P] = [ML⁻¹T⁻²] |  |
| Potential difference dimension misindexed | ✏️ | [V] = [ML²T⁻³A⁻¹] |  |
| Density line `[G]` confusion | 🚩 | Clarify: Density ρ = m/V → [ρ] = [ML⁻³]; Gravitational constant G: [G] = [M⁻¹L³T⁻²]. | Mixed up in raw note. |
| Strain expressions messy | ✏️ | Strain (ΔL/L etc.) is dimensionless: [1] |  |
| Trig/log functions dimensionless argument note | ✅ | Already included in limitations section. |  |

## 5. Homogeneity Principle & Applications
| Raw Fragment | Status | Corrected / Clarified Version | Notes |
|--------------|--------|--------------------------------|-------|
| Principle wording fragmented | ✏️ | Only quantities with the same dimensions may be added or subtracted; each term in a physically valid equation must share dimensions (principle of dimensional homogeneity). |  |
| Example s = ut + ½ a t² | ✅ | Already in chapter; consistent. |  |
| Incorrect equation s = ut + a t (raw) | ✅ | Retained as incorrect example explanation. |  |

## 6. Unit Conversion via Dimensions
| Raw Fragment | Status | Corrected / Clarified Version | Notes |
|--------------|--------|--------------------------------|-------|
| General formula messy | ✏️ | n₂ = n₁ (M₁/M₂)^α (L₁/L₂)^β (T₁/T₂)^γ for quantity with dimensions M^α L^β T^γ. |  |
| 1 N to cgs derivation | ✏️ | 1 N = 10⁵ dyn (since 1 kg·m/s² = 10³ g · 10² cm / s²). | Clean arithmetic. |
| 1 J to cgs derivation | ✏️ | 1 J = 10⁷ erg (1 kg·m²/s² = 10³ g · (10² cm)² / s²). |  |
| Power system conversion problem (mist errors) | ✏️ | Recomputed cleanly (will include corrected worked example). | Original arithmetic garbled. |

## 7. Dimensional Derivations (Method of Indices)
| Raw Fragment | Status | Corrected / Clarified Version | Notes |
|--------------|--------|--------------------------------|-------|
| E = k m^x c^y → E = m c² | ✅ | Shows method; k dimensionless (experimental value 1). |  |
| Pendulum period derivation (typos) | ✏️ | t = k L^½ g^(-½); k = 2π (cannot be found dimensionally). |  |
| Centripetal force derivation | ✅ | F ∝ m v² r⁻¹ → F = m v² / r |  |
| Newton gravitation derivation confusion | ✏️ | F = G m₁ m₂ / r² (G supplies needed dimensions). |  |
| Ohm's law derivation | ✅ | V = IR (dimensional check consistent). |  |

## 8. Limitations of Dimensional Analysis (Already Added)
All five listed; match raw content + cleaned phrasing.

## 9. Missing / Not Needed
| Topic | Action |
|-------|--------|
| Relative density = specific gravity | Already in chapter implicitly; could add a one-line clarity if desired. |
| Gravitational constant G dimensions explicit | Add compact clarification (Not yet explicit). |
| Clarify difference between resolution vs precision | Could be future enhancement. |

---
## Cleaned Content Block (Ready for Integration if Needed)

### Dimensional Clarifications Addendum
- Gravitational Constant: G has dimensions [M⁻¹L³T⁻²].
- Density: ρ = m/V → [ρ] = [ML⁻³].
- Strain types (linear, area, volume) are all dimensionless ratios.
- General unit conversion: n₂ = n₁ (M₁/M₂)^α (L₁/L₂)^β (T₁/T₂)^γ.
- 1 N = 10⁵ dyn; 1 J = 10⁷ erg.

### Sample Power Conversion (Corrected)
Given 1 W = 1 J/s.
Target system: mass = 100 g, length = 10 cm, time = 1 min.
Dimensions of power: [ML²T⁻³].
Conversion factor = (10³/10²)¹ × (10²/10¹)² × (1/60)⁻³ = 10 × 100 × 60³ = 2.16 × 10⁸ (units of new system).

---
## Recommendation
Most of the raw note content is already covered in `index.html`. Only small clarifications (G, explicit density line, compact conversion formula) could be added in an "Addendum" box. Let me know if you want those inserted.

---
Prepared for integration. Reply with “add addendum” if you’d like me to patch the chapter with the small missing clarifications.
