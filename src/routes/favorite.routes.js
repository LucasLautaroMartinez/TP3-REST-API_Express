/**
 * @swagger
 * components:
 *   schemas:
 *     Favorite:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: ID del favorito
 *           example: 1
 *         userId:
 *           type: integer
 *           description: ID del usuario
 *           example: 10
 *         gameId:
 *           type: integer
 *           description: ID del juego
 *           example: 5
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Fecha de creación
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Fecha de actualización
 *
 *     FavoriteResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         userId:
 *           type: integer
 *           example: 10
 *         gameId:
 *           type: integer
 *           example: 5
 *         game:
 *           $ref: '#/components/schemas/Game'
 */

const router = require("express").Router();
const favoriteController = require("../controllers/favorite.controller.js");
const authenticateToken = require("../middlewares/auth.middleware.js");

/**
 * @swagger
 * /favorites:
 *   get:
 *     summary: Obtener todos los favoritos del usuario autenticado
 *     tags: [Favorites]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de favoritos del usuario
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Favorite'
 *       401:
 *         description: No autorizado (token inválido o faltante)
 *       500:
 *         description: Error del servidor
 */
router.get("/", authenticateToken, favoriteController.getFavorites);

/**
 * @swagger
 * /favorites/{id}:
 *   post:
 *     summary: Agregar un juego a favoritos
 *     tags: [Favorites]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del juego a agregar a favoritos
 *     responses:
 *       201:
 *         description: Juego agregado a favoritos exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Favorite'
 *       409:
 *         description: El juego ya está en favoritos
 *       401:
 *         description: No autorizado
 *       403:
 *         description: token invalido
 *       404:
 *         description: Juego no encontrado
 *       500:
 *         description: Error del servidor
 */
router.post("/:id", authenticateToken, favoriteController.addFavorite);

/**
 * @swagger
 * /favorites/{id}:
 *   delete:
 *     summary: Eliminar un juego de favoritos
 *     tags: [Favorites]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del juego a eliminar de favoritos
 *     responses:
 *       200:
 *         description: Juego eliminado de favoritos exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Favorite'
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Token invalido
 *       404:
 *         description: Favorito no encontrado
 *       500:
 *         description: Error del servidor
 */
router.delete("/:id", authenticateToken, favoriteController.deleteFavorite);

module.exports = router;
