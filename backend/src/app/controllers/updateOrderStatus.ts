import { Request, Response } from "express";
import mysql from "mysql2/promise";
import config from "../../config/config";

export const updateOrderStatus = async (req: Request, res: Response): Promise<void> => {
  let connection: mysql.Connection | null = null;
  try {
    connection = await mysql.createConnection(config.database);
    const { orderId, status } = req.body;

    if (!orderId || !status || typeof status !== "string") {
      res.status(400).json({ success: false, message: "Order ID and status are required" });
      return;
    }

    const trimmedStatus = status.trim();
    if (trimmedStatus.length === 0) {
      res.status(400).json({ success: false, message: "Status must be a non-empty string" });
      return;
    }

    const [result] = await connection.query(
      "UPDATE orders SET status = ? WHERE order_id = ?",
      [trimmedStatus, orderId]
    );

    if ((result as any).affectedRows === 0) {
      res.status(404).json({ success: false, message: "Order not found" });
      return;
    }

    res.json({ success: true, message: "Order status updated successfully" });
  } catch (error) {
    console.error("Update order status error:", error);
    res.status(500).json({ success: false, message: "Internal server error", error: (error as any).message });
  } finally {
    if (connection) {
      await connection.end();
    }
  }
};
