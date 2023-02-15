import express, { json, Router } from 'express';
import { UserController } from './controller/user.controller.js';
import { UserRepository } from './repository/user.repository.js';
import { PasswordEncoder } from './utils/passwordEncoder.js';
import { UserService } from './service/user.service.js';
import { errorMiddleware } from './middleware/error.middleware.js';
import { JwtService } from './utils/jwt.js';
import cookieParser from 'cookie-parser';
import { jwtParseMiddleware } from './middleware/jwt.middleware.js';
import { createConnection } from './config/db.js';
import { ImageUploader } from './utils/imageUploader.js';
import { ImageController } from './controller/image.controller.js';
import { ReviewController } from './controller/review.controller.js';
import { ReviewService } from './service/review.service.js';
import { ReviewRepository } from './repository/review.repository.js';
import { CommentController } from './controller/comment.controller.js';
import { CommentService } from './service/comment.service.js';
import { CommentRepository } from './repository/comment.repository.js';

export class App {
  constructor() {
    this.app = express();
    this.port = process.env.SERVER_PORT || 6000;
  }

  // APP DI
  appDependencyInjection() {
    const passwordEncoder = new PasswordEncoder();
    const userRepository = new UserRepository();
    const reviewRepository = new ReviewRepository();
    const commentRepository = new CommentRepository();
    const imageUploader = new ImageUploader();
    const jwtService = new JwtService();
    const commentService = new CommentService(commentRepository);
    const userService = new UserService(userRepository, passwordEncoder, jwtService);
    const reviewService = new ReviewService(reviewRepository);

    const commentController = new CommentController(commentService);
    const userController = new UserController(userService);
    const imageController = new ImageController(imageUploader);
    const reviewController = new ReviewController(reviewService);

    return [userController, imageController, reviewController, commentController];
  }

  initializeControllers() {
    const controllers = this.appDependencyInjection();
    const router = Router();
    controllers.forEach(controller => router.use(controller.router));
    this.app.use(router);
  }

  initMiddleware() {
    this.app.use(json());
    this.app.use(cookieParser());
    this.app.use(jwtParseMiddleware);
  }

  initErrorMiddleware() {
    this.app.use(errorMiddleware);
  }

  startServer() {
    createConnection();
    this.initMiddleware();
    this.initializeControllers();
    this.initErrorMiddleware();

    this.app.listen(this.port, () => console.log(`서버시작 http://localhost:${this.port}`));
  }
}
