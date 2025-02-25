"use client";

import { useState } from "react";
import { signUp } from "@/hooks/auth";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SignupForm() {
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
    </div>
  );
}
