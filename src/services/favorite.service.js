const prisma = require("../prisma/prismaClient.js");
const errorThrower = require("../utils/errors.js");

/**
 * Obtiene todos los favoritos de un usuario
 * @param {number} userId - ID del usuario autenticado
 * @returns {Promise<Array>} Lista de favoritos según userId
 * @throws {Error} Si hay error en la BD
 */
async function getFavorites(userId) {
	const favorites = await prisma.favorite.findMany({
		where: {
			userId: userId,
		},
	});

	return favorites;
}

/**
 * Añade un favorito según ID de juego e ID de usuario
 * @param {Int} gameId - ID del juego a añadir
 * @param {Int} userId - ID del usuario autenticado
 * @returns {Promise<Object>} - Favorito añadido
 * @throws {Error} - Si hay error en BD, si ya existe el favorito o si no existe el juego
 */
async function addFavorite(gameId, userId) {
	const gameExistence = await prisma.game.findUnique({
		where: { id: gameId },
	});

	if (!gameExistence) {
		errorThrower.gameNotFound(gameId);
	}

	const existing = await prisma.favorite.findUnique({
		where: {
			userId_gameId: { userId, gameId },
		},
	});

	if (existing) {
		errorThrower.existingFavorite(gameId);
	}

	const addedFavorite = await prisma.favorite.create({
		data: {
			userId,
			gameId,
		},
	});

	return addedFavorite;
}

/**
 * Borra un favorito según gameId y userId
 * @param {Int} gameId - ID del juego a añadir
 * @param {Int} userId - ID del usuario autenticado
 * @returns {Promise<Object>} - Favorito eliminado
 * @throws {Error} - Si hay error en BD o si no existe el registro de favorito
 */
async function deleteFavorite(gameId, userId) {
	const existing = await prisma.favorite.findUnique({
		where: {
			userId_gameId: { userId, gameId },
		},
	});

	if (!existing) {
		errorThrower.favoriteNotFound();
	}

	const deletedFavorite = await prisma.favorite.delete({
		where: {
			userId_gameId: { userId, gameId },
		},
	});

	return deletedFavorite;
}

module.exports = { getFavorites, addFavorite, deleteFavorite };
