const prisma = require("./src/prisma/prismaClient");
const games = require("./prisma/data/games.json");

async function main() {
  console.log("Iniciando seed...");

  // Limpiar datos existentes
  await prisma.screenshot.deleteMany();
  await prisma.game.deleteMany();
  await prisma.genre.deleteMany();

  // Obtener generos únicos
  const uniqueGenres = [
    ...new Set(
      games.flatMap((game) => game.Genres)
    ),
  ];

  // Crear generos
  for (const genreName of uniqueGenres) {
    await prisma.genre.create({
      data: {
        name: genreName,
      },
    });
  }

  // Crear juegos
  let cargados = 0;
  for (const game of games) {
    try {
      const createdGame = await prisma.game.create({
        data: {
          Name: game.Name,
          Description: game.Description,
          Developer: game.Developer,
          Image: game.Image,
          Price: parseFloat(game.Price),
          Rating: game.Rating,
          ReleaseDate: new Date(game.ReleaseDate),
          isFavorite: false,
          genres: {
            connect: game.Genres.map((genre) => ({
              name: genre,
            })),
          },
        },
      });

      if (game.Screenshots?.length) {
        await prisma.screenshot.createMany({
          data: game.Screenshots.map((url) => ({
            imageUrl: url,
            gameId: createdGame.id,
          })),
        });
      }
      cargados++;
      console.log(`✅ ${cargados}: ${game.Name}`);
    } catch (error) {
      console.error(`❌ Error en ${game.Name}:`, error.message);
    }
  }

  console.log(`Seed completado. Juegos en JSON: ${games.length}, Juegos cargados: ${cargados}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });