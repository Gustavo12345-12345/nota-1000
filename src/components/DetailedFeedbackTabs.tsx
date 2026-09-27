'use client';

import React, { useState } from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  BookOpen,
  MessageSquare,
  Link2,
  Sparkles,
  ChevronRight,
  TrendingUp,
  Tag
} from 'lucide-react';
import { DetailedFeedback } from '@/types/essay';

interface DetailedFeedbackTabsProps {
  detalhes: DetailedFeedback;
}

export default function DetailedFeedbackTabs({ detalhes }: DetailedFeedbackTabsProps) {
  const [activeTab, setActiveTab] = useState<
    'pontos_fortes' | 'pontos_melhorar' | 'sugestoes' | 'repertorio' | 'argumentacao' | 'coesao'
  >('pontos_fortes');

  const tabs = [
    { id: 'pontos_fortes', label: 'Pontos Fortes', icon: CheckCircle2, badgeColor: 'text-emerald-600 bg-emerald-50' },
    { id: 'pontos_melhorar', label: 'Pontos a Melhorar', icon: AlertTriangle, badgeColor: 'text-amber-600 bg-amber-50' },
    { id: 'sugestoes', label: 'Sugestões da IA', icon: Lightbulb, badgeColor: 'text-blue-600 bg-blue-50' },
    { id: 'repertorio', label: 'Repertório Sociocultural', icon: BookOpen, badgeColor: 'text-purple-600 bg-purple-50' },
    { id: 'argumentacao', label: 'Argumentação', icon: MessageSquare, badgeColor: 'text-indigo-600 bg-indigo-50' },
    { id: 'coesao', label: 'Coesão & Conectivos', icon: Link2, badgeColor: 'text-cyan-600 bg-cyan-50' },
  ] as const;

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-md">
      {/* Section Title */}
      <div className="mb-6 pb-4 border-b border-slate-100">
        <span className="text-xs font-extrabold uppercase tracking-wider text-blue-600 block mb-1">
          Diagnóstico Pedagógico
        </span>
        <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          Análise da sua redação
        </h3>
        <p className="text-xs text-slate-600 mt-1">
          Explore o feedback minucioso gerado para cada dimensão estrutural e estilística do seu texto.
        </p>
      </div>

      {/* Tabs Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 scrollbar-thin">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/30'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70 hover:text-slate-900'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Contents */}
      <div className="bg-slate-50/70 rounded-2xl p-6 sm:p-8 border border-slate-100 min-h-[220px]">
        {/* 1. Pontos Fortes */}
        {activeTab === 'pontos_fortes' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              Aspectos positivos reconhecidos no seu texto
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
              {detalhes.pontos_fortes.map((ponto, idx) => (
                <div
                  key={idx}
                  className="bg-white p-4 rounded-xl border border-emerald-100/80 shadow-xs flex items-start gap-3"
                >
                  <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 font-bold text-xs mt-0.5">
                    ✓
                  </span>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                    {ponto}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 2. Pontos a Melhorar */}
        {activeTab === 'pontos_melhorar' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              Oportunidades de melhoria e gargalos identificados
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
              {detalhes.pontos_melhorar.map((ponto, idx) => (
                <div
                  key={idx}
                  className="bg-white p-4 rounded-xl border border-amber-100/80 shadow-xs flex items-start gap-3"
                >
                  <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 font-bold text-xs mt-0.5">
                    !
                  </span>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                    {ponto}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. Sugestões da IA */}
        {activeTab === 'sugestoes' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-blue-600" />
              Recomendações estratégicas para sua próxima redação
            </h4>
            <div className="space-y-3 pt-2">
              {detalhes.sugestoes_ia.map((sug, idx) => (
                <div
                  key={idx}
                  className="bg-white p-4 rounded-xl border border-blue-100 shadow-xs flex items-start gap-3.5"
                >
                  <span className="w-7 h-7 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 font-black text-xs">
                    {idx + 1}
                  </span>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                    {sug}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. Repertório Sociocultural */}
        {activeTab === 'repertorio' && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-purple-600" />
                Validação de Repertório Sociocultural (Competência II)
              </h4>
              <div className="flex items-center gap-2">
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
                  detalhes.repertorio_sociocultural.legitimo
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-amber-50 text-amber-700 border-amber-200'
                }`}>
                  {detalhes.repertorio_sociocultural.legitimo ? '✓ Legitimado' : '⚠ Parcial'}
                </span>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
                  detalhes.repertorio_sociocultural.produtivo
                    ? 'bg-purple-50 text-purple-700 border-purple-200'
                    : 'bg-slate-100 text-slate-600 border-slate-200'
                }`}>
                  {detalhes.repertorio_sociocultural.produtivo ? '★ Produtivo' : 'Improdutivo'}
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-white p-4 rounded-xl border border-slate-100">
              {detalhes.repertorio_sociocultural.avaliacao}
            </p>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-2">
                Exemplos de repertórios identificados no texto:
              </span>
              <div className="flex flex-wrap gap-2">
                {detalhes.repertorio_sociocultural.exemplos_citados.map((rep, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 text-purple-800 border border-purple-200 rounded-xl text-xs font-semibold"
                  >
                    <Tag className="w-3 h-3 text-purple-500" />
                    {rep}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 5. Argumentação */}
        {activeTab === 'argumentacao' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-indigo-600" />
              Projeto de Texto e Desenvolvimento Argumentativo (Competência III)
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
              <div className="bg-white p-5 rounded-xl border border-indigo-100 shadow-xs space-y-2">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-indigo-600">
                  Projeto de Texto Estratégico
                </span>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                  {detalhes.argumentacao.projeto_de_texto}
                </p>
              </div>

              <div className="bg-white p-5 rounded-xl border border-indigo-100 shadow-xs space-y-2">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-indigo-600">
                  Consistência dos Argumentos
                </span>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                  {detalhes.argumentacao.desenvolvimento}
                </p>
              </div>
            </div>

            <div className="p-4 bg-white rounded-xl border border-slate-100 text-xs sm:text-sm text-slate-700 leading-relaxed">
              <strong>Síntese da Banca:</strong> {detalhes.argumentacao.avaliacao}
            </div>
          </div>
        )}

        {/* 6. Coesão & Conectivos */}
        {activeTab === 'coesao' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Link2 className="w-5 h-5 text-cyan-600" />
              Recursos de Coesão e Conectivos (Competência IV)
            </h4>

            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-white p-4 rounded-xl border border-slate-100">
              {detalhes.coesao.avaliacao}
            </p>

            <div className="pt-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-2">
                Conectivos e articuladores detectados no texto:
              </span>
              <div className="flex flex-wrap gap-2">
                {detalhes.coesao.conectivos_utilizados.map((conn, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-cyan-50 text-cyan-800 border border-cyan-200 rounded-lg text-xs font-semibold"
                  >
                    &ldquo;{conn}&rdquo;
                  </span>
                ))}
              </div>
            </div>

            {detalhes.coesao.problemas_repeticao.length > 0 && (
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 mt-2">
                <strong>Atenção a repetições:</strong> Foi detectada repetição excessiva em alguns trechos. Experimente diversificar com sinônimos ou elipses gramaticais.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
