const router = require("express").Router();
const favoriteController = require("../controllers/favorite.controller.js");

router.get(
	"/",
	//! authenticate,
	favoriteController.getFavorites,
);

module.exports = router;
