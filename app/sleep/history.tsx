"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { format, differenceInHours, differenceInMinutes } from "date-fns";
import { ArrowLeft, BedDouble, Sunrise, Moon, Smile, Clock, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type SleepLog = {
  id: string;
  bedtime: string;
  wake_time: string;
  quality: number;
  mood: string;
  notes: string;
};

export default function SleepHistory() {
  const [logs, setLogs] = useState<SleepLog[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const fetchSleepLogs = async () => {
      try {
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.push("/login"); // Se não estiver autenticado, redireciona para login
          return;
        }

        const { data, error } = await supabase
          .from("sleep_logs")
          .select("*")
          .eq("user_id", user.id)
          .order("bedtime", { ascending: false });

        if (error) {
          throw error;
        }

        setLogs(data || []);
      } catch (error) {
        console.error("Erro ao buscar registros de sono:", error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar os registros de sono.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSleepLogs();
  }, [router, toast]);

  // Função para ajustar o horário para GMT-3
  const adjustToGMT3 = (dateString: string) => {
    const date = new Date(dateString);
    return new Date(date.getTime() + 3 * 60 * 60 * 1000);
  };

  // Função para calcular a duração do sono em horas e minutos
  const calcularDuracaoSono = (bedtime: string, wakeTime: string) => {
    const inicio = adjustToGMT3(bedtime);
    const fim = adjustToGMT3(wakeTime);
    
    const horasCompletas = differenceInHours(fim, inicio);
    const minutosRestantes = differenceInMinutes(fim, inicio) % 60;
    
    return `${horasCompletas}h ${minutosRestantes}m`;
  };

  // Função para determinar a cor baseada na qualidade do sono
  const getQualityColor = (quality: number) => {
    if (quality >= 80) return "bg-green-100 text-green-800";
    if (quality >= 60) return "bg-blue-100 text-blue-800";
    if (quality >= 40) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  // Função para obter emoji baseado no humor
  const getMoodIcon = (mood: string) => {
    switch (mood.toLowerCase()) {
      case "ótimo":
      case "otimo":
      case "excelente":
        return "😁";
      case "bom":
        return "🙂";
      case "regular":
      case "neutro":
        return "😐";
      case "ruim":
        return "😔";
      case "péssimo":
      case "pessimo":
        return "😫";
      default:
        return "😊";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="flex-1 px-6 md:px-12 lg:px-24">
        <div className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32 px-4 sm:px-6 md:px-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Histórico do Sono</h1>
            <Button variant="outline" onClick={() => router.push("/profile/sleep")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Button>
          </div>

          {loading ? (
            <div className="flex justify-center py-10">
              <div className="animate-pulse">Carregando...</div>
            </div>
          ) : logs.length === 0 ? (
            <div className="text-center py-10">
              <BedDouble className="mx-auto h-12 w-12 text-muted-foreground" />
              <p className="mt-4 text-muted-foreground">Nenhum registro de sono encontrado.</p>
              <Button 
                className="mt-4" 
                onClick={() => router.push("/profile/sleep")}
              >
                Adicionar Registro de Sono
              </Button>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {logs.map((log) => (
                <Card key={log.id} className="p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="font-semibold text-lg">
                      {format(new Date(log.bedtime), "dd/MM/yyyy")}
                    </h3>
                    <span 
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getQualityColor(log.quality)}`}
                    >
                      {log.quality}% qualidade
                    </span>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Moon className="h-4 w-4 text-indigo-500" />
                      <span>Dormiu às {format(adjustToGMT3(log.bedtime), "HH:mm")}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm">
                      <Sunrise className="h-4 w-4 text-amber-500" />
                      <span>Acordou às {format(adjustToGMT3(log.wake_time), "HH:mm")}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-blue-500" />
                      <span>Duração: {calcularDuracaoSono(log.bedtime, log.wake_time)}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm">
                      <Smile className="h-4 w-4 text-green-500" />
                      <span>Humor: {log.mood} {getMoodIcon(log.mood)}</span>
                    </div>
                    
                    {log.notes && (
                      <div className="flex gap-2 text-sm mt-2 pt-2 border-t border-gray-100">
                        <FileText className="h-4 w-4 text-gray-500 flex-shrink-0 mt-0.5" />
                        <p className="text-muted-foreground">{log.notes}</p>
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}