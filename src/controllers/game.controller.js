const gameService = require("../services/game.service.js");

async function getGames(req, res) {
	const { Title, Developer } = req.query;
	const cursor = req.query.cursor ? parseInt(req.query.cursor) : null;
	const limit = req.query.limit ? parseInt(req.query.limit) : 10;

	if (Title || Developer) {
		getGameByFilter(req, res);
	} else {
		const result = await gameService.getGames(cursor, limit);
		res.json(result);
	}
}

async function getGameById(req, res) {
	const gameId = Number(req.params.id);
	const game = await gameService.getGameById(gameId);
	res.json(game);
}

async function updateGame(req, res) {
	const gameId = Number(req.params.id);
	const data = req.body;
	const updatedGame = await gameService.updateGame(gameId, data);
	res.json(updatedGame);
}

async function getGameByFilter(req, res) {
	const keys = ["title", "developer"];
	const [key, value] = Object.entries(req.query)[0] || [];

	if (!keys.includes(key.toLowerCase())) {
		return res.json({ error: "no tiene title o developer" });
	}

	const condition = {
		[key.toLowerCase()]: {
			contains: value,
			mode: "insensitive",
		},
	};

	const gamesFiltered = await gameService.getGameByFilter(condition);
	res.json(gamesFiltered);
}

module.exports = { getGames, getGameById, getGameByFilter, updateGame };
