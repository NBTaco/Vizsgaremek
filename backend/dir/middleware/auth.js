"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = void 0;
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var config_1 = __importDefault(require("../config/config"));
var verifyToken = function (req, res, next) {
    var authHeader = req.headers["authorization"] || req.headers["Authorization"];
    var token = typeof authHeader === "string" && authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
    if (!token) {
        res.status(401).json({ success: false, message: "No token provided" });
        return;
    }
    try {
        var payload = jsonwebtoken_1.default.verify(token, config_1.default.jwtSecret || "your-secret-key");
        // attach payload to request (cast to any to avoid typing changes)
        req.user = payload;
        next();
    }
    catch (err) {
        res.status(401).json({ success: false, message: "Invalid or expired token" });
    }
};
exports.verifyToken = verifyToken;
