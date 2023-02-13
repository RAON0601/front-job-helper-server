import dotenv from "dotenv";
import mysql from "mysql2/promise";
dotenv.config();

const dbConfig = {
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER || "abc",
  password: process.env.DATABASE_PASSWORD || "abd",
  database: process.env.DATABASE_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  maxIdle: 10,
  idleTimeout: 60000,
  queueLimit: 0,
};

export const ConnectionPool = mysql.createPool(dbConfig);
