import { BadRequest } from '../error/BadRequest.js';
import { Forbidden } from '../error/Forbidden.js';
import { startWithConnectionPool } from '../utils/startWithConnection.js';

export class CommentService {
  constructor(commentRepository) {
    this.commentRepository = commentRepository;
  }

  async createComment(commentInput) {
    await startWithConnectionPool(this.commentRepository.save)(commentInput);

    return commentInput;
  }

  async updateComment(commentInput) {
    const findComment = await startWithConnectionPool(this.commentRepository.findById)(commentInput.commentId);

    if (!findComment) throw new BadRequest('해당 댓글을 찾을 수 없습니다.');
    if (commentInput.email !== findComment.user_email) throw new Forbidden('작성자만 수정할 수 있습니다.');

    await startWithConnectionPool(this.commentRepository.update)(commentInput);

    const updatedComment = await startWithConnectionPool(this.commentRepository.findById)(commentInput.commentId);
    return updatedComment;
  }
}
