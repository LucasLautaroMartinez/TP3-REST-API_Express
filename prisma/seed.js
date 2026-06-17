const prisma = require("../src/prisma/prismaClient");
const games = require("./data/games.json");

async function main() {
	console.log("Iniciando seed...");

	// Limpiar datos existentes
	await prisma.gameTranslation.deleteMany();
	await prisma.screenshot.deleteMany();
	await prisma.game.deleteMany();
	await prisma.genre.deleteMany();

	// Obtener géneros únicos
	const uniqueGenres = [...new Set(games.flatMap((game) => game.genres))];

	// Crear géneros
	for (const genreName of uniqueGenres) {
		await prisma.genre.create({
			data: {
				name: genreName,
			},
		});
	}

	// Crear juegos
	for (const game of games) {
		const createdGame = await prisma.game.create({
			data: {
				Name: game.Name,
				Developer: game.Developer,
				Image: game.Image,
				Price: parseFloat(game.Price),
				Rating: game.Rating,
				ReleaseDate: new Date(game.ReleaseDate),
				isFavorite: game.isFavorite ?? false,

				genres: {
					connect: game.genres.map((genre) => ({
						name: genre,
					})),
				},
			},
		});

		// Crear screenshots
		if (game.screenshots?.length) {
			await prisma.screenshot.createMany({
				data: game.screenshots.map((url) => ({
					imageUrl: url,
					gameId: createdGame.id,
				})),
			});
		}

		// Crear traducciones
		if (game.translations?.length) {
			await prisma.gameTranslation.createMany({
				data: game.translations.map((translation) => ({
					language: translation.language,
					description: translation.description,
					gameId: createdGame.id,
				})),
			});
		}
	}

	console.log(`Seed completado. Juegos cargados: ${games.length}`);
}

main()
	.catch((error) => {
		console.error(error);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});