import { Suspense } from 'react';

import HeroSection from '@/components/HeroSection';
import BenefitsSection from '@/components/BenefitsSection';
import CarShowcaseSection from '@/components/CarShowcaseSection';
import RentalVsLeaseSection from '@/components/RentalVsLeaseSection';
import ProcessSection from '@/components/ProcessSection';
import ConsultationForm from '@/components/ConsultationForm';
import TrustSection from '@/components/TrustSection';
import FAQSection from '@/components/FAQSection';
import CtaButton from '@/components/CtaButton';
import FloatingButtons from '@/components/FloatingButtons';
import { COMPANY, CTA } from '@/lib/constants';
import type { Metadata } from 'next';
import Script from 'next/script';

export const metadata: Metadata = {
  title: '○○렌터카 | 국산·수입차 장기렌트 무료 견적 상담',
  description:
    '월 28만원대부터, 초기비용 ZERO. 보험·세금·정비 모두 포함된 장기렌트. 무료 견적 상담으로 최적의 조건을 찾아드립니다.',
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: COMPANY.name,
  telephone: COMPANY.phone,
  address: {
    '@type': 'PostalAddress',
    streetAddress: COMPANY.address,
    addressCountry: 'KR',
  },
  openingHours: 'Mo-Fr 09:00-18:00 Sa 09:00-14:00',
  description:
    '국산·수입차 장기렌트 전문. 월 28만원대부터, 초기비용 ZERO. 무료 견적 상담.',
};

export default function Home() {
  return (
    <>
      <Script
        id="json-ld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="flex-1">
        <HeroSection />
        <CarShowcaseSection />
        <BenefitsSection />

        {/* 인라인 CTA 배너 */}
        <section className="bg-primary">
          <div className="mx-auto max-w-3xl px-4 py-10 text-center md:px-8 md:py-14">
            <p className="mb-2 text-lg font-bold text-white md:text-xl">
              지금 상담 신청하면 맞춤 견적을 무료로 보내드립니다
            </p>
            <p className="mb-5 text-sm text-white/70">
              차량 선택부터 계약까지, 전문 상담사가 1:1로 도와드립니다
            </p>
            <a href="#consultation-form" className="inline-flex items-center gap-2 rounded-xl bg-accent px-8 py-3.5 text-base font-bold text-white shadow-lg shadow-accent/30 transition-all hover:-translate-y-0.5 hover:shadow-xl">
              ⚡ 무료 상담 신청하기
            </a>
          </div>
        </section>

        <RentalVsLeaseSection />
        <ProcessSection />
        <Suspense><ConsultationForm /></Suspense>
        <TrustSection />
        <FAQSection />

        {/* 페이지 하단 CTA */}
        {/* 하단 CTA */}
        <section className="bg-primary">
          <div className="section-padding pb-24 text-center md:pb-20">
            <h2 className="mb-3 text-xl font-bold text-white md:text-2xl">아직 고민 중이신가요?</h2>
            <p className="mb-6 text-sm text-white/70">
              부담 없이 상담부터 시작하세요. 맞춤 견적은 무료입니다.
            </p>
            <a href="#consultation-form" className="inline-flex items-center gap-2 rounded-xl bg-accent px-8 py-4 text-lg font-bold text-white shadow-lg shadow-accent/30 transition-all hover:-translate-y-0.5 hover:shadow-xl">
              ⚡ 무료 상담 신청하기
            </a>
            <p className="mt-6 text-sm text-white/60">
              전화 문의:{' '}
              <a href={`tel:${COMPANY.phone}`} className="font-bold text-white underline">
                {COMPANY.phoneDisplay}
              </a>
            </p>
          </div>
        </section>
      </main>

      <FloatingButtons />
    </>
  );
}
