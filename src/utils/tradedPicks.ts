import { Roster, RookieDraftPick, TradedPick } from '../types/sleeper'

/**
 * Process traded picks to build a map of rookie picks
 * Handles both traded and original picks
 */
export function processTradedPicks(
  tradedPicksData: TradedPick[],
  rostersData: Roster[]
): RookieDraftPick[] {
  const rookiePicksMap = new Map<string, RookieDraftPick>()
  const tradedAwayPicks = new Set<string>()
  const maxRoundByYear = new Map<string, number>()

  // Process traded picks and find max round per year
  tradedPicksData.forEach(tradedPick => {
    // Track the highest round seen for each year
    const currentMax = maxRoundByYear.get(String(tradedPick.season)) || 0
    if (tradedPick.round > currentMax) {
      maxRoundByYear.set(String(tradedPick.season), tradedPick.round)
    }

    // If owner_id !== roster_id, this pick was traded away from original owner
    if (tradedPick.owner_id !== tradedPick.roster_id) {
      // This pick was traded away, mark it so we don't generate it as an original pick
      const tradedAwayKey = `${tradedPick.season}-${tradedPick.round}-${tradedPick.roster_id}`
      tradedAwayPicks.add(tradedAwayKey)
    }

    // Create unique key using both original_slot and owner_id to allow multiple picks per owner per round
    const key = `${tradedPick.season}-${tradedPick.round}-${tradedPick.roster_id}-${tradedPick.owner_id}`

    // Find which user currently owns this pick
    const currentRoster = rostersData?.find(r => r.roster_id === tradedPick.owner_id)
    const currentUserId = currentRoster?.owner_id

    // Find which user originally owned this pick
    const originalRoster = rostersData?.find(r => r.roster_id === tradedPick.roster_id)
    const originalUserId = originalRoster?.owner_id

    // Add the pick to whoever currently owns it, with original owner info if traded
    rookiePicksMap.set(key, {
      season: String(tradedPick.season),
      round: tradedPick.round,
      original_slot: tradedPick.original_slot,
      roster_id: tradedPick.owner_id,
      owner_id: originalUserId // Store the original owner's user_id for display
    })
  })

  // Add original picks that haven't been traded away
  const futureYears = getFutureDraftYears()
  rostersData?.forEach(roster => {
    if (roster.roster_id && roster.owner_id) {
      // Check future years dynamically
      for (let year of futureYears) {
        // Get the max round for this year, or default to 4
        const maxRound = maxRoundByYear.get(String(year)) || 4

        // Check all rounds up to the max seen
        for (let round = 1; round <= maxRound; round++) {
          // Check if this team traded away their pick for this year/round
          const tradedAwayKey = `${year}-${round}-${roster.roster_id}`

          // Only add if this pick wasn't traded away
          if (!tradedAwayPicks.has(tradedAwayKey)) {
            const pickKey = `${year}-${round}-${roster.roster_id}-${roster.roster_id}`
            rookiePicksMap.set(pickKey, {
              season: String(year),
              round: round,
              original_slot: roster.roster_id,
              roster_id: roster.roster_id
            })
          }
        }
      }
    }
  })

  return Array.from(rookiePicksMap.values())
}

/**
 * Get the future draft years (next 2 years from current date)
 */
function getFutureDraftYears(): number[] {
  const currentYear = new Date().getFullYear()
  return [currentYear + 1, currentYear + 2]
}
