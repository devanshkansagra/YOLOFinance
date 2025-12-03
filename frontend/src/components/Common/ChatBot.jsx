import { useState } from "react";
import logo from "../../../assets/ai-technology.png";

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: "bot", text: "👋 Hi! I'm Lakshmi, your portfolio guide. How can I help you today?" },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessage = { from: "user", text: input };
    setMessages((prev) => [...prev, newMessage]);
    setInput("");

    setIsTyping(true);
    try {
      const response = await fetch(import.meta.env.VITE_SERVER_ORIGIN+"/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      const data = await response.json();
      setIsTyping(false);
      setMessages((prev) => [...prev, { from: "bot", text: data.reply }]);
    } catch (error) {
      console.error("Error fetching bot reply:", error);
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: "⚠️ Oops! Something went wrong." },
      ]);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        zIndex: 2147483647,
      }}
    >
      {isOpen ? (
        <div
          style={{
            width: 420,
            height: 600,
            background: "rgba(30, 30, 40, 0.95)",
            borderRadius: 16,
            boxShadow: "0 8px 30px rgba(0,0,0,0.4)",
            display: "flex",
            flexDirection: "column",
            border: "1px solid rgba(255,255,255,0.1)",
            backdropFilter: "blur(10px)",
          }}
        >
          {/* Header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              padding: "12px 16px",
              background: "rgba(30, 30, 40, 0.95)",
              // borderTopLeftRadius: 16,
              // borderTopRightRadius: 16,
              // borderBottomRightRadius: 16,
              // borderBottomLeftRadius: 16,
              color: "white",
              fontWeight: "bold",
              fontSize: "15px",
              borderRadius:"12px"

            }}
          >
            <img
              src={logo}
              alt="AI"
              width={24}
              height={24}
              style={{ marginRight: 8 }}
            />
            Lakshmi
            <button
              onClick={() => setIsOpen(false)}
              style={{
                marginLeft: "auto",
                background: "transparent",
                color: "white",
                border: "none",
                fontSize: "18px",
                cursor: "pointer",
                borderRadius:"12px"
              }}
            >
              ✕
            </button>
          </div>

          {/* Messages */}
          <div
            style={{
              flex: 1,
              padding: "12px",
              overflowY: "auto",
              fontSize: "14px",
              color: "#e5e7eb",
              borderRadius:"12px"
            }}
          >
            {messages.map((msg, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  justifyContent: msg.from === "user" ? "flex-end" : "flex-start",
                  marginBottom: "10px",
                }}
              >
                <div
                  style={{
                    padding: "10px 14px",
                    borderRadius: "14px",
                    maxWidth: "70%",
                    background:
                      msg.from === "user"
                        ? "linear-gradient(90deg, #1f1f1f, #2a2a2a)"
                        : "linear-gradient(90deg, #7f00ff, #00c6ff)",
                    color: msg.from === "user" ? "#fff" : "#fff",
                    fontSize: "14px",
                    lineHeight: "1.4",
                  }}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {isTyping && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  marginLeft: "6px",
                  marginBottom: "8px",
                  color: "#aaa",
                  fontSize: "13px",
                  borderRadius:"12px"
                }}
              >
                <span className="dot">●</span>
                <span className="dot">●</span>
                <span className="dot">●</span>
              </div>
            )}
          </div>

          {/* Input */}
          <div
            style={{
              display: "flex",
              padding: "10px",
              borderTop: "1px solid rgba(255,255,255,0.1)",
              background: "rgba(20,20,30,0.9)",
            }}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Type a message..."
              style={{
                flex: 1,
                border: "none",
                borderRadius: "12px",
                padding: "10px 12px",
                fontSize: "14px",
                background: "rgba(255,255,255,0.1)",
                color: "white",
                outline: "none",
              }}
            />
            <button
              onClick={sendMessage}
              style={{
                marginLeft: "8px",
                background: "linear-gradient(90deg, #7f00ff, #00c6ff)",
                color: "white",
                border: "none",
                borderRadius: "12px",
                padding: "8px 16px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              ➤
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          style={{
            width: "70px",
            height: "70px",
            borderRadius: "50%",
            background: "rgba(30, 30, 40, 0.95)",
            border: "none",
            cursor: "pointer",
            boxShadow: "0 6px 15px rgba(0,0,0,0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            animation: "pulse 2s infinite",
          }}
        >
          <img src={logo} alt="AI" width={32} height={32} />
        </button>
      )}
    </div>
  );
}
