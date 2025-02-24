"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { MainNav } from "@/components/main-nav"
import { Moon, Plus, CheckCircle2, ShoppingBag, Trash2 } from "lucide-react"
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

const listas = [
  {
    id: 1,
    nome: "Compras de Mercado",
    itens: [
      { id: 1, nome: "Leite", quantidade: 1, concluido: false },
      { id: 2, nome: "Pão", quantidade: 2, concluido: true },
      { id: 3, nome: "Ovos", quantidade: 12, concluido: false },
    ],
  },
  {
    id: 2,
    nome: "Loja de Ferragens",
    itens: [
      { id: 4, nome: "Tinta", quantidade: 1, concluido: false },
      { id: 5, nome: "Pincéis", quantidade: 3, concluido: false },
    ],
  },
]

export default function Compras() {
  const [mostrarNovaLista, setMostrarNovaLista] = useState(false)
  const [mostrarNovoItem, setMostrarNovoItem] = useState(false)
  const [listaSelecionada, setListaSelecionada] = useState<number | null>(null)

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
            <h1 className="text-3xl font-bold">Listas de Compras</h1>
            <Dialog open={mostrarNovaLista} onOpenChange={setMostrarNovaLista}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Nova Lista
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Criar Nova Lista de Compras</DialogTitle>
                </DialogHeader>
                <form className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="nome">Nome da Lista</Label>
                    <Input id="nome" placeholder="Digite o nome da lista" />
                  </div>
                  <Button className="w-full" onClick={() => setMostrarNovaLista(false)}>
                    Criar Lista
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {listas.map((lista) => (
              <Card key={lista.id} className="p-6">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="h-5 w-5" />
                    <h3 className="text-lg font-semibold">{lista.nome}</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <Dialog
                      open={mostrarNovoItem && listaSelecionada === lista.id}
                      onOpenChange={(open) => {
                        setMostrarNovoItem(open)
                        setListaSelecionada(open ? lista.id : null)
                      }}
                    >
                      <DialogTrigger asChild>
                        <Button variant="outline" size="icon">
                          <Plus className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Adicionar Item à {lista.nome}</DialogTitle>
                        </DialogHeader>
                        <form className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="nomeItem">Nome do Item</Label>
                            <Input id="nomeItem" placeholder="Digite o nome do item" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="quantidade">Quantidade</Label>
                            <Input
                              id="quantidade"
                              type="number"
                              min="1"
                              defaultValue="1"
                            />
                          </div>
                          <Button
                            className="w-full"
                            onClick={() => setMostrarNovoItem(false)}
                          >
                            Adicionar Item
                          </Button>
                        </form>
                      </DialogContent>
                    </Dialog>
                    <Button variant="outline" size="icon">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  {lista.itens.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between rounded-lg border p-2"
                    >
                      <div className="flex items-center gap-2">
                        <Button
                          variant={item.concluido ? "ghost" : "outline"}
                          size="icon"
                          className={item.concluido ? "text-green-500" : ""}
                        >
                          <CheckCircle2 className="h-4 w-4" />
                        </Button>
                        <span className={item.concluido ? "line-through" : ""}>
                          {item.nome} (x{item.quantidade})
                        </span>
                      </div>
                      <Button variant="ghost" size="icon">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
