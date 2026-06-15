const joi = require("joi");

const Gearbooks = {
  AUTOMAT: "Avtomat karobka",
  MEXANIKA: "Mexanika karobka",
};

const Tanirovkalar = {
  BOR: "Bor",
  YOQ: "Yo'q",
};

module.exports = function (data) {
  const schema = joi.object({
    title: joi.string().required(),
    brand_info: joi.string().required(),
    tanirovkasi: joi
      .string()
      .valid(...Object.values(Tanirovkalar))
      .required(),
    motor: joi.string().required(),
    year: joi.number().integer().required(),
    color: joi.string().required(),
    distance: joi.number().required(),
    gearbook: joi
      .string()
      .valid(...Object.values(Gearbooks))
      .required(),
    narxi: joi.number().required(),
    description: joi.string().required(),
  });

  return schema.validate(data);
};
