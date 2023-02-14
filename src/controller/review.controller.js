import { Router } from "express";
import { BadRequest } from "../error/BadRequest.js";
import { auth } from "../middleware/auth.middleware.js";
import { handlerWrap } from "../utils/handlerWrap.js";

export class ReviewController {
  constructor(reviewService) {
    this.reviewService = reviewService;
    this.router = Router();
    this.path = "/api/reviews";
    this.initRouter();
  }

  initRouter() {
    const router = Router();

    router.post("/", auth, handlerWrap(this.createReview.bind(this)));

    this.router.use(this.path, router);
  }

  async createReview(req, res) {
    const email = req.user.email;
    const { title, contents } = req.body;
    if (!title) throw new BadRequest("제목이 존재하지 않습니다.");
    if (!contents) throw new BadRequest("내용이 존재하지 않습니다.");

    const reviewInput = { email, title, contents };
    const review = await this.reviewService.saveReview(reviewInput);

    return {
      status: "SUCCESS",
      review,
    };
  }
}
