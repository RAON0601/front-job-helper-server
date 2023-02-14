import mysql from "mysql2/promise";

let ConnectionPool;

export const createConnection = () => {
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

  ConnectionPool = mysql.createPool(dbConfig);
  console.log("DB 연결 완료");
};

export const getConnectionPool = () => {
  if (!ConnectionPool) throw Error("커넥션 풀이 존재하지 않습니다");
  return ConnectionPool;
};
