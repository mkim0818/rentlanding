import { TRUST, COMPANY } from '@/lib/constants';

export default function TrustSection() {
  return (
    <section id="trust" className="bg-bg">
      <div className="section-padding">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-12 text-center text-2xl font-extrabold text-primary md:text-3xl">
            믿을 수 있는 렌터카 파트너
          </h2>

          {/* 제휴사 로고 (텍스트) */}
          <div className="animate-fade-up stagger-1 mb-10">
            <p className="mb-4 text-center text-sm text-text-muted">제휴 금융사</p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              {TRUST.partners.map((partner) => (
                <div
                  key={partner}
                  className="card rounded-xl px-5 py-3 text-sm font-bold text-text-secondary"
                >
                  {/* TODO: 실제 로고 이미지로 교체 */}
                  {partner}
                </div>
              ))}
            </div>
          </div>

          {/* 운영 정보 */}
          <div className="animate-fade-up stagger-2 mb-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {TRUST.badges.map((badge) => (
              <div
                key={badge.label}
                className="card rounded-2xl p-6 text-center"
              >
                <p className="text-2xl font-extrabold text-primary">{badge.value}</p>
                <p className="mt-1 text-sm text-text-muted">{badge.label}</p>
              </div>
            ))}
          </div>

          {/* 상담 가능 시간 */}
          <div className="animate-fade-up stagger-3 card rounded-2xl p-6 text-center">
            <p className="text-sm font-medium text-text-secondary">상담 가능 시간</p>
            <p className="mt-1 text-lg font-bold text-primary">{TRUST.counselingHours}</p>
            <p className="mt-2 text-sm text-text-secondary">
              전화 문의:{' '}
              <a href={`tel:${COMPANY.phone}`} className="font-bold text-primary underline">
                {COMPANY.phoneDisplay}
              </a>
            </p>
          </div>
        </div>
      </div>
      <div className="section-divider" />
    </section>
  );
}
