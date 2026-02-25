import { Response } from "express";
import mysql from "mysql2/promise";
import config from "../../config/config";

export const placeOrder = async (req: any, res: Response): Promise<void> => {
  let connection: mysql.Connection | null = null;
  try {
    connection = await mysql.createConnection(config.database);
    const userId = req.user?.user_id || req.user?.id;

    if (!userId) {
      res.status(401).json({ success: false, message: "User not authenticated" });
      return;
    }

    const { orderId, billing_name, billing_phone, billing_country, billing_zip, billing_city, billing_address } = req.body;

    const parsedOrderId = Number(orderId);
    if (!Number.isFinite(parsedOrderId) || parsedOrderId <= 0 || !Number.isInteger(parsedOrderId)) {
      res.status(400).json({ success: false, message: "Order ID must be a positive integer" });
      return;
    }

    if (typeof billing_name !== "string" || typeof billing_phone !== "string" ||
        typeof billing_country !== "string" || typeof billing_zip !== "string" ||
        typeof billing_city !== "string" || typeof billing_address !== "string") {
      res.status(400).json({ success: false, message: "All billing fields must be strings" });
      return;
    }

    if (billing_name.trim().length === 0 || billing_phone.trim().length === 0 ||
        billing_country.trim().length === 0 || billing_zip.trim().length === 0 ||
        billing_city.trim().length === 0 || billing_address.trim().length === 0) {
      res.status(400).json({ success: false, message: "All billing fields are required" });
      return;
    }

    // Verify the order belongs to the user and is currently in_progress
    const [orders]: any = await connection.query(
      "SELECT order_id, status FROM orders WHERE order_id = ? AND user_id = ?",
      [parsedOrderId, userId]
    );

    if (orders.length === 0) {
      res.status(404).json({ success: false, message: "Order not found" });
      return;
    }

    if (orders[0].status !== "in_progress") {
      res.status(400).json({ success: false, message: "Only in-progress orders can be placed" });
      return;
    }

    await connection.query(
      `UPDATE orders SET status = 'ordered',
        billing_name = ?, billing_phone = ?, billing_country = ?,
        billing_zip = ?, billing_city = ?, billing_address = ?
       WHERE order_id = ? AND user_id = ?`,
      [billing_name.trim(), billing_phone.trim(), billing_country.trim(),
       billing_zip.trim(), billing_city.trim(), billing_address.trim(),
       parsedOrderId, userId]
    );

    res.json({ success: true, message: "Order placed successfully" });
  } catch (error: any) {
    console.error("Place order error:", error);
    res.status(500).json({ success: false, message: "Internal server error", error: error.message });
  } finally {
    if (connection) await connection.end();
  }
};
