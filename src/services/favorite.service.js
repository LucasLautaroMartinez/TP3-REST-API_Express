const prisma = require("../prisma/prismaClient.js");
const errorThrower = require("../utils/errors.js");

async function getFavorites(userId) {
	try {
		const favorites = await prisma.favorite.findMany({
			where: {
				userId: userId, //! habria que cambiar en user id por userId
			},
		});

		return favorites;
	} catch (error) {
		next(error);
	}
}
