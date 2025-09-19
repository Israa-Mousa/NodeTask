"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleError = exports.CustomError = void 0;
var CustomError = /** @class */ (function (_super) {
    __extends(CustomError, _super);
    function CustomError(msg, moduleName, statusCode) {
        var _this = _super.call(this, msg) || this;
        _this.moduleName = moduleName;
        _this.statusCode = statusCode;
        _this.errorType = 'custom';
        return _this;
    }
    return CustomError;
}(Error));
exports.CustomError = CustomError;
var handleError = function (error, res) {
    if (error instanceof CustomError) {
        console.log('customError', error);
        res.status(error.statusCode).send(error.message);
        return;
    }
    //   we should alert ourself
    console.error('unexpected error', error);
    res.status(500).send('internal server');
};
exports.handleError = handleError;
