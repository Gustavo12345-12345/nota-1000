'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Sparkles,
  BookOpen,
  History,
  LayoutDashboard,
  PenTool,
  Info,
  Menu,
  X,
  User as UserIcon,
  LogOut,
  Target,
  Key
} from 'lucide-react';
import { getStoredUser, saveUser, UserProfile, getCustomApiKey, saveCustomApiKey } from '@/services/storage';
import AuthModal from './AuthModal';

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [apiKeyModalOpen, setApiKeyModalOpen] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  useEffect(() => {
    setUser(getStoredUser());
    setApiKeyInput(getCustomApiKey());
  }, []);

  const handleLogout = () => {
    saveUser(null);
    setUser(null);
    setProfileDropdownOpen(false);
  };

  const handleSaveApiKey = () => {
    saveCustomApiKey(apiKeyInput);
    setApiKeyModalOpen(false);
  };

  const navLinks = [
    { label: 'Início', href: '/', icon: Sparkles },
    { label: 'Como funciona', href: '/#como-funciona', icon: Info },
    { label: 'Corrigir', href: '/corrigir', icon: PenTool, highlight: true },
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Histórico', href: '/historico', icon: History },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur border-b border-slate-100 shadow-xs transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 text-blue-100 animate-pulse" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-xl tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
                Nota <span className="text-blue-600">1000</span>
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest text-slate-600 -mt-1">
                IA • Redação ENEM
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1.5 lg:gap-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'text-blue-700 bg-blue-50 font-semibold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Area */}
          <div className="hidden md:flex items-center gap-3">
            {/* API Key settings button (discreet) */}
            <button
              onClick={() => setApiKeyModalOpen(true)}
              title="Configurar Chave de API Gemini (Opcional)"
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <Key className="w-4 h-4" />
            </button>

            {/* CTA Button */}
            <Link
              href="/corrigir"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-sm shadow-blue-600/25 hover:shadow-md hover:shadow-blue-600/30 active:scale-98 transition-all"
            >
              <PenTool className="w-4 h-4" />
              Corrigir redação
            </Link>

            {/* User Profile / Login */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2.5 p-1.5 pl-2.5 rounded-full hover:bg-slate-100 border border-slate-200 transition-colors"
                >
                  <div className="flex flex-col text-right hidden lg:block">
                    <span className="text-xs font-semibold text-slate-800 leading-tight">
                      {user.nome.split(' ')[0]}
                    </span>
                    <span className="text-[10px] text-emerald-600 font-medium leading-none flex items-center justify-end gap-1">
                      <Target className="w-2.5 h-2.5" /> Meta {user.meta_nota}
                    </span>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs border border-blue-200">
                    {user.nome.charAt(0)}
                  </div>
                </button>

                {/* Profile Dropdown */}
                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-sm font-bold text-slate-900">{user.nome}</p>
                      <p className="text-xs text-slate-600 truncate">{user.email}</p>
                    </div>
                    <Link
                      href="/dashboard"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      <LayoutDashboard className="w-4 h-4 text-slate-400" />
                      Meu Painel
                    </Link>
                    <Link
                      href="/historico"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      <History className="w-4 h-4 text-slate-400" />
                      Histórico de Redações
                    </Link>
                    <div className="border-t border-slate-100 my-1" />
                    <button
                      onClick={handleLogout}
                      className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4 text-rose-500" />
                      Sair da conta
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setAuthModalOpen(true)}
                className="flex items-center gap-2 text-slate-700 hover:text-blue-600 px-3 py-2 rounded-xl text-sm font-semibold border border-slate-200 hover:border-blue-200 hover:bg-blue-50/50 transition-all"
              >
                <UserIcon className="w-4 h-4" />
                Entrar
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-2">
            <Link
              href="/corrigir"
              className="bg-blue-600 text-white p-2 rounded-xl text-xs font-semibold shadow-xs"
            >
              <PenTool className="w-4 h-4" />
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 focus:outline-hidden"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-2 shadow-lg animate-in slide-in-from-top duration-200">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-base font-medium transition-all ${
                    isActive
                      ? 'text-blue-700 bg-blue-50 font-semibold'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                  {link.label}
                </Link>
              );
            })}

            <div className="pt-4 border-t border-slate-100 space-y-3">
              {user ? (
                <div className="flex items-center justify-between px-3 py-2 bg-slate-50 rounded-xl">
                  <div>
                    <p className="text-sm font-bold text-slate-900">{user.nome}</p>
                    <p className="text-xs text-slate-600">{user.email}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="text-xs text-rose-600 font-semibold hover:underline"
                  >
                    Sair
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setAuthModalOpen(true);
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  <UserIcon className="w-4 h-4" />
                  Entrar ou Cadastrar
                </button>
              )}

              <Link
                href="/corrigir"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-xl text-base font-bold shadow-md shadow-blue-600/20"
              >
                <PenTool className="w-5 h-5" />
                Corrigir redação agora
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={(newUser) => setUser(newUser)}
      />

      {/* API Key Modal */}
      {apiKeyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-lg">
                <Key className="w-5 h-5 text-blue-600" />
                Chave da API Gemini (Opcional)
              </div>
              <button
                onClick={() => setApiKeyModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-slate-600 mb-4 leading-relaxed">
              O <strong>Nota 1000</strong> já conta com um motor avaliador pedagógico completo e pronto para uso sem nenhuma chave. Se desejar usar sua própria chave da Google Gemini API para chamadas diretas com IA gerativa, insira-a abaixo:
            </p>
            <input
              type="password"
              placeholder="AIzaSy..."
              value={apiKeyInput}
              onChange={(e) => setApiKeyInput(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 font-mono mb-4"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setApiKeyModalOpen(false)}
                className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-xl font-medium"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveApiKey}
                className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-xs"
              >
                Salvar Chave
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
