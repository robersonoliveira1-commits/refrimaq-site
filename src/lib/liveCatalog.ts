import { CATALOG_PRODUCTS, CATEGORIES } from '../data/catalog';
import {
  CatalogProduct,
  CategoryId,
  extractTechSpecBadge,
  formatBrl,
  formatInstallment,
} from './quoteEngine';
import { supabase } from './supabase';

type ValidCategoryId = Exclude<CategoryId, 'all'>;

const VALID_CATEGORY_SET = new Set<string>(CATEGORIES.map(c => c.id));

interface RawSiteProduct {
  id: string;
  slug: string;
  item_code?: string | null;
  title: string;
  category_id: string | null;
  category_label: string | null;
  brand: string | null;
  price: number | string | null;
  specs: string | null;
  description: string | null;
  image_url: string | null;
  featured: boolean | null;
  active: boolean | null;
}

const ITEM_CODE_TAG_RE = /\s*\[C[oó]d:\s*([^\]]+)\]\s*/gi;

function extractFallbackItemCode(description: string | null | undefined): string {
  const match = (description ?? '').match(/\[C[oó]d:\s*([^\]]+)\]/i);
  return match ? match[1].replace(/\s+/g, ' ').trim() : '';
}

function stripFallbackItemCode(description: string | null | undefined): string {
  return (description ?? '').replace(ITEM_CODE_TAG_RE, ' ').replace(/\s+\n/g, '\n').trim();
}

const FALLBACK_BY_SLUG = new Map<string, CatalogProduct>(
  CATALOG_PRODUCTS.map(p => [p.slug, p])
);

function normalizeCategoryId(raw: string | null | undefined): ValidCategoryId {
  if (raw && VALID_CATEGORY_SET.has(raw)) {
    return raw as ValidCategoryId;
  }
  return 'acessorios';
}

function mapRowToCatalogProduct(row: RawSiteProduct): CatalogProduct {
  const categoryId = normalizeCategoryId(row.category_id);
  const categoryLabel =
    (row.category_label ?? '').trim() ||
    CATEGORIES.find(c => c.id === categoryId)?.label ||
    'Peças e Acessórios';

  const parsedPrice =
    row.price !== null && row.price !== undefined && Number(row.price) > 0
      ? Number(row.price)
      : null;

  const fallbackLocal = FALLBACK_BY_SLUG.get(row.slug);
  const image = (row.image_url ?? '').trim() || fallbackLocal?.image || '/media/logo-dark.svg';
  const title = (row.title ?? '').trim() || 'Equipamento Refrimaq';
  const rawDescription = row.description ?? '';
  const itemCode = (row.item_code ?? '').trim() || extractFallbackItemCode(rawDescription);
  const description =
    stripFallbackItemCode(rawDescription) ||
    fallbackLocal?.description ||
    `Equipamento da linha ${categoryLabel} fornecido pela Refrimaq com suporte técnico especializado.`;
  const specs = (row.specs ?? '').trim() || extractTechSpecBadge(title, description);

  return {
    id: row.id,
    slug: row.slug,
    ...(itemCode ? { itemCode } : {}),
    title,
    categoryId,
    categoryLabel,
    price: parsedPrice,
    priceLabel: parsedPrice !== null ? formatBrl(parsedPrice) : 'Valor sob consulta',
    installments:
      parsedPrice !== null ? formatInstallment(parsedPrice, 10) : 'Até 10x sem juros',
    description,
    specs,
    image,
    featured: Boolean(row.featured),
    brand: (row.brand ?? '').trim() || 'Memo',
  };
}

/**
 * Loads live published products from Supabase `site_products` (managed inside Refrimaq Connect).
 * Gracefully falls back to the local static catalog if Supabase is not configured,
 * offline, or if the table has not been populated yet.
 */
export async function fetchLiveSiteCatalog(): Promise<{
  products: CatalogProduct[];
  source: 'supabase' | 'static';
}> {
  if (!supabase) {
    return { products: CATALOG_PRODUCTS, source: 'static' };
  }

  try {
    const all: CatalogProduct[] = [];
    const PAGE_SIZE = 1000;
    let from = 0;
    let hasMore = true;

    while (hasMore) {
      const { data, error } = await supabase
        .from('site_products')
        .select('*')
        .eq('active', true)
        .order('sort_order', { ascending: true })
        .order('title', { ascending: true })
        .range(from, from + PAGE_SIZE - 1);

      if (error) {
        return { products: CATALOG_PRODUCTS, source: 'static' };
      }

      if (data && data.length > 0) {
        all.push(...(data as RawSiteProduct[]).map(mapRowToCatalogProduct));
        from += PAGE_SIZE;
        if (data.length < PAGE_SIZE) hasMore = false;
      } else {
        hasMore = false;
      }
    }

    if (all.length === 0) {
      return { products: CATALOG_PRODUCTS, source: 'static' };
    }

    return { products: all, source: 'supabase' };
  } catch {
    return { products: CATALOG_PRODUCTS, source: 'static' };
  }
}
