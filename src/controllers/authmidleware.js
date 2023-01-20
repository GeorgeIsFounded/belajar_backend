const authMiddleware = (req, res, next) => {
  console.log('middleware has been called');
  console.log('header', req.headers);

  if (req?.headers?.authorization === '123') {
    next();
  } else if (req?.headers?.authorization === undefined) {
    return res.status(401).json({
      status: 'failure',
      message: 'Send Code',
    });
  } else {
    return res.status(401).json({
      status: 'failure',
      message: 'Unvalid Token',
    });
  }
};

module.exports = authMiddleware;
