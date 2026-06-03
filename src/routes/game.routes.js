const router = require("express").Router();

const gameController = require("../controllers/game.controller.js");

router.patch("/:id", gameController.updateGame);

module.exports = router;
