import getClient from "./redis.js";
import { SchemaFieldTypes } from "redis";

/**
 * An error object
 * @typedef {Object} GameError
 * @property {number} status
 * @property {string} message
 *
 * A Game status
 * @typedef {"Game" | "in progress" | "complete"} GameStatus
 *
 * A Game object
 * @typedef {Object} Game
 * @property {string} name
 * @property {GameStatus} status
 * @property {string} created_date
 * @property {string} updated_date
 *
 * A Game document
 * @typedef {Object} GameDocument
 * @property {string} id
 * @property {Game} value
 *
 * A Game object
 * @typedef {Object} Games
 * @property {number} total
 * @property {GameDocument[]} documents
 */

const GAME_INDEX = "game-idx";
const GAME_PREFIX = "game:";

/**
 * Checks if the GAME_INDEX already exists in Redis
 *
 * @returns {Promise<boolean>}
 */
async function haveIndex() {
  const redis = await getClient();
  const indexes = await redis.ft._list();

  return indexes.some((index) => {
    return index === GAME_INDEX;
  });
}

/**
 * Creates the GAME_INDEX if it doesn't exist already
 *
 * @returns {Promise<void>}
 */
export async function createIndexIfNotExists() {
  const redis = await getClient();

  if (!(await haveIndex())) {
    await redis.ft.create(
      GAME_INDEX,
      {
        "$.name": {
          AS: "name",
          type: SchemaFieldTypes.TEXT,
        },
        "$.status": {
          AS: "status",
          type: SchemaFieldTypes.TEXT,
        },
      },
      {
        ON: "JSON",
        PREFIX: GAME_PREFIX,
      }
    );
  }
}

/**
 * Drops the GAME_INDEX if it exists
 *
 * @returns {Promise<void>}
 */
export async function dropIndex() {
  const redis = await getClient();

  if (await haveIndex()) {
    await redis.ft.dropIndex(GAME_INDEX);
  }
}

/**
 * Initializes Game index if necessary
 *
 * @returns {Promise<void>}
 */
export async function initialize() {
  await createIndexIfNotExists();
}

const Game_REGEXP = new RegExp(`^${GAME_PREFIX}`);

/**
 * Allow for id with or without GAME_PREFIX
 *
 * @param {string} id
 * @returns {string}
 */
function formatId(id) {
  return Game_REGEXP.test(id) ? id : `${GAME_PREFIX}${id}`;
}

/**
 * Gets all game
 *
 * @returns {Promise<Games>}
 */
export async function all() {
  const redis = await getClient();

  return /** @type {Promise<Games>} */ (redis.ft.search(GAME_INDEX, "*"));
}

/**
 * Gets a Game by id
 *
 * @param {string} id
 * @returns {Promise<Game | GameError | null>}
 */
export async function one(id) {
  const redis = await getClient();

  const Game = await redis.json.get(formatId(id));

  if (!Game) {
    return { status: 404, message: "Not Found" };
  }

  return /** @type {Game} */ (Game);
}

/**
 * Searches for game by name and/or status
 *
 * @param {string} [name]
 * @param {string} [status]
 * @returns {Promise<Games>}
 */
export async function search(name, status) {
  const redis = await getClient();
  const searches = [];

  if (name) {
    searches.push(`@name:(${name})`);
  }

  if (status) {
    searches.push(`@status:"${status}"`);
  }

  return /** @type {Promise<Games>} */ (
    redis.ft.search(GAME_INDEX, searches.join(" "))
  );
}

/**
 * Creates a Game
 *
 * @param {string} [id]
 * @param {string} [name]
 * @returns {Promise<GameDocument | GameError>}
 */
export async function create(id, name, x, y) {
  const redis = await getClient();
  const date = new Date();

  if (!name) {
    return { status: 400, message: "Game must have a name" };
  }

  /**
   * @type {GameDocument}
   */
  const Game = {
    id: formatId(id),
    value: {
      name,
      x,
      y,
      created_date: date.toISOString(),
      updated_date: date.toISOString(),
    },
  };

  const result = await redis.json.set(Game.id, "$", Game.value);

  if (result?.toUpperCase() === "OK") {
    return Game;
  } else {
    return { status: 400, message: "Game is invalid" };
  }
}

/**
 * Updates a Game
 *
 * @param {string} id
 * @param {GameStatus} status
 * @returns {Promise<Game | GameError>}
 */
export async function update(id, x, y) {
  const redis = await getClient();
  const date = new Date();

  const GameOrError = await one(id);

  if (!GameOrError || isFinite(/** @type {number} */ (GameOrError.status))) {
    return { status: 404, message: "Not Found" };
  }

  const Game = /** @type {Game} */ (GameOrError);
  Game.x = x;
  Game.y = y;
  Game.updated_date = date.toISOString();

  const result = await redis.json.set(formatId(id), "$", Game);

  if (result?.toUpperCase() === "OK") {
    return Game;
  } else {
    return { status: 400, message: "Game is invalid" };
  }
}

/**
 * Deletes a Game
 *
 * @param {string} id
 */
export async function del(id) {
  const redis = await getClient();

  await redis.json.del(formatId(id));
}

/**
 * Delete all game
 *
 * @returns {Promise<void>}
 */
export async function delAll() {
  const redis = await getClient();
  const game = await all();

  if (game.total > 0) {
    await redis.del(game.documents.map((Game) => Game.id));
  }
}
