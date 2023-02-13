import { Router } from "express";
import { wrap } from "../middleware/wrap.js";
import { BadRequest } from "../error/BadRequest.js";

export class UserController {
  constructor(userService) {
    this.userService = userService;
    this.router = Router();
    this.path = "/api/users";
    this.initRoute();
  }

  initRoute() {
    const router = Router();
    router.post("/", wrap(this.signup.bind(this)));
    this.router.use(this.path, router);
  }

  async signup(req, res) {
    const { email, password, nickname } = req.body;
    if (!email) throw new BadRequest("이메일 값이 비어있습니다");
    if (!password) throw new BadRequest("비밀번호 값이 비어있습니다");
    if (!nickname) throw new BadRequest("닉네임이 비어 있습니다.");

    const user = { email, password, nickname };

    await this.userService.signup(user);

    return {
      status: "SUCCESS",
      user: {
        email,
        nickname,
      },
    };
  }

  //   async signIn(req, res) {
  //     const { email, password } = req.body;
  //     if (!email) throw new BadRequest("이메일 값이 비어있습니다");
  //     if (!password) throw new BadRequest("비밀번호 값이 비어있습니다");

  //     const accessToken = await this.userService.signIn(email, password);
  //   }
}
