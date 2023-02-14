import jwt from "jsonwebtoken";
import { UnAuthorized } from "../error/UnAuthorized.js";

export class JwtService {
  constructor() {
    this.secretKey = process.env.JWT_SECRET || "secret";
    this.expire = process.env.JWT_EXPIRE || "7d";
  }

  generateToken(data) {
    return jwt.sign(data, this.secretKey, { expiresIn: this.expire });
  }

  verify(token) {
    try {
      return jwt.verify(token, this.secretKey);
    } catch (err) {
      throw new UnAuthorized("정당하지 않은 토큰");
    }
  }
}
