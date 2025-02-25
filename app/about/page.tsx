"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import About from "@/app/about/page";
import { MainNav } from "@/components/main-nav";
import { Moon } from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        router.push("/about");
      } else {
        setUser(data.user);
      }
    };
    checkUser();
  }, [router]);

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-14 items-center px-4 sm:px-6 md:px-8">
          <div className="mr-4 hidden md:flex">
            <Link href="/" className="mr-6 flex items-center space-x-2">
              <Moon className="h-6 w-6" />
              <span className="hidden font-bold sm:inline-block">
                SleepWell
              </span>
            </Link>
          </div>
          <MainNav />
        </div>
      </header>

      <div className="min-h-screen bg-background flex flex-col">
      {/* Cabeçalho */}
      <header className="border-b p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <User className="h-6 w-6" />
          <h1 className="text-xl font-bold">Sobre o Projeto</h1>
        </div>
      </header>

      {/* Conteúdo */}
      <main className="flex-1 p-6 max-w-4xl mx-auto">
        <h2 className="text-2xl font-semibold mb-4">Bem-vindo ao SleepWell</h2>
        <p className="text-muted-foreground">
          O SleepWell é um projeto desenvolvido para ajudar os usuários a
          monitorar seus hábitos de sono, criar listas de tarefas, gerenciar hábitos e muito mais.
        </p>

        <h3 className="text-xl font-semibold mt-6">📌 Funcionalidades</h3>
        <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
          <li>Monitoramento da qualidade do sono</li>
          <li>Registro de hábitos e tarefas</li>
          <li>Lista de compras interativa</li>
          <li>Painel de estatísticas</li>
          <li>Interface responsiva e amigável</li>
        </ul>

        <h3 className="text-xl font-semibold mt-6">📅 Futuras Atualizações</h3>
        <p className="text-muted-foreground">
          Estamos sempre trabalhando para trazer novas funcionalidades e melhorias
          para otimizar a sua experiência!
        </p>
      </main>
    </div>

      <footer className="border-t py-6 md:py-0">
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row px-4 sm:px-6 md:px-8">
          <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
            <Moon className="h-6 w-6" />
            <p className="text-center text-sm leading-loose md:text-left">
              Feito com carinho para você ser cada dia melhor
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
