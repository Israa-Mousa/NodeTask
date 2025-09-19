"use strict";
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
exports.userController = exports.UserController = void 0;
var user_service_1 = require("./user.service");
var exception_1 = require("../shared/utils/exception");
var user_dto_1 = require("./user.dto");
var UserController = /** @class */ (function () {
    function UserController() {
        var _this = this;
        this._userService = user_service_1.userService;
        this.getUsers = function (req, res) {
            try {
                var page = Number(req.query.page) || 1;
                var limit = Number(req.query.limit) || 10;
                var users = _this._userService.getUsers(page, limit);
                res.ok(users);
            }
            catch (error) {
                (0, exception_1.handleError)(error, res);
            }
        };
        this.getUser = function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var id, user, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        id = req.params.id;
                        if (!id)
                            return [2 /*return*/, res.status(400).json({ error: 'ID required' })];
                        return [4 /*yield*/, this._userService.getUser(id)];
                    case 1:
                        user = _a.sent();
                        if (!user) {
                            throw new exception_1.CustomError('User not found', 'USER', 404);
                        }
                        res.ok(user);
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _a.sent();
                        (0, exception_1.handleError)(error_1, res);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); };
        //create studnet user
        this.createUser = function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var parsed, _a, name_1, email, password, role, user, error_2;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        parsed = user_dto_1.RegisterDTOSchema.safeParse(req.body);
                        //const parsed = zodValidation(RegisterDTOSchema, req.body, 'AUTH');
                        if (!parsed.success) {
                            return [2 /*return*/, res.status(400).json({
                                    error: 'Invalid input',
                                    details: parsed.error
                                })];
                        }
                        _a = parsed.data, name_1 = _a.name, email = _a.email, password = _a.password, role = _a.role;
                        return [4 /*yield*/, this._userService.createUser(name_1, email, password)];
                    case 1:
                        user = _b.sent();
                        res.create(user);
                        return [3 /*break*/, 3];
                    case 2:
                        error_2 = _b.sent();
                        (0, exception_1.handleError)(error_2, res);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); };
        this.deleteUser = function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var id, deleted, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        id = req.params.id;
                        if (!id)
                            return [2 /*return*/, res.status(400).json({ error: 'ID required' })];
                        return [4 /*yield*/, this._userService.deleteUser(id)];
                    case 1:
                        deleted = _a.sent();
                        if (!deleted) {
                            throw new exception_1.CustomError('User not found', 'USER', 404);
                        }
                        res.ok({});
                        return [3 /*break*/, 3];
                    case 2:
                        error_3 = _a.sent();
                        (0, exception_1.handleError)(error_3, res);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); };
        this.getCurrentUser = function (req, res) {
            try {
                var user = req.user;
                if (!user) {
                    throw new exception_1.CustomError('User does not exist', 'USER', 404);
                }
                res.ok(user);
            }
            catch (error) {
                (0, exception_1.handleError)(error, res);
            }
        };
        // Update user profile
        this.updateUser = function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var parsed, userId, _a, name_2, email, updatedUser, error_4;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        if (!req.user) {
                            throw new exception_1.CustomError('Unauthenticated', 'USER', 401);
                        }
                        parsed = user_dto_1.UpdateUserDTOSchema.safeParse(req.body);
                        //  const parsed = zodValidation(UpdateUserDTOSchema, req.body, 'USER');
                        console.log(parsed);
                        if (!parsed.success) {
                            return [2 /*return*/, res.status(400).json({
                                    error: 'Invalid input',
                                    details: parsed.error
                                })];
                        }
                        userId = req.user.id;
                        _a = parsed.data, name_2 = _a.name, email = _a.email;
                        return [4 /*yield*/, this._userService.updateUser(userId, { name: name_2, email: email })];
                    case 1:
                        updatedUser = _b.sent();
                        if (!updatedUser) {
                            throw new exception_1.CustomError('User not found', 'USER', 404);
                        }
                        res.create(updatedUser);
                        return [3 /*break*/, 3];
                    case 2:
                        error_4 = _b.sent();
                        (0, exception_1.handleError)(error_4, res);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); };
        // create COACH
        this.createCoachUser = function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var _a, name_3, email, password, newCoach, error_5;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        if (!req.user) {
                            throw new exception_1.CustomError('Unauthenticated', 'USER', 401);
                        }
                        if (req.user.role !== 'ADMIN') {
                            throw new exception_1.CustomError('Unauthorized', 'USER', 403);
                        }
                        _a = req.body, name_3 = _a.name, email = _a.email, password = _a.password;
                        return [4 /*yield*/, this._userService.createUser(name_3, email, password, 'COACH')];
                    case 1:
                        newCoach = _b.sent();
                        res.create(newCoach);
                        return [3 /*break*/, 3];
                    case 2:
                        error_5 = _b.sent();
                        (0, exception_1.handleError)(error_5, res);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); };
    }
    return UserController;
}());
exports.UserController = UserController;
exports.userController = new UserController();
