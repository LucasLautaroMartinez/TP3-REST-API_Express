const gameService = require("../services/game.service.js");
const validateBody = require("../validations/body.validation.js");
const gameSchema = require("../const/schema.js");

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
	try {
		const { Name, Developer } = req.query;
		const cursor = req.query.cursor ? parseInt(req.query.cursor) : null;
		const limit = req.query.limit ? parseInt(req.query.limit) : 100;

		if (Name || Developer) {
			return getGameByFilter(req, res);
		}

		const result = await gameService.getGames(cursor, limit);
		res.status(200).json(result);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Error interno del servidor" });
	}
}

/**
 * @param {Object} req
 * @param {Object} res
 */
async function getGameById(req, res) {
	try {
		const gameId = parseInt(req.params.id);

		if (isNaN(gameId)) {
			return res.status(400).json({ error: "El ID debe ser un número" });
		}

		const game = await gameService.getGameById(gameId);

		if (!game) {
			return res.status(404).json({ error: "Juego no encontrado" });
		}

		res.status(200).json(game);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Error interno del servidor" });
	}
}

/**
 * @param {Object} req
 * @param {Object} res
 */
async function getGameByFilter(req, res) {
	try {
		const keys = ["name", "developer"];
		const [key, value] = Object.entries(req.query)[0] || [];

		if (!keys.includes(key?.toLowerCase())) {
			return res
				.status(400)
				.json({ error: "Debe filtrar por name o developer" });
		}

		const condition = {
			[key]: {
				contains: value,
				mode: "insensitive",
			},
		};

		const gamesFiltered = await gameService.getGameByFilter(condition);

		if (!gamesFiltered || gamesFiltered.length === 0) {
			return res.status(404).json({ error: "sin resultados" });
		}

		res.status(200).json(gamesFiltered);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Error interno del servidor" });
	}
}

/**
 * @param {Object} req
 * @param {Object} res
 */
async function updateGame(req, res) {
	const gameId = await getId(req);
	const data = req.body;
	if (data.id) {
		res.json("Not allowed to modify ID's");
	}
	const updatedGame = await gameService.updateGame(gameId, data);

	res.json(updatedGame);
}

/**
 * @param {Object} req
 * @param {Object} res
 */
async function updateGamePUT(req, res) {
	const body = req.body;
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

async function deleteGame(req, res) {
	const gameId = await getId(req);

	const deletedGame = await gameService.deleteGame(gameId);
	res.json(deletedGame);
}

/**
 * @param {Object} req
 * @param {Object} res
 */
async function createGame(req, res) {
	const body = req.body;

	const { isValid, errors, message } = validateBody(body, gameSchema);
	if (!isValid) {
		return console.log(errors);
	}
	if (body.id) {
		res.json("IDs are created automatically");
	}

	const gameCreated = await gameService.createGame(body);
	res.json(gameCreated);
}

module.exports = {
	getGames,
	getGameById,
	getGameByFilter,
	updateGame,
	updateGamePUT,
	deleteGame,
	createGame,
};
