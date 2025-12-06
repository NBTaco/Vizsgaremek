import mysql from "mysql2/promise";
export declare const initializeDatabase: () => Promise<mysql.Pool>;
export declare const getPool: () => mysql.Pool;
