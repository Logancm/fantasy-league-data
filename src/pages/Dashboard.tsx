import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { League, Roster, User, Transaction, PlayersMap, SeasonData, Draft as DraftType, DraftPick, TradeValuesMap, RookieDraftPick } from '../types/sleeper'
import { getLeague, getRosters, getUsers, getAllTransactions, getPlayers, getLeagueHistory, getDrafts, getDraftPicks, getTradedPicks } from '../services/sleeperApi'
import { getPlayerTradeValues, calculateRosterValue } from '../services/tradeValues'
import { isDynastyLeague, isSuperflexLeague } from '../utils/league'
import { mockLeague, mockRosters, mockUsers, mockTransactions, mockPlayers, mockDrafts, mockDraftPicks, mockRookieDraftPicks } from '../utils/mockData'
import Standings from '../components/Standings'
import Teams from '../components/Users'
import Transactions from '../components/Transactions'
import RosterComponent from '../components/Roster'
import DraftComponent from '../components/Draft'
import { DEMO_LEAGUE_ID, ERROR_MESSAGES } from '../constants'
import { logger } from '../services/logger'
import { processTradedPicks } from '../utils/tradedPicks'

type Tab = 'standings' | 'users' | 'transactions' | 'roster' | 'draft'

export default function Dashboard() {
  const { leagueId } = useParams<{ leagueId: string }>()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<Tab>('standings')
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
  const [league, setLeague] = useState<League | null>(null)
  const [rosters, setRosters] = useState<Roster[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [players, setPlayers] = useState<PlayersMap>({})
  const [leagueHistory, setLeagueHistory] = useState<SeasonData[]>([])
  const [drafts, setDrafts] = useState<DraftType[]>([])
  const [draftPicks, setDraftPicks] = useState<Map<string, DraftPick[]>>(new Map())
  const [playerTradeValues, setPlayerTradeValues] = useState<Map<string, number>>(new Map())
  const [rosterValues, setRosterValues] = useState<Map<string, number>>(new Map())
  const [tradedPicks, setTradedPicks] = useState<RookieDraftPick[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      if (!leagueId) return

      try {
        setLoading(true)
        setError('')

        let leagueData, rostersData, usersData

        // Use mock data if demo league
        if (leagueId === DEMO_LEAGUE_ID) {
          leagueData = mockLeague
          rostersData = mockRosters
          usersData = mockUsers
        } else {
          // Fetch league, rosters, users in parallel
          ;[leagueData, rostersData, usersData] = await Promise.all([
            getLeague(leagueId),
            getRosters(leagueId),
            getUsers(leagueId),
          ])
        }

        setLeague(leagueData)
        setRosters(rostersData)
        setUsers(usersData)

        // Fetch transactions, players, league history, and drafts in background
        if (leagueId === DEMO_LEAGUE_ID) {
          setTransactions(mockTransactions)
          setPlayers(mockPlayers)
          setLeagueHistory([{ league: leagueData, rosters: rostersData, users: usersData }])
          setDrafts(mockDrafts)
          const picksMap = new Map<string, DraftPick[]>()
          mockDraftPicks.forEach(pick => {
            const picks = picksMap.get(pick.draft_id) || []
            picks.push(pick)
            picksMap.set(pick.draft_id, picks)
          })
          setDraftPicks(picksMap)
          setTradedPicks(mockRookieDraftPicks)
        } else {
          getAllTransactions(leagueId).then(setTransactions).catch(err => logger.error('Failed to fetch transactions', err))
          getPlayers().then(setPlayers).catch(err => logger.error('Failed to fetch players', err))
          getLeagueHistory(leagueId, 3).then(setLeagueHistory).catch(err => logger.error('Failed to fetch league history', err))
          getDrafts(leagueId).then(draftsData => {
            setDrafts(draftsData)
            // Fetch picks for each draft
            draftsData.forEach(draft => {
              getDraftPicks(draft.draft_id).then(picks => {
                setDraftPicks(prev => new Map(prev).set(draft.draft_id, picks))
              }).catch(err => logger.error('Failed to fetch draft picks', err))
            })
          }).catch(err => logger.error('Failed to fetch drafts', err))

          // Fetch traded picks to build future draft picks
          getTradedPicks(leagueId).then(tradedPicksData => {
            const picks = processTradedPicks(tradedPicksData, rostersData || [])
            setTradedPicks(picks)
          }).catch(err => logger.error('Failed to fetch traded picks', err))
        }

      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : ERROR_MESSAGES.FAILED_TO_FETCH_LEAGUE
        )
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [leagueId])

  // Fetch trade values when we have players data (only once)
  useEffect(() => {
    if (Object.keys(players).length === 0 || rosters.length === 0 || !league) return

    const isSuperflex = isSuperflexLeague(league)
    const isDynasty = isDynastyLeague(league)

    // Fetch trade values for all players (only once)
    const playersArray = Object.values(players)
    getPlayerTradeValues(playersArray, isSuperflex, isDynasty)
      .then(setPlayerTradeValues)
      .catch(err => {
        console.error('Failed to fetch trade values:', err)
        // Continue without trade values if API fails
        setPlayerTradeValues(new Map())
      })

    // Calculate value for each roster (in parallel to reduce calls)
    const valuePromises = rosters
      .filter(roster => roster.players && roster.owner_id)
      .map(roster =>
        calculateRosterValue(roster.players || [], players, isSuperflex, isDynasty)
          .then(value => ({ ownerId: String(roster.owner_id), value }))
          .catch(err => {
            console.error('Failed to calculate roster value:', err)
            return { ownerId: String(roster.owner_id), value: 0 }
          })
      )

    Promise.all(valuePromises).then(results => {
      const rostersMap = new Map<string, number>()
      results.forEach(({ ownerId, value }) => {
        rostersMap.set(ownerId, value)
      })
      setRosterValues(rostersMap)
    })
  }, [Object.keys(players).length, rosters.length, league?.roster_positions, league?.settings])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-600 border-t-primary-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading league data...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center px-4">
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-8 w-full max-w-md text-center">
          <p className="text-red-400 font-semibold mb-4">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="bg-primary-600 hover:bg-primary-500 text-white font-semibold py-2 px-6 rounded-lg transition duration-200"
          >
            Try Another League
          </button>
        </div>
      </div>
    )
  }

  if (!league) {
    return null
  }

  // Detect if league is superflex (has multiple QB slots)
  const isSuperflex = isSuperflexLeague(league)

  // Find selected user and their roster
  const selectedUser = selectedUserId ? users.find(u => u.user_id === selectedUserId) : null
  const selectedRoster = selectedUserId ? rosters.find(r => String(r.owner_id) === selectedUserId) : null

  // Get selected roster's total value
  const selectedRosterValue = selectedUserId ? rosterValues.get(selectedUserId) : undefined

  const handleSelectUser = (userId: string) => {
    setSelectedUserId(userId)
    setActiveTab('roster')
  }

  const handleBackFromRoster = () => {
    setSelectedUserId(null)
    setActiveTab('users')
  }

  const tabs: { label: string; value: Tab }[] = [
    { label: 'Standings', value: 'standings' },
    { label: 'Power Rankings', value: 'users' },
    { label: 'Roster', value: 'roster' },
    { label: 'Transactions', value: 'transactions' },
    { label: 'Draft', value: 'draft' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 overflow-hidden flex flex-col">
      {/* Header */}
      <div className="bg-gray-800 border-b border-primary-900/50 flex-shrink-0">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-2xl md:text-3xl font-bold text-white">{league.name}</h1>
            <button
              onClick={() => navigate('/')}
              className="text-primary-400 hover:text-primary-300 font-semibold text-sm"
            >
              ← Back
            </button>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-gray-400 text-sm">
              {league.total_rosters} Teams • {league.season} Season • {league.sport?.toUpperCase() || 'NFL'}
            </p>
            <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
              isDynastyLeague(league)
                ? 'bg-purple-900/50 text-purple-300 border border-purple-700'
                : 'bg-blue-900/50 text-blue-300 border border-blue-700'
            }`}>
              {isDynastyLeague(league) ? 'Dynasty' : 'Redraft'}
            </span>
            <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
              isSuperflexLeague(league)
                ? 'bg-green-900/50 text-green-300 border border-green-700'
                : 'bg-gray-700/50 text-gray-300 border border-gray-600'
            }`}>
              {isSuperflexLeague(league) ? 'Superflex' : 'Standard'}
            </span>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-gray-800 border-b border-gray-700 flex-shrink-0">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex gap-1 overflow-x-auto max-w-full">
            {tabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={`px-4 py-3 font-semibold text-sm whitespace-nowrap border-b-2 transition duration-200 ${
                  activeTab === tab.value
                    ? 'border-primary-500 text-primary-400'
                    : 'border-transparent text-gray-400 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className={`flex-1 overflow-y-auto mx-auto px-4 py-6 w-full ${activeTab === 'draft' ? '' : 'max-w-4xl'}`}>
        {activeTab === 'standings' && (
          <Standings leagueHistory={leagueHistory} currentUsers={users} />
        )}
        {activeTab === 'users' && (
          <Teams users={users} onSelectUser={handleSelectUser} rosterValues={rosterValues} />
        )}
        {activeTab === 'transactions' && (
          <Transactions transactions={transactions} users={users} rosters={rosters} players={players} />
        )}
        {activeTab === 'draft' && (
          <DraftComponent drafts={drafts} draftPicks={draftPicks} users={users} players={players} />
        )}
        {activeTab === 'roster' && (
          <RosterComponent
            roster={selectedRoster}
            user={selectedUser}
            players={players}
            users={users}
            selectedUserId={selectedUserId}
            onSelectUser={setSelectedUserId}
            playerTradeValues={playerTradeValues}
            rosterValue={selectedRosterValue}
            rookieDraftPicks={tradedPicks}
          />
        )}
      </div>
    </div>
  )
}
