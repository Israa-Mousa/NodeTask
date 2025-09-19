"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyJwt = exports.signJwt = void 0;
var jsonwebtoken_1 = require("jsonwebtoken");
var dotenv_1 = require("dotenv");
dotenv_1.default.config(); // Load environment variables from .env
var JWT_SECRET = process.env.JWT_SECRET; // Retrieve the secret from environment variables
if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not set in the environment');
}
var signJwt = function (payload, options) {
    return jsonwebtoken_1.default.sign(payload, JWT_SECRET, { expiresIn: '30d' });
};
exports.signJwt = signJwt;
var verifyJwt = function (token) {
    return jsonwebtoken_1.default.verify(token, JWT_SECRET);
};
exports.verifyJwt = verifyJwt;
