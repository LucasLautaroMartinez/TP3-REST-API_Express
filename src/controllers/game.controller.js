const gameService = require("../services/game.service.js");
const { validateBody } = require("../validations/body.validation.js");
const gameSchema = require("../const/schema.js");
console.log("validateBody es:", typeof validateBody);
console.log("validateBody:", validateBody);

//? ESTO CAPAZ HABRIA QUE PONERLO EN UNA CARPETA UTILS
async function getId(req) {
	return Number(req.params.id);
}
//? ESTO CAPAZ HABRIA QUE PONERLO EN UNA CARPETA UTILS

/**
 * @param {Object} req
 * @param {Object} res
 */
async function getGames(req, res) {
	const { Name, Developer } = req.query;
	const cursor = req.query.cursor ? parseInt(req.query.cursor) : null;
	const limit = req.query.limit ? parseInt(req.query.limit) : 100;

	if (Name || Developer) {
		getGameByFilter(req, res);
	} else {
		const result = await gameService.getGames(cursor, limit);
		res.json(result);
	}
}

/**
 * @param {Object} req
 * @param {Object} res
 */
async function getGameById(req, res) {
  const gameId = await getId(req);
  const game = await gameService.getGameById(gameId);
  
  if (!game) {
    return res.status(404).json({ error: "Juego no encontrado" });
  }
  
  res.json(game);
}
/**
 * @param {Object} req
 * @param {Object} res
 */
async function getGameByFilter(req, res) {
  const [key, value] = Object.entries(req.query)[0] || [];
  const lowerKey = key?.toLowerCase();

  if (!lowerKey || (lowerKey !== "name" && lowerKey !== "developer")) {
    return res.json({ error: "no tiene name o developer" });
  }

  const prismaKey = lowerKey === 'name' ? 'Name' : 'Developer';

  const condition = {
    [prismaKey]: {
      contains: value,
      mode: "insensitive",
    },
  };

  const gamesFiltered = await gameService.getGameByFilter(condition);
  if (gamesFiltered.length === 0) {
    return res.json({ error: "No results" });
  }
  res.json(gamesFiltered);
}

/**
 * @param {Object} req
 * @param {Object} res
 */
async function updateGame(req, res) {
  try {
    const gameId = await getId(req);
    const data = req.body;
    
    if (data.id) {
      return res.status(400).json("Not allowed to modify ID's");
    }
    
    const updatedGame = await gameService.updateGame(gameId, data);
    res.json(updatedGame);
  } catch (error) {
    console.error("Error en updateGame:", error);
    res.status(500).json({ error: error.message });
  }
}

/**
 * @param {Object} req
 * @param {Object} res
 */
async function updateGamePUT(req, res) {
	const body = req.body;
	console.log("El body es: ", body);
	console.log("Campos del body:", Object.keys(req.body));
	const { isValid, errors, message } = validateBody(body, gameSchema);
	if (!isValid) {
		return console.log(errors);
	}
	if (body.id) {
		res.json("Not allowed to modify ID's");
	}

	const gameId = await getId(req);
	const updatedGame = await gameService.updateGame(gameId, body);
	res.json(updatedGame);
}

module.exports = {
	getGames,
	getGameById,
	getGameByFilter,
	updateGame,
	updateGamePUT,
};
