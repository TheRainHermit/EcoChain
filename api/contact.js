import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: "Todos los campos son obligatorios." });
  }

  const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: { rejectUnauthorized: false },
  });

  const mailOptions = {
    from: `"EcoChain Contacto" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_TO || process.env.EMAIL_USER,
    subject: "Nuevo mensaje de contacto EcoChain",
    text: `Nombre: ${name}\nEmail: ${email}\nMensaje:\n${message}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    return res.status(200).json({ ok: true, message: "Mensaje enviado correctamente." });
  } catch (err) {
    console.error("Error enviando email:", err);
    return res.status(500).json({ error: "No se pudo enviar el mensaje. Intenta más tarde." });
  }
}