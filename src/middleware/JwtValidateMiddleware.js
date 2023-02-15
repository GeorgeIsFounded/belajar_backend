const jwt = require('jsonwebtoken');
require('dotenv').config();

const jwtValidateMiddleware = (req, res, next) => {
  const authorization = req.headers.authorization;

  if (!authorization)
    return res.sendStatus(401).json({
      msg: 'Unauthorizied',
    });

  const bearerHeader = authorization.split(' ');
  const token = bearerHeader[1];

  jwt.verify(token, process.env.JWT_SECRET, function (err, decode) {
    if (err) {
      return res.status(401).json({
        status: 'Failed',
        err: err,
      });
    } else {
      req.id = decode.id;
      req.name = decode.name;
      req.email = decode.email;
      req.role = decode.role;
      next();
    }
  });
};

module.exports = { jwtValidateMiddleware };