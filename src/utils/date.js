/**
 *  Esta utilidad sirve para normalizar las fechas con timeZone de la base de 
 *  datos, para mostrar al usuario un formato 'YYYY-MM-DD'
 */

function normalizeGameInput(game) {
	const normalized = { ...game };

	if (normalized.ReleaseDate) {
		normalized.ReleaseDate = new Date(
			normalized.ReleaseDate
		);
	}

	return normalized;
}

function normalizeGameOutput(game) {
	if (!game) return game;

	return {
		...game,
		ReleaseDate: game.ReleaseDate
			? game.ReleaseDate.toISOString().split("T")[0]
			: null,
	};
}

module.exports = {
	normalizeGameInput,
	normalizeGameOutput,
};