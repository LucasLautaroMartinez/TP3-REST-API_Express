const favoriteService = require("../services/favorite.service.js");

/**
 * Obtiene todos los favoritos del usuario autenticado
 * @param {Object} req - Request de Express
 * @param {Object} res - Response de Express
 * @param {Function} next - Middleware de error
 */
async function getFavorites(req, res, next) {
	try {
		const userId = req.userId; //? ← Sacado del JWT que está en WIP, primero se tiene que decodificar
		console.log(req.userId);
		const favorites = await favoriteService.getFavorites(userId);
		const gamesIds = favorites.map((fav) => fav.gameId);
		res.status(200).json(gamesIds);
	} catch (error) {
		next(error);
	}
}

module.exports = { getFavorites };
