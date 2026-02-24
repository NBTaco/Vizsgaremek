import { Request, Response } from "express";
import mysql from "mysql2/promise";
import config from "../../config/config";

export const getCategories = async (_req: Request, res: Response): Promise<void> => {
  let connection: mysql.Connection | null = null;
  try {
    connection = await mysql.createConnection(config.database);

    const [rows] = await connection.query(
      "SELECT category_id, name FROM categories ORDER BY name ASC"
    );

    const categories = Array.isArray(rows) ? rows : [];

    res.json(categories);
  } catch (error) {
    console.error("Get categories error:", error);
    res.status(500).json({ message: "Internal server error", error: (error as any).message });
  } finally {
    if (connection) await connection.end();
  }
};
