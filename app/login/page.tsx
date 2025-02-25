"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase";
import { MainNav } from "@/components/main-nav";
import { Moon } from "lucide-react";
import { useRouter } from "next/navigation";
import LoginForm from "@/app/login/login";

type AuthFormInputs = {
  email: string;
  password: string;
};

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AuthFormInputs>();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Verifica se já existe um usuário autenticado
  useEffect(() => {
    async function checkUser() {
      const { data } = await supabase.auth.getUser();
      if (data.user) {
        router.push("/profile");
      }
    }
    checkUser();
  }, [router]);

  const onSubmit = async (data: AuthFormInputs) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });
      if (error) {
        alert("Erro de login: " + error.message);
      } else {
        console.log("Usuário autenticado com sucesso!");
        router.push("/profile"); // Redireciona após login bem-sucedido
      }
    } catch (error) {
      console.error("Erro inesperado:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Cabeçalho */}
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

      {/* Conteúdo principal */}
      <LoginForm />

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
