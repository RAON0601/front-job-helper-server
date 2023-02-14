import { BadRequest } from '../error/BadRequest.js';
import { Forbidden } from '../error/Forbidden.js';
import { startWithConnectionPool } from '../utils/startWithConnection.js';

export class ReviewService {
  constructor(reviewRepository) {
    this.reviewRepository = reviewRepository;
  }

  async saveReview(reviewInput) {
    return await startWithConnectionPool(this.reviewRepository.save)(reviewInput);
  }

  async fetchReview(reviewId) {
    const data = await startWithConnectionPool(this.reviewRepository.findByIdWithWriter)(reviewId);

    if (!data) throw new BadRequest('해당 리뷰가 존재하지 않습니다.');

    // 이 부분은 ORM 없이 바꾸기 힘들겠다.
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

  async updateReview(email, reviewInput) {
    const beforeUpdateReview = await startWithConnectionPool(this.reviewRepository.findById)(reviewInput.reviewId);
    const { user_email } = beforeUpdateReview;

    if (!beforeUpdateReview) throw new BadRequest('해당 리뷰가 존재하지 않습니다.');
    if (email !== user_email) throw new Forbidden('작성자만 수정 가능합니다.');

    await startWithConnectionPool(this.reviewRepository.update)(reviewInput);
    const updatedReview = await startWithConnectionPool(this.reviewRepository.findById)(reviewInput.reviewId);

    // 이 부분은 ORM 없이 바꾸기 힘들겠다.
    const review = {
      title: updatedReview.title,
      contents: updatedReview.contents,
      createdAt: updatedReview.created_at,
    };

    const writer = {
      nickname: updatedReview.nickname,
      profileImageUrl: updatedReview.profile_image_url,
    };

    return { review, writer };
  }

  async deleteReview(email, reviewId) {
    const beforeDeleteReview = await startWithConnectionPool(this.reviewRepository.findById)(reviewId);

    if (!beforeDeleteReview) throw new BadRequest('해당 리뷰가 존재하지 않습니다.');
    if (email !== beforeDeleteReview.user_email) throw new Forbidden('작성자만 삭제 가능합니다.');

    await startWithConnectionPool(this.reviewRepository.delete)(reviewId);

    return beforeDeleteReview;
  }
}
