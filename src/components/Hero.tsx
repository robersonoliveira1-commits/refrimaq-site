import { useState } from 'react';
import { ArrowRight, MessageCircle, Plus, Check } from 'lucide-react';
import { CatalogProduct, REFRIMAQ_WHATSAPP_PRIMARY } from '../lib/quoteEngine';

interface HeroProps {
  featuredProducts: CatalogProduct[];
  onExploreCatalog: () => void;
  onAddToQuote: (product: CatalogProduct) => void;
  onInspectProduct: (product: CatalogProduct) => void;
  cartSlugs: Set<string>;
}

export default function Hero({
  featuredProducts,
  onExploreCatalog,
  onAddToQuote,
  onInspectProduct,
  cartSlugs,
}: HeroProps) {
  const showcase = featuredProducts.slice(0, 3);
  const [activeIndex, setActiveIndex] = useState(0);
  const current = showcase[activeIndex] ?? featuredProducts[0];

  if (!current) return null;
  const inCart = cartSlugs.has(current.slug);

  return (
    <section className="bg-ink-950 text-white relative overflow-hidden">
      {/* Subtle single-neutral tonal depth (no hue gradients, no glowing blobs) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(65% 80% at 78% 48%, rgba(255,255,255,0.06) 0%, rgba(13,16,20,0) 70%)',
        }}
      />

      <div className="relative max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Copy Column — calm dark space, 1 primary + 1 secondary action */}
          <div className="lg:col-span-6 space-y-6 animate-enter">
            <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs font-mono text-ink-400">
              <span>Representante exclusiva Memo no RS</span>
              <span aria-hidden="true">·</span>
              <span>Barris Kegsbrasil</span>
            </div>

            <h1 className="text-[36px] sm:text-[48px] lg:text-[56px] leading-[1.05] tracking-[-0.028em] font-medium text-white max-w-xl">
              Chopeiras, torres e barris com engenharia de balcão
            </h1>

            <p className="text-base sm:text-lg leading-[1.55] text-ink-400 max-w-lg font-normal">
              Equipamentos elétricos de 30 L/h a 180 L/h, chopeiras a gelo, pré-resfriadores,
              peças originais e assistência técnica especializada com entrega em todo o Brasil.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                type="button"
                onClick={onExploreCatalog}
                className="h-12 px-6 rounded-[10px] bg-brand-500 hover:bg-brand-600 active:scale-[0.98] text-white text-sm font-medium inline-flex items-center gap-2 transition-[background-color,transform] duration-150 ease-smooth"
              >
                Explorar catálogo
                <ArrowRight size={16} strokeWidth={1.5} />
              </button>
              <a
                href={`https://wa.me/${REFRIMAQ_WHATSAPP_PRIMARY}?text=${encodeURIComponent(
                  'Olá, Refrimaq. Gostaria de atendimento para escolher o equipamento ideal.'
                )}`}
                target="_blank"
                rel="noreferrer"
                className="h-12 px-5 rounded-[10px] bg-ink-800 hover:bg-ink-700 border border-white/10 active:scale-[0.98] text-ink-100 text-sm font-medium inline-flex items-center gap-2 transition-[background-color,transform] duration-150 ease-smooth"
              >
                <MessageCircle size={16} strokeWidth={1.5} />
                Falar no WhatsApp
              </a>
            </div>

            {/* Quiet key figures (aligned, tabular, single line) */}
            <div className="pt-5 border-t border-white/10 grid grid-cols-3 gap-3 sm:gap-6 max-w-lg">
              <div>
                <p className="font-mono text-lg sm:text-2xl font-medium text-white tabular-nums whitespace-nowrap">10x</p>
                <p className="text-xs text-ink-400 mt-1">Parcelamento sem juros</p>
              </div>
              <div>
                <p className="font-mono text-lg sm:text-2xl font-medium text-white tabular-nums whitespace-nowrap">30–180 L/h</p>
                <p className="text-xs text-ink-400 mt-1">Residencial a eventos</p>
              </div>
              <div>
                <p className="font-mono text-lg sm:text-2xl font-medium text-white tabular-nums whitespace-nowrap">200+</p>
                <p className="text-xs text-ink-400 mt-1">Equipamentos e peças</p>
              </div>
            </div>
          </div>

          {/* Right Product Stage — real product photo + technical engineering spec card */}
          <div className="lg:col-span-6">
            <div className="bg-ink-900 border border-white/10 rounded-[16px] p-5 sm:p-6">
              {/* Stage image frame */}
              <div className="relative bg-white rounded-[12px] aspect-[4/3] flex items-center justify-center p-6 sm:p-8 overflow-hidden">
                <span className="absolute top-3 left-3 font-mono text-xs text-ink-600 bg-ink-100 border border-ink-200 px-2.5 py-1 rounded-[6px] tabular-nums">
                  {current.specs}
                </span>
                {current.brand && (
                  <span className="absolute top-3 right-3 text-xs font-medium text-ink-500">
                    {current.brand}
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => onInspectProduct(current)}
                  className="w-full h-full flex items-center justify-center focus:outline-none"
                  aria-label={`Ver detalhes de ${current.title}`}
                >
                  <img
                    src={current.image}
                    alt={current.title}
                    fetchPriority="high"
                    className="max-h-[260px] sm:max-h-[300px] w-auto object-contain transition-transform duration-300 ease-smooth hover:scale-[1.02]"
                  />
                </button>
              </div>

              {/* Equipment Meta & Quick Quote Action */}
              <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-xs text-ink-400">{current.categoryLabel}</p>
                  <button
                    type="button"
                    onClick={() => onInspectProduct(current)}
                    className="text-base font-medium text-white hover:text-ink-200 text-left truncate block max-w-full mt-0.5 transition-colors"
                  >
                    {current.title}
                  </button>
                  <p className="text-sm font-mono text-ink-200 mt-1 tabular-nums">
                    {current.priceLabel}
                    <span className="text-ink-400 font-sans text-xs ml-2">{current.installments}</span>
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => onAddToQuote(current)}
                  className={`h-10 px-4 rounded-[8px] text-sm font-medium inline-flex items-center justify-center gap-1.5 shrink-0 transition-colors ${
                    inCart
                      ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-white text-ink-950 hover:bg-ink-100'
                  }`}
                >
                  {inCart ? <Check size={15} strokeWidth={1.75} /> : <Plus size={15} strokeWidth={1.75} />}
                  {inCart ? 'Na cotação' : 'Cotar item'}
                </button>
              </div>

              {/* Quiet selector tabs for the 3 hero highlights */}
              {showcase.length > 1 && (
                <div className="mt-4 pt-4 border-t border-white/10 grid grid-cols-3 gap-2">
                  {showcase.map((item, idx) => {
                    const active = idx === activeIndex;
                    return (
                      <button
                        key={item.slug}
                        type="button"
                        onClick={() => setActiveIndex(idx)}
                        className={`px-3 py-2 rounded-[8px] text-left transition-colors border ${
                          active
                            ? 'bg-ink-800 border-white/15 text-white'
                            : 'bg-transparent border-transparent text-ink-400 hover:bg-ink-800/50 hover:text-ink-200'
                        }`}
                      >
                        <p className="font-mono text-[11px] tabular-nums text-ink-400">{item.specs}</p>
                        <p className="text-xs font-medium truncate mt-0.5">{item.title}</p>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
