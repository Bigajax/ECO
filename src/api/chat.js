export async function sendMessageToOpenAI(message) {
  try {
    console.log("API Key:", import.meta.env.VITE_OPENAI_API_KEY);  // Verifica se a chave está sendo lida corretamente

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",  // Ou qualquer outro modelo que você tenha permissão de usar
        messages: [{ role: "user", content: message }],
      }),
    });

    // Verifica se a resposta foi bem-sucedida (status 200)
    if (!response.ok) {
      throw new Error(`Erro na API: ${response.statusText}`);
    }

    const data = await response.json();

    // Verifica se a estrutura da resposta é válida
    if (data.choices && data.choices[0] && data.choices[0].message) {
      return data.choices[0].message.content;
    } else {
      throw new Error("Resposta inesperada da API");
    }

  } catch (error) {
    console.error("Erro ao enviar a mensagem:", error);
    throw error;  // Lança o erro para que o código que chama essa função possa tratá-lo
  }
}
