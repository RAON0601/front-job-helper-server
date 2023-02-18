import { BadRequest } from '../error/BadRequest.js';
import { Forbidden } from '../error/Forbidden.js';
import { startWithConnectionPool } from '../utils/startWithConnection.js';

export class CommentService {
  constructor(commentRepository) {
    this.commentRepository = commentRepository;
  }

  async fetchComments(reviewId, page) {
    const searchParam = { reviewId, page };
    const comments = await startWithConnectionPool(this.commentRepository.findByReviewIdAndPage)(searchParam);

    return comments.map(c => ({
      comment: {
        commentId: c.comment_id,
        contents: c.contents,
        createdAt: c.created_at,
        updatedAt: c.updated_at,
      },
      writer: {
        nickname: c.nickname,
        profileImageUrl: c.profile_image_url,
        email: c.email,
      },
    }));
  }

  async createComment(commentInput) {
    const commentId = await startWithConnectionPool(this.commentRepository.save)(commentInput);

    return { ...commentInput, commentId };
  }

  async updateComment(commentInput) {
    const findComment = await startWithConnectionPool(this.commentRepository.findById)(commentInput.commentId);

    if (!findComment) throw new BadRequest('해당 댓글을 찾을 수 없습니다.');
    if (commentInput.email !== findComment.user_email) throw new Forbidden('작성자만 수정할 수 있습니다.');

    await startWithConnectionPool(this.commentRepository.update)(commentInput);

    const updatedComment = await startWithConnectionPool(this.commentRepository.findById)(commentInput.commentId);
    return updatedComment;
  }

  async deleteComment(commentInput) {
    const findComment = await startWithConnectionPool(this.commentRepository.findById)(commentInput.commentId);

    if (!findComment) throw new BadRequest('해당 댓글을 찾을 수 없습니다.');
    if (commentInput.email !== findComment.user_email) throw new Forbidden('작성자만 수정할 수 있습니다.');

    await startWithConnectionPool(this.commentRepository.delete)(commentInput.commentId);

    return findComment;
  }
}
