import { UnAuthorized } from "../error/UnAuthorized.js";
import { startWithConnectionPool } from "../utils/startWithConnection.js";

export class UserService {
  constructor(userRepository, passwordEncoder, jwtService) {
    this.userRepository = userRepository;
    this.passwordEncoder = passwordEncoder;
    this.jwtService = jwtService;
  }

  async signup(user) {
    // 비밀번호 암호화
    const { encodedPassword, salt } = this.passwordEncoder.encode(
      user.password
    );

    const res = await startWithConnectionPool(this.userRepository.insertUser)({
      ...user,
      password: encodedPassword,
      salt,
    });

    return res;
  }

  async signIn(loginRequest) {
    const { email, password } = loginRequest;
    const user = await startWithConnectionPool(this.userRepository.findByEmail)(
      email
    );

    if (!this.passwordEncoder.verify(password, user.salt, user.password)) {
      throw new UnAuthorized("이메일과 비밀번호가 일치하지 않습니다.");
    }

    const token = this.jwtService.generateToken({ email });
    return token;
  }
}
