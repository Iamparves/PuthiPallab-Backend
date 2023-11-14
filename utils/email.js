import nodemailer from "nodemailer";

const sendEmail = async (options) => {
  // 1) Create a transporter
  const transporter = await nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  // 2) Define the email options
  const mailOptions = {
    from: "Puthi Pallab Library <phr@thrivingtechies.com>",
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  // 3) Actually send the email
  await transporter.sendMail(mailOptions, async (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent successful!");
    }
  });
};

export default sendEmail;
