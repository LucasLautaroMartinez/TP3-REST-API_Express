const prisma = require("../src/prisma/prismaClient");
const games = require("./data/games.json");

async function main() {
	console.log("Iniciando seed...");

	// Limpiar datos existentes
	await prisma.favorite.deleteMany();
	await prisma.user.deleteMany();
	await prisma.gameTranslation.deleteMany();
	await prisma.screenshot.deleteMany();
	await prisma.game.deleteMany();
	await prisma.genre.deleteMany();

	console.log("→ Datos previos eliminados.");

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
	console.log("→ Géneros cargados.");
	
	// Crear juegos
	console.log("→ Cargando juegos...")
	for (const game of games) {
		const createdGame = await prisma.game.create({
			data: {
				Name: game.Name,
				Developer: game.Developer,
				Image: game.Image,
				Price: parseFloat(game.Price),
				Rating: game.Rating,
				ReleaseDate: new Date(game.ReleaseDate),

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
	console.log(`→ Juegos cargados: ${games.length}`)

	// Crear usuarios de prueba
	const testUser = await prisma.user.create({
		data: {
			name: "Usuario",
			email: "user@test.com",
			password: "userContrasenia",
		},
	});
	console.log("→ Usuario de prueba creado.");


	// Crear algunos favoritos de ejemplo
	const firstGames = await prisma.game.findMany({
		take: 3,
		orderBy: {
			id: "asc",
		},
	});

	for (const game of firstGames) {
		await prisma.favorite.create({
			data: {
				userId: testUser.id,
				gameId: game.id,
			},
		});
	}
	console.log("→ Favoritos de ejemplo cargados.");


	console.log("Seed completado.");
}

main()
	.catch((error) => {
		console.error("Error ejecutando seed:");
		console.error(error);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});