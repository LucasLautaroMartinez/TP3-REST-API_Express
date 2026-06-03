require("dotenv").config();
const PORT = process.env.PORT || 3000;
const gameRoutes = require("./routes/game.routes.js");
//? ESTO DEBERIA DE MOVERSE A APP.JS
const express = require("express");
const cors = require("cors");

const app = express();

// Middlewares

app.use(cors());
app.use(express.json());

// Routes
app.get("/api/health", (req, res) => {
	res.status(200).json({
		status: "ok",
		message: "API funcionando correctamente",
	});
});
app.use("/games", gameRoutes);

// Server
app.listen(PORT, () => {
	console.log(`Servidor ejecutándose en puerto ${PORT}`);
});

module.exports = app;
//? ESTO DEBERIA DE MOVERSE A APP.JS
