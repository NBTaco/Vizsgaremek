import { Request, Response } from "express";
import mysql from "mysql2/promise";
import config from "../../config/config";

export const getAllOrders = async (_req: Request, res: Response): Promise<void> => {
  let connection: mysql.Connection | null = null;
  try {
    connection = await mysql.createConnection(config.database);

    const [orderRows]: any = await connection.query(
      `SELECT o.order_id, o.user_id, u.username, o.status, o.created_at,
              COALESCE(SUM(oi.subtotal), 0) AS total_price,
              o.billing_name, o.billing_phone, o.billing_country,
              o.billing_zip, o.billing_city, o.billing_address
       FROM orders o
       JOIN users u ON o.user_id = u.user_id
       LEFT JOIN order_items oi ON o.order_id = oi.order_id
       GROUP BY o.order_id
       ORDER BY o.order_id`
    );

    const orderIds = orderRows.map((o: any) => o.order_id);

    let itemsByOrder: Record<number, any[]> = {};
    if (orderIds.length > 0) {
      const [itemRows]: any = await connection.query(
        `SELECT oi.order_id, oi.product_id, p.product_name, p.price, oi.quantity, oi.subtotal
         FROM order_items oi
         JOIN products p ON oi.product_id = p.product_id
         WHERE oi.order_id IN (${orderIds.map(() => "?").join(", ")})`,
        orderIds
      );

      for (const item of itemRows) {
        if (!itemsByOrder[item.order_id]) {
          itemsByOrder[item.order_id] = [];
        }
        itemsByOrder[item.order_id].push(item);
      }
    }

    const orders = orderRows.map((order: any) => ({
      ...order,
      items: itemsByOrder[order.order_id] || [],
    }));

    res.json({ success: true, orders });
  } catch (error: any) {
    console.error("Get all orders error:", error.message);
    res.status(500).json({ success: false, message: "Internal server error", error: error.message });
  } finally {
    if (connection) await connection.end();
  }
};