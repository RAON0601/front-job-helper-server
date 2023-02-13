import { HttpError } from "./HttpError.js";

export class BadRequest extends HttpError {
  constructor(message) {
    super(400, message);
  }
}
