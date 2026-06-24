function gameNotFound(id) {
	const error = new Error(`GAME WITH ID ${id} NOT FOUND`);
	error.code = "GAME_NOT_FOUND";
	error.status = 404;
	throw error;
}

function invalidId(id) {
	const error = new Error(`INVALID ID, EXPECTED INTEGER FOUND: ${typeof id}`);
	error.code = "INVALID_ID";
	error.status = 400;
	throw error;
}

function unauthorized() {
	const error = new Error(`NOT ALLOWED TO MODIFY ID'S`);
	error.code = "UNAUTHORIZED";
	error.status = 403;
	throw error;
}

function invalidBody(errors) {
	const error = new Error(`INVALID BODY`);
	error.code = "VALIDATION_ERROR";
	error.status = 400;
	error.details = errors;
	throw error;
}

function rejectIdCreation() {
	const error = new Error(`ID'S ARE CREATED AUTOMATICALLY`);
	error.code = "REJECT_ID";
	error.status = 400;
	throw error;
}

function genresNotFound(genres, genreRecords) {
	const genreNamesInDb = genreRecords.map((g) => g.name);
	const missing = genres.filter((g) => !genreNamesInDb.includes(g));

	const error = new Error(`GENRES NOT FOUND: ${missing.join(", ")}`);
	error.code = "GENRES_NOT_FOUND";
	error.status = 400;
	throw error;
}

function userNotFound(userId) {
	const error = new Error(`USER WITH ID: ${userId} NOT FOUND`);
	error.code = "USER_NOT_FOUND";
	error.status = 404;
	throw error;
}

module.exports = {
	gameNotFound,
	invalidId,
	unauthorized,
	invalidBody,
	rejectIdCreation,
	genresNotFound,
	userNotFound,
};
