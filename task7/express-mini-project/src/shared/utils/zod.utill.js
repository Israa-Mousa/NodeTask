"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.zodValidation = void 0;
var zod_1 = require("zod");
var exception_1 = require("./exception");
var util_types_1 = require("./util.types");
var zodValidation = function (schema, payload, moduleName) {
    //validate
    // return the validated data
    // catch error
    // custom error c
    try {
        var safeData = schema.parse(payload);
        return safeData;
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            throw new exception_1.CustomError(error.message, moduleName, util_types_1.HttpErrorStatus.BadRequest);
        }
        if (error instanceof Error) {
            throw new exception_1.CustomError(error.message, moduleName, util_types_1.HttpErrorStatus.BadRequest);
        }
        throw error;
    }
};
exports.zodValidation = zodValidation;
