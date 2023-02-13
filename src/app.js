import express, { json, Router } from "express";
import { UserController } from "./controller/user.controller.js";
import { UserRepository } from "./repository/user.repository.js";
import { PasswordEncoder } from "./service/passwordEncoder.js";
import { UserService } from "./service/user.service.js";
import { errorMiddleware } from "./middleware/error.middleware.js";
import { JwtService } from "./service/jwt.service.js";
import cookieParser from "cookie-parser";
import { jwtParseMiddleware } from "./middleware/jwt.middleware.js";

export class App {
  constructor() {
    this.app = express();
    this.port = process.env.SERVER_PORT || 6000;
  }

  initializeController() {
    const passwordEncoder = new PasswordEncoder();
    const userRepository = new UserRepository();
    const jwtService = new JwtService();
    const userService = new UserService(
      userRepository,
      passwordEncoder,
      jwtService
    );
    const userController = new UserController(userService);
    const router = Router();

    router.use(userController.router);
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

  async startServer() {
    this.initMiddleware();
    this.initializeController();
    this.initErrorMiddleware();

    this.app.listen(this.port, () =>
      console.log(`서버시작 http://localhost:${this.port}`)
    );
  }
}
