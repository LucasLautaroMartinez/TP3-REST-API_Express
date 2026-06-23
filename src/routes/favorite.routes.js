const router = require("express").Router();
const favoriteController = require("../controllers/favorite.controller.js");

router.get(
	"/favorites",
	//! authenticate,
	favoriteController.getFavorites,
);
