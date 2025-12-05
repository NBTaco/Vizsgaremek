"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = void 0;
var run = function (port) {
    return function (req, res) {
        res.send("Server is running on port ".concat(port));
    };
};
exports.run = run;
