import { League, Roster, User, Transaction, PlayersMap, Draft, DraftPick, RookieDraftPick } from '../types/sleeper'

export const mockLeague: League = {
  league_id: 'demo-league-2025',
  name: 'Demo League 2025',
  season: '2025',
  total_rosters: 8,
  status: 'complete',
  sport: 'nfl',
  previous_league_id: null,
  settings: {
    0: 0,
    1: 0,
    type: 0, // redraft
  },
  roster_positions: ['QB', 'RB', 'RB', 'WR', 'WR', 'TE', 'FLEX', 'DEF', 'BN', 'BN', 'BN'],
}

export const mockRosters: Roster[] = [
  {
    roster_id: 1,
    owner_id: 'user1',
    league_id: 'demo-league-2025',
    players: ['8218', '6816', '6841', '6818', '6840', '6803', '6827', '6835', '6842', '6843', '6844'],
    starters: ['8218', '6816', '6841', '6818', '6840', '6803', '6827', '6835'],
    settings: {
      wins: 10,
      losses: 3,
      ties: 0,
      fpts: 1245.5,
      fpts_decimal: 1245.5,
      fpts_against: 1089.2,
      fpts_against_decimal: 1089.2,
    },
  },
  {
    roster_id: 2,
    owner_id: 'user2',
    league_id: 'demo-league-2025',
    players: ['8213', '6817', '6848', '6820', '6846', '6805', '6828', '6851', '6847', '6849', '6850'],
    starters: ['8213', '6817', '6848', '6820', '6846', '6805', '6828', '6851'],
    settings: {
      wins: 9,
      losses: 4,
      ties: 0,
      fpts: 1210.2,
      fpts_decimal: 1210.2,
      fpts_against: 1105.8,
      fpts_against_decimal: 1105.8,
    },
  },
  {
    roster_id: 3,
    owner_id: 'user3',
    league_id: 'demo-league-2025',
    players: ['8216', '6815', '6854', '6819', '6852', '6829', '6827', '6857', '6853', '6855', '6856'],
    starters: ['8216', '6815', '6854', '6819', '6852', '6829', '6827', '6857'],
    settings: {
      wins: 8,
      losses: 5,
      ties: 0,
      fpts: 1180.8,
      fpts_decimal: 1180.8,
      fpts_against: 1127.4,
      fpts_against_decimal: 1127.4,
    },
  },
  {
    roster_id: 4,
    owner_id: 'user4',
    league_id: 'demo-league-2025',
    players: ['8214', '6900', '6858', '6821', '6806', '6830', '6827', '6863', '6859', '6860', '6861'],
    starters: ['8214', '6900', '6858', '6821', '6806', '6830', '6827', '6863'],
    settings: {
      wins: 7,
      losses: 6,
      ties: 0,
      fpts: 1150.3,
      fpts_decimal: 1150.3,
      fpts_against: 1149.1,
      fpts_against_decimal: 1149.1,
    },
  },
  {
    roster_id: 5,
    owner_id: 'user5',
    league_id: 'demo-league-2025',
    players: ['8215', '6865', '6868', '6822', '6807', '6867', '6864', '6870', '6866', '6869', '6871'],
    starters: ['8215', '6865', '6868', '6822', '6807', '6867', '6864', '6870'],
    settings: {
      wins: 6,
      losses: 7,
      ties: 0,
      fpts: 1120.6,
      fpts_decimal: 1120.6,
      fpts_against: 1165.7,
      fpts_against_decimal: 1165.7,
    },
  },
  {
    roster_id: 6,
    owner_id: 'user6',
    league_id: 'demo-league-2025',
    players: ['8217', '6875', '6808', '6823', '6873', '6872', '6874', '6879', '6876', '6877', '6878'],
    starters: ['8217', '6875', '6808', '6823', '6873', '6872', '6874', '6879'],
    settings: {
      wins: 5,
      losses: 8,
      ties: 0,
      fpts: 1090.1,
      fpts_decimal: 1090.1,
      fpts_against: 1182.3,
      fpts_against_decimal: 1182.3,
    },
  },
  {
    roster_id: 7,
    owner_id: 'user7',
    league_id: 'demo-league-2025',
    players: ['8219', '6880', '6883', '6824', '6809', '6881', '6882', '6887', '6884', '6885', '6886'],
    starters: ['8219', '6880', '6883', '6824', '6809', '6881', '6882', '6887'],
    settings: {
      wins: 4,
      losses: 9,
      ties: 0,
      fpts: 1060.4,
      fpts_decimal: 1060.4,
      fpts_against: 1198.9,
      fpts_against_decimal: 1198.9,
    },
  },
  {
    roster_id: 8,
    owner_id: 'user8',
    league_id: 'demo-league-2025',
    players: ['8220', '6888', '6889', '6825', '6810', '6891', '6892', '6895', '6890', '6893', '6894'],
    starters: ['8220', '6888', '6889', '6825', '6810', '6891', '6892', '6895'],
    settings: {
      wins: 3,
      losses: 10,
      ties: 0,
      fpts: 1030.7,
      fpts_decimal: 1030.7,
      fpts_against: 1215.5,
      fpts_against_decimal: 1215.5,
    },
  },
]

export const mockUsers: User[] = [
  {
    user_id: 'user1',
    username: 'demo_player_1',
    display_name: 'Patrick Mahomes Fan',
    metadata: { team_name: 'Kansas City Chiefs' },
  },
  {
    user_id: 'user2',
    username: 'demo_player_2',
    display_name: 'Lamar Jackson Fan',
    metadata: { team_name: 'Baltimore Ravens' },
  },
  {
    user_id: 'user3',
    username: 'demo_player_3',
    display_name: 'Josh Allen Fan',
    metadata: { team_name: 'Buffalo Bills' },
  },
  {
    user_id: 'user4',
    username: 'demo_player_4',
    display_name: 'Jalen Hurts Fan',
    metadata: { team_name: 'Philadelphia Eagles' },
  },
  {
    user_id: 'user5',
    username: 'demo_player_5',
    display_name: 'Joe Burrow Fan',
    metadata: { team_name: 'Cincinnati Bengals' },
  },
  {
    user_id: 'user6',
    username: 'demo_player_6',
    display_name: 'Trevor Lawrence Fan',
    metadata: { team_name: 'Jacksonville Jaguars' },
  },
  {
    user_id: 'user7',
    username: 'demo_player_7',
    display_name: 'Geno Smith Fan',
    metadata: { team_name: 'Seattle Seahawks' },
  },
  {
    user_id: 'user8',
    username: 'demo_player_8',
    display_name: 'Matthew Stafford Fan',
    metadata: { team_name: 'Detroit Lions' },
  },
]

export const mockTransactions: Transaction[] = [
  {
    transaction_id: 'txn1',
    type: 'trade',
    creator: 'user1',
    created: Date.now() - 86400000,
    status_updated: Date.now() - 86400000,
    status: 'completed',
    leg: 1,
    adds: { '6803': '1', '6840': '2' },
    drops: { '6840': '1', '6803': '2' },
    draft_picks: [],
    roster_ids: [1, 2],
  },
  {
    transaction_id: 'txn2',
    type: 'free_agent',
    creator: 'user2',
    created: Date.now() - 172800000,
    status_updated: Date.now() - 172800000,
    status: 'completed',
    leg: 1,
    adds: { '6805': '2' },
    drops: null,
    draft_picks: [],
    roster_ids: [2],
  },
  {
    transaction_id: 'txn3a',
    type: 'trade',
    creator: 'user3',
    created: Date.now() - 259200000,
    status_updated: Date.now() - 259200000,
    status: 'completed',
    leg: 1,
    adds: { '6816': '3', '6817': '3', '6852': '4', '6853': '4' },
    drops: { '6852': '3', '6853': '3', '6816': '4', '6817': '4' },
    draft_picks: [],
    roster_ids: [3, 4],
  },
]

export const mockDrafts: Draft[] = [
  {
    draft_id: 'draft-2025-demo',
    league_id: 'demo-league-2025',
    season: '2025',
    type: 'snake',
    status: 'complete',
    start_time: Date.now() - 604800000,
    sport: 'nfl',
    settings: {
      rounds: 3,
      slots: 8,
    },
    draft_order: {
      'user1': 1,
      'user2': 2,
      'user3': 3,
      'user4': 4,
      'user5': 5,
      'user6': 6,
      'user7': 7,
      'user8': 8,
    },
    slot_to_roster_id: {
      '1': 1,
      '2': 2,
      '3': 3,
      '4': 4,
      '5': 5,
      '6': 6,
      '7': 7,
      '8': 8,
    },
  },
]

export const mockDraftPicks: DraftPick[] = [
  // Round 1
  { player_id: '8218', picked_by: 'user1', roster_id: 1, round: 1, draft_slot: 1, pick_no: 1, original_slot: 1, is_keeper: false, draft_id: 'draft-2025-demo', metadata: { first_name: 'Patrick', last_name: 'Mahomes', position: 'QB', team: 'KC' } },
  { player_id: '8213', picked_by: 'user2', roster_id: 2, round: 1, draft_slot: 2, pick_no: 2, original_slot: 2, is_keeper: false, draft_id: 'draft-2025-demo', metadata: { first_name: 'Lamar', last_name: 'Jackson', position: 'QB', team: 'BAL' } },
  { player_id: '8216', picked_by: 'user3', roster_id: 3, round: 1, draft_slot: 3, pick_no: 3, original_slot: 3, is_keeper: false, draft_id: 'draft-2025-demo', metadata: { first_name: 'Josh', last_name: 'Allen', position: 'QB', team: 'BUF' } },
  { player_id: '8214', picked_by: 'user4', roster_id: 4, round: 1, draft_slot: 4, pick_no: 4, original_slot: 4, is_keeper: false, draft_id: 'draft-2025-demo', metadata: { first_name: 'Jalen', last_name: 'Hurts', position: 'QB', team: 'PHI' } },
  { player_id: '8215', picked_by: 'user5', roster_id: 5, round: 1, draft_slot: 5, pick_no: 5, original_slot: 5, is_keeper: false, draft_id: 'draft-2025-demo', metadata: { first_name: 'Joe', last_name: 'Burrow', position: 'QB', team: 'CIN' } },
  { player_id: '8217', picked_by: 'user6', roster_id: 6, round: 1, draft_slot: 6, pick_no: 6, original_slot: 6, is_keeper: false, draft_id: 'draft-2025-demo', metadata: { first_name: 'Trevor', last_name: 'Lawrence', position: 'QB', team: 'JAX' } },
  { player_id: '8219', picked_by: 'user7', roster_id: 7, round: 1, draft_slot: 7, pick_no: 7, original_slot: 7, is_keeper: false, draft_id: 'draft-2025-demo', metadata: { first_name: 'Geno', last_name: 'Smith', position: 'QB', team: 'SEA' } },
  { player_id: '8220', picked_by: 'user8', roster_id: 8, round: 1, draft_slot: 8, pick_no: 8, original_slot: 8, is_keeper: false, draft_id: 'draft-2025-demo', metadata: { first_name: 'Jared', last_name: 'Goff', position: 'QB', team: 'DET' } },

  // Round 2 (Snake - reverse order)
  { player_id: '6806', picked_by: 'user8', roster_id: 8, round: 2, draft_slot: 8, pick_no: 9, original_slot: 8, is_keeper: false, draft_id: 'draft-2025-demo', metadata: { first_name: 'AJ', last_name: 'Brown', position: 'WR', team: 'PHI' } },
  { player_id: '6809', picked_by: 'user7', roster_id: 7, round: 2, draft_slot: 7, pick_no: 10, original_slot: 7, is_keeper: false, draft_id: 'draft-2025-demo', metadata: { first_name: 'DK', last_name: 'Metcalf', position: 'WR', team: 'SEA' } },
  { player_id: '6808', picked_by: 'user6', roster_id: 6, round: 2, draft_slot: 6, pick_no: 11, original_slot: 6, is_keeper: false, draft_id: 'draft-2025-demo', metadata: { first_name: 'Travis', last_name: 'Etienne', position: 'RB', team: 'JAX' } },
  { player_id: '6807', picked_by: 'user5', roster_id: 5, round: 2, draft_slot: 5, pick_no: 12, original_slot: 5, is_keeper: false, draft_id: 'draft-2025-demo', metadata: { first_name: 'Ja\'marr', last_name: 'Chase', position: 'WR', team: 'CIN' } },
  { player_id: '6816', picked_by: 'user4', roster_id: 4, round: 2, draft_slot: 4, pick_no: 13, original_slot: 4, is_keeper: false, draft_id: 'draft-2025-demo', metadata: { first_name: 'Saquon', last_name: 'Barkley', position: 'RB', team: 'PHI' } },
  { player_id: '6815', picked_by: 'user3', roster_id: 3, round: 2, draft_slot: 3, pick_no: 14, original_slot: 3, is_keeper: false, draft_id: 'draft-2025-demo', metadata: { first_name: 'James', last_name: 'Cook', position: 'RB', team: 'BUF' } },
  { player_id: '6817', picked_by: 'user2', roster_id: 2, round: 2, draft_slot: 2, pick_no: 15, original_slot: 2, is_keeper: false, draft_id: 'draft-2025-demo', metadata: { first_name: 'Derrick', last_name: 'Henry', position: 'RB', team: 'BAL' } },
  { player_id: '6840', picked_by: 'user1', roster_id: 1, round: 2, draft_slot: 1, pick_no: 16, original_slot: 1, is_keeper: false, draft_id: 'draft-2025-demo', metadata: { first_name: 'Hollywood', last_name: 'Brown', position: 'WR', team: 'KC' } },

  // Round 3
  { player_id: '6803', picked_by: 'user1', roster_id: 1, round: 3, draft_slot: 1, pick_no: 17, original_slot: 1, is_keeper: false, draft_id: 'draft-2025-demo', metadata: { first_name: 'Travis', last_name: 'Kelce', position: 'TE', team: 'KC' } },
  { player_id: '6805', picked_by: 'user2', roster_id: 2, round: 3, draft_slot: 2, pick_no: 18, original_slot: 2, is_keeper: false, draft_id: 'draft-2025-demo', metadata: { first_name: 'Mark', last_name: 'Andrews', position: 'TE', team: 'BAL' } },
  { player_id: '6829', picked_by: 'user3', roster_id: 3, round: 3, draft_slot: 3, pick_no: 19, original_slot: 3, is_keeper: false, draft_id: 'draft-2025-demo', metadata: { first_name: 'Dawson', last_name: 'Knox', position: 'TE', team: 'BUF' } },
  { player_id: '6830', picked_by: 'user4', roster_id: 4, round: 3, draft_slot: 4, pick_no: 20, original_slot: 4, is_keeper: false, draft_id: 'draft-2025-demo', metadata: { first_name: 'Dallas', last_name: 'Goedert', position: 'TE', team: 'PHI' } },
  { player_id: '6867', picked_by: 'user5', roster_id: 5, round: 3, draft_slot: 5, pick_no: 21, original_slot: 5, is_keeper: false, draft_id: 'draft-2025-demo', metadata: { first_name: 'CJ', last_name: 'Uzomah', position: 'TE', team: 'CIN' } },
  { player_id: '6872', picked_by: 'user6', roster_id: 6, round: 3, draft_slot: 6, pick_no: 22, original_slot: 6, is_keeper: false, draft_id: 'draft-2025-demo', metadata: { first_name: 'Evan', last_name: 'Engram', position: 'TE', team: 'JAX' } },
  { player_id: '6881', picked_by: 'user7', roster_id: 7, round: 3, draft_slot: 7, pick_no: 23, original_slot: 7, is_keeper: false, draft_id: 'draft-2025-demo', metadata: { first_name: 'Noah', last_name: 'Fant', position: 'TE', team: 'SEA' } },
  { player_id: '6891', picked_by: 'user8', roster_id: 8, round: 3, draft_slot: 8, pick_no: 24, original_slot: 8, is_keeper: false, draft_id: 'draft-2025-demo', metadata: { first_name: 'Cole', last_name: 'Holcomb', position: 'TE', team: 'DET' } },
]

export const mockPlayers: PlayersMap = {
  // KC Chiefs
  '8218': { player_id: '8218', first_name: 'Patrick', last_name: 'Mahomes', full_name: 'Patrick Mahomes', position: 'QB', team: 'KC' },
  '6803': { player_id: '6803', first_name: 'Travis', last_name: 'Kelce', full_name: 'Travis Kelce', position: 'TE', team: 'KC' },
  '6818': { player_id: '6818', first_name: 'Rashee', last_name: 'Rice', full_name: 'Rashee Rice', position: 'WR', team: 'KC' },
  '6816': { player_id: '6816', first_name: 'Isiah', last_name: 'Pacheco', full_name: 'Isiah Pacheco', position: 'RB', team: 'KC' },
  '6827': { player_id: '6827', first_name: 'Harrison', last_name: 'Butker', full_name: 'Harrison Butker', position: 'K', team: 'KC' },
  '6835': { player_id: '6835', first_name: 'Kansas City', last_name: 'Chiefs', full_name: 'Kansas City Chiefs', position: 'DEF', team: 'KC' },
  '6840': { player_id: '6840', first_name: 'Hollywood', last_name: 'Brown', full_name: 'Hollywood Brown', position: 'WR', team: 'KC' },
  '6841': { player_id: '6841', first_name: 'Darrel', last_name: 'Williams', full_name: 'Darrel Williams', position: 'RB', team: 'KC' },
  '6842': { player_id: '6842', first_name: 'Skyy', last_name: 'Moore', full_name: 'Skyy Moore', position: 'WR', team: 'KC' },
  '6843': { player_id: '6843', first_name: 'Noah', last_name: 'Gray', full_name: 'Noah Gray', position: 'TE', team: 'KC' },
  '6844': { player_id: '6844', first_name: 'JJ', last_name: 'Starbuck', full_name: 'JJ Starbuck', position: 'WR', team: 'KC' },

  // BAL Ravens
  '8213': { player_id: '8213', first_name: 'Lamar', last_name: 'Jackson', full_name: 'Lamar Jackson', position: 'QB', team: 'BAL' },
  '6805': { player_id: '6805', first_name: 'Mark', last_name: 'Andrews', full_name: 'Mark Andrews', position: 'TE', team: 'BAL' },
  '6820': { player_id: '6820', first_name: 'Zay', last_name: 'Jones', full_name: 'Zay Jones', position: 'WR', team: 'BAL' },
  '6817': { player_id: '6817', first_name: 'Derrick', last_name: 'Henry', full_name: 'Derrick Henry', position: 'RB', team: 'BAL' },
  '6828': { player_id: '6828', first_name: 'Isaiah', last_name: 'Likely', full_name: 'Isaiah Likely', position: 'TE', team: 'BAL' },
  '6846': { player_id: '6846', first_name: 'Odell', last_name: 'Beckham Jr', full_name: 'Odell Beckham Jr', position: 'WR', team: 'BAL' },
  '6847': { player_id: '6847', first_name: 'Rashod', last_name: 'Bateman', full_name: 'Rashod Bateman', position: 'WR', team: 'BAL' },
  '6848': { player_id: '6848', first_name: 'Gus', last_name: 'Edwards', full_name: 'Gus Edwards', position: 'RB', team: 'BAL' },
  '6849': { player_id: '6849', first_name: 'Justice', last_name: 'Hill', full_name: 'Justice Hill', position: 'RB', team: 'BAL' },
  '6850': { player_id: '6850', first_name: 'Willie', last_name: 'Snead IV', full_name: 'Willie Snead IV', position: 'WR', team: 'BAL' },
  '6851': { player_id: '6851', first_name: 'Baltimore', last_name: 'Ravens', full_name: 'Baltimore Ravens', position: 'DEF', team: 'BAL' },

  // BUF Bills
  '8216': { player_id: '8216', first_name: 'Josh', last_name: 'Allen', full_name: 'Josh Allen', position: 'QB', team: 'BUF' },
  '6804': { player_id: '6804', first_name: 'Stefon', last_name: 'Diggs', full_name: 'Stefon Diggs', position: 'WR', team: 'BUF' },
  '6819': { player_id: '6819', first_name: 'Gabe', last_name: 'Davis', full_name: 'Gabe Davis', position: 'WR', team: 'BUF' },
  '6815': { player_id: '6815', first_name: 'James', last_name: 'Cook', full_name: 'James Cook', position: 'RB', team: 'BUF' },
  '6829': { player_id: '6829', first_name: 'Dawson', last_name: 'Knox', full_name: 'Dawson Knox', position: 'TE', team: 'BUF' },
  '6852': { player_id: '6852', first_name: 'Cole', last_name: 'Beasley', full_name: 'Cole Beasley', position: 'WR', team: 'BUF' },
  '6853': { player_id: '6853', first_name: 'Isaiah', last_name: 'McKenzie', full_name: 'Isaiah McKenzie', position: 'WR', team: 'BUF' },
  '6854': { player_id: '6854', first_name: 'Damarla', last_name: 'Singletary', full_name: 'Damarla Singletary', position: 'RB', team: 'BUF' },
  '6855': { player_id: '6855', first_name: 'Nyheim', last_name: 'Hines', full_name: 'Nyheim Hines', position: 'RB', team: 'BUF' },
  '6856': { player_id: '6856', first_name: 'Matt', last_name: 'Milano', full_name: 'Matt Milano', position: 'LB', team: 'BUF' },
  '6857': { player_id: '6857', first_name: 'Buffalo', last_name: 'Bills', full_name: 'Buffalo Bills', position: 'DEF', team: 'BUF' },

  // PHI Eagles
  '8214': { player_id: '8214', first_name: 'Jalen', last_name: 'Hurts', full_name: 'Jalen Hurts', position: 'QB', team: 'PHI' },
  '6806': { player_id: '6806', first_name: 'AJ', last_name: 'Brown', full_name: 'AJ Brown', position: 'WR', team: 'PHI' },
  '6821': { player_id: '6821', first_name: 'DeVonta', last_name: 'Smith', full_name: 'DeVonta Smith', position: 'WR', team: 'PHI' },
  '6900': { player_id: '6900', first_name: 'Saquon', last_name: 'Barkley', full_name: 'Saquon Barkley', position: 'RB', team: 'PHI' },
  '6830': { player_id: '6830', first_name: 'Dallas', last_name: 'Goedert', full_name: 'Dallas Goedert', position: 'TE', team: 'PHI' },
  '6858': { player_id: '6858', first_name: 'Grant', last_name: 'Calcley', full_name: 'Grant Calcley', position: 'RB', team: 'PHI' },
  '6859': { player_id: '6859', first_name: 'Brown', last_name: 'Skipworth', full_name: 'Brown Skipworth', position: 'TE', team: 'PHI' },
  '6860': { player_id: '6860', first_name: 'Quez', last_name: 'Watkins', full_name: 'Quez Watkins', position: 'WR', team: 'PHI' },
  '6861': { player_id: '6861', first_name: 'Kenneth', last_name: 'Gainwell', full_name: 'Kenneth Gainwell', position: 'RB', team: 'PHI' },
  '6862': { player_id: '6862', first_name: 'Britain', last_name: 'Covey', full_name: 'Britain Covey', position: 'WR', team: 'PHI' },
  '6863': { player_id: '6863', first_name: 'Philadelphia', last_name: 'Eagles', full_name: 'Philadelphia Eagles', position: 'DEF', team: 'PHI' },

  // CIN Bengals
  '8215': { player_id: '8215', first_name: 'Joe', last_name: 'Burrow', full_name: 'Joe Burrow', position: 'QB', team: 'CIN' },
  '6807': { player_id: '6807', first_name: 'Ja\'marr', last_name: 'Chase', full_name: 'Ja\'marr Chase', position: 'WR', team: 'CIN' },
  '6822': { player_id: '6822', first_name: 'Tee', last_name: 'Higgins', full_name: 'Tee Higgins', position: 'WR', team: 'CIN' },
  '6864': { player_id: '6864', first_name: 'Evan', last_name: 'McPherson', full_name: 'Evan McPherson', position: 'K', team: 'CIN' },
  '6865': { player_id: '6865', first_name: 'Joe', last_name: 'Mixon', full_name: 'Joe Mixon', position: 'RB', team: 'CIN' },
  '6866': { player_id: '6866', first_name: 'Tyler', last_name: 'Boyd', full_name: 'Tyler Boyd', position: 'WR', team: 'CIN' },
  '6867': { player_id: '6867', first_name: 'CJ', last_name: 'Uzomah', full_name: 'CJ Uzomah', position: 'TE', team: 'CIN' },
  '6868': { player_id: '6868', first_name: 'Samaje', last_name: 'Perine', full_name: 'Samaje Perine', position: 'RB', team: 'CIN' },
  '6869': { player_id: '6869', first_name: 'Drew', last_name: 'Sample', full_name: 'Drew Sample', position: 'TE', team: 'CIN' },
  '6870': { player_id: '6870', first_name: 'Cincinnati', last_name: 'Bengals', full_name: 'Cincinnati Bengals', position: 'DEF', team: 'CIN' },
  '6871': { player_id: '6871', first_name: 'Mike', last_name: 'Thomas', full_name: 'Mike Thomas', position: 'WR', team: 'CIN' },

  // JAX Jaguars
  '8217': { player_id: '8217', first_name: 'Trevor', last_name: 'Lawrence', full_name: 'Trevor Lawrence', position: 'QB', team: 'JAX' },
  '6808': { player_id: '6808', first_name: 'Travis', last_name: 'Etienne', full_name: 'Travis Etienne', position: 'RB', team: 'JAX' },
  '6823': { player_id: '6823', first_name: 'Christian', last_name: 'Kirk', full_name: 'Christian Kirk', position: 'WR', team: 'JAX' },
  '6872': { player_id: '6872', first_name: 'Evan', last_name: 'Engram', full_name: 'Evan Engram', position: 'TE', team: 'JAX' },
  '6873': { player_id: '6873', first_name: 'Marvin', last_name: 'Jones Jr', full_name: 'Marvin Jones Jr', position: 'WR', team: 'JAX' },
  '6874': { player_id: '6874', first_name: 'Zay', last_name: 'Jones', full_name: 'Zay Jones', position: 'WR', team: 'JAX' },
  '6875': { player_id: '6875', first_name: 'James', last_name: 'Robinson III', full_name: 'James Robinson III', position: 'RB', team: 'JAX' },
  '6876': { player_id: '6876', first_name: 'Jalin', last_name: 'Conyers', full_name: 'Jalin Conyers', position: 'TE', team: 'JAX' },
  '6877': { player_id: '6877', first_name: 'Jalen', last_name: 'Guyton', full_name: 'Jalen Guyton', position: 'WR', team: 'JAX' },
  '6878': { player_id: '6878', first_name: 'Jacksonville', last_name: 'Jaguars', full_name: 'Jacksonville Jaguars', position: 'DEF', team: 'JAX' },
  '6879': { player_id: '6879', first_name: 'Tank', last_name: 'Bigsby', full_name: 'Tank Bigsby', position: 'RB', team: 'JAX' },

  // SEA Seahawks
  '8219': { player_id: '8219', first_name: 'Geno', last_name: 'Smith', full_name: 'Geno Smith', position: 'QB', team: 'SEA' },
  '6809': { player_id: '6809', first_name: 'DK', last_name: 'Metcalf', full_name: 'DK Metcalf', position: 'WR', team: 'SEA' },
  '6824': { player_id: '6824', first_name: 'Tyler', last_name: 'Lockett', full_name: 'Tyler Lockett', position: 'WR', team: 'SEA' },
  '6880': { player_id: '6880', first_name: 'Kenneth', last_name: 'Walker III', full_name: 'Kenneth Walker III', position: 'RB', team: 'SEA' },
  '6881': { player_id: '6881', first_name: 'Noah', last_name: 'Fant', full_name: 'Noah Fant', position: 'TE', team: 'SEA' },
  '6882': { player_id: '6882', first_name: 'Jaxon', last_name: 'Smith-Njigba', full_name: 'Jaxon Smith-Njigba', position: 'WR', team: 'SEA' },
  '6883': { player_id: '6883', first_name: 'Rashaad', last_name: 'Penny', full_name: 'Rashaad Penny', position: 'RB', team: 'SEA' },
  '6884': { player_id: '6884', first_name: 'Will', last_name: 'Dissly', full_name: 'Will Dissly', position: 'TE', team: 'SEA' },
  '6885': { player_id: '6885', first_name: 'Colby', last_name: 'Parkinson', full_name: 'Colby Parkinson', position: 'TE', team: 'SEA' },
  '6886': { player_id: '6886', first_name: 'Marquise', last_name: 'Goodwin', full_name: 'Marquise Goodwin', position: 'WR', team: 'SEA' },
  '6887': { player_id: '6887', first_name: 'Seattle', last_name: 'Seahawks', full_name: 'Seattle Seahawks', position: 'DEF', team: 'SEA' },

  // DET Lions
  '8220': { player_id: '8220', first_name: 'Jared', last_name: 'Goff', full_name: 'Jared Goff', position: 'QB', team: 'DET' },
  '6810': { player_id: '6810', first_name: 'Amon-Ra', last_name: 'St. Brown', full_name: 'Amon-Ra St. Brown', position: 'WR', team: 'DET' },
  '6825': { player_id: '6825', first_name: 'Jahmyr', last_name: 'Gibbs', full_name: 'Jahmyr Gibbs', position: 'RB', team: 'DET' },
  '6888': { player_id: '6888', first_name: 'David', last_name: 'Montgomery', full_name: 'David Montgomery', position: 'RB', team: 'DET' },
  '6889': { player_id: '6889', first_name: 'DJ', last_name: 'Moore', full_name: 'DJ Moore', position: 'WR', team: 'DET' },
  '6890': { player_id: '6890', first_name: 'Jameson', last_name: 'Williams', full_name: 'Jameson Williams', position: 'WR', team: 'DET' },
  '6891': { player_id: '6891', first_name: 'Cole', last_name: 'Holcomb', full_name: 'Cole Holcomb', position: 'TE', team: 'DET' },
  '6892': { player_id: '6892', first_name: 'Brock', last_name: 'Wright', full_name: 'Brock Wright', position: 'TE', team: 'DET' },
  '6893': { player_id: '6893', first_name: 'Quintez', last_name: 'Cephus', full_name: 'Quintez Cephus', position: 'WR', team: 'DET' },
  '6894': { player_id: '6894', first_name: 'Josh', last_name: 'Reynolds', full_name: 'Josh Reynolds', position: 'WR', team: 'DET' },
  '6895': { player_id: '6895', first_name: 'Detroit', last_name: 'Lions', full_name: 'Detroit Lions', position: 'DEF', team: 'DET' },
}

export const mockRookieDraftPicks: RookieDraftPick[] = [
  // 2026 picks
  { season: '2026', round: 1, original_slot: 1, roster_id: 1 },
  { season: '2026', round: 1, original_slot: 3, roster_id: 1, owner_id: 'user3' }, // Traded from user3
  { season: '2026', round: 2, original_slot: 1, roster_id: 2 },
  { season: '2026', round: 1, original_slot: 2, roster_id: 3, owner_id: 'user7' }, // Traded from user7
  { season: '2026', round: 2, original_slot: 4, roster_id: 4, owner_id: 'user6' }, // Traded from user6
  { season: '2026', round: 1, original_slot: 5, roster_id: 5 },
  { season: '2026', round: 1, original_slot: 6, roster_id: 6, owner_id: 'user2' }, // Traded from user2
  { season: '2026', round: 3, original_slot: 2, roster_id: 7 },

  // 2027 picks
  { season: '2027', round: 1, original_slot: 2, roster_id: 1, owner_id: 'user4' }, // Traded from user4
  { season: '2027', round: 1, original_slot: 4, roster_id: 2, owner_id: 'user5' }, // Traded from user5
  { season: '2027', round: 1, original_slot: 1, roster_id: 4 },
  { season: '2027', round: 2, original_slot: 3, roster_id: 5, owner_id: 'user1' }, // Traded from user1
  { season: '2027', round: 1, original_slot: 7, roster_id: 6, owner_id: 'user8' }, // Traded from user8
]
