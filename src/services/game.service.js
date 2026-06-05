const prisma = require("../prisma/prismaClient.js");

const INCLUDE_OPTIONS = { genres: true, screenshots: true };

async function getGames(cursor = null, limit = 10) {
	//* Cursor es algo de prisma, sirve para que el proximo paginado empieze desde el ultimo id recuperado
	//* la respuesta contiene nextCursor para que las peticiones en el FE se hagan con nextCursor
	const games = await prisma.game.findMany({
		take: limit,
		skip: cursor ? 1 : 0,
		cursor: cursor ? { id: cursor } : undefined,
		include: INCLUDE_OPTIONS,
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
		include: INCLUDE_OPTIONS,
	});

	return game;
}

async function getGameByFilter(condition) {
	const gamesFiltered = await prisma.game.findMany({
		where: condition,
		include: INCLUDE_OPTIONS,
	});

	return gamesFiltered;
}
async function updateGame(gameId, gameData) {
	const updatedGame = await prisma.game.update({
		where: { id: gameId },
		data: gameData,
		include: INCLUDE_OPTIONS,
	});

	return updatedGame;
}

module.exports = { getGames, getGameById, getGameByFilter, updateGame };
