import { playerState, gameState } from "../states/stateManager.js";

export async function loadPlayerData(playerId) {
  const data = await fetchPlayerData(playerId);

  if (data.documents.length === 0) {
    console.log("No save file found.");
    return null;
  }
  //load player data into player state
  playerState.set("position", { x: data.documents[0].value.x, y: data.documents[0].value.y });
  console.log("Player data loaded:", data.documents[0].value.x + ", " + data.documents[0].value.y);
}

export async function fetchPlayerData(playerId) {
  // fetch player data from backend API
  // "http://localhost:3000" is removed from fetch URL because it's the same origin
  const response = await fetch(`/api/?id=${playerId}`);
  if (!response.ok) {
    throw new Error(`Error fetching player data: ${response.statusText}`);
  }
  return await response.json();
}

export async function savePlayerData(playerId, pos) {
  let response = await fetch(`/api/`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: playerId,
      x: Math.round(pos.x),
      y: Math.round(pos.y),
    }),
  });

  if (!response.ok) {
    // If player not found, create new player data
    if (response.status === 404) {
      console.log("No save file found, creating new save.");
      return await createPlayerData(playerId, "tran", pos);
    } else {
      throw new Error(`Error saving player data: ${response.statusText}`);
    }
  }
  return await response.json();
}

export async function createPlayerData(playerId, playerName, pos) {
  const response = await fetch(`/api/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: playerId,
      name: playerName || "Hero",
      x: Math.round(pos.x),
      y: Math.round(pos.y),
    }),
  });

  if (!response.ok) {
    throw new Error(`Error saving player data: ${response.statusText}`);
  }
  return await response.json();
}

export async function fetchMapData(mapPath) {
  return await (await fetch(mapPath)).json();
}
