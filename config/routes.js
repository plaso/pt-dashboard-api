const express = require("express");
const authController = require("../controllers/auth.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const router = express.Router();

router.get("/sign-in", authController.login);
router.post("/auth/cb", authController.loginCb);

router.get("/users/me", authMiddleware.isAuthenticated, authController.getMe);

module.exports = router;
