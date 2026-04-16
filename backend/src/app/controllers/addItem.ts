import { Request, Response } from "express";
import mysql from "mysql2/promise";
import fs from "fs";
import path from "path";
import config from "../../config/config";

export const addItem = async (req: Request, res: Response): Promise<void> => {
  let connection: mysql.Connection | null = null;
  try {
    connection = await mysql.createConnection(config.database);
    const { product_name, description, price, stock, category_ids } = req.body;
    const file = req.file;

    if (!product_name || price === undefined || stock === undefined || !file) {
      res.status(400).json({ success: false, message: "product_name, price, stock, and image file are required" });
      if (file) fs.unlinkSync(file.path);
      await connection.end();
      return;
    }

    if (typeof product_name !== "string" || product_name.trim().length === 0 || product_name.trim().length > 200) {
      res.status(400).json({ success: false, message: "product_name must be a non-empty string (max 200 characters)" });
      fs.unlinkSync(file.path);
      await connection.end();
      return;
    }

    const parsedPrice = Number(price);
    const parsedStock = Number(stock);

    if (!Number.isFinite(parsedPrice) || parsedPrice < 0) {
      res.status(400).json({ success: false, message: "price must be a non-negative number" });
      fs.unlinkSync(file.path);
      await connection.end();
      return;
    }

    if (!Number.isFinite(parsedStock) || parsedStock < 0 || !Number.isInteger(parsedStock)) {
      res.status(400).json({ success: false, message: "stock must be a non-negative integer" });
      fs.unlinkSync(file.path);
      await connection.end();
      return;
    }

    let categoryIds: number[] = [];
    if (category_ids !== undefined) {
      if (typeof category_ids === "string") {
        categoryIds = category_ids.split(",").map((s: string) => parseInt(s.trim(), 10)).filter((n: number) => !isNaN(n));
      } else if (Array.isArray(category_ids)) {
        categoryIds = (category_ids as any[]).map((s) => parseInt(String(s).trim(), 10)).filter((n) => !isNaN(n));
      } else if (typeof category_ids === "number") {
        categoryIds = [category_ids as number];
      }

      if (category_ids !== undefined && categoryIds.length === 0) {
        res.status(400).json({ success: false, message: "Invalid category_ids" });
        fs.unlinkSync(file.path);
        await connection.end();
        return;
      }
    }

    await connection.beginTransaction();

    const [result] = await connection.query(
      "INSERT INTO products (product_name, description, price, stock, image_url) VALUES (?, ?, ?, ?, ?)",
      [product_name.trim(), (description || "").trim(), parsedPrice, parsedStock, ""]
    );

    const productId = (result as any).insertId;

    const ext = path.extname(file.originalname) || ".png";
    const kepekDir = path.resolve(__dirname, "..", "..", "..", "kepek");
    const newFileName = `${productId}${ext}`;
    await fs.promises.copyFile(file.path, path.join(kepekDir, newFileName));
    await fs.promises.unlink(file.path);

    const imageUrl = `../kepek/${newFileName}`;
    await connection.query("UPDATE products SET image_url = ? WHERE product_id = ?", [imageUrl, productId]);

    if (categoryIds.length > 0) {
      const values = categoryIds.map(() => "(?, ?)").join(", ");
      const params: any[] = [];
      categoryIds.forEach((categoryId) => {
        params.push(categoryId, productId);
      });
      await connection.query(`INSERT INTO belongs (category_id, product_id) VALUES ${values}`, params);
    }

    await connection.commit();

    res.status(201).json({
      success: true,
      message: "Item added successfully",
      product_id: productId,
      image_url: imageUrl,
    });
  } catch (error) {
    if (connection) {
      await connection.rollback();
    }
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    console.error("Add item error:", error);
    res.status(500).json({ success: false, message: "Internal server error", error: (error as any).message });
  } finally {
    if (connection) {
      await connection.end();
    }
  }
};
