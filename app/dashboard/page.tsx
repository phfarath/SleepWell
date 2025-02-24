"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { MainNav } from "@/components/main-nav"
import { Moon, Sun, Bed, Clock, Activity, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts"
import { supabase } from "@/lib/supabase"
import { format } from "date-fns"

type RegistroSono = {
  bedtime: string
  wake_time: string
  quality: number
  mood: string
}

export default function Dashboard() {
  const [dadosSono, setDadosSono] = useState<any[]>([])
  const { toast } = useToast()

  useEffect(() => {
    const buscarDadosSono = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
          toast({
            title: "Autenticação necessária",
            description: "Por favor, faça login para ver seu painel",
            variant: "destructive",
          })
          return
        }

        const { data, error } = await supabase
          .from("sleep_logs")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(7)

        if (error) throw error

        const dadosFormatados = data.map((log: RegistroSono) => ({
          dia: format(new Date(log.bedtime), "EEE"),
          horas: (new Date(log.wake_time).getTime() - new Date(log.bedtime).getTime()) / (1000 * 60 * 60),
          qualidade: log.quality,
        }))

        setDadosSono(dadosFormatados.reverse())
      } catch (error) {
        console.error("Erro ao buscar dados do sono:", error)
        toast({
          title: "Erro",
          description: "Falha ao carregar dados do sono",
          variant: "destructive",
        })
      }
    }

    buscarDadosSono()
  }, [toast])

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
            <h1 className="text-3xl font-bold">Painel</h1>
            <Button>
              <Clock className="mr-2 h-4 w-4" />
              Registrar Sono
            </Button>
          </div>

          <div className="grid gap-6 md:grid-cols-4">
            <Card className="p-4">
              <div className="flex items-center gap-2">
                <Bed className="h-4 w-4 text-primary" />
                <h3 className="font-semibold">Média de Sono</h3>
              </div>
              <p className="mt-2 text-2xl font-bold">
                {dadosSono.length > 0
                  ? `${(dadosSono.reduce((acc, curr) => acc + curr.horas, 0) / dadosSono.length).toFixed(1)}h`
                  : "N/A"}
              </p>
              <p className="text-sm text-muted-foreground">Últimos 7 dias</p>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-primary" />
                <h3 className="font-semibold">Qualidade do Sono</h3>
              </div>
              <p className="mt-2 text-2xl font-bold">
                {dadosSono.length > 0
                  ? `${(dadosSono.reduce((acc, curr) => acc + curr.qualidade, 0) / dadosSono.length).toFixed(0)}%`
                  : "N/A"}
              </p>
              <p className="text-sm text-muted-foreground">Últimos 7 dias</p>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-2">
                <Sun className="h-4 w-4 text-primary" />
                <h3 className="font-semibold">Média Hora de Acordar</h3>
              </div>
              <p className="mt-2 text-2xl font-bold">7:30 AM</p>
              <p className="text-sm text-muted-foreground">Esta Semana</p>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-2">
                <Moon className="h-4 w-4 text-primary" />
                <h3 className="font-semibold">Média Hora de Dormir</h3>
              </div>
              <p className="mt-2 text-2xl font-bold">11:00 PM</p>
              <p className="text-sm text-muted-foreground">Esta Semana</p>
            </Card>
          </div>

          <Card className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold">Tendências do Sono</h2>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dadosSono}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="dia" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="horas"
                    stroke="hsl(var(--chart-1))"
                    strokeWidth={2}
                    name="Horas de Sono"
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="qualidade"
                    stroke="hsl(var(--chart-2))"
                    strokeWidth={2}
                    name="Qualidade do Sono"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      </main>
    </div>
  )
}
