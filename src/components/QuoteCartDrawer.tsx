import { useEffect, useState } from 'react';
import { X, Plus, Minus, Trash2, MessageCircle, ShoppingBag } from 'lucide-react';
import {
  QuoteCartItem,
  computeQuoteSummary,
  formatBrl,
  buildWhatsAppQuoteUrl,
} from '../lib/quoteEngine';

interface QuoteCartDrawerProps {
  open: boolean;
  items: QuoteCartItem[];
  onClose: () => void;
  onUpdateQty: (slug: string, qty: number) => void;
  onClearCart: () => void;
}

export default function QuoteCartDrawer({
  open,
  items,
  onClose,
  onUpdateQty,
  onClearCart,
}: QuoteCartDrawerProps) {
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  const summary = computeQuoteSummary(items);
  const whatsappUrl = buildWhatsAppQuoteUrl(items, { name, city, notes });

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Lista de cotação"
      className="fixed inset-0 z-50 bg-ink-950/55 flex justify-end"
      onClick={onClose}
    >
      <div
        onClick={e => e.stopPropagation()}
        className="w-full max-w-md bg-white h-full flex flex-col shadow-[0_8px_32px_rgba(0,0,0,0.18)]"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-ink-200 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-medium text-ink-900">Lista de cotação</h2>
            <p className="text-xs text-ink-500 font-mono tabular-nums mt-0.5">
              {summary.totalUnits} unidade(s) · {summary.distinctItems} item(ns)
            </p>
          </div>
          <div className="flex items-center gap-1">
            {items.length > 0 && (
              <button
                type="button"
                onClick={onClearCart}
                className="text-xs text-ink-500 hover:text-red-600 px-2.5 py-1.5 rounded-lg hover:bg-ink-100 transition-colors"
              >
                Limpar
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              aria-label="Fechar lista de cotação"
              className="w-8 h-8 rounded-[8px] text-ink-500 hover:text-ink-900 hover:bg-ink-100 flex items-center justify-center transition-colors"
            >
              <X size={18} strokeWidth={1.5} />
            </button>
          </div>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
          {items.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <div className="w-12 h-12 rounded-[12px] bg-ink-100 flex items-center justify-center mx-auto">
                <ShoppingBag size={22} strokeWidth={1.5} className="text-ink-400" />
              </div>
              <p className="text-sm font-medium text-ink-900">Sua lista de cotação está vazia</p>
              <p className="text-xs text-ink-500 max-w-xs mx-auto leading-relaxed">
                Adicione chopeiras, torres ou peças do catálogo para enviar o pedido
                estruturado direto para nossa equipe no WhatsApp.
              </p>
            </div>
          ) : (
            items.map(({ product, quantity }) => (
              <div
                key={product.slug}
                className="border border-ink-200 rounded-[12px] p-3 flex items-start gap-3 bg-white"
              >
                <div className="w-16 h-16 rounded-[8px] bg-ink-50 border border-ink-100 p-1.5 shrink-0 flex items-center justify-center">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap font-mono text-[11px] text-ink-500">
                    {product.itemCode && (
                      <span className="text-brand-700 bg-brand-50 px-1.5 py-0.5 rounded">
                        Cód. {product.itemCode}
                      </span>
                    )}
                    <span>{product.specs}</span>
                  </div>
                  <p className="text-sm font-medium text-ink-900 leading-snug line-clamp-2 mt-0.5">
                    {product.title}
                  </p>
                  <p className="text-xs font-medium text-ink-600 tabular-nums mt-1">
                    {product.price !== null
                      ? formatBrl(product.price * quantity)
                      : 'Valor sob consulta'}
                  </p>

                  <div className="mt-2.5 flex items-center justify-between">
                    <div className="inline-flex items-center border border-ink-200 rounded-[6px]">
                      <button
                        type="button"
                        onClick={() => onUpdateQty(product.slug, quantity - 1)}
                        aria-label={`Diminuir quantidade de ${product.title}`}
                        className="w-7 h-7 flex items-center justify-center text-ink-600 hover:bg-ink-100"
                      >
                        <Minus size={12} strokeWidth={1.5} />
                      </button>
                      <span className="w-8 text-center font-mono text-xs tabular-nums">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => onUpdateQty(product.slug, quantity + 1)}
                        aria-label={`Aumentar quantidade de ${product.title}`}
                        className="w-7 h-7 flex items-center justify-center text-ink-600 hover:bg-ink-100"
                      >
                        <Plus size={12} strokeWidth={1.5} />
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => onUpdateQty(product.slug, 0)}
                      aria-label={`Remover ${product.title}`}
                      className="p-1.5 text-ink-400 hover:text-red-600 rounded-lg transition-colors"
                    >
                      <Trash2 size={14} strokeWidth={1.5} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Form & WhatsApp Dispatch */}
        {items.length > 0 && (
          <div className="border-t border-ink-200 bg-ink-50 px-6 py-4 space-y-3">
            <div className="space-y-1 text-xs">
              {summary.pricedSubtotal > 0 && (
                <div className="flex items-center justify-between text-ink-900">
                  <span>Subtotal dos itens com preço</span>
                  <span className="font-mono text-sm font-medium tabular-nums">
                    {formatBrl(summary.pricedSubtotal)}
                  </span>
                </div>
              )}
              {summary.consultItemsCount > 0 && (
                <div className="flex items-center justify-between text-ink-500">
                  <span>Itens sob consulta</span>
                  <span className="font-mono tabular-nums">
                    {summary.consultItemsCount} un.
                  </span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Seu nome ou empresa"
                className="h-9 px-3 rounded-[8px] border border-ink-200 bg-white text-xs text-ink-900 placeholder:text-ink-400 focus:border-brand-500 focus:outline-none"
              />
              <input
                type="text"
                value={city}
                onChange={e => setCity(e.target.value)}
                placeholder="Cidade / UF"
                className="h-9 px-3 rounded-[8px] border border-ink-200 bg-white text-xs text-ink-900 placeholder:text-ink-400 focus:border-brand-500 focus:outline-none"
              />
            </div>

            <input
              type="text"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Voltagem preferida ou observações (opcional)"
              className="w-full h-9 px-3 rounded-[8px] border border-ink-200 bg-white text-xs text-ink-900 placeholder:text-ink-400 focus:border-brand-500 focus:outline-none"
            />

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="w-full h-11 px-4 rounded-[10px] bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium inline-flex items-center justify-center gap-2 transition-colors"
            >
              <MessageCircle size={17} strokeWidth={1.5} />
              Enviar cotação no WhatsApp
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
