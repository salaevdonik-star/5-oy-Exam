const { Schema, model } = require("mongoose");

const Brand = new Schema({
  name: {
    type: String,
    required: [true, "Marka nomi bolishi shart"],
    set: (val) => val.trim(),
    minLength: [2, "Kamida 2 ta harf bolsin"],
    maxLength: 50,
    unique: true
  },
  logo: {
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

const BrandSchema = model("Brand", Brand)
module.exports = BrandSchema
