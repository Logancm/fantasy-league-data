import { User } from '../types/sleeper'

interface UsersProps {
  users: User[]
  onSelectUser?: (userId: string) => void
}

// Helper to get avatar URL from Sleeper CDN
const getAvatarUrl = (avatarId: string | null | undefined): string | null => {
  if (!avatarId) return null
  return `https://sleepercdn.com/avatars/thumbs/${avatarId}`
}

export default function Users({ users, onSelectUser }: UsersProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {users.map((user) => {
        const avatarUrl = getAvatarUrl(user.avatar)
        const teamName = user.metadata?.team_name

        return (
          <div
            key={user.user_id}
            onClick={() => onSelectUser?.(user.user_id)}
            className={`bg-slate-800 border border-slate-700 rounded-lg p-4 flex items-center gap-4 ${onSelectUser ? 'cursor-pointer hover:border-indigo-500 transition' : ''}`}
          >
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
              className={`w-12 h-12 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-lg flex-shrink-0 ${avatarUrl ? 'hidden' : ''}`}
            >
              {user.display_name.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-white truncate text-base">{teamName || user.display_name}</p>
              <p className="text-xs text-slate-400 truncate">@{user.display_name}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
