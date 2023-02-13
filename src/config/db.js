import mysql from "mysql2/promise";

export const ConnectionPool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "204068",
  database: "front_job_helper",
  waitForConnections: true,
  connectionLimit: 10,
  maxIdle: 10,
  idleTimeout: 60000,
  queueLimit: 0,
});
