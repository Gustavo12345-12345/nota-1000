# 🎓 Nota 1000 — Plataforma de Correção de Redações do ENEM com Inteligência Artificial

O **Nota 1000** é uma plataforma EdTech moderna, responsiva e completa para correção de redações do ENEM, desenvolvida com **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**, **Lucide Icons** e **Recharts**.

A plataforma avalia redações com base nas **5 competências oficiais do ENEM (INEP)**, gerando notas de 0 a 1000, relatórios analíticos, grifos interativos no próprio texto com sugestões de reescrita, checklist dos 5 elementos da Proposta de Intervenção e reconhecimento óptico de caracteres (OCR) para folhas manuscritas.

---

## 🚀 Principais Funcionalidades

### 1. Página Inicial (Landing Page Premium)
- **Hero Section**: Apresentação com o slogan *"Sua redação corrigida por IA. Seu caminho até a Nota 1000."*
- **Simulador Visual**: Demonstração interativa de uma redação sendo avaliada em tempo real com badges dinâmicos de nota (960/1000) e tags da banca.
- **Seção "Como funciona"**: Fluxo em 4 passos (01 Envie sua redação, 02 A IA analisa, 03 Receba sua correção, 04 Melhore sua escrita).
- **Seção "Por que usar o Nota 1000?"**: Critérios do INEP, feedback personalizado, acompanhamento temporal e prática sem limites.
- **Banco de Temas Oficiais**: Propostas de 2020 a 2024 e temas inéditos com botão para praticar com 1 clique.
- **Depoimentos e Selos**: Avaliações de vestibulandos aprovados no SISU em Medicina, Direito e Engenharia.

### 2. Sala de Redação e Editor Interativo (`/corrigir`)
- **Seletor de Temas**: Banco com propostas do ENEM ou campo para digitar tema livre.
- **Contadores em Tempo Real**: Contagem de palavras, caracteres, estimativa de linhas manuscritas (alerta de anulação se < 7 linhas) e número de parágrafos.
- **Atalhos Rápidos**: Botões para carregar redação exemplar (Nota 960) ou redação com desvios reais (Nota 760) para testes imediatos.
- **OCR Integrado**: Suporte a upload de fotos de redações manuscritas ou teste com folha de exemplo (`sample-essay.png`), com visualização lado a lado e edição do texto reconhecido antes de enviar.

### 3. Tela de Processamento com Animação
- Loader progressivo com microanimações e checkmarks:
  - ✓ Identificando estrutura dissertativa-argumentativa
  - ✓ Analisando coerência e repertório sociocultural
  - ✓ Avaliando critérios das 5 competências do INEP
  - ✓ Verificando gramática, regência e pontuação formal
  - ○ Gerando feedback e proposta de intervenção
- Dicas pedagógicas rotativas durante o carregamento.

### 4. Diagnóstico Completo da Redação
- **Score Hero**: Pontuação de destaque (ex: **920 / 1000**), barra de progresso visual, distância para a Nota 1000 ("Você está a 80 pontos da Nota 1000") e chuva de confetes comemorativos para notas ≥ 900.
- **5 Cards de Competências (C1 a C5)**:
  - **Competência I**: Domínio da escrita formal da língua portuguesa.
  - **Competência II**: Compreensão do tema e aplicação de repertório sociocultural.
  - **Competência III**: Projeto de texto e desenvolvimento argumentativo.
  - **Competência IV**: Coesão textual e encadeamento de conectivos.
  - **Competência V**: Proposta de intervenção social.
  - Cada card conta com nota (0-200), barra de progresso, nível oficial, pontos positivos e pontos a melhorar.
- **Correção Direta no Texto (Grifos Interativos)**:
  - 🔴 **Vermelho**: Erros gramaticais, ortografia e pontuação (C1).
  - 🟡 **Amarelo**: Problemas de argumentação, generalização ou clareza (C3).
  - 🔵 **Azul**: Problemas de coesão, conectivos ausentes ou repetitivos (C4).
  - 🟢 **Verde**: Repertório sociocultural legitimado e trechos exemplares (C2).
  - Ao clicar em qualquer trecho destacado, abre-se um card com o problema encontrado, a sugestão de reescrita da IA e botão para copiar a sugestão.
- **Checklist dos 5 Elementos da Proposta de Intervenção (Competência V)**:
  - 1. Agente (Quem?)
  - 2. Ação (O que?)
  - 3. Meio/Modo (Como?)
  - 4. Finalidade/Efeito (Para quê?)
  - 5. Detalhamento (Explicação/Exemplo)
  - Identificação visual com tags ✓ Presente ou ⚠ Ausente.
- **Abas de Feedback Detalhado**:
  - Pontos Fortes
  - Pontos a Melhorar
  - Sugestões Estratégicas da IA
  - Avaliação de Repertório Sociocultural (legítimo, pertinente e produtivo)
  - Análise do Projeto de Texto e Argumentação
  - Recursos de Coesão e Conectivos

### 5. Dashboard do Estudante (`/dashboard`)
- Saudação personalizada com meta de nota.
- 4 KPIs principais: Última nota, Maior nota (recorde pessoal), Média geral e Total de redações corrigidas.
- **Gráfico de Linha Interativo**: Evolução das notas ao longo do tempo (ex: 720 → 780 → 840 → 920).
- **Gráfico de Barras por Competência**: Comparativo do desempenho médio nas 5 competências.
- Tabela com histórico recente e botão em destaque `+ Corrigir nova redação`.

### 6. Histórico Completo (`/historico`)
- Lista de todas as redações corrigidas com tema, data, nota final, variação em relação à redação anterior (`+60 pts`, etc.) e notas C1 a C5.
- Trilha linear de evolução (`Redação 1 → 720`, `Redação 2 → 780`, `Redação 3 → 840`, `Redação 4 → 920`).
- Campo de busca em tempo real por tema ou título.
- Modal de confirmação antes de excluir qualquer redação com toast notification.
- Modal para visualização completa de relatórios anteriores.

### 7. Sistema de Autenticação e Perfil
- Modal de Login, Cadastro e Recuperação de senha.
- Acesso rápido demonstrativo com o Google (1 clique).
- Persistência no navegador (`localStorage`) com preenchimento inicial de histórico realista.

### 8. Integração com Inteligência Artificial e OCR
- **Motor Pedagógico Nativo**: Avaliador sintático e estrutural pronto para uso imediato, sem dependência obrigatória de chaves de API externas.
- **Suporte Nativo à Gemini API**: Rota `/api/grade` pronta para conectar com a Google Gemini API (`GEMINI_API_KEY` ou `GOOGLE_API_KEY`).
- **Configuração de Chave no Navegador**: Ícone de chave na Navbar permite inserir uma chave pessoal sem necessidade de reiniciar o servidor.
- **Rota `/api/ocr`**: Preparada para Gemini Vision e com suporte para a imagem de teste manuscrita.

---

## 🛠️ Tecnologias Utilizadas

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router, Turbopack)
- **Linguagem**: [TypeScript](https://www.typescriptlang.org/)
- **Estilização**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Ícones**: [Lucide React](https://lucide.dev/)
- **Gráficos**: [Recharts](https://recharts.org/)
- **Efeitos**: [Canvas Confetti](https://www.npmjs.com/package/canvas-confetti)
- **Tipografia**: Inter (Google Fonts)

---

## 💻 Como Rodar o Projeto

### Pré-requisitos
- Node.js (v18+)
- npm ou yarn

### Instalação e Execução

1. Acesse o diretório do projeto:
```bash
cd c:\Users\gubel\Desktop\nota-1000
```

2. O projeto já está construído e rodando no endereço local:
```
http://localhost:3000
```

3. Caso deseje iniciar manualmente em modo de desenvolvimento:
```bash
npm run dev
```

4. Para gerar a build de produção:
```bash
npm run build
npm start
```

### Configurando uma Chave da Gemini API (Opcional)
Crie um arquivo `.env.local` na raiz com:
```env
GEMINI_API_KEY=sua_chave_aqui
```
Ou insira sua chave diretamente na interface clicando no ícone de chave (🔑) no canto superior direito da Navbar.

---

## 📁 Estrutura de Arquivos

```
nota-1000/
├── public/
│   ├── sample-essay.png       # Folha manuscrita de exemplo para teste do OCR
│   └── favicon.ico
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── grade/route.ts # Rota de avaliação com IA e motor pedagógico
│   │   │   └── ocr/route.ts   # Rota de OCR para redações manuscritas
│   │   ├── corrigir/
│   │   │   └── page.tsx       # Sala de redação e exibição dos resultados
│   │   ├── dashboard/
│   │   │   └── page.tsx       # Painel do estudante com gráficos
│   │   ├── historico/
│   │   │   └── page.tsx       # Histórico completo com busca e exclusão
│   │   ├── layout.tsx         # Root layout com fonte Inter e metadados
│   │   ├── globals.css        # Tailwind v4 e variáveis de estilo
│   │   └── page.tsx           # Landing page completa
│   ├── components/
│   │   ├── Navbar.tsx         # Barra de navegação com perfil e menu responsivo
│   │   ├── Footer.tsx         # Rodapé institucional profissional
│   │   ├── ScoreHero.tsx      # Placar de pontuação e confetes
│   │   ├── CompetencyCard.tsx # Cards das 5 competências do INEP
│   │   ├── InteractiveEssayViewer.tsx # Grifos interativos no texto
│   │   ├── InterventionProposalChecklist.tsx # 5 elementos da C5
│   │   ├── DetailedFeedbackTabs.tsx # Abas com diagnósticos específicos
│   │   ├── ProcessingModal.tsx# Tela de carregamento moderno com etapas
│   │   ├── OCRModal.tsx       # Modal de upload e revisão de fotos manuscritas
│   │   └── AuthModal.tsx      # Modal de login / cadastro / Google
│   ├── data/
│   │   └── enemThemes.ts      # Temas do ENEM, redações exemplo e histórico
│   ├── lib/
│   │   └── evaluator.ts       # Motor pedagógico oficial do ENEM
│   ├── services/
│   │   └── storage.ts         # Gerenciamento de histórico e sessão de usuário
│   └── types/
│       └── essay.ts           # Definições completas de tipos TypeScript
```
