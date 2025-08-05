import React, { useState } from "react";

const ChatbotWidget: React.FC = () => {
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    setMessages((msgs) => [...msgs, { sender: "user", text: input }]);
    setLoading(true);
    try {
      const res = await fetch("/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: input }),
      });
      const data = await res.json();
      setMessages((msgs) => [...msgs, { sender: "bot", text: data.answer }]);
    } catch (error) {
      console.error("Error al enviar mensaje al chatbot:", error);
      setMessages((msgs) => [
        ...msgs,
        { sender: "bot", text: "Lo siento, hubo un error al procesar tu pregunta." },
      ]);
    }
    setInput("");
    setLoading(false);
  };

  return (
    <>
      {/* Botón flotante para abrir/cerrar el chatbot */}
      <button
        className="fixed bottom-6 right-6 bg-gradient-to-br from-green-500 via-emerald-400 to-green-700 text-white rounded-full shadow-lg p-4 z-50 hover:scale-110 hover:bg-green-600 transition"
        onClick={() => setOpen((v) => !v)}
        aria-label="Abrir chatbot"
        style={{ display: open ? "none" : "block" }}
      >
        💬
      </button>
      {open && (
        <div className="fixed bottom-6 right-6 w-80 bg-gradient-to-br from-green-50 via-emerald-100 to-green-200 rounded-xl shadow-xl border border-green-200 z-50 flex flex-col animate-fade-in">
          <div className="bg-gradient-to-r from-green-600 via-emerald-500 to-green-700 text-white px-4 py-2 rounded-t-xl font-bold flex justify-between items-center">
            EcoChain Chatbot
            <button
              className="text-white ml-2 font-bold hover:text-yellow-300 transition"
              onClick={() => setOpen(false)}
              aria-label="Cerrar chatbot"
            >
              ×
            </button>
          </div>
          <div className="p-4 h-64 overflow-y-auto flex flex-col gap-2">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`p-2 rounded-xl shadow ${
                  msg.sender === "user"
                    ? "bg-green-100 text-right"
                    : "bg-white text-left"
                }`}
              >
                <span>{msg.text}</span>
              </div>
            ))}
            {loading && (
              <div className="text-gray-400 text-sm">El bot está pensando...</div>
            )}
          </div>
          <div className="flex border-t px-2 py-2 bg-gray-50 rounded-b-xl">
            <input
              className="flex-1 px-2 py-1 rounded border border-gray-300 focus:outline-none"
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Escribe tu pregunta..."
              disabled={loading}
              onKeyDown={(e) => {
                if (e.key === "Enter") sendMessage();
              }}
            />
            <button
              className="ml-2 bg-gradient-to-r from-emerald-500 to-green-600 text-white px-3 py-1 rounded hover:bg-green-700 font-semibold transition"
              onClick={sendMessage}
              disabled={loading || !input.trim()}
            >
              Enviar
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatbotWidget;