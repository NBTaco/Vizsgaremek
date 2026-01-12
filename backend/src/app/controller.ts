import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mysql from "mysql2/promise";
import config from "../config/config";

const SALT_ROUNDS = 10;

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

    const [users] = await connection.query("SELECT user_id, email, username FROM users WHERE email = ?", [email]);
    const user = Array.isArray(users) && users.length > 0 ? users[0] : null;

    const token = jwt.sign(
      { id: (result as any).insertId, email },
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

    const [users] = await connection.query("SELECT user_id, email, password_hash, username FROM users WHERE email = ?", [
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
      { id: user.user_id, email: user.email },
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


export const getItemsByCategories = async (req: Request, res: Response): Promise<void> => {
  try {
    const connection = await mysql.createConnection(config.database);

    const categoryIdParam = req.query?.category_ids || req.body?.category_ids;
    let categoryIds: number[] = [];

    if (categoryIdParam) {
      if (typeof categoryIdParam === "string") {
        categoryIds = categoryIdParam.split(",").map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n));
      } else if (Array.isArray(categoryIdParam)) {
        categoryIds = (categoryIdParam as any[]).map(s => parseInt(String(s).trim(), 10)).filter(n => !isNaN(n));
      } else if (typeof categoryIdParam === "number") {
        categoryIds = [categoryIdParam as number];
      }

      if (categoryIdParam && categoryIds.length === 0) {
        res.status(400).json({ success: false, message: "Invalid category_ids parameter" });
        await connection.end();
        return;
      }
    }

    const categoryNameParam = req.query?.category_names || req.body?.category_names || req.query?.category || req.body?.category;
    let categoryNames: string[] = [];

    if (categoryNameParam) {
      if (typeof categoryNameParam === "string") {
        categoryNames = categoryNameParam.split(",").map(s => s.trim()).filter(s => s.length > 0);
      } else if (Array.isArray(categoryNameParam)) {
        categoryNames = (categoryNameParam as any[]).map(s => String(s).trim()).filter(s => s.length > 0);
      } else {
        categoryNames = [String(categoryNameParam).trim()].filter(s => s.length > 0);
      }

      if (categoryNameParam && categoryNames.length === 0) {
        res.status(400).json({ success: false, message: "Invalid category_names parameter" });
        await connection.end();
        return;
      }
    }

    let query = "SELECT p.product_id, p.product_name, p.price, p.stock, p.image_url FROM products p";
    const whereClauses: string[] = [];
    const params: any[] = [];

    if (categoryIds.length > 0 || categoryNames.length > 0) {
      query += " JOIN belongs b ON p.product_id = b.product_id JOIN categories c ON b.category_id = c.category_id";

      if (categoryIds.length > 0) {
        whereClauses.push("b.category_id IN (" + categoryIds.map(() => "?").join(",") + ")");
        params.push(...categoryIds);
      }

      if (categoryNames.length > 0) {
        whereClauses.push("c.name IN (" + categoryNames.map(() => "?").join(",") + ")");
        params.push(...categoryNames);
      }

      query += " WHERE (" + whereClauses.join(" OR ") + ") GROUP BY p.product_id";
    }

    const [rows] = await connection.query(query, params);
    const items = Array.isArray(rows) ? rows : [];

    res.json({ success: true, items });

    await connection.end();
  } catch (error) {
    console.error("Get items error:", error);
    res.status(500).json({ success: false, message: "Internal server error", error: (error as any).message });
  }
};

export const getCategories = async (_req: Request, res: Response): Promise<void> => {
  try {
    const connection = await mysql.createConnection(config.database);

    const [rows] = await connection.query(
      "SELECT category_id, name FROM categories ORDER BY name ASC"
    );

    const categories = Array.isArray(rows) ? rows : [];

    res.json({ success: true, categories });

    await connection.end();
  } catch (error) {
    console.error("Get categories error:", error);
    res.status(500).json({ success: false, message: "Internal server error", error: (error as any).message });
  }
};