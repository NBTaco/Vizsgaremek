import { Router } from "express";
import multer from "multer";
import path from "path";
import { getCart, addCategory, addItem, addToCart, createOrder, deleteCartItem, deleteCategory, deleteItem, getCategories, getItemById, getAllItems, getUserRole, loginUser, registerUser, run, updateCartItem, updateItem, updateOrderStatus, userSettings } from "./controller";
import verifyToken, { requireAdmin } from "../middleware/auth"

const upload = multer({ dest: path.resolve(__dirname, "..", "..", "kepek", "tmp") });

const router = Router();

router.get("/", router);
router.get("/", run);
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/user", userSettings, verifyToken);
router.get("/items", getAllItems);
router.post("/items", verifyToken, requireAdmin, upload.single("image"), addItem);
router.patch("/items/:productId", verifyToken, requireAdmin, updateItem);
router.get("/items/:productId", getItemById);
router.post("/aboutus", userSettings);
router.get("/categories", getCategories)
router.get("/role/:username", getUserRole)
router.post("/additem", upload.single("image"), addItem)
router.post("/updateitem", updateItem)
router.post("/deleteitem", deleteItem)
router.post("/addcategory", addCategory)
router.post("/deletecategory/:categoryId", deleteCategory)
router.post("/orders", verifyToken, createOrder)
router.post("/cart/items", verifyToken, addToCart)
router.patch("/cart/items", verifyToken, updateCartItem)
router.delete("/cart/items", verifyToken, deleteCartItem)
router.patch("/orders/status", verifyToken, updateOrderStatus)
router.get("/cart", verifyToken, getCart);

export default router;