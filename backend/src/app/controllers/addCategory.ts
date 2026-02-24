import { Request, Response } from "express";
import mysql from "mysql2/promise";
import config from "../../config/config";

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
