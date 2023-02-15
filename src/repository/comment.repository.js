export class CommentRepository {
  async save(connection, commentInput) {
    const { email, contents, reviewId } = commentInput;

    await connection.query(
      `
        INSERT INTO comments(contents, user_email, review_id, created_at) VALUEs (?, ?, ?,  CURRENT_TIMESTAMP())
      `,
      [contents, email, reviewId],
    );
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
}
