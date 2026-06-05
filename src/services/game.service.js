const prisma = require("../prisma/prismaClient.js");

async function getGames() {
	const games = await prisma.game.findMany({
		include: {
			genres: true,
			screenshots: true,
		},
	});
	return games;
}

async function getGameById(gameId) {
	const game = await prisma.game.findUnique({
		where: {
			id: gameId,
		},
		include: {
			genres: true,
			screenshots: true,
		},
	});
	return game;
}

async function updateGame(gameId, gameData) {
	const updatedGame = await prisma.game.update({
		where: { id: gameId },
		data: gameData,
		include: {
			genres: true,
			screenshots: true,
		},
	});
	return updatedGame;
}

module.exports = { getGames, getGameById, updateGame };