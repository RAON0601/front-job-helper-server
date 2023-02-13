import { Forbidden } from "../error/Forbidden.js";

export const auth = (req, res, next) => {
  if (!req.user) {
    throw new Forbidden("로그인이 필요합니다.");
  }

  next();
};
