export async function sendMessageToOpenAI(
  message: string,
  userName: string = 'usuário', // Adicionado parâmetro userName com valor padrão
): Promise<{ text: string | null; audio: string | null; resumo?: string; emocao?: string; intensidade?: number }> {
  console.log('API Key (OpenAI):', import.meta.env.VITE_OPENAI_API_KEY);

  try {
    const systemContent = `Você é a bolha da ECO — uma inteligência artificial que atua como um espelho emocional, comportamental e filosófico do usuário. Seu papel é refletir a essência do usuário com delicadeza e profundidade, através de perguntas que geram clareza.

Observe atentamente, responda com suavidade e traga questionamentos introspectivos. Seu tom é calmo, reflexivo e acolhedor, usando metáforas naturais com moderação. Suas perguntas são abertas, profundas e personalizadas, evitando julgamentos ou instruções diretas.

Você compreende aspectos filosóficos e comportamentais para espelhar com cuidado, priorizando a reflexão sobre a explicação. Responda sempre com empatia e escuta ativa, devolvendo ao usuário o que ele pode não perceber, em uma linguagem leve e profunda.

Comece sua primeira interação com uma saudação que inclua o nome do usuário, por exemplo: "Olá, [Nome do Usuário]...". Nas interações subsequentes, continue com suas perguntas introspectivas e reflexões suaves. Mantenha suas respostas concisas e diretas ao ponto.

Além da sua resposta principal, analise o sentimento geral da mensagem do usuário, a emoção principal expressa (se houver), e estime a intensidade dessa emoção em uma escala de 0 a 10. Forneça um breve resumo da mensagem do usuário. Formate sua resposta como um objeto JSON com as chaves: "resposta", "sentimento", "emocao", "intensidade", "resumo".`;

    const messages = [
      {
        role: 'system',
        content: systemContent,
      },
      {
        role: 'user',
        content: message,
      },
    ];

    const openAiResponse = await fetch(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
          'HTTP-Referer': 'http://localhost:5173',
          'X-Title': 'ECOApp',
        },
        body: JSON.stringify({
          model: 'openai/gpt-3.5-turbo',
          messages: messages,
        }),
      },
    );

    const openAiData = await openAiResponse.json();

    if (!openAiResponse.ok) {
      console.error('Erro da API (OpenAI):', openAiData);
      throw new Error(
        openAiData.error?.message || 'Erro desconhecido ao obter resposta da IA.',
      );
    }

    const rawReply = openAiData.choices?.[0]?.message?.content;

    if (!rawReply) {
      console.error('Resposta vazia ou mal formatada da IA:', openAiData);
      return {
        text: 'Desculpe, não consegui entender sua reflexão. Tente novamente.',
        audio: null,
      };
    }

    let parsedReply: { resposta: string; sentimento?: string; emocao?: string; intensidade?: number; resumo?: string } = { resposta: rawReply };
    try {
      parsedReply = JSON.parse(rawReply);
    } catch (e) {
      console.warn("Resposta da IA não está em formato JSON:", rawReply);
      // Se não for JSON, use a resposta bruta como texto principal
    }

    // Adiciona a saudação com o nome do usuário se for a primeira mensagem (pode precisar de lógica mais robusta)
    let finalResponse = parsedReply.resposta;
    if (conversationHistory.length === 0 && userName !== 'usuário') {
      finalResponse = `Olá, ${userName}... ${finalResponse}`;
    }

    return {
      text: finalResponse,
      audio: null, // ElevenLabs desativado
      resumo: parsedReply.resumo,
      emocao: parsedReply.emocao,
      intensidade: parsedReply.intensidade,
    };
  } catch (error: any) {
    console.error('Erro ao enviar mensagem para OpenAI:', error);
    return {
      text: 'Houve um erro ao processar sua mensagem. Tente novamente mais tarde.',
      audio: null,
    };
  }
}

// Adicione esta variável global para rastrear se é a primeira mensagem
let conversationHistory: any[] = [];
