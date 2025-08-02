# Supabase Setup Guide for Dog Simulation Game

## 1. Create Supabase Project
1. Go to https://supabase.com
2. Create a new project
3. Note down your project URL and anon public key

## 2. Update Configuration
Replace the placeholder values in `script.js`:
```javascript
this.supabaseUrl = 'YOUR_SUPABASE_URL';
this.supabaseKey = 'YOUR_SUPABASE_ANON_KEY';
```

## 3. Create Database Tables

### Table 1: game_saves
This table stores ongoing game progress.

```sql
CREATE TABLE game_saves (
    id BIGSERIAL PRIMARY KEY,
    player_name TEXT UNIQUE NOT NULL,
    game_data JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Table 2: game_results
This table stores completed game results for leaderboards.

```sql
CREATE TABLE game_results (
    id BIGSERIAL PRIMARY KEY,
    player_name TEXT NOT NULL,
    player_lifestyle TEXT,
    player_income TEXT,
    living_situation TEXT,
    final_dog_happiness INTEGER,
    final_player_happiness INTEGER,
    total_spent INTEGER,
    total_days INTEGER,
    vet_visits INTEGER,
    walks INTEGER,
    training_sessions INTEGER,
    grooming_sessions INTEGER,
    accidents INTEGER,
    social_events INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Table 3: players
This table stores simple player scores for quick leaderboards.

```sql
CREATE TABLE players (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    score INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 4. Set Up Row Level Security (RLS)

### For game_saves table:
```sql
ALTER TABLE game_saves ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public access to game_saves" ON game_saves
    FOR ALL USING (true);
```

### For game_results table:
```sql
ALTER TABLE game_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public access to game_results" ON game_results
    FOR ALL USING (true);
```

### For players table:
```sql
ALTER TABLE players ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public access to players" ON players
    FOR ALL USING (true);
```

## 5. Features Added

### Auto-Save
- Game progress is automatically saved every day (10 seconds)
- Manual save button available in the action panel
- Players can resume their game when they return

### Leaderboard
- Shows top 10 players by dog happiness score
- Highlights current player in the leaderboard
- Displays on the results screen

### Game Persistence
- Saves complete game state including all statistics
- Loads previous games when players return
- Stores final results for analysis

## 6. Database Schema Details

### game_saves table fields:
- `player_name`: Unique identifier for each player
- `game_data`: Complete JSON object of game state
- `created_at`: Timestamp of when save was created
- `updated_at`: Timestamp of last update

### game_results table fields:
- All player demographics (lifestyle, income, living situation)
- Final scores (dog happiness, player happiness)
- Financial data (total spent)
- Game statistics (walks, training sessions, etc.)
- Timestamp of when game was completed

## 7. Testing
1. Start a new game
2. Perform some actions
3. Check that the save button works
4. Refresh the page and verify your game loads
5. Complete a game and check the leaderboard
6. Verify results are saved to the database

## 8. Troubleshooting
- Check browser console for any Supabase connection errors
- Verify your project URL and anon key are correct
- Ensure RLS policies allow public access
- Check that tables are created with the correct schema 