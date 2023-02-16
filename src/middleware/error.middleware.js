import { HttpError } from '../error/HttpError.js';

export const errorMiddleware = (err, req, res, next) => {
  if (err instanceof HttpError) {
    res.status(err.code).json({
      message: err.message,
    });

    return;
  }

  console.log(err);

  res.status(500).json({
    err,
  });

  next();
};
