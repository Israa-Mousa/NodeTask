"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadMultiple = exports.uploadSingle = exports.multerUpload = void 0;
var multer_1 = require("multer");
var path_1 = require("path");
var destDirectory = path_1.default.join(__dirname, '../../src/uploads');
console.log('destDirectory', destDirectory);
exports.multerUpload = (0, multer_1.default)({
    storage: multer_1.default.diskStorage({
        destination: function (_req, _file, cb) {
            cb(null, destDirectory);
        },
        filename: function (_req, file, cb) {
            var uniqueName = "".concat(Date.now(), "-").concat(Math.round(Math.random() * 1e9)).concat(path_1.default.extname(file.originalname));
            cb(null, uniqueName);
        }
    }),
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: function (req, file, cb) {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        }
        else {
            cb(new Error('The file type is not supported'));
        }
    }
});
var uploadSingle = function (fieldName) {
    return exports.multerUpload.single(fieldName);
};
exports.uploadSingle = uploadSingle;
var uploadMultiple = function (fieldName, maxCount) {
    return exports.multerUpload.array(fieldName, maxCount);
};
exports.uploadMultiple = uploadMultiple;
