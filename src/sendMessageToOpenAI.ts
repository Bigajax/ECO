// src/sendMessageToOpenAI.ts
export async function sendMessageToOpenAI(message: string): Promise<{ text: string | null; audio: HTMLAudioElement | null }> {
  console.log("API Key (OpenAI):", import.meta.env.VITE_OPENAI_API_KEY);

  const openAiResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
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

  const openAiData = await openAiResponse.json();

  if (!openAiResponse.ok) {
    console.error("Erro da API (OpenAI):", openAiData);
    throw new Error(openAiData.error?.message || "Erro desconhecido ao obter resposta da IA.");
  }

  const reply = openAiData.choices?.[0]?.message?.content;

  if (!reply) {
    console.error("Resposta vazia ou mal formatada da IA:", openAiData);
    return { text: "Desculpe, não consegui entender sua reflexão. Tente novamente.", audio: null };
  }

  // --- DESATIVANDO INTEGRAÇÃO COM ELEVENLABS PARA TESTE ---
  // const ELEVENLABS_API_KEY = import.meta.env.VITE_ELEVENLABS_API_KEY;
  // const ELEVENLABS_VOICE_ID = '21m00Tcm4TlvDq8ikWAM'; // ID da voz da Rachel
  // let audioElement: HTMLAudioElement | null = null;

  // if (ELEVENLABS_API_KEY) {
  //   try {
  //     const elevenLabsResponse = await fetch(
  //       `https://api.elevenlabs.io/v1/text-to-speech/${ELEVENLABS_VOICE_ID}`,
  //       {
  //         method: 'POST',
  //         headers: {
  //           'Content-Type': 'application/json',
  //           'xi-api-key': ELEVENLABS_API_KEY,
  //         },
  //         body: JSON.stringify({
  //           text: reply,
  //           model_id: 'eleven_multilingual_v2', // Modelo recomendado para português
  //           voice_settings: {
  //             stability: 0.75, // Ajuste conforme necessário (0 a 1)
  //             similarity_boost: 0.75, // Ajuste conforme necessário (0 a 1)
  //           },
  //         }),
  //       }
  //     );

  //     if (elevenLabsResponse.ok) {
  //       const audioBlob = await elevenLabsResponse.blob();
  //       const audioUrl = URL.createObjectURL(audioBlob);
  //       audioElement = new Audio(audioUrl);
  //       audioElement.onended = () => URL.revokeObjectURL(audioUrl); // Limpar a URL ao terminar
  //     } else {
  //       const errorData = await elevenLabsResponse.json();
  //       console.error("Erro ao chamar a API do ElevenLabs:", errorData);
  //     }
  //   } catch (error) {
  //     console.error("Erro ao processar a resposta do ElevenLabs:", error);
  //   }
  // } else {
  //   console.warn("Chave da API do ElevenLabs não configurada. A voz da IA não será reproduzida.");
  // }

  return { text: reply, audio: null };
}
