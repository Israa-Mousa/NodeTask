"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyArgonHash = exports.createArgonHash = void 0;
var argon2_1 = require("argon2");
var createArgonHash = function (textValue) {
    return argon2_1.default.hash(textValue);
};
exports.createArgonHash = createArgonHash;
var verifyArgonHash = function (textValue, hashedValue) {
    return argon2_1.default.verify(hashedValue, textValue);
};
exports.verifyArgonHash = verifyArgonHash;
