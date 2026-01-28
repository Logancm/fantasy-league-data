import { TradeValue, TradeValuesMap, PlayersMap, Player } from '../types/sleeper'

// Use proxy endpoint (works on both local dev and production)
const DYNASTY_URL = `/api/proxy?type=dynasty`
const REDRAFT_URL = `/api/proxy?type=redraft`

// Separate caches for standard and superflex
let tradeValuesCacheSF: TradeValuesMap | null = null
let tradeValuesCacheStandard: TradeValuesMap | null = null
let cacheTimestampSF: number = 0
let cacheTimestampStandard: number = 0
let fetchInProgressSF: Promise<TradeValuesMap> | null = null
let fetchInProgressStandard: Promise<TradeValuesMap> | null = null
const CACHE_DURATION_MS = 24 * 60 * 60 * 1000 // 24 hours

/**
 * Build name_id variants from player name (matches Dynasty Daddy format)
 * Tries multiple formats to handle various name patterns
 */
function buildNameIds(player: Player): string[] {
  const variants: string[] = []

  // Remove special characters and spaces from names
  const firstName = (player.first_name || '')
    .toLowerCase()
    .replace(/[\s\-']/g, '')
    .replace(/[^\w]/g, '')

  const lastName = (player.last_name || '')
    .toLowerCase()
    .replace(/[\s\-']/g, '')
    .replace(/[^\w]/g, '')

  const position = (player.position || '').toLowerCase()

  // Primary format: firstnamelastname + position
  variants.push(`${firstName}${lastName}${position}`)

  // Alternative: first initial + lastname + position
  if (firstName.length > 0 && lastName.length > 0) {
    variants.push(`${firstName.charAt(0)}${lastName}${position}`)
  }

  return variants
}

/**
 * Fetch trade values from Dynasty Daddy API
 * @param isSuperflex - If true, use superflex values; otherwise use standard values
 * @param isDynasty - If true, fetch dynasty values; otherwise fetch redraft values
 */
async function fetchTradeValues(isSuperflex: boolean = false, isDynasty: boolean = false): Promise<TradeValue[]> {
  const url = isDynasty ? DYNASTY_URL : REDRAFT_URL
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`Failed to fetch trade values: ${response.statusText}`)
  }

  return response.json()
}

/**
 * Get trade values as a map indexed by name_id for fast lookups
 * Uses cache if available and not stale
 */
async function getTradeValuesMap(isSuperflex: boolean = false, isDynasty: boolean = false): Promise<TradeValuesMap> {
  const now = Date.now()
  const cache = isSuperflex ? tradeValuesCacheSF : tradeValuesCacheStandard
  const timestamp = isSuperflex ? cacheTimestampSF : cacheTimestampStandard
  const fetchInProgress = isSuperflex ? fetchInProgressSF : fetchInProgressStandard

  // Return cache if valid
  if (cache && (now - timestamp) < CACHE_DURATION_MS) {
    return cache
  }

  // Return existing fetch if one is already in progress
  if (fetchInProgress) {
    return fetchInProgress
  }

  // Start fetch
  const fetchPromise = (async () => {
    try {
      const values = await fetchTradeValues(isSuperflex, isDynasty)
      const map: TradeValuesMap = {}

      values.forEach(value => {
        map[value.name_id] = value
      })

      // Update cache
      if (isSuperflex) {
        tradeValuesCacheSF = map
        cacheTimestampSF = now
        fetchInProgressSF = null
      } else {
        tradeValuesCacheStandard = map
        cacheTimestampStandard = now
        fetchInProgressStandard = null
      }

      return map
    } catch (error) {
      // Clear fetch in progress on error
      if (isSuperflex) {
        fetchInProgressSF = null
      } else {
        fetchInProgressStandard = null
      }
      throw error
    }
  })()

  // Store fetch in progress
  if (isSuperflex) {
    fetchInProgressSF = fetchPromise
  } else {
    fetchInProgressStandard = fetchPromise
  }

  return fetchPromise
}

/**
 * Get trade value for a specific player
 * @param player - The player object
 * @param isSuperflex - If true, return sf_trade_value; otherwise return trade_value
 * @param isDynasty - If true, fetch dynasty values; otherwise fetch redraft values
 */
export async function getPlayerTradeValue(
  player: Player,
  isSuperflex: boolean = false,
  isDynasty: boolean = false
): Promise<number | null> {
  try {
    const nameIds = buildNameIds(player)
    const valuesMap = await getTradeValuesMap(isSuperflex, isDynasty)

    // Try each variant
    for (const nameId of nameIds) {
      const tradeValue = valuesMap[nameId]
      if (tradeValue) {
        return isSuperflex ? tradeValue.sf_trade_value : tradeValue.trade_value
      }
    }

    return null
  } catch (error) {
    console.error('Error fetching player trade value:', error)
    return null
  }
}

/**
 * Get trade values for multiple players
 * @param players - Array of player objects
 * @param isSuperflex - If true, return sf_trade_value for each; otherwise return trade_value
 * @param isDynasty - If true, fetch dynasty values; otherwise fetch redraft values
 */
export async function getPlayerTradeValues(
  players: Player[],
  isSuperflex: boolean = false,
  isDynasty: boolean = false
): Promise<Map<string, number>> {
  try {
    const valuesMap = await getTradeValuesMap(isSuperflex, isDynasty)
    const result = new Map<string, number>()
    let matchCount = 0

    players.forEach(player => {
      const nameIds = buildNameIds(player)

      // Try each variant
      for (const nameId of nameIds) {
        const tradeValue = valuesMap[nameId]
        if (tradeValue) {
          const value = isSuperflex ? tradeValue.sf_trade_value : tradeValue.trade_value
          result.set(player.player_id, value)
          matchCount++
          break // Found a match, move to next player
        }
      }
    })

    console.log(`Matched ${matchCount} of ${players.length} players with trade values (${isDynasty ? 'Dynasty' : 'Redraft'}, ${isSuperflex ? 'SF' : 'Standard'})`)
    return result
  } catch (error) {
    console.error('Error fetching player trade values:', error)
    return new Map()
  }
}

/**
 * Calculate total roster value
 * @param playerIds - Array of player IDs on the roster
 * @param playersMap - Map of player data indexed by player_id
 * @param isSuperflex - If true, use superflex values; otherwise use standard values
 * @param isDynasty - If true, fetch dynasty values; otherwise fetch redraft values
 */
export async function calculateRosterValue(
  playerIds: string[],
  playersMap: Record<string, Player>,
  isSuperflex: boolean = false,
  isDynasty: boolean = false
): Promise<number> {
  try {
    const players = playerIds
      .map(id => playersMap[id])
      .filter((p): p is Player => p !== undefined)

    const tradeValues = await getPlayerTradeValues(players, isSuperflex, isDynasty)

    let total = 0
    playerIds.forEach(id => {
      const value = tradeValues.get(id)
      if (value) {
        total += value
      }
    })

    return total
  } catch (error) {
    console.error('Error calculating roster value:', error)
    return 0
  }
}
