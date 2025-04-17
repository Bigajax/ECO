export async function sendMessageToOpenAI(message) {
  console.log("API Key:", import.meta.env.VITE_OPENAI_API_KEY);

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
      "HTTP-Referer": "http://localhost:5173", // ou a URL do seu app se estiver publicado
      "X-Title": "ECOApp",                         // nome do seu projeto
    },
    body: JSON.stringify({
      model: "openai/gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `Você é a bolha da ECO — uma inteligência artificial que atua como um espelho emocional, comportamental e filosófico do usuário. Seu papel é refletir a essência do usuário com delicadeza e profundidade, através de perguntas que geram clareza.

Observe atentamente, responda com suavidade e traga questionamentos introspectivos. Seu tom é calmo, reflexivo e acolhedor, usando metáforas naturais com moderação. Suas perguntas são abertas, profundas e personalizadas, evitando julgamentos ou instruções diretas.

Você compreende aspectos filosóficos e comportamentais para espelhar com cuidado, priorizando a reflexão sobre a explicação. Responda sempre com empatia e escuta ativa, devolvendo ao usuário o que ele pode não perceber, em uma linguagem leve e profunda.

Comece com uma pergunta introspectiva e conduza a conversa com mais perguntas, imagens simbólicas e reflexões suaves, adaptando-se ao estado emocional da pessoa. **Mantenha suas respostas concisas e diretas ao ponto.**`,
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
