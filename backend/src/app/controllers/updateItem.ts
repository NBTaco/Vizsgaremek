import { Request, Response } from "express";
import mysql from "mysql2/promise";
import fs from "fs";
import path from "path";
import config from "../../config/config";
import { normalizeImageUrl } from "./helpers";

export const updateItem = async (req: Request, res: Response): Promise<void> => {
  let connection: mysql.Connection | null = null;
  try {
    connection = await mysql.createConnection(config.database);
    const productId = Number(req.params.productId);
    const { product_name, price, stock, category_ids } = req.body;
    const file = req.file;

    if (!Number.isFinite(productId) || productId <= 0) {
      if (file) fs.unlinkSync(file.path);
      res.status(400).json({ success: false, message: "Invalid productId" });
      return;
    }

    const updates: string[] = [];
    const params: any[] = [];

    if (product_name !== undefined) {
      if (typeof product_name !== "string" || product_name.trim().length === 0 || product_name.trim().length > 200) {
        if (file) fs.unlinkSync(file.path);
        res.status(400).json({ success: false, message: "product_name must be a non-empty string (max 200 characters)" });
        return;
      }
      updates.push("product_name = ?");
      params.push(product_name.trim());
    }

    if (price !== undefined) {
      const parsedPrice = Number(price);
      if (!Number.isFinite(parsedPrice) || parsedPrice < 0) {
        if (file) fs.unlinkSync(file.path);
        res.status(400).json({ success: false, message: "price must be a non-negative number" });
        return;
      }
      updates.push("price = ?");
      params.push(parsedPrice);
    }

    if (stock !== undefined) {
      const parsedStock = Number(stock);
      if (!Number.isFinite(parsedStock) || parsedStock < 0 || !Number.isInteger(parsedStock)) {
        if (file) fs.unlinkSync(file.path);
        res.status(400).json({ success: false, message: "stock must be a non-negative integer" });
        return;
      }
      updates.push("stock = ?");
      params.push(parsedStock);
    }

    if (file) {
      const ext = path.extname(file.originalname) || ".png";
      const kepekDir = path.resolve(__dirname, "..", "..", "..", "kepek");
      const newFileName = `${productId}${ext}`;
      await fs.promises.copyFile(file.path, path.join(kepekDir, newFileName));
      await fs.promises.unlink(file.path);
      const imageUrl = `../kepek/${newFileName}`;
      updates.push("image_url = ?");
      params.push(imageUrl);
    }

    let categoryIds: number[] | null = null;
    if (category_ids !== undefined) {
      categoryIds = [];
      if (typeof category_ids === "string") {
        categoryIds = category_ids.split(",").map((s: string) => parseInt(s.trim(), 10)).filter((n: number) => !isNaN(n));
      } else if (Array.isArray(category_ids)) {
        categoryIds = (category_ids as any[]).map((s) => parseInt(String(s).trim(), 10)).filter((n) => !isNaN(n));
      } else if (typeof category_ids === "number") {
        categoryIds = [category_ids as number];
      }

      const isEmptyArray = Array.isArray(category_ids) && category_ids.length === 0;
      if (categoryIds.length === 0 && !isEmptyArray) {
        if (file) fs.unlinkSync(file.path);
        res.status(400).json({ success: false, message: "Invalid category_ids" });
        return;
      }
    }

    if (updates.length === 0 && categoryIds === null) {
      res.status(400).json({ success: false, message: "No fields provided to update" });
      return;
    }

    await connection.beginTransaction();

    if (updates.length > 0) {
      params.push(productId);
      const [updateResult] = await connection.query(
        `UPDATE products SET ${updates.join(", ")} WHERE product_id = ?`,
        params
      );

      if ((updateResult as any).affectedRows === 0) {
        await connection.rollback();
        res.status(404).json({ success: false, message: "Item not found" });
        return;
      }
    } else {
      const [existingRows] = await connection.query(
        "SELECT product_id FROM products WHERE product_id = ?",
        [productId]
      );
      if (!Array.isArray(existingRows) || existingRows.length === 0) {
        await connection.rollback();
        res.status(404).json({ success: false, message: "Item not found" });
        return;
      }
    }

    if (categoryIds !== null) {
      await connection.query("DELETE FROM belongs WHERE product_id = ?", [productId]);
      if (categoryIds.length > 0) {
        const values = categoryIds.map(() => "(?, ?)").join(", ");
        const categoryParams: any[] = [];
        categoryIds.forEach((categoryId) => {
          categoryParams.push(categoryId, productId);
        });
        await connection.query(`INSERT INTO belongs (category_id, product_id) VALUES ${values}`, categoryParams);
      }
    }

    await connection.commit();

    const [itemRows] = await connection.query(
      "SELECT product_id, product_name, price, stock, image_url FROM products WHERE product_id = ?",
      [productId]
    );
    const item = Array.isArray(itemRows) && itemRows.length > 0 ? itemRows[0] : null;

    const baseUrl = `${req.protocol}://${req.get("host")}`;

    const [categoryRows] = await connection.query(
      "SELECT category_id FROM belongs WHERE product_id = ?",
      [productId]
    );
    const categoryIdsResult = Array.isArray(categoryRows)
      ? categoryRows.map((row: any) => row.category_id)
      : [];

    res.json({
      success: true,
      message: "Item updated successfully",
      item: item ? { ...item, image_url: normalizeImageUrl((item as any).image_url, baseUrl), category_ids: categoryIdsResult } : null,
    });
  } catch (error) {
    if (connection) {
      await connection.rollback();
    }
    console.error("Update item error:", error);
    res.status(500).json({ success: false, message: "Internal server error", error: (error as any).message });
  } finally {
    if (connection) {
      await connection.end();
    }
  }
};
