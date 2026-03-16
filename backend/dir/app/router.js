"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var multer_1 = __importDefault(require("multer"));
var path_1 = __importDefault(require("path"));
var controller_1 = require("./controller");
var auth_1 = __importStar(require("../middleware/auth"));
var upload = (0, multer_1.default)({ dest: path_1.default.resolve(__dirname, "..", "..", "kepek", "tmp") });
var router = (0, express_1.Router)();
router.post("/register", controller_1.registerUser);
router.post("/login", controller_1.loginUser);
router.get("/user", auth_1.default, controller_1.userSettings);
router.get("/items", controller_1.getAllItems);
router.post("/items", auth_1.default, auth_1.requireAdmin, upload.single("image"), controller_1.addItem);
router.patch("/items/:productId", auth_1.default, auth_1.requireAdmin, upload.single("image"), controller_1.updateItem);
router.get("/items/:productId", controller_1.getItemById);
router.post("/aboutus", controller_1.userSettings);
router.get("/categories", controller_1.getCategories);
router.get("/role/:username", auth_1.default, controller_1.getUserRole);
router.delete("/items/:productId", auth_1.default, auth_1.requireAdmin, controller_1.deleteItem);
router.post("/addcategory", auth_1.default, auth_1.requireAdmin, controller_1.addCategory);
router.delete("/deletecategory/:categoryId", auth_1.default, auth_1.requireAdmin, controller_1.deleteCategory);
router.post("/cart/items", auth_1.default, controller_1.addToCart);
router.patch("/cart/items", auth_1.default, controller_1.updateCartItem);
router.delete("/cart/items", auth_1.default, controller_1.deleteCartItem);
router.patch("/orders/status", auth_1.default, auth_1.requireAdmin, controller_1.updateOrderStatus);
router.post("/orders/place", auth_1.default, controller_1.placeOrder);
router.get("/cart", auth_1.default, controller_1.getCart);
router.get("/orders", auth_1.default, auth_1.requireAdmin, controller_1.getAllOrders);
router.get("/orders/user", auth_1.default, controller_1.getOrdersByUser);
exports.default = router;
