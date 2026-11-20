import { ShieldCheck, Wrench, Compass, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { ServiceActivityType } from '../lib/serviceVisitEngine';

interface ServicesAndAboutProps {
  onOpenServiceVisit: (activity?: ServiceActivityType) => void;
}

const SERVICES: {
  code: string;
  activity: ServiceActivityType;
  icon: typeof ShieldCheck;
  title: string;
  ctaLabel: string;
  summary: string;
  bullets: string[];
}[] = [
  {
    code: '01',
    activity: 'sanitizacao',
    icon: ShieldCheck,
    title: 'Manutenção preventiva e sanitização',
    ctaLabel: 'Agendar sanitização',
    summary:
      'Preserva a qualidade sensorial do chopp e evita paradas inesperadas nos horários de pico.',
    bullets: [
      'Assepsia e sanitização completa de linhas, torneiras e serpentinas',
      'Análise térmica, elétrica e detecção precoce de falhas na operação',
    ],
  },
  {
    code: '02',
    activity: 'corretivo',
    icon: Wrench,
    title: 'Manutenção corretiva',
    ctaLabel: 'Abrir chamado corretivo',
    summary:
      'Diagnóstico técnico preciso e reparo com peças originais para restabelecer o desempenho de fábrica.',
    bullets: [
      'Reparos elétricos e troca de controladores de temperatura',
      'Sistema de refrigeração, carga de gás e revisão estrutural',
    ],
  },
  {
    code: '03',
    activity: 'projeto_instalacao',
    icon: Compass,
    title: 'Projetos e instalações',
    ctaLabel: 'Solicitar projeto / instalação',
    summary:
      'Dimensionamento completo de balcões, pré-resfriadores e sistemas de extração sob medida.',
    bullets: [
      'Estrutura técnica para bares, restaurantes, cervejarias e eventos',
      'Suporte técnico e fornecimento de peças específicas de reposição',
    ],
  },
];

export default function ServicesAndAbout({ onOpenServiceVisit }: ServicesAndAboutProps) {
  return (
    <>
      {/* Technical Services Section — Refrimaq's real operational differentiator */}
      <section id="servicos" className="bg-ink-950 text-white py-16 sm:py-20">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-10">
            <p className="font-mono text-xs text-ink-400">Serviços técnicos Refrimaq</p>
            <h2 className="text-2xl sm:text-[34px] leading-[1.15] font-medium text-white tracking-[-0.02em] mt-2">
              Assistência especializada para manter seu chopp na temperatura exata
            </h2>
            <p className="text-sm sm:text-base text-ink-400 mt-3 leading-relaxed">
              Equipe própria capacitada em refrigeração de chopp e pós-mix, atendendo bares,
              cervejarias, eventos e operações comerciais com agilidade e peças originais.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {SERVICES.map(srv => {
              const Icon = srv.icon;
              return (
                <div
                  key={srv.code}
                  className="bg-ink-900 border border-white/10 rounded-[14px] p-6 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-5">
                      <div className="w-10 h-10 rounded-[8px] bg-ink-800 border border-white/10 flex items-center justify-center">
                        <Icon size={18} strokeWidth={1.5} className="text-ink-200" />
                      </div>
                      <span className="font-mono text-xs text-ink-500 tabular-nums">{srv.code}</span>
                    </div>

                    <h3 className="text-lg font-medium text-white">{srv.title}</h3>
                    <p className="text-sm text-ink-400 mt-2 leading-relaxed">{srv.summary}</p>

                    <ul className="mt-5 space-y-2.5">
                      {srv.bullets.map(b => (
                        <li key={b} className="flex items-start gap-2.5 text-sm text-ink-200">
                          <CheckCircle2 size={16} strokeWidth={1.5} className="text-brand-500 shrink-0 mt-0.5" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-6 pt-5 border-t border-white/10">
                    <button
                      type="button"
                      onClick={() => onOpenServiceVisit(srv.activity)}
                      className="text-sm font-medium text-white hover:text-brand-100 inline-flex items-center gap-1.5 transition-colors"
                    >
                      {srv.ctaLabel}
                      <ArrowUpRight size={15} strokeWidth={1.5} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Authentic Institutional Section — Quem Somos (verbatim facts from refrimaqrs.com.br) */}
      <section id="quem-somos" className="bg-white border-b border-ink-200 py-16 sm:py-20">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
            <div className="lg:col-span-7 space-y-4">
              <p className="font-mono text-xs text-brand-600">Quem somos</p>
              <h2 className="text-2xl sm:text-[32px] leading-[1.15] font-medium text-ink-900 tracking-[-0.02em]">
                Especialistas em refrigeração para chopp e pós-mix no Rio Grande do Sul
              </h2>
              <p className="text-sm sm:text-base text-ink-600 leading-relaxed">
                A Refrimaq atua na prestação de serviços técnicos e no fornecimento de equipamentos
                de alta performance voltados ao setor de chopp e pós-mix. Representamos com
                exclusividade no Rio Grande do Sul a <strong>Memo</strong>, maior indústria da
                América Latina na fabricação de chopeiras elétricas e a gelo, torres de chopp,
                cervejeiras, pré-resfriadores e acessórios.
              </p>
              <p className="text-sm sm:text-base text-ink-600 leading-relaxed">
                Também somos representantes da <strong>Kegsbrasil</strong>, maior importador de
                barris de aço inox do Brasil, oferecendo suporte técnico especializado, foco em
                segurança operacional e redução de custos de manutenção para nossos clientes.
              </p>
            </div>

            <div className="lg:col-span-5 grid grid-cols-1 gap-4">
              <div className="bg-ink-50 border border-ink-200 rounded-[12px] p-5">
                <p className="font-mono text-xs text-ink-500">Parcerias oficiais</p>
                <div className="mt-3 grid grid-cols-2 gap-3">
                  <div className="bg-white border border-ink-200 rounded-[8px] p-3.5">
                    <p className="text-sm font-medium text-ink-900">Memo</p>
                    <p className="text-xs text-ink-500 mt-1">Representação exclusiva no RS</p>
                  </div>
                  <div className="bg-white border border-ink-200 rounded-[8px] p-3.5">
                    <p className="text-sm font-medium text-ink-900">Kegsbrasil</p>
                    <p className="text-xs text-ink-500 mt-1">Barris em aço inox 304</p>
                  </div>
                </div>
              </div>

              <div className="bg-ink-50 border border-ink-200 rounded-[12px] p-5 space-y-3">
                <div>
                  <p className="font-mono text-xs text-ink-500">Missão</p>
                  <p className="text-sm text-ink-700 mt-1 leading-relaxed">
                    Prestar aos nossos clientes atendimento rápido, confiável e com preço justo.
                  </p>
                </div>
                <div className="pt-3 border-t border-ink-200">
                  <p className="font-mono text-xs text-ink-500">Compromisso operacional</p>
                  <p className="text-sm text-ink-700 mt-1 leading-relaxed">
                    Atendimento próximo e transparente do dimensionamento do equipamento à
                    manutenção preventiva em campo.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
