import { User } from '../types/sleeper'

interface TeamsProps {
  users: User[]
  onSelectUser?: (userId: string) => void
  rosterValues?: Map<string, number>
}

// Helper to get avatar URL from Sleeper CDN
const getAvatarUrl = (avatarId: string | null | undefined): string | null => {
  if (!avatarId) return null
  return `https://sleepercdn.com/avatars/thumbs/${avatarId}`
}

export default function Teams({ users, onSelectUser, rosterValues }: TeamsProps) {
  // Sort users by team value (descending)
  const sortedUsers = [...users].sort((a, b) => {
    const valueA = rosterValues?.get(a.user_id) ?? 0
    const valueB = rosterValues?.get(b.user_id) ?? 0
    return valueB - valueA
  })

  return (
    <div className="space-y-2">
      {sortedUsers.map((user, index) => {
        const avatarUrl = getAvatarUrl(user.avatar)
        const teamName = user.metadata?.team_name
        const teamValue = rosterValues?.get(user.user_id)

        return (
          <div
            key={user.user_id}
            onClick={() => onSelectUser?.(user.user_id)}
            className={`bg-gray-800 border border-gray-700 rounded-lg p-4 flex items-center gap-4 ${onSelectUser ? 'cursor-pointer hover:border-primary-500 transition' : ''}`}
          >
            <div className="w-10 h-10 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold text-lg flex-shrink-0">
              {index + 1}
            </div>
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={user.display_name}
                className="w-12 h-12 rounded-full flex-shrink-0 object-cover"
                onError={(e) => {
                  // Fallback to letter if image fails to load
                  const target = e.target as HTMLImageElement
                  target.style.display = 'none'
                  target.nextElementSibling?.classList.remove('hidden')
                }}
              />
            ) : null}
            <div
              className={`w-12 h-12 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold text-lg flex-shrink-0 ${avatarUrl ? 'hidden' : ''}`}
            >
              {user.display_name.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-white truncate text-base">{teamName || user.display_name}</p>
              <p className="text-xs text-gray-400 truncate">@{user.display_name}</p>
            </div>
            {teamValue !== undefined && (
              <div className="text-right flex-shrink-0">
                <p className="text-lg font-bold text-primary-400">{teamValue.toLocaleString()}</p>
                <p className="text-xs text-gray-400">Value</p>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
