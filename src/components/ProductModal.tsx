import { useEffect, useState } from 'react';
import { X, Plus, Minus, MessageCircle, Check, ShieldCheck, Truck } from 'lucide-react';
import {
  CatalogProduct,
  buildWhatsAppQuoteUrl,
} from '../lib/quoteEngine';

interface ProductModalProps {
  product: CatalogProduct | null;
  onClose: () => void;
  onAddToQuote: (product: CatalogProduct, qty: number) => void;
}

export default function ProductModal({
  product,
  onClose,
  onAddToQuote,
}: ProductModalProps) {
  const [qty, setQty] = useState(1);
  const [addedFeedback, setAddedFeedback] = useState(false);

  useEffect(() => {
    setQty(1);
    setAddedFeedback(false);
  }, [product?.slug]);

  useEffect(() => {
    if (!product) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [product, onClose]);

  if (!product) return null;

  const directWhatsAppUrl = buildWhatsAppQuoteUrl([{ product, quantity: qty }]);

  function handleAdd() {
    if (!product) return;
    onAddToQuote(product, qty);
    setAddedFeedback(true);
    setTimeout(() => setAddedFeedback(false), 1800);
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="product-modal-title"
      className="fixed inset-0 z-50 bg-ink-950/60 flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={onClose}
    >
      <div
        onClick={e => e.stopPropagation()}
        className="bg-white w-full sm:max-w-3xl max-h-[92vh] rounded-t-[16px] sm:rounded-[16px] overflow-hidden shadow-[0_16px_48px_rgba(0,0,0,0.2)] flex flex-col animate-enter"
      >
        <div className="px-6 py-4 border-b border-ink-200 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-ink-500 min-w-0">
            <span className="truncate">{product.categoryLabel}</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono text-ink-700 bg-ink-100 px-2 py-0.5 rounded-[4px] shrink-0">
              {product.specs}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar detalhes do produto"
            className="w-8 h-8 rounded-[8px] text-ink-500 hover:text-ink-900 hover:bg-ink-100 flex items-center justify-center transition-colors shrink-0"
          >
            <X size={18} strokeWidth={1.5} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            {/* Image */}
            <div className="bg-ink-50 border border-ink-200 rounded-[12px] aspect-square p-6 flex items-center justify-center">
              <img
                src={product.image}
                alt={product.title}
                className="max-h-full max-w-full object-contain"
              />
            </div>

            {/* Details */}
            <div className="space-y-4">
              {product.brand && (
                <p className="font-mono text-xs text-ink-500">Linha {product.brand}</p>
              )}
              <h2
                id="product-modal-title"
                className="text-xl sm:text-2xl font-medium text-ink-900 leading-snug"
              >
                {product.title}
              </h2>

              <div className="py-3 border-y border-ink-200">
                <p
                  className={`text-2xl font-medium tabular-nums ${
                    product.price !== null ? 'text-ink-900' : 'text-brand-600'
                  }`}
                >
                  {product.priceLabel}
                </p>
                <p className="text-xs text-ink-500 mt-1 tabular-nums">{product.installments}</p>
              </div>

              <p className="text-sm text-ink-600 leading-relaxed">{product.description}</p>

              {/* Quantity selector */}
              <div className="flex items-center gap-3 pt-1">
                <span className="text-xs font-medium text-ink-600">Quantidade</span>
                <div className="inline-flex items-center border border-ink-200 rounded-[8px] bg-white">
                  <button
                    type="button"
                    onClick={() => setQty(q => Math.max(1, q - 1))}
                    aria-label="Diminuir quantidade"
                    className="w-9 h-9 flex items-center justify-center text-ink-600 hover:bg-ink-100 rounded-l-[8px] transition-colors"
                  >
                    <Minus size={14} strokeWidth={1.5} />
                  </button>
                  <span className="w-10 text-center font-mono text-sm tabular-nums text-ink-900">
                    {qty}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQty(q => q + 1)}
                    aria-label="Aumentar quantidade"
                    className="w-9 h-9 flex items-center justify-center text-ink-600 hover:bg-ink-100 rounded-r-[8px] transition-colors"
                  >
                    <Plus size={14} strokeWidth={1.5} />
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-2.5 pt-2">
                <button
                  type="button"
                  onClick={handleAdd}
                  className="w-full h-11 px-4 rounded-[10px] bg-brand-500 hover:bg-brand-600 active:scale-[0.98] text-white text-sm font-medium inline-flex items-center justify-center gap-2 transition-[background-color,transform]"
                >
                  {addedFeedback ? <Check size={16} strokeWidth={1.75} /> : <Plus size={16} strokeWidth={1.75} />}
                  {addedFeedback ? 'Adicionado à cotação' : 'Adicionar à lista de cotação'}
                </button>

                <a
                  href={directWhatsAppUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full h-11 px-4 rounded-[10px] border border-ink-200 bg-ink-50 hover:bg-ink-100 text-ink-900 text-sm font-medium inline-flex items-center justify-center gap-2 transition-colors"
                >
                  <MessageCircle size={16} strokeWidth={1.5} />
                  Cotar este item direto no WhatsApp
                </a>
              </div>

              <div className="pt-3 border-t border-ink-100 space-y-2 text-xs text-ink-500">
                <div className="flex items-center gap-2">
                  <Truck size={15} strokeWidth={1.5} className="text-ink-400 shrink-0" />
                  <span>Entrega para todo o Brasil com suporte técnico Refrimaq</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck size={15} strokeWidth={1.5} className="text-ink-400 shrink-0" />
                  <span>Equipamento original com garantia e peças de reposição</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
