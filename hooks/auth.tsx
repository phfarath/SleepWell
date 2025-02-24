// Registrar um novo usuário
import { supabase } from "@/lib/supabase";

export async function signUp(email: string, password: string, name: string) {
  // 1. Criar o usuário no Supabase Auth
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) throw error;
  const user = data.user;

  if (user) {
    // 2. Inserir na tabela "profiles" (já funcionando)
    const { error: profileError } = await supabase
      .from("profiles")
      .insert([{ id: user.id, name }]);

    if (profileError) throw profileError;

    // 3. Inserir na tabela "users" (caso tenha uma tabela separada)
    const { error: usersError } = await supabase
      .from("users")
      .insert([{ id: user.id, email, name }]); // Adapte os campos conforme sua tabela "users"

    if (usersError) throw usersError;
  }

  // 4. Logar automaticamente o usuário após o cadastro
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (signInError) throw signInError;

  return data;
}

// Fazer login
export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data;
}

// Fazer logout
export async function signOut() {
  await supabase.auth.signOut();
}

// Obter usuário autenticado
export async function getUser() {
  const { data } = await supabase.auth.getUser();
  return data.user;
}
