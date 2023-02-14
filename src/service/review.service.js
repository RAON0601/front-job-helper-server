import { startWithConnectionPool } from "../utils/startWithConnection.js";

export class ReviewService {
  constructor(reviewRepository) {
    this.reviewRepository = reviewRepository;
  }

  async saveReview(reviewInput) {
    return await startWithConnectionPool(this.reviewRepository.save)(
      reviewInput
    );
  }

  async fetchReview(reviewId) {
    const data = await startWithConnectionPool(this.reviewRepository.findById)(
      reviewId
    );

    const review = {
      title: data.title,
      contents: data.contents,
      createdAt: data.created_at,
    };

    const writer = {
      nickname: data.nickname,
      profileImageUrl: data.profile_image_url,
    };
    return { review, writer };
  }
}
