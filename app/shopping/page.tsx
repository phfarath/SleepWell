"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
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
import { supabase } from "@/lib/supabase"

export default function Compras() {
  const [listas, setListas] = useState<any[]>([])
  const [mostrarNovaLista, setMostrarNovaLista] = useState(false)
  const [mostrarNovoItem, setMostrarNovoItem] = useState(false)
  const [listaSelecionada, setListaSelecionada] = useState(null)
  const [carregando, setCarregando] = useState(true)
  const [novaLista, setNovaLista] = useState("")
  const [novoItem, setNovoItem] = useState({ nome: "", quantidade: 1 })

  // Fetch all shopping lists and their items
  const buscarListas = async () => {
    try {
      setCarregando(true)

      // Fetch lists
      const { data: listasData, error: listasError } = await supabase
        .from('shopping_lists')
        .select('*')
        .order('created_at', { ascending: false })

      if (listasError) {
        console.error('Erro ao buscar listas:', listasError)
        throw listasError
      }

      if (!listasData) {
        setListas([])
        return
      }

      // For each list, fetch its items
      const listasComItens = await Promise.all(
        listasData.map(async (lista) => {
          const { data: itensData, error: itensError } = await supabase
            .from('shopping_items')
            .select('*')
            .eq('list_id', lista.id)
            .order('created_at', { ascending: true })

          if (itensError) {
            console.error('Erro ao buscar itens:', itensError, 'para lista:', lista.id)
            throw itensError
          }

          return {
            ...lista,
            itens: (itensData || []).map(item => ({
              ...item,
              concluido: Boolean(item.completed)
            }))
          }
        })
      )

      setListas(listasComItens)
    } catch (error) {
      console.error('Erro completo:', JSON.stringify(error, null, 2))
      alert('Não foi possível carregar as listas de compras')
    } finally {
      setCarregando(false)
    }
  }

  // Create a new shopping list
  const criarNovaLista = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!novaLista.trim()) return

    try {
      const { data, error } = await supabase
        .from('shopping_lists')
        .insert([{
          name: novaLista,
          user_id: (await supabase.auth.getUser()).data.user?.id // Add the user ID
        }])
        .select()

      if (error) {
        console.error('Erro detalhado ao criar lista:', error)
        throw error
      }

      // Refresh lists after creation
      buscarListas()
      setNovaLista("")
      setMostrarNovaLista(false)
    } catch (error) {
      console.error('Erro ao criar lista:', error)
      if (error instanceof Error) {
        alert('Não foi possível criar a lista de compras: ' + error.message)
      } else {
        alert('Não foi possível criar a lista de compras')
      }
    }
  }

  // Add a new item to a shopping list
  const adicionarItem = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!novoItem.nome.trim() || !listaSelecionada) return

    try {
      const { data, error } = await supabase
        .from('shopping_items')
        .insert([{
          list_id: listaSelecionada,
          name: novoItem.nome,
          quantity: novoItem.quantidade,
          completed: false
        }])
        .select()

      if (error) {
        console.error('Erro detalhado ao adicionar item:', error)
        throw error
      }

      // Refresh lists after adding item
      buscarListas()
      setNovoItem({ nome: "", quantidade: 1 })
      setMostrarNovoItem(false)
    } catch (error) {
      console.error('Erro ao adicionar item:', error)
      if (error instanceof Error) {
        alert('Não foi possível adicionar o item à lista: ' + error.message)
      } else {
        alert('Não foi possível adicionar o item à lista')
      }
    }
  }

  // Delete a shopping list
  const excluirLista = async (listaId: string | number) => {
    if (!confirm('Tem certeza que deseja excluir esta lista?')) return

    try {
      // First delete all items in the list
      const { error: itensError } = await supabase
        .from('shopping_items')
        .delete()
        .eq('list_id', listaId)

      if (itensError) {
        console.error('Erro ao excluir itens da lista:', itensError)
        throw itensError
      }

      // Then delete the list itself
      const { error } = await supabase
        .from('shopping_lists')
        .delete()
        .eq('id', listaId)

      if (error) {
        console.error('Erro ao excluir a lista:', error)
        throw error
      }

      // Refresh lists after deletion
      buscarListas()
    } catch (error) {
      console.error('Erro ao excluir lista:', error)
      if (error instanceof Error) {
        alert('Não foi possível excluir a lista de compras: ' + error.message)
      } else {
        alert('Não foi possível excluir a lista de compras')
      }
    }
  }

  // Delete an item from a shopping list
  const excluirItem = async (itemId: string | number) => {
    try {
      const { error } = await supabase
        .from('shopping_items')
        .delete()
        .eq('id', itemId)

      if (error) {
        console.error('Erro ao excluir item:', error)
        throw error
      }

      // Refresh lists after item deletion
      buscarListas()
    } catch (error) {
      console.error('Erro ao excluir item:', error)
      if (error instanceof Error) {
        alert('Não foi possível excluir o item da lista: ' + error.message)
      } else {
        alert('Não foi possível excluir o item da lista')
      }
    }
  }

  // Toggle item completion status
  const alternarConclusao = async (item: { id: string | number; concluido: boolean }) => {
    try {
      // Make sure we're updating with the correct value
      const { error } = await supabase
        .from('shopping_items')
        .update({ completed: !item.concluido })
        .eq('id', item.id)

      if (error) {
        console.error('Erro ao atualizar status do item:', error)
        throw error
      }

      // Refresh lists after updating item
      buscarListas()
    } catch (error) {
      console.error('Erro ao atualizar item:', error)
      if (error instanceof Error) {
        alert('Não foi possível atualizar o status do item: ' + error.message)
      } else {
        alert('Não foi possível atualizar o status do item')
      }
    }
  }
  // Add this near the top of your component to verify authentication
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      console.log("Authentication status:", session ? "Authenticated" : "Not authenticated")
      if (session) console.log("User ID:", session.user.id)
    }

    checkAuth()
  }, [])

  // Load lists when component mounts
  useEffect(() => {
    buscarListas()

    // Setup real-time subscription for changes
    const listasSubscription = supabase
      .channel('table-db-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'shopping_lists'
      }, () => {
        buscarListas()
      })
      .subscribe()

    // Subscribe to changes in shopping_items table
    const itensSubscription = supabase
      .channel('items-db-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'shopping_items'
      }, () => {
        buscarListas()
      })
      .subscribe()

    // Cleanup subscriptions when component unmounts
    return () => {
      supabase.removeChannel(listasSubscription)
      supabase.removeChannel(itensSubscription)
    }
  }, [])

  return (
    <div className="min-h-screen bg-background">
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
                <form className="space-y-4" onSubmit={criarNovaLista}>
                  <div className="space-y-2">
                    <Label htmlFor="nome">Nome da Lista</Label>
                    <Input
                      id="nome"
                      placeholder="Digite o nome da lista"
                      value={novaLista}
                      onChange={(e) => setNovaLista(e.target.value)}
                      required
                    />
                  </div>
                  <Button className="w-full" type="submit">
                    Criar Lista
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {carregando ? (
            <div className="flex justify-center">
              <p>Carregando listas...</p>
            </div>
          ) : listas.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingBag className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-lg font-medium">Nenhuma lista encontrada</h3>
              <p className="mt-1 text-gray-500">Comece criando sua primeira lista de compras.</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {listas.map((lista) => (
                <Card key={lista.id} className="p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ShoppingBag className="h-5 w-5" />
                      <h3 className="text-lg font-semibold">{lista.name}</h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <Dialog
                        open={mostrarNovoItem && listaSelecionada === lista.id}
                        onOpenChange={(open) => {
                          setMostrarNovoItem(open)
                          setListaSelecionada(open ? lista.id : null)
                          if (!open) {
                            setNovoItem({ nome: "", quantidade: 1 })
                          }
                        }}
                      >
                        <DialogTrigger asChild>
                          <Button variant="outline" size="icon">
                            <Plus className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Adicionar Item à {lista.name}</DialogTitle>
                          </DialogHeader>
                          <form className="space-y-4" onSubmit={adicionarItem}>
                            <div className="space-y-2">
                              <Label htmlFor="nomeItem">Nome do Item</Label>
                              <Input
                                id="nomeItem"
                                placeholder="Digite o nome do item"
                                value={novoItem.nome}
                                onChange={(e) => setNovoItem({ ...novoItem, nome: e.target.value })}
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="quantidade">Quantidade</Label>
                              <Input
                                id="quantidade"
                                type="number"
                                min="1"
                                value={novoItem.quantidade}
                                onChange={(e) => setNovoItem({ ...novoItem, quantidade: parseInt(e.target.value) || 1 })}
                                required
                              />
                            </div>
                            <Button className="w-full" type="submit">
                              Adicionar Item
                            </Button>
                          </form>
                        </DialogContent>
                      </Dialog>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => excluirLista(lista.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {!lista.itens || lista.itens.length === 0 ? (
                      <p className="text-gray-500 text-sm text-center py-4">
                        Nenhum item nesta lista. Adicione o primeiro item.
                      </p>
                    ) : (
                      lista.itens.map((item: any) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between rounded-lg border p-2"
                        >
                          <div className="flex items-center gap-2">
                            <Button
                              variant={item.concluido ? "ghost" : "outline"}
                              size="icon"
                              className={item.concluido ? "text-green-500" : ""}
                              onClick={() => alternarConclusao(item)}
                            >
                              <CheckCircle2 className="h-4 w-4" />
                            </Button>
                            <span className={item.concluido ? "line-through" : ""}>
                              {item.name} (x{item.quantity})
                            </span>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => excluirItem(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}