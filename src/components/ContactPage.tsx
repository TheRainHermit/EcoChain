// Nuevo componente: d:\Web Development\EcoChain\src\components\ContactPage.tsx
import React, { useState } from "react";
import { Mail, Twitter, Instagram, MapPin, Send } from "lucide-react";

const ContactPage: React.FC = () => {
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSending(true);

    const form = e.currentTarget;
    const data = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      message: (form.elements.namedItem("message") as HTMLTextAreaElement).value,
    };

    try {
      const res = await fetch("http://ecochain-landing.vercel.app/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      console.log(res);
      if (!res.ok) throw new Error("No se pudo enviar el mensaje.");
      setSent(true);
      form.reset();
    } catch (err) {
        console.error("Error al enviar el mensaje:", err);
      setError("Ocurrió un error al enviar el mensaje. Intenta de nuevo.");
    } finally {
      setSending(false);
    }
  };

  return (
    <main className="max-w-2xl mx-auto py-16 px-4 text-white">
      <h2 className="text-4xl font-extrabold mb-8 text-center text-emerald-300 drop-shadow-lg">
        Contáctanos
      </h2>
      <div className="bg-gradient-to-br from-emerald-950 via-green-900 to-emerald-900 rounded-xl shadow-2xl p-8 flex flex-col items-center">
        <Mail className="w-12 h-12 text-emerald-400 mb-4" />
        <p className="mb-6 text-lg text-center">
          ¿Tienes dudas, sugerencias o quieres colaborar con{" "}
          <span className="font-bold text-emerald-200">EcoChain</span>? <br />
          ¡Estamos para escucharte!
        </p>
        {sent ? (
          <div className="bg-emerald-900/80 text-emerald-200 rounded-lg p-6 mb-6 text-center font-semibold">
            ¡Gracias por tu mensaje! Pronto nos pondremos en contacto.
          </div>
        ) : (
          <form
            className="w-full max-w-md bg-emerald-900/60 rounded-lg p-6 mb-6 shadow flex flex-col gap-4"
            onSubmit={handleSubmit}
          >
            <div>
              <label
                htmlFor="name"
                className="block text-emerald-200 font-semibold mb-1"
              >
                Nombre
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="w-full px-3 py-2 rounded-md border border-emerald-700 bg-emerald-950/40 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
                placeholder="Tu nombre"
                disabled={sending}
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-emerald-200 font-semibold mb-1"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="w-full px-3 py-2 rounded-md border border-emerald-700 bg-emerald-950/40 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
                placeholder="tu@email.com"
                disabled={sending}
              />
            </div>
            <div>
              <label
                htmlFor="message"
                className="block text-emerald-200 font-semibold mb-1"
              >
                Mensaje
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={4}
                className="w-full px-3 py-2 rounded-md border border-emerald-700 bg-emerald-950/40 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
                placeholder="¿En qué podemos ayudarte?"
                disabled={sending}
              />
            </div>
            <button
              type="submit"
              disabled={sending}
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-green-600 text-white px-6 py-2 rounded-full font-semibold shadow hover:bg-emerald-600 hover:scale-105 transition disabled:opacity-60"
            >
              <Send className="w-5 h-5" />
              {sending ? "Enviando..." : "Enviar mensaje"}
            </button>
            {error && (
              <div className="text-red-300 text-sm mt-2 text-center">{error}</div>
            )}
          </form>
        )}
        <div className="space-y-2 text-emerald-100 text-center w-full">
          <div>
            <span className="font-semibold">Email directo:</span>{" "}
            <a
              href="mailto:ecochainsystem@gmail.com"
              className="underline text-emerald-200 hover:text-yellow-200"
            >
              ecochainsystem@gmail.com
            </a>
          </div>
          <div className="flex gap-4 justify-center mt-4">
            <a
              href="https://twitter.com/EcoChainCali"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-yellow-200"
              aria-label="Twitter"
            >
              <Twitter className="w-7 h-7" />
            </a>
            <a
              href="https://instagram.com/ecochaincali"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-yellow-200"
              aria-label="Instagram"
            >
              <Instagram className="w-7 h-7" />
            </a>
          </div>
          <div className="flex items-center justify-center gap-2 mt-4 text-emerald-300">
            <MapPin className="w-5 h-5" />
            <span>Cali, Colombia</span>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ContactPage;