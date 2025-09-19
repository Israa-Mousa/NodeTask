"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkRole = void 0;
var exception_1 = require("../utils/exception");
var checkRole = function (allowedRoles) {
    return function (req, res, next) {
        var user = req.user;
        if (!user) {
            return next(new exception_1.CustomError('User not authenticated', 'AUTH', 401));
        }
        if (!allowedRoles.includes(user.role)) {
            return next(new exception_1.CustomError('Forbidden', 'AUTH', 403));
        }
        next();
    };
};
exports.checkRole = checkRole;
