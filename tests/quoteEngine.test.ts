import assert from 'node:assert/strict';
import {
  parsePriceBrl,
  formatBrl,
  formatInstallment,
  extractTechSpecBadge,
  filterProducts,
  addOrUpdateQuoteItem,
  setQuoteItemQty,
  computeQuoteSummary,
  buildWhatsAppQuoteUrl,
  buildWhatsAppServiceUrl,
  CatalogProduct,
} from '../src/lib/quoteEngine';

let passed = 0;
function test(name: string, fn: () => void) {
  fn();
  passed++;
  console.log(`  PASS: ${name}`);
}

const SAMPLE_PRODUCTS: CatalogProduct[] = [
  {
    id: '1',
    slug: 'chopeira-hug-70',
    title: 'Chopeira Elétrica Memo Hug 70L/h 220V - 1 Torneira',
    categoryId: 'chopeiras-eletricas',
    categoryLabel: 'Chopeiras Elétricas',
    price: null,
    priceLabel: 'Valor sob consulta',
    installments: 'Até 10x sem juros',
    description: 'Alta vazão para bares e eventos.',
    specs: '70 L/h · 1 via',
    image: '/media/products/hug.png',
    featured: true,
    brand: 'Memo',
  },
  {
    id: '2',
    slug: 'carrinho-bond-chopp',
    title: 'Carrinho Bond Chopp',
    categoryId: 'acessorios',
    categoryLabel: 'Acessórios',
    price: 1455,
    priceLabel: 'R$ 1.455,00',
    installments: 'ou 10x de R$ 145,50 sem juros',
    description: 'Carrinho móvel para eventos e transporte de chopeira.',
    specs: 'Linha Memo',
    image: '/media/products/carrinho.png',
    featured: true,
    brand: 'Memo',
  },
  {
    id: '3',
    slug: 'barril-30l-slim',
    title: 'Barril de 30L Slim Aço Inox',
    categoryId: 'barris',
    categoryLabel: 'Barris Kegsbrasil',
    price: null,
    priceLabel: 'Valor sob consulta',
    installments: 'Até 10x sem juros',
    description: 'Barril de chopp em aço inox 304 Kegsbrasil.',
    specs: '30 L · Inox',
    image: '/media/products/barril.png',
    featured: false,
    brand: 'Kegsbrasil',
  },
];

console.log('Running quoteEngine unit tests...');

test('parsePriceBrl parses Brazilian currency and returns null for sob consulta', () => {
  assert.equal(parsePriceBrl('R$ 1.455,00'), 1455);
  assert.equal(parsePriceBrl('R$ 14.548,80'), 14548.8);
  assert.equal(parsePriceBrl('Valor sob consulta.'), null);
  assert.equal(parsePriceBrl(''), null);
  assert.ok(formatBrl(1455).includes('1.455,00'));
  assert.ok(formatInstallment(1455, 10).includes('145,50'));
});

test('extractTechSpecBadge builds concise engineering spec labels', () => {
  assert.equal(extractTechSpecBadge('Chopeira Elétrica Memo Hug 70L/h 220v - 2 Torneiras'), '70 L/h · 2 vias');
  assert.equal(extractTechSpecBadge('Caixa Térmica Fest Ice Memo - 360 Litros'), '360 L');
  assert.equal(extractTechSpecBadge('Barril de 30L Slim', 'Aço inox 304'), '30 L');
  assert.equal(extractTechSpecBadge('Kit Extração de CO2 com Regulador'), 'Extração CO2');
});

test('filterProducts handles accent-insensitive search, category filter, and sorting', () => {
  assert.equal(filterProducts(SAMPLE_PRODUCTS, { query: 'eletrica' }).length, 1);
  assert.equal(filterProducts(SAMPLE_PRODUCTS, { query: 'kegsbrasil' }).length, 1);
  assert.equal(filterProducts(SAMPLE_PRODUCTS, { categoryId: 'acessorios' }).length, 1);
  const byName = filterProducts(SAMPLE_PRODUCTS, { sortBy: 'name_asc' });
  assert.equal(byName[0].slug, 'barril-30l-slim');
});

test('quote cart add/update/summary and WhatsApp message encoding', () => {
  let cart = addOrUpdateQuoteItem([], SAMPLE_PRODUCTS[0], 1);
  cart = addOrUpdateQuoteItem(cart, SAMPLE_PRODUCTS[1], 2);
  cart = setQuoteItemQty(cart, 'chopeira-hug-70', 2);

  const summary = computeQuoteSummary(cart);
  assert.equal(summary.totalUnits, 4);
  assert.equal(summary.distinctItems, 2);
  assert.equal(summary.pricedSubtotal, 2910);
  assert.equal(summary.consultItemsCount, 2);

  const waUrl = buildWhatsAppQuoteUrl(cart, { name: 'Bar do Sul', city: 'Porto Alegre/RS' });
  assert.ok(waUrl.startsWith('https://wa.me/5551985747069?text='));
  const decoded = decodeURIComponent(waUrl.split('text=')[1]);
  assert.ok(decoded.includes('2x Chopeira Elétrica Memo Hug 70L/h'));
  assert.ok(decoded.includes('2x Carrinho Bond Chopp'));
  assert.ok(decoded.includes('Bar do Sul'));
  assert.ok(decoded.includes('Porto Alegre/RS'));

  const srvUrl = buildWhatsAppServiceUrl('Manutenção Preventiva (Assepsia)');
  assert.ok(decodeURIComponent(srvUrl).includes('Manutenção Preventiva'));

  cart = setQuoteItemQty(cart, 'carrinho-bond-chopp', 0);
  assert.equal(cart.length, 1);
});

console.log(`\nAll ${passed} quoteEngine tests passed!`);
