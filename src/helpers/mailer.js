// Importa el módulo nodemailer
const nodemailer = require("nodemailer");
// Configura el transporte para el servicio SMTP de Office 365

const transporter = nodemailer.createTransport({
  host: "smtp.office365.com",
  port: 587,
  secure: false, // upgrade later with STARTTLS
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});
// Exporta el objeto de transporte para su uso en otros archivos

module.exports = transporter;
