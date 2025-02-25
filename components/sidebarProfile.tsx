"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Menu, Home, Grid, PlusSquare, List, Calendar, User } from "lucide-react";
import { cn } from "@/lib/utils";
import ".//styles/styles.css"
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/router";
import { useEffect } from "react";

/**
 * Componente que replica o HTML, CSS e JS do snippet original em TSX/React.
 * Mantém as classes: .close, .show, .rotate, .dropdown-btn, etc.
 */
export default function SidebarPage() {
  // Controla se a sidebar está "fechada" (.close) ou aberta
  const [isClosed, setIsClosed] = useState(false);
  // Armazena o índice do submenu aberto; null se nenhum está aberto
  const [openSubMenu, setOpenSubMenu] = useState<number | null>(null);

  const [user, setUser] = useState<any>(null);
    const router = useRouter();
  
    useEffect(() => {
      async function checkUser() {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.push("/login");
          return;
        }
        setUser(user);
      }
      checkUser();
    }, [router]);
  
    if (!user) {
      return <p>Carregando...</p>;
    }

  /**
   * Fecha/abre a sidebar e fecha todos submenus.
   * Corresponde a toggleSidebar() no JS original.
   */
  function handleToggleSidebar() {
    setIsClosed((prev) => !prev);
    // Fecha qualquer submenu aberto
    setOpenSubMenu(null);
  }

  /**
   * Abre/fecha um submenu específico (index).
   * Se a sidebar estiver fechada, abre antes de exibir submenu.
   */
  function handleToggleSubMenu(index: number) {
    // Se o submenu já está aberto, fecha. Se não, abre e fecha os outros.
    setOpenSubMenu((prev) => (prev === index ? null : index));

    // Se a sidebar estiver fechada, abra
    if (isClosed) {
      setIsClosed(false);
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-[#11121a] text-[#e6e6ef] grid grid-cols-[auto_1fr]">
      {/* SIDEBAR */}
      <nav
        id="sidebar"
        className={cn(
          "relative h-screen border-r border-[#42434a] transition-all duration-300 text-wrap",
          // Se isClosed for true, adiciona a classe .close
          isClosed ? "close" : "w-[300px] px-[1em]"
        )}
        style={{ backgroundColor: "#11121a" }}
      >
        <ul className="list-none">
          {/* Cabeçalho da sidebar */}
          <li className="flex items-center justify-end mb-4 mt-2">
            {/* Logo */}
            {!isClosed && (
              <span className="logo font-semibold text-xl mr-auto">SleepWell</span>
            )}
            <button
              onClick={handleToggleSidebar}
              id="toggle-btn"
              className={cn(
                "p-2 hover:bg-[#222533] rounded transition-colors",
                // Se estiver fechado, podemos adicionar .rotate ou não, a seu critério
                // Ex.: isClosed && "rotate"
              )}
            >
              <Menu className="h-5 w-5" fill="#e8eaed" />
            </button>
          </li>

          {/* HOME */}
          <li className="active mb-1">
            <Link
              href="/"
              className="flex items-center gap-3 py-3 px-2 rounded hover:bg-[#222533] transition-colors"
            >
              <Home fill="#e8eaed" className="flex-shrink-0" />
              {!isClosed && <span>Início</span>}
            </Link>
          </li>

          {/* DASHBOARD */}
          <li className="mb-1">
            <Link
              href="/dashboard"
              className="flex items-center gap-3 py-3 px-2 rounded hover:bg-[#222533] transition-colors"
            >
              <Grid fill="#e8eaed" className="flex-shrink-0" />
              {!isClosed && <span>Dashboard</span>}
            </Link>
          </li>

          {/* SONO */}
          <li className="mb-1">
            <Link
              href="/sleep"
              className="flex items-center gap-3 py-3 px-2 rounded hover:bg-[#222533] transition-colors"
            >
              <Grid fill="#e8eaed" className="flex-shrink-0" />
              {!isClosed && <span>Sono</span>}
            </Link>
          </li>

          {/* Submenu "Create" */}
          <li className="mb-1">
            <button
              onClick={() => handleToggleSubMenu(1)}
              className={cn(
                "dropdown-btn w-full text-left flex items-center gap-3 py-3 px-2 rounded hover:bg-[#222533] transition-colors",
                // Se estiver aberto, adiciona .rotate
                openSubMenu === 1 && "rotate"
              )}
            >
              <PlusSquare fill="#e8eaed" className="flex-shrink-0" />
              {!isClosed && <span>Ver</span>}
              {/* Seta de expandir (poderia ser outro ícone) */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="18px"
                viewBox="0 -960 960 960"
                width="18px"
                fill="#e8eaed"
                className="ml-auto transition-transform"
              >
                <path d="M480-361q-8 0-15-2.5t-13-8.5L268-556q-11-11-11-28t11-28q11-11 28-11t28 11l156 156 156-156q11-11 28-11t28 11q11 11 11 28t-11 28L508-372q-6 6-13 8.5t-15 2.5Z" />
              </svg>
            </button>
            <ul
              className={cn(
                "sub-menu grid transition-[grid-template-rows] duration-300 overflow-hidden",
                openSubMenu === 1 ? "show grid-rows-[1fr]" : "grid-rows-[0fr]"
              )}
            >
              <div>
                <li>
                  <Link
                    href="/tasks"
                    className="block py-2 pl-8 pr-2 hover:bg-[#222533] transition-colors"
                  >
                    Tarefas
                  </Link>
                </li>
                <li>
                  <Link
                    href="/habits"
                    className="block py-2 pl-8 pr-2 hover:bg-[#222533] transition-colors"
                  >
                    Hábitos
                  </Link>
                </li>
                <li>
                  <Link
                    href="/shopping"
                    className="block py-2 pl-8 pr-2 hover:bg-[#222533] transition-colors"
                  >
                    Lista de Compras
                  </Link>
                </li>
              </div>
            </ul>
          </li>

          {/* PROFILE */}
          <li className="mb-1">
            <Link
              href="/profile"
              className="flex items-center gap-3 py-3 px-2 rounded hover:bg-[#222533] transition-colors"
            >
              <User fill="#e8eaed" className="flex-shrink-0" />
              {!isClosed && <span>Profile</span>}
            </Link>
          </li>

          {/* SAIR */}
          <li className="mb-1">
          <Button variant="outline" onClick={handleLogout}>
          Sair
          </Button>
          </li>
        </ul>
      </nav>
    </div>
  );
}
