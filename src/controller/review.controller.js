import { Router } from 'express';
import { BadRequest } from '../error/BadRequest.js';
import { auth } from '../middleware/auth.middleware.js';
import { handlerWrap } from '../utils/handlerWrap.js';

export class ReviewController {
  constructor(reviewService) {
    this.reviewService = reviewService;
    this.router = Router();
    this.path = '/api/reviews';
    this.initRouter();
  }

  initRouter() {
    const router = Router();

    router.get('/:reviewId', handlerWrap(this.fetchReview.bind(this)));
    router.put('/:reviewId', auth, handlerWrap(this.updateReview.bind(this)));
    router.post('/', auth, handlerWrap(this.createReview.bind(this)));

    this.router.use(this.path, router);
  }

  async createReview(req, res) {
    const email = req.user.email;
    const { title, contents } = req.body;

    if (!title) throw new BadRequest('제목이 존재하지 않습니다.');
    if (!contents) throw new BadRequest('내용이 존재하지 않습니다.');

    const reviewInput = { email, title, contents };
    const review = await this.reviewService.saveReview(reviewInput);

    return {
      status: 'SUCCESS',
      review,
    };
  }

  async fetchReview(req, res) {
    const reviewId = req.params.reviewId;
    const { review, writer } = await this.reviewService.fetchReview(reviewId);

    return {
      status: 'SUCCESS',
      review,
      writer,
    };
  }

  async updateReview(req, res) {
    const reviewId = req.params.reviewId;
    const { title, contents } = req.body;
    if (!title && !contents) throw new BadRequest('제목과 내용중 하나의 입력은 존재해야 합니다.');

    const reviewInput = { title, contents, reviewId };
    const email = req.user.email;
    const { review, writer } = await this.reviewService.updateReview(email, reviewInput);

    return {
      status: 'SUCCESS',
      review,
      writer,
    };
  }
}
