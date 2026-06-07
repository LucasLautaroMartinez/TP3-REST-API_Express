const prisma = require("../prisma/prismaClient.js");

const INCLUDE_OPTIONS = { genres: true, screenshots: true };

/**
 * Funcion que devuelve registros de la tabla genres segun el nombre
 * @param {String[]} genres
 * @returns {Object}
 */
async function getGenres(genres) {
	const genreRecords = await prisma.genre.findMany({
		where: { name: { in: genres, mode: "insensitive" } },
	});

	return genreRecords;
}

/**
 * Funcion para añadir screenshots a un juego a partir de un array de URLs
 * @param {int} gameId
 * @param {String[]} newUrls
 * @returns {String[]}
 */
async function addScreenshots(gameId, newUrls) {
	const existing = await prisma.screenshot.findMany({
		where: {
			gameId: gameId,
			imageUrl: { in: newUrls },
		},
		select: { imageUrl: true },
	});

	const existingUrls = existing.map((e) => e.imageUrl);

	const urlsToAdd = newUrls.filter((url) => !existingUrls.includes(url));

	if (urlsToAdd.length > 0) {
		await prisma.screenshot.createMany({
			data: urlsToAdd.map((url) => ({ imageUrl: url, gameId })),
		});
	}

	return urlsToAdd;
}

/**
 * @param {int} cursor
 * @param {int} limit
 * @returns {Object} { data: Object, nextCursor: int, hasMore: boolean }
 */
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

/**
 * @param {int} gameId
 * @returns {Object}
 */
async function getGameById(gameId) {
	const game = await prisma.game.findUnique({
		where: {
			id: gameId,
		},
		include: INCLUDE_OPTIONS,
	});
	return game;
}

/**
 * @param {Object} condition
 * @returns {Object}
 */
async function getGameByFilter(condition) {
	const gamesFiltered = await prisma.game.findMany({
		where: condition,
		include: INCLUDE_OPTIONS,
	});

	return gamesFiltered;
}

/**
 * @param {int} gameId
 * @param {Object} gameData
 * @returns {Object}
 */
async function updateGame(gameId, gameData) {
	const { genres, screenshots, ...restData } = gameData;

	const genreRecords = await getGenres(genres);
	const genresIds = genreRecords.map((g) => ({ id: g.id }));

	if (genreRecords.length !== genres.length) {
		return null;
	}

	await prisma.game.update({
		where: { id: gameId },
		data: {
			...restData,
			genres: genresIds.length ? { set: [], connect: genresIds } : undefined,
		},
	});

	if (screenshots && screenshots.length > 0) {
		await addScreenshots(gameId, screenshots);
	}

	return await prisma.game.findUnique({
		where: { id: gameId },
		include: INCLUDE_OPTIONS,
	});
}

module.exports = { getGames, getGameById, getGameByFilter, updateGame };
