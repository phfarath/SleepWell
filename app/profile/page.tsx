"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Moon, User, Mail, Edit2, Save, Calendar, Clock, Target, List, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MainNav } from "@/components/main-nav";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

interface UserStats {
  sleepEntries: number;
  habitsCount: number;
  tasksCount: number;
  shoppingListsCount: number;
}

export default function Profile() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [stats, setStats] = useState<UserStats>({
    sleepEntries: 0,
    habitsCount: 0,
    tasksCount: 0,
    shoppingListsCount: 0
  });
  const router = useRouter();
  const { toast } = useToast();

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
        .from("users")
        .select("name")
        .eq("id", authUser.user.id)
        .single();

      if (profileError) {
        console.error("Erro ao buscar perfil do usuário:", profileError);
      } else {
        setProfile(profileData);
        setEditedName(profileData?.name || "");
      }

      // Buscar estatísticas do usuário
      const fetchStats = async () => {
        const userId = authUser.user.id;
        
        const [sleepLogs, habits, tasks, shoppingLists] = await Promise.all([
          supabase.from('sleep_logs').select('*', { count: 'exact' }).eq('user_id', userId),
          supabase.from('habits').select('*', { count: 'exact' }).eq('user_id', userId),
          supabase.from('tasks').select('*', { count: 'exact' }).eq('user_id', userId),
          supabase.from('shopping_lists').select('*', { count: 'exact' }).eq('user_id', userId)
        ]);

        setStats({
          sleepEntries: sleepLogs.count || 0,
          habitsCount: habits.count || 0,
          tasksCount: tasks.count || 0,
          shoppingListsCount: shoppingLists.count || 0
        });
      };

      fetchStats();
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

  const handleUpdateProfile = async () => {
    const { error } = await supabase
      .from('users')
      .update({ name: editedName })
      .eq('id', user.id);

    if (error) {
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o perfil",
        variant: "destructive",
      });
    } else {
      setProfile({ ...profile, name: editedName });
      setIsEditing(false);
      toast({
        title: "Sucesso",
        description: "Perfil atualizado com sucesso!",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="border-b p-4 flex items-center justify-between">
        <MainNav hideAuthLinks />
        <Button variant="outline" onClick={handleLogout}>
          Sair
        </Button>
      </header>

      <main className="flex-1 p-6 max-w-4xl mx-auto w-full">
        <div className="space-y-6">
          {/* Seção do Perfil */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold flex items-center gap-2">
                <User className="h-6 w-6" />
                Perfil do Usuário
              </h2>
              {!isEditing && (
                <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                  <Edit2 className="h-4 w-4 mr-2" />
                  Editar
                </Button>
              )}
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <span className="font-medium">Email:</span>
                <span>{user.email}</span>
              </div>

              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-muted-foreground" />
                <span className="font-medium">Nome:</span>
                {isEditing ? (
                  <div className="flex items-center gap-2">
                    <Input
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                      className="max-w-xs"
                      placeholder="Seu nome"
                    />
                    <Button size="sm" onClick={handleUpdateProfile}>
                      <Save className="h-4 w-4 mr-2" />
                      Salvar
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setIsEditing(false)}>
                      Cancelar
                    </Button>
                  </div>
                ) : (
                  <span>{profile?.name || "Nome não informado"}</span>
                )}
              </div>
            </div>
          </Card>

          {/* Seção de Estatísticas */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Suas Estatísticas</h3>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-5 w-5 text-blue-500" />
                  <h4 className="font-medium">Registros de Sono</h4>
                </div>
                <p className="text-2xl font-bold">{stats.sleepEntries}</p>
              </Card>

              <Card className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="h-5 w-5 text-green-500" />
                  <h4 className="font-medium">Hábitos</h4>
                </div>
                <p className="text-2xl font-bold">{stats.habitsCount}</p>
              </Card>

              <Card className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <List className="h-5 w-5 text-purple-500" />
                  <h4 className="font-medium">Tarefas</h4>
                </div>
                <p className="text-2xl font-bold">{stats.tasksCount}</p>
              </Card>

              <Card className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <ShoppingCart className="h-5 w-5 text-orange-500" />
                  <h4 className="font-medium">Listas</h4>
                </div>
                <p className="text-2xl font-bold">{stats.shoppingListsCount}</p>
              </Card>
            </div>
          </div>
        </div>
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