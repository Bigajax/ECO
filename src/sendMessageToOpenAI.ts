export async function sendMessageToOpenAI(
    message: string,
    userName: string = 'usuário',
    conversationHistory: { role: 'user' | 'assistant'; content: string }[] = []
): Promise<{ text: string | null; audio: string | null; resumo?: string; emocao?: string; intensidade?: number }> {
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

        console.log("Enviando requisição para a API do OpenAI com os seguintes dados:", {
            url: 'https://openrouter.ai/api/v1/chat/completions',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
                'HTTP-Referer': 'http://localhost:5173',
                'X-Title': 'ECOApp',
            },
            body: {
                model: 'openai/gpt-4',
                messages: messages,
            },
        });

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
                    model: 'openai/gpt-4',
                    messages: messages,
                }),
            }
        );

        const openAiData = await openAiResponse.json();
        console.log("Resposta completa da API:", openAiData);
        console.log("Status da resposta da API:", openAiResponse.status);


        if (!openAiResponse.ok) {
            console.error('Erro da API (OpenAI):', openAiData);
            throw new Error(`Erro da API do OpenAI: ${openAiResponse.status} - ${JSON.stringify(openAiData)}`);
        }

        const rawReply = openAiData.choices?.[0]?.message?.content;
        console.log("Resposta bruta da API (rawReply):", rawReply);

        if (!rawReply) {
            return {
                text: 'Desculpe, não consegui entender sua reflexão. Vamos tentar novamente?',
                audio: null,
            };
        }

        let parsedReply: { resposta: string; sentimento?: string; emocao?: string; intensidade?: number; resumo?: string } = { resposta: rawReply };

        try {
            parsedReply = JSON.parse(rawReply);
        } catch (e) {
            console.warn("Resposta da IA não está em formato JSON:", rawReply);
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
}
