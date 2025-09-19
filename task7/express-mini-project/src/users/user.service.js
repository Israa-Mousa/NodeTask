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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userService = void 0;
var role_enum_1 = require("./role.enum");
var user_repsitory_1 = require("./user.repsitory");
var exception_1 = require("../shared/utils/exception");
var UserService = /** @class */ (function () {
    function UserService() {
    }
    UserService.prototype.getUsers = function (page, limit) {
        return user_repsitory_1.userRepository.findAll().slice((page - 1) * limit, page * limit);
    };
    UserService.prototype.getUser = function (id) {
        return user_repsitory_1.userRepository.findById(id);
    };
    UserService.prototype.findByEmail = function (email) {
        return user_repsitory_1.userRepository.findByEmail(email);
    };
    UserService.prototype.updateUser = function (id, updateData) {
        return __awaiter(this, void 0, void 0, function () {
            var user, updatedUser;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = user_repsitory_1.userRepository.findById(id);
                        if (!user) {
                            throw new exception_1.CustomError('User not found', 'USER', 404);
                        }
                        return [4 /*yield*/, user_repsitory_1.userRepository.update(id, updateData.email || user.email, updateData.name || user.name)];
                    case 1:
                        updatedUser = _a.sent();
                        if (!updatedUser) {
                            throw new exception_1.CustomError('Failed to update user', 'USER', 500);
                        }
                        return [2 /*return*/, updatedUser];
                }
            });
        });
    };
    UserService.prototype.createUser = function (name_1, email_1, password_1) {
        return __awaiter(this, arguments, void 0, function (name, email, password, role) {
            var userRole, newUser, savedUser, _, userWithoutPassword;
            if (role === void 0) { role = "STUDENT"; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        userRole = role_enum_1.Role[role] || role_enum_1.Role.STUDENT;
                        newUser = {
                            id: (user_repsitory_1.userRepository.findAll().length + 1).toString(),
                            name: name,
                            email: email,
                            password: password,
                            role: userRole,
                            createdAt: new Date(),
                            updatedAt: new Date(),
                        };
                        return [4 /*yield*/, user_repsitory_1.userRepository.create(name, email, password, userRole)];
                    case 1:
                        savedUser = _a.sent();
                        _ = savedUser.password, userWithoutPassword = __rest(savedUser, ["password"]);
                        console.log('Created user without password:', userWithoutPassword);
                        return [2 /*return*/, userWithoutPassword];
                }
            });
        });
    };
    // async createUser(name: string, email: string, password: string, role: string = "STUDENT"): Promise<User> {
    //   const userRole = Role[role as keyof typeof Role] || Role.STUDENT;
    //   const newUser: User = {
    //     id: (userRepository.findAll().length + 1).toString(),
    //     name,
    //     email,
    //     password,
    //     role: userRole,
    //     createdAt: new Date(),
    //     updatedAt: new Date(),
    //   };
    //    console.log('Creating user with data:', newUser);
    //   return  userRepository.create( name,email,password,userRole);
    // }
    UserService.prototype.deleteUser = function (id) {
        return user_repsitory_1.userRepository.delete(id);
    };
    UserService.prototype.isUserIdExist = function (id) {
        console.log('Checking if user exists with ID:', id);
        return !!user_repsitory_1.userRepository.findById(id);
    };
    UserService.prototype.findById = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, user_repsitory_1.userRepository.findById(id)];
            });
        });
    };
    return UserService;
}());
exports.userService = new UserService();
