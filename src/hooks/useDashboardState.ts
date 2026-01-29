import { useState } from 'react'
import { League, Roster, User, Transaction, PlayersMap, SeasonData, Draft, DraftPick, TradeValuesMap, RookieDraftPick } from '../types/sleeper'

export type Tab = 'standings' | 'users' | 'transactions' | 'roster' | 'draft'

interface DashboardState {
  // UI State
  activeTab: Tab
  selectedUserId: string | null
  loading: boolean
  error: string
  draftError: string
  draftLoading: boolean

  // Background data loading states
  transactionsLoading: boolean
  transactionsError: string
  playersLoading: boolean
  playersError: string
  leagueHistoryLoading: boolean
  leagueHistoryError: string

  // Data
  league: League | null
  rosters: Roster[]
  users: User[]
  transactions: Transaction[]
  players: PlayersMap
  leagueHistory: SeasonData[]
  drafts: Draft[]
  draftPicks: Map<string, DraftPick[]>
  playerTradeValues: Map<string, number>
  rosterValues: Map<string, number>
  tradedPicks: RookieDraftPick[]
}

interface DashboardActions {
  // UI Actions
  setActiveTab: (tab: Tab) => void
  setSelectedUserId: (userId: string | null) => void
  setLoading: (loading: boolean) => void
  setError: (error: string) => void
  setDraftError: (error: string) => void
  setDraftLoading: (loading: boolean) => void

  // Background loading state actions
  setTransactionsLoading: (loading: boolean) => void
  setTransactionsError: (error: string) => void
  setPlayersLoading: (loading: boolean) => void
  setPlayersError: (error: string) => void
  setLeagueHistoryLoading: (loading: boolean) => void
  setLeagueHistoryError: (error: string) => void

  // Data Actions
  setLeague: (league: League | null) => void
  setRosters: (rosters: Roster[]) => void
  setUsers: (users: User[]) => void
  setTransactions: (transactions: Transaction[]) => void
  setPlayers: (players: PlayersMap) => void
  setLeagueHistory: (history: SeasonData[]) => void
  setDrafts: (drafts: Draft[]) => void
  setDraftPicks: (picks: Map<string, DraftPick[]>) => void
  setPlayerTradeValues: (values: Map<string, number>) => void
  setRosterValues: (values: Map<string, number>) => void
  setTradedPicks: (picks: RookieDraftPick[]) => void
}

/**
 * Custom hook to manage all Dashboard state
 * Consolidates all useState calls into organized state management
 */
export function useDashboardState(): [DashboardState, DashboardActions] {
  // UI State
  const [activeTab, setActiveTab] = useState<Tab>('standings')
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [draftError, setDraftError] = useState('')
  const [draftLoading, setDraftLoading] = useState(false)

  // Background loading states
  const [transactionsLoading, setTransactionsLoading] = useState(false)
  const [transactionsError, setTransactionsError] = useState('')
  const [playersLoading, setPlayersLoading] = useState(false)
  const [playersError, setPlayersError] = useState('')
  const [leagueHistoryLoading, setLeagueHistoryLoading] = useState(false)
  const [leagueHistoryError, setLeagueHistoryError] = useState('')

  // Data State
  const [league, setLeague] = useState<League | null>(null)
  const [rosters, setRosters] = useState<Roster[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [players, setPlayers] = useState<PlayersMap>({})
  const [leagueHistory, setLeagueHistory] = useState<SeasonData[]>([])
  const [drafts, setDrafts] = useState<Draft[]>([])
  const [draftPicks, setDraftPicks] = useState<Map<string, DraftPick[]>>(new Map())
  const [playerTradeValues, setPlayerTradeValues] = useState<Map<string, number>>(new Map())
  const [rosterValues, setRosterValues] = useState<Map<string, number>>(new Map())
  const [tradedPicks, setTradedPicks] = useState<RookieDraftPick[]>([])

  const state: DashboardState = {
    activeTab,
    selectedUserId,
    loading,
    error,
    draftError,
    draftLoading,
    transactionsLoading,
    transactionsError,
    playersLoading,
    playersError,
    leagueHistoryLoading,
    leagueHistoryError,
    league,
    rosters,
    users,
    transactions,
    players,
    leagueHistory,
    drafts,
    draftPicks,
    playerTradeValues,
    rosterValues,
    tradedPicks,
  }

  const actions: DashboardActions = {
    setActiveTab,
    setSelectedUserId,
    setLoading,
    setError,
    setDraftError,
    setDraftLoading,
    setTransactionsLoading,
    setTransactionsError,
    setPlayersLoading,
    setPlayersError,
    setLeagueHistoryLoading,
    setLeagueHistoryError,
    setLeague,
    setRosters,
    setUsers,
    setTransactions,
    setPlayers,
    setLeagueHistory,
    setDrafts,
    setDraftPicks,
    setPlayerTradeValues,
    setRosterValues,
    setTradedPicks,
  }

  return [state, actions]
}
