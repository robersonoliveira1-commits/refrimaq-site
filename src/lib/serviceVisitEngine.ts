import { REFRIMAQ_WHATSAPP_PRIMARY } from './quoteEngine';
import { supabase } from './supabase';

export type ServiceActivityType = 'corretivo' | 'sanitizacao' | 'projeto_instalacao';
export type ServiceUrgency = 'alta' | 'media' | 'baixa';
export type ServiceVisitPeriod = 'manha' | 'tarde' | 'qualquer';

export interface ServiceActivityMeta {
  id: ServiceActivityType;
  code: string;
  label: string;
  shortLabel: string;
  osVisitType: 'Corretiva' | 'Assepsia' | 'Instalação';
  summary: string;
  badge: string;
}

export const SERVICE_ACTIVITIES: ServiceActivityMeta[] = [
  {
    id: 'corretivo',
    code: '01',
    label: 'Chamado corretivo',
    shortLabel: 'Corretivo',
    osVisitType: 'Corretiva',
    summary: 'Equipamento parado, sem gelar, com vazamento, excesso de espuma ou falha elétrica.',
    badge: 'Reparo técnico',
  },
  {
    id: 'sanitizacao',
    code: '02',
    label: 'Chamado de sanitização',
    shortLabel: 'Sanitização',
    osVisitType: 'Assepsia',
    summary: 'Assepsia química de linhas, torneiras e serpentinas para preservar o sabor e o padrão do chopp.',
    badge: 'Assepsia preventiva',
  },
  {
    id: 'projeto_instalacao',
    code: '03',
    label: 'Projeto e instalação',
    shortLabel: 'Projeto / Instalação',
    osVisitType: 'Instalação',
    summary: 'Nova instalação de chopeira, torre ou balcão, readequação de ponto, câmara fria ou evento.',
    badge: 'Sob medida',
  },
];

export const CORRECTIVE_EQUIPMENTS = [
  'Chopeira elétrica',
  'Chopeira a gelo',
  'Pré-resfriador',
  'Torre de chopp',
  'Cervejeira / Gela canecas',
  'Sistema pós-mix',
  'Outro equipamento',
] as const;

export const CORRECTIVE_SYMPTOMS = [
  'Não gela / temperatura alta',
  'Congelando o chopp / excesso de gelo',
  'Vazamento de chopp ou água',
  'Vazamento de CO₂ / sem pressão',
  'Não liga / desarmando disjuntor',
  'Excesso de espuma / torneira',
  'Ruído anormal no compressor ou ventilador',
  'Outro sintoma',
] as const;

export const CORRECTIVE_URGENCIES: {
  id: ServiceUrgency;
  label: string;
  hint: string;
}[] = [
  {
    id: 'alta',
    label: 'Parado / Urgente',
    hint: 'Operação parada ou evento hoje/amanhã',
  },
  {
    id: 'media',
    label: 'Funcionando com restrição',
    hint: 'Pode agendar visita nesta semana',
  },
  {
    id: 'baixa',
    label: 'Sem urgência / Avaliação',
    hint: 'Orçamento ou revisão programada',
  },
];

export const VOLTAGE_OPTIONS = ['127V', '220V', 'Não sei'] as const;

export const SANITIZATION_PLACES = [
  'Bar / Pub',
  'Restaurante',
  'Cervejaria',
  'Conveniência / Mercado',
  'Residência',
  'Evento',
] as const;

export const SANITIZATION_EQUIP_COUNTS = ['1', '2', '3', '4', '5+'] as const;

export const SANITIZATION_TAPS_OPTIONS = [
  '1 a 2 vias',
  '3 a 4 vias',
  '5 a 8 vias',
  'Mais de 8 vias',
] as const;

export const SANITIZATION_LAST_OPTIONS = [
  'Menos de 15 dias',
  '15 a 30 dias',
  'Mais de 30 dias',
  'Nunca feita / Não sei',
] as const;

export const SANITIZATION_FREQ_OPTIONS = [
  'Visita avulsa',
  'Plano de rota preventiva (recorrente)',
] as const;

export const PROJECT_TYPES = [
  'Instalação completa de balcão',
  'Troca / readequação de ponto',
  'Instalação para evento',
  'Projeto sob medida (câmara fria / pré-resfriador)',
] as const;

export const PROJECT_ENVIRONMENTS = [
  'Bar / Pub',
  'Restaurante',
  'Cervejaria',
  'Mercado / Conveniência',
  'Área gourmet residencial',
  'Evento',
] as const;

export const PROJECT_HAS_EQUIP_OPTIONS = [
  'Já possuo os equipamentos',
  'Possuo parcialmente',
  'Preciso cotar equipamentos + instalação',
] as const;

export const PROJECT_POINTS_OPTIONS = [
  '1 a 2 pontos',
  '3 a 4 pontos',
  '5 a 8 pontos',
  'Mais de 8 pontos',
] as const;

export const PROJECT_TIMELINE_OPTIONS = [
  { id: 'urgente_7d', label: 'Urgente (até 7 dias)', urgency: 'alta' as ServiceUrgency },
  { id: 'neste_mes', label: 'Neste mês', urgency: 'media' as ServiceUrgency },
  { id: 'planejamento_30d', label: 'Planejamento (30+ dias)', urgency: 'baixa' as ServiceUrgency },
] as const;

export const VISIT_PERIOD_OPTIONS: { id: ServiceVisitPeriod; label: string }[] = [
  { id: 'manha', label: 'Manhã (08h–12h)' },
  { id: 'tarde', label: 'Tarde (13h30–18h)' },
  { id: 'qualquer', label: 'Qualquer horário comercial' },
];

export const RS_CITY_SUGGESTIONS = [
  'Porto Alegre - RS',
  'Canoas - RS',
  'Novo Hamburgo - RS',
  'São Leopoldo - RS',
  'Gravataí - RS',
  'Cachoeirinha - RS',
  'Esteio - RS',
  'Sapucaia do Sul - RS',
  'Viamão - RS',
  'Alvorada - RS',
  'Guaíba - RS',
  'Caxias do Sul - RS',
  'Bento Gonçalves - RS',
  'Gramado - RS',
  'Canela - RS',
  'Pelotas - RS',
  'Santa Maria - RS',
  'Passo Fundo - RS',
  'Lajeado - RS',
  'Santa Cruz do Sul - RS',
];

export interface CorrectiveAnswers {
  equipment: string;
  symptoms: string[];
  urgency: ServiceUrgency;
  brandModel: string;
  voltage: string;
  notes: string;
}

export interface SanitizationAnswers {
  placeType: string;
  equipmentCount: string;
  tapsRange: string;
  lastSanitization: string;
  frequency: string;
  notes: string;
}

export interface ProjectAnswers {
  projectType: string;
  environmentType: string;
  hasEquipment: string;
  pointsRange: string;
  timeline: string;
  notes: string;
}

export interface ServiceVisitCustomer {
  name: string;
  company: string;
  phone: string;
  city: string;
  address: string;
  preferredDate: string;
  preferredPeriod: ServiceVisitPeriod;
  honeypot?: string;
}

export interface ServiceVisitDraft {
  activity: ServiceActivityType;
  corrective: CorrectiveAnswers;
  sanitization: SanitizationAnswers;
  project: ProjectAnswers;
  customer: ServiceVisitCustomer;
}

export interface ServiceVisitSubmissionResult {
  protocolCode: string;
  savedToDatabase: boolean;
  summaryText: string;
  whatsappUrl: string;
  warning?: string;
}

export function createInitialVisitDraft(
  activity: ServiceActivityType = 'corretivo'
): ServiceVisitDraft {
  return {
    activity,
    corrective: {
      equipment: '',
      symptoms: [],
      urgency: 'media',
      brandModel: '',
      voltage: 'Não sei',
      notes: '',
    },
    sanitization: {
      placeType: '',
      equipmentCount: '1',
      tapsRange: '',
      lastSanitization: '',
      frequency: '',
      notes: '',
    },
    project: {
      projectType: '',
      environmentType: '',
      hasEquipment: '',
      pointsRange: '',
      timeline: '',
      notes: '',
    },
    customer: {
      name: '',
      company: '',
      phone: '',
      city: '',
      address: '',
      preferredDate: '',
      preferredPeriod: 'qualquer',
      honeypot: '',
    },
  };
}

export function getActivityMeta(activity: ServiceActivityType): ServiceActivityMeta {
  return SERVICE_ACTIVITIES.find(a => a.id === activity) ?? SERVICE_ACTIVITIES[0];
}

export function normalizePhoneDigits(raw: string | null | undefined): string {
  const digits = (raw ?? '').replace(/\D/g, '');
  if (digits.length > 11 && digits.startsWith('55')) {
    return digits.slice(2, 13);
  }
  return digits.slice(0, 11);
}

export function formatPhoneBr(raw: string | null | undefined): string {
  const d = normalizePhoneDigits(raw);
  if (d.length === 0) return '';
  if (d.length <= 2) return `(${d}`;
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7, 11)}`;
}

export function isValidPhoneBr(raw: string | null | undefined): boolean {
  const d = normalizePhoneDigits(raw);
  return d.length === 10 || d.length === 11;
}

/** Local YYYY-MM-DD date string without UTC -03:00 shift */
export function getLocalTodayIso(reference: Date = new Date()): string {
  const y = reference.getFullYear();
  const m = String(reference.getMonth() + 1).padStart(2, '0');
  const d = String(reference.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function formatIsoDateBr(isoDate: string | null | undefined): string {
  if (!isoDate) return '';
  const match = isoDate.trim().match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return isoDate;
  return `${match[3]}/${match[2]}/${match[1]}`;
}

export function getPeriodLabel(period: ServiceVisitPeriod): string {
  return VISIT_PERIOD_OPTIONS.find(p => p.id === period)?.label ?? 'Qualquer horário comercial';
}

export function generateVisitProtocol(reference: Date = new Date()): string {
  const stamp = getLocalTodayIso(reference).replace(/-/g, '');
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `VIS-${stamp}-${rand}`;
}

export function resolveVisitUrgency(draft: ServiceVisitDraft): ServiceUrgency {
  if (draft.activity === 'corretivo') {
    return draft.corrective.urgency;
  }
  if (draft.activity === 'projeto_instalacao') {
    const found = PROJECT_TIMELINE_OPTIONS.find(t => t.label === draft.project.timeline);
    return found?.urgency ?? 'media';
  }
  if (draft.sanitization.lastSanitization === 'Mais de 30 dias') {
    return 'media';
  }
  return 'baixa';
}

export function validateStep2(draft: ServiceVisitDraft): string | null {
  if (draft.activity === 'corretivo') {
    if (!draft.corrective.equipment) {
      return 'Selecione qual equipamento precisa de manutenção corretiva.';
    }
    if (draft.corrective.symptoms.length === 0) {
      return 'Selecione pelo menos um sintoma ou problema observado.';
    }
    return null;
  }

  if (draft.activity === 'sanitizacao') {
    if (!draft.sanitization.placeType) {
      return 'Informe o tipo de local ou estabelecimento.';
    }
    if (!draft.sanitization.tapsRange) {
      return 'Informe a quantidade aproximada de torneiras / vias.';
    }
    if (!draft.sanitization.lastSanitization) {
      return 'Informe quando foi feita a última sanitização.';
    }
    if (!draft.sanitization.frequency) {
      return 'Selecione se prefere visita avulsa ou plano preventivo.';
    }
    return null;
  }

  if (!draft.project.projectType) {
    return 'Selecione o tipo de projeto ou instalação desejada.';
  }
  if (!draft.project.environmentType) {
    return 'Informe o tipo de ambiente ou estabelecimento.';
  }
  if (!draft.project.hasEquipment) {
    return 'Informe se você já possui os equipamentos.';
  }
  if (!draft.project.pointsRange) {
    return 'Informe a quantidade prevista de pontos / torneiras.';
  }
  if (!draft.project.timeline) {
    return 'Selecione o prazo desejado para execução.';
  }
  return null;
}

export function validateStep3(customer: ServiceVisitCustomer): string | null {
  if (customer.name.trim().length < 3) {
    return 'Informe seu nome completo (mínimo 3 caracteres).';
  }
  if (!isValidPhoneBr(customer.phone)) {
    return 'Informe um telefone ou WhatsApp válido com DDD (10 ou 11 dígitos).';
  }
  if (customer.city.trim().length < 2) {
    return 'Informe a cidade onde será realizada a visita técnica.';
  }
  return null;
}

export function extractQuestionnairePayload(draft: ServiceVisitDraft): Record<string, unknown> {
  if (draft.activity === 'corretivo') {
    return {
      equipment: draft.corrective.equipment,
      symptoms: draft.corrective.symptoms,
      urgency: draft.corrective.urgency,
      brandModel: draft.corrective.brandModel.trim(),
      voltage: draft.corrective.voltage,
      notes: draft.corrective.notes.trim(),
    };
  }
  if (draft.activity === 'sanitizacao') {
    return {
      placeType: draft.sanitization.placeType,
      equipmentCount: draft.sanitization.equipmentCount,
      tapsRange: draft.sanitization.tapsRange,
      lastSanitization: draft.sanitization.lastSanitization,
      frequency: draft.sanitization.frequency,
      notes: draft.sanitization.notes.trim(),
    };
  }
  return {
    projectType: draft.project.projectType,
    environmentType: draft.project.environmentType,
    hasEquipment: draft.project.hasEquipment,
    pointsRange: draft.project.pointsRange,
    timeline: draft.project.timeline,
    notes: draft.project.notes.trim(),
  };
}

export function buildVisitTechnicalSummary(draft: ServiceVisitDraft, protocolCode: string): string {
  const meta = getActivityMeta(draft.activity);
  const lines: string[] = [
    `Protocolo: ${protocolCode}`,
    `Atividade: ${meta.label}`,
  ];

  if (draft.activity === 'corretivo') {
    const urgLabel =
      CORRECTIVE_URGENCIES.find(u => u.id === draft.corrective.urgency)?.label ?? 'Média';
    lines.push(`Equipamento: ${draft.corrective.equipment}`);
    lines.push(`Sintomas: ${draft.corrective.symptoms.join(', ')}`);
    lines.push(`Urgência: ${urgLabel}`);
    if (draft.corrective.brandModel.trim()) {
      lines.push(`Marca/Modelo: ${draft.corrective.brandModel.trim()}`);
    }
    if (draft.corrective.voltage && draft.corrective.voltage !== 'Não sei') {
      lines.push(`Tensão: ${draft.corrective.voltage}`);
    }
    if (draft.corrective.notes.trim()) {
      lines.push(`Detalhes: ${draft.corrective.notes.trim()}`);
    }
  } else if (draft.activity === 'sanitizacao') {
    lines.push(`Tipo de local: ${draft.sanitization.placeType}`);
    lines.push(`Qtd. de equipamentos (sanitizações): ${draft.sanitization.equipmentCount}`);
    lines.push(`Vias / torneiras: ${draft.sanitization.tapsRange}`);
    lines.push(`Última sanitização: ${draft.sanitization.lastSanitization}`);
    lines.push(`Modalidade: ${draft.sanitization.frequency}`);
    if (draft.sanitization.notes.trim()) {
      lines.push(`Observações: ${draft.sanitization.notes.trim()}`);
    }
  } else {
    lines.push(`Tipo de demanda: ${draft.project.projectType}`);
    lines.push(`Ambiente: ${draft.project.environmentType}`);
    lines.push(`Equipamentos: ${draft.project.hasEquipment}`);
    lines.push(`Pontos previstos: ${draft.project.pointsRange}`);
    lines.push(`Prazo desejado: ${draft.project.timeline}`);
    if (draft.project.notes.trim()) {
      lines.push(`Detalhes do espaço: ${draft.project.notes.trim()}`);
    }
  }

  lines.push('');
  lines.push(`Cliente: ${draft.customer.name.trim()}`);
  if (draft.customer.company.trim()) {
    lines.push(`Empresa/Estabelecimento: ${draft.customer.company.trim()}`);
  }
  lines.push(`Telefone/WhatsApp: ${formatPhoneBr(draft.customer.phone)}`);
  lines.push(`Cidade: ${draft.customer.city.trim()}`);
  if (draft.customer.address.trim()) {
    lines.push(`Endereço/Bairro: ${draft.customer.address.trim()}`);
  }
  if (draft.customer.preferredDate) {
    lines.push(
      `Preferência: ${formatIsoDateBr(draft.customer.preferredDate)} · ${getPeriodLabel(draft.customer.preferredPeriod)}`
    );
  } else if (draft.customer.preferredPeriod !== 'qualquer') {
    lines.push(`Turno preferencial: ${getPeriodLabel(draft.customer.preferredPeriod)}`);
  }

  return lines.join('\n');
}

export function buildWhatsAppVisitUrl(
  draft: ServiceVisitDraft,
  protocolCode: string,
  phoneDigits: string = REFRIMAQ_WHATSAPP_PRIMARY
): string {
  const summary = buildVisitTechnicalSummary(draft, protocolCode);
  const fullMessage = [
    'Olá, Refrimaq. Solicitei um agendamento de visita técnica pelo site:',
    '',
    summary,
  ].join('\n');

  return `https://wa.me/${phoneDigits}?text=${encodeURIComponent(fullMessage)}`;
}

/**
 * Persists a public technical visit request to Supabase `public.service_requests`.
 * IMPORTANT (LGPD + RLS): `anon` holds INSERT-only permission and must NEVER chain `.select()`.
 * If Supabase is not configured or the migration has not been executed yet, falls back gracefully
 * so the customer can always complete confirmation via WhatsApp.
 */
export async function submitServiceVisitRequest(
  draft: ServiceVisitDraft
): Promise<ServiceVisitSubmissionResult> {
  const protocolCode = generateVisitProtocol();
  const summaryText = buildVisitTechnicalSummary(draft, protocolCode);
  const whatsappUrl = buildWhatsAppVisitUrl(draft, protocolCode);

  // Silent honeypot protection against automated bots
  if ((draft.customer.honeypot ?? '').trim().length > 0) {
    return {
      protocolCode,
      savedToDatabase: false,
      summaryText,
      whatsappUrl,
    };
  }

  if (!supabase) {
    return {
      protocolCode,
      savedToDatabase: false,
      summaryText,
      whatsappUrl,
    };
  }

  const payload = {
    protocol_code: protocolCode,
    activity_type: draft.activity,
    status: 'novo',
    urgency: resolveVisitUrgency(draft),
    customer_name: draft.customer.name.trim(),
    company_name: draft.customer.company.trim(),
    phone: formatPhoneBr(draft.customer.phone),
    phone_digits: normalizePhoneDigits(draft.customer.phone),
    city: draft.customer.city.trim(),
    address: draft.customer.address.trim(),
    preferred_date: draft.customer.preferredDate || null,
    preferred_period: draft.customer.preferredPeriod,
    questionnaire: extractQuestionnairePayload(draft),
    summary_text: summaryText,
  };

  try {
    const { error } = await supabase.from('service_requests').insert(payload);
    if (error) {
      return {
        protocolCode,
        savedToDatabase: false,
        summaryText,
        whatsappUrl,
        warning: 'Protocolo gerado localmente. Clique abaixo para enviar direto pelo WhatsApp.',
      };
    }

    return {
      protocolCode,
      savedToDatabase: true,
      summaryText,
      whatsappUrl,
    };
  } catch {
    return {
      protocolCode,
      savedToDatabase: false,
      summaryText,
      whatsappUrl,
      warning: 'Sem conexão com o servidor no momento. Envie pelo WhatsApp abaixo.',
    };
  }
}
