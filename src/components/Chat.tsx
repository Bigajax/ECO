// src/components/Chat.tsx
import { useState, useRef } from "react";
import { sendMessageToOpenAI } from "../utils/sendMessageToOpenAI";

const Chat = () => {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState("");
  const recognitionRef = useRef<any>(null);

  const handleSend = async () => {
    if (!input.trim()) return;
    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");

    const reply = await sendMessageToOpenAI(input);
    setMessages([...newMessages, { role: "assistant", content: reply }]);
  };

  const handleVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Reconhecimento de voz não é suportado nesse navegador.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "pt-BR";
    recognition.interimResults = false;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
    };

    recognition.onerror = (event: any) => {
      console.error("Erro no reconhecimento de voz:", event);
    };

    recognition.start();
    recognitionRef.current = recognition;
  };

  return (
    <div style={styles.chatContainer}>
      <div style={styles.messages}>
        {messages.map((msg, idx) => (
          <div key={idx} style={msg.role === "user" ? styles.userMsg : styles.botMsg}>
            {msg.content}
          </div>
        ))}
      </div>
      <div style={styles.inputContainer}>
        <button onClick={handleVoiceInput} style={styles.micButton}>🎤</button>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Digite sua reflexão..."
          style={styles.input}
        />
        <button onClick={handleSend} style={styles.sendButton}>Enviar</button>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  chatContainer: {
    display: "flex",
    flexDirection: "column",
    height: "100vh",
    fontFamily: "sans-serif",
    backgroundColor: "#f7f7f7",
    padding: 16,
  },
  messages: {
    flex: 1,
    overflowY: "auto",
    paddingBottom: 16,
  },
  userMsg: {
    textAlign: "right",
    margin: "8px 0",
    padding: 10,
    borderRadius: 12,
    background: "#d1e7ff",
    display: "inline-block",
  },
  botMsg: {
    textAlign: "left",
    margin: "8px 0",
    padding: 10,
    borderRadius: 12,
    background: "#e5e5e5",
    display: "inline-block",
  },
  inputContainer: {
    display: "flex",
    gap: 8,
    alignItems: "center",
  },
  micButton: {
    fontSize: 20,
    background: "white",
    border: "1px solid #ccc",
    borderRadius: 8,
    padding: "6px 10px",
    cursor: "pointer",
  },
  input: {
    flex: 1,
    padding: "10px",
    borderRadius: 8,
    border: "1px solid #ccc",
  },
  sendButton: {
    padding: "10px 16px",
    borderRadius: 8,
    border: "none",
    background: "#333",
    color: "white",
    cursor: "pointer",
  },
};

export default Chat;
