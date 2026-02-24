import { Request, Response } from "express";
import mysql from "mysql2/promise";
import config from "../../config/config";

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
