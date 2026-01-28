import { League } from '../types/sleeper'

/**
 * Determines if a league is dynasty format
 * In Sleeper API, settings.type: 0 = redraft, 1-2 = dynasty/keeper
 */
export function isDynastyLeague(league: League): boolean {
  if (!league.settings) return false
  const leagueType = league.settings['type']
  return leagueType !== 0 && leagueType !== undefined
}

/**
 * Determines if a league is superflex format
 * A league is superflex if it has SUPER_FLEX position OR (FLEX + multiple QB slots)
 */
export function isSuperflexLeague(league: League): boolean {
  if (!league.roster_positions) return false

  // Check for explicit SUPER_FLEX position
  if (league.roster_positions.includes('SUPER_FLEX')) {
    return true
  }

  // Check for FLEX + multiple QBs (alternative superflex format)
  const hasFlexPosition = league.roster_positions.includes('FLEX')
  const qbCount = league.roster_positions.filter(pos => pos === 'QB').length
  return hasFlexPosition && qbCount > 1
}
