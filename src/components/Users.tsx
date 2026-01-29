import { useState } from 'react'
import { User } from '../types/sleeper'
import { SLEEPER_CDN_URL } from '../constants'

interface TeamsProps {
  users: User[]
  onSelectUser?: (userId: string) => void
  rosterValues?: Map<string, number>
}

// Helper to get avatar URL from Sleeper CDN
const getAvatarUrl = (avatarId: string | null | undefined): string | null => {
  if (!avatarId) return null
  return `${SLEEPER_CDN_URL}/${avatarId}`
}

interface AvatarProps {
  avatarUrl: string | null
  displayName: string
}

// Reusable avatar component with proper fallback handling using React state
const Avatar = ({ avatarUrl, displayName }: AvatarProps) => {
  const [imageLoaded, setImageLoaded] = useState(true)

  if (!avatarUrl || !imageLoaded) {
    return (
      <div className="w-12 h-12 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold text-lg flex-shrink-0">
        {displayName.charAt(0).toUpperCase()}
      </div>
    )
  }

  return (
    <img
      src={avatarUrl}
      alt={displayName}
      className="w-12 h-12 rounded-full flex-shrink-0 object-cover"
      onError={() => setImageLoaded(false)}
    />
  )
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
            <Avatar avatarUrl={avatarUrl} displayName={user.display_name} />
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
