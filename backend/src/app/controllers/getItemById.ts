import { Request, Response } from "express";
import mysql from "mysql2/promise";
import config from "../../config/config";
import { normalizeImageUrl } from "./helpers";

export const getItemById = async (req: Request, res: Response): Promise<void> => {
  let connection: mysql.Connection | null = null;

  try {
    const idParam = req.params.productId;
    const productId = parseInt(String(idParam), 10);

    if (isNaN(productId)) {
      res.status(400).json({ success: false, message: "Érvénytelen azonosító" });
      return;
    }

    connection = await mysql.createConnection(config.database);

    const [rows]: any = await connection.query(
      "SELECT product_id, product_name, price, stock, image_url, description FROM products WHERE product_id = ?",
      [productId]
    );

    const items = Array.isArray(rows) ? rows : [];

    if (items.length === 0) {
      res.status(404).json({ success: false, message: "Termék nem található" });
      return;
    }

    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const item = items[0];
    const imageUrl = normalizeImageUrl(item?.image_url, baseUrl);

    res.json({ 
      success: true, 
      item: { ...item, image_url: imageUrl } 
    });

  } catch (error) {
    console.error("Hiba a lekérdezés során:", error);
    res.status(500).json({ success: false, message: "Szerveroldali hiba történt" });

  } finally {
    if (connection) {
      await connection.end();
    }
  }
};
