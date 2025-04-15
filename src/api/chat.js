export async function sendMessageToOpenAI(message) {
  console.log("API Key:", import.meta.env.VITE_OPENAI_API_KEY);  // Adiciona esse log para testar a variável de ambiente

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: message }],
    }),
  });

  const data = await response.json();
  return data.choices[0].message.content;
}
