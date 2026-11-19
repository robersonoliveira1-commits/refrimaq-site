import { useEffect, useMemo, useState } from 'react';
import { MessageCircle } from 'lucide-react';
import { CATALOG_PRODUCTS } from './data/catalog';
import { fetchLiveSiteCatalog } from './lib/liveCatalog';
import {
  CatalogProduct,
  CategoryId,
  QuoteCartItem,
  REFRIMAQ_WHATSAPP_PRIMARY,
  addOrUpdateQuoteItem,
  computeQuoteSummary,
  setQuoteItemQty,
} from './lib/quoteEngine';
import Header from './components/Header';
import Hero from './components/Hero';
import TrustBar from './components/TrustBar';
import ProductShelf from './components/ProductShelf';
import CategoryBannerGrid from './components/CategoryBannerGrid';
import CatalogExplorer from './components/CatalogExplorer';
import ServicesAndAbout from './components/ServicesAndAbout';
import ProductModal from './components/ProductModal';
import QuoteCartDrawer from './components/QuoteCartDrawer';
import Footer from './components/Footer';

export default function App() {
  const [products, setProducts] = useState<CatalogProduct[]>(CATALOG_PRODUCTS);
  const [activeCategory, setActiveCategory] = useState<CategoryId>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<QuoteCartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [inspectedProduct, setInspectedProduct] = useState<CatalogProduct | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    fetchLiveSiteCatalog().then(res => {
      if (active && res.products.length > 0) {
        setProducts(res.products);
      }
    });
    return () => {
      active = false;
    };
  }, []);

  const cartSummary = useMemo(() => computeQuoteSummary(cart), [cart]);
  const cartSlugs = useMemo(() => new Set(cart.map(c => c.product.slug)), [cart]);

  const countsByCategory = useMemo(() => {
    const map: Record<string, number> = {};
    for (const p of products) {
      map[p.categoryId] = (map[p.categoryId] ?? 0) + 1;
    }
    return map;
  }, [products]);

  // Curated Lojas Memo–style shelves built strictly from live/fallback Refrimaq catalog products
  const heroShowcase = useMemo(() => {
    const preferredSlugs = [
      'chopeira-eletrica-small-50-litros-hora-2-torneiras-mundi',
      'chopeira-eletrica-advantage-70-litros-hora-2-torneiras-mundi',
      'torre-naja-plus-memo-advantage-2-torneiras',
    ];
    const picked = preferredSlugs
      .map(s => products.find(p => p.slug === s))
      .filter((p): p is CatalogProduct => Boolean(p));
    if (picked.length > 0) return picked;
    const featured = products.filter(p => p.featured);
    return (featured.length > 0 ? featured : products).slice(0, 3);
  }, [products]);

  const topHighlights = useMemo(() => {
    const prioritySlugs = [
      'chopeira-eletrica-small-50-litros-hora-2-torneiras-mundi',
      'chopeira-eletrica-advantage-70-litros-hora-2-torneiras-mundi',
      'torre-naja-plus-memo-advantage-2-torneiras',
      'chopeira-gelo-barril-rotomoldado-memo-2-torneiras',
      'chopeira-eletrica-facile-30-litros-hora-1-torneira',
      'chopeira-eletrica-slim-50-litros-hora-2-torneiras',
      'pre-resfriador-advantage-hibrido-70-litros-hora',
      'gela-canecas-memo',
    ];
    const featured = products.filter(p => p.featured);
    const ordered: CatalogProduct[] = [];
    const seen = new Set<string>();
    for (const slug of prioritySlugs) {
      const match = featured.find(p => p.slug === slug);
      if (match && !seen.has(match.slug)) {
        ordered.push(match);
        seen.add(match.slug);
      }
    }
    for (const p of featured) {
      if (!seen.has(p.slug)) {
        ordered.push(p);
        seen.add(p.slug);
      }
    }
    return (ordered.length > 0 ? ordered : products).slice(0, 8);
  }, [products]);

  const electricDispensers = useMemo(() => {
    const all = products.filter(p => p.categoryId === 'chopeiras-eletricas');
    const sorted = [...all].sort((a, b) => {
      const pa = a.price !== null ? 1 : 0;
      const pb = b.price !== null ? 1 : 0;
      if (pb !== pa) return pb - pa;
      const fa = a.featured ? 1 : 0;
      const fb = b.featured ? 1 : 0;
      return fb - fa;
    });
    return sorted.slice(0, 8);
  }, [products]);

  const towersAndChill = useMemo(() => {
    const towers = products.filter(p => p.categoryId === 'torres');
    const pre = products.filter(p => p.categoryId === 'pre-resfriadores');
    return [...towers.slice(0, 4), ...pre.slice(0, 4)];
  }, [products]);

  const barrelsAndParts = useMemo(() => {
    const prioritySlugs = [
      'barril-de-30l-slim',
      'carrinho-bond-chopp',
      'kit-de-extracao-de-chopp-sem-cilindro',
      'cilindro-de-gas-co2-4-5kg-em-aluminio-sem-carga',
      'barril-de-50l-euro',
      'torneira-italia-mundi-de-chopp-curta-5-8',
      'sanitizadora-portatil-a-gas-para-assepsia-de-chopeira',
      'caixa-termica-fest-ice-memo-360-litros',
    ];
    const picked = prioritySlugs
      .map(s => products.find(p => p.slug === s))
      .filter((p): p is CatalogProduct => Boolean(p));
    if (picked.length >= 4) return picked;
    return products
      .filter(p => p.categoryId === 'barris' || p.categoryId === 'acessorios')
      .slice(0, 8);
  }, [products]);

  function showToast(msg: string) {
    setToastMsg(msg);
    window.setTimeout(() => {
      setToastMsg(prev => (prev === msg ? null : prev));
    }, 2400);
  }

  function handleAddToQuote(product: CatalogProduct, qty = 1) {
    setCart(prev => addOrUpdateQuoteItem(prev, product, qty));
    showToast(`${product.title} adicionado à cotação`);
  }

  function handleUpdateQty(slug: string, qty: number) {
    setCart(prev => setQuoteItemQty(prev, slug, qty));
  }

  function scrollToElement(id: string) {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  function handleSelectCategory(cat: CategoryId) {
    setActiveCategory(cat);
    requestAnimationFrame(() => scrollToElement('catalogo'));
  }

  function handleSearchSubmit(query: string) {
    setSearchQuery(query);
    if (query.trim()) {
      setActiveCategory('all');
      requestAnimationFrame(() => scrollToElement('catalogo'));
    }
  }

  function handleGoHome() {
    setActiveCategory('all');
    setSearchQuery('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <div className="min-h-screen flex flex-col bg-ink-50 text-ink-900">
      <Header
        products={products}
        activeCategory={activeCategory}
        searchQuery={searchQuery}
        cartUnits={cartSummary.totalUnits}
        onSelectCategory={handleSelectCategory}
        onSearchChange={setSearchQuery}
        onSearchSubmit={handleSearchSubmit}
        onInspectProduct={setInspectedProduct}
        onOpenCart={() => setCartOpen(true)}
        onGoHome={handleGoHome}
        onGoSection={scrollToElement}
      />

      <main className="flex-1">
        {/* 1. Dark Studio Product Hero */}
        <Hero
          featuredProducts={heroShowcase}
          onExploreCatalog={() => scrollToElement('catalogo')}
          onAddToQuote={p => handleAddToQuote(p, 1)}
          onInspectProduct={setInspectedProduct}
          cartSlugs={cartSlugs}
        />

        {/* 2. 5-Column Trust & Benefits Bar */}
        <TrustBar />

        {/* 3. Shelf 1: Destaques Refrimaq (Top linha Memo & Kegsbrasil) */}
        <ProductShelf
          title="Destaques da Refrimaq"
          subtitle="Equipamentos mais procurados da linha Memo e Kegsbrasil"
          products={topHighlights}
          cartSlugs={cartSlugs}
          onAddToQuote={p => handleAddToQuote(p, 1)}
          onInspectProduct={setInspectedProduct}
          onViewAll={() => handleSelectCategory('all')}
        />

        {/* 4. Signature 4-Card Dark Category Showcase (Lojas Memo rhythm) */}
        <CategoryBannerGrid
          countsByCategory={countsByCategory}
          onSelectCategory={handleSelectCategory}
        />

        {/* 5. Shelf 2: Chopeiras Elétricas */}
        <ProductShelf
          title="Chopeiras elétricas"
          subtitle="Modelos residenciais, comerciais e de alta vazão de 30 L/h a 180 L/h"
          products={electricDispensers}
          cartSlugs={cartSlugs}
          onAddToQuote={p => handleAddToQuote(p, 1)}
          onInspectProduct={setInspectedProduct}
          onViewAll={() => handleSelectCategory('chopeiras-eletricas')}
        />

        {/* 6. Shelf 3: Torres de Chopp e Pré-Resfriadores */}
        <ProductShelf
          title="Torres de chopp e pré-resfriadores"
          subtitle="Torres Naja, cilíndricas, congeladas e bancas de gelo para balcão"
          products={towersAndChill}
          cartSlugs={cartSlugs}
          onAddToQuote={p => handleAddToQuote(p, 1)}
          onInspectProduct={setInspectedProduct}
          onViewAll={() => handleSelectCategory('torres')}
        />

        {/* 7. Shelf 4: Barris Kegsbrasil e Acessórios */}
        <ProductShelf
          title="Barris Kegsbrasil, peças e acessórios"
          subtitle="Barris em aço inox, kits de extração, cilindros CO2, torneiras e assepsia"
          products={barrelsAndParts}
          cartSlugs={cartSlugs}
          onAddToQuote={p => handleAddToQuote(p, 1)}
          onInspectProduct={setInspectedProduct}
          onViewAll={() => handleSelectCategory('acessorios')}
        />

        {/* 8. Full Filterable Catalog Explorer */}
        <CatalogExplorer
          products={products}
          activeCategory={activeCategory}
          searchQuery={searchQuery}
          cartSlugs={cartSlugs}
          onSelectCategory={setActiveCategory}
          onClearSearch={() => setSearchQuery('')}
          onAddToQuote={p => handleAddToQuote(p, 1)}
          onInspectProduct={setInspectedProduct}
        />

        {/* 9. Technical Services + Quem Somos */}
        <ServicesAndAbout />
      </main>

      {/* 10. Direct Quote Strip + 5-Column Store Footer */}
      <Footer onSelectCategory={handleSelectCategory} onGoSection={scrollToElement} />

      {/* Quiet Floating WhatsApp Action (never overlapping header or cookies) */}
      <a
        href={`https://wa.me/${REFRIMAQ_WHATSAPP_PRIMARY}`}
        target="_blank"
        rel="noreferrer"
        aria-label="Falar com a Refrimaq no WhatsApp"
        className="fixed bottom-5 right-5 z-30 h-12 px-4 rounded-[10px] bg-ink-900 hover:bg-brand-500 text-white shadow-[0_8px_24px_rgba(0,0,0,0.16)] inline-flex items-center gap-2 text-sm font-medium transition-colors"
      >
        <MessageCircle size={18} strokeWidth={1.5} />
        <span className="hidden sm:inline">WhatsApp</span>
      </a>

      {/* Quiet Feedback Toast */}
      {toastMsg && (
        <div
          role="status"
          className="fixed bottom-5 left-5 z-40 max-w-sm bg-ink-900 text-white border border-white/10 rounded-[10px] px-4 py-3 shadow-[0_8px_24px_rgba(0,0,0,0.18)] flex items-center justify-between gap-4 text-xs animate-enter"
        >
          <span className="truncate">{toastMsg}</span>
          <button
            type="button"
            onClick={() => setCartOpen(true)}
            className="text-brand-100 hover:text-white font-medium shrink-0 underline underline-offset-2"
          >
            Ver cotação
          </button>
        </div>
      )}

      {/* Product Details Quick View */}
      <ProductModal
        product={inspectedProduct}
        onClose={() => setInspectedProduct(null)}
        onAddToQuote={handleAddToQuote}
      />

      {/* Quote Cart Slide-Over Drawer */}
      <QuoteCartDrawer
        open={cartOpen}
        items={cart}
        onClose={() => setCartOpen(false)}
        onUpdateQty={handleUpdateQty}
        onClearCart={() => setCart([])}
      />
    </div>
  );
}
