export class UserRepository {
  async insertUser(connection, user) {
    const { email, password, nickname, salt } = user;

    await connection.query(
      "INSERT INTO users(email, password, salt, nickname, created_at) values (?, ?, ?, ?, current_timestamp())",
      [email, password, salt, nickname]
    );

    return user;
  }

  async findByEmail(connection, email) {
    const ret = await connection.query(
      `SELECT email, password, salt, nickname, created_at, updated_at, deleted_at
       FROM users
       WHERE email = ?
      `,
      [email]
    );

    const user = ret[0][0];
    return user;
  }
}
