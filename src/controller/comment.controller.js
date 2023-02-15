import { Router } from 'express';
import { auth } from '../middleware/auth.middleware.js';
import { handlerWrap } from '../utils/handlerWrap.js';

export class CommentController {
  constructor(commentService) {
    this.commentService = commentService;
    this.path = '/api/comments';
    this.router = Router();
    this.initRoute();
  }

  initRoute() {
    const router = Router();

    router.post('/', auth, handlerWrap(this.createComment.bind(this)));
    router.put('/:commentId', auth, handlerWrap(this.updateComment.bind(this)));
    router.delete('/:commentId', auth, handlerWrap(this.deleteComment.bind(this)));

    this.router.use(this.path, router);
  }

  async createComment(req, res) {
    const { reviewId, contents } = req.body;
    const email = req.user.email;
    const commentInput = { reviewId, contents, email };

    await this.commentService.createComment(commentInput);

    return {
      status: 'SUCCESS',
      comment: commentInput,
    };
  }

  async updateComment(req, res) {
    const { contents } = req.body;
    const commentId = req.params.commentId;
    const email = req.user.email;
    const commentInput = { contents, email, commentId };

    const updatedComment = await this.commentService.updateComment(commentInput);

    return {
      status: 'SUCCESS',
      comment: updatedComment,
    };
  }

  async deleteComment(req, res) {
    const commentId = req.params.commentId;
    const email = req.user.email;
    const commentInput = { email, commentId };

    const deletedComment = await this.commentService.deleteComment(commentInput);
    return {
      status: 'SUCCESS',
      comment: deletedComment,
    };
  }
}
