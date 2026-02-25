import { Response } from "express";
import mysql from "mysql2/promise";
import config from "../../config/config";

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

    await connection.query(
      `UPDATE orders SET total_price = (
         SELECT COALESCE(SUM(subtotal), 0) FROM order_items WHERE order_id = ?
       ) WHERE order_id = ?`,
      [orderId, orderId]
    );

    res.json({ success: true, message: "Termék eltávolítva a kosárból" });
  } catch (error: any) {
    console.error("Delete error:", error);
    res.status(500).json({ success: false, error: error.message });
  } finally {
    if (connection) await connection.end();
  }
};
