'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProcessingModal from '@/components/ProcessingModal';
import ScoreHero from '@/components/ScoreHero';
import CompetencyCard from '@/components/CompetencyCard';
import InteractiveEssayViewer from '@/components/InteractiveEssayViewer';
import InterventionProposalChecklist from '@/components/InterventionProposalChecklist';
import DetailedFeedbackTabs from '@/components/DetailedFeedbackTabs';
import OCRModal from '@/components/OCRModal';
import {
  Sparkles,
  Camera,
  Upload,
  AlertCircle,
  FileText,
  CheckCircle2,
  HelpCircle,
  BookOpen,
  ArrowRight,
  RotateCcw,
  Zap,
  Info
} from 'lucide-react';
import { CorrectionResult } from '@/types/essay';
import { ENEM_THEMES, SAMPLE_ESSAY_HIGH_SCORE, SAMPLE_ESSAY_INTERMEDIATE } from '@/data/enemThemes';
import { calculateEssayStats } from '@/lib/evaluator';
import { saveEssayCorrection, getCustomApiKey } from '@/services/storage';

export default function CorrigirPage() {
  const [selectedThemeId, setSelectedThemeId] = useState<string>(ENEM_THEMES[1].id);
  const [customTheme, setCustomTheme] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [essayText, setEssayText] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [ocrModalOpen, setOcrModalOpen] = useState<boolean>(false);
  const [correctionResult, setCorrectionResult] = useState<CorrectionResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  // Live real-time statistics
  const stats = calculateEssayStats(essayText);

  // Selected theme string
  const currentTheme =
    selectedThemeId === 'custom'
      ? customTheme.trim() || 'Tema Personalizado'
      : ENEM_THEMES.find((t) => t.id === selectedThemeId)?.titulo || ENEM_THEMES[0].titulo;

  const handleLoadSample = (sampleType: 'high' | 'intermediate') => {
    if (sampleType === 'high') {
      setSelectedThemeId('enem-2023');
      setTitle('Cidadãos Invisíveis e Direitos de Papel');
      setEssayText(SAMPLE_ESSAY_HIGH_SCORE);
    } else {
      setSelectedThemeId('enem-2023');
      setTitle('O Trabalho Silencioso');
      setEssayText(SAMPLE_ESSAY_INTERMEDIATE);
    }
    setErrorMessage(null);
  };

  const handleStartGrading = async () => {
    if (!essayText.trim() || essayText.trim().length < 50) {
      setErrorMessage('Por favor, escreva ou cole uma redação com ao menos 50 caracteres para ser avaliada.');
      return;
    }

    setErrorMessage(null);
    setIsProcessing(true);

    try {
      const apiKey = getCustomApiKey();

      const response = await fetch('/api/grade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: essayText,
          tema: currentTheme,
          titulo: title,
          apiKey: apiKey || undefined,
        }),
      });

      if (!response.ok) {
        throw new Error('Falha ao processar a avaliação.');
      }

      const result: CorrectionResult = await response.json();

      // Salvar no histórico de redações do estudante
      saveEssayCorrection(result);

      // Simular transição suave após o término do loader animado
      setTimeout(() => {
        setIsProcessing(false);
        setCorrectionResult(result);
        if (typeof window !== 'undefined') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }, 4200);
    } catch (err) {
      console.error(err);
      setIsProcessing(false);
      setErrorMessage('Ocorreu um erro ao conectar ao motor de IA. Tente novamente.');
    }
  };

  const handleCopyFeedback = () => {
    if (!correctionResult) return;
    const textReport = `RELATÓRIO DE CORREÇÃO NOTA 1000 - ENEM
Tema: ${correctionResult.tema}
Nota Final: ${correctionResult.nota_total} / 1000

Notas por Competência:
- C1 (Domínio da Norma Culta): ${correctionResult.competencias.c1.nota} / 200
- C2 (Compreensão do Tema e Repertório): ${correctionResult.competencias.c2.nota} / 200
- C3 (Projeto de Texto e Argumentação): ${correctionResult.competencias.c3.nota} / 200
- C4 (Coesão e Conectivos): ${correctionResult.competencias.c4.nota} / 200
- C5 (Proposta de Intervenção): ${correctionResult.competencias.c5.nota} / 200

Feedback Geral:
${correctionResult.feedback_geral}
`;
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(textReport);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleReset = () => {
    setCorrectionResult(null);
    setEssayText('');
    setTitle('');
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Processing Modal State */}
        <ProcessingModal isOpen={isProcessing} />

        {/* OCR Modal */}
        <OCRModal
          isOpen={ocrModalOpen}
          onClose={() => setOcrModalOpen(false)}
          onConfirmText={(text) => {
            setEssayText(text);
            setErrorMessage(null);
          }}
        />

        {/* VIEW 1: RESULT PAGE (When graded) */}
        {correctionResult ? (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Top Score Hero */}
            <ScoreHero
              result={correctionResult}
              onReset={handleReset}
              onCopyFeedback={handleCopyFeedback}
              copied={copied}
            />

            {/* 5 Competency Cards */}
            <div>
              <div className="mb-4">
                <span className="text-xs font-extrabold uppercase tracking-wider text-blue-600 block">
                  Matriz Oficial do INEP
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  Desempenho nas 5 Competências
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <CompetencyCard competency={correctionResult.competencias.c1} number="I" />
                <CompetencyCard competency={correctionResult.competencias.c2} number="II" />
                <CompetencyCard competency={correctionResult.competencias.c3} number="III" />
                <CompetencyCard competency={correctionResult.competencias.c4} number="IV" />
                <div className="md:col-span-2 lg:col-span-2">
                  <CompetencyCard competency={correctionResult.competencias.c5} number="V" />
                </div>
              </div>
            </div>

            {/* In-text Interactive Correction */}
            <InteractiveEssayViewer
              text={correctionResult.texto_original}
              annotations={correctionResult.anotacoes_texto}
            />

            {/* Competência V 5 Elements Checklist */}
            <InterventionProposalChecklist
              elementos={correctionResult.detalhes.proposta_intervencao.elementos}
              notaC5={correctionResult.competencias.c5.nota}
              avaliacaoGeral={correctionResult.detalhes.proposta_intervencao.avaliacao_geral}
            />

            {/* Detailed Feedback Tabs */}
            <DetailedFeedbackTabs detalhes={correctionResult.detalhes} />

            {/* Bottom Actions */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200">
              <div>
                <h4 className="text-base font-bold text-slate-900">
                  Pronto para mais um passo rumo à Nota 1000?
                </h4>
                <p className="text-xs text-slate-600">
                  Sua correção foi salva no histórico do seu painel de estudante.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleReset}
                  className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-md shadow-blue-600/25 transition-all"
                >
                  <RotateCcw className="w-4 h-4" />
                  Corrigir outra redação
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* VIEW 2: ESSAY EDITOR WORKSPACE */
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* Header / Intro */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-widest text-blue-600 mb-1 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" /> Sala de Redação com IA
                </span>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  Editor de Redação do ENEM
                </h1>
                <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl">
                  Digite seu texto, cole sua produção ou faça upload de uma foto da sua folha manuscrita.
                </p>
              </div>

              {/* Fast Sample Loaders */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleLoadSample('high')}
                  className="px-3 py-1.5 rounded-xl border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold transition-all flex items-center gap-1.5"
                  title="Carregar exemplo exemplar nota 960"
                >
                  <Zap className="w-3.5 h-3.5 text-emerald-600" />
                  Exemplo Nota 960
                </button>
                <button
                  type="button"
                  onClick={() => handleLoadSample('intermediate')}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold transition-all flex items-center gap-1.5"
                  title="Carregar exemplo intermediário nota 760"
                >
                  <FileText className="w-3.5 h-3.5 text-slate-500" />
                  Exemplo Nota 760
                </button>
              </div>
            </div>

            {errorMessage && (
              <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-xs sm:text-sm text-rose-800 flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Split Workspace */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Theme Selector, Title, and Main Text Editor */}
              <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
                {/* Theme Selector */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <BookOpen className="w-4 h-4 text-blue-600" />
                      Proposta de Redação / Tema do ENEM
                    </label>
                  </div>
                  <select
                    value={selectedThemeId}
                    onChange={(e) => setSelectedThemeId(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500 bg-slate-50/50"
                  >
                    {ENEM_THEMES.map((theme) => (
                      <option key={theme.id} value={theme.id}>
                        [{theme.ano}] {theme.titulo}
                      </option>
                    ))}
                    <option value="custom">-- Digitar outro tema personalizado --</option>
                  </select>

                  {selectedThemeId === 'custom' && (
                    <input
                      type="text"
                      placeholder="Digite o tema oficial ou proposta personalizada..."
                      value={customTheme}
                      onChange={(e) => setCustomTheme(e.target.value)}
                      className="w-full mt-2 px-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                    />
                  )}
                </div>

                {/* Optional Title */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Título da redação <span className="text-slate-400 font-normal">(Opcional no ENEM)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Cidadãos Invisíveis e Direitos de Papel"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Main Text Area */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-blue-600" />
                      Texto da Redação
                    </label>

                    {/* OCR Button in top bar */}
                    <button
                      type="button"
                      onClick={() => setOcrModalOpen(true)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-xs font-bold transition-all border border-blue-200 shadow-xs"
                    >
                      <Camera className="w-3.5 h-3.5 text-blue-600" />
                      Anexar foto manuscrita (OCR)
                    </button>
                  </div>

                  <div className="relative">
                    <textarea
                      rows={18}
                      placeholder="Comece a digitar sua introdução aqui... Ou clique em 'Anexar foto manuscrita' para digitalizar sua folha de redação."
                      value={essayText}
                      onChange={(e) => setEssayText(e.target.value)}
                      className="w-full p-5 bg-slate-50/50 border border-slate-200 rounded-2xl text-sm sm:text-base font-serif leading-relaxed text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white resize-y shadow-inner"
                    />
                  </div>
                </div>

                {/* Live Stats Indicators */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-center text-xs">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="block text-slate-600 font-medium">Palavras</span>
                    <span className="text-lg font-bold text-slate-900">{stats.palavras}</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="block text-slate-600 font-medium">Caracteres</span>
                    <span className="text-lg font-bold text-slate-900">{stats.caracteres}</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="block text-slate-600 font-medium">Linhas est.</span>
                    <span className={`text-lg font-bold ${
                      stats.linhas_estimadas < 7 && stats.linhas_estimadas > 0
                        ? 'text-rose-600'
                        : stats.linhas_estimadas > 30
                        ? 'text-amber-600'
                        : 'text-slate-900'
                    }`}>
                      {stats.linhas_estimadas} / 30
                    </span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="block text-slate-600 font-medium">Parágrafos</span>
                    <span className={`text-lg font-bold ${stats.paragrafos === 4 ? 'text-emerald-600' : 'text-slate-900'}`}>
                      {stats.paragrafos} / 4 ideais
                    </span>
                  </div>
                </div>

                {/* Warnings if too short or long */}
                {stats.linhas_estimadas > 0 && stats.linhas_estimadas < 7 && (
                  <div className="text-xs text-rose-700 bg-rose-50 p-3 rounded-xl border border-rose-200 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>
                      Atenção: No ENEM, redações com menos de 7 linhas recebem nota zero imediata por insuficiência textual.
                    </span>
                  </div>
                )}

                {/* Action CTA */}
                <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setOcrModalOpen(true)}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-slate-200 text-slate-700 text-xs sm:text-sm font-bold hover:bg-slate-50 transition-colors"
                  >
                    <Upload className="w-4 h-4 text-slate-500" />
                    Enviar foto manuscrita
                  </button>

                  <button
                    type="button"
                    onClick={handleStartGrading}
                    disabled={isProcessing || stats.palavras < 15}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-2xl text-sm sm:text-base font-bold shadow-lg shadow-blue-600/30 active:scale-98 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <Sparkles className="w-5 h-5 text-blue-100" />
                    <span>Corrigir redação com IA</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Right Column: Information, Official Criteria & Tips */}
              <div className="lg:col-span-4 space-y-6">
                {/* INEP Quick Guide Card */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-4">
                  <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">
                      INEP
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">
                        Critérios Oficiais do ENEM
                      </h4>
                      <p className="text-[11px] text-slate-600">5 Competências de 200 pontos</p>
                    </div>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div className="p-3 bg-slate-50 rounded-xl">
                      <strong className="text-slate-900 block font-semibold mb-0.5">
                        C1: Norma Culta (200 pts)
                      </strong>
                      <span className="text-slate-600">
                        Sem desvios gramaticais, pontuação precisa e vocabulário formal.
                      </span>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl">
                      <strong className="text-slate-900 block font-semibold mb-0.5">
                        C2: Tema e Repertório (200 pts)
                      </strong>
                      <span className="text-slate-600">
                        Abordagem total do tema e repertório sociocultural legitimado.
                      </span>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl">
                      <strong className="text-slate-900 block font-semibold mb-0.5">
                        C3: Projeto de Texto (200 pts)
                      </strong>
                      <span className="text-slate-600">
                        Defesa de ponto de vista claro e argumentos aprofundados.
                      </span>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl">
                      <strong className="text-slate-900 block font-semibold mb-0.5">
                        C4: Coesão Textual (200 pts)
                      </strong>
                      <span className="text-slate-600">
                        Conectivos inter e intraparágrafos sem repetições monótonas.
                      </span>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl">
                      <strong className="text-slate-900 block font-semibold mb-0.5">
                        C5: Proposta Completa (200 pts)
                      </strong>
                      <span className="text-slate-600">
                        Agente + Ação + Meio + Finalidade + Detalhamento.
                      </span>
                    </div>
                  </div>
                </div>

                {/* OCR Teaser Box */}
                <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-3xl p-6 shadow-md shadow-blue-600/20 space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center">
                    <Camera className="w-5 h-5 text-white" />
                  </div>
                  <h4 className="text-base font-bold">
                    Escreveu no papel?
                  </h4>
                  <p className="text-xs text-blue-100 leading-relaxed">
                    Você não precisa digitar 30 linhas! Tire uma foto da sua folha de redação manuscrita e nosso sistema OCR faz a leitura e transcrição imediata.
                  </p>
                  <button
                    type="button"
                    onClick={() => setOcrModalOpen(true)}
                    className="w-full mt-2 py-2.5 px-4 bg-white text-blue-700 hover:bg-blue-50 font-bold text-xs rounded-xl transition-colors shadow-xs"
                  >
                    Fotografar redação agora
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
