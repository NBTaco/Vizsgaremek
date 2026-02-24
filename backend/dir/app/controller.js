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
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrdersByUser = exports.getAllOrders = exports.getCart = exports.updateOrderStatus = exports.deleteCartItem = exports.updateCartItem = exports.addToCart = exports.createOrder = exports.getUserRole = exports.deleteCategory = exports.addCategory = exports.getCategories = exports.deleteItem = exports.updateItem = exports.addItem = exports.getItemById = exports.getAllItems = exports.userSettings = exports.loginUser = exports.registerUser = exports.run = void 0;
var bcrypt_1 = __importDefault(require("bcrypt"));
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var promise_1 = __importDefault(require("mysql2/promise"));
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
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
                return [4 /*yield*/, connection.query("SELECT email FROM users WHERE email = ? OR username = ?", [email, username])];
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
                return [4 /*yield*/, connection.query("SELECT user_id, email, username, role FROM users WHERE email = ?", [email])];
            case 5:
                _d = __read.apply(void 0, [_e.sent(), 1]), users = _d[0];
                user = Array.isArray(users) && users.length > 0 ? users[0] : null;
                token = jsonwebtoken_1.default.sign({ id: result.insertId, email: email, role: user === null || user === void 0 ? void 0 : user.role }, config_1.default.jwtSecret || "your-secret-key", { expiresIn: "24h" });
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
            case 3: return [4 /*yield*/, connection.query("SELECT user_id, email, password_hash, username, role FROM users WHERE email = ?", [
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
                token = jsonwebtoken_1.default.sign({ id: user.user_id, email: user.email, role: user.role }, config_1.default.jwtSecret || "your-secret-key", { expiresIn: "24h" });
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
var userSettings = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var connection, token, decoded, e_1, userId, email, _a, users, user, error_3;
    var _b, _c, _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                _e.trys.push([0, 14, , 15]);
                return [4 /*yield*/, promise_1.default.createConnection(config_1.default.database)];
            case 1:
                connection = _e.sent();
                token = ((_b = req.body) === null || _b === void 0 ? void 0 : _b.token) || ((_c = req.query) === null || _c === void 0 ? void 0 : _c.token) || ((_d = req.headers) === null || _d === void 0 ? void 0 : _d['x-access-token']);
                if (!!token) return [3 /*break*/, 3];
                res.status(403).json({ success: false, message: "Token required" });
                return [4 /*yield*/, connection.end()];
            case 2:
                _e.sent();
                return [2 /*return*/];
            case 3:
                if (!!config_1.default.jwtSecret) return [3 /*break*/, 5];
                res.status(500).json({ success: false, message: "Missing JWT secret" });
                return [4 /*yield*/, connection.end()];
            case 4:
                _e.sent();
                return [2 /*return*/];
            case 5:
                decoded = void 0;
                _e.label = 6;
            case 6:
                _e.trys.push([6, 7, , 9]);
                decoded = jsonwebtoken_1.default.verify(token, config_1.default.jwtSecret);
                return [3 /*break*/, 9];
            case 7:
                e_1 = _e.sent();
                res.status(401).json({ success: false, message: "Invalid token" });
                return [4 /*yield*/, connection.end()];
            case 8:
                _e.sent();
                return [2 /*return*/];
            case 9:
                userId = decoded === null || decoded === void 0 ? void 0 : decoded.id;
                email = decoded === null || decoded === void 0 ? void 0 : decoded.email;
                return [4 /*yield*/, connection.query("SELECT user_id, email, username FROM users WHERE user_id = ? OR email = ? LIMIT 1", [userId, email])];
            case 10:
                _a = __read.apply(void 0, [_e.sent(), 1]), users = _a[0];
                user = Array.isArray(users) && users.length > 0 ? users[0] : null;
                if (!!user) return [3 /*break*/, 12];
                res.status(404).json({ success: false, message: "User not found" });
                return [4 /*yield*/, connection.end()];
            case 11:
                _e.sent();
                return [2 /*return*/];
            case 12:
                res.json({
                    success: true,
                    message: "User settings fetched",
                    user: { email: user.email, username: user.username },
                });
                return [4 /*yield*/, connection.end()];
            case 13:
                _e.sent();
                return [3 /*break*/, 15];
            case 14:
                error_3 = _e.sent();
                console.error("User settings error:", error_3);
                res.status(500).json({ success: false, message: "Internal server error", error: error_3.message });
                return [3 /*break*/, 15];
            case 15: return [2 /*return*/];
        }
    });
}); };
exports.userSettings = userSettings;
var getAllItems = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var connection, _a, rows, rawRows, baseUrl, productsMap, _b, _c, row, imageUrl, product, items, error_4;
    var e_2, _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                _e.trys.push([0, 4, , 5]);
                return [4 /*yield*/, promise_1.default.createConnection(config_1.default.database)];
            case 1:
                connection = _e.sent();
                return [4 /*yield*/, connection.query("SELECT p.product_id, p.product_name, p.price, p.stock, p.image_url, p.description,\n              b.category_id, c.name AS category_name\n       FROM products p\n       LEFT JOIN belongs b ON p.product_id = b.product_id\n       LEFT JOIN categories c ON b.category_id = c.category_id\n       ORDER BY p.product_id")];
            case 2:
                _a = __read.apply(void 0, [_e.sent(), 1]), rows = _a[0];
                rawRows = Array.isArray(rows) ? rows : [];
                baseUrl = "".concat(req.protocol, "://").concat(req.get("host"));
                productsMap = new Map();
                try {
                    for (_b = __values(rawRows), _c = _b.next(); !_c.done; _c = _b.next()) {
                        row = _c.value;
                        imageUrl = row.image_url || "";
                        if (imageUrl && !imageUrl.startsWith("http")) {
                            imageUrl = imageUrl.replace(/^\.\.\//, "").replace(/^kepek\//, "");
                            imageUrl = "".concat(baseUrl, "/kepek/").concat(imageUrl);
                        }
                        if (!productsMap.has(row.product_id)) {
                            productsMap.set(row.product_id, {
                                product_id: row.product_id,
                                product_name: row.product_name,
                                price: row.price,
                                stock: row.stock,
                                description: row.description,
                                image_url: imageUrl,
                                category_ids: [],
                                category_names: []
                            });
                        }
                        if (row.category_id) {
                            product = productsMap.get(row.product_id);
                            product.category_ids.push(row.category_id);
                            product.category_names.push(row.category_name);
                        }
                    }
                }
                catch (e_2_1) { e_2 = { error: e_2_1 }; }
                finally {
                    try {
                        if (_c && !_c.done && (_d = _b.return)) _d.call(_b);
                    }
                    finally { if (e_2) throw e_2.error; }
                }
                items = Array.from(productsMap.values());
                res.json({ items: items });
                return [4 /*yield*/, connection.end()];
            case 3:
                _e.sent();
                return [3 /*break*/, 5];
            case 4:
                error_4 = _e.sent();
                console.error("Get items error:", error_4);
                res.status(500).json({ success: false, message: "Internal server error", error: error_4.message });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.getAllItems = getAllItems;
var getItemById = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var connection, idParam, productId, _a, rows, items, baseUrl, item, imageUrl, error_5;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                connection = null;
                _b.label = 1;
            case 1:
                _b.trys.push([1, 4, 5, 8]);
                idParam = req.params.productId;
                productId = parseInt(String(idParam), 10);
                if (isNaN(productId)) {
                    res.status(400).json({ success: false, message: "Érvénytelen azonosító" });
                    return [2 /*return*/];
                }
                return [4 /*yield*/, promise_1.default.createConnection(config_1.default.database)];
            case 2:
                connection = _b.sent();
                return [4 /*yield*/, connection.query("SELECT product_id, product_name, price, stock, image_url, description FROM products WHERE product_id = ?", [productId])];
            case 3:
                _a = __read.apply(void 0, [_b.sent(), 1]), rows = _a[0];
                items = Array.isArray(rows) ? rows : [];
                if (items.length === 0) {
                    res.status(404).json({ success: false, message: "Termék nem található" });
                    return [2 /*return*/];
                }
                baseUrl = "".concat(req.protocol, "://").concat(req.get("host"));
                item = items[0];
                imageUrl = (item === null || item === void 0 ? void 0 : item.image_url) || "";
                if (imageUrl && !imageUrl.startsWith("http")) {
                    imageUrl = imageUrl.replace(/^\.\.\//, "").replace(/^kepek\//, "");
                    imageUrl = "".concat(baseUrl, "/kepek/").concat(imageUrl);
                }
                res.json({
                    success: true,
                    item: __assign(__assign({}, item), { image_url: imageUrl })
                });
                return [3 /*break*/, 8];
            case 4:
                error_5 = _b.sent();
                console.error("Hiba a lekérdezés során:", error_5);
                res.status(500).json({ success: false, message: "Szerveroldali hiba történt" });
                return [3 /*break*/, 8];
            case 5:
                if (!connection) return [3 /*break*/, 7];
                return [4 /*yield*/, connection.end()];
            case 6:
                _b.sent();
                _b.label = 7;
            case 7: return [7 /*endfinally*/];
            case 8: return [2 /*return*/];
        }
    });
}); };
exports.getItemById = getItemById;
var addItem = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var connection, _a, product_name, price, stock, category_ids, file, parsedPrice, parsedStock, categoryIds, _b, result, productId_1, ext, kepekDir, newFileName, imageUrl, values, params_1, error_6;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                connection = null;
                _c.label = 1;
            case 1:
                _c.trys.push([1, 17, 20, 23]);
                return [4 /*yield*/, promise_1.default.createConnection(config_1.default.database)];
            case 2:
                connection = _c.sent();
                _a = req.body, product_name = _a.product_name, price = _a.price, stock = _a.stock, category_ids = _a.category_ids;
                file = req.file;
                if (!(!product_name || price === undefined || stock === undefined || !file)) return [3 /*break*/, 4];
                res.status(400).json({ success: false, message: "product_name, price, stock, and image file are required" });
                if (file)
                    fs_1.default.unlinkSync(file.path);
                return [4 /*yield*/, connection.end()];
            case 3:
                _c.sent();
                return [2 /*return*/];
            case 4:
                parsedPrice = Number(price);
                parsedStock = Number(stock);
                if (!(!Number.isFinite(parsedPrice) || parsedPrice < 0 || !Number.isFinite(parsedStock) || parsedStock < 0)) return [3 /*break*/, 6];
                res.status(400).json({ success: false, message: "price and stock must be non-negative numbers" });
                fs_1.default.unlinkSync(file.path);
                return [4 /*yield*/, connection.end()];
            case 5:
                _c.sent();
                return [2 /*return*/];
            case 6:
                categoryIds = [];
                if (!(category_ids !== undefined)) return [3 /*break*/, 8];
                if (typeof category_ids === "string") {
                    categoryIds = category_ids.split(",").map(function (s) { return parseInt(s.trim(), 10); }).filter(function (n) { return !isNaN(n); });
                }
                else if (Array.isArray(category_ids)) {
                    categoryIds = category_ids.map(function (s) { return parseInt(String(s).trim(), 10); }).filter(function (n) { return !isNaN(n); });
                }
                else if (typeof category_ids === "number") {
                    categoryIds = [category_ids];
                }
                if (!(category_ids !== undefined && categoryIds.length === 0)) return [3 /*break*/, 8];
                res.status(400).json({ success: false, message: "Invalid category_ids" });
                fs_1.default.unlinkSync(file.path);
                return [4 /*yield*/, connection.end()];
            case 7:
                _c.sent();
                return [2 /*return*/];
            case 8: return [4 /*yield*/, connection.beginTransaction()];
            case 9:
                _c.sent();
                return [4 /*yield*/, connection.query("INSERT INTO products (product_name, price, stock, image_url) VALUES (?, ?, ?, ?)", [product_name, parsedPrice, parsedStock, ""])];
            case 10:
                _b = __read.apply(void 0, [_c.sent(), 1]), result = _b[0];
                productId_1 = result.insertId;
                ext = path_1.default.extname(file.originalname) || ".png";
                kepekDir = path_1.default.resolve(__dirname, "..", "..", "kepek");
                newFileName = "".concat(productId_1).concat(ext);
                return [4 /*yield*/, fs_1.default.promises.copyFile(file.path, path_1.default.join(kepekDir, newFileName))];
            case 11:
                _c.sent();
                return [4 /*yield*/, fs_1.default.promises.unlink(file.path)];
            case 12:
                _c.sent();
                imageUrl = "../kepek/".concat(newFileName);
                return [4 /*yield*/, connection.query("UPDATE products SET image_url = ? WHERE product_id = ?", [imageUrl, productId_1])];
            case 13:
                _c.sent();
                if (!(categoryIds.length > 0)) return [3 /*break*/, 15];
                values = categoryIds.map(function () { return "(?, ?)"; }).join(", ");
                params_1 = [];
                categoryIds.forEach(function (categoryId) {
                    params_1.push(categoryId, productId_1);
                });
                return [4 /*yield*/, connection.query("INSERT INTO belongs (category_id, product_id) VALUES ".concat(values), params_1)];
            case 14:
                _c.sent();
                _c.label = 15;
            case 15: return [4 /*yield*/, connection.commit()];
            case 16:
                _c.sent();
                res.status(201).json({
                    success: true,
                    message: "Item added successfully",
                    product_id: productId_1,
                    image_url: imageUrl,
                });
                return [3 /*break*/, 23];
            case 17:
                error_6 = _c.sent();
                if (!connection) return [3 /*break*/, 19];
                return [4 /*yield*/, connection.rollback()];
            case 18:
                _c.sent();
                _c.label = 19;
            case 19:
                if (req.file && fs_1.default.existsSync(req.file.path)) {
                    fs_1.default.unlinkSync(req.file.path);
                }
                console.error("Add item error:", error_6);
                res.status(500).json({ success: false, message: "Internal server error", error: error_6.message });
                return [3 /*break*/, 23];
            case 20:
                if (!connection) return [3 /*break*/, 22];
                return [4 /*yield*/, connection.end()];
            case 21:
                _c.sent();
                _c.label = 22;
            case 22: return [7 /*endfinally*/];
            case 23: return [2 /*return*/];
        }
    });
}); };
exports.addItem = addItem;
var updateItem = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var connection, productId_2, _a, product_name, price, stock, image_url, category_ids, updates, params, parsedPrice, parsedStock, categoryIds, isEmptyArray, _b, updateResult, _c, existingRows, values, categoryParams_1, _d, itemRows, item, _e, categoryRows, categoryIdsResult, error_7;
    return __generator(this, function (_f) {
        switch (_f.label) {
            case 0:
                connection = null;
                _f.label = 1;
            case 1:
                _f.trys.push([1, 17, 20, 23]);
                return [4 /*yield*/, promise_1.default.createConnection(config_1.default.database)];
            case 2:
                connection = _f.sent();
                productId_2 = Number(req.params.productId);
                _a = req.body, product_name = _a.product_name, price = _a.price, stock = _a.stock, image_url = _a.image_url, category_ids = _a.category_ids;
                if (!Number.isFinite(productId_2) || productId_2 <= 0) {
                    res.status(400).json({ success: false, message: "Invalid productId" });
                    return [2 /*return*/];
                }
                updates = [];
                params = [];
                if (product_name !== undefined) {
                    updates.push("product_name = ?");
                    params.push(product_name);
                }
                if (price !== undefined) {
                    parsedPrice = Number(price);
                    if (!Number.isFinite(parsedPrice) || parsedPrice < 0) {
                        res.status(400).json({ success: false, message: "price must be a non-negative number" });
                        return [2 /*return*/];
                    }
                    updates.push("price = ?");
                    params.push(parsedPrice);
                }
                if (stock !== undefined) {
                    parsedStock = Number(stock);
                    if (!Number.isFinite(parsedStock) || parsedStock < 0) {
                        res.status(400).json({ success: false, message: "stock must be a non-negative number" });
                        return [2 /*return*/];
                    }
                    updates.push("stock = ?");
                    params.push(parsedStock);
                }
                if (image_url !== undefined) {
                    updates.push("image_url = ?");
                    params.push(image_url);
                }
                categoryIds = null;
                if (category_ids !== undefined) {
                    categoryIds = [];
                    if (typeof category_ids === "string") {
                        categoryIds = category_ids.split(",").map(function (s) { return parseInt(s.trim(), 10); }).filter(function (n) { return !isNaN(n); });
                    }
                    else if (Array.isArray(category_ids)) {
                        categoryIds = category_ids.map(function (s) { return parseInt(String(s).trim(), 10); }).filter(function (n) { return !isNaN(n); });
                    }
                    else if (typeof category_ids === "number") {
                        categoryIds = [category_ids];
                    }
                    isEmptyArray = Array.isArray(category_ids) && category_ids.length === 0;
                    if (categoryIds.length === 0 && !isEmptyArray) {
                        res.status(400).json({ success: false, message: "Invalid category_ids" });
                        return [2 /*return*/];
                    }
                }
                if (updates.length === 0 && categoryIds === null) {
                    res.status(400).json({ success: false, message: "No fields provided to update" });
                    return [2 /*return*/];
                }
                return [4 /*yield*/, connection.beginTransaction()];
            case 3:
                _f.sent();
                if (!(updates.length > 0)) return [3 /*break*/, 7];
                params.push(productId_2);
                return [4 /*yield*/, connection.query("UPDATE products SET ".concat(updates.join(", "), " WHERE product_id = ?"), params)];
            case 4:
                _b = __read.apply(void 0, [_f.sent(), 1]), updateResult = _b[0];
                if (!(updateResult.affectedRows === 0)) return [3 /*break*/, 6];
                return [4 /*yield*/, connection.rollback()];
            case 5:
                _f.sent();
                res.status(404).json({ success: false, message: "Item not found" });
                return [2 /*return*/];
            case 6: return [3 /*break*/, 10];
            case 7: return [4 /*yield*/, connection.query("SELECT product_id FROM products WHERE product_id = ?", [productId_2])];
            case 8:
                _c = __read.apply(void 0, [_f.sent(), 1]), existingRows = _c[0];
                if (!(!Array.isArray(existingRows) || existingRows.length === 0)) return [3 /*break*/, 10];
                return [4 /*yield*/, connection.rollback()];
            case 9:
                _f.sent();
                res.status(404).json({ success: false, message: "Item not found" });
                return [2 /*return*/];
            case 10:
                if (!(categoryIds !== null)) return [3 /*break*/, 13];
                return [4 /*yield*/, connection.query("DELETE FROM belongs WHERE product_id = ?", [productId_2])];
            case 11:
                _f.sent();
                if (!(categoryIds.length > 0)) return [3 /*break*/, 13];
                values = categoryIds.map(function () { return "(?, ?)"; }).join(", ");
                categoryParams_1 = [];
                categoryIds.forEach(function (categoryId) {
                    categoryParams_1.push(categoryId, productId_2);
                });
                return [4 /*yield*/, connection.query("INSERT INTO belongs (category_id, product_id) VALUES ".concat(values), categoryParams_1)];
            case 12:
                _f.sent();
                _f.label = 13;
            case 13: return [4 /*yield*/, connection.commit()];
            case 14:
                _f.sent();
                return [4 /*yield*/, connection.query("SELECT product_id, product_name, price, stock, image_url FROM products WHERE product_id = ?", [productId_2])];
            case 15:
                _d = __read.apply(void 0, [_f.sent(), 1]), itemRows = _d[0];
                item = Array.isArray(itemRows) && itemRows.length > 0 ? itemRows[0] : null;
                return [4 /*yield*/, connection.query("SELECT category_id FROM belongs WHERE product_id = ?", [productId_2])];
            case 16:
                _e = __read.apply(void 0, [_f.sent(), 1]), categoryRows = _e[0];
                categoryIdsResult = Array.isArray(categoryRows)
                    ? categoryRows.map(function (row) { return row.category_id; })
                    : [];
                res.json({
                    success: true,
                    message: "Item updated successfully",
                    item: item ? __assign(__assign({}, item), { category_ids: categoryIdsResult }) : null,
                });
                return [3 /*break*/, 23];
            case 17:
                error_7 = _f.sent();
                if (!connection) return [3 /*break*/, 19];
                return [4 /*yield*/, connection.rollback()];
            case 18:
                _f.sent();
                _f.label = 19;
            case 19:
                console.error("Update item error:", error_7);
                res.status(500).json({ success: false, message: "Internal server error", error: error_7.message });
                return [3 /*break*/, 23];
            case 20:
                if (!connection) return [3 /*break*/, 22];
                return [4 /*yield*/, connection.end()];
            case 21:
                _f.sent();
                _f.label = 22;
            case 22: return [7 /*endfinally*/];
            case 23: return [2 /*return*/];
        }
    });
}); };
exports.updateItem = updateItem;
var deleteItem = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var connection, productId, _a, existingRows, error_8;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                connection = null;
                _b.label = 1;
            case 1:
                _b.trys.push([1, 10, 13, 16]);
                return [4 /*yield*/, promise_1.default.createConnection(config_1.default.database)];
            case 2:
                connection = _b.sent();
                productId = Number(req.params.productId);
                if (!Number.isFinite(productId) || productId <= 0) {
                    res.status(400).json({ success: false, message: "Invalid productId" });
                    return [2 /*return*/];
                }
                return [4 /*yield*/, connection.beginTransaction()];
            case 3:
                _b.sent();
                return [4 /*yield*/, connection.query("SELECT product_id FROM products WHERE product_id = ?", [productId])];
            case 4:
                _a = __read.apply(void 0, [_b.sent(), 1]), existingRows = _a[0];
                if (!(!Array.isArray(existingRows) || existingRows.length === 0)) return [3 /*break*/, 6];
                return [4 /*yield*/, connection.rollback()];
            case 5:
                _b.sent();
                res.status(404).json({ success: false, message: "Item not found" });
                return [2 /*return*/];
            case 6: return [4 /*yield*/, connection.query("DELETE FROM belongs WHERE product_id = ?", [productId])];
            case 7:
                _b.sent();
                return [4 /*yield*/, connection.query("DELETE FROM products WHERE product_id = ?", [productId])];
            case 8:
                _b.sent();
                return [4 /*yield*/, connection.commit()];
            case 9:
                _b.sent();
                res.json({
                    success: true,
                    message: "Item deleted successfully",
                    product_id: productId,
                });
                return [3 /*break*/, 16];
            case 10:
                error_8 = _b.sent();
                if (!connection) return [3 /*break*/, 12];
                return [4 /*yield*/, connection.rollback()];
            case 11:
                _b.sent();
                _b.label = 12;
            case 12:
                console.error("Delete item error:", error_8);
                res.status(500).json({ success: false, message: "Internal server error", error: error_8.message });
                return [3 /*break*/, 16];
            case 13:
                if (!connection) return [3 /*break*/, 15];
                return [4 /*yield*/, connection.end()];
            case 14:
                _b.sent();
                _b.label = 15;
            case 15: return [7 /*endfinally*/];
            case 16: return [2 /*return*/];
        }
    });
}); };
exports.deleteItem = deleteItem;
var getCategories = function (_req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var connection, _a, rows, categories, error_9;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 4, , 5]);
                return [4 /*yield*/, promise_1.default.createConnection(config_1.default.database)];
            case 1:
                connection = _b.sent();
                return [4 /*yield*/, connection.query("SELECT category_id, name FROM categories ORDER BY name ASC")];
            case 2:
                _a = __read.apply(void 0, [_b.sent(), 1]), rows = _a[0];
                categories = Array.isArray(rows) ? rows : [];
                res.json(categories);
                return [4 /*yield*/, connection.end()];
            case 3:
                _b.sent();
                return [3 /*break*/, 5];
            case 4:
                error_9 = _b.sent();
                console.error("Get categories error:", error_9);
                res.status(500).json({ message: "Internal server error", error: error_9.message });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.getCategories = getCategories;
var addCategory = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var connection, name, trimmedName, _a, existingCategories, _b, result, categoryId, error_10;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                connection = null;
                _c.label = 1;
            case 1:
                _c.trys.push([1, 5, 6, 9]);
                return [4 /*yield*/, promise_1.default.createConnection(config_1.default.database)];
            case 2:
                connection = _c.sent();
                name = req.body.name;
                if (!name || typeof name !== "string" || name.trim().length === 0) {
                    res.status(400).json({ success: false, message: "Category name is required" });
                    return [2 /*return*/];
                }
                trimmedName = name.trim();
                return [4 /*yield*/, connection.query("SELECT category_id FROM categories WHERE name = ?", [trimmedName])];
            case 3:
                _a = __read.apply(void 0, [_c.sent(), 1]), existingCategories = _a[0];
                if (Array.isArray(existingCategories) && existingCategories.length > 0) {
                    res.status(409).json({ success: false, message: "Category already exists" });
                    return [2 /*return*/];
                }
                return [4 /*yield*/, connection.query("INSERT INTO categories (name) VALUES (?)", [trimmedName])];
            case 4:
                _b = __read.apply(void 0, [_c.sent(), 1]), result = _b[0];
                categoryId = result.insertId;
                res.status(201).json({
                    success: true,
                    message: "Category added successfully",
                    category_id: categoryId,
                    name: trimmedName,
                });
                return [3 /*break*/, 9];
            case 5:
                error_10 = _c.sent();
                console.error("Add category error:", error_10);
                res.status(500).json({ success: false, message: "Internal server error", error: error_10.message });
                return [3 /*break*/, 9];
            case 6:
                if (!connection) return [3 /*break*/, 8];
                return [4 /*yield*/, connection.end()];
            case 7:
                _c.sent();
                _c.label = 8;
            case 8: return [7 /*endfinally*/];
            case 9: return [2 /*return*/];
        }
    });
}); };
exports.addCategory = addCategory;
var deleteCategory = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var connection, categoryId, _a, existingRows, error_11;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                connection = null;
                _b.label = 1;
            case 1:
                _b.trys.push([1, 10, 13, 16]);
                return [4 /*yield*/, promise_1.default.createConnection(config_1.default.database)];
            case 2:
                connection = _b.sent();
                categoryId = Number(req.params.categoryId);
                if (!Number.isFinite(categoryId) || categoryId <= 0) {
                    res.status(400).json({ success: false, message: "Invalid categoryId" });
                    return [2 /*return*/];
                }
                return [4 /*yield*/, connection.beginTransaction()];
            case 3:
                _b.sent();
                return [4 /*yield*/, connection.query("SELECT category_id FROM categories WHERE category_id = ?", [categoryId])];
            case 4:
                _a = __read.apply(void 0, [_b.sent(), 1]), existingRows = _a[0];
                if (!(!Array.isArray(existingRows) || existingRows.length === 0)) return [3 /*break*/, 6];
                return [4 /*yield*/, connection.rollback()];
            case 5:
                _b.sent();
                res.status(404).json({ success: false, message: "Category not found" });
                return [2 /*return*/];
            case 6: return [4 /*yield*/, connection.query("DELETE FROM belongs WHERE category_id = ?", [categoryId])];
            case 7:
                _b.sent();
                return [4 /*yield*/, connection.query("DELETE FROM categories WHERE category_id = ?", [categoryId])];
            case 8:
                _b.sent();
                return [4 /*yield*/, connection.commit()];
            case 9:
                _b.sent();
                res.json({
                    success: true,
                    message: "Category deleted successfully",
                    category_id: categoryId,
                });
                return [3 /*break*/, 16];
            case 10:
                error_11 = _b.sent();
                if (!connection) return [3 /*break*/, 12];
                return [4 /*yield*/, connection.rollback()];
            case 11:
                _b.sent();
                _b.label = 12;
            case 12:
                console.error("Delete category error:", error_11);
                res.status(500).json({ success: false, message: "Internal server error", error: error_11.message });
                return [3 /*break*/, 16];
            case 13:
                if (!connection) return [3 /*break*/, 15];
                return [4 /*yield*/, connection.end()];
            case 14:
                _b.sent();
                _b.label = 15;
            case 15: return [7 /*endfinally*/];
            case 16: return [2 /*return*/];
        }
    });
}); };
exports.deleteCategory = deleteCategory;
var getUserRole = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var nev, connection, _a, role, e_3;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                nev = req.params.username;
                return [4 /*yield*/, promise_1.default.createConnection(config_1.default.database)];
            case 1:
                connection = _b.sent();
                return [4 /*yield*/, connection.query("SELECT users.role FROM users WHERE users.username = ?", [nev])];
            case 2:
                _a = __read.apply(void 0, [_b.sent(), 1]), role = _a[0];
                res.send(role[0]);
                return [3 /*break*/, 4];
            case 3:
                e_3 = _b.sent();
                console.error(e_3);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.getUserRole = getUserRole;
var createOrder = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var connection, userId, _a, result, orderId, error_12;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                connection = null;
                _b.label = 1;
            case 1:
                _b.trys.push([1, 4, 5, 8]);
                return [4 /*yield*/, promise_1.default.createConnection(config_1.default.database)];
            case 2:
                connection = _b.sent();
                userId = req.body.userId;
                return [4 /*yield*/, connection.query("INSERT INTO orders (user_id, status) VALUES (?, ?)", [userId, 'in_progress'])];
            case 3:
                _a = __read.apply(void 0, [_b.sent(), 1]), result = _a[0];
                orderId = result.insertId;
                res.status(201).json({ success: true, message: "Order created successfully", orderId: orderId });
                return [3 /*break*/, 8];
            case 4:
                error_12 = _b.sent();
                console.error("Create order error:", error_12);
                res.status(500).json({ success: false, message: "Internal server error", error: error_12.message });
                return [3 /*break*/, 8];
            case 5:
                if (!connection) return [3 /*break*/, 7];
                return [4 /*yield*/, connection.end()];
            case 6:
                _b.sent();
                _b.label = 7;
            case 7: return [7 /*endfinally*/];
            case 8: return [2 /*return*/];
        }
    });
}); };
exports.createOrder = createOrder;
var addToCart = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var connection, _a, productId, quantity, userId, _b, productRow, price, subtotal, _c, orders, orderId, _d, newOrder, error_13;
    var _e, _f;
    return __generator(this, function (_g) {
        switch (_g.label) {
            case 0:
                connection = null;
                _g.label = 1;
            case 1:
                _g.trys.push([1, 9, 10, 13]);
                return [4 /*yield*/, promise_1.default.createConnection(config_1.default.database)];
            case 2:
                connection = _g.sent();
                _a = req.body, productId = _a.productId, quantity = _a.quantity;
                userId = ((_e = req.user) === null || _e === void 0 ? void 0 : _e.user_id) || ((_f = req.user) === null || _f === void 0 ? void 0 : _f.id);
                return [4 /*yield*/, connection.query("SELECT price FROM products WHERE product_id = ?", [productId])];
            case 3:
                _b = __read.apply(void 0, [_g.sent(), 1]), productRow = _b[0];
                if (productRow.length === 0) {
                    res.status(404).json({ success: false, message: "Termék nem található" });
                    return [2 /*return*/];
                }
                price = productRow[0].price;
                subtotal = price * quantity;
                return [4 /*yield*/, connection.query("SELECT order_id FROM orders WHERE user_id = ? AND status = 'in_progress' LIMIT 1", [userId])];
            case 4:
                _c = __read.apply(void 0, [_g.sent(), 1]), orders = _c[0];
                orderId = void 0;
                if (!(orders.length > 0)) return [3 /*break*/, 5];
                orderId = orders[0].order_id;
                return [3 /*break*/, 7];
            case 5: return [4 /*yield*/, connection.query("INSERT INTO orders (user_id, status, total_price, created_at) VALUES (?, 'in_progress', 0, ?)", [userId, new Date().toISOString().slice(0, 10)])];
            case 6:
                _d = __read.apply(void 0, [_g.sent(), 1]), newOrder = _d[0];
                orderId = newOrder.insertId;
                _g.label = 7;
            case 7: return [4 /*yield*/, connection.query("INSERT INTO order_items (order_id, product_id, quantity, subtotal) \n             VALUES (?, ?, ?, ?) \n             ON DUPLICATE KEY UPDATE \n                quantity = quantity + VALUES(quantity), \n                subtotal = subtotal + VALUES(subtotal)", [orderId, productId, quantity, subtotal])];
            case 8:
                _g.sent();
                res.json({ success: true, message: "A kosár frissítve!" });
                return [3 /*break*/, 13];
            case 9:
                error_13 = _g.sent();
                console.error(error_13);
                res.status(500).json({ success: false, error: error_13.message });
                return [3 /*break*/, 13];
            case 10:
                if (!connection) return [3 /*break*/, 12];
                return [4 /*yield*/, connection.end()];
            case 11:
                _g.sent();
                _g.label = 12;
            case 12: return [7 /*endfinally*/];
            case 13: return [2 /*return*/];
        }
    });
}); };
exports.addToCart = addToCart;
var updateCartItem = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var connection, _a, orderId, productId, quantity, parsedQuantity, _b, result, error_14;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                connection = null;
                _c.label = 1;
            case 1:
                _c.trys.push([1, 4, 5, 8]);
                return [4 /*yield*/, promise_1.default.createConnection(config_1.default.database)];
            case 2:
                connection = _c.sent();
                _a = req.body, orderId = _a.orderId, productId = _a.productId, quantity = _a.quantity;
                if (!orderId || !productId || quantity === undefined) {
                    res.status(400).json({ success: false, message: "Order ID, product ID, and quantity are required" });
                    return [2 /*return*/];
                }
                parsedQuantity = Number(quantity);
                if (!Number.isFinite(parsedQuantity) || parsedQuantity <= 0) {
                    res.status(400).json({ success: false, message: "Quantity must be a positive number" });
                    return [2 /*return*/];
                }
                return [4 /*yield*/, connection.query("UPDATE order_items SET quantity = ? WHERE order_id = ? AND product_id = ?", [parsedQuantity, orderId, productId])];
            case 3:
                _b = __read.apply(void 0, [_c.sent(), 1]), result = _b[0];
                if (result.affectedRows === 0) {
                    res.status(404).json({ success: false, message: "Cart item not found" });
                    return [2 /*return*/];
                }
                res.json({ success: true, message: "Cart item updated successfully" });
                return [3 /*break*/, 8];
            case 4:
                error_14 = _c.sent();
                console.error("Update cart item error:", error_14);
                res.status(500).json({ success: false, message: "Internal server error", error: error_14.message });
                return [3 /*break*/, 8];
            case 5:
                if (!connection) return [3 /*break*/, 7];
                return [4 /*yield*/, connection.end()];
            case 6:
                _c.sent();
                _c.label = 7;
            case 7: return [7 /*endfinally*/];
            case 8: return [2 /*return*/];
        }
    });
}); };
exports.updateCartItem = updateCartItem;
var deleteCartItem = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var connection, productId, userId, _a, orders, orderId, _b, result, error_15;
    var _c, _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                connection = null;
                _e.label = 1;
            case 1:
                _e.trys.push([1, 5, 6, 9]);
                return [4 /*yield*/, promise_1.default.createConnection(config_1.default.database)];
            case 2:
                connection = _e.sent();
                productId = req.body.productId;
                userId = ((_c = req.user) === null || _c === void 0 ? void 0 : _c.user_id) || ((_d = req.user) === null || _d === void 0 ? void 0 : _d.id);
                if (!productId || !userId) {
                    res.status(400).json({ success: false, message: "Hiányzó adatok" });
                    return [2 /*return*/];
                }
                return [4 /*yield*/, connection.query("SELECT order_id FROM orders WHERE user_id = ? AND status = 'in_progress' LIMIT 1", [userId])];
            case 3:
                _a = __read.apply(void 0, [_e.sent(), 1]), orders = _a[0];
                if (orders.length === 0) {
                    res.status(404).json({ success: false, message: "Nincs aktív kosár" });
                    return [2 /*return*/];
                }
                orderId = orders[0].order_id;
                return [4 /*yield*/, connection.query("DELETE FROM order_items WHERE order_id = ? AND product_id = ?", [orderId, productId])];
            case 4:
                _b = __read.apply(void 0, [_e.sent(), 1]), result = _b[0];
                if (result.affectedRows === 0) {
                    res.status(404).json({ success: false, message: "A termék nincs a kosárban" });
                    return [2 /*return*/];
                }
                res.json({ success: true, message: "Termék eltávolítva a kosárból" });
                return [3 /*break*/, 9];
            case 5:
                error_15 = _e.sent();
                console.error("Delete error:", error_15);
                res.status(500).json({ success: false, error: error_15.message });
                return [3 /*break*/, 9];
            case 6:
                if (!connection) return [3 /*break*/, 8];
                return [4 /*yield*/, connection.end()];
            case 7:
                _e.sent();
                _e.label = 8;
            case 8: return [7 /*endfinally*/];
            case 9: return [2 /*return*/];
        }
    });
}); };
exports.deleteCartItem = deleteCartItem;
var updateOrderStatus = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var connection, _a, orderId, status, trimmedStatus, _b, result, error_16;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                connection = null;
                _c.label = 1;
            case 1:
                _c.trys.push([1, 4, 5, 8]);
                return [4 /*yield*/, promise_1.default.createConnection(config_1.default.database)];
            case 2:
                connection = _c.sent();
                _a = req.body, orderId = _a.orderId, status = _a.status;
                if (!orderId || !status || typeof status !== "string") {
                    res.status(400).json({ success: false, message: "Order ID and status are required" });
                    return [2 /*return*/];
                }
                trimmedStatus = status.trim();
                if (trimmedStatus.length === 0) {
                    res.status(400).json({ success: false, message: "Status must be a non-empty string" });
                    return [2 /*return*/];
                }
                return [4 /*yield*/, connection.query("UPDATE orders SET status = ? WHERE order_id = ?", [trimmedStatus, orderId])];
            case 3:
                _b = __read.apply(void 0, [_c.sent(), 1]), result = _b[0];
                if (result.affectedRows === 0) {
                    res.status(404).json({ success: false, message: "Order not found" });
                    return [2 /*return*/];
                }
                res.json({ success: true, message: "Order status updated successfully" });
                return [3 /*break*/, 8];
            case 4:
                error_16 = _c.sent();
                console.error("Update order status error:", error_16);
                res.status(500).json({ success: false, message: "Internal server error", error: error_16.message });
                return [3 /*break*/, 8];
            case 5:
                if (!connection) return [3 /*break*/, 7];
                return [4 /*yield*/, connection.end()];
            case 6:
                _c.sent();
                _c.label = 7;
            case 7: return [7 /*endfinally*/];
            case 8: return [2 /*return*/];
        }
    });
}); };
exports.updateOrderStatus = updateOrderStatus;
var getCart = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var connection, userId, _a, orders, orderId, _b, items, baseUrl_1, normalizedItems, error_17;
    var _c, _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                connection = null;
                _e.label = 1;
            case 1:
                _e.trys.push([1, 5, 6, 9]);
                return [4 /*yield*/, promise_1.default.createConnection(config_1.default.database)];
            case 2:
                connection = _e.sent();
                userId = ((_c = req.user) === null || _c === void 0 ? void 0 : _c.user_id) || ((_d = req.user) === null || _d === void 0 ? void 0 : _d.id);
                if (!userId) {
                    res.status(401).json({ success: false, message: "Nincs bejelentkezve felhasználó" });
                    return [2 /*return*/];
                }
                return [4 /*yield*/, connection.query("SELECT order_id FROM orders WHERE user_id = ? AND status = 'in_progress' LIMIT 1", [userId])];
            case 3:
                _a = __read.apply(void 0, [_e.sent(), 1]), orders = _a[0];
                if (orders.length === 0) {
                    res.json({ success: true, items: [] });
                    return [2 /*return*/];
                }
                orderId = orders[0].order_id;
                return [4 /*yield*/, connection.query("SELECT p.product_id, p.product_name, p.price, p.description, p.image_url, oi.quantity \n             FROM order_items oi \n             JOIN products p ON oi.product_id = p.product_id \n             WHERE oi.order_id = ?", [orderId])];
            case 4:
                _b = __read.apply(void 0, [_e.sent(), 1]), items = _b[0];
                baseUrl_1 = "".concat(req.protocol, "://").concat(req.get("host"));
                normalizedItems = items.map(function (item) {
                    var imageUrl = (item === null || item === void 0 ? void 0 : item.image_url) || "";
                    if (imageUrl && !imageUrl.startsWith("http")) {
                        imageUrl = imageUrl.replace(/^\.\.\//, "").replace(/^kepek\//, "");
                        imageUrl = "".concat(baseUrl_1, "/kepek/").concat(imageUrl);
                    }
                    return __assign(__assign({}, item), { image_url: imageUrl });
                });
                res.json({ success: true, items: normalizedItems });
                return [3 /*break*/, 9];
            case 5:
                error_17 = _e.sent();
                console.error("Hiba a getCart-ban:", error_17.message);
                res.status(500).json({ success: false, error: error_17.message });
                return [3 /*break*/, 9];
            case 6:
                if (!connection) return [3 /*break*/, 8];
                return [4 /*yield*/, connection.end()];
            case 7:
                _e.sent();
                _e.label = 8;
            case 8: return [7 /*endfinally*/];
            case 9: return [2 /*return*/];
        }
    });
}); };
exports.getCart = getCart;
var getAllOrders = function (_req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var connection, _a, rows, error_18;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                connection = null;
                _b.label = 1;
            case 1:
                _b.trys.push([1, 4, 5, 8]);
                return [4 /*yield*/, promise_1.default.createConnection(config_1.default.database)];
            case 2:
                connection = _b.sent();
                return [4 /*yield*/, connection.query("SELECT o.order_id, o.user_id, u.username, o.status, o.created_at,\n                    COALESCE(SUM(oi.subtotal), 0) AS total_price\n             FROM orders o\n             JOIN users u ON o.user_id = u.user_id\n             LEFT JOIN order_items oi ON o.order_id = oi.order_id\n             GROUP BY o.order_id\n             ORDER BY o.order_id")];
            case 3:
                _a = __read.apply(void 0, [_b.sent(), 1]), rows = _a[0];
                res.json({ success: true, orders: rows });
                return [3 /*break*/, 8];
            case 4:
                error_18 = _b.sent();
                console.error("Get all orders error:", error_18.message);
                res.status(500).json({ success: false, message: "Internal server error", error: error_18.message });
                return [3 /*break*/, 8];
            case 5:
                if (!connection) return [3 /*break*/, 7];
                return [4 /*yield*/, connection.end()];
            case 6:
                _b.sent();
                _b.label = 7;
            case 7: return [7 /*endfinally*/];
            case 8: return [2 /*return*/];
        }
    });
}); };
exports.getAllOrders = getAllOrders;
var getOrdersByUser = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var connection, userId, _a, rows, error_19;
    var _b, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                connection = null;
                _d.label = 1;
            case 1:
                _d.trys.push([1, 4, 5, 8]);
                return [4 /*yield*/, promise_1.default.createConnection(config_1.default.database)];
            case 2:
                connection = _d.sent();
                userId = ((_b = req.user) === null || _b === void 0 ? void 0 : _b.user_id) || ((_c = req.user) === null || _c === void 0 ? void 0 : _c.id);
                if (!userId) {
                    res.status(401).json({ success: false, message: "Nincs bejelentkezve felhasználó" });
                    return [2 /*return*/];
                }
                return [4 /*yield*/, connection.query("SELECT o.order_id, o.user_id, u.username, o.status, o.created_at,\n                    COALESCE(SUM(oi.subtotal), 0) AS total_price\n             FROM orders o\n             JOIN users u ON o.user_id = u.user_id\n             LEFT JOIN order_items oi ON o.order_id = oi.order_id\n             WHERE o.user_id = ?\n             GROUP BY o.order_id\n             ORDER BY o.order_id", [userId])];
            case 3:
                _a = __read.apply(void 0, [_d.sent(), 1]), rows = _a[0];
                res.json({ success: true, orders: rows });
                return [3 /*break*/, 8];
            case 4:
                error_19 = _d.sent();
                console.error("Get orders by user error:", error_19.message);
                res.status(500).json({ success: false, message: "Internal server error", error: error_19.message });
                return [3 /*break*/, 8];
            case 5:
                if (!connection) return [3 /*break*/, 7];
                return [4 /*yield*/, connection.end()];
            case 6:
                _d.sent();
                _d.label = 7;
            case 7: return [7 /*endfinally*/];
            case 8: return [2 /*return*/];
        }
    });
}); };
exports.getOrdersByUser = getOrdersByUser;
