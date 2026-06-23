const router = require("express").Router();
const userController = require("../controllers/user.controller.js");
const authenticateToken = require("../middlewares/auth.middleware.js");

router.post("/register", userController.register);
router.post("/login", userController.login);
router.post("/logout", userController.logout);
router.get("/me", authenticateToken, userController.getMe);
router.get("/profile", authenticateToken, (req, res) => {
  res.json({ 
    message: "Datos del usuario", 
    user: req.user 
  });
});

module.exports = router;