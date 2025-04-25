# 🌙 SleepWell - Tracking de Sono e Hábitos

Uma aplicação web moderna para ajudar você a monitorar seu sono e desenvolver hábitos saudáveis.

## 📋 Funcionalidades

- **Monitoramento do Sono**
  - Registro de horários de dormir e acordar
  - Avaliação da qualidade do sono
  - Registro do humor ao acordar
  - Histórico detalhado do sono
  - Gráficos e estatísticas

- **Gerenciamento de Hábitos**
  - Criação e acompanhamento de hábitos
  - Registro de sequências (streaks)
  - Diferentes frequências (diário, semanal, mensal)
  - Sistema de progresso visual

- **Lista de Tarefas**
  - Organização de tarefas diárias
  - Marcação de conclusão
  - Categorização

- **Lista de Compras**
  - Gerenciamento de itens necessários
  - Marcação de itens comprados
  - Organização por categorias

## 🚀 Tecnologias

- [Next.js 14](https://nextjs.org/)
- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Supabase](https://supabase.com/)
- [Shadcn/ui](https://ui.shadcn.com/)
- [Lucide Icons](https://lucide.dev/)
- [React Hook Form](https://react-hook-form.com/)
- [date-fns](https://date-fns.org/)

## 🔧 Instalação

1. Clone o repositório
```bash
git clone [url-do-repositorio]
cd Tracking_Habitos
```

2. Instale as dependências
```bash
npm install
```

3. Configure as variáveis de ambiente
```bash
# Crie um arquivo .env.local e adicione:
NEXT_PUBLIC_SUPABASE_URL=seu-url-do-supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anonima-do-supabase
```

4. Inicie o servidor de desenvolvimento
```bash
npm run dev
```

## 📱 Recursos da Interface

- Design responsivo
- Modo escuro/claro
- Interface intuitiva
- Animações suaves
- Componentes reutilizáveis
- Feedback visual através de toasts
- Navegação simplificada

## 📊 Estrutura do Projeto

```
app/              # Rotas e páginas da aplicação
components/       # Componentes reutilizáveis
hooks/           # Custom hooks
lib/             # Utilitários e configurações
```

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Distribuído sob a licença MIT. Veja `LICENSE` para mais informações.

## 👥 Autores

- Nome do Autor - [GitHub](https://github.com/phfarath)

## 🙏 Agradecimentos

- [Shadcn/ui](https://ui.shadcn.com/) pelos componentes incríveis
- [Vercel](https://vercel.com) pelo hosting
- [Supabase](https://supabase.com/) pelo backend