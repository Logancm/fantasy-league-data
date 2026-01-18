import { Roster, PlayersMap, User } from '../types/sleeper'

interface RosterProps {
  roster: Roster | null
  user: User | null
  players: PlayersMap
  onBack: () => void
}

// Position color mapping
const getPositionColor = (position: string): { bg: string; border: string; badge: string } => {
  switch (position) {
    case 'QB':
      return { bg: 'bg-red-900/40', border: 'border-red-500', badge: 'bg-red-500' }
    case 'RB':
      return { bg: 'bg-green-900/40', border: 'border-green-500', badge: 'bg-green-500' }
    case 'WR':
      return { bg: 'bg-blue-900/40', border: 'border-blue-500', badge: 'bg-blue-500' }
    case 'TE':
      return { bg: 'bg-amber-900/40', border: 'border-amber-500', badge: 'bg-amber-500' }
    case 'K':
      return { bg: 'bg-yellow-900/40', border: 'border-yellow-500', badge: 'bg-yellow-500' }
    case 'DEF':
    case 'D':
      return { bg: 'bg-purple-900/40', border: 'border-purple-500', badge: 'bg-purple-500' }
    default:
      return { bg: 'bg-slate-800', border: 'border-slate-600', badge: 'bg-slate-500' }
  }
}

const PlayerCard = ({ playerId, isStarter }: { playerId: string; isStarter: boolean }, players: PlayersMap) => {
  const player = players[playerId]
  if (!player) return null

  const colors = getPositionColor(player.position || '')

  return (
    <div
      key={playerId}
      className={`${colors.bg} border-2 ${colors.border} rounded-lg p-4 transition-all hover:shadow-lg hover:shadow-slate-900/50`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="font-bold text-white truncate text-base">
            {player.full_name || `${player.first_name} ${player.last_name}`}
          </p>
          <div className="flex items-center gap-2 mt-1">
            <span className={`${colors.badge} text-white text-xs font-bold px-2 py-1 rounded`}>
              {player.position}
            </span>
            <p className="text-sm text-slate-300">
              {player.team || 'FA'}
            </p>
          </div>
        </div>
        {isStarter && (
          <div className="flex-shrink-0 bg-indigo-600 text-white text-xs font-bold px-2 py-1 rounded">
            S
          </div>
        )}
      </div>
    </div>
  )
}

// Get unique positions from a list of player IDs
const getPositionsFromPlayers = (playerIds: string[], playersMap: PlayersMap): string[] => {
  const positions = new Set<string>()
  playerIds.forEach((id) => {
    const player = playersMap[id]
    if (player?.position) {
      positions.add(player.position)
    }
  })
  return Array.from(positions).sort((a, b) => {
    const order = ['QB', 'RB', 'WR', 'TE', 'K', 'DEF', 'D']
    return (order.indexOf(a) || 999) - (order.indexOf(b) || 999)
  })
}

// Get players for a specific position
const getPlayersByPosition = (playerIds: string[], position: string, playersMap: PlayersMap): string[] => {
  return playerIds.filter((id) => {
    const player = playersMap[id]
    return player?.position === position
  })
}

export default function RosterComponent({ roster, user, players, onBack }: RosterProps) {
  if (!roster || !user) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-400">Select a team to view roster</p>
      </div>
    )
  }

  const teamName = user.metadata?.team_name || user.display_name
  const playerList = roster.players || []
  const startersList = roster.starters || []
  const benchPlayers = playerList.filter((id) => !startersList.includes(id))
  const benchPositions = getPositionsFromPlayers(benchPlayers, players)

  return (
    <div>
      <div className="mb-6">
        <button
          onClick={onBack}
          className="text-indigo-400 hover:text-indigo-300 font-semibold text-sm mb-4"
        >
          ← Back to Users
        </button>
        <div className="bg-gradient-to-r from-indigo-900/30 to-purple-900/30 border border-indigo-500 rounded-lg p-6">
          <h2 className="text-3xl font-bold text-white mb-1">{teamName}</h2>
          <p className="text-indigo-300 mb-4">@{user.display_name}</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-slate-800/50 rounded-lg p-3">
              <p className="text-slate-400 text-xs font-semibold uppercase mb-1">Wins</p>
              <p className="text-2xl font-bold text-white">
                {roster.settings?.wins || 0}
              </p>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-3">
              <p className="text-slate-400 text-xs font-semibold uppercase mb-1">Losses</p>
              <p className="text-2xl font-bold text-white">
                {roster.settings?.losses || 0}
              </p>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-3">
              <p className="text-slate-400 text-xs font-semibold uppercase mb-1">Points For</p>
              <p className="text-2xl font-bold text-green-400">
                {((roster.settings?.fpts || 0) + (roster.settings?.fpts_decimal || 0) / 100).toFixed(0)}
              </p>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-3">
              <p className="text-slate-400 text-xs font-semibold uppercase mb-1">Points Ag.</p>
              <p className="text-2xl font-bold text-red-400">
                {((roster.settings?.fpts_against || 0) + (roster.settings?.fpts_against_decimal || 0) / 100).toFixed(0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-white">Starters</h3>
            <span className="text-sm text-slate-400 bg-slate-800 px-3 py-1 rounded-full">
              {startersList.length}
            </span>
          </div>
          <div className="space-y-4">
            {/* QB */}
            {(() => {
              const qbs = startersList.filter((id) => players[id]?.position === 'QB')
              return qbs.length > 0 ? (
                <div>
                  <h4 className="text-sm font-semibold text-slate-300 mb-2 px-1">QB</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {qbs.map((playerId) => PlayerCard({ playerId, isStarter: true }, players))}
                  </div>
                </div>
              ) : null
            })()}

            {/* RBs */}
            {(() => {
              const rbs = startersList.filter((id) => players[id]?.position === 'RB')
              return rbs.length > 0 ? (
                <div>
                  <h4 className="text-sm font-semibold text-slate-300 mb-2 px-1">RBs</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {rbs.map((playerId) => PlayerCard({ playerId, isStarter: true }, players))}
                  </div>
                </div>
              ) : null
            })()}

            {/* WRs */}
            {(() => {
              const wrs = startersList.filter((id) => players[id]?.position === 'WR')
              return wrs.length > 0 ? (
                <div>
                  <h4 className="text-sm font-semibold text-slate-300 mb-2 px-1"># WRs</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {wrs.map((playerId) => PlayerCard({ playerId, isStarter: true }, players))}
                  </div>
                </div>
              ) : null
            })()}

            {/* TE */}
            {(() => {
              const tes = startersList.filter((id) => players[id]?.position === 'TE')
              return tes.length > 0 ? (
                <div>
                  <h4 className="text-sm font-semibold text-slate-300 mb-2 px-1">TE</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {tes.map((playerId) => PlayerCard({ playerId, isStarter: true }, players))}
                  </div>
                </div>
              ) : null
            })()}

            {/* K & DEF */}
            {(() => {
              const ks = startersList.filter((id) => players[id]?.position === 'K')
              const defs = startersList.filter((id) => {
                const pos = players[id]?.position
                return pos === 'DEF' || pos === 'D'
              })

              return (ks.length > 0 || defs.length > 0) ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {ks.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold text-slate-300 mb-2 px-1">K</h4>
                      <div className="grid gap-3">
                        {ks.map((playerId) => PlayerCard({ playerId, isStarter: true }, players))}
                      </div>
                    </div>
                  )}
                  {defs.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold text-slate-300 mb-2 px-1">DEF</h4>
                      <div className="grid gap-3">
                        {defs.map((playerId) => PlayerCard({ playerId, isStarter: true }, players))}
                      </div>
                    </div>
                  )}
                </div>
              ) : null
            })()}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-white">Bench</h3>
            <span className="text-sm text-slate-400 bg-slate-800 px-3 py-1 rounded-full">
              {benchPlayers.length}
            </span>
          </div>
          <div className="space-y-4">
            {benchPositions.map((position) => {
              const positionPlayers = getPlayersByPosition(benchPlayers, position, players)
              return (
                <div key={position}>
                  <h4 className="text-sm font-semibold text-slate-300 mb-2 px-1">{position}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {positionPlayers.map((playerId) =>
                      PlayerCard({ playerId, isStarter: false }, players)
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
