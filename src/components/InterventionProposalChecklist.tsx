'use client';

import React from 'react';
import { CheckCircle2, AlertTriangle, HelpCircle, ShieldAlert, Sparkles, Check, X } from 'lucide-react';
import { InterventionElement } from '@/types/essay';

interface InterventionProposalChecklistProps {
  elementos: InterventionElement[];
  notaC5: number;
  avaliacaoGeral: string;
}

export default function InterventionProposalChecklist({
  elementos,
  notaC5,
  avaliacaoGeral,
}: InterventionProposalChecklistProps) {
  const presentCount = elementos.filter((e) => e.presente).length;

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-md">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div>
          <span className="text-xs font-extrabold uppercase tracking-wider text-blue-600 block mb-1">
            Competência V • Análise Cirúrgica
          </span>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            Os 5 Elementos da Proposta de Intervenção
          </h3>
          <p className="text-xs text-slate-600 mt-1 max-w-xl">
            A banca examinadora do ENEM atribui 40 pontos para cada um dos 5 elementos estruturantes. Para obter 200 pontos na C5, todos os 5 elementos devem estar claros e articulados.
          </p>
        </div>

        {/* C5 Score Pill */}
        <div className="bg-blue-50/80 border border-blue-200/60 p-4 rounded-2xl flex items-center gap-3 shrink-0">
          <div className="text-right">
            <span className="text-[11px] font-bold text-blue-900 block">
              Validação C5
            </span>
            <span className="text-xs text-blue-600 font-semibold">
              {presentCount} de 5 elementos
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-600 text-white font-black text-lg flex items-center justify-center shadow-sm shadow-blue-500/30">
            {notaC5}
          </div>
        </div>
      </div>

      {/* 5 Elements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 py-6">
        {elementos.map((item, idx) => {
          const isPresent = item.presente;

          return (
            <div
              key={item.tipo}
              className={`rounded-2xl p-4 border transition-all flex flex-col justify-between ${
                isPresent
                  ? 'bg-emerald-50/50 border-emerald-200 hover:border-emerald-300'
                  : 'bg-amber-50/40 border-amber-200 hover:border-amber-300'
              }`}
            >
              <div>
                {/* Element badge & icon */}
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600">
                    Elemento #{idx + 1}
                  </span>
                  {isPresent ? (
                    <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full">
                      <Check className="w-3 h-3 stroke-[3]" /> Presente
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-100/80 px-2 py-0.5 rounded-full">
                      <AlertTriangle className="w-3 h-3" /> Ausente
                    </span>
                  )}
                </div>

                <h4 className="text-base font-bold text-slate-900 mb-1">
                  {item.nome}
                </h4>
                <p className="text-[11px] text-slate-600 font-medium italic mb-2">
                  {item.pergunta}
                </p>

                <p className="text-xs text-slate-600 leading-relaxed mb-3">
                  {item.explicacao}
                </p>
              </div>

              {/* Identified snippet */}
              {item.trecho_identificado && (
                <div className="bg-white/80 p-2.5 rounded-xl border border-emerald-100 text-[11px] font-medium text-emerald-900">
                  <span className="block text-[9px] uppercase font-bold text-emerald-600 mb-0.5">
                    Trecho reconhecido
                  </span>
                  &ldquo;{item.trecho_identificado}&rdquo;
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* General Advice Banner */}
      <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-100 flex items-start gap-3">
        <Sparkles className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <div className="text-xs text-slate-700 leading-relaxed">
          <strong className="text-slate-900 font-semibold block mb-0.5">
            Dica Estratégica para o ENEM:
          </strong>
          {avaliacaoGeral} Sempre utilize o conectivo <strong>&ldquo;por meio de&rdquo;</strong> para o Modo/Meio e <strong>&ldquo;a fim de&rdquo;</strong> para o Efeito/Finalidade. No detalhamento, especifique como a ação ocorrerá na prática ou traga um exemplo concreto.
        </div>
      </div>
    </div>
  );
}
