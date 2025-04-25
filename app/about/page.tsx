"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { MainNav } from "@/components/main-nav";
import { Moon, User, Heart, Star, Github, Coffee, ArrowRight } from "lucide-react";
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
    <div className="flex min-h-screen flex-col bg-background">
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

      <main className="flex-1">
        {/* Hero Section */}
        <section className="flex flex-col items-center justify-center py-16 md:py-24 lg:py-32 bg-gradient-to-b from-background to-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2 max-w-3xl mx-auto">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
                  Sobre o SleepWell
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground text-lg md:text-xl">
                  Uma plataforma completa para ajudar você a ter uma vida mais saudável e organizada
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="rounded-full bg-primary/10 p-4">
                  <Moon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Monitoramento do Sono</h3>
                <p className="text-muted-foreground">
                  Acompanhe seus padrões de sono e melhore sua qualidade de vida com insights personalizados
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="rounded-full bg-primary/10 p-4">
                  <Star className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Hábitos Saudáveis</h3>
                <p className="text-muted-foreground">
                  Desenvolva e mantenha hábitos que contribuem para seu bem-estar
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="rounded-full bg-primary/10 p-4">
                  <Heart className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Gestão de Tarefas</h3>
                <p className="text-muted-foreground">
                  Organize suas atividades diárias de forma eficiente e produtiva
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="flex items-center justify-center py-16 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2 max-w-3xl mx-auto">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Comece Sua Jornada
                </h2>
                <p className="mx-auto max-w-[600px] text-muted-foreground text-lg md:text-xl">
                  Junte-se a nós e transforme seus hábitos diários
                </p>
              </div>
              <div className="flex gap-4 mt-6">
                <Button size="lg" className="inline-flex items-center">
                  <Link href="/signup" className="flex items-center">
                    Começar Agora
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-8 md:py-12">
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 md:flex-row md:px-8">
          <div className="flex items-center gap-4">
            <Moon className="h-6 w-6" />
            <span className="text-sm font-medium">SleepWell</span>
            <p className="text-center text-sm text-muted-foreground">
              Feito com carinho para você ser cada dia melhor
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Link href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
              <Github className="h-5 w-5" />
            </Link>
            <Link href="https://buymeacoffee.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
              <Coffee className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
