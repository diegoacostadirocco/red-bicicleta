const nodemailer = require("nodemailer");

const mailConfig = {
    host: "smtp.ethereal.email",
    port: 587,
    auth: {
      user: 'maritza.lueilwitz98@ethereal.email',
      pass: 'Anyw7We6ja9M1gNPR2',
    },
  };

  module.exports = nodemailer.createTransport(mailConfig);