import { Request, Response } from "express";
import mysql from "mysql2/promise";
import config from "../../config/config";

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
