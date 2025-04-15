import { useState } from 'react';

export async function sendMessageToOpenAI(message: string) {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  console.log("API Key:", apiKey);  // Verifica se a chave está sendo carregada corretamente.

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
      "HTTP-Referer": "http://localhost:5173",  // URL local do projeto, pode ser ajustado conforme necessário
      "X-Title": "MeuAppOpenRouter",             // Nome do seu app, escolha qualquer nome
    },
    body: JSON.stringify({
      model: "openai/gpt-3.5-turbo",  // Modelo que você deseja usar
      messages: [{ role: "user", content: message }],
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    console.error("Erro da API:", data);
    throw new Error(data.error?.message || "Erro desconhecido");
  }

  return data.choices[0].message.content;
}

function OpenAITest() {
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');

  const handleSendMessage = async () => {
    try {
      const result = await sendMessageToOpenAI(message);
      setResponse(result);
    } catch (error) {
      console.error("Erro:", error);
    }
  };

  return (
    <div>
      <h1>Testando OpenRouter API</h1>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Digite sua mensagem"
      />
      <button onClick={handleSendMessage}>Enviar</button>
      <div>
        <h2>Resposta:</h2>
        <p>{response}</p>
      </div>
    </div>
  );
}

export default OpenAITest;

