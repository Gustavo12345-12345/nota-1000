import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Nota 1000 — Correção de Redações do ENEM com Inteligência Artificial',
  description:
    'Envie sua redação do ENEM e receba uma correção completa baseada nas 5 competências oficiais do INEP com notas, comentários detalhados e sugestões para alcançar a Nota 1000.',
  keywords: [
    'ENEM',
    'redação ENEM',
    'Nota 1000',
    'correção de redação',
    'inteligência artificial',
    'competências ENEM',
    'INEP',
    'proposta de intervenção'
  ],
  authors: [{ name: 'Nota 1000 Team' }],
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans bg-slate-50 text-slate-900 selection:bg-blue-100 selection:text-blue-900">
        {children}
      </body>
    </html>
  );
}
