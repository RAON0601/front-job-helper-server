import { getConnectionPool } from "../config/db.js";

export const startWithConnectionPool = (cb) => {
  return async (data) => {
    const connection = await getConnectionPool().getConnection();
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
