const favoriteService = require("../services/favorite.service.js");

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

module.exports = { getFavorites };
