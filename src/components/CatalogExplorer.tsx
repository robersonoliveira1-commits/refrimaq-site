import { useMemo, useState, useEffect } from 'react';
import { ArrowUpDown, RotateCcw, Search } from 'lucide-react';
import {
  CatalogProduct,
  CatalogSort,
  CategoryId,
  filterProducts,
} from '../lib/quoteEngine';
import { CATEGORIES } from '../data/catalog';
import ProductCard from './ProductCard';

interface CatalogExplorerProps {
  products: CatalogProduct[];
  activeCategory: CategoryId;
  searchQuery: string;
  cartSlugs: Set<string>;
  onSelectCategory: (cat: CategoryId) => void;
  onClearSearch: () => void;
  onAddToQuote: (product: CatalogProduct) => void;
  onInspectProduct: (product: CatalogProduct) => void;
}

const PAGE_STEP = 16;

export default function CatalogExplorer({
  products,
  activeCategory,
  searchQuery,
  cartSlugs,
  onSelectCategory,
  onClearSearch,
  onAddToQuote,
  onInspectProduct,
}: CatalogExplorerProps) {
  const [sortBy, setSortBy] = useState<CatalogSort>('featured');
  const [visibleCount, setVisibleCount] = useState(PAGE_STEP);

  useEffect(() => {
    setVisibleCount(PAGE_STEP);
  }, [activeCategory, searchQuery, sortBy]);

  const filtered = useMemo(
    () => filterProducts(products, { query: searchQuery, categoryId: activeCategory, sortBy }),
    [products, searchQuery, activeCategory, sortBy]
  );

  const visibleProducts = filtered.slice(0, visibleCount);
  const activeMeta = CATEGORIES.find(c => c.id === activeCategory);

  return (
    <section id="catalogo" className="py-12 border-t border-ink-200 bg-ink-50">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header + Controls */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl sm:text-[28px] font-medium text-ink-900 tracking-[-0.015em]">
              {activeMeta ? activeMeta.label : 'Catálogo completo Refrimaq'}
            </h2>
            <p className="text-sm text-ink-500 mt-1">
              {searchQuery.trim()
                ? `${filtered.length} resultado(s) para "${searchQuery.trim()}"`
                : activeMeta
                  ? `${activeMeta.tagline} · ${filtered.length} itens`
                  : `${filtered.length} equipamentos, barris e peças originais disponíveis para cotação`}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {(searchQuery.trim() || activeCategory !== 'all') && (
              <button
                type="button"
                onClick={() => {
                  onSelectCategory('all');
                  onClearSearch();
                }}
                className="h-9 px-3 rounded-[8px] border border-ink-200 bg-white hover:bg-ink-100 text-xs font-medium text-ink-700 inline-flex items-center gap-1.5 transition-colors"
              >
                <RotateCcw size={13} strokeWidth={1.5} />
                Limpar filtros
              </button>
            )}

            <div className="inline-flex items-center gap-2 bg-white border border-ink-200 rounded-[8px] px-3 h-9">
              <ArrowUpDown size={14} strokeWidth={1.5} className="text-ink-500" />
              <select
                aria-label="Ordenar catálogo"
                value={sortBy}
                onChange={e => setSortBy(e.target.value as CatalogSort)}
                className="text-xs font-medium text-ink-700 bg-transparent focus:outline-none"
              >
                <option value="featured">Destaques</option>
                <option value="name_asc">Nome (A–Z)</option>
                <option value="price_asc">Com preço primeiro (menor)</option>
                <option value="price_desc">Com preço primeiro (maior)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-3 mb-6">
          <button
            type="button"
            onClick={() => onSelectCategory('all')}
            className={`h-9 px-3.5 rounded-[8px] text-xs font-medium whitespace-nowrap border transition-colors ${
              activeCategory === 'all'
                ? 'bg-ink-900 text-white border-ink-900'
                : 'bg-white text-ink-600 border-ink-200 hover:bg-ink-100'
            }`}
          >
            Todos ({products.length})
          </button>
          {CATEGORIES.map(cat => {
            const count = products.filter(p => p.categoryId === cat.id).length;
            const active = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => onSelectCategory(cat.id)}
                className={`h-9 px-3.5 rounded-[8px] text-xs font-medium whitespace-nowrap border transition-colors tabular-nums ${
                  active
                    ? 'bg-brand-500 text-white border-brand-500'
                    : 'bg-white text-ink-600 border-ink-200 hover:bg-ink-100'
                }`}
              >
                {cat.label} ({count})
              </button>
            );
          })}
        </div>

        {/* Grid */}
        {visibleProducts.length === 0 ? (
          <div className="bg-white border border-ink-200 rounded-[12px] py-16 px-6 text-center">
            <Search size={28} strokeWidth={1.5} className="text-ink-400 mx-auto mb-3" />
            <p className="text-base font-medium text-ink-900">Nenhum produto encontrado</p>
            <p className="text-sm text-ink-500 mt-1">
              Tente outro termo de busca ou explore todas as categorias.
            </p>
            <button
              type="button"
              onClick={() => {
                onSelectCategory('all');
                onClearSearch();
              }}
              className="mt-4 h-10 px-4 rounded-[8px] bg-ink-900 hover:bg-ink-800 text-white text-sm font-medium transition-colors"
            >
              Ver catálogo completo
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {visibleProducts.map(product => (
                <ProductCard
                  key={product.slug}
                  product={product}
                  inCart={cartSlugs.has(product.slug)}
                  onAddToQuote={onAddToQuote}
                  onInspect={onInspectProduct}
                />
              ))}
            </div>

            {visibleCount < filtered.length && (
              <div className="mt-8 text-center">
                <p className="text-xs text-ink-500 font-mono tabular-nums mb-3">
                  Exibindo {visibleProducts.length} de {filtered.length} itens
                </p>
                <button
                  type="button"
                  onClick={() => setVisibleCount(prev => prev + PAGE_STEP)}
                  className="h-11 px-6 rounded-[10px] border border-ink-200 bg-white hover:bg-ink-100 text-sm font-medium text-ink-900 transition-colors"
                >
                  Carregar mais produtos
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
