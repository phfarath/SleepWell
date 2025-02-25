"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Plus, CheckCircle2, Calendar, RotateCcw, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

type Habit = {
  id: string;
  name: string;
  description: string;
  frequency: string;
  streak: number;
  created_at: string;
};

export default function Habitos() {
  const [habitos, setHabitos] = useState<Habit[]>([]);
  const [mostrarNovoHabito, setMostrarNovoHabito] = useState(false);
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [frequencia, setFrequencia] = useState("");
  const [habitoParaDeletar, setHabitoParaDeletar] = useState<string | null>(null);
  const [mostrarConfirmacaoDeletar, setMostrarConfirmacaoDeletar] = useState(false);
  const { toast } = useToast();

  // 🔹 Busca hábitos do banco ao carregar a página
  useEffect(() => {
    const buscarHabitos = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data, error } = await supabase
          .from("habits")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (error) throw error;
        setHabitos(data || []);
      } catch (error) {
        console.error("Erro ao buscar hábitos:", error);
      }
    };

    buscarHabitos();
  }, []);

  // 🔹 Função para criar um novo hábito
  const criarHabito = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Erro",
          description: "Você precisa estar logado para criar hábitos.",
          variant: "destructive",
        });
        return;
      }

      if (!nome || !descricao || !frequencia) {
        toast({
          title: "Erro",
          description: "Preencha todos os campos para criar um hábito.",
          variant: "destructive",
        });
        return;
      }

      const novoHabito = {
        user_id: user.id,
        name: nome,
        description: descricao,
        frequency: frequencia,
        streak: 0,
        created_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from("habits")
        .insert([novoHabito])
        .select();

      if (error) throw error;

      if (data && data.length > 0) {
        setHabitos([data[0] as Habit, ...habitos]);
        
        toast({
          title: "Sucesso",
          description: "Hábito criado com sucesso!",
        });

        // Reseta o modal
        setNome("");
        setDescricao("");
        setFrequencia("");
        setMostrarNovoHabito(false);
      } else {
        throw new Error("Falha ao obter dados do hábito inserido");
      }
    } catch (error) {
      console.error("Erro ao criar hábito:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao criar o hábito. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  // 🔹 Função para deletar um hábito
  const deletarHabito = async () => {
    if (!habitoParaDeletar) return;
    
    try {
      const { error } = await supabase
        .from("habits")
        .delete()
        .eq("id", habitoParaDeletar);

      if (error) throw error;

      // Atualiza a lista de hábitos removendo o deletado
      setHabitos(habitos.filter(habito => habito.id !== habitoParaDeletar));
      
      toast({
        title: "Sucesso",
        description: "Hábito removido com sucesso!",
      });
      
      setHabitoParaDeletar(null);
      setMostrarConfirmacaoDeletar(false);
    } catch (error) {
      console.error("Erro ao deletar hábito:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao deletar o hábito. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  // 🔹 Função para abrir o diálogo de confirmação de exclusão
  const confirmarDeletar = (id: string) => {
    setHabitoParaDeletar(id);
    setMostrarConfirmacaoDeletar(true);
  };

  // 🔹 Função para incrementar o streak (dias seguidos)
  const incrementarStreak = async (habito: Habit) => {
    try {
      const novoStreak = habito.streak + 1;
      
      // Atualiza o streak no banco de dados
      const { error } = await supabase
        .from("habits")
        .update({ streak: novoStreak })
        .eq("id", habito.id);

      if (error) throw error;

      // Atualiza o estado local
      setHabitos(habitos.map(h => 
        h.id === habito.id ? { ...h, streak: novoStreak } : h
      ));
      
      toast({
        title: "Sucesso",
        description: `Hábito "${habito.name}" completado! Sequência: ${novoStreak} dias.`,
      });
    } catch (error) {
      console.error("Erro ao atualizar sequência:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao atualizar a sequência. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="flex-1 px-6 md:px-12 lg:px-24">
        <div className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32 px-4 sm:px-6 md:px-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Hábitos</h1>
            <div className="flex gap-2">
              <Dialog open={mostrarNovoHabito} onOpenChange={setMostrarNovoHabito}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Novo Hábito
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Criar Novo Hábito</DialogTitle>
                  </DialogHeader>
                  <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                    <div className="space-y-2">
                      <Label htmlFor="nome">Nome do Hábito</Label>
                      <Input
                        id="nome"
                        placeholder="Digite o nome do hábito"
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="descricao">Descrição</Label>
                      <Input
                        id="descricao"
                        placeholder="Digite a descrição"
                        value={descricao}
                        onChange={(e) => setDescricao(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="frequencia">Frequência</Label>
                      <Select onValueChange={setFrequencia}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a frequência" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Diário">Diário</SelectItem>
                          <SelectItem value="Semanal">Semanal</SelectItem>
                          <SelectItem value="Mensal">Mensal</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button className="w-full" onClick={criarHabito}>
                      Criar Hábito
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Exibir hábitos do usuário */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {habitos.length > 0 ? (
              habitos.map((habito) => (
                <Card key={habito.id} className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold">{habito.name}</h3>
                      <p className="text-sm text-muted-foreground">{habito.description}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="text-red-500 hover:text-red-700 hover:bg-red-100"
                        onClick={() => confirmarDeletar(habito.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon"
                        className="text-green-600 hover:text-green-800 hover:bg-green-100"
                        onClick={() => incrementarStreak(habito)}
                      >
                        <CheckCircle2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{habito.frequency}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <RotateCcw className="h-4 w-4" />
                      <span>{habito.streak} dias </span>
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <p className="text-muted-foreground text-center">Nenhum hábito cadastrado ainda.</p>
            )}
          </div>
        </div>
      </main>

      {/* Diálogo de confirmação para deletar hábito */}
      <AlertDialog open={mostrarConfirmacaoDeletar} onOpenChange={setMostrarConfirmacaoDeletar}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja deletar este hábito? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setHabitoParaDeletar(null)}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction onClick={deletarHabito} className="bg-red-500 hover:bg-red-700">
              Deletar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}