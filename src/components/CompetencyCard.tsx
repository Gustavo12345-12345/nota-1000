'use client';

import React from 'react';
import { CheckCircle2, AlertTriangle, ChevronRight, Award } from 'lucide-react';
import { CompetencyResult } from '@/types/essay';

interface CompetencyCardProps {
  competency: CompetencyResult;
  number: string; // e.g. "I", "II", "III", "IV", "V"
}

export default function CompetencyCard({ competency, number }: CompetencyCardProps) {
  const { nome, nota, descricao, feedback, pontos_positivos, pontos_melhorar, nivel } = competency;

  // Percentage on 0-200 scale
  const percentage = Math.round((nota / 200) * 100);

  // Color schemes based on score bracket
  const getScoreTheme = (score: number) => {
    if (score >= 180) {
      return {
        badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        progressBar: 'bg-emerald-500',
        scoreColor: 'text-emerald-700',
      };
    }
    if (score >= 140) {
      return {
        badgeBg: 'bg-blue-50 text-blue-700 border-blue-200',
        progressBar: 'bg-blue-600',
        scoreColor: 'text-blue-700',
      };
    }
    if (score >= 100) {
      return {
        badgeBg: 'bg-amber-50 text-amber-700 border-amber-200',
        progressBar: 'bg-amber-500',
        scoreColor: 'text-amber-700',
      };
    }
    return {
      badgeBg: 'bg-rose-50 text-rose-700 border-rose-200',
      progressBar: 'bg-rose-500',
      scoreColor: 'text-rose-700',
    };
  };

  const theme = getScoreTheme(nota);

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
      {/* Header */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-blue-600">
              Competência {number}
            </span>
            <h3 className="text-base font-bold text-slate-900 leading-snug mt-0.5">
              {nome}
            </h3>
          </div>

          <div className="text-right shrink-0">
            <span className={`text-2xl font-black ${theme.scoreColor}`}>
              {nota}
            </span>
            <span className="text-xs font-bold text-slate-400"> / 200</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between items-center text-[11px] text-slate-500 font-medium mb-1.5">
            <span>{nivel}</span>
            <span>{percentage}%</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ${theme.progressBar}`}
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>

        {/* Description & Official Feedback */}
        <p className="text-xs text-slate-600 mb-4 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
          {feedback}
        </p>
      </div>

      {/* Bullets: Pontos Positivos & A Melhorar */}
      <div className="space-y-3 pt-3 border-t border-slate-100 text-xs">
        {/* Positivos */}
        {pontos_positivos && pontos_positivos.length > 0 && (
          <div>
            <span className="font-bold text-emerald-800 flex items-center gap-1.5 mb-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Pontos positivos
            </span>
            <ul className="space-y-1 pl-4 text-slate-600 list-disc marker:text-emerald-500">
              {pontos_positivos.map((pos, idx) => (
                <li key={idx} className="leading-snug">
                  {pos}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* A Melhorar */}
        {pontos_melhorar && pontos_melhorar.length > 0 && (
          <div>
            <span className="font-bold text-amber-800 flex items-center gap-1.5 mb-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" /> Pontos a melhorar
            </span>
            <ul className="space-y-1 pl-4 text-slate-600 list-disc marker:text-amber-500">
              {pontos_melhorar.map((melh, idx) => (
                <li key={idx} className="leading-snug">
                  {melh}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
