import { Router } from "express";
import { wrap } from "../middleware/wrap.js";
import { BadRequest } from "../error/BadRequest.js";
import { auth } from "../middleware/auth.middleware.js";

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
    router.post("/signIn", wrap(this.signIn.bind(this)));
    router.post("/signOut", wrap(this.singOut.bind(this)));
    router.get("/check", auth, wrap(this.check.bind(this)));

    this.router.use(this.path, router);
  }

  async signup(req, res) {
    const { email, password, nickname } = req.body;
    if (!email) throw new BadRequest("이메일이 비어있습니다");
    if (!password) throw new BadRequest("비밀번호가 비어있습니다");
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

  async signIn(req, res) {
    const { email, password } = req.body;
    if (!email) throw new BadRequest("이메일이 비어있습니다");
    if (!password) throw new BadRequest("비밀번호이 비어있습니다");

    const loginRequest = { email, password };
    const accessToken = await this.userService.signIn(loginRequest);

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      maxAge: process.env.JWT_EXPIRE_NUMBER,
    });

    return {
      status: "SUCCESS",
    };
  }

  async singOut(req, res) {
    res.cookie("accessToken", null, {
      httpOnly: true,
      maxAge: 0,
    });

    return {
      status: "SUCCESS",
    };
  }

  async check(req, res) {
    return {
      email: req.user.email,
    };
  }
}
