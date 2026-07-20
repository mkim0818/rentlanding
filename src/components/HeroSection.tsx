import Link from 'next/link';
import { HERO } from '@/lib/constants';
import { cars } from '@/lib/cars';

function badgeClass(badge?: string): string {
  switch (badge) { case '인기': return 'badge-hot'; case 'NEW': return 'badge-new'; case '특가': return 'badge-deal'; default: return ''; }
}

export default function HeroSection() {
  // 인기 차량 3대를 실제 데이터에서 가져옴
  const topCars = cars
    .filter((c) => c.badge === '인기')
    .slice(0, 3);

  return (
    <section className="relative overflow-hidden bg-surface">
      <div className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, #1b2a4a 1px, transparent 1px),
            radial-gradient(circle at 80% 30%, #1b2a4a 1px, transparent 1px)`,
          backgroundSize: '60px 60px, 80px 80px',
        }}
      />

      <div className="relative z-10 section-padding pb-16 md:pb-20">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="animate-fade-up stagger-1 mb-5 text-3xl font-extrabold leading-[1.15] tracking-tight text-primary md:text-4xl lg:text-5xl">
            {HERO.headline}
          </h1>

          <p className="animate-fade-up stagger-2 mb-9 text-base text-text-secondary md:text-lg">
            {HERO.subheadline}
          </p>

          <div className="animate-fade-up stagger-3 mb-14">
            <a href="#consultation-form" className="btn-primary text-base px-10 py-4">
              무료 견적 상담 받기
            </a>
          </div>

          <div className="animate-fade-up stagger-4 mb-12 flex justify-center gap-10">
            {HERO.trustBadges.map((badge) => (
              <div key={badge.label} className="text-center">
                <p className="text-2xl font-extrabold text-accent md:text-3xl">{badge.value}</p>
                <p className="mt-1 text-xs font-medium text-text-muted uppercase tracking-wider">{badge.label}</p>
              </div>
            ))}
          </div>

          {/* 인기 차종 3종 - 실제 차량 데이터 사용 */}
          <div className="animate-fade-up stagger-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {topCars.map((car) => (
              <Link
                key={car.slug}
                href={`/cars/${car.slug}`}
                className="card group rounded-2xl p-4 text-left"
              >
                <div className="relative mb-3 flex h-32 items-center justify-center rounded-xl bg-surface-raised">
                  <img src={car.image} alt={`${car.brand} ${car.model}`} className="h-full w-full object-contain p-2" />
                  {car.badge && (
                    <span className={`absolute left-2 top-2 ${badgeClass(car.badge)}`}>
                      {car.badge}
                    </span>
                  )}
                </div>
                <h3 className="text-sm font-bold text-primary group-hover:text-accent transition-colors">
                  {car.brand} {car.model}
                </h3>
                <p className="mt-0.5 text-xs text-text-muted">{car.trim}</p>
                <p className="mt-2 text-lg font-extrabold text-accent">
                  월 {(car.baseMonthlyPrice / 10_000).toFixed(0)}만원
                </p>
                <p className="mt-0.5 text-[0.6rem] text-text-muted">
                  {car.year}년형 · {car.fuelType}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
