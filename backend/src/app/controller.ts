import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mysql from "mysql2/promise";
import fs from "fs";
import path from "path";
import config from "../config/config";

const SALT_ROUNDS = 10;

type UserRow = {
  user_id: number;
  email: string;
  username: string;
  role?: string;
  password_hash?: string;
};

export const run = (_req: Request, res: Response) => {
  res.send("Server is running");
};

export const registerUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const connection = await mysql.createConnection(config.database);
    const { email, password, username } = req.body;

    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long",
      });
      return;
    }
    const [existingUser] = await connection.query("SELECT email FROM users WHERE email = ? OR username = ?", [email, username]);
    if (Array.isArray(existingUser) && existingUser.length > 0) {
      res.status(409).json({
        success: false,
        message: "Email already registered",
      });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const [result] = await connection.query(
      "INSERT INTO users (email, password_hash, username) VALUES (?, ?, ?)",
      [email, hashedPassword, username || email.split("@")[0]]
    );

    const [users] = await connection.query("SELECT user_id, email, username, role FROM users WHERE email = ?", [email]);
    const user = Array.isArray(users) && users.length > 0 ? (users[0] as UserRow) : null;

    const token = jwt.sign(
      { id: (result as any).insertId, email, role: user?.role },
      config.jwtSecret || "your-secret-key",
      { expiresIn: "24h" }
    );

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user,
    });
    await connection.end();
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: (error as any).message,
    });
  }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const connection = await mysql.createConnection(config.database);
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
      await connection.end();
      return;
    }

    const [users] = await connection.query("SELECT user_id, email, password_hash, username, role FROM users WHERE email = ?", [
      email,
    ]);

    if (!Array.isArray(users) || users.length === 0) {
      res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
      await connection.end();
      return;
    }

    const user = users[0] as any;

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
      await connection.end();
      return;
    }

    const token = jwt.sign(
      { id: user.user_id, email: user.email, role: user.role },
      config.jwtSecret || "your-secret-key",
      { expiresIn: "24h" }
    );

    const { password_hash: _, ...userWithoutPassword } = user;

    res.json({
      success: true,
      message: "Login successful",
      token,
      user: userWithoutPassword,
    });
    await connection.end();
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: (error as any).message,
    });
  }
};

export const userSettings = async (req: Request, res: Response): Promise<void> => {
  try {
    const connection = await mysql.createConnection(config.database);

    const token = req.body?.token || req.query?.token || req.headers?.['x-access-token'];
    if (!token) {
      res.status(403).json({ success: false, message: "Token required" });
      await connection.end();
      return;
    }

    if (!config.jwtSecret) {
      res.status(500).json({ success: false, message: "Missing JWT secret" });
      await connection.end();
      return;
    }

    let decoded: any;
    try {
      decoded = jwt.verify(token as string, config.jwtSecret) as any;
    } catch (e) {
      res.status(401).json({ success: false, message: "Invalid token" });
      await connection.end();
      return;
    }

    const userId = decoded?.id;
    const email = decoded?.email;

    const [users] = await connection.query(
      "SELECT user_id, email, username FROM users WHERE user_id = ? OR email = ? LIMIT 1",
      [userId, email]
    );

    const user = Array.isArray(users) && users.length > 0 ? users[0] as any : null;

    if (!user) {
      res.status(404).json({ success: false, message: "User not found" });
      await connection.end();
      return;
    }

    res.json({
      success: true,
      message: "User settings fetched",
      user: { email: user.email, username: user.username },
    });

    await connection.end();
  } catch (error) {
    console.error("User settings error:", error);
    res.status(500).json({ success: false, message: "Internal server error", error: (error as any).message });
  }
};


export const getAllItems = async (req: Request, res: Response): Promise<void> => {
  try {
    const connection = await mysql.createConnection(config.database);

    const [rows] = await connection.query(
      `SELECT p.product_id, p.product_name, p.price, p.stock, p.image_url, p.description,
              b.category_id, c.name AS category_name
       FROM products p
       LEFT JOIN belongs b ON p.product_id = b.product_id
       LEFT JOIN categories c ON b.category_id = c.category_id
       ORDER BY p.product_id`
    );

    const rawRows = Array.isArray(rows) ? rows : [];
    const baseUrl = `${req.protocol}://${req.get("host")}`;

    const productsMap = new Map<number, any>();
    for (const row of rawRows as any[]) {
      let imageUrl = row.image_url || "";
      if (imageUrl && !imageUrl.startsWith("http")) {
        imageUrl = imageUrl.replace(/^\.\.\//, "").replace(/^kepek\//, "");
        imageUrl = `${baseUrl}/kepek/${imageUrl}`;
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
        const product = productsMap.get(row.product_id);
        product.category_ids.push(row.category_id);
        product.category_names.push(row.category_name);
      }
    }

    const items = Array.from(productsMap.values());

    res.json({ items });

    await connection.end();
  } catch (error) {
    console.error("Get items error:", error);
    res.status(500).json({ success: false, message: "Internal server error", error: (error as any).message });
  }
};

export const getItemById = async (req: Request, res: Response): Promise<void> => {
  let connection: mysql.Connection | null = null;

  try {
    const idParam = req.params.productId;
    const productId = parseInt(String(idParam), 10);

    if (isNaN(productId)) {
      res.status(400).json({ success: false, message: "Érvénytelen azonosító" });
      return;
    }

    connection = await mysql.createConnection(config.database);

    const [rows]: any = await connection.query(
      "SELECT product_id, product_name, price, stock, image_url, description FROM products WHERE product_id = ?",
      [productId]
    );

    const items = Array.isArray(rows) ? rows : [];

    if (items.length === 0) {
      res.status(404).json({ success: false, message: "Termék nem található" });
      return;
    }

    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const item = items[0];
    
    let imageUrl = item?.image_url || "";
    
    if (imageUrl && !imageUrl.startsWith("http")) {
      imageUrl = imageUrl.replace(/^\.\.\//, "").replace(/^kepek\//, "");
      imageUrl = `${baseUrl}/kepek/${imageUrl}`;
    }

    res.json({ 
      success: true, 
      item: { ...item, image_url: imageUrl } 
    });

  } catch (error) {
    console.error("Hiba a lekérdezés során:", error);
    res.status(500).json({ success: false, message: "Szerveroldali hiba történt" });

  } finally {
    if (connection) {
      await connection.end();
    }
  }
};

export const addItem = async (req: Request, res: Response): Promise<void> => {
  let connection: mysql.Connection | null = null;
  try {
    connection = await mysql.createConnection(config.database);
    const { product_name, price, stock, category_ids } = req.body;
    const file = req.file;

    if (!product_name || price === undefined || stock === undefined || !file) {
      res.status(400).json({ success: false, message: "product_name, price, stock, and image file are required" });
      if (file) fs.unlinkSync(file.path);
      await connection.end();
      return;
    }

    const parsedPrice = Number(price);
    const parsedStock = Number(stock);

    if (!Number.isFinite(parsedPrice) || parsedPrice < 0 || !Number.isFinite(parsedStock) || parsedStock < 0) {
      res.status(400).json({ success: false, message: "price and stock must be non-negative numbers" });
      fs.unlinkSync(file.path);
      await connection.end();
      return;
    }

    let categoryIds: number[] = [];
    if (category_ids !== undefined) {
      if (typeof category_ids === "string") {
        categoryIds = category_ids.split(",").map((s: string) => parseInt(s.trim(), 10)).filter((n: number) => !isNaN(n));
      } else if (Array.isArray(category_ids)) {
        categoryIds = (category_ids as any[]).map((s) => parseInt(String(s).trim(), 10)).filter((n) => !isNaN(n));
      } else if (typeof category_ids === "number") {
        categoryIds = [category_ids as number];
      }

      if (category_ids !== undefined && categoryIds.length === 0) {
        res.status(400).json({ success: false, message: "Invalid category_ids" });
        fs.unlinkSync(file.path);
        await connection.end();
        return;
      }
    }

    await connection.beginTransaction();

    const [result] = await connection.query(
      "INSERT INTO products (product_name, price, stock, image_url) VALUES (?, ?, ?, ?)",
      [product_name, parsedPrice, parsedStock, ""]
    );

    const productId = (result as any).insertId;

    const ext = path.extname(file.originalname) || ".png";
    const kepekDir = path.resolve(__dirname, "..", "..", "kepek");
    const newFileName = `${productId}${ext}`;
    await fs.promises.copyFile(file.path, path.join(kepekDir, newFileName));
    await fs.promises.unlink(file.path);

    const imageUrl = `../kepek/${newFileName}`;
    await connection.query("UPDATE products SET image_url = ? WHERE product_id = ?", [imageUrl, productId]);

    if (categoryIds.length > 0) {
      const values = categoryIds.map(() => "(?, ?)").join(", ");
      const params: any[] = [];
      categoryIds.forEach((categoryId) => {
        params.push(categoryId, productId);
      });
      await connection.query(`INSERT INTO belongs (category_id, product_id) VALUES ${values}`, params);
    }

    await connection.commit();

    res.status(201).json({
      success: true,
      message: "Item added successfully",
      product_id: productId,
      image_url: imageUrl,
    });
  } catch (error) {
    if (connection) {
      await connection.rollback();
    }
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    console.error("Add item error:", error);
    res.status(500).json({ success: false, message: "Internal server error", error: (error as any).message });
  } finally {
    if (connection) {
      await connection.end();
    }
  }
};

export const updateItem = async (req: Request, res: Response): Promise<void> => {
  let connection: mysql.Connection | null = null;
  try {
    connection = await mysql.createConnection(config.database);
    const productId = Number(req.params.productId);
    const { product_name, price, stock, image_url, category_ids } = req.body;

    if (!Number.isFinite(productId) || productId <= 0) {
      res.status(400).json({ success: false, message: "Invalid productId" });
      return;
    }

    const updates: string[] = [];
    const params: any[] = [];

    if (product_name !== undefined) {
      updates.push("product_name = ?");
      params.push(product_name);
    }

    if (price !== undefined) {
      const parsedPrice = Number(price);
      if (!Number.isFinite(parsedPrice) || parsedPrice < 0) {
        res.status(400).json({ success: false, message: "price must be a non-negative number" });
        return;
      }
      updates.push("price = ?");
      params.push(parsedPrice);
    }

    if (stock !== undefined) {
      const parsedStock = Number(stock);
      if (!Number.isFinite(parsedStock) || parsedStock < 0) {
        res.status(400).json({ success: false, message: "stock must be a non-negative number" });
        return;
      }
      updates.push("stock = ?");
      params.push(parsedStock);
    }

    if (image_url !== undefined) {
      updates.push("image_url = ?");
      params.push(image_url);
    }

    let categoryIds: number[] | null = null;
    if (category_ids !== undefined) {
      categoryIds = [];
      if (typeof category_ids === "string") {
        categoryIds = category_ids.split(",").map((s: string) => parseInt(s.trim(), 10)).filter((n: number) => !isNaN(n));
      } else if (Array.isArray(category_ids)) {
        categoryIds = (category_ids as any[]).map((s) => parseInt(String(s).trim(), 10)).filter((n) => !isNaN(n));
      } else if (typeof category_ids === "number") {
        categoryIds = [category_ids as number];
      }

      const isEmptyArray = Array.isArray(category_ids) && category_ids.length === 0;
      if (categoryIds.length === 0 && !isEmptyArray) {
        res.status(400).json({ success: false, message: "Invalid category_ids" });
        return;
      }
    }

    if (updates.length === 0 && categoryIds === null) {
      res.status(400).json({ success: false, message: "No fields provided to update" });
      return;
    }

    await connection.beginTransaction();

    if (updates.length > 0) {
      params.push(productId);
      const [updateResult] = await connection.query(
        `UPDATE products SET ${updates.join(", ")} WHERE product_id = ?`,
        params
      );

      if ((updateResult as any).affectedRows === 0) {
        await connection.rollback();
        res.status(404).json({ success: false, message: "Item not found" });
        return;
      }
    } else {
      const [existingRows] = await connection.query(
        "SELECT product_id FROM products WHERE product_id = ?",
        [productId]
      );
      if (!Array.isArray(existingRows) || existingRows.length === 0) {
        await connection.rollback();
        res.status(404).json({ success: false, message: "Item not found" });
        return;
      }
    }

    if (categoryIds !== null) {
      await connection.query("DELETE FROM belongs WHERE product_id = ?", [productId]);
      if (categoryIds.length > 0) {
        const values = categoryIds.map(() => "(?, ?)").join(", ");
        const categoryParams: any[] = [];
        categoryIds.forEach((categoryId) => {
          categoryParams.push(categoryId, productId);
        });
        await connection.query(`INSERT INTO belongs (category_id, product_id) VALUES ${values}`, categoryParams);
      }
    }

    await connection.commit();

    const [itemRows] = await connection.query(
      "SELECT product_id, product_name, price, stock, image_url FROM products WHERE product_id = ?",
      [productId]
    );
    const item = Array.isArray(itemRows) && itemRows.length > 0 ? itemRows[0] : null;

    const [categoryRows] = await connection.query(
      "SELECT category_id FROM belongs WHERE product_id = ?",
      [productId]
    );
    const categoryIdsResult = Array.isArray(categoryRows)
      ? categoryRows.map((row: any) => row.category_id)
      : [];

    res.json({
      success: true,
      message: "Item updated successfully",
      item: item ? { ...item, category_ids: categoryIdsResult } : null,
    });
  } catch (error) {
    if (connection) {
      await connection.rollback();
    }
    console.error("Update item error:", error);
    res.status(500).json({ success: false, message: "Internal server error", error: (error as any).message });
  } finally {
    if (connection) {
      await connection.end();
    }
  }
};

export const deleteItem = async (req: Request, res: Response): Promise<void> => {
  let connection: mysql.Connection | null = null;
  try {
    connection = await mysql.createConnection(config.database);
    const productId = Number(req.params.productId);

    if (!Number.isFinite(productId) || productId <= 0) {
      res.status(400).json({ success: false, message: "Invalid productId" });
      return;
    }

    await connection.beginTransaction();

    const [existingRows] = await connection.query(
      "SELECT product_id FROM products WHERE product_id = ?",
      [productId]
    );

    if (!Array.isArray(existingRows) || existingRows.length === 0) {
      await connection.rollback();
      res.status(404).json({ success: false, message: "Item not found" });
      return;
    }

    await connection.query("DELETE FROM belongs WHERE product_id = ?", [productId]);

    await connection.query(
      "DELETE FROM products WHERE product_id = ?",
      [productId]
    );

    await connection.commit();

    res.json({
      success: true,
      message: "Item deleted successfully",
      product_id: productId,
    });
  } catch (error) {
    if (connection) {
      await connection.rollback();
    }
    console.error("Delete item error:", error);
    res.status(500).json({ success: false, message: "Internal server error", error: (error as any).message });
  } finally {
    if (connection) {
      await connection.end();
    }
  }
};

export const getCategories = async (_req: Request, res: Response): Promise<void> => {
  try {
    const connection = await mysql.createConnection(config.database);

    const [rows] = await connection.query(
      "SELECT category_id, name FROM categories ORDER BY name ASC"
    );

    const categories = Array.isArray(rows) ? rows : [];

    res.json(categories);

    await connection.end();
  } catch (error) {
    console.error("Get categories error:", error);
    res.status(500).json({ message: "Internal server error", error: (error as any).message });
  }
};

export const addCategory = async (req: Request, res: Response): Promise<void> => {
  let connection: mysql.Connection | null = null;
  try {
    connection = await mysql.createConnection(config.database);
    const { name } = req.body;

    if (!name || typeof name !== "string" || name.trim().length === 0) {
      res.status(400).json({ success: false, message: "Category name is required" });
      return;
    }

    const trimmedName = name.trim();

    const [existingCategories] = await connection.query(
      "SELECT category_id FROM categories WHERE name = ?",
      [trimmedName]
    );

    if (Array.isArray(existingCategories) && existingCategories.length > 0) {
      res.status(409).json({ success: false, message: "Category already exists" });
      return;
    }

    const [result] = await connection.query(
      "INSERT INTO categories (name) VALUES (?)",
      [trimmedName]
    );

    const categoryId = (result as any).insertId;

    res.status(201).json({
      success: true,
      message: "Category added successfully",
      category_id: categoryId,
      name: trimmedName,
    });
  } catch (error) {
    console.error("Add category error:", error);
    res.status(500).json({ success: false, message: "Internal server error", error: (error as any).message });
  } finally {
    if (connection) {
      await connection.end();
    }
  }
};

export const deleteCategory = async (req: Request, res: Response): Promise<void> => {
  let connection: mysql.Connection | null = null;
  try {
    connection = await mysql.createConnection(config.database);
    const categoryId = Number(req.params.categoryId);

    if (!Number.isFinite(categoryId) || categoryId <= 0) {
      res.status(400).json({ success: false, message: "Invalid categoryId" });
      return;
    }

    await connection.beginTransaction();

    const [existingRows] = await connection.query(
      "SELECT category_id FROM categories WHERE category_id = ?",
      [categoryId]
    );

    if (!Array.isArray(existingRows) || existingRows.length === 0) {
      await connection.rollback();
      res.status(404).json({ success: false, message: "Category not found" });
      return;
    }

    await connection.query("DELETE FROM belongs WHERE category_id = ?", [categoryId]);

    await connection.query(
      "DELETE FROM categories WHERE category_id = ?",
      [categoryId]
    );

    await connection.commit();

    res.json({
      success: true,
      message: "Category deleted successfully",
      category_id: categoryId,
    });
  } catch (error) {
    if (connection) {
      await connection.rollback();
    }
    console.error("Delete category error:", error);
    res.status(500).json({ success: false, message: "Internal server error", error: (error as any).message });
  } finally {
    if (connection) {
      await connection.end();
    }
  }
};


export const getUserRole = async (req: Request, res: Response): Promise<void> => {
  try {
    const nev = req.params.username
    const connection = await mysql.createConnection(config.database);
    const [role] : any = await connection.query("SELECT users.role FROM users WHERE users.username = ?", [nev])
    res.send(role[0])
  }
  catch(e){
    console.error(e)
  }
};

export const createOrder = async (req: Request, res: Response): Promise<void> => {
    let connection: mysql.Connection | null = null;
    try {
      connection = await mysql.createConnection(config.database);
      const { userId } = req.body;

      const [result] = await connection.query(
        "INSERT INTO orders (user_id, status) VALUES (?, ?)",
        [userId, 'in_progress']
      );
      const orderId = (result as any).insertId;

      res.status(201).json({ success: true, message: "Order created successfully", orderId });
    } catch (error) {
      console.error("Create order error:", error);
      res.status(500).json({ success: false, message: "Internal server error", error: (error as any).message });
    } finally {
      if (connection) {
        await connection.end();
      }
    }
  }

  export const addToCart = async (req: any, res: Response): Promise<void> => {
    let connection: mysql.Connection | null = null;
    try {
        connection = await mysql.createConnection(config.database);
        const { productId, quantity } = req.body;
        const userId = req.user?.user_id || req.user?.id;

        const [productRow]: any = await connection.query("SELECT price FROM products WHERE product_id = ?", [productId]);
        if (productRow.length === 0) {
            res.status(404).json({ success: false, message: "Termék nem található" });
            return;
        }
        const price = productRow[0].price;
        const subtotal = price * quantity;
        const [orders]: any = await connection.query(
            "SELECT order_id FROM orders WHERE user_id = ? AND status = 'in_progress' LIMIT 1", 
            [userId]
        );
        
        let orderId;
        if (orders.length > 0) {
            orderId = orders[0].order_id;
        } else {
            const [newOrder]: any = await connection.query(
                "INSERT INTO orders (user_id, status, total_price, created_at) VALUES (?, 'in_progress', 0, ?)",
                [userId, new Date().toISOString().slice(0, 10)]
            );
            orderId = newOrder.insertId;
        }

        await connection.query(
            `INSERT INTO order_items (order_id, product_id, quantity, subtotal) 
             VALUES (?, ?, ?, ?) 
             ON DUPLICATE KEY UPDATE 
                quantity = quantity + VALUES(quantity), 
                subtotal = subtotal + VALUES(subtotal)`,
            [orderId, productId, quantity, subtotal]
        );

        res.json({ success: true, message: "A kosár frissítve!" });
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ success: false, error: error.message });
    } finally {
        if (connection) await connection.end();
    }
};

  export const updateCartItem = async (req: Request, res: Response): Promise<void> => {
    let connection: mysql.Connection | null = null;
    try {
      connection = await mysql.createConnection(config.database);
      const { orderId, productId, quantity } = req.body;

      if (!orderId || !productId || quantity === undefined) {
        res.status(400).json({ success: false, message: "Order ID, product ID, and quantity are required" });
        return;
      }

      const parsedQuantity = Number(quantity);
      if (!Number.isFinite(parsedQuantity) || parsedQuantity <= 0) {
        res.status(400).json({ success: false, message: "Quantity must be a positive number" });
        return;
      }

      const [result] = await connection.query(
        "UPDATE order_items SET quantity = ? WHERE order_id = ? AND product_id = ?",
        [parsedQuantity, orderId, productId]
      );

      if ((result as any).affectedRows === 0) {
        res.status(404).json({ success: false, message: "Cart item not found" });
        return;
      }

      res.json({ success: true, message: "Cart item updated successfully" });
    } catch (error) {
      console.error("Update cart item error:", error);
      res.status(500).json({ success: false, message: "Internal server error", error: (error as any).message });
    } finally {
      if (connection) {
        await connection.end();
      }
    }
  };

  export const deleteCartItem = async (req: any, res: Response): Promise<void> => {
    let connection: mysql.Connection | null = null;
    try {
        connection = await mysql.createConnection(config.database);
        const { productId } = req.body;
        const userId = req.user?.user_id || req.user?.id;

        if (!productId || !userId) {
            res.status(400).json({ success: false, message: "Hiányzó adatok" });
            return;
        }

        const [orders]: any = await connection.query(
            "SELECT order_id FROM orders WHERE user_id = ? AND status = 'in_progress' LIMIT 1",
            [userId]
        );

        if (orders.length === 0) {
            res.status(404).json({ success: false, message: "Nincs aktív kosár" });
            return;
        }

        const orderId = orders[0].order_id;

        const [result]: any = await connection.query(
            "DELETE FROM order_items WHERE order_id = ? AND product_id = ?",
            [orderId, productId]
        );

        if (result.affectedRows === 0) {
            res.status(404).json({ success: false, message: "A termék nincs a kosárban" });
            return;
        }

        res.json({ success: true, message: "Termék eltávolítva a kosárból" });
    } catch (error: any) {
        console.error("Delete error:", error);
        res.status(500).json({ success: false, error: error.message });
    } finally {
        if (connection) await connection.end();
    }
};

  export const updateOrderStatus = async (req: Request, res: Response): Promise<void> => {
    let connection: mysql.Connection | null = null;
    try {
      connection = await mysql.createConnection(config.database);
      const { orderId, status } = req.body;

      if (!orderId || !status || typeof status !== "string") {
        res.status(400).json({ success: false, message: "Order ID and status are required" });
        return;
      }

      const trimmedStatus = status.trim();
      if (trimmedStatus.length === 0) {
        res.status(400).json({ success: false, message: "Status must be a non-empty string" });
        return;
      }

      const [result] = await connection.query(
        "UPDATE orders SET status = ? WHERE order_id = ?",
        [trimmedStatus, orderId]
      );

      if ((result as any).affectedRows === 0) {
        res.status(404).json({ success: false, message: "Order not found" });
        return;
      }

      res.json({ success: true, message: "Order status updated successfully" });
    } catch (error) {
      console.error("Update order status error:", error);
      res.status(500).json({ success: false, message: "Internal server error", error: (error as any).message });
    } finally {
      if (connection) {
        await connection.end();
      }
    }
  };

  export const getCart = async (req: any, res: Response): Promise<void> => {
    let connection: mysql.Connection | null = null;
    try {
        connection = await mysql.createConnection(config.database);

        const userId = req.user?.user_id || req.user?.id;

        if (!userId) {
            res.status(401).json({ success: false, message: "Nincs bejelentkezve felhasználó" });
            return;
        }

        const [orders]: any = await connection.query(
            "SELECT order_id FROM orders WHERE user_id = ? AND status = 'in_progress' LIMIT 1",
            [userId]
        );

        if (orders.length === 0) {
            res.json({ success: true, items: [] });
            return;
        }

        const orderId = orders[0].order_id;

        const [items]: any = await connection.query(
            `SELECT p.product_id, p.product_name, p.price, p.description, p.image_url, oi.quantity 
             FROM order_items oi 
             JOIN products p ON oi.product_id = p.product_id 
             WHERE oi.order_id = ?`,
            [orderId]
        );

        const baseUrl = `${req.protocol}://${req.get("host")}`;
        const normalizedItems = items.map((item: any) => {
            let imageUrl = item?.image_url || "";
            if (imageUrl && !imageUrl.startsWith("http")) {
                imageUrl = imageUrl.replace(/^\.\.\//, "").replace(/^kepek\//, "");
                imageUrl = `${baseUrl}/kepek/${imageUrl}`;
            }
            return { ...item, image_url: imageUrl };
        });

        res.json({ success: true, items: normalizedItems });

    } catch (error: any) {
        console.error("Hiba a getCart-ban:", error.message);
        res.status(500).json({ success: false, error: error.message });
    } finally {
        if (connection) await connection.end();
    }
};

export const getAllOrders = async (_req: Request, res: Response): Promise<void> => {
    let connection: mysql.Connection | null = null;
    try {
        connection = await mysql.createConnection(config.database);

        const [rows]: any = await connection.query(
            `SELECT o.order_id, o.user_id, u.username, o.status, o.created_at,
                    COALESCE(SUM(oi.subtotal), 0) AS total_price
             FROM orders o
             JOIN users u ON o.user_id = u.user_id
             LEFT JOIN order_items oi ON o.order_id = oi.order_id
             GROUP BY o.order_id
             ORDER BY o.order_id`
        );

        res.json({ success: true, orders: rows });
    } catch (error: any) {
        console.error("Get all orders error:", error.message);
        res.status(500).json({ success: false, message: "Internal server error", error: error.message });
    } finally {
        if (connection) await connection.end();
    }
};

export const getOrdersByUser = async (req: any, res: Response): Promise<void> => {
    let connection: mysql.Connection | null = null;
    try {
        connection = await mysql.createConnection(config.database);

        const userId = req.user?.user_id || req.user?.id;

        if (!userId) {
            res.status(401).json({ success: false, message: "Nincs bejelentkezve felhasználó" });
            return;
        }

        const [rows]: any = await connection.query(
            `SELECT o.order_id, o.user_id, u.username, o.status, o.created_at,
                    COALESCE(SUM(oi.subtotal), 0) AS total_price
             FROM orders o
             JOIN users u ON o.user_id = u.user_id
             LEFT JOIN order_items oi ON o.order_id = oi.order_id
             WHERE o.user_id = ?
             GROUP BY o.order_id
             ORDER BY o.order_id`,
            [userId]
        );

        res.json({ success: true, orders: rows });
    } catch (error: any) {
        console.error("Get orders by user error:", error.message);
        res.status(500).json({ success: false, message: "Internal server error", error: error.message });
    } finally {
        if (connection) await connection.end();
    }
};