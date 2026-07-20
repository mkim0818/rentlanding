'use client';

import { useState } from 'react';
import { FAQ_ITEMS } from '@/lib/constants';
import CtaButton from './CtaButton';

export default function FAQSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const toggle = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section id="faq" className="bg-bg-light">
      <div className="section-padding">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-12 text-center text-2xl font-extrabold md:text-3xl">
            자주 묻는 질문
          </h2>

          <div className="space-y-3">
            {FAQ_ITEMS.map((item, idx) => (
              <div
                key={idx}
                className={`overflow-hidden rounded-xl border border-border bg-surface animate-fade-up stagger-${idx + 1}`}
              >
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className="flex w-full items-center justify-between px-6 py-4 text-left transition-colors hover:bg-bg-light"
                >
                  <span className="pr-4 text-sm font-bold text-primary md:text-base">
                    <span className="mr-2 text-primary">Q.</span>
                    {item.q}
                  </span>
                  <span
                    className={`flex-shrink-0 text-lg text-text-muted transition-transform duration-300 ${
                      openIdx === idx ? 'rotate-180' : ''
                    }`}
                  >
                    ▼
                  </span>
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    openIdx === idx ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="px-6 pb-4 pt-0">
                    <p className="text-sm leading-relaxed text-text-secondary md:text-base">
                      <span className="mr-2 font-bold text-primary">A.</span>
                      {item.a}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* FAQ 하단 CTA */}
          <div className="mt-10 text-center">
            <p className="mb-4 text-sm text-text-secondary">
              더 궁금한 점이 있으신가요? 아래 폼으로 문의해주세요.
            </p>
            <CtaButton />
          </div>
        </div>
      </div>
    </section>
  );
}
