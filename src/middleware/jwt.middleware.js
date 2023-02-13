import { JwtService } from "../service/jwt.service.js";

export const jwtParseMiddleware = (req, res, next) => {
  const jwtService = new JwtService();
  const token = req.cookies.accessToken;

  if (!token) {
    next();
    return;
  }

  let decoded = jwtService.verify(token);

  // 토큰 만료일이 하루밖에 안남으면 토큰을 재발급
  const dayAmount = 60 * 60 * 24;
  const millisecond = 1000;

  if (Date.now() / millisecond - decoded.iat > dayAmount) {
    const { email } = decoded;
    const refreshToken = jwtService.generateToken({ email });
    res.cookie.set("access_token", refreshToken, {
      maxAge: process.env.JWT_EXPIRE_NUMBER,
      httpOnly: true,
    });
    decoded = refreshToken;
  }

  req.user = decoded;
  next();
};
