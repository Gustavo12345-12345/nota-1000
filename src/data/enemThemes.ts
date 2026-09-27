import { CorrectionResult, HistoryItem } from '@/types/essay';

export interface EnemTheme {
  id: string;
  ano: string | number;
  titulo: string;
  categoria: string;
  textoMotivadorResumo: string;
  eixoTematico: string;
}

export const ENEM_THEMES: EnemTheme[] = [
  {
    id: 'enem-2024',
    ano: 2024,
    titulo: 'Desafios para a valorização da herança africana no Brasil',
    categoria: 'Cultura e Sociedade',
    eixoTematico: 'Identidade e Cidadania',
    textoMotivadorResumo: 'Discussão sobre a preservação da memória, combate ao racismo estrutural e reconhecimento das contribuições culturais e históricas afro-brasileiras.',
  },
  {
    id: 'enem-2023',
    ano: 2023,
    titulo: 'Invisibilidade do trabalho de cuidado realizado pela mulher no Brasil',
    categoria: 'Gênero e Direitos',
    eixoTematico: 'Desigualdade Social',
    textoMotivadorResumo: 'Análise da sobrecarga feminina com afazeres domésticos e cuidados com dependentes, gerando desvantagens profissionais e econômicas.',
  },
  {
    id: 'enem-2022',
    ano: 2022,
    titulo: 'Desafios para a valorização de comunidades e povos tradicionais no Brasil',
    categoria: 'Meio Ambiente e Cidadania',
    eixoTematico: 'Direitos Humanos',
    textoMotivadorResumo: 'Importância dos povos originários e tradicionais (quilombolas, ribeirinhos, indígenas) para a biodiversidade e os entraves à garantia de suas terras.',
  },
  {
    id: 'enem-2021',
    ano: 2021,
    titulo: 'Invisibilidade e registro civil: garantia de acesso à cidadania no Brasil',
    categoria: 'Cidadania e Direitos',
    eixoTematico: 'Documentação e Políticas Públicas',
    textoMotivadorResumo: 'A falta de certidão de nascimento como obstáculo fundamental ao exercício pleno da cidadania e acesso a direitos básicos de saúde e educação.',
  },
  {
    id: 'enem-2020',
    ano: 2020,
    titulo: 'O estigma associado às doenças mentais na sociedade brasileira',
    categoria: 'Saúde Pública',
    eixoTematico: 'Bem-estar e Sociedade',
    textoMotivadorResumo: 'A desmistificação dos transtornos psicológicos e psiquiátricos e a superação do preconceito no acesso a tratamentos adequados no SUS.',
  },
  {
    id: 'enem-inedito-1',
    ano: 'Inédito 2025/2026',
    titulo: 'Impactos da inteligência artificial generativa na integridade acadêmica e no mercado de trabalho',
    categoria: 'Tecnologia e Educação',
    eixoTematico: 'Inovação e Ética',
    textoMotivadorResumo: 'A necessidade de regulação ética e adaptação pedagógica frente à ascensão rápida de ferramentas de IA generativa.',
  },
];

export const SAMPLE_ESSAY_HIGH_SCORE = `Na obra "Cidadãos de Papel", o jornalista Gilberto Dimenstein pontua que a garantia formal de direitos na Carta Magna brasileira de 1988 nem sempre se consolida no cotidiano da população. Análogo a essa reflexão, percebe-se que a invisibilidade do trabalho de cuidado realizado pela mulher no Brasil perpetua uma grave disparidade socioeconômica, desrespeitando preceitos constitucionais fundamentais. Nesse sentido, destacam-se como vetores determinantes dessa conjuntura tanto o machismo estrutural enraizado quanto a escassez de políticas públicas assistenciais eficazes.

Em primeiro lugar, é premente analisar a raiz histórica que naturaliza a sobrecarga feminina no âmbito doméstico. Sob a perspectiva da socióloga Heleieth Saffioti, as estruturas patriarcais operam dividindo o trabalho de maneira hierárquica, de modo que tarefas reprodutivas, como o cuidado de enfermos e crianças, sejam relegadas ao espaço privado sem qualquer remuneração ou prestígio social. Com efeito, essa dinâmica obstaculiza a ascensão profissional das mulheres e acentua a dependência financeira, reforçando um ciclo de vulnerabilidade que impede a igualdade de gênero preconizada no artigo 5º da Constituição Federal.

Ademais, a ausência de uma rede estatal robusta de suporte agrava esse cenário de negligência. De acordo com o conceito de "Inoperância Estatal", formulado por Thomas Hobbes em sua reflexão sobre os deveres do pacto social, cabe ao poder público prover amparo quando a coletividade se encontra fragilizada. Contudo, a escassez de creches em período integral e de centros especializados para idosos impõe à família – e, invariavelmente, à mulher – o fardo exclusivo de zelar pelos dependentes. Dessa forma, a inação governamental transfere obrigações públicas para os ombros das cidadãs, solapando seu desenvolvimento pessoal e acadêmico.

Portanto, medidas são urgentes para dirimir tamanha iniqüidade. Cabe ao Ministério do Desenvolvimento e Assistência Social, em parceria com o Ministério das Mulheres, instituir o Programa Nacional de Apoio ao Cuidado Familiar, por meio da alocação de verbas orçamentárias federais e da ampliação de creches e asilos públicos em regime integral. Essa ação deve ser complementada por campanhas pedagógicas nos meios de comunicação de massa que desmistifiquem os papéis de gênero tradicionais. Com isso, busca-se erradicar a invisibilidade dessa labuta e assegurar que a dignidade da mulher deixe de ser mera previsão em papel, tornando-se plena realidade.`;

export const SAMPLE_ESSAY_INTERMEDIATE = `A invisibilidade do trabalho de cuidado realizado pela mulher no Brasil é um assunto muito sério que precisa ser resolvido logo. Historicamente as mulheres sempre cuidaram da casa e dos filhos sem ganhar nada por isso, enquanto os homens iam trabalhar fora e ganhavam dinheiro. Isso acontece por causa do preconceito da sociedade brasileira, além disso o governo não dá creches suficientes para ajudar as mães.

Primeiramente, devemos falar sobre a cultura machista. Desde pequenas as meninas recebem bonecas e panelinhas de brinquedo enquanto os meninos ganham carros e brinquedos científicos. Esse costume faz com que todo mundo ache normal a mulher limpar a casa cozinhar e cuidar dos parentes idosos. Segundo a filósofa Simone de Beauvoir ninguém nasce mulher, torna-se mulher mostrando que a sociedade impõe esses papéis desiguais.

Além do mais, a falta de creche é um grande obstáculo. Muitas mulheres não conseguem emprego de carteira assinada porque não tem com quem deixar os filhos pequenos durante o dia. Dessa forma elas acabam trabalhando no mercado informal ou ficam dependendo dos maridos. Por conseguinte, a renda delas fica muito menor e o país perde a força de trabalho feminina.

Portanto medidas precisam ser tomadas pelo governo. O Ministério da Educação junto com a sociedade deve criar mais creches nas periferias das cidades brasileiras para as mães deixarem os filhos com segurança para que assim o Brasil possa ser um lugar mais justo para todas.`;

export const PRESEEDED_HISTORY: HistoryItem[] = [
  {
    id: 'hist-1',
    tema: 'O estigma associado às doenças mentais na sociedade brasileira',
    data: '15/07/2026',
    nota_total: 720,
    competencias: { c1: 120, c2: 160, c3: 120, c4: 160, c5: 160 },
    variacao_anterior: undefined,
    texto_resumo: 'Primeira redação analisada. Identificada necessidade de enriquecer repertório e aprofundar elementos da intervenção.',
    resultado_completo: {} as CorrectionResult,
  },
  {
    id: 'hist-2',
    tema: 'Invisibilidade e registro civil: garantia de acesso à cidadania no Brasil',
    data: '02/08/2026',
    nota_total: 780,
    competencias: { c1: 160, c2: 160, c3: 140, c4: 160, c5: 160 },
    variacao_anterior: 60,
    texto_resumo: 'Melhora notável no domínio da norma culta e concordâncias nominais. Avanço de 60 pontos.',
    resultado_completo: {} as CorrectionResult,
  },
  {
    id: 'hist-3',
    tema: 'Desafios para a valorização de comunidades e povos tradicionais no Brasil',
    data: '24/08/2026',
    nota_total: 840,
    competencias: { c1: 160, c2: 180, c3: 160, c4: 160, c5: 180 },
    variacao_anterior: 60,
    texto_resumo: 'Evolução consistente na estruturação dos parágrafos de desenvolvimento e uso de conectivos interparágrafos.',
    resultado_completo: {} as CorrectionResult,
  },
  {
    id: 'hist-4',
    tema: 'Invisibilidade do trabalho de cuidado realizado pela mulher no Brasil',
    data: '18/09/2026',
    nota_total: 920,
    competencias: { c1: 180, c2: 200, c3: 180, c4: 180, c5: 180 },
    variacao_anterior: 80,
    texto_resumo: 'Excelente desempenho! Repertório sociocultural legitimado e proposta de intervenção detalhada com 5 elementos.',
    resultado_completo: {} as CorrectionResult,
  },
];
