import { Response } from "express";
import mysql from "mysql2/promise";
import config from "../../config/config";

export const addToCart = async (req: any, res: Response): Promise<void> => {
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
    const parsedQuantity = Number(quantity);

    if (!Number.isFinite(parsedProductId) || parsedProductId <= 0 || !Number.isInteger(parsedProductId)) {
      res.status(400).json({ success: false, message: "Product ID must be a positive integer" });
      return;
    }

    if (!Number.isFinite(parsedQuantity) || parsedQuantity <= 0 || !Number.isInteger(parsedQuantity)) {
      res.status(400).json({ success: false, message: "Quantity must be a positive integer" });
      return;
    }

    const [productRow]: any = await connection.query("SELECT price FROM products WHERE product_id = ?", [parsedProductId]);
    if (productRow.length === 0) {
      res.status(404).json({ success: false, message: "Termék nem található" });
      return;
    }
    const price = productRow[0].price;
    const subtotal = price * parsedQuantity;
    const [orders]: any = await connection.query(
      "SELECT order_id FROM orders WHERE user_id = ? AND status = 'in_progress' LIMIT 1",
      [userId]
    );

    let orderId;
    if (orders.length > 0) {
      orderId = orders[0].order_id;
    } else {
      const [newOrder]: any = await connection.query(
        `INSERT INTO orders (user_id, status, total_price, created_at,
         billing_name, billing_phone, billing_country, billing_zip, billing_city, billing_address)
         VALUES (?, 'in_progress', 0, ?, '', '', '', '', '', '')`,
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
      [orderId, parsedProductId, parsedQuantity, subtotal]
    );

    await connection.query(
      `UPDATE orders SET total_price = (
         SELECT COALESCE(SUM(subtotal), 0) FROM order_items WHERE order_id = ?
       ) WHERE order_id = ?`,
      [orderId, orderId]
    );

    res.json({ success: true, message: "A kosár frissítve!" });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  } finally {
    if (connection) await connection.end();
  }
};
