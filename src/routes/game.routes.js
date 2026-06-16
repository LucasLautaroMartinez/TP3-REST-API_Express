/**
 * @swagger
 * components:
 *   schemas:
 *     Game:
 *       type: object
 *       required:
 *         - Name
 *         - Rating
 *         - Developer
 *         - Price
 *         - ReleaseDate
 *         - Image
 *         - Description
 *       properties:
 *         id:
 *           type: integer
 *           description: ID autoincremental
 *         Name:
 *           type: string
 *         Rating:
 *           type: integer
 *           minimum: 1
 *           maximum: 5
 *         Developer:
 *           type: string
 *         Price:
 *           type: number
 *         ReleaseDate:
 *           type: string
 *           format: date
 *         Image:
 *           type: string
 *         Description:
 *           type: string
 *         isFavorite:
 *           type: boolean
 *         genres:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *               name:
 *                 type: string
 *         screenshots:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *               imageUrl:
 *                 type: string
 */

/**
 * @swagger
 * /games:
 *   get:
 *     summary: Obtiene todos los juegos
 *     parameters:
 *       - in: query
 *         name: cursor
 *         schema:
 *           type: integer
 *         description: ID del último juego para paginación
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 100
 *         description: Cantidad de juegos por página
 *     responses:
 *       200:
 *         description: Lista de juegos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Game'
 *                 nextCursor:
 *                   type: integer
 *                 hasMore:
 *                   type: boolean
 *   post:
 *     summary: Crea un nuevo juego
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Game'
 *     responses:
 *       201:
 *         description: Juego creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Game'
 *       400:
 *         description: Error de validación
 *       500:
 *         description: Error del servidor
 */

/**
 * @swagger
 * /games/{id}:
 *   get:
 *     summary: Obtiene un juego por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del juego
 *     responses:
 *       200:
 *         description: Datos del juego
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Game'
 *       404:
 *         description: Juego no encontrado
 *   put:
 *     summary: Actualiza un juego completo
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Game'
 *     responses:
 *       200:
 *         description: Juego actualizado
 *       400:
 *         description: Error de validación
 *       404:
 *         description: Juego no encontrado
 *   patch:
 *     summary: Actualiza parcialmente un juego
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               isFavorite:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Juego actualizado
 *       404:
 *         description: Juego no encontrado
 *   delete:
 *     summary: Elimina un juego
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Juego eliminado exitosamente
 *       404:
 *         description: Juego no encontrado
 */

// Juego para crear ejemplo
// {
//   "Name": "The Last of Us",
//   "Rating": 5,
//   "Developer": "Naughty Dog",
//   "Price": 59.99,
//   "ReleaseDate": "2013-06-14T00:00:00.000Z",
//   "Image": "https://media.rawg.io/media/games/21a/21a6729ad0cb3b7b33c5cc22204fc0a9.jpg",
//   "Description": "En un mundo post-apocalíptico, Joel debe escoltar a Ellie a través de Estados Unidos.",
//   "genres": ["Action", "Adventure"],
//   "screenshots": ["https://media.rawg.io/media/screenshots/21a/21a6729ad0cb3b7b33c5cc22204fc0a9.jpg"]
// }
// Ejemplo PUT
// {
//   "Name": "The Last of Us Remastered",
//   "Rating": 5,
//   "Developer": "Naughty Dog",
//   "Price": 39.99,
//   "ReleaseDate": "2014-07-29T00:00:00.000Z",
//   "Image": "https://media.rawg.io/media/games/21a/21a6729ad0cb3b7b33c5cc22204fc0a9.jpg",
//   "Description": "Versión remasterizada del clásico de PlayStation 3, con gráficos mejorados y contenido adicional.",
//   "genres": ["Action", "Adventure"],
//   "screenshots": ["https://media.rawg.io/media/screenshots/21a/21a6729ad0cb3b7b33c5cc22204fc0a9.jpg"]
// }

const router = require("express").Router();

const gameController = require("../controllers/game.controller.js");

router.get("/", gameController.getGames);
router.get("/:id", gameController.getGameById);

router.post("/", gameController.createGame);

router.patch("/:id", gameController.updateGame);
router.put("/:id", gameController.updateGamePUT);

router.delete("/:id", gameController.deleteGame);

module.exports = router;
