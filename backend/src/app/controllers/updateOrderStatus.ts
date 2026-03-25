import { Request, Response } from "express";
import mysql from "mysql2/promise";
import config from "../../config/config";

export const updateOrderStatus = async (req: Request, res: Response): Promise<void> => {
  let connection: mysql.Connection | null = null;
  try {
    connection = await mysql.createConnection(config.database);
    const { orderId, status, billing_name, billing_phone, billing_country, billing_zip, billing_city, billing_address } = req.body;

    const parsedOrderId = Number(orderId);
    if (!Number.isFinite(parsedOrderId) || parsedOrderId <= 0 || !Number.isInteger(parsedOrderId)) {
      res.status(400).json({ success: false, message: "Order ID must be a positive integer" });
      return;
    }

    if (!status || typeof status !== "string") {
      res.status(400).json({ success: false, message: "Status is required and must be a string" });
      return;
    }

    const trimmedStatus = status.trim();
    const validStatuses = ["in_progress", "ordered", "shipped", "delivered", "cancelled"];
    if (!validStatuses.includes(trimmedStatus)) {
      res.status(400).json({ success: false, message: `Status must be one of: ${validStatuses.join(", ")}` });
      return;
    }

    if (billing_name !== undefined) {
      if (typeof billing_name !== "string" || typeof billing_phone !== "string" ||
          typeof billing_country !== "string" || typeof billing_zip !== "string" ||
          typeof billing_city !== "string" || typeof billing_address !== "string") {
        res.status(400).json({ success: false, message: "All billing fields must be strings" });
        return;
      }

      if (billing_name.trim().length === 0 || billing_phone.trim().length === 0 ||
          billing_country.trim().length === 0 || billing_zip.trim().length === 0 ||
          billing_city.trim().length === 0 || billing_address.trim().length === 0) {
        res.status(400).json({ success: false, message: "All billing fields are required when placing an order" });
        return;
      }
    }

    if (trimmedStatus === "cancelled") {
      const [currentOrder]: any = await connection.query(
        "SELECT status FROM orders WHERE order_id = ?",
        [parsedOrderId]
      );

      if (currentOrder.length === 0) {
        res.status(404).json({ success: false, message: "Order not found" });
        return;
      }
      const previousStatus = currentOrder[0].status;

      if (previousStatus !== "cancelled" && previousStatus !== "in_progress") {
        const [orderItems]: any = await connection.query(
          "SELECT product_id, quantity FROM order_items WHERE order_id = ?",
          [parsedOrderId]
        );

        for (const item of orderItems) {
          await connection.query(
            "UPDATE products SET stock = stock + ? WHERE product_id = ?",
            [item.quantity, item.product_id]
          );
        }
      }
    }

    let query = "UPDATE orders SET status = ?";
    const params: any[] = [trimmedStatus];

    if (billing_name !== undefined) {
      query += ", billing_name = ?, billing_phone = ?, billing_country = ?, billing_zip = ?, billing_city = ?, billing_address = ?";
      params.push(billing_name, billing_phone, billing_country, billing_zip, billing_city, billing_address);
    }

    query += " WHERE order_id = ?";
    params.push(parsedOrderId);

    const [result] = await connection.query(query, params);

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