const { DEFAULT_LANGUAGE } = require("../const/languages.js");

function getTranslation(translations, lang) {

	if (!translations?.length) return null;
	
	const requested = translations.find(
		(t) => t.language === lang
	);

	if (requested) return requested;

	const fallback = translations.find(
		(t) => t.language === DEFAULT_LANGUAGE
	);

	return fallback || null;
}

function mapGameTranslation(game, lang) {
	const translation = getTranslation(
		game.translations,
		lang
	);

	return {
		...game,
		description: translation?.description ?? null,
		language: translation?.language ?? null,
		translations: undefined,
	};
}


module.exports = { getTranslation, mapGameTranslation };