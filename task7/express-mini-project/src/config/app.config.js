"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isProduction = void 0;
var utils_1 = require("../shared/utils/utils");
exports.isProduction = (0, utils_1.getEnvOrThrow)('NODE_ENV') === 'production';
