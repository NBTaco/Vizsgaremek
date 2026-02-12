import { Router } from "express";
import { addCategory, addItem, addToCart, createOrder, deleteCartItem, deleteCategory, deleteItem, getCategories, getItemsByCategories, getUserRole, loginUser, registerUser, run, updateCartItem, updateItem, updateOrderStatus, userSettings } from "./controller";
import verifyToken, { requireAdmin } from "../middleware/auth"

const router = Router();

router.get("/", router);
router.get("/", run);
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/user", userSettings, verifyToken);
router.get("/items", getItemsByCategories);
router.post("/items", verifyToken, requireAdmin, addItem);
router.patch("/items/:productId", verifyToken, requireAdmin, updateItem);
router.post("/aboutus", userSettings);
router.get("/categories", getCategories)
router.get("/role/:username", getUserRole)
router.post("/additem", addItem)
router.post("/updateitem", updateItem)
router.post("/deleteitem", deleteItem)
router.post("/addcategory", addCategory)
router.post("/deletecategory/:categoryId", deleteCategory)
router.post("/orders", verifyToken, createOrder)
router.post("/cart/items", verifyToken, addToCart)
router.patch("/cart/items", verifyToken, updateCartItem)
router.delete("/cart/items", verifyToken, deleteCartItem)
router.patch("/orders/status", verifyToken, updateOrderStatus)

export default router;