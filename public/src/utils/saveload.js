import { playerState, gameState } from "../states/stateManager.js";

export async function loadPlayerData(playerId) {
  // fetch player data from backend API
  // "http://localhost:3000" can be removed from fetch URL because it's the same origin
  const response = await fetch(`http://localhost:3000/api/${playerId}`);

  if (!response.ok) {
    if (response.status === 404) {
      console.warn("No player data found.");
      return null;
    } else {
      throw new Error(`Error loading player data: ${response.statusText}`);
    }
  }

  const data = await response.json();
  playerState.load(data);
  console.log("Loading player data:", data);

  return `Load status: ${response.statusText}`;
}

export async function savePlayerData() {
  const playerData = playerState.get();
  console.log("Saving player data:", playerData);

  let response = await fetch(`http://localhost:3000/api/`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ playerData }),
  });

  if (!response.ok) {
    // If player not found, create new player data
    if (response.status === 404) {
      console.log("No save file found, creating new save.");
      return await createPlayerData();
    } else {
      throw new Error(`Error saving player data: ${response.statusText}`);
    }
  }

  return `Save status: ${response.statusText}`;
}

export async function createPlayerData() {
  const playerData = playerState.get();
  console.log("Creating player data:", playerData);

  const response = await fetch(`http://localhost:3000/api/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ playerData }),
  });

  if (!response.ok) {
    throw new Error(`Error creating player data: ${response.statusText}`);
  }

  return `Create status: ${response.statusText}`;
}

export async function fetchData(path) {
  return await (await fetch(path)).json();
}
