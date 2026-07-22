import Link from 'next/link';
import { cars, type Car } from '@/lib/cars';

// 인기순: 모델별 그룹핑 → 판매실적 top6 → (인기배지) → 가격
const modelKey = (c: Car) => c.model.replace(/^더 뉴 |^The new |^더뉴 /, '').split(' ')[0];
const rank = (m: string) => {
  const r: Record<string, number> = {
    그랜저: 1, 쏘렌토: 2, 모델Y: 3, 셀토스: 4, 카니발: 5,
    스포티지: 6, 쏘나타: 7, 아반떼: 8, 팰리세이드: 9, 레이: 10,
  };
  return r[m] ?? 99;
};

const bestOf = (cs: Car[]) =>
  cs.sort((a, b) => {
    const badgeOrder: Record<string, number> = { '인기': 1, 'NEW': 2, '특가': 3 };
    const ao = badgeOrder[a.badge || ''] || 20;
    const bo = badgeOrder[b.badge || ''] || 20;
    if (ao !== bo) return ao - bo;
    return a.baseMonthlyPrice - b.baseMonthlyPrice;
  })[0];

// Deduplicate: one best car per model, sorted by popularity
const groups = new Map<string, Car[]>();
for (const c of cars) {
  const k = modelKey(c);
  if (!groups.has(k)) groups.set(k, []);
  groups.get(k)!.push(c);
}
const showcase = [...groups.entries()]
  .sort(([a], [b]) => rank(a) - rank(b))
  .map(([_, cs]) => bestOf(cs))
  .slice(0, 6);
// Filter same-model duplicates just in case
const display = showcase.filter((c, i) => showcase.findIndex(x => modelKey(x) === modelKey(c)) === i).slice(0, 6);

export default function CarShowcaseSection() {
  return (
    <section>
      <div className="section-padding">
        <div className="mx-auto max-w-5xl">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-extrabold text-primary md:text-3xl">인기 차량 한눈에 보기</h2>
              <p className="mt-1 text-sm text-text-muted">실시간 인기 차량의 예상 월 렌트료</p>
            </div>
            <Link href="/cars" className="btn-outline hidden md:inline-flex">전체 보기 →</Link>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {display.map((car) => <CarCard key={car.slug} car={car} />)}
          </div>

          <div className="mt-8 text-center md:hidden">
            <Link href="/cars" className="btn-outline">모든 차량 보기 →</Link>
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
      <Link href={`/cars/${car.slug}`} className="group block">
        <div className="relative aspect-[4/3] bg-surface-raised">
          <img src={car.image} alt={car.model} className="h-full w-full object-contain p-3 transition-transform group-hover:scale-105" />
          {car.badge && <span className={`absolute left-3 top-3 ${badge(car.badge)}`}>{car.badge}</span>}
        </div>
        <div className="p-4 pb-0">
          <h3 className="text-sm font-bold text-primary group-hover:text-accent transition-colors">{car.brand} {car.model}</h3>
          <p className="mt-0.5 text-xs text-text-muted">{car.trim}</p>
          <div className="mt-3 flex items-end justify-between">
            <p className="text-lg font-extrabold text-accent">월 {(car.baseMonthlyPrice / 10_000).toFixed(0)}만원</p>
            <span className="text-[0.6rem] text-text-muted">48개월·1만km</span>
          </div>
        </div>
      </Link>
      <div className="flex gap-2 border-t border-border p-3">
        <a href={`/?car=${car.slug}#consultation-form`} className="flex-1 rounded-lg bg-accent px-3 py-2 text-center text-xs font-bold text-white hover:bg-accent-glow transition-colors">⚡ 빠른 상담</a>
        <a href={`/cars/${car.slug}`} className="flex-1 rounded-lg bg-surface-raised px-3 py-2 text-center text-xs font-bold text-primary hover:bg-border transition-colors">📋 상세 보기</a>
      </div>
    </div>
  );
}

function badge(b: string): string {
  switch (b) { case '인기': return 'badge-hot'; case 'NEW': return 'badge-new'; case '특가': return 'badge-deal'; default: return ''; }
}
