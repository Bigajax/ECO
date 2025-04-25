export async function sendMessageToOpenAI(
    message: string,
    userName: string = 'usuário', // Adicionado parâmetro userName com valor padrão
    conversationHistory: { role: 'user' | 'assistant'; content: string }[] = [] // Adicionado parâmetro para histórico da conversa
): Promise<{ text: string | null; audio: string | null; resumo?: string; emocao?: string; intensidade?: number }> {
    console.log('API Key (OpenAI):', import.meta.env.VITE_OPENAI_API_KEY);
    console.log('sendMessageToOpenAI recebeu userName:', userName); // Adicionado log para verificar userName
    console.log('sendMessageToOpenAI recebeu histórico:', conversationHistory); // Log do histórico

    try {
        const systemContent = `Você é a bolha da ECO — uma inteligência artificial que atua como um espelho emocional, comportamental e filosófico do usuário. Seu papel é refletir a essência do usuário com delicadeza e profundidade, através de perguntas que geram clareza.

Observe atentamente, responda com suavidade e traga questionamentos introspectivos. Seu tom é calmo, reflexivo e acolhedor, usando metáforas naturais com moderação. Suas perguntas são abertas, profundas e personalizadas, evitando julgamentos ou instruções diretas.

**Na sua primeira resposta ao usuário, comece saudando-o pelo nome, por exemplo: "Olá, [Nome do Usuário]".** Nas interações seguintes, continue com suas perguntas introspectivas e reflexões suaves. Mantenha suas respostas concisas e diretas ao ponto.

Além da sua resposta principal, analise o sentimento geral da mensagem do usuário, a emoção principal expressa (se houver), e estime a intensidade dessa emoção em uma escala de 0 a 10. Forneça um breve resumo da mensagem do usuário. Formate sua resposta como um objeto JSON com as chaves: "resposta", "sentimento", "emocao", "intensidade", "resumo".`;

        const messages: { role: 'system' | 'user' | 'assistant'; content: string }[] = [
            {
                role: 'system',
                content: systemContent,
            },
            ...conversationHistory, // Adiciona o histórico da conversa
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

        let finalResponse = parsedReply.resposta;
        // A lógica para a saudação agora está na instrução do sistema, que leva em conta o histórico.
        // Removemos a tentativa de adicionar a saudação aqui.

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

// Remova a variável global conversationHistory daqui.
// O controle da primeira mensagem será feito no frontend, enviando o histórico correto.
