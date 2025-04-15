import { useState } from "react";

type Props = {
  onSendMessage: (msg: string) => void;
};

const ChatInput = ({ onSendMessage }: Props) => {
  const [message, setMessage] = useState("");
  const [listening, setListening] = useState(false);

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage("");
    }
  };

  const handleVoiceInput = () => {
    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.lang = "pt-BR";
    recognition.interimResults = false;

    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setMessage((prev) => prev + " " + transcript);
    };

    recognition.start();
  };

  return (
    <div style={{
      display: "flex",
      padding: "12px",
      borderTop: "1px solid #eee",
      background: "#fff",
      alignItems: "center",
      gap: "10px",
    }}>
      <button
        onClick={handleVoiceInput}
        style={{
          fontSize: "20px",
          background: "none",
          border: "none",
          cursor: "pointer",
        }}
        title="Falar"
      >
        🎤
      </button>
      <input
        type="text"
        placeholder="Digite ou fale sua mensagem..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        style={{
          flex: 1,
          padding: "10px 15px",
          borderRadius: "20px",
          border: "1px solid #ccc",
          fontSize: "16px",
          outline: "none",
        }}
      />
      <button
        onClick={handleSend}
        style={{
          background: "#007aff",
          color: "white",
          border: "none",
          borderRadius: "20px",
          padding: "8px 16px",
          fontSize: "14px",
          cursor: "pointer",
        }}
        title="Enviar"
      >
        Enviar
      </button>
    </div>
  );
};

export default ChatInput;

