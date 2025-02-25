"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Sun, Bed, Clock, Activity, TrendingUp, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { supabase } from "@/lib/supabase";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

type RegistroSono = {
  bedtime: string;
  wake_time: string;
  quality: number;
  mood: string;
};

export default function Dashboard() {
  const [dadosSono, setDadosSono] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const buscarDadosSono = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
          toast({
            title: "Autenticação necessária",
            description: "Por favor, faça login para ver seu painel",
            variant: "destructive",
          });
          return;
        }

        const { data, error } = await supabase
          .from("sleep_logs")
          .select("*")
          .eq("user_id", user.id)
          .order("bedtime", { ascending: false })
          .limit(7);

        if (error) throw error;

        const dadosFormatados = data.map((log: RegistroSono) => {
          const bedtime = new Date(log.bedtime);
          const wakeTime = new Date(log.wake_time);
          const horasDormidas = (wakeTime.getTime() - bedtime.getTime()) / (1000 * 60 * 60);

          return {
            dia: format(bedtime, "EEEE", { locale: ptBR }), // Nome do dia da semana
            horas: horasDormidas.toFixed(1),
            qualidade: log.quality,
            horaDormir: format(bedtime, "HH:mm"),
            horaAcordar: format(wakeTime, "HH:mm"),
          };
        });

        setDadosSono(dadosFormatados.reverse());
      } catch (error) {
        console.error("Erro ao buscar dados do sono:", error);
        toast({
          title: "Erro",
          description: "Falha ao carregar dados do sono",
          variant: "destructive",
        });
      }
    };

    buscarDadosSono();
  }, [toast]);

  // Cálculo das médias
  const mediaSono = dadosSono.length
    ? (dadosSono.reduce((acc, curr) => acc + parseFloat(curr.horas), 0) / dadosSono.length).toFixed(1)
    : "N/A";

  const mediaQualidade = dadosSono.length
    ? (dadosSono.reduce((acc, curr) => acc + curr.qualidade, 0) / dadosSono.length).toFixed(0)
    : "N/A";

  const mediaHoraAcordar = dadosSono.length
    ? dadosSono[Math.floor(dadosSono.length / 2)].horaAcordar // directly use the formatted time
    : "N/A";

  const mediaHoraDormir = dadosSono.length
    ? dadosSono[Math.floor(dadosSono.length / 2)].horaDormir // directly use the formatted time
    : "N/A";

  return (
    <div className="min-h-screen bg-background">
      <main className="flex-1 px-6 md:px-12 lg:px-24">
        <div className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32 px-4 sm:px-6 md:px-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Painel</h1>
            <Button onClick={() => window.location.href = "/profile/sleep"}>
              <Clock className="mr-2 h-4 w-4" />
              Registrar Sono
            </Button>
          </div>

          <div className="grid gap-6 md:grid-cols-4">
            {/* Média de Sono */}
            <Card className="p-4">
              <div className="flex items-center gap-2">
                <Bed className="h-4 w-4 text-primary" />
                <h3 className="font-semibold">Média de Sono</h3>
              </div>
              <p className="mt-2 text-2xl font-bold">{mediaSono}h</p>
              <p className="text-sm text-muted-foreground">Últimos 7 dias</p>
            </Card>

            {/* Qualidade do Sono */}
            <Card className="p-4">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-primary" />
                <h3 className="font-semibold">Qualidade do Sono</h3>
              </div>
              <p className="mt-2 text-2xl font-bold">{mediaQualidade}%</p>
              <p className="text-sm text-muted-foreground">Últimos 7 dias</p>
            </Card>

            {/* Média Hora de Acordar */}
            <Card className="p-4">
              <div className="flex items-center gap-2">
                <Sun className="h-4 w-4 text-primary" />
                <h3 className="font-semibold">Média Hora de Acordar</h3>
              </div>
              <p className="mt-2 text-2xl font-bold">{mediaHoraAcordar}</p>
              <p className="text-sm text-muted-foreground">Esta Semana</p>
            </Card>

            {/* Média Hora de Dormir */}
            <Card className="p-4">
              <div className="flex items-center gap-2">
                <Moon className="h-4 w-4 text-primary" />
                <h3 className="font-semibold">Média Hora de Dormir</h3>
              </div>
              <p className="mt-2 text-2xl font-bold">{mediaHoraDormir}</p>
              <p className="text-sm text-muted-foreground">Esta Semana</p>
            </Card>
          </div>

          {/* Gráfico de Tendências do Sono */}
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
  );
}
