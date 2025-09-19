"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEnvOrThrow = void 0;
var getEnvOrThrow = function (envName) {
    var varValue = process.env[envName];
    if (!varValue)
        throw new Error("".concat(envName, " is not set in the env"));
    return varValue;
};
exports.getEnvOrThrow = getEnvOrThrow;
