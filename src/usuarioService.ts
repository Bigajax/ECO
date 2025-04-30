import { supabase } from './supabaseClient'; // Supondo que você tenha um arquivo supabaseClient.ts

/**
 * Cadastra um novo usuário e insere seus dados na tabela 'usuarios'.
 *
 * @param {string} nome - O nome do usuário.
 * @param {string} email - O email do usuário.
 * @param {string} senha - A senha do usuário.
 * @returns {Promise<void>} - Uma Promise que resolve quando o usuário é cadastrado e seus dados são inseridos com sucesso, ou rejeita com um erro.
 */
export const cadastrarUsuario = async (nome: string, email: string, senha: string): Promise<void> => {
  try {
    // 1. Cadastra o usuário no sistema de autenticação do Supabase
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password: senha,
    });

    if (signUpError) {
      console.error("Erro ao cadastrar usuário:", signUpError);
      throw new Error(`Erro ao cadastrar usuário: ${signUpError.message}`); // Lança o erro para ser capturado no catch
    }

    // 2. Obtém o ID do usuário cadastrado
    const { user } = signUpData;

    // 3. Insere os dados do usuário na tabela 'usuarios'
    const { data: insertData, error: insertError } = await supabase
      .from('usuarios')
      .insert([{
        id: user.id,
        nome,
        email,
        data_criacao: new Date(), // Usa new Date() para obter a data e hora atuais
        tipo_plano: 'basic', // Valor padrão para o tipo de plano
      }]);

    if (insertError) {
      console.error("Erro ao inserir dados do usuário na tabela 'usuarios':", insertError);
      // Aqui, você pode querer excluir o usuário recém-criado no Auth, dependendo da sua lógica de negócio
      // Exemplo (requer função 'excluirUsuario' - veja o código completo abaixo):
      // await excluirUsuario(user.id);
      throw new Error(`Erro ao inserir dados do usuário: ${insertError.message}`);
    }

    console.log("Usuário cadastrado e dados inseridos com sucesso:", insertData);
    // Se tudo ocorreu bem, a Promise resolve sem retornar nada (void)
  } catch (error: any) {
    // Captura qualquer erro ocorrido nos passos anteriores
    console.error("Erro geral ao cadastrar usuário:", error);
    throw error; // Re-lança o erro para que quem chamou a função possa tratá-lo
  }
};

/**
 * Exclui um usuário do sistema de autenticação do Supabase (auth.users).
 *
 * @param {string} userId - O ID do usuário a ser excluído.
 * @returns {Promise<void>} - Uma Promise que resolve quando o usuário é excluído com sucesso.
 */
const excluirUsuario = async (userId: string): Promise<void> => {
  try {
    const { error } = await supabase.rpc('delete_user', { user_id: userId }); // Usando uma função RPC para excluir o usuário

    if (error) {
      console.error("Erro ao excluir usuário do Auth:", error);
      throw new Error(`Erro ao excluir usuário do Auth: ${error.message}`);
    }
    console.log(`Usuário ${userId} excluído do Auth.`);
  } catch (error: any) {
    console.error("Erro ao excluir usuário do Auth (catch):", error);
    throw error;
  }
};
