"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { MainNav } from "@/components/main-nav"
import { Moon, Plus, CheckCircle2, Calendar, RotateCcw } from "lucide-react"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const habitos = [
  {
    id: 1,
    nome: "Meditação Matinal",
    descricao: "10 minutos de atenção plena",
    frequencia: "Diário",
    sequencia: 5,
  },
  {
    id: 2,
    nome: "Leitura Noturna",
    descricao: "Ler por 30 minutos antes de dormir",
    frequencia: "Diário",
    sequencia: 3,
  },
  {
    id: 3,
    nome: "Exercício",
    descricao: "30 minutos de atividade física",
    frequencia: "Semanal",
    sequencia: 2,
  },
]

export default function Habitos() {
  const [mostrarNovoHabito, setMostrarNovoHabito] = useState(false)

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
            <h1 className="text-3xl font-bold">Hábitos</h1>
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
                <form className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="nome">Nome do Hábito</Label>
                    <Input id="nome" placeholder="Digite o nome do hábito" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="descricao">Descrição</Label>
                    <Input id="descricao" placeholder="Digite a descrição" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="frequencia">Frequência</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a frequência" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="diario">Diário</SelectItem>
                        <SelectItem value="semanal">Semanal</SelectItem>
                        <SelectItem value="mensal">Mensal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button className="w-full" onClick={() => setMostrarNovoHabito(false)}>
                    Criar Hábito
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {habitos.map((habito) => (
              <Card key={habito.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold">{habito.nome}</h3>
                    <p className="text-sm text-muted-foreground">{habito.descricao}</p>
                  </div>
                  <Button variant="outline" size="icon">
                    <CheckCircle2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="mt-4 flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{habito.frequencia}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <RotateCcw className="h-4 w-4" />
                    <span>{habito.sequencia} dias seguidos</span>
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
