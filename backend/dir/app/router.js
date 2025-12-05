"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var app_1 = __importDefault(require("./app"));
var controller_1 = require("./controller");
var router = (0, express_1.Router)();
app_1.default.use("/", router);
app_1.default.use("/", controller_1.run);
exports.default = router;
