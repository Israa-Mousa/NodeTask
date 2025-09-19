"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginDTOSchema = exports.UpdateUserDTOSchema = exports.RegisterDTOSchema = void 0;
var role_enum_1 = require("./role.enum");
var zod_1 = require("zod");
// Zod schema for Register DTO
exports.RegisterDTOSchema = zod_1.z.object({
    name: zod_1.z.string().min(3),
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6),
    role: zod_1.z.nativeEnum(role_enum_1.Role).default(role_enum_1.Role.STUDENT),
});
exports.UpdateUserDTOSchema = zod_1.z.object({
    name: zod_1.z.string().min(3).optional(),
    email: zod_1.z.string().email().optional(),
    ///password: z.string().min(6),
});
// Zod schema for Login DTO
exports.LoginDTOSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6),
});
