import { useState } from "react";
import ChatInput from "./ChatInput";
import { sendMessageToOpenAI } from "../utils/sendMessageToOpenAI";

const Chat = () => {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);

  const handleSendMessage = async (userMessage: string) => {
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);

    const response = await sendMessageToOpenAI(userMessage);
    setMessages((prev) => [...prev, { role: "assistant", content: response }]);
  };

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      height: "100vh",
      backgroundColor: "#f5f5f5",
    }}>
      <div style={{
        flex: 1,
        padding: "16px",
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
      }}>
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
              backgroundColor: msg.role === "user" ? "#007aff" : "#e5e5ea",
              color: msg.role === "user" ? "white" : "black",
              padding: "10px 14px",
              borderRadius: "20px",
              maxWidth: "70%",
              fontSize: "15px",
              lineHeight: "1.4",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            }}
          >
            {msg.content}
          </div>
        ))}
      </div>

      <ChatInput onSendMessage={handleSendMessage} />
    </div>
  );
};

export default Chat;

