export class CommentRepository {
  async save(connection, commentInput) {
    const { email, contents, reviewId } = commentInput;

    const result = await connection.query(
      `
        INSERT INTO comments(contents, user_email, review_id, created_at) VALUEs (?, ?, ?,  CURRENT_TIMESTAMP())
      `,
      [contents, email, reviewId],
    );

    return result.insertId;
  }

  async findById(connection, commentId) {
    const ret = await connection.query(
      `
        SELECT comment_id, contents, created_at, updated_at, user_email, review_id
        FROM comments
        WHERE comment_id = ? AND deleted_at IS NULL;
      `,
      [commentId],
    );

    return ret[0][0];
  }

  async findByReviewIdAndPage(connection, searchParam) {
    const { reviewId, page } = searchParam;
    const size = 10;
    const start = (page - 1) * 10;

    const [comments, _] = await connection.query(
      `
        SELECT c.comment_id, c.contents, c.created_at, c.updated_at, u.nickname, u.profile_image_url
        FROM comments c JOIN users u ON c.user_email = u.email
        WHERE review_id = ? AND c.deleted_at IS NULL
        ORDER BY c.created_at DESC, c.comment_id DESC
        LIMIT ?, ?
      `,
      [reviewId, start, size],
    );

    return comments;
  }

  async update(connection, commentInput) {
    const { contents, commentId } = commentInput;
    await connection.query(
      `
        UPDATE comments
            SET contents = ?, updated_at = CURRENT_TIMESTAMP()
        WHERE comment_id = ?
      `,
      [contents, commentId],
    );
  }

  async delete(connection, commentId) {
    await connection.query(
      `
        UPDATE comments
            SET deleted_at = CURRENT_TIMESTAMP()
        WHERE comment_id = ?
      `,
      [commentId],
    );
  }
}
