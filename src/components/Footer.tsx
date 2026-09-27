import React from 'react';
import Link from 'next/link';
import { Sparkles, Heart, ShieldCheck, Award, ArrowUpRight } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand Col */}
          <div className="md:col-span-1 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
                <Sparkles className="w-5 h-5 text-blue-100" />
              </div>
              <span className="font-extrabold text-xl tracking-tight text-white">
                Nota <span className="text-blue-400">1000</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed">
              Inteligência artificial para ajudar você a escrever melhor. Correções instantâneas baseadas nas 5 competências oficiais do ENEM.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Diretrizes oficiais alinhadas à matriz do INEP</span>
            </div>
          </div>

          {/* Links Col 1 */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4">
              Navegação
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Início
                </Link>
              </li>
              <li>
                <Link href="/#como-funciona" className="hover:text-white transition-colors">
                  Como funciona
                </Link>
              </li>
              <li>
                <Link href="/corrigir" className="hover:text-white transition-colors flex items-center gap-1 text-blue-400 font-semibold">
                  Corrigir redação <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-white transition-colors">
                  Painel do estudante
                </Link>
              </li>
              <li>
                <Link href="/historico" className="hover:text-white transition-colors">
                  Histórico de redações
                </Link>
              </li>
            </ul>
          </div>

          {/* Links Col 2 */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4">
              Competências ENEM
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li className="hover:text-slate-300">C1: Escrita Formal (Norma Culta)</li>
              <li className="hover:text-slate-300">C2: Compreensão do Tema e Repertório</li>
              <li className="hover:text-slate-300">C3: Projeto de Texto e Argumentação</li>
              <li className="hover:text-slate-300">C4: Coesão Textual e Conectivos</li>
              <li className="hover:text-slate-300">C5: Proposta de Intervenção (5 Elementos)</li>
            </ul>
          </div>

          {/* Links Col 3 */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4">
              Legal e Suporte
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/#sobre" className="hover:text-white transition-colors">
                  Sobre a plataforma
                </Link>
              </li>
              <li>
                <a href="#termos" onClick={(e) => { e.preventDefault(); alert('Nota 1000: Termos de uso em conformidade com a LGPD e privacidade acadêmica.'); }} className="hover:text-white transition-colors">
                  Termos de uso
                </a>
              </li>
              <li>
                <a href="#privacidade" onClick={(e) => { e.preventDefault(); alert('Nota 1000: Seus textos são privados e usados exclusivamente para sua correção pessoal.'); }} className="hover:text-white transition-colors">
                  Política de privacidade
                </a>
              </li>
              <li>
                <a href="mailto:contato@nota1000.app" className="hover:text-white transition-colors">
                  Contato e Suporte
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© 2026 Nota 1000. Todos os direitos reservados.</p>
          <p className="flex items-center gap-1.5">
            Desenvolvido para vestibulandos com dedicação e tecnologia de ponta
          </p>
        </div>
      </div>
    </footer>
  );
}
