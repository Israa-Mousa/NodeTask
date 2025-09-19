"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.responseEnhancer = void 0;
var responseEnhancer = function (req, res, next) {
    res.ok = function (data) {
        return res.status(200).json(formatUnifiedResponse({ success: true, data: data }));
    };
    res.create = function (data) {
        return res.status(201).json(formatUnifiedResponse({ success: true, data: data }));
    };
    res.error = function (err) {
        return res
            .status(err.statusCode)
            .json(formatUnifiedResponse({ success: false, error: err }));
    };
    next();
};
exports.responseEnhancer = responseEnhancer;
var formatUnifiedResponse = function (res) { return res; };
