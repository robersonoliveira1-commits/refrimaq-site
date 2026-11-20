import { CreditCard, Truck, ShieldCheck, Wrench, Award } from 'lucide-react';

const BENEFITS = [
  {
    icon: CreditCard,
    title: 'Até 10x sem juros',
    subtitle: 'Condições facilitadas para empresas e residências',
  },
  {
    icon: Truck,
    title: 'Entrega para todo o Brasil',
    subtitle: 'Logística dedicada no RS e envio nacional',
  },
  {
    icon: Award,
    title: 'Representante Memo RS',
    subtitle: 'Linha oficial exclusiva no Rio Grande do Sul',
  },
  {
    icon: ShieldCheck,
    title: 'Peças originais Memo',
    subtitle: 'Reposição oficial com garantia e procedência',
  },
  {
    icon: Wrench,
    title: 'Assistência técnica',
    subtitle: 'Assepsia, preventiva, corretiva e peças originais',
  },
];

export default function TrustBar() {
  return (
    <section aria-label="Diferenciais Refrimaq" className="bg-ink-100 border-y border-ink-200">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {BENEFITS.map(item => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-[8px] bg-white border border-ink-200 flex items-center justify-center shrink-0">
                  <Icon size={18} strokeWidth={1.5} className="text-ink-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-ink-900 leading-snug">{item.title}</p>
                  <p className="text-xs text-ink-500 mt-0.5 leading-snug">{item.subtitle}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
