'use client';

import { CorrectionResult, HistoryItem, UserProfile } from '@/types/essay';
export type { UserProfile };
import { PRESEEDED_HISTORY, SAMPLE_ESSAY_HIGH_SCORE } from '@/data/enemThemes';
import { evaluateEssayPedagogical } from '@/lib/evaluator';

const HISTORY_KEY = 'nota1000_history';
const USER_KEY = 'nota1000_user';
const API_KEY_STORAGE = 'nota1000_custom_apikey';

export const DEFAULT_USER: UserProfile = {
  id: 'usr-1',
  nome: 'Gabriel Silva',
  email: 'gabriel.estudante@enem.com.br',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  meta_nota: 960,
  data_cadastro: '10/06/2026',
};

export function getStoredUser(): UserProfile | null {
  if (typeof window === 'undefined') return null;
  const data = localStorage.getItem(USER_KEY);
  if (!data) {
    // Inicializar usuário padrão para excelente experiência inicial
    localStorage.setItem(USER_KEY, JSON.stringify(DEFAULT_USER));
    return DEFAULT_USER;
  }
  try {
    return JSON.parse(data);
  } catch {
    return DEFAULT_USER;
  }
}

export function saveUser(user: UserProfile | null): void {
  if (typeof window === 'undefined') return;
  if (!user) {
    localStorage.removeItem(USER_KEY);
  } else {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }
}

export function getCustomApiKey(): string {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem(API_KEY_STORAGE) || '';
}

export function saveCustomApiKey(key: string): void {
  if (typeof window === 'undefined') return;
  if (!key) {
    localStorage.removeItem(API_KEY_STORAGE);
  } else {
    localStorage.setItem(API_KEY_STORAGE, key.trim());
  }
}

export function getEssayHistory(): HistoryItem[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(HISTORY_KEY);

  if (!stored) {
    // Inicializar com o histórico demonstrativo pre-seeded
    // Gerar resultado completo para a redação de 920 para que o estudante possa inspecioná-la
    const full920 = evaluateEssayPedagogical(
      SAMPLE_ESSAY_HIGH_SCORE,
      'Invisibilidade do trabalho de cuidado realizado pela mulher no Brasil',
      'Cidadãos Invisíveis'
    );

    const fullHistory: HistoryItem[] = PRESEEDED_HISTORY.map((item, idx) => {
      if (idx === PRESEEDED_HISTORY.length - 1) {
        return {
          ...item,
          resultado_completo: full920,
        };
      }
      return {
        ...item,
        resultado_completo: {
          ...full920,
          id: item.id,
          tema: item.tema,
          nota_total: item.nota_total,
          distancia_1000: 1000 - item.nota_total,
          competencias: {
            ...full920.competencias,
            c1: { ...full920.competencias.c1, nota: item.competencias.c1 },
            c2: { ...full920.competencias.c2, nota: item.competencias.c2 },
            c3: { ...full920.competencias.c3, nota: item.competencias.c3 },
            c4: { ...full920.competencias.c4, nota: item.competencias.c4 },
            c5: { ...full920.competencias.c5, nota: item.competencias.c5 },
          },
        },
      };
    });

    localStorage.setItem(HISTORY_KEY, JSON.stringify(fullHistory));
    return fullHistory;
  }

  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
}

export function saveEssayCorrection(result: CorrectionResult): HistoryItem[] {
  if (typeof window === 'undefined') return [];
  const currentHistory = getEssayHistory();

  // Calcular variação em relação à redação anterior
  const previousItem = currentHistory[0]; // mais recente
  const variacao = previousItem ? result.nota_total - previousItem.nota_total : undefined;

  const newItem: HistoryItem = {
    id: result.id,
    tema: result.tema,
    titulo: result.titulo,
    data: result.data,
    nota_total: result.nota_total,
    competencias: {
      c1: result.competencias.c1.nota,
      c2: result.competencias.c2.nota,
      c3: result.competencias.c3.nota,
      c4: result.competencias.c4.nota,
      c5: result.competencias.c5.nota,
    },
    variacao_anterior: variacao,
    texto_resumo: result.feedback_geral.slice(0, 150) + '...',
    resultado_completo: result,
  };

  const updated = [newItem, ...currentHistory];
  localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
  return updated;
}

export function deleteEssayFromHistory(id: string): HistoryItem[] {
  if (typeof window === 'undefined') return [];
  const currentHistory = getEssayHistory();
  const updated = currentHistory.filter(item => item.id !== id);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
  return updated;
}

export function clearEssayHistory(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(HISTORY_KEY);
}
