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

module.exports = getGames;
