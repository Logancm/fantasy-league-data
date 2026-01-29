/**
 * Get the current year and previous year for league searching
 * Useful for finding leagues across fiscal year boundaries
 */
export const getSeasonYears = (): number[] => {
  const currentYear = new Date().getFullYear()
  const previousYear = currentYear - 1
  return [currentYear, previousYear]
}

/**
 * Get the future draft years to generate rookie picks
 * Dynamically calculates based on current year instead of hardcoding
 */
export const getFutureDraftYears = (): number[] => {
  const currentYear = new Date().getFullYear()
  // Generate picks for next 2 years
  return [currentYear + 1, currentYear + 2]
}
