require("dotenv").config();

const app = require("./app");

const PORT = process.env.PORT || 3000;

if (process.env.VERCEL !== "1") {
	app.listen(PORT, () => {
		console.log(`Servidor ejecutándose en puerto ${PORT}`);
	});
}

module.exports = app;