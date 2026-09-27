'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  TrendingUp,
  Award,
  BookOpen,
  BarChart3,
  Calendar,
  PenTool,
  ArrowUpRight,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Target
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import { getStoredUser, getEssayHistory, UserProfile } from '@/services/storage';
import { HistoryItem } from '@/types/essay';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setUser(getStoredUser());
    setHistory(getEssayHistory());
  }, []);

  if (!mounted) return null;

  // Calculando estatísticas do estudante
  const totalEssays = history.length;
  const latestEssay = history[0];
  const latestScore = latestEssay ? latestEssay.nota_total : 0;
  const highestScore = totalEssays > 0 ? Math.max(...history.map((h) => h.nota_total)) : 0;
  const averageScore =
    totalEssays > 0
      ? Math.round(history.reduce((acc, curr) => acc + curr.nota_total, 0) / totalEssays)
      : 0;

  // Formatação para gráfico de evolução temporal (ordem cronológica: mais antiga para mais recente)
  const evolutionData = [...history]
    .reverse()
    .map((item, idx) => ({
      index: idx + 1,
      name: `Redação ${idx + 1}`,
      data: item.data,
      nota: item.nota_total,
      temaCurto: item.tema.length > 25 ? item.tema.slice(0, 25) + '...' : item.tema,
    }));

  // Médias por competência C1 a C5
  const competencyAverages = [
    {
      nome: 'C1: Gramática',
      media: totalEssays > 0 ? Math.round(history.reduce((acc, h) => acc + h.competencias.c1, 0) / totalEssays) : 160,
      cor: '#3b82f6',
    },
    {
      nome: 'C2: Repertório',
      media: totalEssays > 0 ? Math.round(history.reduce((acc, h) => acc + h.competencias.c2, 0) / totalEssays) : 180,
      cor: '#8b5cf6',
    },
    {
      nome: 'C3: Argumentação',
      media: totalEssays > 0 ? Math.round(history.reduce((acc, h) => acc + h.competencias.c3, 0) / totalEssays) : 160,
      cor: '#ec4899',
    },
    {
      nome: 'C4: Coesão',
      media: totalEssays > 0 ? Math.round(history.reduce((acc, h) => acc + h.competencias.c4, 0) / totalEssays) : 170,
      cor: '#06b6d4',
    },
    {
      nome: 'C5: Intervenção',
      media: totalEssays > 0 ? Math.round(history.reduce((acc, h) => acc + h.competencias.c5, 0) / totalEssays) : 180,
      cor: '#10b981',
    },
  ];

  const userName = user ? user.nome.split(' ')[0] : 'Estudante';

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-xs">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-100 mb-2">
              <Sparkles className="w-3.5 h-3.5" /> Painel de Desempenho do Aluno
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Olá, {userName}! 👋
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Veja sua evolução no ENEM e acelere sua preparação rumo aos 900+ pontos.
            </p>
          </div>

          <Link
            href="/corrigir"
            className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3.5 rounded-2xl text-sm font-bold shadow-md shadow-blue-600/25 active:scale-98 transition-all shrink-0"
          >
            <PenTool className="w-4 h-4" />
            + Corrigir nova redação
          </Link>
        </div>

        {/* 4 Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Última Nota */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1">
                Última nota
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl font-black text-slate-900">{latestScore}</span>
                <span className="text-xs text-slate-600 font-semibold">/ 1000</span>
              </div>
              <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-1">
                <TrendingUp className="w-3 h-3" />
                {latestEssay?.variacao_anterior ? `+${latestEssay.variacao_anterior} pts vs anterior` : 'Redação avaliada'}
              </span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Award className="w-6 h-6" />
            </div>
          </div>

          {/* Card 2: Maior Nota */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1">
                Maior nota
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl font-black text-emerald-600">{highestScore}</span>
                <span className="text-xs text-slate-600 font-semibold">/ 1000</span>
              </div>
              <span className="text-[11px] text-slate-600 font-medium mt-1 block">
                Seu recorde pessoal
              </span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <Sparkles className="w-6 h-6" />
            </div>
          </div>

          {/* Card 3: Média Geral */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1">
                Média geral
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl font-black text-indigo-600">{averageScore}</span>
                <span className="text-xs text-slate-600 font-semibold">/ 1000</span>
              </div>
              <span className="text-[11px] text-slate-600 font-medium mt-1 block">
                Consistência de escrita
              </span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <BarChart3 className="w-6 h-6" />
            </div>
          </div>

          {/* Card 4: Redações Corrigidas */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1">
                Redações corrigidas
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl font-black text-slate-900">{totalEssays}</span>
                <span className="text-xs text-slate-600 font-semibold">textos</span>
              </div>
              <span className="text-[11px] text-blue-600 font-semibold mt-1 block">
                Meta recomendada: 10+
              </span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <BookOpen className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Chart 1: Sua Evolução (Line Chart) */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-wider text-blue-600 block">
                  Progresso Temporal
                </span>
                <h3 className="text-lg font-bold text-slate-900">
                  Sua evolução
                </h3>
              </div>
              <span className="text-xs text-slate-600 bg-slate-100 px-3 py-1 rounded-full font-medium">
                {evolutionData.length} produções registradas
              </span>
            </div>

            <div className="h-72 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={evolutionData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#64748b' }} stroke="#cbd5e1" />
                  <YAxis domain={[500, 1000]} tick={{ fontSize: 12, fill: '#64748b' }} stroke="#cbd5e1" />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-slate-900 text-white p-3 rounded-xl text-xs shadow-xl space-y-1">
                            <p className="font-bold text-blue-300">{data.name} • {data.data}</p>
                            <p className="text-slate-300 italic">{data.temaCurto}</p>
                            <p className="text-base font-black text-white pt-1">
                              Nota: {data.nota} / 1000
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="nota"
                    stroke="#2563eb"
                    strokeWidth={3}
                    dot={{ fill: '#2563eb', strokeWidth: 2, r: 6 }}
                    activeDot={{ r: 8, fill: '#1d4ed8' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 2: Competências (Bar Chart) */}
          <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-wider text-blue-600 block">
                  Desempenho Médio
                </span>
                <h3 className="text-lg font-bold text-slate-900">
                  Competências (0 - 200)
                </h3>
              </div>
              <span className="text-xs text-slate-600 bg-slate-100 px-3 py-1 rounded-full font-medium">
                Matriz INEP
              </span>
            </div>

            <div className="h-72 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={competencyAverages} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                  <XAxis type="number" domain={[0, 200]} tick={{ fontSize: 11, fill: '#64748b' }} stroke="#cbd5e1" />
                  <YAxis type="category" dataKey="nome" tick={{ fontSize: 11, fill: '#475569' }} stroke="#cbd5e1" width={95} />
                  <Tooltip
                    formatter={(value: any) => [`${value} / 200`, 'Média']}
                    contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '12px' }}
                  />
                  <Bar dataKey="media" radius={[0, 8, 8, 0]}>
                    {competencyAverages.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.cor} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Últimas Redações (Recent Essays Table) */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-blue-600 block">
                Histórico Rápido
              </span>
              <h3 className="text-xl font-bold text-slate-900">
                Últimas redações
              </h3>
            </div>
            <Link
              href="/historico"
              className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              Ver histórico completo <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {history.map((essay) => (
              <div
                key={essay.id}
                className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/60 p-3 rounded-2xl transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-600 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {essay.data}
                    </span>
                    {essay.variacao_anterior && (
                      <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        +{essay.variacao_anterior} pts
                      </span>
                    )}
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">
                    {essay.tema}
                  </h4>
                  {essay.titulo && (
                    <p className="text-xs text-slate-600 italic">
                      &ldquo;{essay.titulo}&rdquo;
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-4">
                  {/* Competency Pills */}
                  <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-mono font-bold">
                    <span className="bg-slate-100 px-2 py-1 rounded-lg text-slate-700">C1: {essay.competencias.c1}</span>
                    <span className="bg-slate-100 px-2 py-1 rounded-lg text-slate-700">C2: {essay.competencias.c2}</span>
                    <span className="bg-slate-100 px-2 py-1 rounded-lg text-slate-700">C3: {essay.competencias.c3}</span>
                    <span className="bg-slate-100 px-2 py-1 rounded-lg text-slate-700">C4: {essay.competencias.c4}</span>
                    <span className="bg-slate-100 px-2 py-1 rounded-lg text-slate-700">C5: {essay.competencias.c5}</span>
                  </div>

                  {/* Total score pill */}
                  <div className="text-right">
                    <span className="text-xl font-black text-slate-900 block">
                      {essay.nota_total}
                    </span>
                    <span className="text-[10px] text-slate-600 font-bold block -mt-1">
                      / 1000
                    </span>
                  </div>

                  <Link
                    href={`/historico?id=${essay.id}`}
                    className="p-2.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-xl transition-colors"
                    title="Ver detalhes"
                  >
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
