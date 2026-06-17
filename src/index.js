require("dotenv").config();
const PORT = process.env.PORT || 3000;
const gameRoutes = require("./routes/game.routes.js");
//? ESTO DEBERIA DE MOVERSE A APP.JS
const express = require("express");
const cors = require("cors");
const errorHandler = require("./middlewares/errorHandler.js");

const allowedOrigins = require("./const/allowedOrigins.js");

const app = express();

// Middlewares

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


// Swagger
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Games API',
      version: '1.0.0',
      description: 'API para gestionar juegos',
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
      },
    ],
  },
  apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.get("/api/health", (req, res) => {
	res.status(200).json({
		status: "ok",
		message: "API funcionando correctamente",
	});
});
app.use("/api/games", gameRoutes);

app.use(errorHandler);

// Server
app.listen(PORT, () => {
	console.log(`Servidor ejecutándose en puerto ${PORT}`);
});

module.exports = app;
//? ESTO DEBERIA DE MOVERSE A APP.JS
