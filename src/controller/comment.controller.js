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

    this.router.use(this.path, router);
  }

  createComment(req, res) {
    const { reviewId, contents } = req.body;
    const email = req.user.email;
    const commentInput = { reviewId, contents, email };

    this.commentService.createComment(commentInput);

    return {
      status: 'SUCCESS',
      comment: commentInput,
    };
  }
}
