const joi = require("joi");

module.exports = function (data) {
  const schema = joi.object({
    username: joi.string().required(),
    email: joi.string().email().required(),
    password: joi.string().required(),
  });

  return schema.validate(data);
};
