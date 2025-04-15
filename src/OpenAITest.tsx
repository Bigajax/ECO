import { useState } from "react";

export default function OpenAITest() {
  const [input, setInput] = useState("");
  const [resposta, setResposta] = useState("");

  async function sendMessage(prompt: string) {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "Você é uma IA reflexiva e poética que ajuda o usuário a se entender melhor." },
          { role: "user", content: prompt }
        ],
      }),
    });

    const data = await response.json();
    setResposta(data.choices[0].message.content);
  }

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Teste da OpenAI</h2>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Digite algo"
        style={{ width: "300px", padding: "0.5rem", marginRight: "1rem" }}
      />
      <button onClick={() => sendMessage(input)}>Enviar</button>
      <div style={{ marginTop: "2rem" }}>
        <strong>Resposta:</strong>
        <p>{resposta}</p>
      </div>
    </div>
  );
}

