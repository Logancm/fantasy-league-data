import { useState } from 'react'
import { Draft, DraftPick, PlayersMap, User } from '../types/sleeper'
import { getPositionColor } from '../utils/colors'

interface DraftProps {
  drafts: Draft[]
  draftPicks: Map<string, DraftPick[]>
  users: User[]
  players: PlayersMap
  error?: string
  isLoading?: boolean
}

export default function DraftComponent({ drafts, draftPicks, users, players, error, isLoading }: DraftProps) {
  const [selectedDraftIndex, setSelectedDraftIndex] = useState(0)

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="w-8 h-8 border-4 border-gray-600 border-t-primary-500 rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-400">Loading draft data...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-900/20 border border-red-700 rounded-lg p-6 text-center">
        <p className="text-red-400 font-semibold mb-2">Failed to load draft data</p>
        <p className="text-red-300 text-sm">{error}</p>
      </div>
    )
  }

  if (drafts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">No drafts available for this league</p>
      </div>
    )
  }

  // Validate critical data
  const currentDraft = drafts[selectedDraftIndex]
  if (!currentDraft || !currentDraft.draft_id || !currentDraft.draft_order) {
    return (
      <div className="bg-red-900/20 border border-red-700 rounded-lg p-6 text-center">
        <p className="text-red-400 font-semibold mb-2">Invalid draft data</p>
        <p className="text-red-300 text-sm">The draft data appears to be corrupted. Please refresh the page.</p>
      </div>
    )
  }

  const picks = draftPicks.get(currentDraft.draft_id) || []
  const hasNoPicks = picks.length === 0

  // Create map of user_id to user
  const userMap = new Map<string, User>()
  users.forEach(u => userMap.set(u.user_id, u))

  // Get team names in draft order - ensure we have all slots (1 to N)
  // Determine number of slots: use max slot from draft_order or picks
  let numSlots = Object.keys(currentDraft.draft_order).length
  if (picks.length > 0) {
    const maxSlotFromPicks = Math.max(...picks.map(p => p.draft_slot || 1))
    numSlots = Math.max(numSlots, maxSlotFromPicks)
  }
  numSlots = numSlots || 12

  const draftSlots = Array.from({ length: numSlots }, (_, i) => {
    const slotNumber = i + 1
    // Find user for this slot
    const userIdForSlot = Object.entries(currentDraft.draft_order).find(
      ([, slot]) => slot === slotNumber
    )?.[0]

    const user = userIdForSlot ? userMap.get(userIdForSlot) : null
    return {
      userId: userIdForSlot || `slot-${slotNumber}`,
      draftSlot: slotNumber,
      teamName: user?.metadata?.team_name || user?.display_name || user?.username || `Slot ${slotNumber}`,
      displayName: user?.display_name || `Slot ${slotNumber}`
    }
  })

  // Organize picks by draft slot (only if there are picks)
  const picksBySlot = new Map<number, DraftPick[]>()
  if (!hasNoPicks) {
    draftSlots.forEach(slot => {
      picksBySlot.set(slot.draftSlot, [])
    })

    picks.forEach(pick => {
      const slotPicks = picksBySlot.get(pick.draft_slot) || []
      slotPicks.push(pick)
      picksBySlot.set(pick.draft_slot, slotPicks)
    })

    // Sort picks within each slot by round
    picksBySlot.forEach(slotPicks => {
      slotPicks.sort((a, b) => a.round - b.round || a.pick_no - b.pick_no)
    })
  }

  // Get max round
  const maxRound = Math.max(...picks.map(p => p.round), 0)

  return (
    <div>
      {/* Season Tabs */}
      {drafts.length > 1 && (
        <div className="flex gap-2 mb-4 justify-center">
          {drafts.map((draft, index) => (
            <button
              key={draft.draft_id}
              onClick={() => setSelectedDraftIndex(index)}
              className={`px-4 py-2 rounded-lg font-semibold text-sm transition duration-200 whitespace-nowrap ${
                selectedDraftIndex === index
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {draft.season}
            </button>
          ))}
        </div>
      )}

      {/* Empty State */}
      {hasNoPicks && (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">No draft data available for {currentDraft.season}</p>
          <p className="text-gray-500 text-sm mt-2">This year either has no completed draft or the draft data is not available</p>
        </div>
      )}

      {/* Draft Board - Full Width Desktop View */}
      {!hasNoPicks && (
        <div className="w-full overflow-x-auto" style={{ WebkitOverflowScrolling: 'touch', scrollBehavior: 'smooth' }}>
          <div className="flex gap-1 md:gap-2 mx-auto w-fit">
            {draftSlots.map(slot => (
              <div key={slot.draftSlot} className="flex-shrink-0 w-24 md:w-32">
                {/* Team Header */}
                <div className="bg-gradient-to-r from-primary-900/30 to-primary-800/30 border border-primary-500 rounded p-1 md:p-2 mb-1 md:mb-2">
                  <p className="text-xs text-gray-400 truncate">@{slot.displayName}</p>
                  <p className="font-semibold text-white text-xs truncate">{slot.teamName}</p>
                </div>

                {/* Picks */}
                <div className="space-y-1 md:space-y-2">
                  {Array.from({ length: maxRound }, (_, roundIdx) => {
                    const round = roundIdx + 1
                    const pick = picksBySlot.get(slot.draftSlot)?.find(p => p.round === round)

                    if (!pick) {
                      return (
                        <div
                          key={`${slot.draftSlot}-${round}`}
                          className="bg-gray-800 border border-gray-700 rounded p-0.5 md:p-1 h-10 md:h-14"
                        />
                      )
                    }

                    const colors = getPositionColor(pick.metadata.position)
                    const pickerUser = userMap.get(pick.picked_by)
                    const pickerDisplayName = pickerUser?.display_name || pickerUser?.username || 'Unknown'
                    const firstName = pick.metadata.first_name
                    const lastName = pick.metadata.last_name
                    // Use original_slot if available, otherwise calculate from pick_no
                    const numTeams = draftSlots.length
                    const pickInRound = pick.original_slot || ((pick.pick_no - 1) % numTeams) + 1

                    return (
                      <div
                        key={`${slot.draftSlot}-${round}`}
                        className={`${colors.bg} border ${colors.border} rounded p-0.5 md:p-1.5 cursor-default`}
                      >
                        <div className="flex flex-col gap-0 md:gap-1">
                          <div className="flex items-center justify-between gap-0.5">
                            <span className={`${colors.badge} text-white text-xs font-bold px-0.5 md:px-1 rounded flex-shrink-0`}>
                              {pick.metadata.position}
                            </span>
                            <span className="text-xs text-gray-300 font-semibold">{pick.round}.{String(pickInRound).padStart(2, '0')}</span>
                          </div>
                          <div className="text-xs font-bold text-white leading-tight">
                            <p className="truncate">{firstName}</p>
                            <p className="truncate">{lastName}</p>
                          </div>
                          <p className="text-xs text-gray-400 truncate">{pickerDisplayName}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
