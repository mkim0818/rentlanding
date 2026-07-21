import Link from 'next/link';
import { HERO } from '@/lib/constants';
import { cars } from '@/lib/cars';

export default function HeroSection() {
  const topCars = cars.filter((c) => c.badge === '인기' || c.badge === 'NEW').slice(0, 4);

  return (
    <section className="relative border-b border-border bg-surface">
      <div className="mx-auto max-w-6xl px-5 py-16 md:px-10 md:py-28 lg:px-16">
        <div className="grid items-center gap-12 md:grid-cols-2 md:gap-16">
          {/* 왼쪽: 텍스트 */}
          <div>
            <h1 className="text-4xl font-extrabold leading-[1.08] tracking-tight text-primary md:text-5xl lg:text-6xl">
              장기렌트,<br />
              <span className="text-accent">무료 견적</span>으로<br />
              시작하세요
            </h1>
            <p className="mt-5 text-base leading-relaxed text-text-secondary md:text-lg">
              {HERO.subheadline}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a href="#consultation-form" className="btn-primary text-base px-10 py-4">
                무료 견적 상담 받기
              </a>
              <div className="flex items-center gap-6 border-l border-border pl-6">
                {HERO.trustBadges.map((b) => (
                  <div key={b.label}>
                    <p className="text-xl font-extrabold text-accent">{b.value}</p>
                    <p className="text-xs text-text-muted">{b.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 오른쪽: 차량 카드 스택 */}
          <div className="hidden md:block">
            <div className="space-y-3">
              {topCars.map((car, i) => (
                <Link
                  key={car.slug}
                  href={`/cars/${car.slug}`}
                  className={`group flex items-center gap-4 rounded-2xl border border-border bg-surface p-4 transition-all hover:border-accent hover:shadow-md ${
                    i === 0 ? 'ring-2 ring-accent/20' : ''
                  }`}
                >
                  <div className="flex h-20 w-28 shrink-0 items-center justify-center rounded-xl bg-surface-raised">
                    <img src={car.image} alt={car.model} className="h-full w-full object-contain p-2" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-text-muted">{car.brand}</p>
                    <p className="text-base font-bold text-primary truncate">{car.model}</p>
                    <p className="text-xs text-text-muted truncate">{car.trim}</p>
                    <p className="mt-1 text-lg font-extrabold text-accent">
                      월 {(car.baseMonthlyPrice / 10_000).toFixed(0)}만원
                    </p>
                  </div>
                  <span className="text-text-muted group-hover:text-accent group-hover:translate-x-1 transition-all text-xl">→</span>
                </Link>
              ))}
            </div>
          </div>

          {/* 모바일: 가로 스크롤 */}
          <div className="-mr-5 flex gap-3 overflow-x-auto pb-2 md:hidden">
            {topCars.map((car) => (
              <Link key={car.slug} href={`/cars/${car.slug}`}
                className="w-44 shrink-0 rounded-xl border border-border bg-surface p-3">
                <div className="mb-2 flex h-24 items-center justify-center rounded-lg bg-surface-raised">
                  <img src={car.image} alt={car.model} className="h-full w-full object-contain p-2" />
                </div>
                <p className="text-sm font-bold text-primary">{car.model}</p>
                <p className="text-lg font-extrabold text-accent">월 {(car.baseMonthlyPrice / 10_000).toFixed(0)}만원</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
