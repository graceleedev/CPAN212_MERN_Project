const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GOOGLE_EMAIL,
    pass: process.env.GOOGLE_PASSWORD,
  },
});

async function sendEmail(to, subject, message) {
  try {
    await transporter.sendMail({
      from: process.env.GOOGLE_EMAIL,
      to: to,
      subject: subject,
      text: message
    })
  } catch (error) {
      console.log(error);
  }
}

module.exports = sendEmail;
