import { UnAuthorized } from '../error/UnAuthorized.js';

export const auth = (req, res, next) => {
  if (!req.user) {
    throw new UnAuthorized('로그인이 필요합니다.');
  }

  next();
};
