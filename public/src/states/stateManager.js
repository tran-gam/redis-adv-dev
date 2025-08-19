import gameStateBase from "./gameStateBase.js";
import playerStateBase from "./playerStateBase.js";

export const gameState = gameStateBase().getInstance();
export const playerState = playerStateBase().getInstance();
