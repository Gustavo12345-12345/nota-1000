export type CompetencyKey = 'c1' | 'c2' | 'c3' | 'c4' | 'c5';

export interface CompetencyResult {
  id: CompetencyKey;
  nome: string;
  descricao: string;
  nota: number; // 0, 40, 80, 120, 160, 200
  nivel: string; // ex: "Nível 5 - Excelente"
  feedback: string;
  pontos_positivos: string[];
  pontos_melhorar: string[];
}

export type AnnotationType = 'gramatica' | 'argumentacao' | 'coesao' | 'positivo';

export interface TextAnnotation {
  id: string;
  tipo: AnnotationType;
  trecho: string;
  inicio?: number;
  fim?: number;
  problema: string;
  sugestao: string;
  competencia: string;
}

export type InterventionElementType = 'agente' | 'acao' | 'meio' | 'finalidade' | 'detalhamento';

export interface InterventionElement {
  tipo: InterventionElementType;
  nome: string;
  pergunta: string; // ex: "Quem executará a ação?"
  presente: boolean;
  trecho_identificado?: string;
  explicacao: string;
}

export interface DetailedFeedback {
  pontos_fortes: string[];
  pontos_melhorar: string[];
  sugestoes_ia: string[];
  repertorio_sociocultural: {
    avaliacao: string;
    pertinente: boolean;
    legitimo: boolean;
    produtivo: boolean;
    exemplos_citados: string[];
  };
  argumentacao: {
    avaliacao: string;
    projeto_de_texto: string;
    desenvolvimento: string;
  };
  coesao: {
    avaliacao: string;
    conectivos_utilizados: string[];
    problemas_repeticao: string[];
  };
  proposta_intervencao: {
    nota_c5: number;
    elementos: InterventionElement[];
    avaliacao_geral: string;
  };
}

export interface EssayStats {
  palavras: number;
  caracteres: number;
  linhas_estimadas: number;
  paragrafos: number;
}

export interface CorrectionResult {
  id: string;
  tema: string;
  titulo?: string;
  texto_original: string;
  data: string; // ISO or formatted date
  nota_total: number; // 0 to 1000
  distancia_1000: number; // 1000 - nota_total
  feedback_geral: string;
  competencias: Record<CompetencyKey, CompetencyResult>;
  anotacoes_texto: TextAnnotation[];
  detalhes: DetailedFeedback;
  estatisticas: EssayStats;
}

export interface HistoryItem {
  id: string;
  tema: string;
  titulo?: string;
  data: string;
  nota_total: number;
  competencias: {
    c1: number;
    c2: number;
    c3: number;
    c4: number;
    c5: number;
  };
  variacao_anterior?: number; // e.g. +60 or -20
  texto_resumo: string;
  resultado_completo: CorrectionResult;
}

export interface UserProfile {
  id: string;
  nome: string;
  email: string;
  avatar?: string;
  meta_nota: number;
  data_cadastro: string;
}
