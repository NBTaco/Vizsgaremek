import { Response } from "express";
import mysql from "mysql2/promise";
import config from "../../config/config";
import { normalizeImageUrl } from "./helpers";

export const getCart = async (req: any, res: Response): Promise<void> => {
  let connection: mysql.Connection | null = null;
  try {
    connection = await mysql.createConnection(config.database);

    const userId = req.user?.user_id || req.user?.id;

    if (!userId) {
      res.status(401).json({ success: false, message: "Nincs bejelentkezve felhasználó" });
      return;
    }

    const [orders]: any = await connection.query(
      "SELECT order_id FROM orders WHERE user_id = ? AND status = 'in_progress' LIMIT 1",
      [userId]
    );

    if (orders.length === 0) {
      res.json({ success: true, items: [] });
      return;
    }

    const orderId = orders[0].order_id;

    const [items]: any = await connection.query(
      `SELECT p.product_id, p.product_name, p.price, p.description, p.image_url, oi.quantity 
       FROM order_items oi 
       JOIN products p ON oi.product_id = p.product_id 
       WHERE oi.order_id = ?`,
      [orderId]
    );

    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const normalizedItems = items.map((item: any) => ({
      ...item,
      image_url: normalizeImageUrl(item?.image_url, baseUrl),
    }));

    res.json({ success: true, items: normalizedItems });

  } catch (error: any) {
    console.error("Hiba a getCart-ban:", error.message);
    res.status(500).json({ success: false, error: error.message });
  } finally {
    if (connection) await connection.end();
  }
};
