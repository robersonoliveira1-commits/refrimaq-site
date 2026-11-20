import assert from 'node:assert/strict';
import {
  SiteBanner,
  buildBannerWhatsAppUrl,
  comparePlainIsoDates,
  getHeroTheme,
  isBannerActiveOnDate,
  mapRawSiteBanner,
  resolveBannerAction,
} from '../src/lib/liveBanners';

let passed = 0;

function test(name: string, fn: () => void) {
  try {
    fn();
    passed++;
    console.log(`  PASS: ${name}`);
  } catch (err) {
    console.error(`  FAIL: ${name}`);
    throw err;
  }
}

function makeBanner(overrides: Partial<SiteBanner> = {}): SiteBanner {
  return {
    id: 'b1',
    name: 'Black Friday Refrimaq',
    mode: 'editorial',
    themePreset: 'black_friday',
    eyebrow: 'Campanha especial',
    headline: 'Black Friday em chopeiras Memo',
    subtitle: 'Condições exclusivas em até 10x sem juros.',
    badgeText: 'BLACK FRIDAY · ATÉ 30/11',
    announcementBar: 'Black Friday Refrimaq até 30/11',
    ctaLabel: 'Ver ofertas',
    secondaryCtaLabel: 'Falar no WhatsApp',
    actionType: 'category',
    actionValue: 'chopeiras-eletricas',
    desktopImageUrl: '',
    mobileImageUrl: '',
    imageAlt: 'Black Friday Refrimaq',
    featuredProductSlugs: [],
    startsOn: '2026-11-20',
    endsOn: '2026-11-30',
    sortOrder: 1,
    active: true,
    ...overrides,
  };
}

console.log('Running liveBanners unit tests...');

test('location-agnostic calendar date comparison handles boundaries without UTC shift', () => {
  assert.equal(comparePlainIsoDates('2026-11-19', '2026-11-20'), -1);
  assert.equal(comparePlainIsoDates('2026-11-20', '2026-11-20'), 0);
  assert.equal(comparePlainIsoDates('2026-12-01', '2026-11-30'), 1);

  const bf = makeBanner({ startsOn: '2026-11-20', endsOn: '2026-11-30' });
  assert.equal(isBannerActiveOnDate(bf, '2026-11-19'), false);
  assert.equal(isBannerActiveOnDate(bf, '2026-11-20'), true);
  assert.equal(isBannerActiveOnDate(bf, '2026-11-30'), true);
  assert.equal(isBannerActiveOnDate(bf, '2026-12-01'), false);
});

test('inactive or incomplete artwork/editorial banners are filtered out safely', () => {
  assert.equal(isBannerActiveOnDate(makeBanner({ active: false }), '2026-11-25'), false);
  assert.equal(
    isBannerActiveOnDate(makeBanner({ mode: 'artwork', desktopImageUrl: '' }), '2026-11-25'),
    false
  );
  assert.equal(
    isBannerActiveOnDate(
      makeBanner({ mode: 'artwork', desktopImageUrl: 'https://cdn.example/bf.jpg' }),
      '2026-11-25'
    ),
    true
  );
  assert.equal(
    isBannerActiveOnDate(makeBanner({ mode: 'editorial', headline: '' }), '2026-11-25'),
    false
  );
});

test('mapRawSiteBanner normalizes invalid enums and resolves theme presets', () => {
  const mapped = mapRawSiteBanner({
    id: 'raw-1',
    name: 'Natal',
    mode: 'unknown_mode',
    theme_preset: 'natal',
    eyebrow: null,
    headline: 'Natal Refrimaq',
    subtitle: 'Chopp gelado para as festas',
    badge_text: 'NATAL 2026',
    announcement_bar: null,
    cta_label: null,
    secondary_cta_label: null,
    action_type: 'service_visit',
    action_value: 'sanitizacao',
    desktop_image_url: null,
    mobile_image_url: null,
    image_alt: null,
    featured_product_slugs: ['chopeira-eletrica-small-50-litros-hora-2-torneiras-mundi'],
    starts_on: '2026-12-01',
    ends_on: '2026-12-26',
    sort_order: 2,
    active: true,
  });

  assert.equal(mapped.mode, 'editorial');
  assert.equal(mapped.themePreset, 'natal');
  assert.equal(mapped.ctaLabel, 'Explorar catálogo');
  assert.equal(getHeroTheme(mapped.themePreset).primaryBtnBg, '#B91C1C');
  assert.deepEqual(resolveBannerAction(mapped), {
    kind: 'service_visit',
    activity: 'sanitizacao',
  });
});

test('action resolver handles category, product, whatsapp and external URLs cleanly', () => {
  assert.deepEqual(resolveBannerAction(makeBanner()), {
    kind: 'category',
    categoryId: 'chopeiras-eletricas',
  });

  assert.deepEqual(
    resolveBannerAction(makeBanner({ actionType: 'product', actionValue: 'gela-canecas-memo' })),
    { kind: 'product', slug: 'gela-canecas-memo' }
  );

  const waBanner = makeBanner({
    actionType: 'whatsapp',
    actionValue: 'Quero desconto da Black Friday!',
  });
  const waResolved = resolveBannerAction(waBanner);
  assert.equal(waResolved.kind, 'whatsapp');
  assert.ok(buildBannerWhatsAppUrl(waBanner).includes('Black%20Friday'));

  assert.deepEqual(
    resolveBannerAction(makeBanner({ actionType: 'url', actionValue: 'https://instagram.com/refrimaqrs' })),
    { kind: 'url', href: 'https://instagram.com/refrimaqrs', external: true }
  );
});

console.log(`\nAll ${passed} liveBanners tests passed!`);
