const joi = require("joi");

module.exports = function (data) {
  const schema = joi.object({
    name: joi.string().required(),
  });

  return schema.validate(data);
};
