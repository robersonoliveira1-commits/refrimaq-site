import assert from 'node:assert/strict';
import {
  buildVisitTechnicalSummary,
  buildWhatsAppVisitUrl,
  createInitialVisitDraft,
  formatIsoDateBr,
  formatPhoneBr,
  generateVisitProtocol,
  getLocalTodayIso,
  isValidPhoneBr,
  normalizePhoneDigits,
  resolveVisitUrgency,
  validateStep2,
  validateStep3,
} from '../src/lib/serviceVisitEngine';

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

console.log('Running serviceVisitEngine unit tests...');

test('phone normalization, formatting and validation handle BR landline, mobile and +55 prefix', () => {
  assert.equal(normalizePhoneDigits('(51) 98574-7069'), '51985747069');
  assert.equal(normalizePhoneDigits('+55 51 98574-7069'), '51985747069');
  assert.equal(formatPhoneBr('51985747069'), '(51) 98574-7069');
  assert.equal(formatPhoneBr('5133445566'), '(51) 3344-5566');
  assert.equal(isValidPhoneBr('(51) 98574-7069'), true);
  assert.equal(isValidPhoneBr('(51) 3344-5566'), true);
  assert.equal(isValidPhoneBr('51999'), false);
});

test('local date formatting avoids UTC day-shift bugs', () => {
  assert.equal(formatIsoDateBr('2026-11-19'), '19/11/2026');
  assert.equal(getLocalTodayIso(new Date(2026, 10, 19, 23, 55, 0)), '2026-11-19');
  const proto = generateVisitProtocol(new Date(2026, 10, 19, 10, 0, 0));
  assert.match(proto, /^VIS-20261119-\d{4}$/);
});

test('step 2 validation enforces required fields for each of the 3 activities', () => {
  // 1. Corretivo
  const corr = createInitialVisitDraft('corretivo');
  assert.ok(validateStep2(corr));
  corr.corrective.equipment = 'Chopeira elétrica';
  assert.ok(validateStep2(corr));
  corr.corrective.symptoms = ['Não gela / temperatura alta'];
  assert.equal(validateStep2(corr), null);

  // 2. Sanitização
  const san = createInitialVisitDraft('sanitizacao');
  assert.ok(validateStep2(san));
  san.sanitization.placeType = 'Bar / Pub';
  san.sanitization.equipmentCount = '3';
  san.sanitization.tapsRange = '5 a 8 vias';
  san.sanitization.lastSanitization = 'Mais de 30 dias';
  san.sanitization.frequency = 'Plano de rota preventiva (recorrente)';
  assert.equal(validateStep2(san), null);

  // 3. Projeto e Instalação
  const proj = createInitialVisitDraft('projeto_instalacao');
  assert.ok(validateStep2(proj));
  proj.project.projectType = 'Instalação completa de balcão';
  proj.project.environmentType = 'Restaurante';
  proj.project.hasEquipment = 'Preciso cotar equipamentos + instalação';
  proj.project.pointsRange = '3 a 4 pontos';
  proj.project.timeline = 'Urgente (até 7 dias)';
  assert.equal(validateStep2(proj), null);
  assert.equal(resolveVisitUrgency(proj), 'alta');
});

test('step 3 validation requires valid name, phone and city', () => {
  const draft = createInitialVisitDraft('corretivo');
  assert.ok(validateStep3(draft.customer));
  draft.customer.name = 'João Silva';
  assert.ok(validateStep3(draft.customer));
  draft.customer.phone = '(51) 99111-2233';
  assert.ok(validateStep3(draft.customer));
  draft.customer.city = 'Porto Alegre - RS';
  assert.equal(validateStep3(draft.customer), null);
});

test('technical summary and WhatsApp URL include protocol, questionnaire answers and customer info', () => {
  const draft = createInitialVisitDraft('corretivo');
  draft.corrective.equipment = 'Chopeira elétrica';
  draft.corrective.symptoms = ['Não gela / temperatura alta', 'Excesso de espuma / torneira'];
  draft.corrective.urgency = 'alta';
  draft.corrective.brandModel = 'Memo Advantage 70L/h';
  draft.corrective.voltage = '220V';
  draft.customer = {
    name: 'Carlos Pereira',
    company: 'Bar do Centro',
    phone: '51988887777',
    city: 'Canoas - RS',
    address: 'Centro',
    preferredDate: '2026-11-20',
    preferredPeriod: 'manha',
  };

  const summary = buildVisitTechnicalSummary(draft, 'VIS-20261119-1234');
  assert.ok(summary.includes('VIS-20261119-1234'));
  assert.ok(summary.includes('Chamado corretivo'));
  assert.ok(summary.includes('Memo Advantage 70L/h'));
  assert.ok(summary.includes('20/11/2026'));
  assert.ok(summary.includes('(51) 98888-7777'));
  assert.ok(summary.includes('Canoas - RS'));

  const url = buildWhatsAppVisitUrl(draft, 'VIS-20261119-1234');
  assert.ok(url.startsWith('https://wa.me/5551985747069?text='));
  const decoded = decodeURIComponent(url.split('?text=')[1]);
  assert.ok(decoded.includes('VIS-20261119-1234'));
  assert.ok(decoded.includes('Bar do Centro'));
});

console.log(`\nAll ${passed} serviceVisitEngine tests passed!`);
