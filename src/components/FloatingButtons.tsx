'use client';

import { COMPANY, CTA } from '@/lib/constants';

export default function FloatingButtons() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 flex border-t border-border bg-surface shadow-[0_-4px_20px_rgba(0,0,0,0.08)] md:hidden">
      <a
        href={`tel:${COMPANY.phone}`}
        className="flex flex-1 items-center justify-center gap-1.5 py-3.5 text-sm font-bold text-primary"
      >
        <span>📞</span>
        전화 상담
      </a>
      <a
        href="#consultation-form"
        className="flex flex-1 items-center justify-center gap-1.5 py-3.5 text-sm font-bold text-white bg-accent"
      >
        <span>⚡</span>
        빠른 상담
      </a>
    </div>
  );
}
