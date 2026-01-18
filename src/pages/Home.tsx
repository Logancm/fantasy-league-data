import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Home() {
  const [leagueId, setLeagueId] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!leagueId.trim()) {
      setError('Please enter a league ID')
      return
    }

    setError('')
    navigate(`/league/${leagueId}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center px-4">
      <div className="bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Fantasy League Data
          </h1>
          <p className="text-slate-400">
            Enter your Sleeper league ID to view stats
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="leagueId" className="block text-sm font-medium text-slate-300 mb-2">
              League ID
            </label>
            <input
              id="leagueId"
              type="text"
              placeholder="e.g., 123456789"
              value={leagueId}
              onChange={(e) => setLeagueId(e.target.value)}
              className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
            />
          </div>

          {error && (
            <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 px-4 rounded-lg transition duration-200"
          >
            View League
          </button>
        </form>

        <p className="text-center text-slate-500 text-xs mt-6">
          Find your league ID in the Sleeper app under League Settings
        </p>
      </div>
    </div>
  )
}
