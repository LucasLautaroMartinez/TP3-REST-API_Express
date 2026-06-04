const prisma = require("../prisma/prismaClient.js");

const INCLUDE_OPTIONS = { genres: true, screenshots: true };

async function getGames() {
	const games = await prisma.game.findMany({
		include: INCLUDE_OPTIONS,
	});

	return games;
}

async function getGameById(gameId) {
	const game = await prisma.game.findUnique({
		where: {
			id: gameId,
		},
		include: INCLUDE_OPTIONS,
	});

	return game;
}

async function updateGame(gameId, gameData) {
	const updatedGame = await prisma.game.update({
		where: { id: gameId },
		data: gameData,
		include: INCLUDE_OPTIONS,
	});

	return updatedGame;
}

module.exports = { getGames, getGameById, updateGame };
