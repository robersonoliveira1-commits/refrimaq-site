import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ArrowRight,
  MessageCircle,
  Plus,
  Check,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { CatalogProduct, REFRIMAQ_WHATSAPP_PRIMARY } from '../lib/quoteEngine';
import { SiteBanner, buildBannerWhatsAppUrl, getHeroTheme } from '../lib/liveBanners';

interface HeroProps {
  allProducts: CatalogProduct[];
  featuredProducts: CatalogProduct[];
  banners: SiteBanner[];
  onExploreCatalog: () => void;
  onAddToQuote: (product: CatalogProduct) => void;
  onInspectProduct: (product: CatalogProduct) => void;
  onBannerAction: (banner: SiteBanner) => void;
  cartSlugs: Set<string>;
}

interface ProductStageProps {
  products: CatalogProduct[];
  cartSlugs: Set<string>;
  onAddToQuote: (product: CatalogProduct) => void;
  onInspectProduct: (product: CatalogProduct) => void;
  isPrimaryLcpSlide: boolean;
}

function ProductStage({
  products,
  cartSlugs,
  onAddToQuote,
  onInspectProduct,
  isPrimaryLcpSlide,
}: ProductStageProps) {
  const showcase = products.slice(0, 3);
  const [activeIndex, setActiveIndex] = useState(0);
  const current = showcase[activeIndex] ?? products[0];

  if (!current) return null;
  const inCart = cartSlugs.has(current.slug);

  return (
    <div className="bg-ink-900 border border-white/10 rounded-[16px] p-5 sm:p-6">
      {/* Stage image frame with reserved aspect-ratio (prevents CLS) */}
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
          className="w-full h-full flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 rounded-[8px]"
          aria-label={`Ver detalhes de ${current.title}`}
        >
          <img
            src={current.image}
            alt={current.title}
            fetchPriority={isPrimaryLcpSlide ? 'high' : 'low'}
            loading={isPrimaryLcpSlide ? undefined : 'lazy'}
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

      {/* Quiet selector tabs for up to 3 hero highlights */}
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
  );
}

function DefaultInstitutionalHero({
  featuredProducts,
  onExploreCatalog,
  onAddToQuote,
  onInspectProduct,
  cartSlugs,
}: Pick<
  HeroProps,
  'featuredProducts' | 'onExploreCatalog' | 'onAddToQuote' | 'onInspectProduct' | 'cartSlugs'
>) {
  return (
    <section className="bg-ink-950 text-white relative overflow-hidden">
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
          <div className="lg:col-span-6 space-y-6 animate-enter">
            <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs font-mono text-ink-400">
              <span>Representante exclusiva Memo no RS</span>
              <span aria-hidden="true">·</span>
              <span>Assistência técnica especializada</span>
            </div>

            <h1 className="hero-display-heading font-medium text-white max-w-xl">
              Chopeiras, torres e acessórios com engenharia de balcão
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

            <div className="pt-5 border-t border-white/10 grid grid-cols-3 gap-3 sm:gap-6 max-w-lg">
              <div>
                <p className="font-mono text-lg sm:text-2xl font-medium text-white tabular-nums whitespace-nowrap">
                  10x
                </p>
                <p className="text-xs text-ink-400 mt-1">Parcelamento sem juros</p>
              </div>
              <div>
                <p className="font-mono text-lg sm:text-2xl font-medium text-white tabular-nums whitespace-nowrap">
                  30–180 L/h
                </p>
                <p className="text-xs text-ink-400 mt-1">Residencial a eventos</p>
              </div>
              <div>
                <p className="font-mono text-lg sm:text-2xl font-medium text-white tabular-nums whitespace-nowrap">
                  200+
                </p>
                <p className="text-xs text-ink-400 mt-1">Equipamentos e peças</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <ProductStage
              products={featuredProducts}
              cartSlugs={cartSlugs}
              onAddToQuote={onAddToQuote}
              onInspectProduct={onInspectProduct}
              isPrimaryLcpSlide={true}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

interface DynamicSlideProps {
  banner: SiteBanner;
  slideIndex: number;
  allProducts: CatalogProduct[];
  defaultFeatured: CatalogProduct[];
  cartSlugs: Set<string>;
  onAddToQuote: (product: CatalogProduct) => void;
  onInspectProduct: (product: CatalogProduct) => void;
  onBannerAction: (banner: SiteBanner) => void;
}

const ARTWORK_COVER_MAX_RATIO_DIFF = 1.22;

function ArtworkBannerMedia({
  desktopUrl,
  mobileUrl,
  alt,
  isPrimaryLcp,
}: {
  desktopUrl: string;
  mobileUrl?: string;
  alt: string;
  isPrimaryLcp: boolean;
}) {
  const [naturalRatio, setNaturalRatio] = useState<number | null>(null);
  const [isMobileViewport, setIsMobileViewport] = useState<boolean>(() =>
    typeof window !== 'undefined' ? window.innerWidth < 640 : false
  );

  useEffect(() => {
    function handleResize() {
      setIsMobileViewport(window.innerWidth < 640);
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const activeSrc = isMobileViewport && mobileUrl ? mobileUrl : desktopUrl;
  const slotRatio = isMobileViewport ? 750 / 820 : 1920 / 580;
  const needsAmbientContain =
    naturalRatio !== null &&
    Math.max(naturalRatio / slotRatio, slotRatio / naturalRatio) > ARTWORK_COVER_MAX_RATIO_DIFF;

  return (
    <>
      {needsAmbientContain && (
        <img
          src={activeSrc}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover scale-110 blur-2xl brightness-[0.42] saturate-125 pointer-events-none"
        />
      )}
      <picture className="relative z-10 block w-full h-full">
        {mobileUrl && <source media="(max-width: 639px)" srcSet={mobileUrl} />}
        <img
          src={desktopUrl}
          alt={alt}
          fetchPriority={isPrimaryLcp ? 'high' : 'low'}
          loading={isPrimaryLcp ? undefined : 'lazy'}
          onLoad={e => {
            const img = e.currentTarget;
            if (img.naturalWidth > 0 && img.naturalHeight > 0) {
              setNaturalRatio(img.naturalWidth / img.naturalHeight);
            }
          }}
          className={
            needsAmbientContain
              ? 'w-full h-full object-contain drop-shadow-[0_12px_32px_rgba(0,0,0,0.45)] transition-transform duration-500 ease-smooth group-hover:scale-[1.01]'
              : 'w-full h-full object-cover transition-transform duration-500 ease-smooth group-hover:scale-[1.01]'
          }
        />
      </picture>
    </>
  );
}

function DynamicBannerSlide({
  banner,
  slideIndex,
  allProducts,
  defaultFeatured,
  cartSlugs,
  onAddToQuote,
  onInspectProduct,
  onBannerAction,
}: DynamicSlideProps) {
  const theme = getHeroTheme(banner.themePreset);
  const isPrimaryLcp = slideIndex === 0;
  const HeadingTag = slideIndex === 0 ? 'h1' : 'h2';

  // MODE A: Full-Bleed Edge-to-Edge Custom Artwork (100% viewport width on Desktop & Mobile)
  if (banner.mode === 'artwork') {
    return (
      <div
        className="w-full relative overflow-hidden"
        style={{ backgroundColor: theme.sectionBg }}
      >
        <button
          type="button"
          onClick={() => onBannerAction(banner)}
          aria-label={banner.imageAlt || banner.name}
          className="group relative block w-full overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white/80 aspect-[15/16] sm:aspect-[1920/580] sm:min-h-[340px] sm:max-h-[620px] bg-ink-950"
        >
          <ArtworkBannerMedia
            desktopUrl={banner.desktopImageUrl}
            mobileUrl={banner.mobileImageUrl}
            alt={banner.imageAlt || banner.name}
            isPrimaryLcp={isPrimaryLcp}
          />

          {banner.ctaLabel && (
            <span
              className="absolute z-20 bottom-14 sm:bottom-6 right-4 sm:right-8 h-10 sm:h-11 px-4 sm:px-5 rounded-[10px] text-xs sm:text-sm font-medium inline-flex items-center gap-2 shadow-[0_8px_24px_rgba(0,0,0,0.45)] transition-transform duration-150 group-hover:translate-x-0.5"
              style={{
                backgroundColor: theme.primaryBtnBg,
                color: theme.primaryBtnText,
              }}
            >
              {banner.ctaLabel}
              <ArrowRight size={15} strokeWidth={1.75} />
            </span>
          )}
        </button>
      </div>
    );
  }

  // MODE B: Editable Seasonal Campaign Editorial Hero
  const customStageProducts =
    banner.featuredProductSlugs.length > 0
      ? banner.featuredProductSlugs
          .map(slug => allProducts.find(p => p.slug === slug))
          .filter((p): p is CatalogProduct => Boolean(p))
      : [];
  const stageProducts = customStageProducts.length > 0 ? customStageProducts : defaultFeatured;

  return (
    <div
      className="w-full text-white relative overflow-hidden"
      style={{ backgroundColor: theme.sectionBg }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{ background: theme.radialGlow }}
      />

      <div className="relative max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Campaign Copy Column */}
          <div className="lg:col-span-6 space-y-5">
            <div className="flex flex-wrap items-center gap-2.5">
              {banner.badgeText && (
                <span
                  className="font-mono text-xs font-medium px-2.5 py-1 rounded-[6px] border"
                  style={{
                    backgroundColor: theme.badgeBg,
                    color: theme.badgeText,
                    borderColor: theme.badgeBorder,
                  }}
                >
                  {banner.badgeText}
                </span>
              )}
              {banner.eyebrow && (
                <span className="font-mono text-xs text-ink-400">{banner.eyebrow}</span>
              )}
            </div>

            <HeadingTag className="hero-display-heading font-medium text-white max-w-xl">
              {banner.headline}
            </HeadingTag>

            {banner.subtitle && (
              <p className="text-base sm:text-lg leading-[1.55] text-ink-300 max-w-lg font-normal">
                {banner.subtitle}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                type="button"
                onClick={() => onBannerAction(banner)}
                className="h-12 px-6 rounded-[10px] active:scale-[0.98] text-sm font-medium inline-flex items-center gap-2 transition-transform duration-150 ease-smooth focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
                style={{
                  backgroundColor: theme.primaryBtnBg,
                  color: theme.primaryBtnText,
                }}
              >
                {banner.ctaLabel}
                <ArrowRight size={16} strokeWidth={1.5} />
              </button>

              {banner.secondaryCtaLabel && (
                <a
                  href={buildBannerWhatsAppUrl(banner)}
                  target="_blank"
                  rel="noreferrer"
                  className="h-12 px-5 rounded-[10px] bg-white/10 hover:bg-white/15 border border-white/15 active:scale-[0.98] text-white text-sm font-medium inline-flex items-center gap-2 transition-colors duration-150"
                >
                  <MessageCircle size={16} strokeWidth={1.5} />
                  {banner.secondaryCtaLabel}
                </a>
              )}
            </div>

            <div className="pt-5 border-t border-white/10 grid grid-cols-3 gap-3 sm:gap-6 max-w-lg">
              <div>
                <p className="font-mono text-lg sm:text-2xl font-medium text-white tabular-nums whitespace-nowrap">
                  10x
                </p>
                <p className="text-xs text-ink-400 mt-1">Parcelamento sem juros</p>
              </div>
              <div>
                <p className="font-mono text-lg sm:text-2xl font-medium text-white tabular-nums whitespace-nowrap">
                  30–180 L/h
                </p>
                <p className="text-xs text-ink-400 mt-1">Residencial a eventos</p>
              </div>
              <div>
                <p className="font-mono text-lg sm:text-2xl font-medium text-white tabular-nums whitespace-nowrap">
                  200+
                </p>
                <p className="text-xs text-ink-400 mt-1">Equipamentos e peças</p>
              </div>
            </div>
          </div>

          {/* Right Stage: Custom Uploaded Artwork OR Interactive Product Showcase */}
          <div className="lg:col-span-6">
            {banner.desktopImageUrl ? (
              <div className="bg-ink-900 border border-white/10 rounded-[16px] p-3 sm:p-4">
                <button
                  type="button"
                  onClick={() => onBannerAction(banner)}
                  aria-label={banner.imageAlt || banner.headline}
                  className="block w-full rounded-[12px] overflow-hidden aspect-[4/3] bg-ink-950 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
                >
                  <picture className="block w-full h-full">
                    {banner.mobileImageUrl && (
                      <source media="(max-width: 639px)" srcSet={banner.mobileImageUrl} />
                    )}
                    <img
                      src={banner.desktopImageUrl}
                      alt={banner.imageAlt || banner.headline}
                      fetchPriority={isPrimaryLcp ? 'high' : 'low'}
                      loading={isPrimaryLcp ? undefined : 'lazy'}
                      className="w-full h-full object-cover hover:scale-[1.015] transition-transform duration-300 ease-smooth"
                    />
                  </picture>
                </button>
              </div>
            ) : (
              <ProductStage
                products={stageProducts}
                cartSlugs={cartSlugs}
                onAddToQuote={onAddToQuote}
                onInspectProduct={onInspectProduct}
                isPrimaryLcpSlide={isPrimaryLcp}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Hero({
  allProducts,
  featuredProducts,
  banners,
  onExploreCatalog,
  onAddToQuote,
  onInspectProduct,
  onBannerAction,
  cartSlugs,
}: HeroProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const pendingTargetRef = useRef<number | null>(null);
  const settledIndexRef = useRef<number>(0);
  const rafRef = useRef<number | null>(null);
  const debounceRef = useRef<number | null>(null);

  const [activeSlide, setActiveSlide] = useState(0);
  const [statusAnnouncement, setStatusAnnouncement] = useState('');

  const slideCount = banners.length;

  const getNearestSlideIndex = useCallback((): number => {
    const track = trackRef.current;
    if (!track || slideCount <= 1) return 0;
    const width = track.clientWidth;
    if (width <= 0) return 0;
    return Math.max(0, Math.min(slideCount - 1, Math.round(track.scrollLeft / width)));
  }, [slideCount]);

  const scrollToSlide = useCallback(
    (targetIndex: number) => {
      const track = trackRef.current;
      if (!track || slideCount <= 1) return;
      const wrapped = ((targetIndex % slideCount) + slideCount) % slideCount;
      pendingTargetRef.current = wrapped;
      setActiveSlide(wrapped);
      const slideEl = track.children[wrapped] as HTMLElement | undefined;
      if (slideEl) {
        const delta = slideEl.offsetLeft - track.scrollLeft;
        track.scrollBy({ left: delta });
      }
    },
    [slideCount]
  );

  // Sync active marker on scroll (rAF-throttled) and announce status on settle (scrollend or debounced scroll)
  useEffect(() => {
    const track = trackRef.current;
    if (!track || slideCount <= 1) return;

    const handleSettled = () => {
      const nearest = getNearestSlideIndex();
      pendingTargetRef.current = null;
      setActiveSlide(nearest);
      if (nearest !== settledIndexRef.current) {
        settledIndexRef.current = nearest;
        const slideName = banners[nearest]?.headline || banners[nearest]?.name || '';
        setStatusAnnouncement(`Slide ${nearest + 1} de ${slideCount}: ${slideName}`);
      }
    };

    const supportsScrollEnd = 'onscrollend' in window;

    const handleScroll = () => {
      if (pendingTargetRef.current === null && rafRef.current === null) {
        rafRef.current = window.requestAnimationFrame(() => {
          rafRef.current = null;
          const nearest = getNearestSlideIndex();
          setActiveSlide(prev => (prev === nearest ? prev : nearest));
        });
      }

      if (!supportsScrollEnd) {
        if (debounceRef.current !== null) window.clearTimeout(debounceRef.current);
        debounceRef.current = window.setTimeout(handleSettled, 140);
      }
    };

    track.addEventListener('scroll', handleScroll, { passive: true });
    if (supportsScrollEnd) {
      track.addEventListener('scrollend', handleSettled);
    }

    return () => {
      track.removeEventListener('scroll', handleScroll);
      if (supportsScrollEnd) {
        track.removeEventListener('scrollend', handleSettled);
      }
      if (rafRef.current !== null) window.cancelAnimationFrame(rafRef.current);
      if (debounceRef.current !== null) window.clearTimeout(debounceRef.current);
    };
  }, [banners, slideCount, getNearestSlideIndex]);

  // 0 active dynamic campaigns -> preserve exact default institutional Hero
  if (slideCount === 0) {
    return (
      <DefaultInstitutionalHero
        featuredProducts={featuredProducts}
        onExploreCatalog={onExploreCatalog}
        onAddToQuote={onAddToQuote}
        onInspectProduct={onInspectProduct}
        cartSlugs={cartSlugs}
      />
    );
  }

  // 1 active dynamic campaign -> render clean standalone Hero without carousel chrome
  if (slideCount === 1) {
    return (
      <section aria-label={banners[0].name}>
        <DynamicBannerSlide
          banner={banners[0]}
          slideIndex={0}
          allProducts={allProducts}
          defaultFeatured={featuredProducts}
          cartSlugs={cartSlugs}
          onAddToQuote={onAddToQuote}
          onInspectProduct={onInspectProduct}
          onBannerAction={onBannerAction}
        />
      </section>
    );
  }

  // 2+ active dynamic campaigns -> native scroll-snap accessible carousel
  const activeBg = getHeroTheme(banners[activeSlide]?.themePreset).sectionBg;

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Campanhas em destaque Refrimaq"
      className="relative"
      style={{ backgroundColor: activeBg }}
    >
      {/* Previous / Next Controls placed before track in DOM order (modern-web-guidance: carousel) */}
      <div className="pointer-events-none hidden sm:flex absolute inset-y-0 inset-x-0 z-20 items-center justify-between px-4">
        <button
          type="button"
          onClick={() => {
            const base = pendingTargetRef.current ?? activeSlide;
            scrollToSlide(base - 1);
          }}
          aria-label="Campanha anterior"
          className="pointer-events-auto w-11 h-11 rounded-full bg-ink-950/75 hover:bg-ink-950 border border-white/25 text-white flex items-center justify-center shadow-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white touch-manipulation"
        >
          <ChevronLeft size={20} strokeWidth={1.75} />
        </button>

        <button
          type="button"
          onClick={() => {
            const base = pendingTargetRef.current ?? activeSlide;
            scrollToSlide(base + 1);
          }}
          aria-label="Próxima campanha"
          className="pointer-events-auto w-11 h-11 rounded-full bg-ink-950/75 hover:bg-ink-950 border border-white/25 text-white flex items-center justify-center shadow-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white touch-manipulation"
        >
          <ChevronRight size={20} strokeWidth={1.75} />
        </button>
      </div>

      {/* Scroll-Snap Native Track */}
      <div
        ref={trackRef}
        tabIndex={0}
        role="group"
        aria-label="Slides das campanhas"
        className="hero-carousel-track focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white/60"
      >
        {banners.map((banner, idx) => (
          <div
            key={banner.id}
            role="group"
            aria-roledescription="slide"
            aria-label={`${idx + 1} de ${slideCount}`}
            className="hero-carousel-slide"
          >
            <DynamicBannerSlide
              banner={banner}
              slideIndex={idx}
              allProducts={allProducts}
              defaultFeatured={featuredProducts}
              cartSlugs={cartSlugs}
              onAddToQuote={onAddToQuote}
              onInspectProduct={onInspectProduct}
              onBannerAction={onBannerAction}
            />
          </div>
        ))}
      </div>

      {/* Visually hidden polite status region (silent on initial load, updated after settle) */}
      <p className="sr-only" role="status" aria-live="polite">
        {statusAnnouncement}
      </p>

      {/* Accessible Floating Slide Markers (no bottom black bar; >= 28x28px hit targets) */}
      <nav
        aria-label="Escolher campanha"
        className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center justify-center gap-1 px-2.5 py-1 rounded-full bg-ink-950/65 backdrop-blur-md border border-white/15 shadow-lg"
      >
        <button
          type="button"
          onClick={() => {
            const base = pendingTargetRef.current ?? activeSlide;
            scrollToSlide(base - 1);
          }}
          aria-label="Slide anterior"
          className="sm:hidden w-8 h-8 rounded-full border border-white/20 text-white/85 flex items-center justify-center touch-manipulation focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          <ChevronLeft size={16} strokeWidth={1.75} />
        </button>
        {banners.map((banner, idx) => {
          const active = idx === activeSlide;
          return (
            <button
              key={`marker-${banner.id}`}
              type="button"
              onClick={() => scrollToSlide(idx)}
              aria-current={active ? 'true' : undefined}
              aria-label={`Ir para campanha ${idx + 1}: ${banner.name}`}
              className="min-w-[28px] min-h-[28px] px-1 flex items-center justify-center rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-white cursor-pointer touch-manipulation"
            >
              <span
                className={`block h-2 rounded-full transition-all duration-200 ${
                  active ? 'w-7 bg-white' : 'w-2 bg-white/40 hover:bg-white/65'
                }`}
              />
            </button>
          );
        })}
        <button
          type="button"
          onClick={() => {
            const base = pendingTargetRef.current ?? activeSlide;
            scrollToSlide(base + 1);
          }}
          aria-label="Próximo slide"
          className="sm:hidden w-8 h-8 rounded-full border border-white/20 text-white/85 flex items-center justify-center touch-manipulation focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          <ChevronRight size={16} strokeWidth={1.75} />
        </button>
      </nav>
    </section>
  );
}
