"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { MainNav } from "@/components/main-nav"
import { Moon, Plus, CheckCircle2, Calendar, Clock } from "lucide-react"
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

const tarefas = [
  {
    id: 1,
    titulo: "Preparar para reunião",
    descricao: "Revisar os slides da apresentação",
    dataEntrega: "2024-03-20",
    status: "pendente",
  },
  {
    id: 2,
    titulo: "Fazer compras",
    descricao: "Comprar ingredientes para o jantar",
    dataEntrega: "2024-03-19",
    status: "concluído",
  },
  {
    id: 3,
    titulo: "Exercício",
    descricao: "30 minutos de cardio",
    dataEntrega: "2024-03-19",
    status: "pendente",
  },
]

export default function Tarefas() {
  const [mostrarNovaTarefa, setMostrarNovaTarefa] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-14 items-center px-4 sm:px-6 md:px-8">
          <div className="mr-4 hidden md:flex">
            <a href="/" className="mr-6 flex items-center space-x-2">
              <Moon className="h-6 w-6" />
              <span className="hidden font-bold sm:inline-block">
                SleepWell
              </span>
            </a>
          </div>
          <MainNav />
        </div>
      </header>

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
                <form className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="titulo">Título da Tarefa</Label>
                    <Input id="titulo" placeholder="Digite o título da tarefa" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="descricao">Descrição</Label>
                    <Input id="descricao" placeholder="Digite a descrição" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dataEntrega">Data de Entrega</Label>
                    <Input id="dataEntrega" type="date" />
                  </div>
                  <Button className="w-full" onClick={() => setMostrarNovaTarefa(false)}>
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
                    <h3 className="font-semibold">{tarefa.titulo}</h3>
                    <p className="text-sm text-muted-foreground">{tarefa.descricao}</p>
                  </div>
                  <Button
                    variant={tarefa.status === "concluído" ? "ghost" : "outline"}
                    size="icon"
                    className={tarefa.status === "concluído" ? "text-green-500" : ""}
                  >
                    <CheckCircle2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="mt-4 flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{tarefa.dataEntrega}</span>
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
