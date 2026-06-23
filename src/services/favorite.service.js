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

module.exports = { getFavorites };
