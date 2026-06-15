const CustomErrorHandler = require("../error/error");
const jwt = require("jsonwebtoken")

module.exports = function authorization(req, res, next) {
  try {
    const token = req.cookies.accessToken;

    if (!token) {
      throw CustomErrorHandler.BadRequest("Token not found");
    }

    const decode = jwt.verify(token, process.env.SECRET_KEY)

    req.user = decode

    next()

  } catch (error) {
    next(error);
  }
};
