const router = require("express").Router();

const gameController = require("../controllers/game.controller.js");

router.get("/", gameController.getGames);
router.get("/:id", gameController.getGameById);

router.post("/", gameController.createGame);

router.patch("/:id", gameController.updateGame);
router.put("/:id", gameController.updateGamePUT);

router.delete("/:id", gameController.deleteGame);

module.exports = router;
