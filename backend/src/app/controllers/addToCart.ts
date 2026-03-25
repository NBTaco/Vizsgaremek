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

    const [productRow]: any = await connection.query(
      "SELECT price, stock FROM products WHERE product_id = ?",
      [parsedProductId]
    );

    if (productRow.length === 0) {
      res.status(404).json({ success: false, message: "Product not found" });
      return;
    }

    const { price, stock } = productRow[0];

    const [orders]: any = await connection.query(
      "SELECT order_id FROM orders WHERE user_id = ? AND status = 'in_progress' LIMIT 1",
      [userId]
    );

    let orderId: number | null = null;
    let alreadyInCart = 0;

    if (orders.length > 0) {
      orderId = orders[0].order_id;
      const [cartRow]: any = await connection.query(
        "SELECT quantity FROM order_items WHERE order_id = ? AND product_id = ?",
        [orderId, parsedProductId]
      );
      if (cartRow.length > 0) {
        alreadyInCart = cartRow[0].quantity;
      }
    }

    const totalRequested = alreadyInCart + parsedQuantity;

    if (totalRequested > stock) {
      const canAdd = stock - alreadyInCart;

      if (canAdd <= 0) {
        res.status(400).json({
          success: false,
          message: `This product is already at the maximum quantity in the cart (${stock} pcs)`,
          availableStock: stock,
        });
      } else {
        res.status(400).json({
          success: false,
          message: `Only ${canAdd} more item(s) can be added to the cart (stock: ${stock} pcs)`,
          availableStock: canAdd,
        });
      }
      return;
    }

    const subtotal = price * parsedQuantity;

    if (orderId === null) {
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

    res.json({ success: true, message: "Cart updated successfully!" });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  } finally {
    if (connection) await connection.end();
  }
};