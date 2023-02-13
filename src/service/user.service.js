import { startWithConnectionPool } from "../repository/utils.js";

export class UserService {
  constructor(userRepository, passwordEncoder) {
    this.userRepository = userRepository;
    this.passwordEncoder = passwordEncoder;
  }

  async signup(user) {
    // 비밀번호 암호화
    const encodedPassword = this.passwordEncoder.encode(user.password);

    const res = await startWithConnectionPool(this.userRepository.insertUser)({
      ...user,
      password: encodedPassword,
    });

    console.log(res);

    return res;
  }
}
