import { CategoryId, REFRIMAQ_WHATSAPP_PRIMARY } from './quoteEngine';
import { ServiceActivityType } from './serviceVisitEngine';
import { supabase } from './supabase';

export type BannerMode = 'editorial' | 'artwork';
export type BannerThemePreset = 'default' | 'black_friday' | 'natal' | 'promocao' | 'verao';
export type BannerActionType =
  | 'catalog'
  | 'category'
  | 'product'
  | 'service_visit'
  | 'whatsapp'
  | 'url';

export interface SiteBanner {
  id: string;
  name: string;
  mode: BannerMode;
  themePreset: BannerThemePreset;
  eyebrow: string;
  headline: string;
  subtitle: string;
  badgeText: string;
  announcementBar: string;
  ctaLabel: string;
  secondaryCtaLabel: string;
  actionType: BannerActionType;
  actionValue: string;
  desktopImageUrl: string;
  mobileImageUrl: string;
  imageAlt: string;
  featuredProductSlugs: string[];
  startsOn: string | null;
  endsOn: string | null;
  sortOrder: number;
  active: boolean;
}

export interface HeroThemeTokens {
  id: BannerThemePreset;
  label: string;
  sectionBg: string;
  radialGlow: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  primaryBtnBg: string;
  primaryBtnHover: string;
  primaryBtnText: string;
  announcementBg: string;
  announcementText: string;
}

export const HERO_THEMES: Record<BannerThemePreset, HeroThemeTokens> = {
  default: {
    id: 'default',
    label: 'Institucional Refrimaq',
    sectionBg: '#0D1014',
    radialGlow:
      'radial-gradient(65% 80% at 78% 48%, rgba(255,255,255,0.06) 0%, rgba(13,16,20,0) 70%)',
    badgeBg: 'rgba(11, 79, 156, 0.28)',
    badgeText: '#DBEAFE',
    badgeBorder: 'rgba(147, 197, 253, 0.35)',
    primaryBtnBg: '#0B4F9C',
    primaryBtnHover: '#094488',
    primaryBtnText: '#FFFFFF',
    announcementBg: '#0B4F9C',
    announcementText: '#FFFFFF',
  },
  black_friday: {
    id: 'black_friday',
    label: 'Black Friday',
    sectionBg: '#09090B',
    radialGlow:
      'radial-gradient(62% 78% at 78% 48%, rgba(217,119,6,0.18) 0%, rgba(9,9,11,0) 72%)',
    badgeBg: 'rgba(217, 119, 6, 0.22)',
    badgeText: '#FDE68A',
    badgeBorder: 'rgba(251, 191, 36, 0.45)',
    primaryBtnBg: '#D97706',
    primaryBtnHover: '#B45309',
    primaryBtnText: '#FFFFFF',
    announcementBg: '#B45309',
    announcementText: '#FFFFFF',
  },
  natal: {
    id: 'natal',
    label: 'Natal / Festas',
    sectionBg: '#121318',
    radialGlow:
      'radial-gradient(65% 80% at 78% 48%, rgba(185,28,28,0.22) 0%, rgba(18,19,24,0) 72%)',
    badgeBg: 'rgba(185, 28, 28, 0.28)',
    badgeText: '#FECACA',
    badgeBorder: 'rgba(248, 113, 113, 0.45)',
    primaryBtnBg: '#B91C1C',
    primaryBtnHover: '#991B1B',
    primaryBtnText: '#FFFFFF',
    announcementBg: '#991B1B',
    announcementText: '#FFFFFF',
  },
  promocao: {
    id: 'promocao',
    label: 'Promoção / Oferta',
    sectionBg: '#0A1628',
    radialGlow:
      'radial-gradient(65% 80% at 78% 48%, rgba(234,88,12,0.18) 0%, rgba(10,22,40,0) 72%)',
    badgeBg: 'rgba(234, 88, 12, 0.25)',
    badgeText: '#FED7AA',
    badgeBorder: 'rgba(251, 146, 60, 0.45)',
    primaryBtnBg: '#C2410C',
    primaryBtnHover: '#9A3412',
    primaryBtnText: '#FFFFFF',
    announcementBg: '#C2410C',
    announcementText: '#FFFFFF',
  },
  verao: {
    id: 'verao',
    label: 'Verão / Chopp Gelado',
    sectionBg: '#0B1520',
    radialGlow:
      'radial-gradient(65% 80% at 78% 48%, rgba(2,132,199,0.22) 0%, rgba(11,21,32,0) 72%)',
    badgeBg: 'rgba(2, 132, 199, 0.25)',
    badgeText: '#BAE6FD',
    badgeBorder: 'rgba(56, 189, 248, 0.45)',
    primaryBtnBg: '#0369A1',
    primaryBtnHover: '#075985',
    primaryBtnText: '#FFFFFF',
    announcementBg: '#0369A1',
    announcementText: '#FFFFFF',
  },
};

interface RawSiteBanner {
  id: string;
  name: string | null;
  mode: string | null;
  theme_preset: string | null;
  eyebrow: string | null;
  headline: string | null;
  subtitle: string | null;
  badge_text: string | null;
  announcement_bar: string | null;
  cta_label: string | null;
  secondary_cta_label: string | null;
  action_type: string | null;
  action_value: string | null;
  desktop_image_url: string | null;
  mobile_image_url: string | null;
  image_alt: string | null;
  featured_product_slugs: string[] | null;
  starts_on: string | null;
  ends_on: string | null;
  sort_order: number | null;
  active: boolean | null;
}

interface TemporalPlainDateLike {
  toString(): string;
}

interface TemporalGlobalLike {
  Now?: { plainDateISO?: () => TemporalPlainDateLike };
  PlainDate?: {
    from: (iso: string) => TemporalPlainDateLike;
    compare: (a: TemporalPlainDateLike, b: TemporalPlainDateLike) => number;
  };
}

function getNativeTemporal(): TemporalGlobalLike | null {
  const g = globalThis as unknown as { Temporal?: TemporalGlobalLike };
  const pd = g.Temporal?.PlainDate;
  if (pd && typeof pd.from === 'function' && typeof pd.compare === 'function') {
    return g.Temporal ?? null;
  }
  return null;
}

const ISO_DATE_RE = /^(\d{4})-(\d{2})-(\d{2})$/;

/**
 * Returns today's calendar date (YYYY-MM-DD) without UTC shift.
 * Uses native Temporal.Now.plainDateISO() when supported, falling back
 * to local calendar getters (never toISOString()).
 */
export function getTodayPlainIsoDate(reference?: Date): string {
  const temporal = getNativeTemporal();
  if (!reference && temporal?.Now && typeof temporal.Now.plainDateISO === 'function') {
    return temporal.Now.plainDateISO().toString();
  }
  const ref = reference ?? new Date();
  const y = ref.getFullYear();
  const m = String(ref.getMonth() + 1).padStart(2, '0');
  const d = String(ref.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * Compares two YYYY-MM-DD calendar dates without timezone drift.
 * Uses Temporal.PlainDate.compare when natively supported, with a pure
 * integer-tuple fallback for browsers without Temporal (e.g., Safari).
 */
export function comparePlainIsoDates(a: string, b: string): number {
  const temporal = getNativeTemporal();
  if (temporal?.PlainDate) {
    return temporal.PlainDate.compare(
      temporal.PlainDate.from(a),
      temporal.PlainDate.from(b)
    );
  }
  const ma = a.match(ISO_DATE_RE);
  const mb = b.match(ISO_DATE_RE);
  if (!ma || !mb) return a.localeCompare(b);
  const ka = Number(ma[1]) * 10000 + Number(ma[2]) * 100 + Number(ma[3]);
  const kb = Number(mb[1]) * 10000 + Number(mb[2]) * 100 + Number(mb[3]);
  return ka < kb ? -1 : ka > kb ? 1 : 0;
}

export function isBannerActiveOnDate(
  banner: Pick<SiteBanner, 'active' | 'startsOn' | 'endsOn' | 'mode' | 'desktopImageUrl' | 'headline'>,
  todayIso: string = getTodayPlainIsoDate()
): boolean {
  if (!banner.active) return false;
  if (banner.mode === 'artwork' && !banner.desktopImageUrl.trim()) return false;
  if (banner.mode === 'editorial' && !banner.headline.trim()) return false;

  if (banner.startsOn && ISO_DATE_RE.test(banner.startsOn)) {
    if (comparePlainIsoDates(todayIso, banner.startsOn) < 0) return false;
  }
  if (banner.endsOn && ISO_DATE_RE.test(banner.endsOn)) {
    if (comparePlainIsoDates(todayIso, banner.endsOn) > 0) return false;
  }
  return true;
}

export function getHeroTheme(preset: BannerThemePreset | string | null | undefined): HeroThemeTokens {
  if (preset && preset in HERO_THEMES) {
    return HERO_THEMES[preset as BannerThemePreset];
  }
  return HERO_THEMES.default;
}

const VALID_MODES = new Set<BannerMode>(['editorial', 'artwork']);
const VALID_THEMES = new Set<BannerThemePreset>([
  'default',
  'black_friday',
  'natal',
  'promocao',
  'verao',
]);
const VALID_ACTIONS = new Set<BannerActionType>([
  'catalog',
  'category',
  'product',
  'service_visit',
  'whatsapp',
  'url',
]);

export function mapRawSiteBanner(row: RawSiteBanner): SiteBanner {
  const mode: BannerMode = VALID_MODES.has(row.mode as BannerMode)
    ? (row.mode as BannerMode)
    : 'editorial';
  const themePreset: BannerThemePreset = VALID_THEMES.has(row.theme_preset as BannerThemePreset)
    ? (row.theme_preset as BannerThemePreset)
    : 'default';
  const actionType: BannerActionType = VALID_ACTIONS.has(row.action_type as BannerActionType)
    ? (row.action_type as BannerActionType)
    : 'catalog';

  return {
    id: row.id,
    name: (row.name ?? '').trim() || 'Campanha Refrimaq',
    mode,
    themePreset,
    eyebrow: (row.eyebrow ?? '').trim(),
    headline: (row.headline ?? '').trim(),
    subtitle: (row.subtitle ?? '').trim(),
    badgeText: (row.badge_text ?? '').trim(),
    announcementBar: (row.announcement_bar ?? '').trim(),
    ctaLabel: (row.cta_label ?? '').trim() || 'Explorar catálogo',
    secondaryCtaLabel: (row.secondary_cta_label ?? '').trim(),
    actionType,
    actionValue: (row.action_value ?? '').trim(),
    desktopImageUrl: (row.desktop_image_url ?? '').trim(),
    mobileImageUrl: (row.mobile_image_url ?? '').trim(),
    imageAlt: (row.image_alt ?? '').trim() || (row.headline ?? row.name ?? 'Campanha Refrimaq').trim(),
    featuredProductSlugs: Array.isArray(row.featured_product_slugs)
      ? row.featured_product_slugs.filter(Boolean)
      : [],
    startsOn: row.starts_on && ISO_DATE_RE.test(row.starts_on) ? row.starts_on : null,
    endsOn: row.ends_on && ISO_DATE_RE.test(row.ends_on) ? row.ends_on : null,
    sortOrder: typeof row.sort_order === 'number' ? row.sort_order : 0,
    active: Boolean(row.active),
  };
}

export function buildBannerWhatsAppUrl(
  banner: Pick<SiteBanner, 'name' | 'headline' | 'actionValue'>,
  phoneDigits: string = REFRIMAQ_WHATSAPP_PRIMARY
): string {
  const customMsg = banner.actionValue.trim();
  const msg =
    customMsg ||
    `Olá, Refrimaq. Vi a campanha "${banner.headline || banner.name}" no site e gostaria de mais informações.`;
  return `https://wa.me/${phoneDigits}?text=${encodeURIComponent(msg)}`;
}

export type ResolvedBannerAction =
  | { kind: 'catalog' }
  | { kind: 'category'; categoryId: CategoryId }
  | { kind: 'product'; slug: string }
  | { kind: 'service_visit'; activity?: ServiceActivityType }
  | { kind: 'whatsapp'; url: string }
  | { kind: 'url'; href: string; external: boolean };

const VALID_ACTIVITIES = new Set<ServiceActivityType>([
  'corretivo',
  'sanitizacao',
  'projeto_instalacao',
]);

export function resolveBannerAction(banner: SiteBanner): ResolvedBannerAction {
  const val = banner.actionValue.trim();
  if (banner.actionType === 'category' && val) {
    return { kind: 'category', categoryId: val as CategoryId };
  }
  if (banner.actionType === 'product' && val) {
    return { kind: 'product', slug: val };
  }
  if (banner.actionType === 'service_visit') {
    const act = VALID_ACTIVITIES.has(val as ServiceActivityType)
      ? (val as ServiceActivityType)
      : undefined;
    return { kind: 'service_visit', activity: act };
  }
  if (banner.actionType === 'whatsapp') {
    return { kind: 'whatsapp', url: buildBannerWhatsAppUrl(banner) };
  }
  if (banner.actionType === 'url' && val) {
    const isExternal = /^https?:\/\//i.test(val);
    return { kind: 'url', href: val, external: isExternal };
  }
  return { kind: 'catalog' };
}

/**
 * Fetches active, currently scheduled hero banners from Supabase `public.site_banners`.
 * Gracefully returns `[]` if Supabase is unconfigured, offline, or the table is not yet created,
 * preserving the default institutional Hero seamlessly.
 */
export async function fetchLiveSiteBanners(
  todayIso: string = getTodayPlainIsoDate()
): Promise<SiteBanner[]> {
  if (!supabase) return [];

  try {
    const { data, error } = await supabase
      .from('site_banners')
      .select(
        'id, name, mode, theme_preset, eyebrow, headline, subtitle, badge_text, announcement_bar, cta_label, secondary_cta_label, action_type, action_value, desktop_image_url, mobile_image_url, image_alt, featured_product_slugs, starts_on, ends_on, sort_order, active'
      )
      .eq('active', true)
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false })
      .limit(12);

    if (error || !data) return [];

    return (data as RawSiteBanner[])
      .map(mapRawSiteBanner)
      .filter(b => isBannerActiveOnDate(b, todayIso));
  } catch {
    return [];
  }
}
