const gameService = require("../services/game.service.js");

async function getGames(req, res) {
	const { Title, Developer, cursor, limit } = req.query;
	console.log(req.query);

	if (Title || Developer) {
		getGameByFilter(req, res);
	} else {
		const result = await gameService.getGames(
			parseInt(cursor),
			parseInt(limit),
		);
		res.json(result);
	}
}

async function getGameById(req, res) {
	const gameId = Number(req.params.id);
	const game = await gameService.getGameById(gameId);

	res.json(game);
}

async function getGameByFilter(req, res) {
	const keys = ["title", "developer"];
	const [key, value] = Object.entries(req.query)[0] || [];
	if (!keys.includes(key.toLowerCase())) {
		return console.log("MAL QUERY, NO TIENE NI TITLE NI DEVELOPER");
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

module.exports = { getGames, getGameById, getGameByFilter };
