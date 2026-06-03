const prisma = require("../prisma/prismaClient.js");

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

module.exports = { updateGame };
