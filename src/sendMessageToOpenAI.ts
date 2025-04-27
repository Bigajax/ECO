export async function sendMessageToOpenAI(
    message: string,
    userName: string = 'usuário',
    conversationHistory: { role: 'user' | 'assistant'; content: string }[] = []
): Promise<{ text: string | null; audio: string | null; resumo?: string; emocao?: string; intensidade?: number }> {
    try {
        const systemContent = `...`; // Mantém o seu texto lindo aí
        
        const messages: { role: 'system' | 'user' | 'assistant'; content: string }[] = [
            { role: 'system', content: systemContent },
            ...conversationHistory,
            { role: 'user', content: message },
        ];

        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
                Referer: 'http://localhost:5173',
                'X-Title': 'ECOApp',
            },
            body: JSON.stringify({
                model: 'openai/gpt-4',
                messages: messages,
            }),
        };

        console.log("Enviando requisição para a API do OpenAI:", requestOptions);

        const openAiResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', requestOptions);
        const openAiData = await openAiResponse.json();
        console.log("Resposta completa da API:", openAiData);

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
            console.warn("Resposta da IA não está em formato JSON, utilizando texto bruto.");
        }

        return {
            text: parsedReply.resposta,
            audio: null, // Aqui no futuro pode integrar TTS
            resumo: parsedReply.res
