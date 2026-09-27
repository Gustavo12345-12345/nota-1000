'use client';

import React, { useEffect, useState } from 'react';
import { Sparkles, Check, Loader2, Brain, ShieldAlert, Award } from 'lucide-react';

interface ProcessingModalProps {
  isOpen: boolean;
  onFinished?: () => void;
}

interface Step {
  id: number;
  label: string;
  duration: number; // ms to reach this step
}

const STEPS: Step[] = [
  { id: 1, label: 'Identificando estrutura dissertativa-argumentativa', duration: 700 },
  { id: 2, label: 'Analisando tese, coerência e repertório sociocultural', duration: 1500 },
  { id: 3, label: 'Avaliando critérios das 5 competências oficiais do INEP', duration: 2300 },
  { id: 4, label: 'Verificando gramática, regência e pontuação formal', duration: 3100 },
  { id: 5, label: 'Checando os 5 elementos da intervenção e gerando feedback', duration: 3900 },
];

export default function ProcessingModal({ isOpen, onFinished }: ProcessingModalProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [progress, setProgress] = useState(10);

  useEffect(() => {
    if (!isOpen) {
      setCurrentStepIndex(0);
      setProgress(10);
      return;
    }

    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;

      let nextIndex = 0;
      for (let i = 0; i < STEPS.length; i++) {
        if (elapsed >= STEPS[i].duration) {
          nextIndex = i + 1;
        }
      }
      setCurrentStepIndex(Math.min(nextIndex, STEPS.length));

      // Calculate smooth percentage up to 98%
      const pct = Math.min(98, Math.round(15 + (elapsed / 4500) * 83));
      setProgress(pct);
    }, 150);

    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white rounded-3xl max-w-lg w-full p-8 shadow-2xl border border-slate-100 text-center relative overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-blue-100 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-indigo-100 rounded-full blur-3xl pointer-events-none" />

        {/* Central Animated Badge */}
        <div className="relative mx-auto w-20 h-20 mb-6 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-4 border-blue-100 border-t-blue-600 animate-spin" />
          <div className="w-14 h-14 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/30 text-white">
            <Brain className="w-7 h-7 animate-pulse" />
          </div>
        </div>

        {/* Title & Subtitle */}
        <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-2">
          Analisando sua redação...
        </h3>
        <p className="text-sm text-slate-600 mb-6">
          Nossa inteligência artificial está aplicando a matriz de referência do INEP.
        </p>

        {/* Progress Bar */}
        <div className="w-full bg-slate-100 rounded-full h-2.5 mb-8 overflow-hidden">
          <div
            className="bg-gradient-to-r from-blue-600 to-indigo-600 h-full rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Step Items */}
        <div className="space-y-3 text-left bg-slate-50/80 p-5 rounded-2xl border border-slate-100">
          {STEPS.map((step, idx) => {
            const isDone = currentStepIndex > idx;
            const isCurrent = currentStepIndex === idx;

            return (
              <div
                key={step.id}
                className={`flex items-center gap-3 transition-all duration-300 ${
                  isDone
                    ? 'text-emerald-700 font-semibold'
                    : isCurrent
                    ? 'text-blue-600 font-bold scale-[1.01]'
                    : 'text-slate-400 font-normal opacity-60'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                    isDone
                      ? 'bg-emerald-100 text-emerald-600'
                      : isCurrent
                      ? 'bg-blue-100 text-blue-600'
                      : 'bg-slate-200 text-slate-400'
                  }`}
                >
                  {isDone ? (
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  ) : isCurrent ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-slate-400" />
                  )}
                </div>
                <span className="text-xs sm:text-sm tracking-tight">{step.label}</span>
              </div>
            );
          })}
        </div>

        {/* Educational Tip */}
        <div className="mt-6 text-xs text-slate-600 italic">
          💡 <strong>Dica da banca:</strong> A Competência V exige obrigatoriamente 5 elementos completos para garantir a nota 200.
        </div>
      </div>
    </div>
  );
}
