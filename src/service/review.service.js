import { startWithConnectionPool } from "../repository/utils.js";

export class ReviewService {
  constructor(reviewRepository) {
    this.reviewRepository = reviewRepository;
  }

  async saveReview(reviewInput) {
    return await startWithConnectionPool(this.reviewRepository.save)(
      reviewInput
    );
  }
}
