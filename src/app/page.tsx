'use client';

import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  Sparkles,
  PenTool,
  ArrowRight,
  CheckCircle2,
  Brain,
  Camera,
  Award,
  TrendingUp,
  BarChart3,
  ShieldCheck,
  Zap,
  BookOpen,
  ChevronRight,
  Star,
  Users,
  Clock,
  Target
} from 'lucide-react';
import { ENEM_THEMES } from '@/data/enemThemes';

export default function HomePage() {
  const steps = [
    {
      number: '01',
      title: 'Envie sua redação',
      desc: 'Digite no editor, cole seu texto ou tire uma foto da folha manuscrita. Nosso OCR transcreve automaticamente.',
      icon: Camera,
      tag: 'Digitação ou Foto',
    },
    {
      number: '02',
      title: 'A IA analisa',
      desc: 'Avaliação profunda de estrutura dissertativa, gramática, coerência, repertório sociocultural e intervenção.',
      icon: Brain,
      tag: 'Critérios Oficiais',
    },
    {
      number: '03',
      title: 'Receba sua correção',
      desc: 'Nota oficial de 0 a 1000, notas discriminadas para as 5 competências do INEP e grifos interativos no texto.',
      icon: Award,
      tag: '5 Competências',
    },
    {
      number: '04',
      title: 'Melhore sua escrita',
      desc: 'Siga sugestões personalizadas de reescrita, compare seu progresso ao longo do tempo e alcance os 900+.',
      icon: TrendingUp,
      tag: 'Evolução Contínua',
    },
  ];

  const whyChooseUs = [
    {
      title: 'Correção baseada no ENEM',
      desc: 'Avaliação estritamente estruturada de acordo com o manual oficial dos corretores do INEP, com pontuação em faixas oficiais de 0 a 200 por competência.',
      icon: ShieldCheck,
      color: 'text-blue-600 bg-blue-50',
    },
    {
      title: 'Feedback personalizado',
      desc: 'Não entregamos apenas uma nota fria. Apontamos os pontos fortes, os desvios gramaticais específicos e sugestões práticas de como reescrever cada período.',
      icon: Sparkles,
      color: 'text-purple-600 bg-purple-50',
    },
    {
      title: 'Acompanhe sua evolução',
      desc: 'Gráficos interativos mostram seu avanço redação por redação, identificando em qual competência você mais evoluiu e onde ainda precisa focar.',
      icon: TrendingUp,
      color: 'text-emerald-600 bg-emerald-50',
    },
    {
      title: 'Pratique sem limites',
      desc: 'Treine com propostas oficiais de anos anteriores ou temas inéditos cotados para o próximo exame. Identifique e elimine padrões de erro antes da prova.',
      icon: Zap,
      color: 'text-amber-600 bg-amber-50',
    },
  ];

  const testimonials = [
    {
      name: 'Beatriz Vasconcelos',
      curso: 'Medicina • UFMG',
      nota: 'Nota 980 no ENEM',
      quote:
        'O Nota 1000 me mostrou exatamente o que faltava na minha Proposta de Intervenção. Consegui fechar os 200 pontos na Competência 5 graças ao checklist dos 5 elementos!',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
    },
    {
      name: 'Lucas Martins',
      curso: 'Direito • USP',
      nota: 'Nota 960 no ENEM',
      quote:
        'A velocidade da correção com OCR é surreal. Eu escrevia no papel oficial do cursinho, tirava a foto com o celular e em segundos tinha todas as correções gramaticais na tela.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    },
    {
      name: 'Mariana Duarte',
      curso: 'Engenharia da Computação • Unicamp',
      nota: 'Nota 940 no ENEM',
      quote:
        'O gráfico de evolução me manteve motivada. Comecei tirando 720 e, corrigindo duas redações por semana na plataforma, cheguei super confiante no dia do exame.',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&auto=format&fit=crop&q=80',
    },
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col selection:bg-blue-100 selection:text-blue-900">
      <Navbar />

      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 sm:pt-20 sm:pb-28 bg-gradient-to-b from-blue-50/40 via-white to-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Col: Headline, Subtitle, CTAs */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200 shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
                <span>Inteligência Artificial Especializada na Matriz INEP</span>
              </div>

              {/* Title */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.12]">
                Sua redação corrigida por IA.{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                  Seu caminho até a Nota 1000.
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Envie sua redação do ENEM e receba uma correção detalhada baseada nas 5 competências oficiais, com notas, comentários e sugestões para melhorar sua escrita.
              </p>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  href="/corrigir"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl text-base font-bold shadow-lg shadow-blue-600/30 hover:shadow-xl hover:shadow-blue-600/40 active:scale-98 transition-all"
                >
                  <PenTool className="w-5 h-5" />
                  <span>Corrigir minha redação</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>

                <a
                  href="#como-funciona"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-2xl border border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-50 font-bold text-base transition-colors"
                >
                  <span>Como funciona</span>
                </a>
              </div>

              {/* Social Proof Mini Stats */}
              <div className="pt-6 border-t border-slate-100 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>5 Competências Oficiais do INEP</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Upload de Foto com OCR Integrado</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Feedback em segundos</span>
                </div>
              </div>
            </div>

            {/* Right Col: Visual Representation of Essay being analyzed */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-slate-200/90 space-y-4">
                {/* Floating Score Badge 1 */}
                <div className="absolute -top-5 -right-3 sm:-right-6 bg-white/95 backdrop-blur border border-slate-200 p-3 sm:p-4 rounded-2xl shadow-xl flex items-center gap-3 animate-bounce [animation-duration:4s]">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-black text-sm shadow-md shadow-emerald-500/30">
                    960
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">
                      Nota Estimada
                    </span>
                    <span className="text-xs font-bold text-slate-800">
                      Excelente Desempenho
                    </span>
                  </div>
                </div>

                {/* Floating Pill 2 */}
                <div className="absolute -bottom-4 -left-3 sm:-left-6 bg-slate-900 text-white px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-2.5 text-xs font-bold">
                  <Sparkles className="w-4 h-4 text-blue-400" />
                  <span>Proposta C5: 5 elementos validados</span>
                </div>

                {/* Simulated Paper Header */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-rose-400" />
                    <div className="w-3 h-3 rounded-full bg-amber-400" />
                    <div className="w-3 h-3 rounded-full bg-emerald-400" />
                    <span className="text-[11px] font-mono font-bold text-slate-400 ml-1">
                      redacao_enem_2024.txt
                    </span>
                  </div>
                  <span className="text-[10px] uppercase font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full">
                    Análise em tempo real
                  </span>
                </div>

                {/* Essay Snippet with Color Marks */}
                <div className="space-y-2.5 font-serif text-xs sm:text-[13px] leading-relaxed text-slate-700 bg-slate-50/70 p-4 rounded-2xl border border-slate-100">
                  <p>
                    Na obra <mark className="bg-emerald-100 text-emerald-950 px-1 rounded-sm border-b border-emerald-400 font-sans font-medium">&ldquo;Cidadãos de Papel&rdquo;, o jornalista Gilberto Dimenstein</mark> pontua que a garantia formal de direitos na Constituição de 1988 nem sempre se consolida no cotidiano...
                  </p>
                  <p>
                    <mark className="bg-rose-100 text-rose-950 px-1 rounded-sm border-b border-rose-400 font-sans font-medium">Historicamente as mulheres</mark> sempre desempenharam papéis de cuidado doméstico sem que <mark className="bg-blue-100 text-blue-950 px-1 rounded-sm border-b border-blue-400 font-sans font-medium">além disso</mark> houvesse políticas públicas assistenciais eficazes.
                  </p>
                </div>

                {/* Mini Result Cards inside Hero */}
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <div className="p-2.5 bg-blue-50/70 rounded-xl border border-blue-100 flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-700">C1: Gramática</span>
                    <span className="text-xs font-black text-blue-700">180 / 200</span>
                  </div>
                  <div className="p-2.5 bg-emerald-50/70 rounded-xl border border-emerald-100 flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-700">C2: Repertório</span>
                    <span className="text-xs font-black text-emerald-700">200 / 200</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. COMO FUNCIONA SECTION */}
      <section id="como-funciona" className="py-20 sm:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-extrabold uppercase tracking-widest text-blue-600 block">
              Processo Simples e Transparente
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Como funciona o Nota 1000
            </h2>
            <p className="text-sm sm:text-base text-slate-600">
              Da folha de papel ao diagnóstico detalhado em menos de 15 segundos.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step) => {
              const Icon = step.icon;

              return (
                <div
                  key={step.number}
                  className="bg-slate-50/80 rounded-3xl p-7 border border-slate-200/80 hover:bg-white hover:border-blue-300 hover:shadow-lg transition-all group flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <span className="text-3xl font-black text-blue-600/40 group-hover:text-blue-600 transition-colors font-mono">
                        {step.number}
                      </span>
                      <div className="w-12 h-12 rounded-2xl bg-white shadow-xs text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Icon className="w-6 h-6" />
                      </div>
                    </div>

                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                      {step.tag}
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">
                      {step.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {step.desc}
                    </p>
                  </div>

                  <div className="pt-6 mt-4 border-t border-slate-200/60">
                    <span className="text-xs font-bold text-blue-600 flex items-center gap-1 group-hover:gap-1.5 transition-all">
                      Saiba mais <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. POR QUE USAR O NOTA 1000 */}
      <section id="sobre" className="py-20 sm:py-28 bg-slate-50 border-y border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-extrabold uppercase tracking-widest text-blue-600 block">
              Diferenciais Exclusivos
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Por que usar o Nota 1000?
            </h2>
            <p className="text-sm sm:text-base text-slate-600">
              Desenvolvido com rigor pedagógico para que você compreenda seus erros e evolua a cada texto.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {whyChooseUs.map((item, idx) => {
              const Icon = item.icon;

              return (
                <div
                  key={idx}
                  className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex items-start gap-5"
                >
                  <div className={`w-14 h-14 rounded-2xl shrink-0 flex items-center justify-center font-bold ${item.color}`}>
                    <Icon className="w-7 h-7" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-slate-900">
                      {item.title}
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. TEMAS EM DESTAQUE PARA PRATICAR */}
      <section className="py-20 sm:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-widest text-blue-600 block mb-1">
                Banco de Propostas
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                Pratique com temas oficiais
              </h2>
              <p className="text-sm text-slate-600 mt-1">
                Escolha uma proposta e comece a escrever diretamente na nossa sala de redação.
              </p>
            </div>
            <Link
              href="/corrigir"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-blue-600 hover:text-blue-800"
            >
              Ver todos os temas <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {ENEM_THEMES.slice(0, 3).map((theme) => (
              <div
                key={theme.id}
                className="bg-slate-50 rounded-3xl p-6 border border-slate-200/80 hover:border-blue-300 hover:bg-white hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800">
                      ENEM {theme.ano}
                    </span>
                    <span className="text-[11px] text-slate-600 font-medium">
                      {theme.categoria}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-2 leading-snug">
                    {theme.titulo}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    {theme.textoMotivadorResumo}
                  </p>
                </div>

                <Link
                  href="/corrigir"
                  className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-4 bg-white hover:bg-blue-600 hover:text-white text-blue-700 text-xs font-bold rounded-xl border border-blue-200 transition-colors shadow-xs"
                >
                  <PenTool className="w-3.5 h-3.5" />
                  Praticar este tema
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. DEPOIMENTOS / SOCIAL PROOF */}
      <section className="py-20 sm:py-28 bg-slate-900 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-extrabold uppercase tracking-widest text-blue-400 block">
              Comunidade Nota 1000
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Aprovados no SISU com notas 900+
            </h2>
            <p className="text-sm sm:text-base text-slate-400">
              Veja como nossos estudantes transformaram a redação na maior nota da prova.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, idx) => (
              <div
                key={idx}
                className="bg-slate-800/80 rounded-3xl p-7 border border-slate-700 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-sm text-slate-300 italic leading-relaxed">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-700 flex items-center gap-3">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="w-11 h-11 rounded-full object-cover border-2 border-blue-500"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-white">{t.name}</h4>
                    <p className="text-xs text-blue-400 font-semibold">{t.nota}</p>
                    <p className="text-[11px] text-slate-400">{t.curso}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. FINAL CTA BANNER */}
      <section className="py-16 sm:py-24 bg-gradient-to-r from-blue-600 to-indigo-700 text-white text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center mx-auto text-white shadow-inner">
            <Sparkles className="w-7 h-7" />
          </div>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight">
            Pronto para conquistar sua vaga na universidade?
          </h2>
          <p className="text-base sm:text-lg text-blue-100 max-w-2xl mx-auto leading-relaxed">
            Não espere pelo dia do ENEM para descobrir suas falhas. Envie sua redação agora e receba um diagnóstico completo em instantes.
          </p>
          <div className="pt-2">
            <Link
              href="/corrigir"
              className="inline-flex items-center gap-2.5 bg-white text-blue-700 hover:bg-blue-50 px-9 py-4 rounded-2xl text-base font-black shadow-xl hover:scale-105 active:scale-98 transition-all"
            >
              <PenTool className="w-5 h-5 text-blue-600" />
              <span>Corrigir minha redação agora</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
