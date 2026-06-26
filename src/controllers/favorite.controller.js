const favoriteService = require("../services/favorite.service.js");
const errorThrower = require("../utils/errors.js");
/**
 * Obtiene todos los favoritos del usuario autenticado
 * @param {Object} req - Request de Express
 * @param {Object} res - Response de Express
 * @param {Function} next - Middleware de error
 */
async function getFavorites(req, res, next) {
	try {
		const userId = req.user.id;

		const favorites = await favoriteService.getFavorites(userId);
		res.status(200).json(favorites);
	} catch (error) {
		next(error);
	}
}

/**
 * Añade favoritos a un usuario autenticado
 * @param {Object} req - Request de Express
 * @param {Object} res - Response de Express
 * @param {Function} next - Middleware de error
 */
async function addFavorite(req, res, next) {
	try {
		const gameId = parseInt(req.params.id);
		const userId = req.user.id;

		if (isNaN(gameId)) {
			errorThrower.invalidId(gameId);
		}

		const addedFavorite = await favoriteService.addFavorite(gameId, userId);
		res.status(201).json(addedFavorite);
	} catch (error) {
		next(error);
	}
}

module.exports = { getFavorites, addFavorite };
