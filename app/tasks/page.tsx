"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { MainNav } from "@/components/main-nav"
import { Moon, Plus, CheckCircle2, Calendar, Clock, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"

export default function Tarefas() {
  const [tarefas, setTarefas] = useState<any[]>([])
  const [mostrarNovaTarefa, setMostrarNovaTarefa] = useState(false)
  const [novaTarefa, setNovaTarefa] = useState({
    title: '',
    description: '',
    scheduled_at: '',
  })
  const router = useRouter()

  useEffect(() => {
    fetchTarefas()
  }, [router])

  const fetchTarefas = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push("/login")
      return
    }

    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .eq("user_id", user.id)
      .order('scheduled_at', { ascending: true })

    if (error) {
      console.error("Erro ao buscar tarefas:", error)
    } else {
      setTarefas(data)
    }
  }

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Check if form fields are filled
      if (!novaTarefa.title || !novaTarefa.description || !novaTarefa.scheduled_at) {
        console.error('Por favor, preencha todos os campos');
        return;
      }

      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        console.error('Erro de autenticação:', userError);
        router.push("/login");
        return;
      }

      // Create ISO timestamp
      const scheduledDateTime = new Date(novaTarefa.scheduled_at).toISOString();

      console.log('Criando tarefa:', {
        ...novaTarefa,
        scheduled_at: scheduledDateTime,
        user_id: user.id,
        status: 'pendente'
      });

      // Insert task
      const { data, error } = await supabase
        .from('tasks')
        .insert([
          {
            title: novaTarefa.title,
            description: novaTarefa.description,
            scheduled_at: scheduledDateTime,
            status: 'pendente',
            user_id: user.id
          }
        ])
        .select('*')
        .single();

      if (error) {
        console.error('Erro ao criar tarefa:', error.message);
        return;
      }

      if (data) {
        console.log('Tarefa criada com sucesso:', data);
        setTarefas(prevTarefas => [...prevTarefas, data]);
        setMostrarNovaTarefa(false);
        setNovaTarefa({ title: '', description: '', scheduled_at: '' });
        fetchTarefas(); // Refresh tasks
      }

    } catch (error) {
      console.error('Erro inesperado:', error);
    }
  }

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'concluído' ? 'pendente' : 'concluído';
      
      const { error } = await supabase
        .from('tasks')
        .update({ status: newStatus })
        .eq('id', id);
        
      if (error) {
        console.error('Erro ao atualizar status:', error);
        return;
      }
      
      // Update local state to reflect change immediately
      setTarefas(prevTarefas => 
        prevTarefas.map(tarefa => 
          tarefa.id === id ? { ...tarefa, status: newStatus } : tarefa
        )
      );
    } catch (error) {
      console.error('Erro inesperado:', error);
    }
  }

  const handleDeleteTask = async (id: string) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id);
        
      if (error) {
        console.error('Erro ao excluir tarefa:', error);
        return;
      }
      
      // Remove task from local state
      setTarefas(prevTarefas => prevTarefas.filter(tarefa => tarefa.id !== id));
    } catch (error) {
      console.error('Erro inesperado:', error);
    }
  }

  // Format datetime for display
  const formatDateTime = (isoString: string) => {
    if (!isoString) return '';
    
    try {
      const date = new Date(isoString);
      return date.toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return isoString;
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="flex-1 px-6 md:px-12 lg:px-24">
        <div className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32 px-4 sm:px-6 md:px-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Tarefas</h1>
            <Dialog open={mostrarNovaTarefa} onOpenChange={setMostrarNovaTarefa}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Nova Tarefa
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Criar Nova Tarefa</DialogTitle>
                </DialogHeader>
                <form className="space-y-4" onSubmit={handleCreateTask}>
                  <div className="space-y-2">
                    <Label htmlFor="title">Título da Tarefa</Label>
                    <Input 
                      id="title" 
                      value={novaTarefa.title}
                      onChange={(e) => setNovaTarefa({...novaTarefa, title: e.target.value})}
                      placeholder="Digite o título da tarefa" 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Descrição</Label>
                    <Input 
                      id="description" 
                      value={novaTarefa.description}
                      onChange={(e) => setNovaTarefa({...novaTarefa, description: e.target.value})}
                      placeholder="Digite a descrição" 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="scheduled_at">Data e Hora de Entrega</Label>
                    <Input 
                      id="scheduled_at" 
                      type="datetime-local"
                      value={novaTarefa.scheduled_at}
                      onChange={(e) => setNovaTarefa({...novaTarefa, scheduled_at: e.target.value})}
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    Criar Tarefa
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4">
            {tarefas.map((tarefa) => (
              <Card key={tarefa.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold">{tarefa.title}</h3>
                    <p className="text-sm text-muted-foreground">{tarefa.description}</p>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant={tarefa.status === "concluído" ? "ghost" : "outline"}
                      size="icon"
                      className={tarefa.status === "concluído" ? "text-green-500" : ""}
                      onClick={() => handleToggleStatus(tarefa.id, tarefa.status)}
                    >
                      <CheckCircle2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="text-red-500 hover:bg-red-100"
                      onClick={() => handleDeleteTask(tarefa.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDateTime(tarefa.scheduled_at)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span className="capitalize">{tarefa.status}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}