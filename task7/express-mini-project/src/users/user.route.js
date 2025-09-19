"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
var express_1 = require("express");
var user_controller_1 = require("./user.controller");
var auth_middleware_1 = require("../shared/middlewares/auth.middleware");
// Assume we have auth middleware
console.log('UserController', user_controller_1.UserController);
var router = (0, express_1.Router)();
var userController = new user_controller_1.UserController();
///router.use(isAuthenticated);  
//extra route to get current user details
router.get('/', userController.getUsers);
router.post('/', userController.createUser);
router.delete('/:id', userController.deleteUser);
//task route neeeds to be authenticated
router.get('/me', auth_middleware_1.isAuthenticated, userController.getCurrentUser);
router.put('/me', auth_middleware_1.isAuthenticated, userController.updateUser);
router.post('/coach', auth_middleware_1.isAuthenticated, userController.createCoachUser);
exports.userRouter = router;
