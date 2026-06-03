const gameService = require("../services/game.service.js");

async function updateGame(req, res) {
	console.log(req);
	const gameId = Number(req.params.id);
	const data = req.body;
	const updatedGame = await gameService.updateGame(gameId, data);

	res.json(updatedGame);
}

module.exports = { updateGame };
