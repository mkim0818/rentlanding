'use client';

import { useState, useEffect } from 'react';

export default function StickyCtaBar() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div
      className={`fixed left-0 right-0 z-40 transition-all duration-300 ${
        visible
          ? 'bottom-0 translate-y-0 opacity-100 md:bottom-0'
          : 'translate-y-full opacity-0'
      }`}
    >
      <div className="border-t border-border bg-surface px-4 py-3 shadow-lg md:hidden">
        <a
          href="#consultation-form"
          className="btn-primary flex w-full items-center justify-center gap-2 text-sm"
        >
          ⚡ 지금 바로 무료 상담 신청하기
        </a>
      </div>

      {/* 데스크탑: 작은 하단 배너 */}
      <div className="hidden md:block">
        <div className="mx-auto flex max-w-5xl items-center justify-between rounded-t-2xl border border-b-0 border-border bg-surface px-6 py-3 shadow-lg">
          <p className="text-sm font-bold text-primary">
            아직 고민 중이신가요? 😊 부담 없이 상담부터 시작하세요!
          </p>
          <a href="#consultation-form" className="btn-primary text-sm px-6 py-2">
            무료 상담 신청
          </a>
        </div>
      </div>
    </div>
  );
}
