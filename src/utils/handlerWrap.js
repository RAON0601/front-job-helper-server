export const handlerWrap = handler => async (req, res, next) => {
  try {
    const response = await handler(req, res, next);
    return res.json(response);
  } catch (err) {
    next(err);
  }
};
