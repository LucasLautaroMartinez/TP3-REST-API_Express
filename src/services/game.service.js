const prisma = require("../prisma/prismaClient.js");

async function getGames(cursor = null, limit = 10) {
	//* Cursor es algo de prisma, sirve para que el proximo paginado empieze desde el ultimo id recuperado
	const games = await prisma.game.findMany({
		take: limit,
		skip: cursor ? 1 : 0,
		cursor: cursor ? { id: cursor } : undefined,
		include: {
			genres: true,
			screenshots: true,
		},
		orderBy: { id: "asc" },
	});

	const nextCursor = games.length > 0 ? games[games.length - 1].id : null;
	const hasMore = games.length === limit;

	return {
		data: games,
		nextCursor,
		hasMore,
	};
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

async function getGameByFilter(condition) {
	const gamesFiltered = await prisma.game.findMany({
		where: condition,
		include: {
			genres: true,
			screenshots: true,
		},
	});

	return gamesFiltered;
}
module.exports = { getGames, getGameById, getGameByFilter };
