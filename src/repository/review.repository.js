export class ReviewRepository {
  async save(connection, review) {
    const { email, title, contents } = review;

    await connection.query(
      "INSERT INTO reviews(user_email, title, contents, created_at) VALUES (?, ?, ?, CURRENT_TIMESTAMP())",
      [email, title, contents]
    );

    return review;
  }

  async findByIdWithWriter(connection, reviewId) {
    const ret = await connection.query(
      `SELECT r.title, r.contents, r.created_at, r.updated_at, u.nickname, u.profile_image_url
       FROM reviews r join users u on r.user_email = u.email
       WHERE r.review_id = ? AND r.deleted_at IS NULL;
      `,
      [reviewId]
    );

    return ret[0][0];
  }

  async findById(connection, reviewId) {
    const ret = await connection.query(
      `
        SELECT title, contents, created_at, updated_at, deleted_at, user_email
        FROM reviews
        WHERE deleted_at IS NULL AND review_id = ?
      `,
      [reviewId]
    );

    return ret[0][0];
  }

  async update(connection, review) {
    const { contents, title, reviewId } = review;
    console.log(reviewId);
    await connection.query(
      `
        UPDATE reviews 
          SET title=?, contents=?, updated_at=CURRENT_TIMESTAMP()
        WHERE review_id = ?
      `,
      [title, contents, reviewId]
    );
  }
}
