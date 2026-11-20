import { ArrowUpRight } from 'lucide-react';
import { CategoryId } from '../lib/quoteEngine';
import { CATEGORIES } from '../data/catalog';

interface CategoryBannerGridProps {
  countsByCategory: Record<string, number>;
  onSelectCategory: (cat: CategoryId) => void;
}

const FEATURED_CATEGORY_IDS: Array<Exclude<CategoryId, 'all'>> = [
  'chopeiras-eletricas',
  'chopeiras-gelo',
  'torres',
  'pre-resfriadores',
];

export default function CategoryBannerGrid({
  countsByCategory,
  onSelectCategory,
}: CategoryBannerGridProps) {
  const cards = FEATURED_CATEGORY_IDS.map(id => CATEGORIES.find(c => c.id === id)).filter(
    (c): c is (typeof CATEGORIES)[number] => Boolean(c)
  );

  return (
    <section aria-label="Navegar por linha" className="py-8">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {cards.map(cat => {
            const count = countsByCategory[cat.id] ?? 0;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => onSelectCategory(cat.id)}
                className="group relative bg-ink-900 hover:bg-ink-800 border border-white/10 rounded-[14px] p-5 text-left overflow-hidden flex flex-col justify-between min-h-[296px] transition-colors duration-200 ease-smooth"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-xs text-ink-400 tabular-nums">
                    {count} modelos
                  </span>
                  <span className="w-8 h-8 rounded-[8px] bg-white/5 group-hover:bg-brand-500 text-ink-200 group-hover:text-white flex items-center justify-center transition-colors">
                    <ArrowUpRight size={16} strokeWidth={1.5} />
                  </span>
                </div>

                {/* Real product object on calm studio pedestal */}
                <div className="my-4 bg-white rounded-[10px] h-40 p-4 flex items-center justify-center overflow-hidden">
                  <img
                    src={cat.coverImage}
                    alt={cat.label}
                    loading="lazy"
                    className="max-h-full max-w-full object-contain transition-transform duration-300 ease-smooth group-hover:scale-[1.04]"
                  />
                </div>

                <div>
                  <h3 className="text-base font-medium text-white">{cat.label}</h3>
                  <p className="text-xs text-ink-400 mt-1 leading-relaxed line-clamp-2">
                    {cat.tagline}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
