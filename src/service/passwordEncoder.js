import crypto from "crypto";

export class PasswordEncoder {
  encode(password) {
    const salt = crypto.randomBytes(32).toString("hex");
    const encodedPassword = crypto
      .pbkdf2Sync(password, salt, 1, 32, "sha512")
      .toString("hex");

    return {encodedPassword, salt};
  }
}

