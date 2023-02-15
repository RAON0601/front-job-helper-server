import { startWithConnectionPool } from '../utils/startWithConnection.js';

export class CommentService {
  constructor(commentRepository) {
    this.commentRepository = commentRepository;
  }

  async createComment(commentInput) {
    await startWithConnectionPool(this.commentRepository.save)(commentInput);

    return commentInput;
  }
}
