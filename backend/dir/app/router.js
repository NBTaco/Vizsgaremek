"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var controller_1 = require("./controller");
var auth_1 = require("../middleware/auth");
var router = (0, express_1.Router)();
router.get("/", controller_1.run);
router.post("/register", controller_1.registerUser);
router.post("/login", controller_1.loginUser);
// Protected endpoint
router.get("/me", auth_1.verifyToken, controller_1.getMe);
exports.default = router;
