import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mysql from "mysql2/promise";
import config from "../../config/config";

const SALT_ROUNDS = 10;

type UserRow = {
  user_id: number;
  email: string;
  username: string;
  role?: string;
  password_hash?: string;
};

export const registerUser = async (req: Request, res: Response): Promise<void> => {
  let connection: mysql.Connection | null = null;
  try {
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

    connection = await mysql.createConnection(config.database);

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
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: (error as any).message,
    });
  } finally {
    if (connection) await connection.end();
  }
};
