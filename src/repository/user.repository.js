export class UserRepository {
  async insertUser(connection, user) {
    const { email, password, nickname, salt } = user;

    await connection.query(
      "INSERT INTO users(email, password, salt, nickname, created_at) values (?, ?, ?, ?, current_timestamp())",
      [email, password, salt, nickname]
    );

    return user;
  }
}
