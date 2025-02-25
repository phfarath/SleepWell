import { Button } from "@/components/ui/button"
import { MainNav } from "@/components/main-nav"
import { Moon, Sun, List, BedDouble, Brain } from "lucide-react"
import Link from "next/link"

export default function Home() {
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

      <main className="flex-1 px-6 md:px-12 lg:px-24">
        <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32 px-4 sm:px-6 md:px-8">
          <div className="container mx-auto flex max-w-[64rem] flex-col items-center gap-4 text-center">
            <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl">
              Transforme seu sono e seus hábitos com SleepWell
            </h1>
            <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
              Acompanhe seu sono, construa hábitos saudáveis e organize suas tarefas diárias, tudo em um só lugar
            </p>
            <div className="space-x-4">
              <Button size="lg" asChild>
                <Link href="/login">Começe Agora</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/about">Saiba Mais</Link>
              </Button>
            </div>
          </div>
        </section>

        <section
          id="features"
          // w-full garante que o fundo ocupe 100% da tela
          className="w-full bg-indigo-50 dark:bg-indigo-950/30 py-12 mb-12"
        >
          {/* Div que centraliza o conteúdo com largura máxima */}
          <div className="max-w-[64rem] mx-auto space-y-6 px-6 md:px-12 lg:px-24">
            <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3">
              <div className="relative overflow-hidden rounded-lg border bg-background p-4 md:p-6">
                <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
                  <BedDouble className="h-12 w-12" />
                  <div className="space-y-2">
                    <h3 className="font-bold">Rastreie o Sono</h3>
                    <p className="text-sm text-muted-foreground">
                      Monitore seus padrões de sono com insights personalizados
                    </p>
                  </div>
                </div>
              </div>
              <div className="relative overflow-hidden rounded-lg border bg-background p-4 md:p-6">
                <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
                  <Brain className="h-12 w-12" />
                  <div className="space-y-2">
                    <h3 className="font-bold">Construção de Hábitos</h3>
                    <p className="text-sm text-muted-foreground">
                      Crie e mantenha hábitos saudáveis
                    </p>
                  </div>
                </div>
              </div>
              <div className="relative overflow-hidden rounded-lg border bg-background p-4 md:p-6">
                <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
                  <List className="h-12 w-12" />
                  <div className="space-y-2">
                    <h3 className="font-bold">Organize Tarefas</h3>
                    <p className="text-sm text-muted-foreground">
                      Organize suas tarefas diárias de forma inteligente
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

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
  )
}