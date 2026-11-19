import { useState } from 'react';
import { PhoneCall, Mail, MapPin, Send, Check } from 'lucide-react';
import {
  CategoryId,
  REFRIMAQ_CNPJ,
  REFRIMAQ_EMAIL,
  REFRIMAQ_WHATSAPP_PRIMARY,
  REFRIMAQ_WHATSAPP_SECONDARY,
} from '../lib/quoteEngine';
import { CATEGORIES } from '../data/catalog';

interface FooterProps {
  onSelectCategory: (cat: CategoryId) => void;
  onGoSection: (sectionId: string) => void;
}

export default function Footer({ onSelectCategory, onGoSection }: FooterProps) {
  const [leadName, setLeadName] = useState('');
  const [leadContact, setLeadContact] = useState('');
  const [submitted, setSubmitted] = useState(false);

  function handleLeadSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!leadName.trim() || !leadContact.trim()) return;
    const msg = `Olá, Refrimaq. Meu nome é ${leadName.trim()} (${leadContact.trim()}) e gostaria de receber novidades e tabela comercial.`;
    window.open(
      `https://wa.me/${REFRIMAQ_WHATSAPP_PRIMARY}?text=${encodeURIComponent(msg)}`,
      '_blank',
      'noopener,noreferrer'
    );
    setSubmitted(true);
    setLeadName('');
    setLeadContact('');
    setTimeout(() => setSubmitted(false), 3000);
  }

  return (
    <footer id="contato">
      {/* Direct Quote / Newsletter Capture Strip — Refrimaq Cobalt Accent (Lojas Memo rhythm) */}
      <div className="bg-brand-500 text-white">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <h2 className="text-lg sm:text-xl font-medium text-white">
              Receba tabela comercial e lançamentos
            </h2>
            <p className="text-sm text-white/80 mt-0.5">
              Fale direto com a equipe comercial Refrimaq pelo WhatsApp ou e-mail
            </p>
          </div>

          <form
            onSubmit={handleLeadSubmit}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full lg:w-auto"
          >
            <input
              type="text"
              required
              value={leadName}
              onChange={e => setLeadName(e.target.value)}
              placeholder="Nome ou empresa"
              className="h-11 px-3.5 rounded-[8px] bg-white text-ink-900 placeholder:text-ink-500 text-sm focus:outline-none sm:w-52"
            />
            <input
              type="text"
              required
              value={leadContact}
              onChange={e => setLeadContact(e.target.value)}
              placeholder="WhatsApp ou e-mail"
              className="h-11 px-3.5 rounded-[8px] bg-white text-ink-900 placeholder:text-ink-500 text-sm focus:outline-none sm:w-56"
            />
            <button
              type="submit"
              className="h-11 px-5 rounded-[8px] bg-ink-950 hover:bg-ink-900 text-white text-sm font-medium inline-flex items-center justify-center gap-2 transition-colors shrink-0"
            >
              {submitted ? <Check size={15} strokeWidth={1.75} /> : <Send size={15} strokeWidth={1.5} />}
              {submitted ? 'Abrindo WhatsApp' : 'Solicitar'}
            </button>
          </form>
        </div>
      </div>

      {/* Main 5-Column Store Footer */}
      <div className="bg-white border-t border-ink-200">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
            {/* Brand Column */}
            <div className="space-y-4">
              <img
                src="/media/logo-dark.svg"
                alt="Refrimaq Refrigeração"
                className="h-12 w-auto object-contain"
              />
              <p className="text-xs text-ink-500 leading-relaxed">
                Soluções em refrigeração para chopp e pós-mix. Representante exclusiva Memo no RS e
                representante Kegsbrasil.
              </p>
              <p className="font-mono text-xs text-ink-500 tabular-nums">
                CNPJ {REFRIMAQ_CNPJ}
              </p>
            </div>

            {/* Categories */}
            <div>
              <h3 className="text-sm font-medium text-ink-900 mb-3">Categorias</h3>
              <ul className="space-y-2 text-sm text-ink-600">
                {CATEGORIES.map(cat => (
                  <li key={cat.id}>
                    <button
                      type="button"
                      onClick={() => onSelectCategory(cat.id)}
                      className="hover:text-brand-600 transition-colors text-left"
                    >
                      {cat.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Institutional */}
            <div>
              <h3 className="text-sm font-medium text-ink-900 mb-3">Institucional</h3>
              <ul className="space-y-2 text-sm text-ink-600">
                <li>
                  <button
                    type="button"
                    onClick={() => onGoSection('quem-somos')}
                    className="hover:text-brand-600 transition-colors"
                  >
                    Quem somos
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => onGoSection('servicos')}
                    className="hover:text-brand-600 transition-colors"
                  >
                    Manutenção preventiva
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => onGoSection('servicos')}
                    className="hover:text-brand-600 transition-colors"
                  >
                    Manutenção corretiva
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => onGoSection('servicos')}
                    className="hover:text-brand-600 transition-colors"
                  >
                    Projetos e instalações
                  </button>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-sm font-medium text-ink-900 mb-3">Atendimento</h3>
              <ul className="space-y-2.5 text-sm text-ink-600">
                <li>
                  <a
                    href={`https://wa.me/${REFRIMAQ_WHATSAPP_PRIMARY}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 hover:text-brand-600 tabular-nums transition-colors"
                  >
                    <PhoneCall size={15} strokeWidth={1.5} className="text-ink-400 shrink-0" />
                    (51) 98574-7069
                  </a>
                </li>
                <li>
                  <a
                    href={`https://wa.me/${REFRIMAQ_WHATSAPP_SECONDARY}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 hover:text-brand-600 tabular-nums transition-colors"
                  >
                    <PhoneCall size={15} strokeWidth={1.5} className="text-ink-400 shrink-0" />
                    (51) 99160-4815
                  </a>
                </li>
                <li>
                  <a
                    href={`mailto:${REFRIMAQ_EMAIL}`}
                    className="inline-flex items-center gap-2 hover:text-brand-600 transition-colors break-all"
                  >
                    <Mail size={15} strokeWidth={1.5} className="text-ink-400 shrink-0" />
                    {REFRIMAQ_EMAIL}
                  </a>
                </li>
                <li className="inline-flex items-start gap-2 text-xs text-ink-500 pt-1">
                  <MapPin size={15} strokeWidth={1.5} className="text-ink-400 shrink-0 mt-0.5" />
                  <span>Rio Grande do Sul · Envio para todo o Brasil</span>
                </li>
              </ul>
            </div>

            {/* Social */}
            <div>
              <h3 className="text-sm font-medium text-ink-900 mb-3">Acompanhe</h3>
              <ul className="space-y-2 text-sm text-ink-600">
                <li>
                  <a
                    href="https://www.instagram.com/refrimaqrs/"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-brand-600 transition-colors"
                  >
                    Instagram (@refrimaqrs)
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.facebook.com/profile.php?id=100091861432609&mibextid=ZbWKwL"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-brand-600 transition-colors"
                  >
                    Facebook Refrimaq
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.youtube.com/channel/UC1DuCq-G02QjNX2gZFT1F0A"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-brand-600 transition-colors"
                  >
                    YouTube Refrimaq
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-10 pt-6 border-t border-ink-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-ink-500">
            <p>© {new Date().getFullYear()} Refrimaq Refrigeração · Todos os direitos reservados</p>
            <p>Loja online · Parcelamento em até 10x sem juros · Entrega nacional</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
