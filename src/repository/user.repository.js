import { ConnectionPool } from "../config/db.js";

export class UserRepository {
  async insertUser(user) {
    const { email, password, nickname } = user;
    const connection = await ConnectionPool.getConnection();

    try {
      await connection.query(
        "INSERT INTO users(email, password, nickname, created_at) values (?, ?, ?, current_timestamp())",
        [email, password, nickname]
      );

      return user;
    } catch (e) {
      console.log(e);
      throw e;
    } finally {
      connection.release();
    }
  }
}
