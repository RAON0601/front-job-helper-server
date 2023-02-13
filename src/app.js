import express, { json, Router } from "express";
import { UserController } from "./controller/user.controller.js";
import { UserRepository } from "./repository/user.repository.js";
import { PasswordEncoder } from "./service/passwordEncoder.js";
import { UserService } from "./service/user.service.js";
import { errorMiddleware } from "./middleware/error.middleware.js";

export class App {
  constructor() {
    this.app = express();
    this.port = 6000;
  }

  initializeController() {
    const passwordEncoder = new PasswordEncoder();
    const userRepository = new UserRepository();
    const userService = new UserService(userRepository, passwordEncoder);
    const userController = new UserController(userService);
    const router = Router();

    router.use(userController.router);
    this.app.use(router);
  }

  initMiddleware() {
    this.app.use(json());
    console.log("미들웨어 등록 완료");
  }

  initErrorMiddleware() {
    this.app.use(errorMiddleware);
  }

  startServer() {
    this.initMiddleware();
    this.initializeController();
    this.initErrorMiddleware();
    this.app.listen(this.port, () =>
      console.log(`서버시작 http://localhost:${this.port}`)
    );
  }
}
