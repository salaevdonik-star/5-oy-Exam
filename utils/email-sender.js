const nodemailer = require("nodemailer");
const CustomErrorHandler = require("../error/error");

async function sendEmail(email, code) {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GOOGLE_EMAIL,
        pass: process.env.GOOGLE_PASS
      },
    });

    await transporter.sendMail({
      subject: "CarsDB",
      text: "Lorem ipsum",
      from: "salaevdonik@gmail.com",
      to: email,
      html: `<b style="color: blue; font-size: 36px;">${code}</b>`
    })

  } catch (error) {
    throw CustomErrorHandler.BadRequest(error.message);
  }
}

module.exports = sendEmail
