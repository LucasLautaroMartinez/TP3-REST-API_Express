const prisma = require("../src/prisma/prismaClient");
const games = require("./data/games.json");

async function main() {
  console.log("Iniciando seed...");

  // Limpiar datos existentes
  await prisma.screenshot.deleteMany();
  await prisma.game.deleteMany();
  await prisma.genre.deleteMany();


  // Obtener géneros únicos
  const uniqueGenres = [
    ...new Set(
      games.flatMap((game) => game.Genres)
    ),
  ];


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
        title: game.Name,
        description: game.Description,
        developer: game.Developer,
        imageUrl: game.Image,
        price: parseFloat(game.Price),
        rating: game.Rating,
        releaseDate: new Date(game.ReleaseDate),

        genres: {
          connect: game.Genres.map((genre) => ({
            name: genre,
          })),
        },
      },
    });


    // Crear screenshots
    if (game.Screenshots?.length) {
      await prisma.screenshot.createMany({
        data: game.Screenshots.map((url) => ({
          imageUrl: url,
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