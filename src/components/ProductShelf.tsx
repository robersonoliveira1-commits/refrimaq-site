import { useRef } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { CatalogProduct } from '../lib/quoteEngine';
import ProductCard from './ProductCard';

interface ProductShelfProps {
  title: string;
  subtitle?: string;
  products: CatalogProduct[];
  cartSlugs: Set<string>;
  onAddToQuote: (product: CatalogProduct) => void;
  onInspectProduct: (product: CatalogProduct) => void;
  onViewAll?: () => void;
}

export default function ProductShelf({
  title,
  subtitle,
  products,
  cartSlugs,
  onAddToQuote,
  onInspectProduct,
  onViewAll,
}: ProductShelfProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  if (products.length === 0) return null;

  function scrollByCards(direction: -1 | 1) {
    if (!scrollerRef.current) return;
    const width = scrollerRef.current.clientWidth;
    scrollerRef.current.scrollBy({
      left: direction * Math.max(280, width * 0.78),
      behavior: 'smooth',
    });
  }

  return (
    <section className="py-10 sm:py-12">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-end justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl sm:text-[26px] leading-[1.2] font-medium text-ink-900 tracking-[-0.015em]">
              {title}
            </h2>
            {subtitle && <p className="text-sm text-ink-500 mt-1">{subtitle}</p>}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {onViewAll && (
              <button
                type="button"
                onClick={onViewAll}
                className="text-sm font-medium text-brand-600 hover:text-brand-700 inline-flex items-center gap-1 mr-2 transition-colors"
              >
                Ver todos
                <ArrowRight size={15} strokeWidth={1.5} />
              </button>
            )}
            <div className="hidden sm:flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => scrollByCards(-1)}
                aria-label={`Anterior em ${title}`}
                className="w-9 h-9 rounded-[8px] border border-ink-200 bg-white hover:bg-ink-100 text-ink-600 flex items-center justify-center transition-colors"
              >
                <ChevronLeft size={16} strokeWidth={1.5} />
              </button>
              <button
                type="button"
                onClick={() => scrollByCards(1)}
                aria-label={`Próximo em ${title}`}
                className="w-9 h-9 rounded-[8px] border border-ink-200 bg-white hover:bg-ink-100 text-ink-600 flex items-center justify-center transition-colors"
              >
                <ChevronRight size={16} strokeWidth={1.5} />
              </button>
            </div>
          </div>
        </div>

        {/* Horizontal 4-card Shelf */}
        <div
          ref={scrollerRef}
          className="grid grid-flow-col auto-cols-[78%] sm:auto-cols-[44%] md:auto-cols-[31%] lg:auto-cols-[calc(25%-12px)] gap-4 overflow-x-auto no-scrollbar pb-2 snap-x snap-mandatory"
        >
          {products.map(product => (
            <div key={product.slug} className="snap-start flex">
              <div className="w-full flex flex-col [&>article]:flex-1">
                <ProductCard
                  product={product}
                  inCart={cartSlugs.has(product.slug)}
                  onAddToQuote={onAddToQuote}
                  onInspect={onInspectProduct}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
