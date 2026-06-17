const gameService = require("../services/game.service.js");
const validateBody = require("../validations/body.validation.js");
const gameSchema = require("../const/schema.js");
const errorThrower = require("../utils/errors.js");

//? ESTO CAPAZ HABRIA QUE PONERLO EN UNA CARPETA UTILS
/**
 * Obtiene y valida el id de la request
 * @param {Object} req
 * @returns {number}
 */
function getId(req) {
	const id = req.params.id;
	if (isNaN(id)) {
		errorThrower.invalidId(id);
	}
	return Number(id);
}
//? ESTO CAPAZ HABRIA QUE PONERLO EN UNA CARPETA UTILS

/**
 * @param {Object} req
 * @param {Object} res
 */
async function getGames(req, res, next) {
	try {
		const { Name, Developer, lang } = req.query;

		const cursor = req.query.cursor
			? parseInt(req.query.cursor)
			: null;

		const limit = req.query.limit
			? parseInt(req.query.limit)
			: 100;

		if (Name || Developer) {
			return getGameByFilter(req, res, next);
		}

		const result = await gameService.getGames(
			cursor,
			limit,
			lang
		);

		res.status(200).json(result);
	} catch (error) {
		next(error);
	}
}

/**
 * @param {Object} req
 * @param {Object} res
 */
async function getGameById(req, res, next) {
	try {
		const gameId = getId(req);

		const lang = req.query.lang;

		const game = await gameService.getGameById(
			gameId,
			lang
		);

		res.status(200).json(game);
	} catch (error) {
		next(error);
	}
}

/**
 * @param {Object} req
 * @param {Object} res
 */
async function getGameByFilter(req, res, next) {
	try {
		const [key, value] =
			Object.entries(req.query)[0] || [];

		const fieldMap = {
			name: "Name",
			developer: "Developer",
		};

		const prismaField =
			fieldMap[key?.toLowerCase()];

		if (!prismaField) {
			return res.status(400).json({
				error: "Debe filtrar por name o developer",
			});
		}

		const condition = {
			[prismaField]: {
				contains: value,
				mode: "insensitive",
			},
		};

		const gamesFiltered =
			await gameService.getGameByFilter(condition);

		res.status(200).json(gamesFiltered);
	} catch (error) {
		next(error);
	}
}

/**
 * PATCH /games/:id
 * Actualización parcial
 *
 * @param {Object} req
 * @param {Object} res
 */
async function updateGame(req, res, next) {
	try {
		const gameId = getId(req);

		const body = req.body;

		const { isValid, errors } = validateBody(
			body,
			gameSchema,
			true
		);

		if (!isValid) {
			errorThrower.invalidBody(errors);
		}

		if (body.id) {
			errorThrower.unauthorized();
		}

		const updatedGame =
			await gameService.updateGame(
				gameId,
				body
			);

		res.status(200).json(updatedGame);
	} catch (error) {
		next(error);
	}
}

/**
 * PUT /games/:id
 * Actualización completa
 *
 * @param {Object} req
 * @param {Object} res
 */
async function updateGamePUT(req, res, next) {
	try {
		const body = req.body;

		const { isValid, errors } = validateBody(
			body,
			gameSchema
		);

		if (!isValid) {
			errorThrower.invalidBody(errors);
		}

		if (body.id) {
			errorThrower.unauthorized();
		}

		const gameId = getId(req);

		const updatedGame =
			await gameService.updateGame(
				gameId,
				body
			);

		res.status(200).json(updatedGame);
	} catch (error) {
		next(error);
	}
}

/**
 * @param {Object} req
 * @param {Object} res
 */
async function deleteGame(req, res, next) {
	try {
		const gameId = getId(req);

		const deletedGame =
			await gameService.deleteGame(gameId);

		res.status(200).json(deletedGame);
	} catch (error) {
		next(error);
	}
}

/**
 * @param {Object} req
 * @param {Object} res
 */
async function createGame(req, res, next) {
	try {
		const body = req.body;

		const { isValid, errors } = validateBody(
			body,
			gameSchema
		);

		if (!isValid) {
			errorThrower.invalidBody(errors);
		}

		if (body.id) {
			errorThrower.rejectIdCreation();
		}

		const gameCreated =
			await gameService.createGame(body);

		return res.status(201).json(gameCreated);
	} catch (error) {
		next(error);
	}
}

module.exports = {
	getGames,
	getGameById,
	getGameByFilter,
	updateGame,
	updateGamePUT,
	deleteGame,
	createGame,
};