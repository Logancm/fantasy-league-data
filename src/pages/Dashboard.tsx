import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { League, Roster, User, Transaction, PlayersMap, SeasonData, Draft as DraftType, DraftPick } from '../types/sleeper'
import { getLeague, getRosters, getUsers, getAllTransactions, getPlayers, getLeagueHistory, getDrafts, getDraftPicks } from '../services/sleeperApi'
import Standings from '../components/Standings'
import Users from '../components/Users'
import Transactions from '../components/Transactions'
import RosterComponent from '../components/Roster'
import DraftComponent from '../components/Draft'

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
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      if (!leagueId) return

      try {
        setLoading(true)
        setError('')

        // Fetch league, rosters, users in parallel
        const [leagueData, rostersData, usersData] = await Promise.all([
          getLeague(leagueId),
          getRosters(leagueId),
          getUsers(leagueId),
        ])

        setLeague(leagueData)
        setRosters(rostersData)
        setUsers(usersData)

        // Fetch transactions, players, league history, and drafts in background
        getAllTransactions(leagueId).then(setTransactions).catch(console.error)
        getPlayers().then(setPlayers).catch(console.error)
        getLeagueHistory(leagueId, 3).then(setLeagueHistory).catch(console.error)
        getDrafts(leagueId).then(draftsData => {
          setDrafts(draftsData)
          // Fetch picks for each draft
          draftsData.forEach(draft => {
            getDraftPicks(draft.draft_id).then(picks => {
              setDraftPicks(prev => new Map(prev).set(draft.draft_id, picks))
            }).catch(console.error)
          })
        }).catch(console.error)

      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'Failed to load league data. Please check the league ID and try again.'
        )
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [leagueId])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-slate-600 border-t-indigo-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400">Loading league data...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center px-4">
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-8 w-full max-w-md text-center">
          <p className="text-red-400 font-semibold mb-4">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2 px-6 rounded-lg transition duration-200"
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

  // Find selected user and their roster
  const selectedUser = selectedUserId ? users.find(u => u.user_id === selectedUserId) : null
  const selectedRoster = selectedUserId ? rosters.find(r => String(r.owner_id) === selectedUserId) : null

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
    { label: 'Users', value: 'users' },
    { label: 'Transactions', value: 'transactions' },
    { label: 'Draft', value: 'draft' },
    ...(selectedUserId ? [{ label: 'Roster', value: 'roster' as const }] : []),
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 overflow-hidden flex flex-col">
      {/* Header */}
      <div className="bg-slate-800 border-b border-slate-700 flex-shrink-0">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-2xl md:text-3xl font-bold text-white">{league.name}</h1>
            <button
              onClick={() => navigate('/')}
              className="text-indigo-400 hover:text-indigo-300 font-semibold text-sm"
            >
              ← Back
            </button>
          </div>
          <p className="text-slate-400 text-sm">
            {league.total_rosters} Teams • {league.season} Season • {league.sport?.toUpperCase() || 'NFL'}
          </p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-slate-800 border-b border-slate-700 flex-shrink-0">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex gap-1 overflow-x-auto max-w-full">
            {tabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={`px-4 py-3 font-semibold text-sm whitespace-nowrap border-b-2 transition duration-200 ${
                  activeTab === tab.value
                    ? 'border-indigo-500 text-indigo-400'
                    : 'border-transparent text-slate-400 hover:text-white'
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
          <Users users={users} onSelectUser={handleSelectUser} />
        )}
        {activeTab === 'transactions' && (
          <Transactions transactions={transactions} users={users} rosters={rosters} players={players} />
        )}
        {activeTab === 'draft' && (
          <DraftComponent drafts={drafts} draftPicks={draftPicks} users={users} players={players} />
        )}
        {activeTab === 'roster' && (
          <RosterComponent roster={selectedRoster} user={selectedUser} players={players} onBack={handleBackFromRoster} />
        )}
      </div>
    </div>
  )
}
