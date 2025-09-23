// Functions to load and save player and map data
export async function loadPlayerData(playerId) {
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
  const response = await fetch(`http://localhost:3000/api/`, {
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
