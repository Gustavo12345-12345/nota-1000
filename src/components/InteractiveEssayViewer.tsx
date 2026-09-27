'use client';

import React, { useState } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  Sparkles,
  Info,
  X,
  HelpCircle,
  Copy,
  Check,
  Filter
} from 'lucide-react';
import { TextAnnotation, AnnotationType } from '@/types/essay';

interface InteractiveEssayViewerProps {
  text: string;
  annotations: TextAnnotation[];
}

export default function InteractiveEssayViewer({ text, annotations }: InteractiveEssayViewerProps) {
  const [selectedAnnotation, setSelectedAnnotation] = useState<TextAnnotation | null>(null);
  const [activeFilter, setActiveFilter] = useState<AnnotationType | 'all'>('all');
  const [copiedSuggestionId, setCopiedSuggestionId] = useState<string | null>(null);

  const filteredAnnotations = annotations.filter((ann) => {
    if (activeFilter === 'all') return true;
    return ann.tipo === activeFilter;
  });

  const handleCopySuggestion = (ann: TextAnnotation) => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(ann.sugestao);
      setCopiedSuggestionId(ann.id);
      setTimeout(() => setCopiedSuggestionId(null), 2000);
    }
  };

  const getStyleForType = (type: AnnotationType) => {
    switch (type) {
      case 'gramatica':
        return {
          highlight: 'bg-rose-100 text-rose-950 border-b-2 border-rose-500 hover:bg-rose-200 cursor-pointer px-1 rounded-sm transition-colors',
          badge: 'bg-rose-100 text-rose-800 border-rose-300',
          dot: 'bg-rose-500',
          title: 'Erro Gramatical / Convenção da Escrita (C1)',
        };
      case 'argumentacao':
        return {
          highlight: 'bg-amber-100 text-amber-950 border-b-2 border-amber-500 hover:bg-amber-200 cursor-pointer px-1 rounded-sm transition-colors',
          badge: 'bg-amber-100 text-amber-800 border-amber-300',
          dot: 'bg-amber-500',
          title: 'Problema de Argumentação / Clareza (C3)',
        };
      case 'coesao':
        return {
          highlight: 'bg-blue-100 text-blue-950 border-b-2 border-blue-500 hover:bg-blue-200 cursor-pointer px-1 rounded-sm transition-colors',
          badge: 'bg-blue-100 text-blue-800 border-blue-300',
          dot: 'bg-blue-500',
          title: 'Problema de Coesão / Mecanismo Linguístico (C4)',
        };
      case 'positivo':
        return {
          highlight: 'bg-emerald-100 text-emerald-950 border-b-2 border-emerald-500 hover:bg-emerald-200 cursor-pointer px-1 rounded-sm transition-colors',
          badge: 'bg-emerald-100 text-emerald-800 border-emerald-300',
          dot: 'bg-emerald-500',
          title: 'Trecho Elogiável / Repertório Produtivo (C2)',
        };
    }
  };

  // Render text with interactive spans
  const renderParagraphWithHighlights = (paragraphText: string) => {
    // If no filtered annotations apply to this paragraph, return it plain
    const matchingAnnotations = filteredAnnotations.filter(ann =>
      paragraphText.includes(ann.trecho)
    );

    if (matchingAnnotations.length === 0) {
      return <p className="leading-relaxed mb-4 text-slate-800 font-serif text-base sm:text-lg">{paragraphText}</p>;
    }

    // Sort matching annotations by index in this paragraph
    let parts: React.ReactNode[] = [];
    let remainingText = paragraphText;
    let keyIdx = 0;

    while (remainingText.length > 0) {
      // Find the earliest occurring annotation
      let earliestMatch: { ann: TextAnnotation; index: number } | null = null;

      for (const ann of matchingAnnotations) {
        const idx = remainingText.indexOf(ann.trecho);
        if (idx !== -1 && (earliestMatch === null || idx < earliestMatch.index)) {
          earliestMatch = { ann, index: idx };
        }
      }

      if (!earliestMatch) {
        parts.push(<span key={`text-${keyIdx++}`}>{remainingText}</span>);
        break;
      }

      // Add text before the match
      if (earliestMatch.index > 0) {
        parts.push(
          <span key={`pre-${keyIdx++}`}>
            {remainingText.slice(0, earliestMatch.index)}
          </span>
        );
      }

      // Add highlighted match
      const ann = earliestMatch.ann;
      const styles = getStyleForType(ann.tipo);
      const isSelected = selectedAnnotation?.id === ann.id;

      parts.push(
        <mark
          key={`mark-${ann.id}-${keyIdx++}`}
          onClick={() => setSelectedAnnotation(ann)}
          className={`${styles.highlight} ${isSelected ? 'ring-2 ring-blue-500 font-semibold' : ''}`}
          title="Clique para ver a correção da IA"
        >
          {ann.trecho}
        </mark>
      );

      // Advance remainingText past this match
      remainingText = remainingText.slice(earliestMatch.index + ann.trecho.length);
    }

    return (
      <p className="leading-relaxed mb-4 text-slate-800 font-serif text-base sm:text-lg">
        {parts}
      </p>
    );
  };

  const paragraphs = text.split(/\n+/).filter(Boolean);

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-md">
      {/* Header and Filter Legend */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div>
          <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-600" />
            Correção diretamente no texto
          </h3>
          <p className="text-xs text-slate-600 mt-0.5">
            Clique em qualquer trecho destacado para abrir a justificativa e a sugestão de reescrita da IA.
          </p>
        </div>

        {/* Filter Chips */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs font-semibold">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1.5 rounded-full transition-all ${
              activeFilter === 'all'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Todos ({annotations.length})
          </button>
          <button
            onClick={() => setActiveFilter('gramatica')}
            className={`px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-all ${
              activeFilter === 'gramatica'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-rose-500" />
            Gramática
          </button>
          <button
            onClick={() => setActiveFilter('argumentacao')}
            className={`px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-all ${
              activeFilter === 'argumentacao'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            Argumentação
          </button>
          <button
            onClick={() => setActiveFilter('coesao')}
            className={`px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-all ${
              activeFilter === 'coesao'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            Coesão
          </button>
          <button
            onClick={() => setActiveFilter('positivo')}
            className={`px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-all ${
              activeFilter === 'positivo'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            Positivo
          </button>
        </div>
      </div>

      {/* Main Container: Text Editor View + Popover Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6">
        {/* Essay Text Area */}
        <div className="lg:col-span-8 bg-slate-50/50 p-6 sm:p-8 rounded-2xl border border-slate-100 max-h-[600px] overflow-y-auto shadow-inner">
          {paragraphs.map((p, idx) => (
            <div key={idx} className="relative pl-6">
              <span className="absolute left-0 top-1 text-[11px] font-mono font-bold text-slate-300 select-none">
                §{idx + 1}
              </span>
              {renderParagraphWithHighlights(p)}
            </div>
          ))}
        </div>

        {/* Selected Annotation Card / Sidebar */}
        <div className="lg:col-span-4 flex flex-col justify-start">
          {selectedAnnotation ? (
            <div className="bg-white rounded-2xl p-5 border-2 border-blue-200 shadow-lg sticky top-24 animate-in fade-in duration-200">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                <span className={`text-[11px] font-extrabold px-2.5 py-1 rounded-md border ${getStyleForType(selectedAnnotation.tipo).badge}`}>
                  {selectedAnnotation.competencia}
                </span>
                <button
                  onClick={() => setSelectedAnnotation(null)}
                  className="text-slate-400 hover:text-slate-600 p-1 rounded-md"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Quote */}
              <div className="mb-3">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  Trecho analisado
                </span>
                <p className="text-xs font-serif italic text-slate-800 bg-slate-50 p-2.5 rounded-lg border border-slate-100 mt-1">
                  &ldquo;{selectedAnnotation.trecho}&rdquo;
                </p>
              </div>

              {/* Problem */}
              <div className="mb-3">
                <span className="text-[10px] uppercase font-bold text-rose-600 tracking-wider">
                  {selectedAnnotation.tipo === 'positivo' ? 'Ponto Forte' : 'Problema Identificado'}
                </span>
                <p className="text-xs font-semibold text-slate-800 mt-0.5">
                  {selectedAnnotation.problema}
                </p>
              </div>

              {/* Suggestion */}
              <div className="mb-4">
                <span className="text-[10px] uppercase font-bold text-blue-600 tracking-wider">
                  Sugestão da IA / Reescrita recomendada
                </span>
                <p className="text-xs text-slate-700 bg-blue-50/60 p-3 rounded-xl border border-blue-100 mt-1 leading-relaxed">
                  {selectedAnnotation.sugestao}
                </p>
              </div>

              {/* Copy suggestion button */}
              <button
                onClick={() => handleCopySuggestion(selectedAnnotation)}
                className="w-full flex items-center justify-center gap-1.5 py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
              >
                {copiedSuggestionId === selectedAnnotation.id ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    Sugestão copiada!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    Copiar sugestão de reescrita
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="h-full min-h-[220px] bg-slate-50/60 rounded-2xl border border-dashed border-slate-200 p-6 flex flex-col items-center justify-center text-center">
              <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center mb-3">
                <Sparkles className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-slate-800 mb-1">
                Inspeção Interativa
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed max-w-[220px]">
                Clique em qualquer uma das palavras ou frases grifadas no texto para ver o parecer pontual da inteligência artificial.
              </p>
            </div>
          )}

          {/* Quick List of Issues */}
          <div className="mt-4 pt-4 border-t border-slate-100">
            <span className="text-xs font-bold text-slate-700 mb-2 block">
              Lista de observações encontradas ({filteredAnnotations.length})
            </span>
            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {filteredAnnotations.map((ann) => {
                const styles = getStyleForType(ann.tipo);
                const isSelected = selectedAnnotation?.id === ann.id;

                return (
                  <button
                    key={ann.id}
                    onClick={() => setSelectedAnnotation(ann)}
                    className={`w-full text-left p-2 rounded-xl text-xs flex items-center gap-2 transition-all ${
                      isSelected
                        ? 'bg-blue-50 text-blue-900 border border-blue-200 font-semibold'
                        : 'bg-white hover:bg-slate-50 border border-slate-100 text-slate-700'
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full shrink-0 ${styles.dot}`} />
                    <span className="truncate flex-1">&ldquo;{ann.trecho}&rdquo;</span>
                    <span className="text-[10px] text-slate-400 font-mono shrink-0">
                      {ann.competencia.replace('Competência ', 'C')}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
