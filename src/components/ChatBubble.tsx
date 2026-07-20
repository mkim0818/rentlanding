'use client';

import { useState, useEffect } from 'react';
import { COMPANY } from '@/lib/constants';

export default function ChatBubble() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* 채널톡 스타일 플로팅 버튼 */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-accent text-white shadow-lg shadow-accent/30 transition-all hover:scale-110 hover:shadow-xl md:bottom-8 md:right-6 md:h-16 md:w-16"
        aria-label="상담 채팅 열기"
      >
        {open ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
        ) : (
          <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/></svg>
        )}
      </button>

      {/* 채팅 팝업 */}
      {open && (
        <div className="fixed bottom-24 right-4 z-50 w-80 overflow-hidden rounded-2xl bg-surface shadow-2xl ring-1 ring-border md:bottom-28 md:right-6">
          {/* 헤더 */}
          <div className="bg-primary px-5 py-4">
            <p className="text-sm font-bold text-white">{COMPANY.name}</p>
            <p className="mt-0.5 text-xs text-white/80">무료 견적 상담</p>
          </div>
          {/* 본문 */}
          <div className="space-y-3 p-5">
            <p className="text-sm text-text-secondary">
              안녕하세요! 👋<br />
              장기렌트 견적 상담을 도와드리겠습니다.<br />
              어떤 차량을 찾으시나요?
            </p>
            <a
              href="/cars"
              onClick={() => setOpen(false)}
              className="block w-full rounded-xl border border-primary px-4 py-3 text-center text-sm font-bold text-primary hover:bg-primary hover:text-white transition-colors"
            >
              🚗 차량 둘러보기
            </a>
            <a
              href="#consultation-form"
              onClick={() => setOpen(false)}
              className="btn-primary block w-full text-center text-sm"
            >
              ⚡ 빠른 상담 신청
            </a>
            <a
              href={`tel:${COMPANY.phone}`}
              className="block w-full rounded-xl bg-surface-raised px-4 py-3 text-center text-sm font-bold text-text-secondary hover:bg-border transition-colors"
            >
              📞 전화 상담 {COMPANY.phoneDisplay}
            </a>
          </div>
        </div>
      )}
    </>
  );
}
