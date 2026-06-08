const gameService = require("../services/game.service.js");
const validateBody = require("../validations/body.validation.js");
const gameSchema = require("../const/schema.js");

//? ESTO CAPAZ HABRIA QUE PONERLO EN UNA CARPETA UTILS
async function getId(req, res) {
	const id = req.params.id;
	const type = typeof id;
	if (isNaN(id)) {
		return res
			.status(400)
			.json({ error: `INVALID ID, EXPECTED INTEGER FOUND: ${type}` });
	}

	return Number(id);
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
	const gameId = await getId(req, res);
	const game = await gameService.getGameById(gameId);
	res.json(game);
}

/**
 * @param {Object} req
 * @param {Object} res
 */
async function getGameByFilter(req, res) {
	const keys = ["name", "developer"];
	const [key, value] = Object.entries(req.query)[0] || [];

	if (!keys.includes(key.toLowerCase())) {
		return res.json({ error: "no tiene name o developer" });
	}

	const condition = {
		[key]: {
			contains: value,
			mode: "insensitive",
		},
	};

	const gamesFiltered = await gameService.getGameByFilter(condition);
	if (gamesFiltered.length === 0) res.json({ error: "No results" });
	res.json(gamesFiltered);
}

/**
 * @param {Object} req
 * @param {Object} res
 */
async function updateGame(req, res) {
	try {
		const gameId = await getId(req, res);

		const data = req.body;
		if (data.id) {
			res.status(400).json("NOT ALLOWED TO MODIFY ID'S");
		}
		const updatedGame = await gameService.updateGame(gameId, data);

		if (!updatedGame) {
			res.status(500).json({ error: "INTERNAL SERVER ERROR" });
		}

		res.status(201).json(updatedGame);
	} catch (error) {
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

		const gameId = await getId(req, res);
		const updatedGame = await gameService.updateGame(gameId, body);

		if (!updatedGame) {
			return res.status(500).json({ error: "INTERNAL SERVER ERROR" });
		}

		res.status(201).json(updatedGame);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "INTERNAL SERVER ERROR" });
	}
}

async function deleteGame(req, res) {
	const gameId = await getId(req, res);

	const deletedGame = await gameService.deleteGame(gameId);
	res.json(deletedGame);
}

module.exports = {
	getGames,
	getGameById,
	getGameByFilter,
	updateGame,
	updateGamePUT,
	deleteGame,
};
