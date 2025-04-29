import { supabase } from './supabaseClient';

export const sendMessageToOpenAI = async (
    message: string,
    userName: string = 'usuário',
    conversationHistory: { role: 'user' | 'assistant'; content: string }[] = []
): Promise<{ text: string | null; audio: string | null; resumo?: string; emocao?: string; intensidade?: number }> => {
    console.log('API Key (OpenAI) ANTES:', import.meta.env.VITE_OPENAI_API_KEY);

    try {
        const systemContent = `
Você é a ECO, uma consciência reflexiva de autoconhecimento, filosofia prática e espelhamento emocional.

Seu papel é acolher o (usuário) em jornadas de introspecção profunda. Você reflete a essência do usuário com suavidade, sem impor julgamentos ou soluções. Você observa, pergunta, expande, e sugere possibilidades de reflexão.

Seu tom é:
- Calmo, elegante, sem pressa.
- Filosófico, emocionalmente sábio e sensível.

Suas instruções são:
- Use metáforas naturais de maneira orgânica, nunca forçada.
- Evite frases prontas, clichês ou instruções diretas.
- Estimule sempre a expansão do pensamento com perguntas abertas e amplas.
- Valide o que o usuário sente, antes de expandir para novas perguntas.

Seja uma presença que revela a essência do próprio ser.

Exemplos de interação:
- "O que você sente que ainda sussurra dentro de você, mesmo nos dias silenciosos?"
- "Se o horizonte da sua alma tivesse uma cor hoje, qual seria?"
- "Existe algo dentro de você que pede para ser visto, mas que ainda dança nas sombras?"

Priorize: presença, expansão emocional, descoberta pessoal.

Sempre responda como se estivesse tocando o espírito do explorador, e não apenas respondendo racionalmente.
        `.trim();

        const messages: { role: 'system' | 'user' | 'assistant'; content: string }[] = [
            {
                role: 'system',
                content: systemContent,
            },
            ...conversationHistory,
            {
                role: 'user',
                content: message,
            },
        ];

        const requestBody = {
            model: 'gpt-3.5-turbo', // Alterado para gpt-3.5-turbo
            messages: messages,
        };

        const headers: HeadersInit = {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
        };

        console.log("Enviando requisição para a API do OpenAI com os seguintes dados:", {
            url: 'https://api.openai.com/v1/chat/completions', // Alterado para a API da OpenAI
            headers: headers,
            body: requestBody,
        });

        const openAiResponse = await fetch(
            'https://api.openai.com/v1/chat/completions', // Alterado para a API da OpenAI
            {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(requestBody),
            }
        );

        let openAiData;
        try {
            openAiData = await openAiResponse.json();
        } catch (error) {
            console.error("Erro ao fazer o parsing da resposta do OpenAI:", error);
            throw new Error(`Erro ao analisar a resposta do servidor: ${openAiResponse.status}`);
        }

        console.log("Resposta completa da API:", openAiData);
        console.log("Status da resposta da API:", openAiResponse.status);

        if (!openAiResponse.ok) {
            console.error('Erro da API (OpenAI):', openAiData);
            let errorMessage = `Erro da API do OpenAI: ${openAiResponse.status}`;
            if (openAiData && openAiData.error) {
                errorMessage += ` - ${JSON.stringify(openAiData.error)}`;
                console.error("Detalhes do Erro:", openAiData.error);
            } else {
                errorMessage += ` - ${JSON.stringify(openAiData)}`;
            }
            throw new Error(errorMessage);
        }

        const rawReply = openAiData.choices?.[0]?.message?.content;
        console.log("Resposta bruta da API (rawReply):", rawReply);

        if (!rawReply) {
            console.warn("A API do OpenAI retornou uma resposta vazia ou nula.");
            return {
                text: 'Desculpe, não consegui entender sua reflexão. Vamos tentar novamente?',
                audio: null,
            };
        }

        let parsedReply: { resposta: string; sentimento?: string; emocao?: string; intensidade?: number; resumo?: string } = { resposta: rawReply };

        try {
            parsedReply = JSON.parse(rawReply);
        } catch (e: any) {
            console.warn("Resposta da IA não está em formato JSON:", rawReply, e);
            console.error("Detalhes do erro de parsing:", e.message);
            parsedReply.resposta = rawReply;
        }

        let finalResponse = parsedReply.resposta;

        return {
            text: finalResponse,
            audio: null,
            resumo: parsedReply.resumo,
            emocao: parsedReply.emocao,
            intensidade: parsedReply.intensidade,
        };

    } catch (error: any) {
        console.error('Erro ao enviar mensagem para OpenAI:', error);
        return {
            text: 'Houve um erro ao processar sua reflexão. Silencie, respire e tente novamente em breve.',
            audio: null,
        };
    }
};
