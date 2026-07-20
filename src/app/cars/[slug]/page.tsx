import { notFound } from 'next/navigation';
import Link from 'next/link';
import { cars, type Car } from '@/lib/cars';
import PriceCalculator from './PriceCalculator';
import CarConsultationForm from './CarConsultationForm';

export function generateStaticParams() {
  return cars.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const car = cars.find((c) => c.slug === slug);
  if (!car) return {};
  return {
    title: `${car.brand} ${car.model} ${car.trim} | ○○렌터카`,
    description: `${car.brand} ${car.model} 장기렌트 월 ${Math.round(car.baseMonthlyPrice / 10_000)}만원. 차량가 ${Math.round(car.carPrice / 10_000).toLocaleString()}만원.`,
  };
}

function formatPrice(won: number): string {
  return `${Math.round(won / 10_000).toLocaleString()}만원`;
}
function formatMonthly(won: number): string {
  return `${(won / 10_000).toFixed(0)}만원`;
}
function badgeClass(badge?: string): string {
  switch (badge) { case '인기': return 'badge-hot'; case 'NEW': return 'badge-new'; case '특가': return 'badge-deal'; default: return ''; }
}

const SPEC_LABELS: Record<string, string> = {
  displacement: '배기량', seats: '승차정원', fuelEfficiency: '연비',
  drivetrain: '구동방식', transmission: '변속기',
};
function formatSpecValue(key: string, value: unknown): string {
  if (key === 'displacement') return `${value}cc`;
  if (key === 'seats') return `${value}인승`;
  return String(value);
}

export default async function CarDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const car = cars.find((c) => c.slug === slug);
  if (!car) notFound();

  const idx = cars.indexOf(car);
  const prevCar = idx > 0 ? cars[idx - 1] : null;
  const nextCar = idx < cars.length - 1 ? cars[idx + 1] : null;

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-5xl px-5 py-8 md:px-8 md:py-12">
        {/* 브레드크럼 */}
        <nav className="mb-6 flex items-center gap-2 text-xs text-text-muted">
          <Link href="/" className="hover:text-primary transition-colors">홈</Link>
          <span>/</span>
          <Link href="/cars" className="hover:text-primary transition-colors">차량 찾기</Link>
          <span>/</span>
          <span className="font-semibold text-primary">{car.brand} {car.model}</span>
        </nav>

        {/* 차량 헤더 카드 */}
        <div className="card rounded-2xl">
          <div className="flex flex-col gap-6 p-6 md:flex-row md:p-8">
            {/* 이미지 */}
            <div className="flex h-56 w-full items-center justify-center rounded-xl bg-surface-raised md:h-72 md:w-80 md:shrink-0">
              <img src={car.image} alt={`${car.brand} ${car.model}`} className="h-full w-full object-contain p-4" />
            </div>

            {/* 정보 */}
            <div className="flex flex-1 flex-col justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-medium text-text-muted">{car.brand}</span>
                  {car.badge && <span className={badgeClass(car.badge)}>{car.badge}</span>}
                </div>
                <h1 className="mt-1 text-2xl font-extrabold text-primary md:text-3xl">{car.model}</h1>
                <p className="mt-1 text-base text-text-secondary">{car.trim}</p>
                <p className="mt-0.5 text-xs text-text-muted">{car.year}년형 · {car.fuelType}</p>

                {/* 가격 */}
                <div className="mt-5 rounded-xl border border-border bg-surface-raised p-5">
                  <div className="flex items-baseline gap-6">
                    <div>
                      <p className="text-[0.6rem] text-text-muted">차량가</p>
                      <p className="text-xl font-extrabold text-primary">{formatPrice(car.carPrice)}</p>
                    </div>
                    <div>
                      <p className="text-[0.6rem] text-text-muted">기준 월 렌트료 (48개월·1만km)</p>
                      <p className="text-2xl font-extrabold text-accent">월 {formatMonthly(car.baseMonthlyPrice)}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 이전/다음 */}
              <div className="mt-4 flex justify-between text-xs">
                {prevCar ? (
                  <Link href={`/cars/${prevCar.slug}`} className="text-text-muted hover:text-primary transition-colors">
                    ← {prevCar.brand} {prevCar.model}
                  </Link>
                ) : <span />}
                {nextCar && (
                  <Link href={`/cars/${nextCar.slug}`} className="text-text-muted hover:text-primary transition-colors">
                    {nextCar.brand} {nextCar.model} →
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* 제원 */}
          <div className="border-t border-border px-6 py-5 md:px-8">
            <h2 className="mb-4 text-sm font-bold text-primary">차량 제원</h2>
            <dl className="grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-3 md:grid-cols-5">
              {Object.entries(car.specs).map(([key, value]) => (
                <div key={key}>
                  <dt className="text-[0.6rem] text-text-muted">{SPEC_LABELS[key] || key}</dt>
                  <dd className="text-sm font-semibold">{formatSpecValue(key, value)}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* 옵션 */}
          {car.options.length > 0 && (
            <div className="border-t border-border px-6 py-5 md:px-8">
              <h2 className="mb-4 text-sm font-bold text-primary">추가 옵션</h2>
              <ul className="space-y-2">
                {car.options.map((opt) => (
                  <li key={opt.name} className="flex items-center justify-between rounded-lg bg-surface-raised px-4 py-3">
                    <span className="text-sm">{opt.name}</span>
                    <span className="text-sm font-bold text-accent">+ {formatPrice(opt.price)}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* 견적 계산기 */}
        <div className="mt-6">
          <PriceCalculator car={car} />
        </div>

        {/* 상담 신청 */}
        <div id="car-consultation" className="mt-6 card rounded-2xl p-6 md:p-8">
          <h2 className="text-xl font-bold text-primary">이 차량으로 상담 신청</h2>
          <p className="mt-1 text-sm text-text-secondary">
            {car.brand} {car.model} {car.trim}에 대한 맞춤 견적을 보내드립니다.
          </p>
          <div className="mt-6">
            <CarConsultationForm car={car} />
          </div>
        </div>
      </div>
    </div>
  );
}
