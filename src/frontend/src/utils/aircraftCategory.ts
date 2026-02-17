export type AircraftCategory = 'General Aviation' | 'Military' | 'Commercial';

/**
 * Derives aircraft category from OpenSky Network category code
 * OpenSky category codes:
 * 0: No information
 * 1: Light (< 15500 lbs)
 * 2: Small (15500 to 75000 lbs)
 * 3: Large (75000 to 300000 lbs)
 * 4: High Vortex Large (aircraft such as B-757)
 * 5: Heavy (> 300000 lbs)
 * 6: High Performance (> 5g acceleration and 400 kts)
 * 7: Rotorcraft
 */
export function deriveAircraftCategory(categoryCode: number | null): AircraftCategory {
  if (categoryCode === null) {
    return 'General Aviation';
  }

  // Commercial aircraft (Light to Heavy)
  if (categoryCode >= 1 && categoryCode <= 5) {
    return 'Commercial';
  }

  // Military (High Performance) or Rotorcraft
  if (categoryCode === 6 || categoryCode === 7) {
    return 'Military';
  }

  // Default to General Aviation
  return 'General Aviation';
}
