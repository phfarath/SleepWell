"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MainNav } from "@/components/main-nav";

export default function Profile() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchUserData() {
      const { data: authUser, error: authError } = await supabase.auth.getUser();

      if (authError || !authUser?.user) {
        router.push("/login");
        return;
      }

      setUser(authUser.user);

      // Buscar informações do usuário na tabela 'users'
      const { data: profileData, error: profileError } = await supabase
        .from("users") // Nome da tabela no banco
        .select("name") // Pega apenas a coluna 'name'
        .eq("id", authUser.user.id) // Filtra pelo ID do usuário logado
        .single();

      if (profileError) {
        console.error("Erro ao buscar perfil do usuário:", profileError);
      } else {
        setProfile(profileData);
      }
    }

    fetchUserData();
  }, [router]);

  if (!user) {
    return <p>Carregando...</p>;
  }

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b p-4 flex items-center justify-between">
        <MainNav hideAuthLinks />
        <Button variant="outline" onClick={handleLogout}>
          Sair
        </Button>
      </header>

      <main className="flex-1 p-6">
        <h2 className="text-2xl font-semibold mb-4">Informações</h2>
        <p>
          <strong>Email:</strong> {user.email}
        </p>
        <p>
          <strong>Nome:</strong> {profile?.name || "Nome não informado"}
        </p>
      </main>

      <footer className="border-t py-6 md:py-0">
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row px-4 sm:px-6 md:px-8">
          <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
            <Moon className="h-6 w-6" />
            <p className="text-center text-sm leading-loose md:text-left">
              Feito com carinho para você ser cada dia melhor
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}