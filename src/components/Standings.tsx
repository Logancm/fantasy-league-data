import { useState } from "react";
import { Roster, SeasonData, User } from "../types/sleeper";

interface StandingsProps {
  leagueHistory: SeasonData[];
  currentUsers: User[];
}

export default function Standings({
  leagueHistory,
  currentUsers,
}: StandingsProps) {
  const [selectedSeasonIndex, setSelectedSeasonIndex] = useState(0);

  // Get available seasons sorted by year (most recent first)
  const seasons = leagueHistory.map((data, index) => ({
    year: data.league.season,
    index,
  }));

  const currentSeason = leagueHistory[selectedSeasonIndex];

  if (!currentSeason) {
    return (
      <div className="text-center py-12">
        <div className="w-8 h-8 border-4 border-gray-600 border-t-primary-500 rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-400">Loading standings...</p>
      </div>
    );
  }

  const { rosters, users: seasonUsers } = currentSeason;

  // Create a combined user map - season users first, then current users as fallback
  const userMap = new Map<string, User>();
  // Add current users first (as fallback)
  currentUsers.forEach((u) => userMap.set(u.user_id, u));
  // Override with season-specific users
  seasonUsers.forEach((u) => userMap.set(u.user_id, u));

  // Helper to get points from roster settings
  const getPointsFor = (roster: Roster): number => {
    const fpts = roster.settings?.fpts || 0;
    const decimal = roster.settings?.fpts_decimal || 0;
    return fpts + decimal / 100;
  };

  const getPointsAgainst = (roster: Roster): number => {
    const fpts = roster.settings?.fpts_against || 0;
    const decimal = roster.settings?.fpts_against_decimal || 0;
    return fpts + decimal / 100;
  };

  const sortedRosters = [...rosters].sort((a, b) => {
    const aWins = a.settings?.wins || 0;
    const bWins = b.settings?.wins || 0;
    if (bWins !== aWins) {
      return bWins - aWins;
    }
    return getPointsFor(b) - getPointsFor(a);
  });

  return (
    <div>
      {/* Season Tabs */}
      {seasons.length > 1 && (
        <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
          {seasons.map((season) => (
            <button
              key={season.year}
              onClick={() => setSelectedSeasonIndex(season.index)}
              className={`px-4 py-2 rounded-lg font-semibold text-sm transition duration-200 ${
                selectedSeasonIndex === season.index
                  ? "bg-primary-600 text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              {season.year}
            </button>
          ))}
        </div>
      )}

      {/* Standings List */}
      <div className="space-y-3">
        {sortedRosters.map((roster, index) => {
          const ownerId = roster.owner_id ? String(roster.owner_id) : null;
          const user = ownerId ? userMap.get(ownerId) : null;
          const teamName = user?.metadata?.team_name;
          const displayName =
            teamName || user?.display_name || user?.username || "Unknown Team";
          const wins = roster.settings?.wins || 0;
          const losses = roster.settings?.losses || 0;
          const pointsFor = getPointsFor(roster);
          const pointsAgainst = getPointsAgainst(roster);

          return (
            <div
              key={roster.roster_id}
              className="bg-gray-800 border border-primary-900/50 rounded-lg p-4"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  {user?.avatar ? (
                    <img
                      src={`https://sleepercdn.com/avatars/thumbs/${user.avatar}`}
                      alt={user.display_name || user.username}
                      className="rounded-full w-8 h-8 object-cover"
                    />
                  ) : (
                    <div className="rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm bg-primary-700 text-primary-100">
                      {(user?.display_name ||
                        user?.username ||
                        "?")[0].toUpperCase()}
                    </div>
                  )}
                  <div>
                    <p className="text-xs text-gray-400">
                      @{user?.display_name || "Unknown"}
                    </p>
                    <p className="font-semibold text-white">{displayName}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-xl text-white">
                    {wins}-{losses}
                  </p>
                  <p className="text-xs text-gray-400">Record</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-primary-900/30 rounded-lg p-3">
                  <p className="text-gray-400 text-xs mb-1">Points For</p>
                  <p className="font-semibold text-primary-400">
                    {pointsFor.toFixed(2)}
                  </p>
                </div>
                <div className="bg-gray-700/50 rounded-lg p-3">
                  <p className="text-gray-400 text-xs mb-1">Points Against</p>
                  <p className="font-semibold text-gray-300">
                    {pointsAgainst > 0 ? pointsAgainst.toFixed(2) : "—"}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
