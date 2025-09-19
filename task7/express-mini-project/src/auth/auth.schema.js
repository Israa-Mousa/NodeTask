"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginDTOSchema = exports.registerDTOSchema = void 0;
var user_schema_1 = require("../users/user.schema");
exports.registerDTOSchema = user_schema_1.userSchema.pick({
    name: true,
    email: true,
    password: true,
    role: true
});
exports.loginDTOSchema = user_schema_1.userSchema.pick({
    email: true,
    password: true
});
