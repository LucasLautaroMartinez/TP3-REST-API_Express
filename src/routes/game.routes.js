/**
 * @swagger
 * components:
 *   schemas:
 *     DeleteResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: ID autoincremental del juego
 *           example: 54
 *         Name:
 *           type: string
 *           description: Nombre del juego
 *           example: "Spider-Man: Friend or Foe"
 *         Rating:
 *           type: integer
 *           description: Puntuación del juego (1-5)
 *           minimum: 1
 *           maximum: 5
 *           example: 3
 *         Developer:
 *           type: string
 *           description: Desarrolladora del juego
 *           example: "Beenox Studios"
 *         Price:
 *           type: number
 *           description: Precio del juego en USD
 *           example: 15.16
 *         ReleaseDate:
 *           type: string
 *           format: date
 *           description: Fecha de lanzamiento
 *           example: "2007-10-02"
 *         Image:
 *           type: string
 *           format: uri
 *           description: URL de la imagen principal
 *           example: "https://media.rawg.io/media/games/e94/e94b92b8fb1795abf3ea54882a75c02c.jpg"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Fecha de creación
 *           example: "2026-06-24T16:25:18.425Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Fecha de última actualización
 *           example: "2026-06-24T16:25:18.425Z"
 *
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
 *
 *     GameResponse:
 *       allOf:
 *         - $ref: '#/components/schemas/Game'
 *         - type: object
 *           properties:
 *             language:
 *               type: string
 *               enum: [es, en, mor]
 *               example: es
 *
 *     GameRequestBody:
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
 *         translations:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               language:
 *                 type: string
 *                 enum: [es, en, mor]
 *                 example: es
 *               description:
 *                 type: string
 */

/**
 * @swagger
 * /games:
 *   get:
 *     tags: [Games]
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
 *       - in: query
 *         name: lang
 *         schema:
 *           type: string
 *           enum: [es, en, mor]
 *           default: es
 *         description: Idioma de la respuesta
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
 *                     $ref: '#/components/schemas/GameResponse'
 *                 nextCursor:
 *                   type: integer
 *                 hasMore:
 *                   type: boolean
 *
 *   post:
 *     tags: [Games]
 *     summary: Crea un nuevo juego
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GameRequestBody'
 *     responses:
 *       201:
 *         description: Juego creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GameResponse'
 *       400:
 *         description: Error de validación
 *       500:
 *         description: Error del servidor
 *
 * /games/{id}:
 *   get:
 *     tags: [Games]
 *     summary: Obtiene un juego por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del juego
 *       - in: query
 *         name: lang
 *         schema:
 *           type: string
 *           enum: [es, en, mor]
 *           default: es
 *         description: Idioma de la respuesta
 *     responses:
 *       200:
 *         description: Datos del juego
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GameResponse'
 *       404:
 *         description: Juego no encontrado
 *
 *   put:
 *     tags: [Games]
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
 *             $ref: '#/components/schemas/GameRequestBody'
 *     responses:
 *       200:
 *         description: Devuelve el juego actualizado con los datos ingresados
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GameResponse'
 *       400:
 *         description: Error de validación
 *       404:
 *         description: Juego no encontrado
 *
 *   patch:
 *     tags: [Games]
 *     summary: Actualiza solo los campos enviados de un juego
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
 *               Name:
 *                 type: string
 *               Rating:
 *                 type: integer
 *               Developer:
 *                 type: string
 *               Price:
 *                 type: number
 *               ReleaseDate:
 *                 type: string
 *                 format: date
 *               Image:
 *                 type: string
 *               isFavorite:
 *                 type: boolean
 *               genres:
 *                 type: array
 *                 items:
 *                   type: string
 *               screenshots:
 *                 type: array
 *                 items:
 *                   type: string
 *               translations:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     language:
 *                       type: string
 *                       enum: [es, en, mor]
 *                     description:
 *                       type: string
 *     responses:
 *       200:
 *         description: Devuelve el juego actualizado con los datos ingresados
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GameResponse'
 *       404:
 *         description: Juego no encontrado
 *
 *   delete:
 *     tags: [Games]
 *     summary: Elimina un juego
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Devuelve el juego eliminado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DeleteResponse'
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

//! RESPUESTA POST
// {
//     "id": 55,
//     "Name": "God of War",
//     "Rating": 5,
//     "Developer": "Santa Monica Studio",
//     "Price": 49.99,
//     "ReleaseDate": "2018-04-20",
//     "Image": "https://media.rawg.io/media/games/4be/4be6a6ad0364751a96229c56bf69be59.jpg",
//     "createdAt": "2026-06-27T01:02:47.437Z",
//     "updatedAt": "2026-06-27T01:02:47.437Z",
//     "genres": [
//         {
//             "id": 1,
//             "name": "Action"
//         }
//     ],
//     "screenshots": [
//         {
//             "id": 270,
//             "imageUrl": "https://media.rawg.io/media/screenshots/4be/4be6a6ad0364751a96229c56bf69be59.jpg",
//             "gameId": 55
//         }
//     ],
//     "description": "Kratos y su hijo Atreus viajan por los reinos nórdicos.",
//     "language": "es"
// }
