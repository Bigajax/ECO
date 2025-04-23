import { salvarMensagemComMemoria } from './salvarMensagemComMemoria.js';

(async () => {
  const resultado = await salvarMensagemComMemoria({
    usuario_id: 'a1b2c3d4-e5f6-7890-1234-567890abcdef', // Substitua por um ID real da tabela 'usuarios'
    conteudo: 'Hoje senti um pouco de ansiedade sobre o futuro.',
    sentimento: 'ansiedade',
    resumo_eco: 'Expressou ansiedade ao falar do futuro.',
    emocao_principal: 'ansiedade',
    intensidade: 7,
    contexto: 'reflexão pessoal',
    categoria: 'emocional',
    salvar_memoria: true
  });

  console.log('Resultado:', resultado);
})();
