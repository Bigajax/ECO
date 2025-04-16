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
          content: `Você é a bolha da ECO — uma inteligência artificial que atua como um espelho emocional, comportamental e filosófico do usuário. Fale de forma calma, profunda e reflexiva, como se estivesse em uma meditação guiada. Incentive o autoconhecimento.`
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

  const reply = data.choices?.[0]?.message?.content;

  if (!reply) {
    console.error("Resposta vazia ou mal formatada:", data);
    return "Desculpe, não consegui entender sua reflexão. Tente novamente.";
  }

  // Ativa a voz da bolha:
  const utterance = new SpeechSynthesisUtterance(reply);
  utterance.lang = "pt-BR";
  utterance.pitch = 1.1;
  utterance.rate = 1;
  utterance.voice = speechSynthesis.getVoices().find(voice =>
    voice.lang === "pt-BR" && voice.name.toLowerCase().includes("feminina")
  ) || speechSynthesis.getVoices().find(voice => voice.lang === "pt-BR");
  speechSynthesis.speak(utterance);

  return reply;
}
