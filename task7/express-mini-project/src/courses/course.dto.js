"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateCourseDTOSchema = exports.CreateCourseDTOSchema = void 0;
var zod_1 = require("zod");
exports.CreateCourseDTOSchema = zod_1.z.object({
    title: zod_1.z.string().min(2, 'Title must be at least 2 characters long'),
    description: zod_1.z.string().min(10, 'Description must be at least 10 characters long'),
    createdBy: zod_1.z.string().optional(),
    image: zod_1.z.string().optional(),
}).strict();
exports.UpdateCourseDTOSchema = zod_1.z.object({
    title: zod_1.z.string().min(2, 'Title must be at least 2 characters long').optional(),
    description: zod_1.z.string().min(10, 'Description must be at least 10 characters long').optional(),
    createdBy: zod_1.z.string().optional(),
    image: zod_1.z.string().optional(),
}).strict();
