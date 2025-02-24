"use client";

import { useState } from "react";
import { signUp } from "@/hooks/auth";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MainNav } from "@/components/main-nav";
import { Moon } from "lucide-react";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signUp(email, password, name);
      alert("Cadastro realizado! Verifique seu email.");
      router.push("/login"); // Redireciona para login após cadastro
    } catch (error: any) {
      alert("Erro ao criar conta: " + error.message);
    }
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Cabeçalho (opcional) */}
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

      {/* Conteúdo principal (formulário) */}
      <div className="flex flex-1 items-center justify-center">
      <form onSubmit={handleSignup} className="space-y-4 p-6 border rounded-lg shadow-md w-96 dark:border-slate-900 dark:bg-indigo-950/30">
        <h2 className="text-2xl font-semibold text-center">Criar Conta</h2>
        <Input
          type="text"
          placeholder="Nome"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <Input
          type="email"
          placeholder="E-mail"
          value={email}
          autoComplete="email"
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          type="password"
          placeholder="Senha"
          value={password}
          autoComplete="current-password"
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Criando conta..." : "Cadastrar"}
        </Button>
        <p className="text-sm text-center">
          Já tem uma conta? <a href="/login" className="text-blue-600">Faça login</a>
        </p>
      </form>
    </div>

      {/* Rodapé (opcional) */}
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
