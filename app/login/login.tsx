"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

type AuthFormInputs = {
    email: string;
    password: string;
  };
  
  export default function LoginForm() {
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
          {/* Conteúdo principal */}
          <main className="flex flex-1 items-center justify-center">
            <div className="w-full max-w-md rounded-md border bg-white p-8 shadow-sm dark:border-slate-900 dark:bg-indigo-950/30">
              <h2 className="mb-6 text-center text-2xl font-semibold text-gray-800 dark:text-gray-100">
                Entrar na sua conta
              </h2>
    
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label
                    htmlFor="email"
                    className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-200"
                  >
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seuemail@exemplo.com"
                    autoComplete="email"
                    {...register("email", { required: "O email é obrigatório" })}
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.email.message}
                    </p>
                  )}
                </div>
    
                <div>
                  <label
                    htmlFor="password"
                    className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-200"
                  >
                    Senha
                  </label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Sua senha"
                    autoComplete="current-password"
                    {...register("password", { required: "A senha é obrigatória" })}
                  />
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.password.message}
                    </p>
                  )}
                </div>
    
                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? "Carregando..." : "Entrar"}
                </Button>
              </form>
    
              <div className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
                Ainda não tem uma conta?{" "}
                <a
                  href="/signup"
                  className="text-blue-600 hover:underline dark:text-blue-400"
                >
                  Criar conta
                </a>
              </div>
            </div>
          </main>
        </div>
      );
    }
    