const express = require("express");
const cors = require("cors");

const gameRoutes = require("./routes/game.routes.js");
const errorHandler = require("./middlewares/errorHandler.js");
const allowedOrigins = require("./const/allowedOrigins.js");

const app = express();

app.use(
	cors({
		origin: (origin, callback) => {
			if (!origin || allowedOrigins.includes(origin)) {
				return callback(null, true);
			}

			callback(new Error("Origen no permitido por CORS"));
		},
	}),
);

app.use(express.json());

app.get("/api/health", (req, res) => {
	res.status(200).json({
		status: "ok",
		message: "API funcionando correctamente",
	});
});

app.use("/api/games", gameRoutes);

app.use(errorHandler);

module.exports = app;