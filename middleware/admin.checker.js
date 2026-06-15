const CustomErrorHandler = require("../error/error");
const jwt = require("jsonwebtoken");

module.exports = function adminChecker(req, res, next) {
  try {
    const token = req.cookies.accessToken;

    if (!token) {
      throw CustomErrorHandler.BadRequest("Token not found");
    }

    const decode = jwt.verify(token, process.env.SECRET_KEY);

    req.user = decode;

    if (req.user.role !== "admin" && req.user.role !== "superadmin") {
      throw CustomErrorHandler.Forbidden("you are not admin");
    }

    next();
  } catch (error) {
    next(error);
  }
};
