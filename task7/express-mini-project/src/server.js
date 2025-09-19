"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
var dotenv_1 = require("dotenv");
dotenv_1.default.config();
var express_1 = require("express");
var utils_1 = require("./shared/utils/utils");
var exception_1 = require("./shared/utils/exception");
var user_route_1 = require("./users/user.route");
var auth_routes_1 = require("./auth/auth.routes");
var response_middleware_1 = require("./shared/middlewares/response.middleware");
var course_routes_1 = require("./courses/course.routes");
var node_path_1 = require("node:path");
//userRepository.init()
exports.app = (0, express_1.default)();
var PORT = (0, utils_1.getEnvOrThrow)('PORT');
var ApiRoute = '/api/v1/';
// Apply the responseEnhancer middleware here
exports.app.use(response_middleware_1.responseEnhancer);
exports.app.use(express_1.default.json());
exports.app.get("/", function (_req, res) {
    res.json({ ok: true, message: "Express + TS server is running 🎉" });
});
exports.app.use(function (req, res, next) {
    console.log(req.path, 'is hit');
    next();
});
console.log('process.env.xxxxx', process.env.PORT);
exports.app.use(express_1.default.static(node_path_1.default.join(__dirname, 'public'), {
    setHeaders: function (res, path) {
        res.setHeader('cache-control', "public max-age=".concat(5));
    }
}));
//app.use('/uploads', express.static(path.join(__dirname, '../../uploads')));
// Now apply userRouter routes
exports.app.use(ApiRoute + 'auth', auth_routes_1.authRouter);
exports.app.use(ApiRoute + 'users', user_route_1.userRouter);
exports.app.use(ApiRoute + 'courses', course_routes_1.courseRouter);
// Error handler middleware should be at the end
exports.app.use(function (error, req, res, next) {
    (0, exception_1.handleError)(error, res);
});
if (process.env.NODE_ENV !== 'test') {
    exports.app.listen(PORT, function () {
        console.log("\u2705 Server running on http://localhost:".concat(PORT));
    });
}
