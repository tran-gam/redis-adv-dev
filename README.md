# Updates

## v0.03

- Implemented enemy spawn
  - Working on collision handling
- Optimization:
  - Using Game Object local timers for enemy behaviors
  - Using Game Object local input handler for player inputs
  - Hide offscreen objects
- Added `debugLog` utility function, logs messages to both the browser and Kaplay consoles

## v0.02

- Player data can now be stored in playerState singleton
- `playerState` can now be directly stored in Redis using [JSON.SET](https://redis.io/docs/latest/commands/json.set/)
- Saving and loading data returns status
- `MainMenu` scene can take Player ID input and search Redis for existing player data using [JSON.GET](https://redis.io/docs/latest/commands/json.get/)

## v0.01

- Base game
- Frontend: [KaplayJS](https://kaplayjs.com/)
- Backend: NodeJS with Redis for data persistence
  - Backend also serving static frontend
