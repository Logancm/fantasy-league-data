import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getLeaguesByUsername } from '../services/sleeperApi'
import { League } from '../types/sleeper'
import { mockLeague, mockRosters, mockUsers, mockTransactions, mockPlayers } from '../utils/mockData'
import { DEMO_LEAGUE_ID, ERROR_MESSAGES } from '../constants'
import { getSeasonYears } from '../utils/season'

type Tab = 'league-id' | 'username'

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>('username')
  const [leagueId, setLeagueId] = useState('')
  const [username, setUsername] = useState('')
  const [leagues, setLeagues] = useState<League[]>([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleLeagueIdSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const trimmedId = leagueId.trim()
    if (!trimmedId) {
      setError(ERROR_MESSAGES.INVALID_INPUT)
      return
    }

    if (trimmedId.length < 5) {
      setError('League ID must be at least 5 characters')
      return
    }

    setError('')
    navigate(`/league/${trimmedId}`)
  }

  const handleUsernameSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const trimmedUsername = username.trim()
    if (!trimmedUsername) {
      setError(ERROR_MESSAGES.INVALID_INPUT)
      return
    }

    if (trimmedUsername.length < 2) {
      setError('Username must be at least 2 characters')
      return
    }

    if (trimmedUsername.length > 20) {
      setError('Username must not exceed 20 characters')
      return
    }

    try {
      setLoading(true)
      setError('')
      const [currentYear, previousYear] = getSeasonYears()

      // Fetch leagues from current year and previous year
      const [currentYearLeagues, previousYearLeagues] = await Promise.all([
        getLeaguesByUsername(trimmedUsername, currentYear).catch(() => []),
        getLeaguesByUsername(trimmedUsername, previousYear).catch(() => []),
      ])

      // Deduplicate leagues by name, keeping the newest (highest season)
      const leagueMap = new Map<string, League>()

      // Add all leagues to the map, but keep only the newest version of each league
      ;[...currentYearLeagues, ...previousYearLeagues].forEach((league) => {
        const existingLeague = leagueMap.get(league.name)

        if (!existingLeague || parseInt(league.season) > parseInt(existingLeague.season)) {
          leagueMap.set(league.name, league)
        }
      })

      const allLeagues = Array.from(leagueMap.values())

      if (allLeagues.length === 0) {
        setError(ERROR_MESSAGES.NO_LEAGUES_FOUND(trimmedUsername))
      } else {
        setLeagues(allLeagues)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : ERROR_MESSAGES.FAILED_TO_FETCH_LEAGUE)
    } finally {
      setLoading(false)
    }
  }

  const handleSelectLeague = (leagueId: string) => {
    navigate(`/league/${leagueId}`)
  }

  const handleDemoClick = () => {
    // Navigate to demo league with mock data
    navigate(`/league/${DEMO_LEAGUE_ID}`)
  }

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab)
    setError('')
    setLeagues([])
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center px-4">
      <div className="bg-gray-800 border border-primary-900/50 rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Fantasy League Data
          </h1>
          <p className="text-gray-400">
            Find your league and view stats
          </p>
          <button
            onClick={handleDemoClick}
            className="mt-3 text-sm text-primary-400 hover:text-primary-300 underline"
          >
            Or try a demo →
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6 border-b border-gray-700">
          <button
            onClick={() => handleTabChange('username')}
            className={`flex-1 py-2 font-semibold text-sm transition ${
              activeTab === 'username'
                ? 'text-primary-400 border-b-2 border-primary-500'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            By Username
          </button>
          <button
            onClick={() => handleTabChange('league-id')}
            className={`flex-1 py-2 font-semibold text-sm transition ${
              activeTab === 'league-id'
                ? 'text-primary-400 border-b-2 border-primary-500'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            League ID
          </button>
        </div>

        {/* League ID Tab */}
        {activeTab === 'league-id' && (
          <form onSubmit={handleLeagueIdSubmit} className="space-y-4">
            <div>
              <label htmlFor="leagueId" className="block text-sm font-medium text-gray-300 mb-2">
                League ID
              </label>
              <input
                id="leagueId"
                type="text"
                placeholder="e.g., 123456789"
                value={leagueId}
                onChange={(e) => setLeagueId(e.target.value)}
                className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
              />
            </div>

            {error && (
              <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-primary-600 hover:bg-primary-500 text-white font-semibold py-3 px-4 rounded-lg transition duration-200"
            >
              View League
            </button>

            <p className="text-center text-gray-500 text-xs">
              Find your league ID in the Sleeper app under General settings
            </p>
          </form>
        )}

        {/* Username Tab */}
        {activeTab === 'username' && (
          <>
            <form onSubmit={handleUsernameSubmit} className="space-y-4">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-2">
                  Sleeper Username
                </label>
                <input
                  id="username"
                  type="text"
                  placeholder="e.g., player123"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={loading}
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition disabled:opacity-50"
                />
              </div>

              {error && (
                <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary-600 hover:bg-primary-500 disabled:opacity-50 text-white font-semibold py-3 px-4 rounded-lg transition duration-200"
              >
                {loading ? 'Searching...' : 'Search Leagues'}
              </button>
            </form>

            {/* Leagues List */}
            {leagues.length > 0 && (
              <div className="mt-6 space-y-2 max-h-96 overflow-y-auto">
                <p className="text-sm text-gray-400 mb-3">Found {leagues.length} league(s):</p>
                {leagues.map((league) => (
                  <button
                    key={league.league_id}
                    onClick={() => handleSelectLeague(league.league_id)}
                    className="w-full text-left bg-gray-700 hover:bg-gray-600 px-4 py-3 rounded-lg transition border border-gray-600 hover:border-primary-500"
                  >
                    <div className="font-semibold text-white">{league.name}</div>
                    <div className="text-xs text-gray-400 mt-1">
                      {league.season} • {league.total_rosters} teams • {league.sport?.toUpperCase()}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
