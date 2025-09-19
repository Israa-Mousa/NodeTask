"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
var express_1 = require("express");
var auth_controller_1 = require("./auth.controller");
var router = (0, express_1.Router)();
// Post /api/auth -create user 
router.post('/register', auth_controller_1.authController.register.bind(auth_controller_1.authController));
router.post('/login', auth_controller_1.authController.login.bind(auth_controller_1.authController));
router.post('/logout', auth_controller_1.authController.logout);
exports.authRouter = router;
