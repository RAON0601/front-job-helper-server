export class ReviewRepository {
  async save(connection, review) {
    const { email, title, contents } = review;

    const result = await connection.query(
      'INSERT INTO reviews(user_email, title, contents, created_at) VALUES (?, ?, ?, CURRENT_TIMESTAMP())',
      [email, title, contents],
    );

    return { ...review, reviewId: result[0].insertId };
  }

  async findByIdWithWriter(connection, reviewId) {
    const ret = await connection.query(
      `SELECT r.review_id, r.title, r.contents, r.created_at, r.updated_at, u.nickname, u.profile_image_url, u.email
       FROM reviews r JOIN users u ON r.user_email = u.email
       WHERE r.review_id = ? AND r.deleted_at IS NULL;
      `,
      [reviewId],
    );

    return ret[0][0];
  }

  async findByPageAndSearch(connection, searchParam) {
    const { page, search } = searchParam;

    const searchCondition = `%${search}%`;
    const size = 10;
    const start = (page - 1) * 10;
    const ret = await connection.query(
      `
        SELECT r.review_id, r.title, r.contents, r.created_at, r.updated_at, u.nickname, u.profile_image_url
        FROM reviews r JOIN users u ON r.user_email = u.email
        WHERE r.deleted_at IS NULL AND (title LIKE ? OR contents LIKE ?)
        ORDER BY created_at DESC, r.review_id desc
        LIMIT ?, ?
      `,
      [searchCondition, searchCondition, start, size],
    );

    return ret[0];
  }

  async findById(connection, reviewId) {
    const ret = await connection.query(
      `
        SELECT review_id, title, contents, created_at, updated_at, deleted_at, user_email
        FROM reviews
        WHERE deleted_at IS NULL AND review_id = ?
      `,
      [reviewId],
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
      [title, contents, reviewId],
    );
  }

  async delete(connection, reviewId) {
    await connection.query(
      `
        UPDATE reviews
          SET deleted_at=CURRENT_TIMESTAMP()
        WHERE review_id = ?
      `,
      [reviewId],
    );
  }
}
