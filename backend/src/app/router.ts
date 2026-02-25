import { Router } from "express";
import multer from "multer";
import path from "path";
import { getCart, addCategory, addItem, addToCart, deleteCartItem, deleteCategory, deleteItem, getCategories, getItemById, getAllItems, getAllOrders, getOrdersByUser, getUserRole, loginUser, registerUser, updateCartItem, updateItem, updateOrderStatus, placeOrder, userSettings } from "./controller";
import verifyToken, { requireAdmin } from "../middleware/auth"

const upload = multer({ dest: path.resolve(__dirname, "..", "..", "kepek", "tmp") });

const router = Router();
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/user", verifyToken, userSettings);
router.get("/items", getAllItems);
router.post("/items", verifyToken, requireAdmin, upload.single("image"), addItem);
router.patch("/items/:productId", verifyToken, requireAdmin, upload.single("image"), updateItem);
router.get("/items/:productId", getItemById);
router.post("/aboutus", userSettings);
router.get("/categories", getCategories)
router.get("/role/:username", verifyToken, getUserRole)
router.delete("/items/:productId", verifyToken, requireAdmin, deleteItem)
router.post("/addcategory", verifyToken, requireAdmin, addCategory)
router.post("/deletecategory/:categoryId", verifyToken, requireAdmin, deleteCategory)
router.post("/cart/items", verifyToken, addToCart)
router.patch("/cart/items", verifyToken, updateCartItem)
router.delete("/cart/items", verifyToken, deleteCartItem)
router.patch("/orders/status", verifyToken, requireAdmin, updateOrderStatus)
router.post("/orders/place", verifyToken, placeOrder)
router.get("/cart", verifyToken, getCart);
router.get("/orders", verifyToken, requireAdmin, getAllOrders);
router.get("/orders/user", verifyToken, getOrdersByUser);

export default router;