import { Request, Response } from "express";
import mysql from "mysql2/promise";
import config from "../../config/config";
import { normalizeImageUrl } from "./helpers";

export const getAllItems = async (req: Request, res: Response): Promise<void> => {
  let connection: mysql.Connection | null = null;
  try {
    connection = await mysql.createConnection(config.database);

    const [rows] = await connection.query(
      `SELECT p.product_id, p.product_name, p.price, p.stock, p.image_url, p.description,
              b.category_id, c.name AS category_name
       FROM products p
       LEFT JOIN belongs b ON p.product_id = b.product_id
       LEFT JOIN categories c ON b.category_id = c.category_id
       ORDER BY p.product_id`
    );

    const rawRows = Array.isArray(rows) ? rows : [];
    const baseUrl = `${req.protocol}://${req.get("host")}`;

    const productsMap = new Map<number, any>();
    for (const row of rawRows as any[]) {
      const imageUrl = normalizeImageUrl(row.image_url, baseUrl);

      if (!productsMap.has(row.product_id)) {
        productsMap.set(row.product_id, {
          product_id: row.product_id,
          product_name: row.product_name,
          price: row.price,
          stock: row.stock,
          description: row.description,
          image_url: imageUrl,
          category_ids: [],
          category_names: []
        });
      }

      if (row.category_id) {
        const product = productsMap.get(row.product_id);
        product.category_ids.push(row.category_id);
        product.category_names.push(row.category_name);
      }
    }

    const items = Array.from(productsMap.values());

    res.json({ items });
  } catch (error) {
    console.error("Get items error:", error);
    res.status(500).json({ success: false, message: "Internal server error", error: (error as any).message });
  } finally {
    if (connection) await connection.end();
  }
};
