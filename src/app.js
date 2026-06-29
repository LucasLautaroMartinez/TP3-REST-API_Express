const express = require("express");
const cors = require("cors");

const gameRoutes = require("./routes/game.routes.js");
const userRoutes = require("./routes/user.routes.js");
const favoriteRoutes = require("./routes/favorite.routes.js");
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

// Swagger

const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const isDev = process.env.NODE_ENV !== "production";
const BASE_URL = process.env.API_BASE_URL || (isDev ? "http://localhost:3000" : "");

const swaggerOptions = {
	definition: {
		openapi: "3.0.0",
		info: {
			title: "Games API",
			version: "1.0.0",
		},
		servers: [
			{
				url: `${BASE_URL}/api`,
			},
		],
		components: {
			securitySchemes: {
				bearerAuth: {
					type: "http",
					scheme: "bearer",
					bearerFormat: "JWT",
				},
			},
		},
		security: [
			{
				bearerAuth: [],
			},
		],
	},
	apis: ["./src/routes/*.js"],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/api/games", gameRoutes);
app.use("/api/auth", userRoutes);
app.use("/api/favorites", favoriteRoutes);

app.use(errorHandler);

module.exports = app;