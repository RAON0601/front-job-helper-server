import { ConnectionPool } from "../config/db.js";

export const startWithConnectionPool = (cb) => {
  return async (data) => {
    const connection = await ConnectionPool.getConnection();
    try {
      const res = await cb(connection, data);
      return res;
    } catch (e) {
      throw e;
    } finally {
      connection.release();
    }
  };
};

