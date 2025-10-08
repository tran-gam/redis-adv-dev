# Updates

## v0.02

- Player data can now be stored in playerState singleton
- `playerState` can now be directly stored in Redis using [JSON.SET](https://redis.io/docs/latest/commands/json.set/)
- Saving and loading data returns status
- `MainMenu` scene can take Player ID input and search Redis for existing player data using [JSON.GET](https://redis.io/docs/latest/commands/json.get/)

## v0.01

- Base game
- Frontend: [KaPlayJS](https://kaplayjs.com/)
- Backend: NodeJS with Redis for data persistence
  - Backend also serving static frontend
