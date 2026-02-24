import { Request, Response } from "express";
import mysql from "mysql2/promise";
import config from "../../config/config";

export const getUserRole = async (req: Request, res: Response): Promise<void> => {
  let connection: mysql.Connection | null = null;
  try {
    connection = await mysql.createConnection(config.database);
    const nev = req.params.username;
    const [role]: any = await connection.query("SELECT users.role FROM users WHERE users.username = ?", [nev]);
    res.send(role[0]);
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, message: "Internal server error" });
  } finally {
    if (connection) await connection.end();
  }
};
