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

    router.get('/count', handlerWrap(this.countOfReview.bind(this)));
    router.get('/:reviewId', handlerWrap(this.fetchReview.bind(this)));
    router.get('/', handlerWrap(this.fetchReviews.bind(this)));
    router.put('/:reviewId', auth, handlerWrap(this.updateReview.bind(this)));
    router.delete('/:reviewId', auth, handlerWrap(this.deleteReview.bind(this)));
    router.post('/', auth, handlerWrap(this.createReview.bind(this)));

    this.router.use(this.path, router);
  }

  async countOfReview(req, res) {
    const data = await this.reviewService.countReview();

    return {
      status: 'SUCCESS',
      count: data.count,
    };
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

  async fetchReviews(req, res) {
    const pageInput = Number(req.query.page);

    if (pageInput <= 0 || pageInput === NaN || !pageInput || !Number.isInteger(pageInput))
      throw new BadRequest('page 값은 1이상의 정수여야 합니다.');

    const page = req.query.page || 1;
    const search = req.query.search || '';

    const reviews = await this.reviewService.fetchReviews(page, search);
    return {
      status: 'SUCCESS',
      reviews,
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

  async deleteReview(req, res) {
    const reviewId = req.params.reviewId;
    const email = req.user.email;

    const review = await this.reviewService.deleteReview(email, reviewId);

    return {
      status: 'SUCCESS',
      review,
    };
  }
}
