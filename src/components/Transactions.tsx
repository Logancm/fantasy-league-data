import { useState } from "react";
import { Transaction, User, Roster, PlayersMap } from "../types/sleeper";
import { getPlayerInfo } from "../services/sleeperApi";

interface TransactionsProps {
  transactions: Transaction[];
  users: User[];
  rosters: Roster[];
  players: PlayersMap;
}

type FilterType = "all" | "trade" | "waivers";

// Position color mapping (reused from other components)
const getPositionColor = (
  position: string,
): { bg: string; text: string; border: string } => {
  switch (position) {
    case "QB":
      return {
        bg: "bg-red-900/40",
        text: "text-red-400",
        border: "border-red-500/30",
      };
    case "RB":
      return {
        bg: "bg-green-900/40",
        text: "text-green-400",
        border: "border-green-500/30",
      };
    case "WR":
      return {
        bg: "bg-blue-900/40",
        text: "text-blue-400",
        border: "border-blue-500/30",
      };
    case "TE":
      return {
        bg: "bg-amber-900/40",
        text: "text-amber-400",
        border: "border-amber-500/30",
      };
    case "K":
      return {
        bg: "bg-yellow-900/40",
        text: "text-yellow-400",
        border: "border-yellow-500/30",
      };
    case "DEF":
    case "D":
      return {
        bg: "bg-purple-900/40",
        text: "text-purple-400",
        border: "border-purple-500/30",
      };
    default:
      return {
        bg: "bg-slate-800/40",
        text: "text-slate-400",
        border: "border-slate-500/30",
      };
  }
};

export default function Transactions({
  transactions,
  users,
  rosters,
  players,
}: TransactionsProps) {
  const [filter, setFilter] = useState<FilterType>("all");
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const userMap = new Map(users.map((u) => [u.user_id, u]));
  const rosterToUserMap = new Map(
    rosters.map((r) => [r.roster_id, r.owner_id]),
  );

  const getTransactionTypeStyle = (type: string) => {
    switch (type) {
      case "trade":
        return "bg-purple-500/20 text-purple-400 border-purple-500/30";
      case "waiver":
        return "bg-orange-500/20 text-orange-400 border-orange-500/30";
      case "free_agent":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      default:
        return "bg-slate-500/20 text-slate-400 border-slate-500/30";
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatTransactionType = (type: string) => {
    return type
      .split("_")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
  };

  const getUserByRosterId = (rosterId: number) => {
    const ownerId = rosterToUserMap.get(rosterId);
    if (!ownerId) return null;
    return userMap.get(ownerId);
  };

  // Filter out transactions with no adds/drops (like failed waivers)
  const validTransactions = transactions.filter(
    (t) =>
      (t.adds && Object.keys(t.adds).length > 0) ||
      (t.drops && Object.keys(t.drops).length > 0),
  );

  // Apply selected filter
  const filteredTransactions = validTransactions.filter((t) => {
    // Filter by transaction type
    const typeMatch =
      filter === "all" ||
      (filter === "trade" && t.type === "trade") ||
      (filter === "waivers" &&
        (t.type === "waiver" || t.type === "free_agent"));

    if (!typeMatch) return false;

    // Filter by user if selected
    if (selectedUserId) {
      // Check if this user is involved in the transaction
      const involvedRosterIds = t.roster_ids || [];
      const userRosterId = rosters.find(
        (r) => String(r.owner_id) === selectedUserId,
      )?.roster_id;
      return (
        userRosterId !== undefined && involvedRosterIds.includes(userRosterId)
      );
    }

    return true;
  });

  if (filteredTransactions.length === 0) {
    return (
      <div className="space-y-4">
        <div className="space-y-3 md:flex md:gap-2 md:justify-between md:items-center">
          <div className="flex flex-wrap gap-2">
            {(["all", "trade", "waivers"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-2 rounded-lg font-semibold text-xs sm:text-sm transition duration-200 flex-1 sm:flex-none ${
                  filter === f
                    ? "bg-indigo-600 text-white"
                    : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                }`}
              >
                {f === "all" ? "All" : f === "trade" ? "Trades" : "Waiver"}
              </button>
            ))}
          </div>
          <select
            value={selectedUserId || ""}
            onChange={(e) => setSelectedUserId(e.target.value || null)}
            className="w-full md:w-auto px-3 py-2 rounded-lg font-semibold text-xs sm:text-sm bg-slate-700 text-slate-300 border border-slate-600 hover:bg-slate-600 transition duration-200 cursor-pointer"
          >
            <option value="">All Members</option>
            {users.map((user) => (
              <option key={user.user_id} value={user.user_id}>
                {user.display_name || user.username}
              </option>
            ))}
          </select>
        </div>
        <div className="text-center py-12">
          <p className="text-slate-400">No transactions yet</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-3 md:flex md:gap-2 md:justify-between md:items-center">
        <div className="flex flex-wrap gap-2">
          {(["all", "trade", "waivers"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-2 rounded-lg font-semibold text-xs sm:text-sm transition duration-200 flex-1 sm:flex-none ${
                filter === f
                  ? "bg-indigo-600 text-white"
                  : "bg-slate-700 text-slate-300 hover:bg-slate-600"
              }`}
            >
              {f === "all" ? "All" : f === "trade" ? "Trades" : "Waiver"}
            </button>
          ))}
        </div>
        <select
          value={selectedUserId || ""}
          onChange={(e) => setSelectedUserId(e.target.value || null)}
          className="w-full md:w-auto px-3 py-2 rounded-lg font-semibold text-xs sm:text-sm bg-slate-700 text-slate-300 border border-slate-600 hover:bg-slate-600 transition duration-200 cursor-pointer"
        >
          <option value="">All Members</option>
          {users.map((user) => (
            <option key={user.user_id} value={user.user_id}>
              {user.display_name || user.username}
            </option>
          ))}
        </select>
      </div>
      <div className="space-y-3">
        {filteredTransactions.map((transaction) => {
          // For trades, show involved users; for others show creator
          const involvedUsers =
            transaction.roster_ids
              ?.map((rid) => getUserByRosterId(rid))
              .filter(Boolean) || [];

          const displayUser =
            involvedUsers[0] || userMap.get(transaction.creator);
          const displayName =
            displayUser?.display_name || displayUser?.username || "Unknown";

          return (
            <div
              key={transaction.transaction_id}
              className="bg-slate-800 border border-slate-700 rounded-lg p-4"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3 flex-wrap">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold border ${getTransactionTypeStyle(transaction.type)}`}
                  >
                    {formatTransactionType(transaction.type)}
                  </span>
                  <div>
                    <p className="font-semibold text-white text-sm">
                      {transaction.type === "trade" && involvedUsers.length > 1
                        ? involvedUsers
                            .map((u) => u?.display_name || u?.username)
                            .join(" ↔ ")
                        : displayName}
                    </p>
                    <p className="text-xs text-slate-400">
                      {formatDate(transaction.status_updated)}
                    </p>
                  </div>
                </div>
              </div>

              {transaction.type === "trade" ? (
                // For trades, show players and draft picks by each involved team
                <div className="space-y-3 mt-3">
                  {(transaction.roster_ids || []).map((rosterId) => {
                    // Get user for this roster
                    const ownerId = rosterToUserMap.get(rosterId);
                    const user = ownerId ? userMap.get(ownerId) : null;

                    if (!user) return null;

                    // Players can be in adds/drops in different ways
                    // Try to determine: in a trade, does adds = received or given?
                    // Based on Sleeper API: adds = players received, drops = players given away
                    const receivedPlayers =
                      rosterId && transaction.adds
                        ? Object.keys(transaction.adds).filter((playerId) => {
                            const rosterValue = transaction.adds![playerId];
                            return (
                              Number(rosterValue) === rosterId ||
                              String(rosterValue) === String(rosterId)
                            );
                          })
                        : [];

                    const givenPlayers =
                      rosterId && transaction.drops
                        ? Object.keys(transaction.drops).filter((playerId) => {
                            const rosterValue = transaction.drops![playerId];
                            return (
                              Number(rosterValue) === rosterId ||
                              String(rosterValue) === String(rosterId)
                            );
                          })
                        : [];
                    // Split picks into given and received
                    // API structure: roster_id = original owner, owner_id = new owner after trade
                    const allPicks = transaction.draft_picks || [];

                    // Given picks: we originally own them (roster_id matches our roster)
                    const givenPicks = allPicks.filter((pick: any) => {
                      const pickOriginalOwner = Number(pick.roster_id);
                      const numCurrentRosterId = Number(rosterId);
                      return pickOriginalOwner === numCurrentRosterId;
                    });

                    // Received picks: we're the new owner (owner_id matches our roster)
                    const receivedPicks = allPicks.filter((pick: any) => {
                      const pickNewOwner = Number(pick.owner_id);
                      const numCurrentRosterId = Number(rosterId);
                      return (
                        pickNewOwner === numCurrentRosterId &&
                        !isNaN(pickNewOwner)
                      );
                    });
                    if (
                      receivedPlayers.length === 0 &&
                      givenPlayers.length === 0 &&
                      receivedPicks.length === 0 &&
                      givenPicks.length === 0
                    )
                      return null;

                    return (
                      <div key={user.user_id}>
                        <p className="text-xs font-semibold text-indigo-400 mb-2">
                          {user.display_name || user.username}
                        </p>
                        {(receivedPlayers.length > 0 ||
                          receivedPicks.length > 0) && (
                          <div>
                            <p className="text-xs text-green-400 font-semibold mb-1">
                              Got:
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {receivedPlayers.map((playerId, idx) => {
                                const playerInfo = getPlayerInfo(
                                  playerId,
                                  players,
                                );
                                const colors = getPositionColor(
                                  playerInfo.position,
                                );
                                return (
                                  <span
                                    key={idx}
                                    className={`${colors.bg} ${colors.text} text-xs px-3 py-1.5 rounded-lg border ${colors.border}`}
                                  >
                                    {playerInfo.name}
                                    {playerInfo.position && (
                                      <span className="opacity-70 ml-1">
                                        {playerInfo.position} •{" "}
                                        {playerInfo.team}
                                      </span>
                                    )}
                                  </span>
                                );
                              })}
                              {receivedPicks.map((pick: any, idx: number) => {
                                // Get the original owner of the pick (who we received it from)
                                let originalOwnerName = "";

                                // The pick roster_id tells us who originally owned it (who we're receiving from)
                                const pickOwnerId = Number(pick.roster_id);
                                const numCurrentRosterId = Number(rosterId);

                                if (
                                  !isNaN(pickOwnerId) &&
                                  pickOwnerId !== numCurrentRosterId
                                ) {
                                  // First try: is it a roster ID? Look up the roster owner
                                  const roster = rosters.find(
                                    (r) => r.roster_id === pickOwnerId,
                                  );
                                  if (roster && roster.owner_id) {
                                    const owner = userMap.get(
                                      String(roster.owner_id),
                                    );
                                    originalOwnerName =
                                      owner?.display_name ||
                                      owner?.username ||
                                      "";
                                  }
                                }

                                // Format round pick (1st, 2nd, 3rd, 4th, etc.)
                                const getRoundPickText = (round: number) => {
                                  const suffix =
                                    round === 1
                                      ? "st"
                                      : round === 2
                                        ? "nd"
                                        : round === 3
                                          ? "rd"
                                          : "th";
                                  return `${round}${suffix}`;
                                };

                                return (
                                  <span
                                    key={`pick-${idx}`}
                                    className="bg-cyan-900/40 text-cyan-400 text-xs px-3 py-1.5 rounded-lg border border-cyan-500/30"
                                  >
                                    {pick.season}{" "}
                                    {pick.round
                                      ? getRoundPickText(pick.round)
                                      : ""}{" "}
                                    Pick
                                    <span className="opacity-70 ml-1">
                                      {originalOwnerName ? (
                                        <>from {originalOwnerName}</>
                                      ) : pick.round && pick.original_slot ? (
                                        <>
                                          #
                                          {String(pick.original_slot).padStart(
                                            2,
                                            "0",
                                          )}
                                        </>
                                      ) : pick.original_slot ? (
                                        <>#{pick.original_slot}</>
                                      ) : (
                                        <></>
                                      )}
                                    </span>
                                  </span>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                // For non-trades, show Added and Dropped
                (transaction.adds || transaction.drops) && (
                  <div className="space-y-3 mt-3">
                    {transaction.adds &&
                      Object.keys(transaction.adds).length > 0 && (
                        <div>
                          <p className="text-xs font-semibold text-green-400 mb-2">
                            Added
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {Object.keys(transaction.adds).map(
                              (playerId, idx) => {
                                const playerInfo = getPlayerInfo(
                                  playerId,
                                  players,
                                );
                                const colors = getPositionColor(
                                  playerInfo.position,
                                );
                                return (
                                  <span
                                    key={idx}
                                    className={`${colors.bg} ${colors.text} text-xs px-3 py-1.5 rounded-lg border ${colors.border}`}
                                  >
                                    {playerInfo.name}
                                    {playerInfo.position && (
                                      <span className="opacity-70 ml-1">
                                        {playerInfo.position} •{" "}
                                        {playerInfo.team}
                                      </span>
                                    )}
                                  </span>
                                );
                              },
                            )}
                          </div>
                        </div>
                      )}

                    {transaction.drops &&
                      Object.keys(transaction.drops).length > 0 && (
                        <div>
                          <p className="text-xs font-semibold text-red-400 mb-2">
                            Dropped
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {Object.keys(transaction.drops).map(
                              (playerId, idx) => {
                                const playerInfo = getPlayerInfo(
                                  playerId,
                                  players,
                                );
                                const colors = getPositionColor(
                                  playerInfo.position,
                                );
                                return (
                                  <span
                                    key={idx}
                                    className={`${colors.bg} ${colors.text} text-xs px-3 py-1.5 rounded-lg border ${colors.border}`}
                                  >
                                    {playerInfo.name}
                                    {playerInfo.position && (
                                      <span className="opacity-70 ml-1">
                                        {playerInfo.position} •{" "}
                                        {playerInfo.team}
                                      </span>
                                    )}
                                  </span>
                                );
                              },
                            )}
                          </div>
                        </div>
                      )}
                  </div>
                )
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
