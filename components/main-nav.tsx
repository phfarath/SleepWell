"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Menu } from "lucide-react";
import { useTheme } from "next-themes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type MainNavProps = {
  hideAuthLinks?: boolean; // Se true, oculta os links de Login e Cadastro
};

type Route = {
  href: string;
  label: string;
  active: boolean;
  protected?: boolean; // Se true, exibe apenas se o usuário estiver autenticado
};

export function MainNav({ hideAuthLinks = false }: MainNavProps) {
  const pathname = usePathname();
  const { setTheme } = useTheme();
  const [authenticated, setAuthenticated] = useState<boolean>(false);

  // Verifica se o usuário está autenticado
  useEffect(() => {
    async function checkAuth() {
      const { data } = await supabase.auth.getSession();
      setAuthenticated(!!data.session);
    }
    checkAuth();
  }, []);

  // Defina todas as rotas com um indicador "protected" para as que precisam de autenticação
  const allRoutes: Route[] = [
    { href: "/profile/dashboard", label: "Dashboard", active: pathname === "/dashboard", protected: true },
    { href: "/profile/sleep", label: "Sono", active: pathname === "/sleep", protected: true },
    { href: "/profile/habits", label: "Hábitos", active: pathname === "/habits", protected: true },
    { href: "/profile/tasks", label: "Tarefas", active: pathname === "/tasks", protected: true },
    { href: "/profile/shopping", label: "Compras", active: pathname === "/shopping", protected: true },
    { href: "/profile", label: "Meu Perfil", active: pathname === "/profile", protected: true },
    { href: "/about", label: "About", active: pathname === "/about", protected: false },
    { href: "/login", label: "Login", active: pathname === "/login", protected: false }
  ];

  // Se o usuário não estiver autenticado, filtre as rotas protegidas
  let routes = authenticated ? allRoutes : allRoutes.filter((route) => !route.protected);

  // Se hideAuthLinks for true, filtre as rotas de login e cadastro
  if (hideAuthLinks) {
    routes = routes.filter(
      (route) => route.href !== "/login" && route.href !== "/signup" && route.href !== "/about"
    );
  }

  return (
    <div className="flex items-center space-x-4 lg:space-x-6">
      <div className="md:hidden">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            {routes.map((route) => (
              <DropdownMenuItem key={route.href}>
                <Link
                  href={route.href}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-primary",
                    route.active
                      ? "text-black dark:text-white"
                      : "text-muted-foreground"
                  )}
                >
                  {route.label}
                </Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="hidden md:flex items-center space-x-4 lg:space-x-6">
        {routes.map((route) => (
          <Link
            key={route.href}
            href={route.href}
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              route.active ? "text-black dark:text-white" : "text-muted-foreground"
            )}
          >
            {route.label}
          </Link>
        ))}
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon">
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setTheme("light")}>
            Light
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme("dark")}>
            Dark
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme("system")}>
            System
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
