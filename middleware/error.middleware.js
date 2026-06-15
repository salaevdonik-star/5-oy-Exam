const CustomErrorHandler = require("../error/error");
const logger = require("../utils/logger");

module.exports = function (err, req, res, next) {
  try {
    const meta = {
      path: req.originalUrl,
      method: req.method,
      ip: req.ip,
    };

    if (err instanceof CustomErrorHandler) {
      if (err.status >= 500) {
        logger.error(err.message, meta);
      } else {
        logger.warn(err.message, meta);
      }

      return res.status(err.status).json({
        message: err.message,
      });
    }

    if (err.name === "ValidationError") {
      let errors = err.message.split(",");

      logger.warn("Validation error: " + err.message, meta);

      return res.status(400).json({ message: "Validation error", errors });
    }

    logger.error(err.message, { ...meta, stack: err.stack });

    return res.status(500).json({
      message: err.message,
    });
  } catch (error) {
    logger.error("Error middleware ichida xato: " + error.message);
    return res.status(500).json({
      message: error.message,
    });
  }
};
