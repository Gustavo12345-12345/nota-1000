'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ScoreHero from '@/components/ScoreHero';
import CompetencyCard from '@/components/CompetencyCard';
import InteractiveEssayViewer from '@/components/InteractiveEssayViewer';
import InterventionProposalChecklist from '@/components/InterventionProposalChecklist';
import DetailedFeedbackTabs from '@/components/DetailedFeedbackTabs';
import {
  History,
  Calendar,
  Award,
  TrendingUp,
  TrendingDown,
  Trash2,
  Eye,
  PenTool,
  Search,
  Sparkles,
  X,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  Filter
} from 'lucide-react';
import { getEssayHistory, deleteEssayFromHistory, clearEssayHistory } from '@/services/storage';
import { HistoryItem, CorrectionResult } from '@/types/essay';

export default function HistoricoPage() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEssay, setSelectedEssay] = useState<CorrectionResult | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setHistory(getEssayHistory());
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleDelete = (id: string) => {
    const updated = deleteEssayFromHistory(id);
    setHistory(updated);
    setDeleteConfirmId(null);
    showToast('Redação removida do histórico com sucesso.');
  };

  const filteredHistory = history.filter(
    (item) =>
      item.tema.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.titulo && item.titulo.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleCopyFeedback = () => {
    if (!selectedEssay) return;
    const textReport = `RELATÓRIO DE CORREÇÃO NOTA 1000 - ENEM
Tema: ${selectedEssay.tema}
Nota Final: ${selectedEssay.nota_total} / 1000
`;
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(textReport);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl text-xs font-semibold flex items-center gap-2.5 animate-in slide-in-from-bottom duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 text-center">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">
              Excluir esta redação?
            </h3>
            <p className="text-xs text-slate-600 mb-6 leading-relaxed">
              Esta ação removerá permanentemente a avaliação do seu histórico e atualizará suas estatísticas.
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="py-2.5 px-4 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs"
              >
                Sim, excluir
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Full Essay Detail Modal */}
      {selectedEssay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/75 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
          <div className="bg-slate-50 rounded-3xl max-w-5xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 my-8 space-y-6 relative max-h-[92vh] overflow-y-auto">
            <button
              onClick={() => setSelectedEssay(null)}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-700 p-2 rounded-full hover:bg-slate-200 transition-colors z-10"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Score Hero */}
            <ScoreHero
              result={selectedEssay}
              onReset={() => setSelectedEssay(null)}
              onCopyFeedback={handleCopyFeedback}
              copied={copied}
            />

            {/* Competency Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <CompetencyCard competency={selectedEssay.competencias.c1} number="I" />
              <CompetencyCard competency={selectedEssay.competencias.c2} number="II" />
              <CompetencyCard competency={selectedEssay.competencias.c3} number="III" />
              <CompetencyCard competency={selectedEssay.competencias.c4} number="IV" />
              <div className="md:col-span-2 lg:col-span-2">
                <CompetencyCard competency={selectedEssay.competencias.c5} number="V" />
              </div>
            </div>

            {/* In-text Interactive Annotations */}
            {selectedEssay.texto_original && (
              <InteractiveEssayViewer
                text={selectedEssay.texto_original}
                annotations={selectedEssay.anotacoes_texto || []}
              />
            )}

            {/* Competência V */}
            {selectedEssay.detalhes?.proposta_intervencao && (
              <InterventionProposalChecklist
                elementos={selectedEssay.detalhes.proposta_intervencao.elementos}
                notaC5={selectedEssay.competencias.c5.nota}
                avaliacaoGeral={selectedEssay.detalhes.proposta_intervencao.avaliacao_geral}
              />
            )}

            {/* Detailed Feedback Tabs */}
            {selectedEssay.detalhes && (
              <DetailedFeedbackTabs detalhes={selectedEssay.detalhes} />
            )}
          </div>
        </div>
      )}

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
        {/* Top Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-blue-600 block mb-1">
              Registro Acadêmico
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
              <History className="w-7 h-7 text-blue-600" />
              Histórico de Redações Corrigidas
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Revise suas produções anteriores, compare suas notas e acompanhe sua trajetória até a Nota 1000.
            </p>
          </div>

          <Link
            href="/corrigir"
            className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold shadow-md shadow-blue-600/25 transition-all shrink-0"
          >
            <PenTool className="w-4 h-4" />
            + Nova Redação
          </Link>
        </div>

        {/* Linear Evolution Stepper Timeline (Redação 1 → 720 | Redação 2 → 780...) */}
        {history.length > 0 && (
          <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600 block">
              Trilha de Evolução do Estudante
            </span>
            <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-thin">
              {[...history].reverse().map((item, idx, arr) => (
                <React.Fragment key={item.id}>
                  <div className="bg-slate-50 border border-slate-200/80 px-4 py-2.5 rounded-2xl shrink-0 flex items-center gap-2.5">
                    <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center">
                      {idx + 1}
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-600 block font-medium">
                        Redação #{idx + 1}
                      </span>
                      <span className="text-sm font-black text-slate-900">
                        {item.nota_total} pts
                      </span>
                    </div>
                  </div>

                  {idx < arr.length - 1 && (
                    <ArrowRight className="w-4 h-4 text-blue-400 shrink-0" />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        )}

        {/* Search Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
          <Search className="w-5 h-5 text-slate-400 shrink-0 ml-1" />
          <input
            type="text"
            placeholder="Buscar por tema da redação ou título..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-xs sm:text-sm text-slate-900 placeholder:text-slate-600 focus:outline-hidden"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* History Cards Grid */}
        {filteredHistory.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredHistory.map((item) => {
              const isPositive = item.variacao_anterior && item.variacao_anterior > 0;

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
                >
                  <div>
                    {/* Top Row: Date & Score Variation */}
                    <div className="flex items-center justify-between gap-2 pb-3 mb-3 border-b border-slate-100">
                      <span className="text-xs text-slate-600 flex items-center gap-1.5 font-medium">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {item.data}
                      </span>

                      {item.variacao_anterior !== undefined ? (
                        <span
                          className={`text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                            isPositive
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}
                        >
                          {isPositive ? (
                            <TrendingUp className="w-3 h-3" />
                          ) : (
                            <TrendingDown className="w-3 h-3" />
                          )}
                          {isPositive ? `+${item.variacao_anterior}` : item.variacao_anterior} pts
                        </span>
                      ) : (
                        <span className="text-[11px] text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                          Primeira avaliação
                        </span>
                      )}
                    </div>

                    {/* Theme & Title */}
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 mb-1">
                      {item.tema}
                    </h3>
                    {item.titulo && (
                      <p className="text-xs text-slate-600 italic mb-3">
                        &ldquo;{item.titulo}&rdquo;
                      </p>
                    )}

                    {/* Total Score Badge */}
                    <div className="my-4 flex items-baseline gap-2 bg-blue-50/50 p-4 rounded-2xl border border-blue-100">
                      <span className="text-3xl font-black text-slate-900">
                        {item.nota_total}
                      </span>
                      <span className="text-xs font-bold text-slate-600">/ 1000</span>
                      <span className="ml-auto text-xs font-bold text-blue-700 bg-white px-2.5 py-1 rounded-xl shadow-xs">
                        Faltam {1000 - item.nota_total} pts
                      </span>
                    </div>

                    {/* Competency Scores Breakdown */}
                    <div className="grid grid-cols-5 gap-1.5 text-center text-[10px] font-mono py-2 bg-slate-50 rounded-xl mb-4">
                      <div>
                        <span className="block text-slate-600 font-sans font-bold">C1</span>
                        <span className="font-bold text-slate-800">{item.competencias.c1}</span>
                      </div>
                      <div>
                        <span className="block text-slate-600 font-sans font-bold">C2</span>
                        <span className="font-bold text-slate-800">{item.competencias.c2}</span>
                      </div>
                      <div>
                        <span className="block text-slate-600 font-sans font-bold">C3</span>
                        <span className="font-bold text-slate-800">{item.competencias.c3}</span>
                      </div>
                      <div>
                        <span className="block text-slate-600 font-sans font-bold">C4</span>
                        <span className="font-bold text-slate-800">{item.competencias.c4}</span>
                      </div>
                      <div>
                        <span className="block text-slate-600 font-sans font-bold">C5</span>
                        <span className="font-bold text-slate-800">{item.competencias.c5}</span>
                      </div>
                    </div>
                  </div>

                  {/* Card Actions */}
                  <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                    <button
                      onClick={() => setDeleteConfirmId(item.id)}
                      className="p-2 text-slate-400 hover:text-rose-600 rounded-xl hover:bg-rose-50 transition-colors"
                      title="Excluir do histórico"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => setSelectedEssay(item.resultado_completo)}
                      className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-xs transition-all"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      Ver correção completa
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Empty State */
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-4 max-w-md mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
              <History className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              Nenhuma redação encontrada
            </h3>
            <p className="text-xs text-slate-600">
              {searchTerm
                ? 'Nenhuma redação corresponde aos termos da sua busca. Tente outras palavras-chave.'
                : 'Você ainda não possui redações corrigidas no seu histórico. Envie seu primeiro texto agora!'}
            </p>
            <Link
              href="/corrigir"
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-md shadow-blue-600/20"
            >
              <PenTool className="w-4 h-4" />
              Corrigir minha primeira redação
            </Link>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
