export const handlerWrap = handler => async (req, res, next) => {
  try {
    const response = await handler(req, res, next);
    return res.json(response);
  } catch (err) {
    console.log('handler wrap ============================');
    console.log(err);
    console.log('handler wrap ============================');

    next(err);
  }
};
