export class ReviewRepository {
  async save(connection, review) {
    const { email, title, contents } = review;

    await connection.query(
      "INSERT INTO reviews(user_email, title, contents, created_at) VALUES (?, ?, ?, CURRENT_TIMESTAMP())",
      [email, title, contents]
    );

    return review;
  }
}
