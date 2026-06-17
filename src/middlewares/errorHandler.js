function errorHandler(err, req, res, next) {
	console.error(err.stack);

	const status = err.status || 500;

	const response = {
		error: err.message,
		code: err.code || "INTERNAL_ERROR",
	};

	if (err.details) {
		response.details = err.details;
	}

	res.status(status).json(response);
}

module.exports = errorHandler;
