import Link from 'next/link';
import { cars, type Car } from '@/lib/cars';

function formatPrice(won: number): string {
  return `${Math.round(won / 10_000).toLocaleString()}만원`;
}

export default function CarShowcaseSection() {
  const showcase = cars
    .filter((c) => c.badge === '인기' || c.badge === 'NEW')
    .slice(0, 3);
  const others = cars
    .filter((c) => !showcase.includes(c))
    .sort((a, b) => a.baseMonthlyPrice - b.baseMonthlyPrice)
    .slice(0, 3);
  const display = [...showcase, ...others].slice(0, 6);

  return (
    <section className="bg-bg">
      <div className="section-padding">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-2 text-center text-2xl font-extrabold text-primary md:text-3xl">
            인기 차량 한눈에 보기
          </h2>
          <p className="mb-10 text-center text-sm text-text-muted">
            실시간 인기 차량의 예상 월 렌트료를 확인하세요
          </p>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {display.map((car) => (
              <CarCard key={car.slug} car={car} />
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link href="/cars" className="btn-outline">
              모든 차량 보기 →
            </Link>
          </div>
        </div>
      </div>
      <div className="section-divider" />
    </section>
  );
}

function CarCard({ car }: { car: Car }) {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-border bg-surface transition-shadow hover:shadow-lg">
      {/* 상단: 이미지 + 클릭 시 상세 페이지 */}
      <Link href={`/cars/${car.slug}`} className="group block">
        <div className="relative aspect-[4/3] bg-surface-raised">
          <img
            src={car.image}
            alt={`${car.brand} ${car.model}`}
            className="h-full w-full object-contain p-3 transition-transform group-hover:scale-105"
          />
          {car.badge && (
            <span className={badgeStyle(car.badge)}>
              {car.badge}
            </span>
          )}
        </div>
        <div className="p-4 pb-0">
          <h3 className="text-sm font-bold text-primary group-hover:text-accent transition-colors">
            {car.brand} {car.model}
          </h3>
          <p className="mt-0.5 text-xs text-text-muted">{car.trim}</p>
          <div className="mt-3 flex items-end justify-between">
            <div>
              <p className="text-[0.65rem] text-text-muted">차량가 {formatPrice(car.carPrice)}</p>
              <p className="text-lg font-extrabold text-accent">
                월 {(car.baseMonthlyPrice / 10_000).toFixed(0)}만원
              </p>
            </div>
            <span className="text-[0.6rem] text-text-muted">48개월·1만km</span>
          </div>
        </div>
      </Link>

      {/* 하단: 두 가지 상담 버튼 */}
      <div className="flex gap-2 border-t border-border p-3">
        <a
          href={`#consultation-form`}
          className="flex-1 rounded-lg bg-accent px-3 py-2.5 text-center text-xs font-bold text-white transition-colors hover:bg-accent-glow"
        >
          ⚡ 빠른 상담
        </a>
        <a
          href={`/cars/${car.slug}#car-consultation`}
          className="flex-1 rounded-lg bg-surface-raised px-3 py-2.5 text-center text-xs font-bold text-primary transition-colors hover:bg-border"
        >
          📋 상세 견적
        </a>
      </div>
    </div>
  );
}

function badgeStyle(badge: string): string {
  const base = 'absolute left-3 top-3 rounded-md px-2 py-0.5 text-[0.65rem] font-extrabold tracking-wide text-white';
  switch (badge) {
    case '인기': return `${base} bg-accent`;
    case 'NEW': return `${base} bg-primary`;
    case '특가': return `${base} bg-amber-500`;
    default: return base;
  }
}
