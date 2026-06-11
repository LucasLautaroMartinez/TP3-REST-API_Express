const gameService = require("../services/game.service.js");
const validateBody = require("../validations/body.validation.js");
const gameSchema = require("../const/schema.js");

//? ESTO CAPAZ HABRIA QUE PONERLO EN UNA CARPETA UTILS
async function getId(req) {
	const id = req.params.id;
	if (isNaN(id)) {
		const error = new Error(`INVALID ID, EXPECTED INTEGER FOUND: ${typeof id}`);
		error.code = "INVALID_ID";
		throw error;
	}
	return Number(id);
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
		const gameId = await getId(req);

		const game = await gameService.getGameById(gameId);

		res.status(200).json(game);
	} catch (error) {
		if (error.code === "INVALID_ID") {
			return res.status(400).json({ error: error.message });
		}

		if (error.code === "GAME NOT FOUND") {
			return res.status(404).json({ error: error.message });
		}

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
	try {
		const gameId = await getId(req);

		const data = req.body;
		if (data.id) {
			res.status(400).json("NOT ALLOWED TO MODIFY ID'S");
		}
		const updatedGame = await gameService.updateGame(gameId, data);

		res.status(201).json(updatedGame);
	} catch (error) {
		if (error.code === "INVALID_ID") {
			return res.status(400).json({ error: error.message });
		}
		if (error.code === "GAME NOT FOUND") {
			return res.status(404).json({ error: error.message });
		}
		console.error(error);
		res.status(500).json({ error: "INTERNAL SERVER ERROR" });
	}
}

/**
 * @param {Object} req
 * @param {Object} res
 */
async function updateGamePUT(req, res) {
	try {
		const body = req.body;
		const { isValid, errors, message } = validateBody(body, gameSchema);

		if (!isValid) {
			return res.status(400).json(errors);
		}
		if (body.id) {
			return res.status(400).json({ error: "NOT ALLOWED TO MODIFY ID'S" });
		}

		const gameId = await getId(req);
		const updatedGame = await gameService.updateGame(gameId, body);

		res.status(201).json(updatedGame);
	} catch (error) {
		if (error.code === "INVALID_ID") {
			return res.status(400).json({ error: error.message });
		}
		if (error.code === "GAME NOT FOUND") {
			return res.status(404).json({ error: error.message });
		}
		console.error(error);
		res.status(500).json({ error: "INTERNAL SERVER ERROR" });
	}
}

async function deleteGame(req, res) {
	try {
		const gameId = await getId(req);

		const deletedGame = await gameService.deleteGame(gameId);

		res.status(200).json(deletedGame);
	} catch (error) {
		if (error.code === "INVALID_ID") {
			return res.status(400).json({ error: error.message });
		}

		if (error.code === "GAME NOT FOUND") {
			return res.status(404).json({ error: error.message });
		}
		console.error(error);
		res.status(500).json({ error: "INTERNAL SERVER ERROR" });
	}
}

/**
 * @param {Object} req
 * @param {Object} res
 */
async function createGame(req, res) {
	try {
		const body = req.body;

		const { isValid, errors } = validateBody(body, gameSchema);

		if (!isValid) {
			return res.status(400).json({ error: errors });
		}

		if (body.id) {
			return res.status(400).json({ error: "IDs are created automatically" });
		}

		const gameCreated = await gameService.createGame(body);
		return res.status(201).json(gameCreated);
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: "INTERNAL SERVER ERROR" });
	}
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
