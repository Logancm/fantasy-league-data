export interface League {
  league_id: string
  name: string
  season: string
  total_rosters: number
  status: string
  sport: string
  previous_league_id?: string | null
  settings?: Record<string, number>
  scoring_settings?: Record<string, number>
  roster_positions?: string[]
}

export interface Roster {
  roster_id: number
  owner_id: string | null
  league_id: string
  players?: string[]
  starters?: string[]
  settings: {
    wins: number
    losses: number
    ties: number
    fpts: number
    fpts_decimal?: number
    fpts_against?: number
    fpts_against_decimal?: number
  }
}

export interface User {
  user_id: string
  username: string
  display_name: string
  avatar?: string | null
  metadata?: {
    team_name?: string
    [key: string]: unknown
  }
  is_owner?: boolean
}

export interface Transaction {
  transaction_id: string
  type: 'trade' | 'waiver' | 'free_agent' | 'commissioner'
  creator: string
  created: number
  status_updated: number
  status: string
  leg: number
  adds: Record<string, string> | null
  drops: Record<string, string> | null
  draft_picks: unknown[]
  roster_ids: number[]
  consenter_ids?: number[]
  settings?: Record<string, unknown> | null
  waiver_budget?: unknown[]
}

export interface Player {
  player_id: string
  first_name: string
  last_name: string
  full_name?: string
  position: string
  team: string | null
  age?: number
  status?: string
}

export type PlayersMap = Record<string, Player>

export interface SeasonData {
  league: League
  rosters: Roster[]
  users: User[]
}

export interface Draft {
  draft_id: string
  league_id: string
  season: string
  type: string
  status: string
  start_time: number
  sport: string
  settings: Record<string, number>
  metadata?: Record<string, unknown>
  draft_order: Record<string, number>
  slot_to_roster_id: Record<string, number>
}

export interface DraftPick {
  player_id: string
  picked_by: string
  roster_id: number
  round: number
  draft_slot: number
  pick_no: number
  original_slot: number
  metadata: {
    first_name: string
    last_name: string
    position: string
    team: string
    [key: string]: unknown
  }
  is_keeper: boolean | null
  draft_id: string
}
