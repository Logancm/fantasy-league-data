import { League, Roster, User, Transaction, PlayersMap, SeasonData, Draft, DraftPick, TradedPick } from '../types/sleeper'

const BASE_URL = 'https://api.sleeper.app/v1'

// Cache for players data (large ~5MB file, fetch once)
let playersCache: PlayersMap | null = null

export async function getLeague(leagueId: string): Promise<League> {
  const response = await fetch(`${BASE_URL}/league/${leagueId}`)
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('League not found. Please check your league ID.')
    }
    throw new Error(`Failed to fetch league: ${response.statusText}`)
  }
  const data = await response.json()
  if (!data) {
    throw new Error('League not found. Please check your league ID.')
  }
  return data
}

export async function getLeaguesByUsername(username: string, season?: number): Promise<League[]> {
  // First, get the user ID from the username
  const userResponse = await fetch(`${BASE_URL}/user/${username}`)
  if (!userResponse.ok) {
    if (userResponse.status === 404) {
      throw new Error('User not found. Please check your username.')
    }
    throw new Error(`Failed to fetch user: ${userResponse.statusText}`)
  }

  const user = await userResponse.json()
  const userId = user.user_id

  if (!userId) {
    throw new Error('Could not retrieve user ID.')
  }

  // Now fetch leagues using the user ID
  const url = season
    ? `${BASE_URL}/user/${userId}/leagues/nfl/${season}`
    : `${BASE_URL}/user/${userId}/leagues/nfl`

  const leaguesResponse = await fetch(url)
  if (!leaguesResponse.ok) {
    throw new Error(`Failed to fetch leagues: ${leaguesResponse.statusText}`)
  }

  const data = await leaguesResponse.json()
  return Array.isArray(data) ? data : []
}

export async function getRosters(leagueId: string): Promise<Roster[]> {
  const response = await fetch(`${BASE_URL}/league/${leagueId}/rosters`)
  if (!response.ok) {
    throw new Error(`Failed to fetch rosters: ${response.statusText}`)
  }
  return response.json()
}

export async function getUsers(leagueId: string): Promise<User[]> {
  const response = await fetch(`${BASE_URL}/league/${leagueId}/users`)
  if (!response.ok) {
    throw new Error(`Failed to fetch users: ${response.statusText}`)
  }
  return response.json()
}

export async function getTransactions(leagueId: string, week: number = 1): Promise<Transaction[]> {
  const response = await fetch(`${BASE_URL}/league/${leagueId}/transactions/${week}`)
  if (!response.ok) {
    throw new Error(`Failed to fetch transactions: ${response.statusText}`)
  }
  return response.json()
}

// Fetch all transactions for the season (all weeks)
export async function getAllTransactions(leagueId: string, totalWeeks: number = 18): Promise<Transaction[]> {
  const allTransactions: Transaction[] = []

  // Fetch transactions for each week in parallel
  const promises = Array.from({ length: totalWeeks }, (_, i) =>
    getTransactions(leagueId, i + 1).catch(() => [])
  )

  const results = await Promise.all(promises)
  results.forEach(transactions => {
    allTransactions.push(...transactions)
  })

  // Sort by timestamp, most recent first
  return allTransactions.sort((a, b) => b.status_updated - a.status_updated)
}

// Fetch players data (cached)
export async function getPlayers(): Promise<PlayersMap> {
  if (playersCache) {
    return playersCache
  }

  const response = await fetch(`${BASE_URL}/players/nfl`)
  if (!response.ok) {
    throw new Error(`Failed to fetch players: ${response.statusText}`)
  }

  playersCache = await response.json()
  return playersCache!
}

// Fetch league history (follows previous_league_id chain)
export async function getLeagueHistory(leagueId: string, maxYears: number = 3): Promise<SeasonData[]> {
  const history: SeasonData[] = []
  let currentLeagueId: string | null = leagueId

  while (currentLeagueId && history.length < maxYears) {
    try {
      const [league, rosters, users] = await Promise.all([
        getLeague(currentLeagueId),
        getRosters(currentLeagueId),
        getUsers(currentLeagueId),
      ])

      history.push({ league, rosters, users })
      currentLeagueId = league.previous_league_id || null
    } catch {
      break
    }
  }

  return history
}

// Helper to get player name from ID
export function getPlayerName(playerId: string, players: PlayersMap): string {
  const player = players[playerId]
  if (!player) return `Player ${playerId}`
  return player.full_name || `${player.first_name} ${player.last_name}`
}

// Helper to get player info
export function getPlayerInfo(playerId: string, players: PlayersMap) {
  const player = players[playerId]
  if (!player) return { name: `Player ${playerId}`, position: '', team: '' }
  return {
    name: player.full_name || `${player.first_name} ${player.last_name}`,
    position: player.position || '',
    team: player.team || 'FA'
  }
}

// Fetch all drafts for a league and its previous leagues
export async function getDrafts(leagueId: string, maxYears: number = 3): Promise<Draft[]> {
  const allDrafts: Draft[] = []
  const seenSeasons = new Set<string>()
  let currentLeagueId: string | null = leagueId

  while (currentLeagueId && seenSeasons.size < maxYears) {
    try {
      const league = await getLeague(currentLeagueId)
      const response = await fetch(`${BASE_URL}/league/${currentLeagueId}/drafts`)

      if (response.ok) {
        const data = await response.json()
        if (Array.isArray(data)) {
          data.forEach(draft => {
            // Validate draft has required fields
            if (draft && draft.draft_id && draft.draft_order && !seenSeasons.has(draft.season)) {
              seenSeasons.add(draft.season)
              allDrafts.push(draft)
            }
          })
        }
      }

      currentLeagueId = league.previous_league_id || null
    } catch {
      break
    }
  }

  return allDrafts
}

// Fetch all picks for a specific draft
export async function getDraftPicks(draftId: string): Promise<DraftPick[]> {
  const response = await fetch(`${BASE_URL}/draft/${draftId}/picks`)
  if (!response.ok) {
    if (response.status === 404) {
      return []
    }
    throw new Error(`Failed to fetch draft picks: ${response.statusText}`)
  }
  const data = await response.json()
  if (!Array.isArray(data)) {
    return []
  }

  // Filter out picks with missing critical metadata
  return data.filter(pick =>
    pick &&
    pick.metadata &&
    pick.metadata.first_name &&
    pick.metadata.last_name &&
    pick.metadata.position &&
    pick.draft_slot &&
    pick.round &&
    pick.picked_by
  )
}

// Fetch traded picks for a league (future picks that have been traded)
export async function getTradedPicks(leagueId: string): Promise<TradedPick[]> {
  const response = await fetch(`${BASE_URL}/league/${leagueId}/traded_picks`)
  if (!response.ok) {
    if (response.status === 404) {
      return []
    }
    throw new Error(`Failed to fetch traded picks: ${response.statusText}`)
  }
  const data = await response.json()
  return Array.isArray(data) ? (data as TradedPick[]) : []
}
