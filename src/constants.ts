// API Configuration
export const API_BASE_URL = 'https://api.sleeper.app/v1'

// Demo League
export const DEMO_LEAGUE_ID = 'demo'

// Caching
export const CACHE_DURATION_MS = 24 * 60 * 60 * 1000 // 24 hours

// Sleeper API
export const SLEEPER_CDN_URL = 'https://sleepercdn.com/avatars/thumbs'

// Default Values
export const DEFAULT_MAX_YEARS = 3
export const DEFAULT_MAX_ROUNDS = 4
export const DEFAULT_LEAGUE_WEEKS = 18

// Future Draft Years
export const FUTURE_DRAFT_YEARS = [2026, 2027]

// Position Order
export const POSITION_ORDER = ['QB', 'RB', 'WR', 'TE', 'K', 'DEF', 'D']

// Error Messages
export const ERROR_MESSAGES = {
  LEAGUE_NOT_FOUND: 'League not found. Please check your league ID.',
  USER_NOT_FOUND: 'User not found. Please check your username.',
  FAILED_TO_FETCH_LEAGUE: 'Failed to fetch league data. Please check the league ID and try again.',
  FAILED_TO_FETCH_DRAFT: 'Failed to load draft data. Please try again.',
  FAILED_TO_FETCH_TRADES: 'Failed to fetch trade values',
  INVALID_INPUT: 'Please provide valid input.',
  NO_LEAGUES_FOUND: (username: string) => `No leagues found for user "${username}"`,
} as const
