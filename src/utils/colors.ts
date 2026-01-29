// Reusable position color mapping for all components
export const getPositionColor = (position: string): { bg: string; border: string; badge: string; text?: string } => {
  switch (position) {
    case 'QB':
      return { bg: 'bg-red-900/40', border: 'border-red-500', badge: 'bg-red-500', text: 'text-red-400' }
    case 'RB':
      return { bg: 'bg-green-900/40', border: 'border-green-500', badge: 'bg-green-500', text: 'text-green-400' }
    case 'WR':
      return { bg: 'bg-blue-900/40', border: 'border-blue-500', badge: 'bg-blue-500', text: 'text-blue-400' }
    case 'TE':
      return { bg: 'bg-amber-900/40', border: 'border-amber-500', badge: 'bg-amber-500', text: 'text-amber-400' }
    case 'K':
      return { bg: 'bg-yellow-900/40', border: 'border-yellow-500', badge: 'bg-yellow-500', text: 'text-yellow-400' }
    case 'DEF':
    case 'D':
      return { bg: 'bg-purple-900/40', border: 'border-purple-500', badge: 'bg-purple-500', text: 'text-purple-400' }
    default:
      return { bg: 'bg-slate-800', border: 'border-slate-600', badge: 'bg-slate-500', text: 'text-gray-400' }
  }
}
