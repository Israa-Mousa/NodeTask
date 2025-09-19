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
exports.userRepository = exports.UserRepository = void 0;
var argon_utils_1 = require("../shared/utils/argon.utils");
var user_data_1 = require("./user.data");
var UserRepository = /** @class */ (function () {
    function UserRepository(userDb) {
        if (userDb === void 0) { userDb = user_data_1.userData; }
        var _this = this;
        this.users = [];
        this.idCounter = 1;
        // Wait for the promise to resolve
        userDb.then(function (users) {
            _this.users = users;
            _this.idCounter = users.length + 1;
        }).catch(function (err) {
            console.error('Failed to load initial users:', err);
        });
    }
    // constructor(userDb:Promise<User[]>=userData) {
    //  this.users  =userDb;
    // }
    // async init() {
    //   this.users = [
    //     {
    //       id: '1',
    //       name: 'Admin',
    //       email: 'admin@no.com',
    //       password: await createArgonHash('12345678'),
    //       role: Role.ADMIN,
    //       createdAt: new Date('2025-01-01T10:00:00Z'),
    //       updatedAt: new Date('2025-01-01T10:00:00Z'),
    //     },
    //     {
    //       id: '2',
    //       name: 'Belal',
    //       email: 'belal@example.com',
    //       password: await createArgonHash('12345678'),
    //       role: Role.COACH,
    //       createdAt: new Date('2025-03-01T14:30:00Z'),
    //       updatedAt: new Date('2025-03-01T14:30:00Z'),
    //     },
    //     {
    //       id: '3',
    //       name: 'israa',
    //       email: 'isra@gmail.com',
    //       password: await createArgonHash('12345678'),
    //       role: Role.STUDENT,
    //       createdAt: new Date('2025-02-01T12:00:00Z'),
    //       updatedAt: new Date('2025-02-01T12:00:00Z'),
    //     },
    //   ];
    //   this.idCounter = this.users.length + 1;
    // }
    UserRepository.prototype.findAll = function () {
        return this.users;
    };
    UserRepository.prototype.findById = function (id) {
        return this.users.find(function (user) { return user.id === id; });
    };
    UserRepository.prototype.findByEmail = function (email) {
        return this.users.find(function (user) { return user.email === email; });
    };
    UserRepository.prototype.create = function (name, email, originalPassword, role) {
        return __awaiter(this, void 0, void 0, function () {
            var password, user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, argon_utils_1.createArgonHash)(originalPassword)];
                    case 1:
                        password = _a.sent();
                        user = {
                            id: this.idCounter.toString(),
                            name: name,
                            email: email,
                            password: password,
                            role: role,
                            createdAt: new Date(),
                            updatedAt: new Date(),
                        };
                        this.idCounter++;
                        this.users.push(user);
                        console.log('Created user:', user);
                        return [2 /*return*/, user];
                }
            });
        });
    };
    UserRepository.prototype.update = function (id, name, email, role) {
        var user = this.findById(id);
        if (!user)
            return null;
        if (name)
            user.name = name;
        if (email)
            user.email = email;
        if (role)
            user.role = role;
        user.updatedAt = new Date();
        return user;
    };
    UserRepository.prototype.delete = function (id) {
        var index = this.users.findIndex(function (user) { return user.id === id; });
        if (index === -1)
            return false;
        this.users.splice(index, 1);
        return true;
    };
    return UserRepository;
}());
exports.UserRepository = UserRepository;
exports.userRepository = new UserRepository();
