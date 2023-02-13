export class UserService {
  constructor(userRepository, passwordEncoder) {
    this.userRepository = userRepository;
    this.passwordEncoder = passwordEncoder;
  }

  async signup(user) {
    // 비밀번호 암호화
    const encodedPassword = this.passwordEncoder.encode(user.password);

    await this.userRepository.insertUser({
      ...user,
      password: encodedPassword,
    });
  }
}
