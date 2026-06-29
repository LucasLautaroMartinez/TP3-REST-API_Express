const prisma = require("../prisma/prismaClient.js");
const errorThrower = require("../utils/errors.js");

const { DEFAULT_LANGUAGE } = require("../const/languages.js");
const { getTranslation, mapGameTranslation } = require("../utils/translation.js");

const {
	LIST_INCLUDE_OPTIONS,
	DETAIL_INCLUDE_OPTIONS,
	FILTER_INCLUDE_OPTIONS,
	CREATE_RESPONSE_INCLUDE_OPTIONS,
	UPDATE_RESPONSE_INCLUDE_OPTIONS
} = require("../const/includes.js");

const { normalizeGameInput, normalizeGameOutput } = require("../utils/date.js");



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
async function getGames(cursor = null, limit = 10, lang = DEFAULT_LANGUAGE) {
    //* Cursor es algo de prisma, sirve para que el proximo paginado empieze desde el ultimo id recuperado
    //* la respuesta contiene nextCursor para que las peticiones en el FE se hagan con nextCursor
    const games = await prisma.game.findMany({
		take: limit,
		skip: cursor ? 1 : 0,
		cursor: cursor ? { id: cursor } : undefined,
		include: LIST_INCLUDE_OPTIONS(lang),
		orderBy: { id: "asc" },
	});

	const nextCursor = games.length > 0 ? games[games.length - 1].id : null;
	const hasMore = games.length === limit;

	// Un solo map combinando traduccion y normalización
	const data = games.map(game => normalizeGameOutput(mapGameTranslation(game, lang)));

    const end = Date.now();

	return {
		data,
		nextCursor,
		hasMore,
	};
}



/**
 * @param {int} gameId
 * @param {string} lang
 * @returns {Object}
 */
async function getGameById(gameId, lang = DEFAULT_LANGUAGE) {

	const game = await ensureGameExists(gameId, DETAIL_INCLUDE_OPTIONS(lang));

	return normalizeGameOutput(
		mapGameTranslation(game, lang)
	);
}



/**
 * @param {Object} condition
 * @returns {Object}
 */
async function getGameByFilter(condition) {
	const gamesFiltered = await prisma.game.findMany({
		where: condition,
		include: FILTER_INCLUDE_OPTIONS,
	});

	return gamesFiltered.map(normalizeGameOutput);
}



/**
 * @param {int} gameId
 * @param {Object} gameData
 * @returns {Object}
 */
async function updateGame(gameId, gameData) {

	await ensureGameExists(gameId);

	const normalizedGameData = normalizeGameInput(gameData);
	const { genres, screenshots, translations, ...restData } = normalizedGameData;

  const updateData = { ...restData };

  if (genres !== undefined) {
    const genreRecords = await getGenres(genres);

		const genresIds = genreRecords.map((g) => ({ id: g.id }));

    if (genreRecords.length !== genres.length) {
      return null;
    }

    updateData.genres = genresIds.length ? { set: [], connect: genresIds } : undefined;
  }

	await prisma.game.update({
		where: { id: gameId },
		data: updateData,
	});

	if (screenshots !== undefined && screenshots.length > 0) {
		await addScreenshots(gameId, screenshots);
	}

	if (translations?.length) {
		for (const translation of translations) {
			await prisma.gameTranslation.upsert({
				where: {
					gameId_language: {
						gameId,
						language: translation.language,
					},
				},
				create: {
					gameId,
					language: translation.language,
					description: translation.description,
				},
				update: {
					description: translation.description,
				},
			});
		}
	}

	const updatedGame = await prisma.game.findUnique({
		where: { id: gameId },
		include: UPDATE_RESPONSE_INCLUDE_OPTIONS,
	});

	return normalizeGameOutput(
		mapGameTranslation(
			updatedGame,
			DEFAULT_LANGUAGE
		)
	);
}



/**
 * @param {int} gameId
 * @returns {Object}
 */
async function deleteGame(gameId) {

	await ensureGameExists(gameId);

	return await prisma.game.delete({ where: { id: gameId } });
}



/**
 * @param {Object} gameData
 * @returns {Object}
 */
async function createGame(gameData) {

	const normalizedGameData = normalizeGameInput(gameData);
	const { genres, screenshots, translations, ...restData } = normalizedGameData;

	const genreRecords = await getGenres(genres);

	if (genreRecords.length !== genres.length) {
		errorThrower.genresNotFound(
			genres,
			genreRecords
		);
	}

	const genresIds = genreRecords.map(
		(g) => ({ id: g.id })
	);

	const createdGame = await prisma.game.create({
		data: {
			...restData,

			genres: genresIds.length
				? { connect: genresIds }
				: undefined,

			translations: translations?.length
				? { create: translations }
				: undefined,
		},
	});

	if (
		screenshots &&
		screenshots.length > 0
	) {
		await addScreenshots(
			createdGame.id,
			screenshots
		);
	}

	const game = await prisma.game.findUnique({
		where: {
			id: createdGame.id,
		},
		include:
			CREATE_RESPONSE_INCLUDE_OPTIONS,
	});

	return normalizeGameOutput(
		mapGameTranslation(
			game,
			DEFAULT_LANGUAGE
		)
	);
}



async function ensureGameExists(gameId, include = undefined) {
	const game = await prisma.game.findUnique({
		where: { id: gameId },
		...(include ? { include } : {}),
	});

	if (!game) {
		errorThrower.gameNotFound(gameId);
	}

	return game;
}




module.exports = {
	getGames,
	getGameById,
	getGameByFilter,
	updateGame,
	deleteGame,
	createGame,
};
