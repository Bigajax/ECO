export async function sendMessageToOpenAI(message) {
  console.log("API Key:", import.meta.env.VITE_OPENAI_API_KEY);

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
      "HTTP-Referer": "http://localhost:5173",  // ou a URL do seu app se estiver publicado
      "X-Title": "MeuAppOpenRouter",            // nome do seu projeto
    },
    body: JSON.stringify({
      model: "openai/gpt-3.5-turbo",  // Esse é o nome do modelo no OpenRouter
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
