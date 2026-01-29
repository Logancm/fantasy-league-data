import { Roster, PlayersMap, User, RookieDraftPick } from '../types/sleeper'
import { getPositionColor } from '../utils/colors'

interface RosterProps {
  roster: Roster | null
  user: User | null
  players: PlayersMap
  users: User[]
  selectedUserId: string | null
  onSelectUser: (userId: string | null) => void
  playerTradeValues: Map<string, number>
  rosterValue?: number
  rookieDraftPicks?: RookieDraftPick[]
}

const PlayerCard = (
  { playerId, isStarter }: { playerId: string; isStarter: boolean },
  players: PlayersMap,
  playerTradeValues: Map<string, number>
) => {
  const player = players[playerId]
  if (!player) return null

  const colors = getPositionColor(player.position || '')
  const tradeValue = playerTradeValues.get(playerId)

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
            <p className="text-sm text-gray-300">
              {player.team || 'FA'}
            </p>
          </div>
          {tradeValue !== undefined && (
            <p className="text-xs text-primary-300 mt-2 font-semibold">
              Value: {tradeValue.toLocaleString()}
            </p>
          )}
        </div>
        {isStarter && (
          <div className="flex-shrink-0 bg-primary-600 text-white text-xs font-bold px-2 py-1 rounded">
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

// Helper to get user team name by user_id
const getOriginalOwnerName = (userId: string | undefined, users: User[]): string | undefined => {
  if (!userId) return undefined
  const user = users.find(u => u.user_id === userId)
  if (!user) return undefined
  return user.metadata?.team_name || user.display_name
}

export default function RosterComponent({
  roster,
  user,
  players,
  users,
  selectedUserId,
  onSelectUser,
  playerTradeValues,
  rosterValue,
  rookieDraftPicks,
}: RosterProps) {
  const playerList = roster?.players || []
  const startersList = roster?.starters || []
  const benchPlayers = playerList.filter((id) => !startersList.includes(id))
  const benchPositions = getPositionsFromPlayers(benchPlayers, players)

  // Get rookie draft picks for this team, sorted by season then round
  const teamRookiePicks = rookieDraftPicks?.filter(pick => pick.roster_id === roster?.roster_id) || []
  const teamRookiePicksSorted = teamRookiePicks.sort((a, b) => {
    const seasonDiff = parseInt(b.season) - parseInt(a.season)
    return seasonDiff !== 0 ? seasonDiff : a.round - b.round
  })

  return (
    <div>
      <div className="mb-6">
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-300 mb-2">Select User</label>
          <select
            value={selectedUserId || ''}
            onChange={(e) => onSelectUser(e.target.value || null)}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white hover:border-primary-400 focus:border-primary-500 focus:outline-none transition-colors"
          >
            <option value="">Choose a user...</option>
            {users.map((u) => (
              <option key={u.user_id} value={u.user_id}>
                {u.metadata?.team_name || u.display_name}
              </option>
            ))}
          </select>
        </div>
        {!roster || !user ? (
          <div className="text-center py-12">
            <p className="text-gray-400">Select a user to view their roster</p>
          </div>
        ) : (
          <>
            <div className="bg-gradient-to-r from-primary-900/30 to-primary-800/30 border border-primary-500 rounded-lg p-6">
              <h2 className="text-3xl font-bold text-white mb-1">{user.metadata?.team_name || user.display_name}</h2>
              <p className="text-primary-300 mb-4">@{user.display_name}</p>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                <div className="bg-gray-800/50 rounded-lg p-3">
                  <p className="text-gray-400 text-xs font-semibold uppercase mb-1">Wins</p>
                  <p className="text-2xl font-bold text-white">
                    {roster.settings?.wins || 0}
                  </p>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-3">
                  <p className="text-gray-400 text-xs font-semibold uppercase mb-1">Losses</p>
                  <p className="text-2xl font-bold text-white">
                    {roster.settings?.losses || 0}
                  </p>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-3">
                  <p className="text-gray-400 text-xs font-semibold uppercase mb-1">Points For</p>
                  <p className="text-2xl font-bold text-green-400">
                    {((roster.settings?.fpts || 0) + (roster.settings?.fpts_decimal || 0) / 100).toFixed(0)}
                  </p>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-3">
                  <p className="text-gray-400 text-xs font-semibold uppercase mb-1">Points Ag.</p>
                  <p className="text-2xl font-bold text-red-400">
                    {((roster.settings?.fpts_against || 0) + (roster.settings?.fpts_against_decimal || 0) / 100).toFixed(0)}
                  </p>
                </div>
                {rosterValue !== undefined && (
                  <div className="bg-primary-900/50 rounded-lg p-3">
                    <p className="text-gray-400 text-xs font-semibold uppercase mb-1">Total Value</p>
                    <p className="text-2xl font-bold text-primary-400">
                      {rosterValue.toLocaleString()}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white">Starters</h3>
              <span className="text-sm text-gray-400 bg-gray-800 px-3 py-1 rounded-full">
                {startersList.length}
              </span>
            </div>
            <div className="space-y-4">
              {/* QB */}
              {(() => {
                const qbs = startersList.filter((id) => players[id]?.position === 'QB')
                return qbs.length > 0 ? (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-300 mb-2 px-1">QB</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {qbs.map((playerId) => PlayerCard({ playerId, isStarter: true }, players, playerTradeValues))}
                    </div>
                  </div>
                ) : null
              })()}

              {/* RBs */}
              {(() => {
                const rbs = startersList.filter((id) => players[id]?.position === 'RB')
                return rbs.length > 0 ? (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-300 mb-2 px-1">RBs</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {rbs.map((playerId) => PlayerCard({ playerId, isStarter: true }, players, playerTradeValues))}
                    </div>
                  </div>
                ) : null
              })()}

              {/* WRs */}
              {(() => {
                const wrs = startersList.filter((id) => players[id]?.position === 'WR')
                return wrs.length > 0 ? (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-300 mb-2 px-1"># WRs</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {wrs.map((playerId) => PlayerCard({ playerId, isStarter: true }, players, playerTradeValues))}
                    </div>
                  </div>
                ) : null
              })()}

              {/* TE */}
              {(() => {
                const tes = startersList.filter((id) => players[id]?.position === 'TE')
                return tes.length > 0 ? (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-300 mb-2 px-1">TE</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {tes.map((playerId) => PlayerCard({ playerId, isStarter: true }, players, playerTradeValues))}
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
                        <h4 className="text-sm font-semibold text-gray-300 mb-2 px-1">K</h4>
                        <div className="grid gap-3">
                          {ks.map((playerId) => PlayerCard({ playerId, isStarter: true }, players, playerTradeValues))}
                        </div>
                      </div>
                    )}
                    {defs.length > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold text-gray-300 mb-2 px-1">DEF</h4>
                        <div className="grid gap-3">
                          {defs.map((playerId) => PlayerCard({ playerId, isStarter: true }, players, playerTradeValues))}
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
              <span className="text-sm text-gray-400 bg-gray-800 px-3 py-1 rounded-full">
                {benchPlayers.length}
              </span>
            </div>
            <div className="space-y-4">
              {benchPositions.map((position) => {
                const positionPlayers = getPlayersByPosition(benchPlayers, position, players)
                return (
                  <div key={position}>
                    <h4 className="text-sm font-semibold text-gray-300 mb-2 px-1">{position}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {positionPlayers.map((playerId) =>
                        PlayerCard({ playerId, isStarter: false }, players, playerTradeValues)
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {teamRookiePicksSorted.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white">Future Rookie Draft Picks</h3>
                <span className="text-sm text-gray-400 bg-gray-800 px-3 py-1 rounded-full">
                  {teamRookiePicksSorted.length}
                </span>
              </div>
              <div className="space-y-6">
                {(() => {
                  // Group picks by season, sorted newest first
                  const groupedByYear = new Map<string, typeof teamRookiePicksSorted>()
                  teamRookiePicksSorted.forEach(pick => {
                    if (!groupedByYear.has(pick.season)) {
                      groupedByYear.set(pick.season, [])
                    }
                    groupedByYear.get(pick.season)!.push(pick)
                  })

                  return Array.from(groupedByYear.entries())
                    .sort((a, b) => parseInt(a[0]) - parseInt(b[0]))
                    .map(([season, picks]) => (
                    <div key={season}>
                      <p className="text-sm font-semibold text-amber-300 mb-3">{season} Rookie Draft</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {picks.map((pick) => {
                          const originalOwner = getOriginalOwnerName(pick.owner_id, users)
                          return (
                            <div
                              key={`${pick.season}-${pick.round}-${pick.original_slot}`}
                              className="bg-gradient-to-br from-yellow-900/40 to-yellow-800/40 border-2 border-yellow-500 rounded-lg p-4"
                            >
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex-1 min-w-0">
                                  <p className="font-bold text-white text-sm mb-2">
                                    Round {pick.round}
                                  </p>
                                  {originalOwner && (
                                    <p className="text-xs text-yellow-200 mb-2">
                                      from {originalOwner}
                                    </p>
                                  )}
                                  <span className="bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded inline-block">
                                    Rookie Pick
                                  </span>
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  ))
                })()}
              </div>
            </div>
          )}
        </div>
          </>
        )}
      </div>
    </div>
  )
}
