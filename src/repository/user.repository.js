export class UserRepository {
  async insertUser(connection, user) {
    const { email, password, nickname } = user;

    await connection.query(
      "INSERT INTO users(email, password, nickname, created_at) values (?, ?, ?, current_timestamp())",
      [email, password, nickname]
    );

    return user;
  }
}
