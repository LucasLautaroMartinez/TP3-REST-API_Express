const gameService = require("../services/game.service.js");

async function getGames(req, res) {
	const games = await gameService.getGames();

	res.json(games);
}

async function getGameById(req, res) {
	const gameId = Number(req.params.id);
	const game = await gameService.getGameById(gameId);

	res.json(game);
}

module.exports = { getGames, getGameById };
