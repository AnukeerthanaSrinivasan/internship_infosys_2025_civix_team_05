const nodemailer = require("nodemailer");

const sendOtp = async (email, code) => {
  if (!process.env.SMTP_HOST) {
    console.log(`[DEV] OTP for ${email}: ${code}`);
    return;
  }

  let transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.FROM_EMAIL,
    to: email,
    subject: "HireHelper OTP Verification",
    text: `Your OTP code is ${code}. It will expire in 10 minutes.`,
  });
};

module.exports = sendOtp;
