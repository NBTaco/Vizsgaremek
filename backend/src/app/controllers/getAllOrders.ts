import { Request, Response } from "express";
import mysql from "mysql2/promise";
import config from "../../config/config";

export const getAllOrders = async (_req: Request, res: Response): Promise<void> => {
  let connection: mysql.Connection | null = null;
  try {
    connection = await mysql.createConnection(config.database);

    const [rows]: any = await connection.query(
      `SELECT o.order_id, o.user_id, u.username, o.status, o.created_at,
              COALESCE(SUM(oi.subtotal), 0) AS total_price
       FROM orders o
       JOIN users u ON o.user_id = u.user_id
       LEFT JOIN order_items oi ON o.order_id = oi.order_id
       GROUP BY o.order_id
       ORDER BY o.order_id`
    );

    res.json({ success: true, orders: rows });
  } catch (error: any) {
    console.error("Get all orders error:", error.message);
    res.status(500).json({ success: false, message: "Internal server error", error: error.message });
  } finally {
    if (connection) await connection.end();
  }
};
