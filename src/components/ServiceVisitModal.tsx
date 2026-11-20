import { useEffect, useState } from 'react';
import {
  X,
  Wrench,
  ShieldCheck,
  Compass,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  MessageCircle,
  Copy,
  Check,
  Loader2,
  AlertCircle,
  Calendar,
  MapPin,
  Phone,
  User,
  Building2,
} from 'lucide-react';
import {
  CORRECTIVE_EQUIPMENTS,
  CORRECTIVE_SYMPTOMS,
  CORRECTIVE_URGENCIES,
  PROJECT_ENVIRONMENTS,
  PROJECT_HAS_EQUIP_OPTIONS,
  PROJECT_POINTS_OPTIONS,
  PROJECT_TIMELINE_OPTIONS,
  PROJECT_TYPES,
  RS_CITY_SUGGESTIONS,
  SANITIZATION_EQUIP_COUNTS,
  SANITIZATION_FREQ_OPTIONS,
  SANITIZATION_LAST_OPTIONS,
  SANITIZATION_PLACES,
  SANITIZATION_TAPS_OPTIONS,
  SERVICE_ACTIVITIES,
  ServiceActivityType,
  ServiceVisitDraft,
  ServiceVisitPeriod,
  ServiceVisitSubmissionResult,
  VISIT_PERIOD_OPTIONS,
  VOLTAGE_OPTIONS,
  createInitialVisitDraft,
  formatPhoneBr,
  getActivityMeta,
  getLocalTodayIso,
  submitServiceVisitRequest,
  validateStep2,
  validateStep3,
} from '../lib/serviceVisitEngine';

interface ServiceVisitModalProps {
  open: boolean;
  initialActivity: ServiceActivityType | null;
  onClose: () => void;
  onViewServicesSection: () => void;
}

const ACTIVITY_ICONS: Record<ServiceActivityType, typeof Wrench> = {
  corretivo: Wrench,
  sanitizacao: ShieldCheck,
  projeto_instalacao: Compass,
};

type WizardStep = 1 | 2 | 3 | 4;

export default function ServiceVisitModal({
  open,
  initialActivity,
  onClose,
  onViewServicesSection,
}: ServiceVisitModalProps) {
  const [step, setStep] = useState<WizardStep>(1);
  const [draft, setDraft] = useState<ServiceVisitDraft>(() => createInitialVisitDraft('corretivo'));
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<ServiceVisitSubmissionResult | null>(null);
  const [copiedSummary, setCopiedSummary] = useState(false);

  // Reset wizard state whenever modal opens
  useEffect(() => {
    if (!open) return;
    setErrorMsg(null);
    setSubmitting(false);
    setResult(null);
    setCopiedSummary(false);
    if (initialActivity) {
      setDraft(createInitialVisitDraft(initialActivity));
      setStep(2);
    } else {
      setDraft(createInitialVisitDraft('corretivo'));
      setStep(1);
    }
  }, [open, initialActivity]);

  // Close on Escape and lock body scroll while open
  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  const activityMeta = getActivityMeta(draft.activity);
  const todayIso = getLocalTodayIso();

  function selectActivity(activity: ServiceActivityType) {
    setDraft(prev => ({ ...prev, activity }));
    setErrorMsg(null);
    setStep(2);
  }

  function toggleCorrectiveSymptom(symptom: string) {
    setDraft(prev => {
      const exists = prev.corrective.symptoms.includes(symptom);
      const next = exists
        ? prev.corrective.symptoms.filter(s => s !== symptom)
        : [...prev.corrective.symptoms, symptom];
      return {
        ...prev,
        corrective: { ...prev.corrective, symptoms: next },
      };
    });
    setErrorMsg(null);
  }

  function handleAdvanceFromStep2() {
    const err = validateStep2(draft);
    if (err) {
      setErrorMsg(err);
      return;
    }
    setErrorMsg(null);
    setStep(3);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const err = validateStep3(draft.customer);
    if (err) {
      setErrorMsg(err);
      return;
    }

    setErrorMsg(null);
    setSubmitting(true);
    const submission = await submitServiceVisitRequest(draft);
    setSubmitting(false);
    setResult(submission);
    setStep(4);
  }

  async function handleCopySummary() {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result.summaryText);
      setCopiedSummary(true);
      window.setTimeout(() => setCopiedSummary(false), 2200);
    } catch {
      // Clipboard blocked on non-secure context; ignore gracefully
    }
  }

  function handleResetNew() {
    setDraft(createInitialVisitDraft('corretivo'));
    setResult(null);
    setErrorMsg(null);
    setStep(1);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-ink-950/70 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="service-visit-modal-title"
      onClick={onClose}
    >
      <div
        className="w-full sm:max-w-2xl max-h-[94vh] sm:max-h-[90vh] bg-white sm:rounded-[16px] rounded-t-[16px] shadow-[0_24px_64px_rgba(0,0,0,0.28)] border border-ink-200 flex flex-col overflow-hidden animate-enter"
        onClick={e => e.stopPropagation()}
      >
        {/* Dark Graphite Studio Header */}
        <div className="bg-ink-900 text-white px-5 sm:px-6 py-4 sm:py-5 shrink-0">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[11px] px-2 py-0.5 rounded-[5px] bg-white/10 text-ink-200 border border-white/10 tabular-nums">
                  {step < 4 ? `Etapa ${step} de 3` : 'Solicitação registrada'}
                </span>
                {step >= 2 && step < 4 && (
                  <span className="font-mono text-[11px] px-2 py-0.5 rounded-[5px] bg-brand-500/30 text-brand-100 border border-brand-500/40">
                    {activityMeta.shortLabel}
                  </span>
                )}
              </div>
              <h2
                id="service-visit-modal-title"
                className="text-lg sm:text-xl font-medium text-white tracking-[-0.015em] mt-2"
              >
                {step === 1 && 'Agendar visita técnica'}
                {step === 2 && `Triagem · ${activityMeta.label}`}
                {step === 3 && 'Seus dados e preferência de visita'}
                {step === 4 && 'Agendamento pronto para confirmação'}
              </h2>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Fechar agendamento de visita técnica"
              className="w-9 h-9 rounded-[8px] bg-white/5 hover:bg-white/15 border border-white/10 flex items-center justify-center text-ink-200 hover:text-white transition-colors shrink-0"
            >
              <X size={18} strokeWidth={1.5} />
            </button>
          </div>

          {/* Step Progress Bar */}
          {step < 4 && (
            <div className="mt-4 grid grid-cols-3 gap-2">
              {[
                { num: 1, label: '1. Atividade' },
                { num: 2, label: '2. Questionário' },
                { num: 3, label: '3. Seus dados' },
              ].map(item => {
                const active = step === item.num;
                const done = step > item.num;
                return (
                  <div key={item.num} className="space-y-1.5">
                    <div
                      className={`h-1 rounded-full transition-colors ${
                        done ? 'bg-brand-500' : active ? 'bg-white' : 'bg-white/15'
                      }`}
                    />
                    <p
                      className={`text-[11px] font-medium truncate ${
                        active ? 'text-white' : done ? 'text-ink-300' : 'text-ink-500'
                      }`}
                    >
                      {item.label}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto px-5 sm:px-6 py-5 space-y-5">
          {errorMsg && (
            <div
              role="alert"
              className="flex items-start gap-2.5 p-3.5 rounded-[10px] bg-red-50 border border-red-200 text-red-800 text-sm"
            >
              <AlertCircle size={17} strokeWidth={1.75} className="shrink-0 mt-0.5 text-red-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* STEP 1: Activity Selection */}
          {step === 1 && (
            <div className="space-y-4">
              <p className="text-sm text-ink-600 leading-relaxed">
                Selecione o tipo de atendimento para direcionarmos o técnico, as ferramentas e as
                peças adequadas à sua necessidade:
              </p>

              <div className="grid grid-cols-1 gap-3">
                {SERVICE_ACTIVITIES.map(act => {
                  const Icon = ACTIVITY_ICONS[act.id];
                  const selected = draft.activity === act.id;
                  return (
                    <button
                      key={act.id}
                      type="button"
                      onClick={() => selectActivity(act.id)}
                      className={`group w-full text-left p-4 sm:p-5 rounded-[12px] border transition-all flex items-start gap-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 ${
                        selected
                          ? 'border-brand-500 bg-brand-50/40'
                          : 'border-ink-200 bg-white hover:border-ink-400 hover:bg-ink-50/60'
                      }`}
                    >
                      <div className="w-11 h-11 rounded-[10px] bg-ink-900 text-white flex items-center justify-center shrink-0 group-hover:bg-brand-500 transition-colors">
                        <Icon size={20} strokeWidth={1.5} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-base font-medium text-ink-900">{act.label}</span>
                          <span className="font-mono text-[11px] px-2 py-0.5 rounded-[5px] bg-ink-100 text-ink-600 shrink-0">
                            {act.badge}
                          </span>
                        </div>
                        <p className="text-sm text-ink-600 mt-1 leading-relaxed">{act.summary}</p>
                      </div>
                      <ArrowRight
                        size={18}
                        strokeWidth={1.5}
                        className="text-ink-400 group-hover:text-brand-600 group-hover:translate-x-0.5 transition-all shrink-0 mt-1"
                      />
                    </button>
                  );
                })}
              </div>

              <div className="pt-2 flex items-center justify-between text-xs text-ink-500 border-t border-ink-100">
                <span>Atendimento técnico próprio no RS · Peças originais</span>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onViewServicesSection();
                  }}
                  className="text-brand-600 hover:text-brand-700 font-medium underline underline-offset-2 shrink-0"
                >
                  Ver detalhes dos serviços
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Activity-Specific Questionnaire */}
          {step === 2 && draft.activity === 'corretivo' && (
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-ink-900 mb-2">
                  1. Qual equipamento está apresentando problema? <span className="text-brand-600">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {CORRECTIVE_EQUIPMENTS.map(eq => {
                    const active = draft.corrective.equipment === eq;
                    return (
                      <button
                        key={eq}
                        type="button"
                        onClick={() => {
                          setDraft(prev => ({
                            ...prev,
                            corrective: { ...prev.corrective, equipment: eq },
                          }));
                          setErrorMsg(null);
                        }}
                        className={`min-h-[42px] px-3.5 py-2 rounded-[8px] border text-sm text-left font-medium transition-colors ${
                          active
                            ? 'bg-brand-500 border-brand-500 text-white'
                            : 'bg-white border-ink-200 text-ink-700 hover:border-ink-400 hover:bg-ink-50'
                        }`}
                      >
                        {eq}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-ink-900 mb-1">
                  2. Quais sintomas você observou? <span className="text-brand-600">*</span>
                </label>
                <p className="text-xs text-ink-500 mb-2.5">Pode marcar mais de uma opção</p>
                <div className="flex flex-wrap gap-2">
                  {CORRECTIVE_SYMPTOMS.map(sym => {
                    const active = draft.corrective.symptoms.includes(sym);
                    return (
                      <button
                        key={sym}
                        type="button"
                        onClick={() => toggleCorrectiveSymptom(sym)}
                        className={`min-h-[38px] px-3 py-1.5 rounded-[8px] border text-xs sm:text-sm font-medium transition-colors ${
                          active
                            ? 'bg-ink-900 border-ink-900 text-white'
                            : 'bg-ink-50 border-ink-200 text-ink-700 hover:border-ink-400 hover:bg-white'
                        }`}
                      >
                        {sym}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-ink-900 mb-2">
                  3. Qual a urgência do atendimento? <span className="text-brand-600">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {CORRECTIVE_URGENCIES.map(u => {
                    const active = draft.corrective.urgency === u.id;
                    return (
                      <button
                        key={u.id}
                        type="button"
                        onClick={() =>
                          setDraft(prev => ({
                            ...prev,
                            corrective: { ...prev.corrective, urgency: u.id },
                          }))
                        }
                        className={`p-3 rounded-[8px] border text-left transition-colors ${
                          active
                            ? 'bg-brand-500 border-brand-500 text-white'
                            : 'bg-white border-ink-200 text-ink-800 hover:border-ink-400'
                        }`}
                      >
                        <p className="text-sm font-medium">{u.label}</p>
                        <p
                          className={`text-xs mt-0.5 leading-snug ${
                            active ? 'text-white/85' : 'text-ink-500'
                          }`}
                        >
                          {u.hint}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="visit-corr-brand"
                    className="block text-sm font-medium text-ink-900 mb-1.5"
                  >
                    Marca / Modelo <span className="text-ink-400 font-normal">(opcional)</span>
                  </label>
                  <input
                    id="visit-corr-brand"
                    type="text"
                    value={draft.corrective.brandModel}
                    onChange={e =>
                      setDraft(prev => ({
                        ...prev,
                        corrective: { ...prev.corrective, brandModel: e.target.value },
                      }))
                    }
                    placeholder="Ex.: Memo Advantage 70L/h, Metalfrio"
                    className="w-full h-11 px-3.5 rounded-[8px] bg-white border border-ink-200 focus:border-brand-500 focus:outline-none text-sm text-ink-900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-ink-900 mb-1.5">
                    Tensão elétrica <span className="text-ink-400 font-normal">(opcional)</span>
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {VOLTAGE_OPTIONS.map(v => {
                      const active = draft.corrective.voltage === v;
                      return (
                        <button
                          key={v}
                          type="button"
                          onClick={() =>
                            setDraft(prev => ({
                              ...prev,
                              corrective: { ...prev.corrective, voltage: v },
                            }))
                          }
                          className={`h-11 rounded-[8px] border text-sm font-mono transition-colors ${
                            active
                              ? 'bg-ink-900 border-ink-900 text-white'
                              : 'bg-white border-ink-200 text-ink-700 hover:border-ink-400'
                          }`}
                        >
                          {v}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div>
                <label
                  htmlFor="visit-corr-notes"
                  className="block text-sm font-medium text-ink-900 mb-1.5"
                >
                  Observações técnicas <span className="text-ink-400 font-normal">(opcional)</span>
                </label>
                <textarea
                  id="visit-corr-notes"
                  rows={2}
                  value={draft.corrective.notes}
                  onChange={e =>
                    setDraft(prev => ({
                      ...prev,
                      corrective: { ...prev.corrective, notes: e.target.value },
                    }))
                  }
                  placeholder="Ex.: código no controlador, quando começou a falha ou detalhe do acesso"
                  className="w-full px-3.5 py-2.5 rounded-[8px] bg-white border border-ink-200 focus:border-brand-500 focus:outline-none text-sm text-ink-900 resize-none"
                />
              </div>
            </div>
          )}

          {step === 2 && draft.activity === 'sanitizacao' && (
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-ink-900 mb-2">
                  1. Tipo de estabelecimento ou uso <span className="text-brand-600">*</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {SANITIZATION_PLACES.map(place => {
                    const active = draft.sanitization.placeType === place;
                    return (
                      <button
                        key={place}
                        type="button"
                        onClick={() => {
                          setDraft(prev => ({
                            ...prev,
                            sanitization: { ...prev.sanitization, placeType: place },
                          }));
                          setErrorMsg(null);
                        }}
                        className={`min-h-[42px] px-3 py-2 rounded-[8px] border text-sm font-medium transition-colors ${
                          active
                            ? 'bg-brand-500 border-brand-500 text-white'
                            : 'bg-white border-ink-200 text-ink-700 hover:border-ink-400 hover:bg-ink-50'
                        }`}
                      >
                        {place}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-ink-900 mb-2">
                    2. Qtd. de chopeiras / equipamentos <span className="text-brand-600">*</span>
                  </label>
                  <div className="grid grid-cols-5 gap-1.5">
                    {SANITIZATION_EQUIP_COUNTS.map(cnt => {
                      const active = draft.sanitization.equipmentCount === cnt;
                      return (
                        <button
                          key={cnt}
                          type="button"
                          onClick={() =>
                            setDraft(prev => ({
                              ...prev,
                              sanitization: { ...prev.sanitization, equipmentCount: cnt },
                            }))
                          }
                          className={`h-11 rounded-[8px] border font-mono text-sm font-medium transition-colors ${
                            active
                              ? 'bg-ink-900 border-ink-900 text-white'
                              : 'bg-white border-ink-200 text-ink-700 hover:border-ink-400'
                          }`}
                        >
                          {cnt}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-ink-900 mb-2">
                    3. Total aproximado de torneiras <span className="text-brand-600">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {SANITIZATION_TAPS_OPTIONS.map(taps => {
                      const active = draft.sanitization.tapsRange === taps;
                      return (
                        <button
                          key={taps}
                          type="button"
                          onClick={() => {
                            setDraft(prev => ({
                              ...prev,
                              sanitization: { ...prev.sanitization, tapsRange: taps },
                            }));
                            setErrorMsg(null);
                          }}
                          className={`h-11 px-2.5 rounded-[8px] border text-xs sm:text-sm font-medium transition-colors ${
                            active
                              ? 'bg-brand-500 border-brand-500 text-white'
                              : 'bg-white border-ink-200 text-ink-700 hover:border-ink-400'
                          }`}
                        >
                          {taps}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-ink-900 mb-2">
                  4. Quando foi a última sanitização? <span className="text-brand-600">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {SANITIZATION_LAST_OPTIONS.map(opt => {
                    const active = draft.sanitization.lastSanitization === opt;
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => {
                          setDraft(prev => ({
                            ...prev,
                            sanitization: { ...prev.sanitization, lastSanitization: opt },
                          }));
                          setErrorMsg(null);
                        }}
                        className={`min-h-[42px] px-3 py-2 rounded-[8px] border text-sm font-medium text-left transition-colors ${
                          active
                            ? 'bg-ink-900 border-ink-900 text-white'
                            : 'bg-white border-ink-200 text-ink-700 hover:border-ink-400'
                        }`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-ink-900 mb-2">
                  5. Frequência desejada <span className="text-brand-600">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {SANITIZATION_FREQ_OPTIONS.map(freq => {
                    const active = draft.sanitization.frequency === freq;
                    return (
                      <button
                        key={freq}
                        type="button"
                        onClick={() => {
                          setDraft(prev => ({
                            ...prev,
                            sanitization: { ...prev.sanitization, frequency: freq },
                          }));
                          setErrorMsg(null);
                        }}
                        className={`min-h-[44px] px-3.5 py-2.5 rounded-[8px] border text-sm font-medium text-left transition-colors ${
                          active
                            ? 'bg-brand-500 border-brand-500 text-white'
                            : 'bg-white border-ink-200 text-ink-700 hover:border-ink-400'
                        }`}
                      >
                        {freq}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label
                  htmlFor="visit-san-notes"
                  className="block text-sm font-medium text-ink-900 mb-1.5"
                >
                  Observações <span className="text-ink-400 font-normal">(opcional)</span>
                </label>
                <textarea
                  id="visit-san-notes"
                  rows={2}
                  value={draft.sanitization.notes}
                  onChange={e =>
                    setDraft(prev => ({
                      ...prev,
                      sanitization: { ...prev.sanitization, notes: e.target.value },
                    }))
                  }
                  placeholder="Ex.: tipo de bebida (chopp, vinho, pós-mix) ou restrição de horário do bar"
                  className="w-full px-3.5 py-2.5 rounded-[8px] bg-white border border-ink-200 focus:border-brand-500 focus:outline-none text-sm text-ink-900 resize-none"
                />
              </div>
            </div>
          )}

          {step === 2 && draft.activity === 'projeto_instalacao' && (
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-ink-900 mb-2">
                  1. Qual o tipo de projeto ou instalação? <span className="text-brand-600">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {PROJECT_TYPES.map(pt => {
                    const active = draft.project.projectType === pt;
                    return (
                      <button
                        key={pt}
                        type="button"
                        onClick={() => {
                          setDraft(prev => ({
                            ...prev,
                            project: { ...prev.project, projectType: pt },
                          }));
                          setErrorMsg(null);
                        }}
                        className={`min-h-[44px] px-3.5 py-2 rounded-[8px] border text-sm font-medium text-left transition-colors ${
                          active
                            ? 'bg-brand-500 border-brand-500 text-white'
                            : 'bg-white border-ink-200 text-ink-700 hover:border-ink-400'
                        }`}
                      >
                        {pt}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-ink-900 mb-2">
                  2. Tipo de ambiente <span className="text-brand-600">*</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {PROJECT_ENVIRONMENTS.map(env => {
                    const active = draft.project.environmentType === env;
                    return (
                      <button
                        key={env}
                        type="button"
                        onClick={() => {
                          setDraft(prev => ({
                            ...prev,
                            project: { ...prev.project, environmentType: env },
                          }));
                          setErrorMsg(null);
                        }}
                        className={`min-h-[42px] px-3 py-2 rounded-[8px] border text-sm font-medium transition-colors ${
                          active
                            ? 'bg-ink-900 border-ink-900 text-white'
                            : 'bg-white border-ink-200 text-ink-700 hover:border-ink-400'
                        }`}
                      >
                        {env}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-ink-900 mb-2">
                  3. Você já possui os equipamentos? <span className="text-brand-600">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {PROJECT_HAS_EQUIP_OPTIONS.map(opt => {
                    const active = draft.project.hasEquipment === opt;
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => {
                          setDraft(prev => ({
                            ...prev,
                            project: { ...prev.project, hasEquipment: opt },
                          }));
                          setErrorMsg(null);
                        }}
                        className={`min-h-[44px] px-3 py-2 rounded-[8px] border text-xs sm:text-sm font-medium text-left transition-colors ${
                          active
                            ? 'bg-brand-500 border-brand-500 text-white'
                            : 'bg-white border-ink-200 text-ink-700 hover:border-ink-400'
                        }`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-ink-900 mb-2">
                    4. Quantidade de torneiras / pontos <span className="text-brand-600">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {PROJECT_POINTS_OPTIONS.map(pts => {
                      const active = draft.project.pointsRange === pts;
                      return (
                        <button
                          key={pts}
                          type="button"
                          onClick={() => {
                            setDraft(prev => ({
                              ...prev,
                              project: { ...prev.project, pointsRange: pts },
                            }));
                            setErrorMsg(null);
                          }}
                          className={`h-11 px-2.5 rounded-[8px] border text-xs sm:text-sm font-medium transition-colors ${
                            active
                              ? 'bg-ink-900 border-ink-900 text-white'
                              : 'bg-white border-ink-200 text-ink-700 hover:border-ink-400'
                          }`}
                        >
                          {pts}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-ink-900 mb-2">
                    5. Previsão desejada <span className="text-brand-600">*</span>
                  </label>
                  <div className="space-y-1.5">
                    {PROJECT_TIMELINE_OPTIONS.map(t => {
                      const active = draft.project.timeline === t.label;
                      return (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => {
                            setDraft(prev => ({
                              ...prev,
                              project: { ...prev.project, timeline: t.label },
                            }));
                            setErrorMsg(null);
                          }}
                          className={`w-full min-h-[38px] px-3 py-1.5 rounded-[8px] border text-xs sm:text-sm font-medium text-left transition-colors ${
                            active
                              ? 'bg-brand-500 border-brand-500 text-white'
                              : 'bg-white border-ink-200 text-ink-700 hover:border-ink-400'
                          }`}
                        >
                          {t.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div>
                <label
                  htmlFor="visit-proj-notes"
                  className="block text-sm font-medium text-ink-900 mb-1.5"
                >
                  Detalhes do espaço / projeto <span className="text-ink-400 font-normal">(opcional)</span>
                </label>
                <textarea
                  id="visit-proj-notes"
                  rows={2}
                  value={draft.project.notes}
                  onChange={e =>
                    setDraft(prev => ({
                      ...prev,
                      project: { ...prev.project, notes: e.target.value },
                    }))
                  }
                  placeholder="Ex.: distância do balcão à câmara fria, tensão disponível ou data do evento"
                  className="w-full px-3.5 py-2.5 rounded-[8px] bg-white border border-ink-200 focus:border-brand-500 focus:outline-none text-sm text-ink-900 resize-none"
                />
              </div>
            </div>
          )}

          {/* STEP 3: Customer Intake Form */}
          {step === 3 && (
            <form id="service-visit-customer-form" onSubmit={handleSubmit} className="space-y-4">
              <p className="text-sm text-ink-600">
                Preencha seus dados de contato para registrarmos sua solicitação e agilizarmos o
                retorno técnico:
              </p>

              {/* Invisible anti-bot honeypot */}
              <div className="hidden" aria-hidden="true">
                <input
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={draft.customer.honeypot ?? ''}
                  onChange={e =>
                    setDraft(prev => ({
                      ...prev,
                      customer: { ...prev.customer, honeypot: e.target.value },
                    }))
                  }
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="visit-customer-name"
                    className="block text-sm font-medium text-ink-900 mb-1.5"
                  >
                    Seu nome <span className="text-brand-600">*</span>
                  </label>
                  <div className="relative">
                    <User
                      size={16}
                      strokeWidth={1.5}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400"
                    />
                    <input
                      id="visit-customer-name"
                      type="text"
                      required
                      value={draft.customer.name}
                      onChange={e => {
                        setDraft(prev => ({
                          ...prev,
                          customer: { ...prev.customer, name: e.target.value },
                        }));
                        setErrorMsg(null);
                      }}
                      placeholder="Nome completo"
                      className="w-full h-11 pl-9 pr-3.5 rounded-[8px] bg-white border border-ink-200 focus:border-brand-500 focus:outline-none text-sm text-ink-900"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="visit-customer-company"
                    className="block text-sm font-medium text-ink-900 mb-1.5"
                  >
                    Empresa / Estabelecimento{' '}
                    <span className="text-ink-400 font-normal">(opcional)</span>
                  </label>
                  <div className="relative">
                    <Building2
                      size={16}
                      strokeWidth={1.5}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400"
                    />
                    <input
                      id="visit-customer-company"
                      type="text"
                      value={draft.customer.company}
                      onChange={e =>
                        setDraft(prev => ({
                          ...prev,
                          customer: { ...prev.customer, company: e.target.value },
                        }))
                      }
                      placeholder="Ex.: Bar, restaurante ou residência"
                      className="w-full h-11 pl-9 pr-3.5 rounded-[8px] bg-white border border-ink-200 focus:border-brand-500 focus:outline-none text-sm text-ink-900"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="visit-customer-phone"
                    className="block text-sm font-medium text-ink-900 mb-1.5"
                  >
                    Telefone / WhatsApp <span className="text-brand-600">*</span>
                  </label>
                  <div className="relative">
                    <Phone
                      size={16}
                      strokeWidth={1.5}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400"
                    />
                    <input
                      id="visit-customer-phone"
                      type="tel"
                      required
                      inputMode="tel"
                      value={draft.customer.phone}
                      onChange={e => {
                        setDraft(prev => ({
                          ...prev,
                          customer: { ...prev.customer, phone: formatPhoneBr(e.target.value) },
                        }));
                        setErrorMsg(null);
                      }}
                      placeholder="(51) 99999-9999"
                      className="w-full h-11 pl-9 pr-3.5 rounded-[8px] bg-white border border-ink-200 focus:border-brand-500 focus:outline-none text-sm text-ink-900 tabular-nums"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="visit-customer-city"
                    className="block text-sm font-medium text-ink-900 mb-1.5"
                  >
                    Cidade / UF <span className="text-brand-600">*</span>
                  </label>
                  <div className="relative">
                    <MapPin
                      size={16}
                      strokeWidth={1.5}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400"
                    />
                    <input
                      id="visit-customer-city"
                      type="text"
                      required
                      list="refrimaq-rs-cities"
                      value={draft.customer.city}
                      onChange={e => {
                        setDraft(prev => ({
                          ...prev,
                          customer: { ...prev.customer, city: e.target.value },
                        }));
                        setErrorMsg(null);
                      }}
                      placeholder="Ex.: Porto Alegre - RS"
                      className="w-full h-11 pl-9 pr-3.5 rounded-[8px] bg-white border border-ink-200 focus:border-brand-500 focus:outline-none text-sm text-ink-900"
                    />
                    <datalist id="refrimaq-rs-cities">
                      {RS_CITY_SUGGESTIONS.map(city => (
                        <option key={city} value={city} />
                      ))}
                    </datalist>
                  </div>
                </div>
              </div>

              <div>
                <label
                  htmlFor="visit-customer-address"
                  className="block text-sm font-medium text-ink-900 mb-1.5"
                >
                  Bairro / Endereço <span className="text-ink-400 font-normal">(opcional)</span>
                </label>
                <input
                  id="visit-customer-address"
                  type="text"
                  value={draft.customer.address}
                  onChange={e =>
                    setDraft(prev => ({
                      ...prev,
                      customer: { ...prev.customer, address: e.target.value },
                    }))
                  }
                  placeholder="Rua, número e bairro para agilizar o roteiro técnico"
                  className="w-full h-11 px-3.5 rounded-[8px] bg-white border border-ink-200 focus:border-brand-500 focus:outline-none text-sm text-ink-900"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1 border-t border-ink-100">
                <div>
                  <label
                    htmlFor="visit-preferred-date"
                    className="block text-sm font-medium text-ink-900 mb-1.5"
                  >
                    Data preferencial <span className="text-ink-400 font-normal">(opcional)</span>
                  </label>
                  <div className="relative">
                    <Calendar
                      size={16}
                      strokeWidth={1.5}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400 pointer-events-none"
                    />
                    <input
                      id="visit-preferred-date"
                      type="date"
                      min={todayIso}
                      value={draft.customer.preferredDate}
                      onChange={e =>
                        setDraft(prev => ({
                          ...prev,
                          customer: { ...prev.customer, preferredDate: e.target.value },
                        }))
                      }
                      className="w-full h-11 pl-9 pr-3.5 rounded-[8px] bg-white border border-ink-200 focus:border-brand-500 focus:outline-none text-sm text-ink-900 tabular-nums"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="visit-preferred-period"
                    className="block text-sm font-medium text-ink-900 mb-1.5"
                  >
                    Turno preferencial
                  </label>
                  <select
                    id="visit-preferred-period"
                    value={draft.customer.preferredPeriod}
                    onChange={e =>
                      setDraft(prev => ({
                        ...prev,
                        customer: {
                          ...prev.customer,
                          preferredPeriod: e.target.value as ServiceVisitPeriod,
                        },
                      }))
                    }
                    className="w-full h-11 px-3 rounded-[8px] bg-white border border-ink-200 focus:border-brand-500 focus:outline-none text-sm text-ink-900"
                  >
                    {VISIT_PERIOD_OPTIONS.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </form>
          )}

          {/* STEP 4: Confirmation & WhatsApp Dispatch */}
          {step === 4 && result && (
            <div className="space-y-4">
              <div className="flex items-start gap-3.5 p-4 rounded-[12px] bg-emerald-50 border border-emerald-200">
                <CheckCircle2
                  size={22}
                  strokeWidth={1.75}
                  className="text-emerald-700 shrink-0 mt-0.5"
                />
                <div className="space-y-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-semibold text-emerald-950">
                      {result.savedToDatabase
                        ? 'Solicitação registrada no sistema Refrimaq'
                        : 'Triagem técnica pronta para envio'}
                    </p>
                    <span className="font-mono text-xs px-2 py-0.5 rounded-[5px] bg-white border border-emerald-300 text-emerald-900 tabular-nums">
                      {result.protocolCode}
                    </span>
                  </div>
                  <p className="text-xs text-emerald-800 leading-relaxed">
                    {result.savedToDatabase
                      ? 'Nossa equipe técnica já recebeu seus dados. Clique abaixo para confirmar pelo WhatsApp e agilizar o horário da visita.'
                      : result.warning ??
                        'Clique no botão abaixo para enviar a ficha completa direto para o WhatsApp técnico da Refrimaq.'}
                  </p>
                </div>
              </div>

              <div className="bg-ink-50 border border-ink-200 rounded-[12px] p-4 space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-xs text-ink-500">Resumo da triagem técnica</span>
                  <button
                    type="button"
                    onClick={handleCopySummary}
                    className="inline-flex items-center gap-1 text-xs font-medium text-ink-600 hover:text-brand-600 transition-colors"
                  >
                    {copiedSummary ? (
                      <>
                        <Check size={13} strokeWidth={2} />
                        Copiado
                      </>
                    ) : (
                      <>
                        <Copy size={13} strokeWidth={1.5} />
                        Copiar resumo
                      </>
                    )}
                  </button>
                </div>
                <pre className="whitespace-pre-wrap font-sans text-xs sm:text-[13px] text-ink-800 leading-relaxed bg-white border border-ink-200 rounded-[8px] p-3.5">
                  {result.summaryText}
                </pre>
              </div>

              <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
                <a
                  href={result.whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 h-12 px-5 rounded-[10px] bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium inline-flex items-center justify-center gap-2 transition-colors"
                >
                  <MessageCircle size={18} strokeWidth={1.75} />
                  Enviar confirmação no WhatsApp
                </a>
                <button
                  type="button"
                  onClick={handleResetNew}
                  className="h-12 px-4 rounded-[10px] bg-white hover:bg-ink-100 border border-ink-200 text-ink-700 text-sm font-medium transition-colors"
                >
                  Novo chamado
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Sticky Footer Navigation (Steps 2 & 3) */}
        {(step === 2 || step === 3) && (
          <div className="px-5 sm:px-6 py-4 bg-ink-50 border-t border-ink-200 flex items-center justify-between gap-3 shrink-0">
            <button
              type="button"
              onClick={() => {
                setErrorMsg(null);
                setStep(step === 3 ? 2 : 1);
              }}
              className="min-h-[44px] px-3.5 sm:px-4 py-2 rounded-[10px] bg-white hover:bg-ink-100 border border-ink-200 text-ink-700 text-sm font-medium inline-flex items-center gap-1.5 whitespace-nowrap transition-colors"
            >
              <ArrowLeft size={16} strokeWidth={1.5} />
              {step === 2 ? (
                <>
                  <span className="sm:hidden">Voltar</span>
                  <span className="hidden sm:inline">Trocar atividade</span>
                </>
              ) : (
                'Voltar'
              )}
            </button>

            {step === 2 ? (
              <button
                type="button"
                onClick={handleAdvanceFromStep2}
                className="min-h-[44px] px-4 sm:px-5 py-2 rounded-[10px] bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium inline-flex items-center gap-2 whitespace-nowrap transition-colors"
              >
                <span className="sm:hidden">Continuar</span>
                <span className="hidden sm:inline">Continuar para seus dados</span>
                <ArrowRight size={16} strokeWidth={1.75} />
              </button>
            ) : (
              <button
                type="submit"
                form="service-visit-customer-form"
                disabled={submitting}
                className="min-h-[44px] px-4 sm:px-5 py-2 rounded-[10px] bg-brand-500 hover:bg-brand-600 disabled:opacity-60 text-white text-sm font-medium inline-flex items-center gap-2 whitespace-nowrap transition-colors"
              >
                {submitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Registrando...
                  </>
                ) : (
                  <>
                    Agendar visita técnica
                    <ArrowRight size={16} strokeWidth={1.75} />
                  </>
                )}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
