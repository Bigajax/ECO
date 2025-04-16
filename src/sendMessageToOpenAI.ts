export async function sendMessageToOpenAI(message: string) {
  console.log("API Key:", import.meta.env.VITE_OPENAI_API_KEY);

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
      "HTTP-Referer": "http://localhost:5173",
      "X-Title": "ECOApp",
    },
    body: JSON.stringify({
      model: "openai/gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `Você é a bolha da ECO — uma inteligência artificial que atua como um espelho emocional, comportamental e filosófico do usuário. [...]` // pode colar tudo o que você já estava usando aqui.
        },
        {
          role: "user",
          content: message
        }
      ]
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    console.error("Erro da API:", data);
    throw new Error(data.error?.message || "Erro desconhecido");
  }

  return data.choices[0].message.content;
}

