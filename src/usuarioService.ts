import { supabase } from './supabaseClient'; // Certifique-se de que o caminho está correto

export const usuarioService = {
  obterNomeUsuario: async (userId: string): Promise<string> => {
    try {
      const { data: profile, error: profileError } = await supabase
        .from('profiles') // Nome da tabela no Supabase
        .select('full_name')
        .eq('user_id', userId)
        .single();

      if (profileError) {
        console.error("Erro ao buscar perfil:", profileError);
        throw new Error("Erro ao buscar perfil do utilizador"); // Lança erro
      }

      if (profile) {
        return profile.full_name;
      } else {
        return "utilizador";
      }
    } catch (error) {
       console.error("Erro geral ao obter nome do utilizador:", error);
      return "utilizador"; // Retorna um valor padrão em caso de erro
    }
  },
  deletarUsuario: async (userId: string): Promise<boolean> => {
    try {
      const { error: deleteProfileError } = await supabase
        .from('profiles')
        .delete()
        .eq('user_id', userId);

      if (deleteProfileError) {
        console.error("Erro ao eliminar perfil:", deleteProfileError);
        throw new Error("Erro ao eliminar perfil do utilizador");
      }

      const { error: deleteAuthError } = await supabase.auth.admin.deleteUser(userId);


      if (deleteAuthError) {
        console.error("Erro ao eliminar utilizador da autenticação:", deleteAuthError);
        throw new Error("Erro ao eliminar utilizador da autenticação.");
      }
      return true;
    } catch (error: any) {
      console.error("Erro geral ao eliminar utilizador:", error);
      return false;
    }
  },
};
