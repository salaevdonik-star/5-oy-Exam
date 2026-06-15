const { Schema, model } = require("mongoose");

const Car = new Schema({
  title: {
    type: String,
    required: true,
    set: (val) => val.trim(),
    minLength: [2, "Kamida 2 ta harf bolsin"],
    maxLength: 150,
  },
  brand_info: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Brand"
  },
  tanirovkasi: {
    type: String,
    required: true,
    enum: {
      values: ["Bor", "Yo'q"],
      message: "{VALUE} bunday qiymat ko'rsatilmagan"
    },
    default: "Yo'q"
  },
  motor: {
    type: String,
    required: true
  },
  year: {
    type: Number,
    required: true,
    min: 1950,
    max: new Date().getFullYear() + 1
  },
  color: {
    type: String,
    required: true
  },
  distance: {
    type: Number,
    required: true,
    min: 0
  },
  gearbook: {
    type: String,
    required: true,
    enum: {
      values: ["Avtomat karobka", "Mexanika karobka"],
      message: "{VALUE} bunday qiymat ko'rsatilmagan"
    },
    default: "Avtomat karobka"
  },
  narxi: {
    type: Number,
    required: true,
    min: 0
  },
  picture: {
    type: String,
    required: true
  },
  picture_ichki: {
    type: String,
    required: false
  },
  picture_tashqi: {
    type: String,
    required: false
  },
  description: {
    type: String,
    required: true
  },
  created_by: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Auth"
  }
}, {
  versionKey: false,
  timestamps: true
})

const CarSchema = model("Car", Car)
module.exports = CarSchema
