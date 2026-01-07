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
    const [existingUser] = await connection.query("SELECT email FROM users WHERE email = ?", [email]);
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

export const userSettings = async (req: Request, res: Response) => {
  
}