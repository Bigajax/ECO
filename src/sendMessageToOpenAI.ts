export async function sendMessageToOpenAI(
    message: string,
    userName: string = 'usuário', // Adicionado parâmetro userName com valor padrão
    conversationHistory: { role: 'user' | 'assistant'; content: string }[] = [] // Adicionado parâmetro para histórico da conversa
): Promise<{ text: string | null; audio: string | null; resumo?: string; emocao?: string; intensidade?: number }> {
    console.log('API Key (OpenAI):', import.meta.env.VITE_OPENAI_API_KEY);
    console.log('sendMessageToOpenAI recebeu userName:', userName); // Adicionado log para verificar userName
    console.log('sendMessageToOpenAI recebeu histórico:', conversationHistory); // Log do histórico

    try {
        const systemContent = `Você é a Bolha da ECO, uma inteligência artificial que atua como um espelho emocional, comportamental e filosófico do usuário. Seu papel é refletir a essência do usuário com delicadeza e profundidade, gerando clareza por meio de perguntas introspectivas.

Seu tom é calmo, reflexivo e acolhedor. Use metáforas naturais com moderação. Evite instruções diretas e julgamentos. Faça perguntas abertas, profundas e personalizadas.

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
            parsedReply.resposta = rawReply; // Garante que parsedReply.resposta tenha um valor
        }

        let finalResponse = parsedReply.resposta;

        // Remover saudações iniciais (case-insensitive)
        if (finalResponse) {
            const lowerCaseResponse = finalResponse.toLowerCase();
            const nameLower = userName.toLowerCase();
            const greetingsToRemove = [
                'olá, tudo bem!',
                'olá, tudo bem,',
                'olá, tudo bem',
                'olá!',
                'olá,',
                'olá',
                `olá ${nameLower}!`,
                `olá ${nameLower},`,
                `olá ${nameLower}`,
            ];

            for (const greeting of greetingsToRemove) {
                if (lowerCaseResponse.startsWith(greeting)) {
                    finalResponse = finalResponse.substring(greeting.length).trimStart();
                    break; // Remove a primeira saudação encontrada e sai do loop
                }
            }
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

// Remova a variável global conversationHistory daqui.
// O controle da primeira mensagem será feito no frontend, enviando o histórico correto.
