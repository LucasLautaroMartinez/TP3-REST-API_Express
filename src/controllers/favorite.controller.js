const favoriteService = require("../services/favorite.service.js");

async function getFavorites(req, res, next) {
	try {
		const userId = req.userId; //? ← Sacado del JWT que está en WIP, primero se tiene que decodificar

		const favorites = await favoriteService.getFavorites(userId);

		res.status(200).json(favorites);
	} catch (error) {
		next(error);
	}
}
