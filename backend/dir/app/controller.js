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
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = exports.registerUser = exports.run = void 0;
var bcrypt_1 = __importDefault(require("bcrypt"));
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var promise_1 = __importDefault(require("mysql2/promise"));
var config_1 = __importDefault(require("../config/config"));
var SALT_ROUNDS = 10;
var run = function (_req, res) {
    res.send("Server is running");
};
exports.run = run;
var registerUser = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var connection, _a, email, password, username, _b, existingUser, hashedPassword, _c, result, _d, users, user, token, error_1;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                _e.trys.push([0, 7, , 8]);
                return [4 /*yield*/, promise_1.default.createConnection(config_1.default.database)];
            case 1:
                connection = _e.sent();
                _a = req.body, email = _a.email, password = _a.password, username = _a.username;
                if (!email || !password) {
                    res.status(400).json({
                        success: false,
                        message: "Email and password are required",
                    });
                    return [2 /*return*/];
                }
                if (password.length < 6) {
                    res.status(400).json({
                        success: false,
                        message: "Password must be at least 6 characters long",
                    });
                    return [2 /*return*/];
                }
                return [4 /*yield*/, connection.query("SELECT email FROM users WHERE email = ?", [email])];
            case 2:
                _b = __read.apply(void 0, [_e.sent(), 1]), existingUser = _b[0];
                if (Array.isArray(existingUser) && existingUser.length > 0) {
                    res.status(409).json({
                        success: false,
                        message: "Email already registered",
                    });
                    return [2 /*return*/];
                }
                return [4 /*yield*/, bcrypt_1.default.hash(password, SALT_ROUNDS)];
            case 3:
                hashedPassword = _e.sent();
                return [4 /*yield*/, connection.query("INSERT INTO users (email, password_hash, username) VALUES (?, ?, ?)", [email, hashedPassword, username || email.split("@")[0]])];
            case 4:
                _c = __read.apply(void 0, [_e.sent(), 1]), result = _c[0];
                return [4 /*yield*/, connection.query("SELECT user_id, email, username FROM users WHERE email = ?", [email])];
            case 5:
                _d = __read.apply(void 0, [_e.sent(), 1]), users = _d[0];
                user = Array.isArray(users) && users.length > 0 ? users[0] : null;
                token = jsonwebtoken_1.default.sign({ id: result.insertId, email: email }, config_1.default.jwtSecret || "your-secret-key", { expiresIn: "24h" });
                res.status(201).json({
                    success: true,
                    message: "User registered successfully",
                    token: token,
                    user: user,
                });
                return [4 /*yield*/, connection.end()];
            case 6:
                _e.sent();
                return [3 /*break*/, 8];
            case 7:
                error_1 = _e.sent();
                console.error("Registration error:", error_1);
                res.status(500).json({
                    success: false,
                    message: "Internal server error",
                    error: error_1.message,
                });
                return [3 /*break*/, 8];
            case 8: return [2 /*return*/];
        }
    });
}); };
exports.registerUser = registerUser;
var loginUser = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var connection, _a, email, password, _b, users, user, isPasswordValid, token, _, userWithoutPassword, error_2;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 11, , 12]);
                return [4 /*yield*/, promise_1.default.createConnection(config_1.default.database)];
            case 1:
                connection = _c.sent();
                _a = req.body, email = _a.email, password = _a.password;
                if (!(!email || !password)) return [3 /*break*/, 3];
                res.status(400).json({
                    success: false,
                    message: "Email and password are required",
                });
                return [4 /*yield*/, connection.end()];
            case 2:
                _c.sent();
                return [2 /*return*/];
            case 3: return [4 /*yield*/, connection.query("SELECT user_id, email, password_hash, username FROM users WHERE email = ?", [
                    email,
                ])];
            case 4:
                _b = __read.apply(void 0, [_c.sent(), 1]), users = _b[0];
                if (!(!Array.isArray(users) || users.length === 0)) return [3 /*break*/, 6];
                res.status(401).json({
                    success: false,
                    message: "Invalid email or password",
                });
                return [4 /*yield*/, connection.end()];
            case 5:
                _c.sent();
                return [2 /*return*/];
            case 6:
                user = users[0];
                return [4 /*yield*/, bcrypt_1.default.compare(password, user.password_hash)];
            case 7:
                isPasswordValid = _c.sent();
                if (!!isPasswordValid) return [3 /*break*/, 9];
                res.status(401).json({
                    success: false,
                    message: "Invalid email or password",
                });
                return [4 /*yield*/, connection.end()];
            case 8:
                _c.sent();
                return [2 /*return*/];
            case 9:
                token = jsonwebtoken_1.default.sign({ id: user.user_id, email: user.email }, config_1.default.jwtSecret || "your-secret-key", { expiresIn: "24h" });
                _ = user.password_hash, userWithoutPassword = __rest(user, ["password_hash"]);
                res.json({
                    success: true,
                    message: "Login successful",
                    token: token,
                    user: userWithoutPassword,
                });
                return [4 /*yield*/, connection.end()];
            case 10:
                _c.sent();
                return [3 /*break*/, 12];
            case 11:
                error_2 = _c.sent();
                console.error("Login error:", error_2);
                res.status(500).json({
                    success: false,
                    message: "Internal server error",
                    error: error_2.message,
                });
                return [3 /*break*/, 12];
            case 12: return [2 /*return*/];
        }
    });
}); };
exports.loginUser = loginUser;
