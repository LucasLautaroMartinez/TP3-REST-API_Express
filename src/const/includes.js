const { DEFAULT_LANGUAGE } = require("./languages.js");

/**
 * Utilizado por GET /games
 * Devuelve únicamente las traducciones necesarias
 * para el idioma solicitado y el fallback.
 */
const LIST_INCLUDE_OPTIONS = (lang = DEFAULT_LANGUAGE) => ({
	genres: true,
	screenshots: true,
	translations: {
		where: {
			language: {
				in: [lang, DEFAULT_LANGUAGE],
			},
		},
	},
});

/**
 * Utilizado por GET /games/:id
 */
const DETAIL_INCLUDE_OPTIONS = (lang = DEFAULT_LANGUAGE) => ({
	genres: true,
	screenshots: true,
	translations: {
		where: {
			language: {
				in: [lang, DEFAULT_LANGUAGE],
			},
		},
	},
});

/**
 * Utilizado por búsquedas y filtros.
 * No carga traducciones.
 */
const FILTER_INCLUDE_OPTIONS = {
	genres: true,
	screenshots: true,
};

/**
 * Utilizado para responder luego de un POST.
 * Devuelve todas las relaciones creadas.
 */
const CREATE_RESPONSE_INCLUDE_OPTIONS = {
	genres: true,
	screenshots: true,
	translations: true,
};

/**
 * Utilizado para responder luego de un PUT.
 * Devuelve todas las relaciones actualizadas.
 */
const UPDATE_RESPONSE_INCLUDE_OPTIONS = {
	genres: true,
	screenshots: true,
	translations: true,
};

module.exports = {
	LIST_INCLUDE_OPTIONS,
	DETAIL_INCLUDE_OPTIONS,
	FILTER_INCLUDE_OPTIONS,
	CREATE_RESPONSE_INCLUDE_OPTIONS,
	UPDATE_RESPONSE_INCLUDE_OPTIONS,
};