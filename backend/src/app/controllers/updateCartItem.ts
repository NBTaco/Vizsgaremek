import { Response } from "express";
import mysql from "mysql2/promise";
import config from "../../config/config";

export const updateCartItem = async (req: any, res: Response): Promise<void> => {
  let connection: mysql.Connection | null = null;
  try {
    connection = await mysql.createConnection(config.database);
    const { productId, quantity } = req.body;
    const userId = req.user?.user_id || req.user?.id;

    if (!userId) {
      res.status(401).json({ success: false, message: "User not authenticated" });
      return;
    }

    const parsedProductId = Number(productId);
    if (!Number.isFinite(parsedProductId) || parsedProductId <= 0 || !Number.isInteger(parsedProductId)) {
      res.status(400).json({ success: false, message: "Product ID must be a positive integer" });
      return;
    }

    const parsedQuantity = Number(quantity);
    if (!Number.isFinite(parsedQuantity) || parsedQuantity <= 0 || !Number.isInteger(parsedQuantity)) {
      res.status(400).json({ success: false, message: "Quantity must be a positive integer" });
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

    const [priceRow]: any = await connection.query(
      "SELECT price FROM products WHERE product_id = ?",
      [parsedProductId]
    );

    if (priceRow.length === 0) {
      res.status(404).json({ success: false, message: "Product not found" });
      return;
    }

    const newSubtotal = priceRow[0].price * parsedQuantity;

    const [result] = await connection.query(
      "UPDATE order_items SET quantity = ?, subtotal = ? WHERE order_id = ? AND product_id = ?",
      [parsedQuantity, newSubtotal, orderId, parsedProductId]
    );

    if ((result as any).affectedRows === 0) {
      res.status(404).json({ success: false, message: "Cart item not found" });
      return;
    }

    await connection.query(
      `UPDATE orders SET total_price = (
         SELECT COALESCE(SUM(subtotal), 0) FROM order_items WHERE order_id = ?
       ) WHERE order_id = ?`,
      [orderId, orderId]
    );

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
