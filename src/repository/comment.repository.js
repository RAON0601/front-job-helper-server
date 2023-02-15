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
}
