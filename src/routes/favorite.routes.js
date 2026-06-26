const router = require("express").Router();
const favoriteController = require("../controllers/favorite.controller.js");
const authenticateToken = require("../middlewares/auth.middleware.js");

router.get("/", authenticateToken, favoriteController.getFavorites);
router.post("/:id", authenticateToken, favoriteController.addFavorite);

module.exports = router;
