import { Button } from "@/components/ui/button"
import { MainNav } from "@/components/main-nav"
import { Moon, Sun, List, BedDouble, Brain, ArrowRight, Star, ChartLine, Check } from "lucide-react"
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

      <main className="flex-1">
        {/* Hero Section */}
        <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32">
          <div className="container mx-auto flex max-w-[64rem] flex-col items-center gap-4 text-center">
            <div className="rounded-2xl bg-primary/10 px-4 py-1.5 text-sm font-medium flex items-center gap-2">
              <Star className="h-4 w-4" />
              Monitore seu sono e hábitos em um só lugar
            </div>
            <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl">
              Transforme seu sono e seus hábitos com{" "}
              <span className="text-primary">SleepWell</span>
            </h1>
            <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
              Acompanhe seu sono, construa hábitos saudáveis e organize suas tarefas diárias
              para uma vida mais equilibrada e produtiva
            </p>
            <div className="space-x-4">
              <Button size="lg" className="inline-flex items-center">
                <Link href="/login" className="flex items-center">
                  Começar Agora
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/about">Saiba Mais</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full bg-muted py-20">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid gap-12 sm:grid-cols-2 md:grid-cols-3">
              <div className="group relative overflow-hidden rounded-lg border bg-background p-2 hover:border-primary/50 hover:bg-accent transition-colors">
                <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
                  <BedDouble className="h-12 w-12 text-primary" />
                  <div className="space-y-2">
                    <h3 className="font-bold">Rastreie o Sono</h3>
                    <p className="text-sm text-muted-foreground">
                      Monitore seus padrões de sono e receba insights personalizados
                    </p>
                  </div>
                </div>
              </div>
              <div className="group relative overflow-hidden rounded-lg border bg-background p-2 hover:border-primary/50 hover:bg-accent transition-colors">
                <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
                  <Brain className="h-12 w-12 text-primary" />
                  <div className="space-y-2">
                    <h3 className="font-bold">Construa Hábitos</h3>
                    <p className="text-sm text-muted-foreground">
                      Desenvolva e mantenha hábitos saudáveis de forma consistente
                    </p>
                  </div>
                </div>
              </div>
              <div className="group relative overflow-hidden rounded-lg border bg-background p-2 hover:border-primary/50 hover:bg-accent transition-colors">
                <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
                  <List className="h-12 w-12 text-primary" />
                  <div className="space-y-2">
                    <h3 className="font-bold">Gerencie Tarefas</h3>
                    <p className="text-sm text-muted-foreground">
                      Organize suas tarefas diárias de forma inteligente e eficiente
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Por que escolher SleepWell?
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Nossa plataforma oferece tudo que você precisa para melhorar sua qualidade de vida
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-2 lg:gap-12">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Check className="h-6 w-6 text-primary" />
                  <div className="flex-1 space-y-1">
                    <h3 className="text-xl font-bold">Interface Intuitiva</h3>
                    <p className="text-muted-foreground">
                      Design moderno e fácil de usar para uma experiência agradável
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Check className="h-6 w-6 text-primary" />
                  <div className="flex-1 space-y-1">
                    <h3 className="text-xl font-bold">Análises Detalhadas</h3>
                    <p className="text-muted-foreground">
                      Visualize seu progresso com gráficos e estatísticas
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Check className="h-6 w-6 text-primary" />
                  <div className="flex-1 space-y-1">
                    <h3 className="text-xl font-bold">Totalmente Gratuito</h3>
                    <p className="text-muted-foreground">
                      Acesse todas as funcionalidades sem custos
                    </p>
                  </div>
                </div>
              </div>
              <div className="mx-auto aspect-video overflow-hidden rounded-xl border">
                <ChartLine className="h-full w-full p-12 text-primary" />
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                  Pronto para começar sua transformação?
                </h2>
                <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl">
                  Junte-se a milhares de pessoas que já estão melhorando seus hábitos
                </p>
              </div>
              <div className="space-x-4">
                <Button size="lg" className="inline-flex items-center">
                  <Link href="/signup" className="flex items-center">
                    Criar Conta Gratuita
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-6 md:py-0">
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
            <div className="flex items-center gap-2">
              <Moon className="h-6 w-6" />
              <span className="text-sm font-medium">SleepWell</span>
            </div>
            <p className="text-center text-sm text-muted-foreground">
              Feito com carinho para você ser cada dia melhor
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon">
              <Sun className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </footer>
    </div>
  )
}