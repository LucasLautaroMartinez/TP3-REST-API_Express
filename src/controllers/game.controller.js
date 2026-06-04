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

async function updateGame(req, res) {
	const gameId = Number(req.params.id);
	const data = req.body;
	const updatedGame = await gameService.updateGame(gameId, data);

	res.json(updatedGame);
}

module.exports = { getGames, getGameById, updateGame };
