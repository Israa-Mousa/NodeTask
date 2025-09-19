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
exports.AuthService = void 0;
var user_service_1 = require("../users/user.service");
var argon_utils_1 = require("../shared/utils/argon.utils");
var object_util_1 = require("../shared/utils/object.util");
var AuthService = /** @class */ (function () {
    function AuthService() {
        this._userService = user_service_1.userService;
        //   public async login(payload:LoginDTO):Promise<LoginResponseDTO | null>{
        //     // find the user by email
        //     const foundUser=this._userService.findByEmail(payload.email);
        //     //if user not found throw error
        //     if(!foundUser){
        // return null; 
        //    }
        //    //compare the password
        //     const isPasswordMatch= await verifyArgonHash(payload.password,foundUser.password);
        //     console.log(isPasswordMatch);
        //     console.log('Stored hash:', foundUser.password);
        // console.log('Password attempt:', payload.password);
        //     if(!isPasswordMatch){
        //       return null;
        //     }
        //     // return user data without password and include token
        //     const userWithoutPassword = removeFields(foundUser, ['password']);
        //     // TODO: Generate a JWT or session token here. For now, set token to an empty string or implement token generation.
        //     const token = ""; // Replace with actual token generation logic if available
        //     return {
        //       data: userWithoutPassword,
        //       token: token
        //     };
        //   }
    }
    AuthService.prototype.register = function (payload) {
        return __awaiter(this, void 0, void 0, function () {
            var userData;
            return __generator(this, function (_a) {
                userData = this._userService.createUser(payload.name, payload.email, payload.password);
                return [2 /*return*/, userData];
            });
        });
    };
    AuthService.prototype.login = function (payload) {
        return __awaiter(this, void 0, void 0, function () {
            var foundUser, isPasswordMatch, userWithoutPassword;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._userService.findByEmail(payload.email)];
                    case 1:
                        foundUser = _a.sent();
                        if (!foundUser) {
                            return [2 /*return*/, null];
                        }
                        return [4 /*yield*/, (0, argon_utils_1.verifyArgonHash)(payload.password, foundUser.password)];
                    case 2:
                        isPasswordMatch = _a.sent();
                        if (!isPasswordMatch) {
                            return [2 /*return*/, null];
                        }
                        userWithoutPassword = (0, object_util_1.removeFields)(foundUser, ['password']);
                        return [2 /*return*/, userWithoutPassword];
                }
            });
        });
    };
    return AuthService;
}());
exports.AuthService = AuthService;
