"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.courseController = exports.CourseController = void 0;
var exception_1 = require("../shared/utils/exception");
var course_service_1 = require("./course.service");
var course_dto_1 = require("./course.dto");
var zod_utill_1 = require("../shared/utils/zod.utill");
var user_service_1 = require("../users/user.service");
var CourseController = /** @class */ (function () {
    function CourseController() {
        var _this = this;
        this._courseService = course_service_1.courseService;
        this.getCourses = function (req, res, next) {
            try {
                var page = Number(req.query.page) || 1;
                var limit = Number(req.query.limit) || 10;
                var courses = _this._courseService.getCourses(page, limit);
                res.ok(courses);
            }
            catch (error) {
                (0, exception_1.handleError)(error, res);
            }
        };
        this.getCourse = function (req, res, next) {
            try {
                var course = _this._courseService.getCourse(req.params.id);
                if (!course) {
                    throw new exception_1.CustomError('Course not found', 'COURSE', 404);
                }
                res.ok(course);
            }
            catch (error) {
                (0, exception_1.handleError)(error, res);
            }
        };
        this.createCourse = function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
            var parsed, _a, title, description, image, createdBy, newCourse, creator, response, error_1;
            var _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 3, , 4]);
                        console.log('Request body:', req.body);
                        console.log('Request file:', req.file);
                        parsed = course_dto_1.CreateCourseDTOSchema.safeParse(req.body);
                        console.log('Parsed create data:', parsed);
                        if (!parsed.success) {
                            return [2 /*return*/, res.status(400).json({ errors: parsed.error.format() })];
                        }
                        _a = parsed.data, title = _a.title, description = _a.description;
                        image = req.file ? req.file.filename : '';
                        console.log('Image for new course:', image);
                        createdBy = ((_b = req.user) === null || _b === void 0 ? void 0 : _b.id) || '';
                        console.log('User creating course:', createdBy);
                        return [4 /*yield*/, this._courseService.createCourse(title, description, createdBy, image)];
                    case 1:
                        newCourse = _c.sent();
                        return [4 /*yield*/, user_service_1.userService.findById(createdBy)];
                    case 2:
                        creator = _c.sent();
                        response = __assign(__assign({}, newCourse), { createdBy: (creator === null || creator === void 0 ? void 0 : creator.name) || 'Unknown' });
                        res.create(response);
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _c.sent();
                        (0, exception_1.handleError)(error_1, res);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        }); };
        this.updateCourse = function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
            var parsed, title, description, courseId, existingCourse, user, image, updatedCourse, creator, response, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        parsed = (0, zod_utill_1.zodValidation)(course_dto_1.UpdateCourseDTOSchema, req.body, 'COURSE');
                        console.log('Parsed update data:', parsed);
                        title = parsed.title, description = parsed.description;
                        courseId = req.params.id;
                        if (!courseId) {
                            return [2 /*return*/, res.status(400).json({ error: 'Course ID is required' })];
                        }
                        return [4 /*yield*/, course_service_1.courseService.findById(courseId)];
                    case 1:
                        existingCourse = _a.sent();
                        if (!existingCourse) {
                            throw new exception_1.CustomError('Course not found', 'COURSE', 404);
                        }
                        user = req.user;
                        if (!user) {
                            throw new exception_1.CustomError('Unauthorized', 'AUTH', 401);
                        }
                        if (user.role === 'COACH' && existingCourse.createdBy !== user.id) {
                            throw new exception_1.CustomError('Forbidden: You can only edit your own courses', 'COURSE', 403);
                        }
                        image = req.file ? req.file.filename : existingCourse.image;
                        console.log('Image for update:', image);
                        return [4 /*yield*/, course_service_1.courseService.updateCourse(courseId, {
                                title: title,
                                description: description,
                                createdBy: existingCourse.createdBy,
                                image: image,
                            })];
                    case 2:
                        updatedCourse = _a.sent();
                        if (!updatedCourse) {
                            throw new exception_1.CustomError('Course not found after update', 'COURSE', 404);
                        }
                        return [4 /*yield*/, user_service_1.userService.findById(updatedCourse.createdBy)];
                    case 3:
                        creator = _a.sent();
                        response = __assign(__assign({}, updatedCourse), { createdBy: (creator === null || creator === void 0 ? void 0 : creator.name) || 'Unknown' });
                        res.create(response);
                        return [3 /*break*/, 5];
                    case 4:
                        error_2 = _a.sent();
                        (0, exception_1.handleError)(error_2, res);
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        }); };
        this.deleteCourse = function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
            var id, existingCourse, user, deleted, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        id = req.params.id;
                        if (!id) {
                            return [2 /*return*/, res.status(400).json({ error: 'ID required' })];
                        }
                        return [4 /*yield*/, this._courseService.findById(id)];
                    case 1:
                        existingCourse = _a.sent();
                        if (!existingCourse) {
                            throw new exception_1.CustomError('Course not found', 'COURSE', 404);
                        }
                        user = req.user;
                        if (!user) {
                            throw new exception_1.CustomError('Unauthorized', 'AUTH', 401);
                        }
                        if (user.role === 'COACH' && existingCourse.createdBy !== user.id) {
                            throw new exception_1.CustomError('Forbidden: You can only delete your own courses', 'COURSE', 403);
                        }
                        return [4 /*yield*/, this._courseService.deleteCourse(id)];
                    case 2:
                        deleted = _a.sent();
                        if (!deleted) {
                            throw new exception_1.CustomError('Course not found', 'COURSE', 404);
                        }
                        res.ok({ message: 'Course deleted successfully' });
                        return [3 /*break*/, 4];
                    case 3:
                        error_3 = _a.sent();
                        (0, exception_1.handleError)(error_3, res);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        }); };
    }
    return CourseController;
}());
exports.CourseController = CourseController;
exports.courseController = new CourseController();
