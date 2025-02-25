"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Card } from "@/components/ui/card";
import { Moon, Clock, BedDouble, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

type SleepLogForm = {
  bedtime: string;
  wakeTime: string;
  mood: string;
  notes: string;
};

export default function Sleep() {
  const [quality, setQuality] = useState([50]);
  const [mood, setMood] = useState(""); // Estado para capturar o humor selecionado
  const { toast } = useToast();
  const { register, handleSubmit, reset, setValue, getValues, formState: { isSubmitting } } = useForm<SleepLogForm>();
  const router = useRouter(); // Hook para navegação

  const onSubmit = async (data: SleepLogForm) => {
    console.log("Dados enviados:", data);

    if (!data.mood) {
      console.error("Erro: mood está undefined!");
      toast({
        title: "Erro no formulário",
        description: "Por favor, selecione um humor válido.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        toast({
          title: "Autenticação necessária",
          description: "Por favor, faça login para registrar seu sono",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase.from("sleep_logs").insert({
        user_id: user.id,
        bedtime: new Date(new Date(data.bedtime).getTime() - 3 * 60 * 60 * 1000).toISOString(),
        wake_time: new Date(new Date(data.wakeTime).getTime() - 3 * 60 * 60 * 1000).toISOString(),
        quality: quality[0],
        mood: data.mood,
        notes: data.notes,
      });

      if (error) throw error;

      toast({
        title: "Registro de sono salvo",
        description: "Seu registro de sono foi salvo com sucesso",
      });

      reset();
    } catch (error) {
      console.error("Erro ao salvar registro de sono:", error);
      toast({
        title: "Erro",
        description: "Falha ao salvar o registro de sono. Por favor, tente novamente.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="flex-1 px-6 md:px-12 lg:px-24">
        <div className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32 px-4 sm:px-6 md:px-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Registro do Sono</h1>
            <Button variant="outline" onClick={() => router.push("/profile/sleep/history")}>
              <Clock className="mr-2 h-4 w-4" />
              Ver Histórico
            </Button>
          </div>

          <Card className="p-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="bedtime">Horário que Dormiu</Label>
                  <Input
                    id="bedtime"
                    type="datetime-local"
                    {...register("bedtime", { required: true })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="wakeTime">Horário que Acordou</Label>
                  <Input
                    id="wakeTime"
                    type="datetime-local"
                    {...register("wakeTime", { required: true })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Qualidade do Sono</Label>
                <Slider
                  value={quality}
                  onValueChange={setQuality}
                  max={100}
                  step={1}
                  className="py-4"
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Ruim</span>
                  <span>Excelente</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="mood">Humor ao Acordar</Label>
                <Select
                  onValueChange={(value) => setValue("mood", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione seu humor" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="energized">Energizado</SelectItem>
                    <SelectItem value="refreshed">Revigorado</SelectItem>
                    <SelectItem value="neutral">Neutro</SelectItem>
                    <SelectItem value="tired">Cansado</SelectItem>
                    <SelectItem value="exhausted">Exausto</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notas</Label>
                <textarea
                  id="notes"
                  {...register("notes")}
                  className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  placeholder="Notas adicionais sobre seu sono..."
                />
              </div>

              <Button className="w-full" type="submit" disabled={isSubmitting}>
                <BedDouble className="mr-2 h-4 w-4" />
                {isSubmitting ? "Salvando..." : "Salvar Registro de Sono"}
              </Button>
            </form>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-500">
              <AlertCircle className="h-5 w-5" />
              <p className="text-sm">
                Registre seu sono com frequência para receber insights e recomendações personalizadas.
              </p>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
