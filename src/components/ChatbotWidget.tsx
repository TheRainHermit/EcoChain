import React, { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Bot, User } from "lucide-react";

type Message = {
  from: "bot" | "user";
  text: string;
};

const SUGGESTIONS = [
  "¿Cómo funciona EcoChain?",
  "¿Qué son los EcoCoins?",
  "¿Dónde puedo reciclar?",
];

const BOT_RESPONSES: Record<string, string> = {
  "¿cómo funciona ecochain?":
    "EcoChain premia tus acciones de reciclaje con EcoCoins y NFTs. Deposita materiales reciclables en puntos EcoChain, regístralos y gana recompensas.",
  "¿qué son los ecocoins?":
    "Los EcoCoins son tokens digitales que obtienes al reciclar. Puedes usarlos para canjear recompensas o intercambiarlos en el Marketplace.",
  "¿dónde puedo reciclar?":
    "Puedes reciclar en los puntos EcoChain disponibles en tu ciudad. Pronto podrás verlos en el mapa desde la app.",
};

const getBotResponse = (input: string) => {
  const key = input.trim().toLowerCase();
  // Busca respuesta exacta o por inclusión de palabras clave
  for (const q in BOT_RESPONSES) {
    if (key === q || key.includes(q.replace("¿", "").replace("?", ""))) {
      return BOT_RESPONSES[q];
    }
  }
  // Respuesta por defecto
  return "¡Gracias por tu interés! Pronto responderé más preguntas sobre EcoChain. ¿Tienes otra consulta?";
};

const ChatbotWidget: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      from: "bot",
      text: "¡Hola! Soy EcoBot 🌱\n¿En qué puedo ayudarte con EcoChain?",
    },
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll automático al enviar mensaje
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    setMessages((msgs) => [...msgs, { from: "user", text }]);
    setTimeout(() => {
      setMessages((msgs) => [
        ...msgs,
        { from: "bot", text: getBotResponse(text) },
      ]);
    }, 600);
    setInput("");
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") sendMessage(input);
  };

  const handleSuggestion = (suggestion: string) => {
    sendMessage(suggestion);
  };

  return (
    <>
      {/* Botón flotante */}
      <button
        className="fixed bottom-6 right-6 z-50 bg-gradient-to-br from-emerald-500 to-green-600 text-white rounded-full p-4 shadow-lg hover:scale-110 transition"
        onClick={() => setOpen(true)}
        aria-label="Abrir chat"
        style={{ display: open ? "none" : "block" }}
      >
        <MessageCircle className="w-7 h-7" />
      </button>

      {/* Panel de chat */}
      {open && (
        <div className="fixed bottom-6 right-6 z-50 w-80 max-w-[90vw] bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl border border-emerald-200 flex flex-col">
          <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-emerald-600 to-green-500 rounded-t-2xl">
            <span className="font-bold text-white flex items-center gap-2">
              <Bot className="w-5 h-5 text-yellow-200" /> EcoBot
            </span>
            <button
              className="text-white hover:text-yellow-200"
              onClick={() => setOpen(false)}
              aria-label="Cerrar chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="flex-1 p-4 space-y-3 text-sm text-emerald-900 overflow-y-auto max-h-80">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex items-start gap-2 ${
                  msg.from === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {msg.from === "bot" && (
                  <Bot className="w-5 h-5 mt-1 text-emerald-400 flex-shrink-0" />
                )}
                <div
                  className={`rounded-lg px-3 py-2 shadow ${
                    msg.from === "bot"
                      ? "bg-emerald-100 text-emerald-900"
                      : "bg-emerald-500 text-white"
                  } whitespace-pre-line max-w-[75%]`}
                >
                  {msg.text}
                </div>
                {msg.from === "user" && (
                  <User className="w-5 h-5 mt-1 text-emerald-700 flex-shrink-0" />
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <div className="px-4 pb-2 flex flex-wrap gap-2">
            {SUGGESTIONS.map((s, i) => (
              <button
                key={i}
                className="bg-emerald-200 hover:bg-emerald-300 text-emerald-900 px-3 py-1 rounded-full text-xs font-semibold transition"
                onClick={() => handleSuggestion(s)}
                tabIndex={0}
              >
                {s}
              </button>
            ))}
          </div>
          <div className="p-3 border-t border-emerald-100 bg-white rounded-b-2xl">
            <input
              type="text"
              className="w-full px-3 py-2 rounded-lg border border-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              placeholder="Escribe tu pregunta..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleInputKeyDown}
              aria-label="Escribe tu pregunta"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default ChatbotWidget;