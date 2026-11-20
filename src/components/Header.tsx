import { useEffect, useRef, useState } from 'react';
import {
  Search,
  ShoppingBag,
  PhoneCall,
  Wrench,
  Menu,
  X,
  Mail,
  MessageCircle,
  ChevronRight,
} from 'lucide-react';
import {
  CatalogProduct,
  CategoryId,
  REFRIMAQ_EMAIL,
  REFRIMAQ_WHATSAPP_PRIMARY,
  REFRIMAQ_WHATSAPP_SECONDARY,
  filterProducts,
} from '../lib/quoteEngine';
import { CATEGORIES } from '../data/catalog';

interface HeaderProps {
  products: CatalogProduct[];
  activeCategory: CategoryId;
  searchQuery: string;
  cartUnits: number;
  onSelectCategory: (cat: CategoryId) => void;
  onSearchChange: (q: string) => void;
  onSearchSubmit: (q: string) => void;
  onInspectProduct: (product: CatalogProduct) => void;
  onOpenCart: () => void;
  onOpenServiceVisit: () => void;
  onGoHome: () => void;
  onGoSection: (sectionId: string) => void;
}

export default function Header({
  products,
  activeCategory,
  searchQuery,
  cartUnits,
  onSelectCategory,
  onSearchChange,
  onSearchSubmit,
  onInspectProduct,
  onOpenCart,
  onOpenServiceVisit,
  onGoHome,
  onGoSection,
}: HeaderProps) {
  const [searchFocused, setSearchFocused] = useState(false);
  const [supportOpen, setSupportOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const searchWrapRef = useRef<HTMLDivElement>(null);
  const supportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (searchWrapRef.current && !searchWrapRef.current.contains(e.target as Node)) {
        setSearchFocused(false);
      }
      if (supportRef.current && !supportRef.current.contains(e.target as Node)) {
        setSupportOpen(false);
      }
    }
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  const quickMatches =
    searchQuery.trim().length >= 2
      ? filterProducts(products, { query: searchQuery, categoryId: 'all' }).slice(0, 6)
      : [];

  function handleFormSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSearchFocused(false);
    onSearchSubmit(searchQuery);
  }

  return (
    <header className="sticky top-0 z-40 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
      {/* Tier 1: White Store Utility Bar */}
      <div className="border-b border-ink-200">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 h-[72px] flex items-center gap-4 lg:gap-8">
          {/* Mobile menu trigger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(prev => !prev)}
            aria-label="Abrir menu de categorias"
            className="lg:hidden p-2 -ml-2 text-ink-600 hover:text-ink-900 rounded-lg hover:bg-ink-100 transition-colors"
          >
            {mobileMenuOpen ? <X size={20} strokeWidth={1.5} /> : <Menu size={20} strokeWidth={1.5} />}
          </button>

          {/* Official Refrimaq Logo */}
          <button
            type="button"
            onClick={onGoHome}
            aria-label="Refrimaq — Página inicial"
            className="shrink-0 flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 rounded-lg"
          >
            <img
              src="/media/logo-dark.svg"
              alt="Refrimaq Refrigeração"
              className="h-11 sm:h-12 w-auto object-contain"
            />
          </button>

          {/* Center Search Bar (Lojas Memo rhythm, unslopped surface) */}
          <div ref={searchWrapRef} className="relative flex-1 max-w-2xl hidden md:block">
            <form onSubmit={handleFormSubmit} className="relative">
              <input
                type="search"
                value={searchQuery}
                onFocus={() => setSearchFocused(true)}
                onChange={e => onSearchChange(e.target.value)}
                placeholder="Buscar chopeiras, torres, barris ou peças"
                className="w-full h-11 pl-4 pr-11 rounded-[10px] bg-ink-100 border border-transparent focus:bg-white focus:border-brand-500 focus:outline-none text-sm text-ink-900 placeholder:text-ink-500 transition-colors"
              />
              <button
                type="submit"
                aria-label="Buscar"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center text-ink-500 hover:text-brand-600 rounded-lg transition-colors"
              >
                <Search size={18} strokeWidth={1.5} />
              </button>
            </form>

            {/* Instant Search Suggestions Dropdown */}
            {searchFocused && searchQuery.trim().length >= 2 && (
              <div className="absolute left-0 right-0 top-[calc(100%+6px)] bg-white border border-ink-200 rounded-[12px] shadow-[0_8px_24px_rgba(0,0,0,0.08)] overflow-hidden z-50">
                {quickMatches.length === 0 ? (
                  <div className="px-4 py-5 text-sm text-ink-500 text-center">
                    Nenhum item encontrado para &ldquo;{searchQuery.trim()}&rdquo;
                  </div>
                ) : (
                  <>
                    <div className="divide-y divide-ink-100">
                      {quickMatches.map(item => (
                        <button
                          key={item.slug}
                          type="button"
                          onClick={() => {
                            setSearchFocused(false);
                            onInspectProduct(item);
                          }}
                          className="w-full px-4 py-2.5 flex items-center gap-3 hover:bg-ink-50 text-left transition-colors"
                        >
                          <div className="w-11 h-11 rounded-lg bg-white border border-ink-100 p-1 shrink-0 flex items-center justify-center">
                            <img src={item.image} alt={item.title} className="w-full h-full object-contain" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-ink-900 truncate">{item.title}</p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="font-mono text-[11px] text-ink-500">{item.specs}</span>
                              <span className="text-ink-400 text-[11px]">·</span>
                              <span className="text-xs text-ink-600 tabular-nums">{item.priceLabel}</span>
                            </div>
                          </div>
                          <ChevronRight size={16} strokeWidth={1.5} className="text-ink-400 shrink-0" />
                        </button>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setSearchFocused(false);
                        onSearchSubmit(searchQuery);
                      }}
                      className="w-full px-4 py-2.5 bg-ink-50 border-t border-ink-200 text-xs font-medium text-brand-600 hover:bg-brand-50 text-center transition-colors"
                    >
                      Ver todos os resultados no catálogo
                    </button>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Right Store Utility Links */}
          <div className="ml-auto flex items-center gap-1 sm:gap-2">
            {/* Atendimento Popover */}
            <div ref={supportRef} className="relative hidden sm:block">
              <button
                type="button"
                onClick={() => setSupportOpen(prev => !prev)}
                className="h-10 px-3 rounded-[10px] flex items-center gap-2 text-sm text-ink-600 hover:text-ink-900 hover:bg-ink-100 transition-colors"
              >
                <PhoneCall size={18} strokeWidth={1.5} className="text-ink-500" />
                <span className="hidden xl:inline font-medium">Atendimento</span>
              </button>

              {supportOpen && (
                <div className="absolute right-0 top-[calc(100%+8px)] w-72 bg-white border border-ink-200 rounded-[12px] shadow-[0_8px_24px_rgba(0,0,0,0.08)] p-4 space-y-3 z-50">
                  <p className="text-xs font-medium text-ink-500">Canais diretos Refrimaq</p>
                  <div className="space-y-2">
                    <a
                      href={`https://wa.me/${REFRIMAQ_WHATSAPP_PRIMARY}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-ink-50 transition-colors"
                    >
                      <MessageCircle size={16} strokeWidth={1.5} className="text-brand-600 shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-ink-900 tabular-nums">(51) 98574-7069</p>
                        <p className="text-xs text-ink-500">WhatsApp Vendas e Cotações</p>
                      </div>
                    </a>
                    <a
                      href={`https://wa.me/${REFRIMAQ_WHATSAPP_SECONDARY}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-ink-50 transition-colors"
                    >
                      <MessageCircle size={16} strokeWidth={1.5} className="text-brand-600 shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-ink-900 tabular-nums">(51) 99160-4815</p>
                        <p className="text-xs text-ink-500">WhatsApp Comercial e Peças</p>
                      </div>
                    </a>
                    <a
                      href={`mailto:${REFRIMAQ_EMAIL}`}
                      className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-ink-50 transition-colors"
                    >
                      <Mail size={16} strokeWidth={1.5} className="text-ink-500 shrink-0" />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-ink-900 truncate">{REFRIMAQ_EMAIL}</p>
                        <p className="text-xs text-ink-500">Orçamentos corporativos</p>
                      </div>
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* Serviços Técnicos — Agendamento de Visita Técnica */}
            <button
              type="button"
              onClick={onOpenServiceVisit}
              aria-label="Agendar visita técnica"
              title="Agendar visita técnica (Corretivo, Sanitização ou Projeto)"
              className="flex h-10 px-2.5 sm:px-3 rounded-[10px] items-center gap-2 text-sm text-ink-700 hover:text-brand-600 hover:bg-brand-50/70 border border-transparent hover:border-brand-100 transition-colors"
            >
              <Wrench size={18} strokeWidth={1.5} className="text-brand-600 sm:text-ink-500" />
              <span className="hidden xl:inline font-medium">Serviços</span>
            </button>

            {/* Quote Cart Trigger */}
            <button
              type="button"
              onClick={onOpenCart}
              aria-label="Abrir lista de cotação"
              className="h-10 px-3.5 rounded-[10px] bg-ink-900 hover:bg-ink-800 text-white flex items-center gap-2 text-sm font-medium transition-colors"
            >
              <ShoppingBag size={17} strokeWidth={1.5} />
              <span className="hidden sm:inline">Cotação</span>
              <span
                className={`min-w-[20px] h-5 px-1.5 rounded-[6px] font-mono text-xs flex items-center justify-center tabular-nums ${
                  cartUnits > 0 ? 'bg-brand-500 text-white' : 'bg-ink-700 text-ink-200'
                }`}
              >
                {cartUnits}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="px-4 pb-3 md:hidden">
          <form onSubmit={handleFormSubmit} className="relative">
            <input
              type="search"
              value={searchQuery}
              onChange={e => onSearchChange(e.target.value)}
              placeholder="Buscar chopeiras, torres ou peças"
              className="w-full h-10 pl-3.5 pr-10 rounded-[10px] bg-ink-100 border border-transparent focus:bg-white focus:border-brand-500 focus:outline-none text-sm text-ink-900 placeholder:text-ink-500 transition-colors"
            />
            <button
              type="submit"
              aria-label="Buscar"
              className="absolute right-1 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center text-ink-500"
            >
              <Search size={16} strokeWidth={1.5} />
            </button>
          </form>
        </div>
      </div>

      {/* Tier 2: Dark Graphite Category Bar (Lojas Memo signature navigation bar) */}
      <nav aria-label="Categorias de produtos" className="bg-ink-900 text-white hidden lg:block">
        <div className="max-w-[1360px] mx-auto px-8 h-11 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
            <button
              type="button"
              onClick={() => onSelectCategory('all')}
              className={`h-8 px-3 rounded-[8px] text-[13px] font-medium whitespace-nowrap transition-colors ${
                activeCategory === 'all'
                  ? 'bg-ink-800 text-white border border-white/10'
                  : 'text-ink-200 hover:text-white hover:bg-ink-800/70'
              }`}
            >
              Catálogo completo
            </button>
            {CATEGORIES.map(cat => {
              const active = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => onSelectCategory(cat.id)}
                  className={`h-8 px-3 rounded-[8px] text-[13px] font-medium whitespace-nowrap transition-colors ${
                    active
                      ? 'bg-brand-500 text-white'
                      : 'text-ink-200 hover:text-white hover:bg-ink-800/70'
                  }`}
                >
                  {cat.shortLabel}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-5 shrink-0 text-[13px] text-ink-400">
            <button
              type="button"
              onClick={() => onGoSection('quem-somos')}
              className="hover:text-white transition-colors"
            >
              Quem somos
            </button>
            <button
              type="button"
              onClick={() => onGoSection('contato')}
              className="hover:text-white transition-colors"
            >
              Contato
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-ink-900 text-white border-t border-white/10 px-4 py-4 space-y-1">
          <button
            type="button"
            onClick={() => {
              onSelectCategory('all');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-ink-100 hover:bg-ink-800"
          >
            Catálogo completo
          </button>
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              type="button"
              onClick={() => {
                onSelectCategory(cat.id);
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium ${
                activeCategory === cat.id ? 'bg-brand-500 text-white' : 'text-ink-200 hover:bg-ink-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
          <div className="pt-2 mt-2 border-t border-white/10 flex flex-col gap-1">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenServiceVisit();
              }}
              className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-white bg-brand-500/20 border border-brand-500/40 hover:bg-brand-500/30 flex items-center gap-2"
            >
              <Wrench size={15} strokeWidth={1.5} />
              Agendar visita técnica
            </button>
            <button
              type="button"
              onClick={() => {
                onGoSection('servicos');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded-lg text-sm text-ink-300 hover:bg-ink-800"
            >
              Serviços técnicos
            </button>
            <button
              type="button"
              onClick={() => {
                onGoSection('quem-somos');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded-lg text-sm text-ink-300 hover:bg-ink-800"
            >
              Quem somos
            </button>
            <a
              href={`https://wa.me/${REFRIMAQ_WHATSAPP_PRIMARY}`}
              target="_blank"
              rel="noreferrer"
              className="w-full text-left px-3 py-2 rounded-lg text-sm text-ink-200 hover:bg-ink-800 tabular-nums"
            >
              WhatsApp: (51) 98574-7069
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
