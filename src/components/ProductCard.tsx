import { Plus, Check } from 'lucide-react';
import { CatalogProduct } from '../lib/quoteEngine';

interface ProductCardProps {
  product: CatalogProduct;
  inCart: boolean;
  onAddToQuote: (product: CatalogProduct) => void;
  onInspect: (product: CatalogProduct) => void;
}

export default function ProductCard({
  product,
  inCart,
  onAddToQuote,
  onInspect,
}: ProductCardProps) {
  return (
    <article className="bg-white border border-ink-200 rounded-[12px] p-4 flex flex-col justify-between transition-[border-color,box-shadow] duration-150 ease-smooth hover:border-ink-400/60 hover:shadow-[0_4px_16px_rgba(0,0,0,0.05)]">
      <div>
        {/* Image Frame (nested radius 12 - 4 = 8) */}
        <button
          type="button"
          onClick={() => onInspect(product)}
          className="relative w-full aspect-[4/3] bg-white rounded-[8px] flex items-center justify-center p-4 overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
        >
          <span className="absolute top-1.5 left-1.5 font-mono text-[11px] text-ink-600 bg-ink-100 px-2 py-0.5 rounded-[4px] tabular-nums">
            {product.specs}
          </span>
          <img
            src={product.image}
            alt={product.title}
            decoding="async"
            className="max-h-full max-w-full object-contain transition-transform duration-200 ease-smooth hover:scale-[1.03]"
          />
        </button>

        {/* Product Title & Price */}
        <div className="mt-3 space-y-1.5">
          <p className="text-xs text-ink-500">{product.categoryLabel}</p>
          <button
            type="button"
            onClick={() => onInspect(product)}
            className="text-left block w-full text-sm font-medium text-ink-900 hover:text-brand-600 leading-[1.35] line-clamp-2 min-h-[38px] transition-colors"
          >
            {product.title}
          </button>

          <div className="pt-1">
            <p
              className={`text-base font-medium tabular-nums ${
                product.price !== null ? 'text-ink-900' : 'text-brand-600'
              }`}
            >
              {product.priceLabel}
            </p>
            <p className="text-xs text-ink-500 tabular-nums mt-0.5">{product.installments}</p>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="mt-4 pt-3 border-t border-ink-100 flex items-center gap-2">
        <button
          type="button"
          onClick={() => onAddToQuote(product)}
          className={`flex-1 h-9 px-3 rounded-[8px] text-xs font-medium inline-flex items-center justify-center gap-1.5 transition-colors active:scale-[0.98] ${
            inCart
              ? 'bg-brand-50 text-brand-700 border border-brand-500/30'
              : 'bg-ink-900 hover:bg-brand-500 text-white'
          }`}
        >
          {inCart ? <Check size={14} strokeWidth={1.75} /> : <Plus size={14} strokeWidth={1.75} />}
          {inCart ? 'Na cotação' : 'Adicionar à cotação'}
        </button>
      </div>
    </article>
  );
}
