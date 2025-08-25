import express from "express";
import nodemailer from "nodemailer";

const router = express.Router();

router.post("/contact", async (req, res) => {
  const { name, email, message } = req.body;

  console.log("Solicitud recibida:", { name, email, message });

  if (!name || !email || !message) {
    console.log("Faltan campos obligatorios");
    return res
      .status(400)
      .json({ error: "Todos los campos son obligatorios." });
  }

  const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  // Correo para el usuario
  const mailToUser = {
    from: `"EcoChain Contacto" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Gracias por contactar a EcoChain",
    text: `Hola ${name},\n\n¡Gracias por tu mensaje! Hemos recibido tu consulta:\n\n"${message}"\n\nPronto nos pondremos en contacto contigo.\n\nEl equipo de EcoChain`,
  };

  // Correo interno para EcoChain
  const mailToEcoChain = {
    from: `"EcoChain Contacto" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_TO || process.env.EMAIL_USER,
    subject: "Nuevo mensaje de contacto recibido",
    text: `Nuevo mensaje de contacto:\n\nNombre: ${name}\nEmail: ${email}\nMensaje:\n${message}`,
  };

  try {
    console.log("Enviando correos...");
    await Promise.all([
      transporter.sendMail(mailToUser),
      transporter.sendMail(mailToEcoChain),
    ]);
    console.log("Correos enviados correctamente");
    return res.json({ ok: true, message: "Mensaje enviado correctamente." });
  } catch (err) {
    console.error("Error enviando email:", err);
    return res
      .status(500)
      .json({ error: "No se pudo enviar el mensaje. Intenta más tarde." });
  }
});

export default router;
