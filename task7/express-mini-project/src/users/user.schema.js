"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userSchema = void 0;
var zod_1 = require("zod");
var role_enum_1 = require("./role.enum");
exports.userSchema = zod_1.default.object({
    id: zod_1.default.string(),
    name: zod_1.default.string(),
    email: zod_1.default.string(),
    createdAt: zod_1.default.date(),
    updatedAt: zod_1.default.date(),
    password: zod_1.default.string().min(8), // hash value
    role: zod_1.default.nativeEnum(role_enum_1.Role)
});
