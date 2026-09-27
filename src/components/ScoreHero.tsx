'use client';

import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Award, Share2, Copy, Download, RotateCcw, Check, Sparkles, AlertCircle } from 'lucide-react';
import { CorrectionResult } from '@/types/essay';

interface ScoreHeroProps {
  result: CorrectionResult;
  onReset: () => void;
  onCopyFeedback: () => void;
  copied: boolean;
}

export default function ScoreHero({ result, onReset, onCopyFeedback, copied }: ScoreHeroProps) {
  const { nota_total, distancia_1000, tema, titulo } = result;

  useEffect(() => {
    if (nota_total >= 880) {
      // Disparar confetes elegantes
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#2563eb', '#3b82f6', '#10b981', '#f59e0b'],
        });
      } catch {
        // fallback silencioso se canvas não estiver pronto
      }
    }
  }, [nota_total]);

  // Status badge
  const getBadge = (score: number) => {
    if (score >= 920) return { label: 'Desempenho Excelente (Top 5%)', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' };
    if (score >= 800) return { label: 'Desempenho Muito Bom', color: 'bg-blue-100 text-blue-800 border-blue-300' };
    if (score >= 640) return { label: 'Desempenho Mediano', color: 'bg-amber-100 text-amber-800 border-amber-300' };
    return { label: 'Requer Atenção e Prática', color: 'bg-rose-100 text-rose-800 border-rose-300' };
  };

  const badge = getBadge(nota_total);
  const percentage = Math.round((nota_total / 1000) * 100);

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-md relative overflow-hidden mb-8">
      {/* Top Banner with Theme */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold border ${badge.color}">
            <Award className="w-3.5 h-3.5" />
            {badge.label}
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            {tema}
          </h2>
          {titulo && (
            <p className="text-sm text-slate-600 italic">
              Título: &ldquo;{titulo}&rdquo;
            </p>
          )}
        </div>

        {/* Quick action buttons */}
        <div className="flex items-center gap-2 self-start md:self-center shrink-0">
          <button
            onClick={onCopyFeedback}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-all"
            title="Copiar relatório completo"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copiado!' : 'Copiar'}
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-all"
            title="Exportar ou Imprimir"
          >
            <Download className="w-4 h-4" />
            PDF / Imprimir
          </button>
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            Nova Redação
          </button>
        </div>
      </div>

      {/* Main Score Display Area */}
      <div className="py-8 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        {/* Big Score Block */}
        <div className="md:col-span-6 flex flex-col items-center md:items-start text-center md:text-left">
          <span className="text-xs uppercase font-extrabold tracking-widest text-slate-600 mb-1 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-blue-600" /> Sua nota oficial
          </span>

          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-6xl sm:text-7xl font-black text-slate-900 tracking-tighter">
              {nota_total}
            </span>
            <span className="text-2xl sm:text-3xl font-bold text-slate-600">
              / 1000
            </span>
          </div>

          <p className="text-base sm:text-lg font-semibold text-blue-700 mb-4">
            {distancia_1000 === 0
              ? '🎉 Parabéns! Você atingiu a pontuação máxima!'
              : `Você está a apenas ${distancia_1000} pontos da Nota 1000.`}
          </p>

          <p className="text-sm text-slate-600 max-w-md leading-relaxed">
            {result.feedback_geral}
          </p>
        </div>

        {/* Visual Progress Bar & Score Breakdown */}
        <div className="md:col-span-6 bg-slate-50/80 p-6 rounded-2xl border border-slate-100 space-y-4">
          <div className="flex items-center justify-between text-sm font-bold text-slate-700">
            <span>Aproveitamento Geral</span>
            <span className="text-blue-600">{percentage}%</span>
          </div>

          <div className="w-full bg-slate-200 rounded-full h-4 overflow-hidden p-0.5 shadow-inner">
            <div
              className="bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-500 h-full rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${percentage}%` }}
            />
          </div>

          <div className="grid grid-cols-3 gap-2 pt-2 text-center text-xs">
            <div className="p-2.5 bg-white rounded-xl border border-slate-100">
              <span className="block text-slate-600 font-medium">Palavras</span>
              <span className="text-base font-bold text-slate-800">{result.estatisticas.palavras}</span>
            </div>
            <div className="p-2.5 bg-white rounded-xl border border-slate-100">
              <span className="block text-slate-600 font-medium">Linhas aprox.</span>
              <span className="text-base font-bold text-slate-800">{result.estatisticas.linhas_estimadas} / 30</span>
            </div>
            <div className="p-2.5 bg-white rounded-xl border border-slate-100">
              <span className="block text-slate-600 font-medium">Parágrafos</span>
              <span className="text-base font-bold text-slate-800">{result.estatisticas.paragrafos}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
