import { HttpError } from './HttpError.js';

export class Forbidden extends HttpError {
  constructor(message) {
    super(403, message);
  }
}
