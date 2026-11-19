export type CategoryId =
  | 'all'
  | 'chopeiras-eletricas'
  | 'chopeiras-gelo'
  | 'torres'
  | 'pre-resfriadores'
  | 'barris'
  | 'gela-canecas'
  | 'acessorios';

export type CatalogSort = 'featured' | 'name_asc' | 'price_asc' | 'price_desc';

export interface CatalogProduct {
  id: string;
  slug: string;
  title: string;
  categoryId: Exclude<CategoryId, 'all'>;
  categoryLabel: string;
  price: number | null;
  priceLabel: string;
  installments: string;
  description: string;
  specs: string;
  image: string;
  featured?: boolean;
  brand?: string;
}

export interface QuoteCartItem {
  product: CatalogProduct;
  quantity: number;
}

export interface QuoteCustomerInfo {
  name?: string;
  city?: string;
  notes?: string;
}

export interface QuoteSummary {
  totalUnits: number;
  distinctItems: number;
  pricedSubtotal: number;
  consultItemsCount: number;
}

export const REFRIMAQ_WHATSAPP_PRIMARY = '5551985747069';
export const REFRIMAQ_WHATSAPP_SECONDARY = '5551991604815';
export const REFRIMAQ_EMAIL = 'cotacoes@refrimaqrs.com.br';
export const REFRIMAQ_CNPJ = '32.155.823/0001-82';

const BRL_FORMATTER = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

export function normalizeText(value: string | null | undefined): string {
  return (value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

export function parsePriceBrl(raw: string | null | undefined): number | null {
  if (!raw) return null;
  const match = raw.match(/R\$\s*([\d.]+,\d{2})/i);
  if (!match) return null;
  const normalized = match[1].replace(/\./g, '').replace(',', '.');
  const num = Number(normalized);
  return Number.isFinite(num) && num > 0 ? num : null;
}

export function formatBrl(value: number): string {
  return BRL_FORMATTER.format(value);
}

export function formatInstallment(value: number, installments = 10): string {
  if (!Number.isFinite(value) || value <= 0) return 'Até 10x sem juros';
  return `ou ${installments}x de ${formatBrl(value / installments)} sem juros`;
}

/**
 * Extracts a concise technical engineering tag from product title/description
 * (Unslop signature detail: monospace spec pill like "70 L/h · 220V" or "30 L · Inox").
 */
export function extractTechSpecBadge(title: string, description = ''): string {
  const source = `${title} ${description}`;
  const parts: string[] = [];

  const flowMatch = source.match(/(\d+)\s*(?:l\/h|litros\/hora|litros\s*\/\s*hora)/i);
  if (flowMatch) {
    parts.push(`${flowMatch[1]} L/h`);
  } else {
    const volMatch = source.match(/(\d+)\s*(?:litros|l\b)/i);
    if (volMatch) parts.push(`${volMatch[1]} L`);
  }

  const tapsMatch = source.match(/(\d+)\s*(?:torneiras?|vias?)/i);
  if (tapsMatch) {
    const count = Number(tapsMatch[1]);
    parts.push(count === 1 ? '1 via' : `${count} vias`);
  }

  const voltMatch = source.match(/(127\s*v|220\s*v|110\s*v|bivolt)/i);
  if (voltMatch) {
    parts.push(voltMatch[1].replace(/\s+/g, '').toUpperCase());
  }

  const kgMatch = source.match(/(\d+(?:[,.]\d+)?)\s*kg\b/i);
  if (kgMatch && parts.length < 2) {
    parts.push(`${kgMatch[1].replace(',', '.')} kg`);
  }

  if (parts.length === 0) {
    if (/inox/i.test(source)) parts.push('Inox 304');
    else if (/naja|torre/i.test(source)) parts.push('Torre Memo');
    else if (/sanitiza|assepsia|detergente/i.test(source)) parts.push('Assepsia');
    else if (/co2|cilindro|regulador|extrator/i.test(source)) parts.push('Extração CO2');
    else if (/barril/i.test(source)) parts.push('Inox Kegsbrasil');
    else parts.push('Linha Memo');
  }

  return parts.slice(0, 2).join(' · ');
}

export function filterProducts(
  products: CatalogProduct[],
  options: {
    query?: string;
    categoryId?: CategoryId;
    sortBy?: CatalogSort;
  }
): CatalogProduct[] {
  const q = normalizeText(options.query);
  const categoryId = options.categoryId ?? 'all';
  const sortBy = options.sortBy ?? 'featured';

  const filtered = products.filter(p => {
    if (categoryId !== 'all' && p.categoryId !== categoryId) return false;
    if (!q) return true;
    const hay = normalizeText(`${p.title} ${p.categoryLabel} ${p.description} ${p.specs} ${p.brand ?? ''}`);
    return hay.includes(q);
  });

  const sorted = [...filtered];
  sorted.sort((a, b) => {
    if (sortBy === 'name_asc') {
      return a.title.localeCompare(b.title, 'pt-BR');
    }
    if (sortBy === 'price_asc') {
      const pa = a.price ?? Number.POSITIVE_INFINITY;
      const pb = b.price ?? Number.POSITIVE_INFINITY;
      if (pa !== pb) return pa - pb;
      return a.title.localeCompare(b.title, 'pt-BR');
    }
    if (sortBy === 'price_desc') {
      const pa = a.price ?? -1;
      const pb = b.price ?? -1;
      if (pb !== pa) return pb - pa;
      return a.title.localeCompare(b.title, 'pt-BR');
    }
    // featured first, then equipment category priority, then priced items, then alphabetical
    const fa = a.featured ? 1 : 0;
    const fb = b.featured ? 1 : 0;
    if (fb !== fa) return fb - fa;
    const catRank: Record<Exclude<CategoryId, 'all'>, number> = {
      'chopeiras-eletricas': 1,
      torres: 2,
      'chopeiras-gelo': 3,
      'pre-resfriadores': 4,
      'gela-canecas': 5,
      barris: 6,
      acessorios: 7,
    };
    const ra = catRank[a.categoryId] ?? 9;
    const rb = catRank[b.categoryId] ?? 9;
    if (ra !== rb) return ra - rb;
    const pa = a.price !== null ? 1 : 0;
    const pb = b.price !== null ? 1 : 0;
    if (pb !== pa) return pb - pa;
    return a.title.localeCompare(b.title, 'pt-BR');
  });

  return sorted;
}

export function addOrUpdateQuoteItem(
  cart: QuoteCartItem[],
  product: CatalogProduct,
  delta = 1
): QuoteCartItem[] {
  const existing = cart.find(item => item.product.slug === product.slug);
  if (!existing) {
    if (delta <= 0) return cart;
    return [...cart, { product, quantity: delta }];
  }
  const nextQty = existing.quantity + delta;
  if (nextQty <= 0) {
    return cart.filter(item => item.product.slug !== product.slug);
  }
  return cart.map(item =>
    item.product.slug === product.slug ? { ...item, quantity: nextQty } : item
  );
}

export function setQuoteItemQty(
  cart: QuoteCartItem[],
  slug: string,
  quantity: number
): QuoteCartItem[] {
  if (quantity <= 0) {
    return cart.filter(item => item.product.slug !== slug);
  }
  return cart.map(item =>
    item.product.slug === slug ? { ...item, quantity: Math.floor(quantity) } : item
  );
}

export function computeQuoteSummary(cart: QuoteCartItem[]): QuoteSummary {
  let totalUnits = 0;
  let pricedSubtotal = 0;
  let consultItemsCount = 0;

  for (const item of cart) {
    totalUnits += item.quantity;
    if (item.product.price !== null) {
      pricedSubtotal += item.product.price * item.quantity;
    } else {
      consultItemsCount += item.quantity;
    }
  }

  return {
    totalUnits,
    distinctItems: cart.length,
    pricedSubtotal,
    consultItemsCount,
  };
}

export function buildWhatsAppQuoteUrl(
  cart: QuoteCartItem[],
  customer: QuoteCustomerInfo = {},
  phoneDigits: string = REFRIMAQ_WHATSAPP_PRIMARY
): string {
  const lines: string[] = [
    'Olá, Refrimaq. Gostaria de solicitar uma cotação pelo site:',
    '',
  ];

  if (cart.length === 0) {
    lines.push('Gostaria de atendimento comercial para equipamentos de chopp e refrigeração.');
  } else {
    cart.forEach((item, idx) => {
      const unitInfo =
        item.product.price !== null
          ? `${formatBrl(item.product.price)}/un`
          : 'Sob consulta';
      lines.push(
        `${idx + 1}. ${item.quantity}x ${item.product.title} (${item.product.specs}) — ${unitInfo}`
      );
    });

    const summary = computeQuoteSummary(cart);
    lines.push('');
    if (summary.pricedSubtotal > 0) {
      lines.push(`Subtotal dos itens com preço: ${formatBrl(summary.pricedSubtotal)}`);
    }
    if (summary.consultItemsCount > 0) {
      lines.push(`Itens sob consulta: ${summary.consultItemsCount} unidade(s)`);
    }
  }

  const name = (customer.name ?? '').trim();
  const city = (customer.city ?? '').trim();
  const notes = (customer.notes ?? '').trim();

  if (name || city || notes) {
    lines.push('');
    if (name) lines.push(`Nome/Empresa: ${name}`);
    if (city) lines.push(`Cidade/UF: ${city}`);
    if (notes) lines.push(`Observações: ${notes}`);
  }

  return `https://wa.me/${phoneDigits}?text=${encodeURIComponent(lines.join('\n'))}`;
}

export function buildWhatsAppServiceUrl(
  serviceName: string,
  phoneDigits: string = REFRIMAQ_WHATSAPP_PRIMARY
): string {
  const msg = `Olá, Refrimaq. Gostaria de solicitar atendimento para o serviço: ${serviceName}.`;
  return `https://wa.me/${phoneDigits}?text=${encodeURIComponent(msg)}`;
}
