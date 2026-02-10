# Fantasy League Data

A modern web app to view your Sleeper fantasy football league data. Enter your league ID to see standings, users, and transactions at a glance.

[https://fantasy-league-data.vercel.app/](https://fantasy-league-data.vercel.app/)

## Features

- 📊 **Standings** - View league rankings with wins, losses, and points
- 👥 **Users** - See all league members and their profiles
- 📝 **Transactions** - Track all trades, waivers, and free agent pickups

## Getting Started

### Prerequisites

- Node.js 16+ and npm

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/fantasy-league-data.git
   cd fantasy-league-data
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Start the development server
   ```bash
   npm run dev
   ```

4. Open [http://localhost:5173](http://localhost:5173) in your browser

### Build

To build for production:

```bash
npm run build
```

## Usage

1. Go to the home page
2. Enter your Sleeper league ID
3. Click "View League"
4. Browse standings, users, and transactions using the tabs

## Technologies

- React 18
- TypeScript
- Vite
- Tailwind CSS
- React Router

## API

This app uses the [Sleeper API](https://docs.sleeper.app/) to fetch fantasy football league data.

## License

MIT
