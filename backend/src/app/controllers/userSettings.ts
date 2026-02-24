import { Response } from "express";
import jwt from "jsonwebtoken";
import mysql from "mysql2/promise";
import config from "../../config/config";

export const userSettings = async (req: any, res: Response): Promise<void> => {
  let connection: mysql.Connection | null = null;
  try {
    connection = await mysql.createConnection(config.database);

    let userId: number | undefined;
    let email: string | undefined;

    if (req.user) {
      userId = req.user.user_id || req.user.id;
      email = req.user.email;
    } else {
      const token = req.body?.token || req.query?.token || req.headers?.['x-access-token'];
      if (!token) {
        res.status(403).json({ success: false, message: "Token required" });
        return;
      }

      if (!config.jwtSecret) {
        res.status(500).json({ success: false, message: "Missing JWT secret" });
        return;
      }

      let decoded: any;
      try {
        decoded = jwt.verify(token as string, config.jwtSecret) as any;
      } catch (e) {
        res.status(401).json({ success: false, message: "Invalid token" });
        return;
      }

      userId = decoded?.id;
      email = decoded?.email;
    }

    const [users] = await connection.query(
      "SELECT user_id, email, username FROM users WHERE user_id = ? OR email = ? LIMIT 1",
      [userId, email]
    );

    const user = Array.isArray(users) && users.length > 0 ? users[0] as any : null;

    if (!user) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }

    res.json({
      success: true,
      message: "User settings fetched",
      user: { email: user.email, username: user.username },
    });
  } catch (error) {
    console.error("User settings error:", error);
    res.status(500).json({ success: false, message: "Internal server error", error: (error as any).message });
  } finally {
    if (connection) await connection.end();
  }
};
