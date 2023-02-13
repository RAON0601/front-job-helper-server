import { HttpError } from "./HttpError.js";

export class UnAuthorized extends HttpError {
  constructor(message) {
    super(401, message);
  }
}
