export class ReviewRepository {
  async save(connection, review) {
    const { email, title, contents } = review;

    await connection.query(
      "INSERT INTO reviews(user_email, title, contents, created_at) VALUES (?, ?, ?, CURRENT_TIMESTAMP())",
      [email, title, contents]
    );

    return review;
  }

  async findById(connection, reviewId) {
    const ret = await connection.query(
      `SELECT r.title, r.contents, r.created_at, u.nickname, u.profile_image_url
       FROM reviews r join users u on r.user_email = u.email
       WHERE r.review_id = ? AND r.deleted_at IS NULL;
      `,
      [reviewId]
    );

    return ret[0][0];
  }
}
