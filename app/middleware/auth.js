const jwt = require('jsonwebtoken');
const httpStatus = require('http-status');
const commonService = require('../services/common');
require('dotenv').config();

exports.generateAuthJwt = (payload, expiresIn) => {
  const options = expiresIn ? { expiresIn } : undefined;
  const token = jwt.sign(payload, process.env.SECRET_KEY, options);
  if (!token) {
    return false;
  }
  return token;
};

exports.verifyAuthToken = async (req, res, next) => {
  try {
    let token = req.headers.authorization;
    if (!token) return sendErrorResponse(res, 'MISSING_TOKEN', httpStatus.UNAUTHORIZED);

    token = token.replace(/^Bearer\s+/, '');
    const decoded = await new Promise((resolve, reject) => {
      jwt.verify(token, process.env.SECRET_KEY, (error, decoded) => {
        if (error) reject(error);
        resolve(decoded);
      });
    });
    const user = await commonService.findByCondition('users', { accessToken: token });
    if (!user) {
      return sendErrorResponse(res, 'INVALID_TOKEN', httpStatus.UNAUTHORIZED);
    }
    req.user = decoded;
    return next();
  } catch (err) {
    console.error(err);
    return sendErrorResponse(res, 'SOMETHING_WRONG', httpStatus.INTERNAL_SERVER_ERROR);
  }
};


function sendErrorResponse(res, msgCode, statusCode) {
  return res.status(statusCode).json({ error: { msgCode } });
}
