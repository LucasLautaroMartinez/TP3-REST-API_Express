const router = require("express").Router();

const gameController = require("../controllers/game.controller.js");

router.get("/", gameController.getGames);
router.get("/:id", gameController.getGameById);
router.patch("/:id", gameController.updateGame);

module.exports = router;
