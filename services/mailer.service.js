// services/mailer.service.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail', // ou autre
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

exports.sendActivationEmail = (to, token) => {
  const url = `${process.env.BACK_URL}/auth/verify/${token}`;
  return transporter.sendMail({
    from: `"Knowledge Learning" <${process.env.SMTP_USER}>`,
    to,
    subject: "Activation de votre compte",
    html: `<p>Merci de vous être inscrit !</p><p>Cliquez ici pour activer votre compte : <a href="${url}">${url}</a></p>`
  });
};
