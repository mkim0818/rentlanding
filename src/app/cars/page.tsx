import Link from 'next/link';
import { cars, ALL_BRANDS, ALL_CAR_TYPES, ALL_FUEL_TYPES, PRICE_RANGES, SORT_OPTIONS, type Car, type SortOption } from '@/lib/cars';

// ── 헬퍼 ──────────────────────────────────────────
const FUEL_LABELS: Record<Car['fuelType'], string> = {
  가솔린: '가솔린',
  디젤: '디젤(경유)',
  LPG: 'LPG',
  하이브리드: '하이브리드',
  전기: '전기',
};

function badgeClass(badge?: string): string {
  switch (badge) {
    case '인기': return 'badge-hot';
    case 'NEW': return 'badge-new';
    case '특가': return 'badge-deal';
    default: return '';
  }
}

function formatPrice(won: number): string {
  if (won >= 100_000_000) return `${(won / 100_000_000).toFixed(1)}억`;
  const man = Math.round(won / 10_000);
  return `${man.toLocaleString()}만원`;
}

function formatMonthly(won: number): string {
  return `${(won / 10_000).toFixed(0)}만원`;
}

// ── CarCard ────────────────────────────────────────
function CarCard({ car }: { car: Car }) {
  return (
    <Link href={`/cars/${car.slug}`} className="card group rounded-2xl overflow-hidden">
      <div className="relative flex h-44 items-center justify-center bg-surface-raised">
        <img src={car.image} alt={`${car.brand} ${car.model}`} className="h-full w-full object-contain p-3" />
        {car.badge && (
          <span className={`absolute left-3 top-3 ${badgeClass(car.badge)}`}>
            {car.badge}
          </span>
        )}
      </div>
      <div className="p-4">
        <p className="text-[0.65rem] font-medium text-text-muted">{car.brand} / {car.fuelType}</p>
        <h3 className="mt-0.5 text-base font-bold text-primary group-hover:text-accent transition-colors">
          {car.model}
        </h3>
        <p className="text-xs text-text-muted">{car.trim}</p>
        <div className="mt-3 flex items-baseline justify-between border-t border-border pt-3">
          <div>
            <p className="text-[0.6rem] text-text-muted">차량가 {formatPrice(car.carPrice)}</p>
            <p className="text-lg font-extrabold text-accent">월 {formatMonthly(car.baseMonthlyPrice)}</p>
          </div>
          <span className="text-[0.6rem] text-text-muted">48개월·1만km</span>
        </div>
      </div>
    </Link>
  );
}

// ── 페이지 Props ─────────────────────────────────
interface Props {
  searchParams: Promise<{
    brand?: string; carType?: string; fuel?: string;
    price?: string; query?: string; sort?: string;
  }>;
}

export const metadata = {
  title: '차량 찾기 | ○○렌터카 장기렌트',
  description: '국산·수입차 장기렌트 차량을 비교하고, 월 렌트료를 확인하세요.',
};

export default async function CarsPage({ searchParams }: Props) {
  const params = await searchParams;
  const brand = params.brand || '';
  const carType = params.carType || '';
  const fuel = params.fuel || '';
  const price = params.price || '';
  const query = params.query || '';
  const sort = (params.sort || 'recommended') as SortOption;

  // ── 필터링 ──────────────────────────────────
  let filtered = cars;
  if (brand) filtered = filtered.filter((c) => c.brand === brand);
  if (carType) filtered = filtered.filter((c) => c.carType === carType);
  if (fuel) filtered = filtered.filter((c) => c.fuelType === fuel);
  if (price) {
    const range = PRICE_RANGES.find((r) => r.label === price);
    if (range && range.label !== '전체') {
      filtered = filtered.filter((c) => c.baseMonthlyPrice >= range.min && c.baseMonthlyPrice < range.max);
    }
  }
  if (query) {
    const q = query.toLowerCase();
    filtered = filtered.filter((c) =>
      c.model.toLowerCase().includes(q) || c.brand.toLowerCase().includes(q) || c.trim.toLowerCase().includes(q),
    );
  }

  // ── 정렬 ──────────────────────────────────
  switch (sort) {
    case 'price_asc': filtered.sort((a, b) => a.baseMonthlyPrice - b.baseMonthlyPrice); break;
    case 'price_desc': filtered.sort((a, b) => b.baseMonthlyPrice - a.baseMonthlyPrice); break;
    default:
      filtered.sort((a, b) => {
        const badgeOrder: Record<string, number> = { 인기: 1, NEW: 2, 특가: 3 };
        const ao = badgeOrder[a.badge || ''] || 4;
        const bo = badgeOrder[b.badge || ''] || 4;
        if (ao !== bo) return ao - bo;
        return a.baseMonthlyPrice - b.baseMonthlyPrice;
      });
  }

  const filterLink = (updates: Record<string, string | null>) => {
    const p = new URLSearchParams();
    const cur: Record<string, string> = { brand, carType, fuel, price, query, sort };
    Object.assign(cur, updates);
    for (const [k, v] of Object.entries(cur)) {
      if (v && !(k === 'sort' && v === 'recommended')) p.set(k, v);
    }
    const qs = p.toString();
    return `/cars${qs ? '?' + qs : ''}`;
  };

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-6xl px-5 py-10 md:px-8 md:py-14">
        {/* 헤더 */}
        <div className="mb-10">
          <h1 className="text-2xl font-extrabold text-primary md:text-3xl">차량 찾기</h1>
          <p className="mt-2 text-sm text-text-muted">{filtered.length}대의 차량</p>
        </div>

        {/* 검색 */}
        <form className="mb-8" role="search">
          <div className="relative max-w-sm">
            <input
              type="text" name="query" defaultValue={query}
              placeholder="차량명, 브랜드 검색"
              className="w-full rounded-xl border border-border bg-surface px-4 py-3 pl-10 text-sm text-text placeholder:text-text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10"
            />
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted text-sm">🔍</span>
            {brand && <input type="hidden" name="brand" value={brand} />}
            {carType && <input type="hidden" name="carType" value={carType} />}
            {fuel && <input type="hidden" name="fuel" value={fuel} />}
            {price && <input type="hidden" name="price" value={price} />}
            <input type="hidden" name="sort" value={sort} />
          </div>
        </form>

        {/* ── 필터 ───────────────────────────── */}
        <div className="mb-8 space-y-4">
          <FilterRow label="브랜드">
            <FC href={filterLink({ brand: null })} sel={!brand}>전체</FC>
            {ALL_BRANDS.map((b) => <FC key={b} href={filterLink({ brand: b })} sel={brand === b}>{b}</FC>)}
          </FilterRow>
          <FilterRow label="차종">
            <FC href={filterLink({ carType: null })} sel={!carType}>전체</FC>
            {ALL_CAR_TYPES.map((ct) => <FC key={ct} href={filterLink({ carType: ct })} sel={carType === ct}>{ct}</FC>)}
          </FilterRow>
          <FilterRow label="연료">
            <FC href={filterLink({ fuel: null })} sel={!fuel}>전체</FC>
            {ALL_FUEL_TYPES.map((ft) => <FC key={ft} href={filterLink({ fuel: ft })} sel={fuel === ft}>{FUEL_LABELS[ft]}</FC>)}
          </FilterRow>
          <FilterRow label="가격">
            {PRICE_RANGES.map((pr) => (
              <FC key={pr.label} href={filterLink({ price: pr.label === '전체' ? null : pr.label })} sel={price === pr.label || (!price && pr.label === '전체')}>{pr.label}</FC>
            ))}
          </FilterRow>
          <div className="flex items-center gap-2 pt-1">
            <span className="text-xs font-semibold text-text-muted w-10">정렬</span>
            {SORT_OPTIONS.map((so) => (
              <FC key={so.value} href={filterLink({ sort: so.value === 'recommended' ? null : so.value })} sel={sort === so.value} sm>{so.label}</FC>
            ))}
          </div>
        </div>

        {/* ── 차량 그리드 ─────────────────────── */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((car) => (
              <CarCard key={car.slug} car={car} />
            ))}
          </div>
        ) : (
          <div className="py-24 text-center">
            <p className="text-text-muted">조건에 맞는 차량이 없습니다.</p>
            <a href="/cars" className="mt-4 inline-block text-sm font-semibold text-primary underline">필터 초기화</a>
          </div>
        )}

        {/* 하단 CTA */}
        <div className="mt-16 card rounded-2xl p-10 text-center">
          <h2 className="text-xl font-bold text-primary">원하시는 차량이 없나요?</h2>
          <p className="mt-2 text-sm text-text-secondary">찾으시는 차량이나 조건을 알려주시면 맞춤 견적을 보내드립니다.</p>
          <a href="/#consultation-form" className="btn-primary mt-5 inline-flex">무료 견적 상담 받기</a>
        </div>
      </div>
    </div>
  );
}

// ── 서브 컴포넌트 ──────────────────────────────────
function FilterRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs font-semibold text-text-muted w-10">{label}</span>
      <div className="flex flex-wrap gap-1.5">{children}</div>
    </div>
  );
}

function FC({ href, sel, sm, children }: { href: string; sel: boolean; sm?: boolean; children: React.ReactNode }) {
  return (
    <a
      href={href}
      className={`inline-block rounded-full transition-all ${
        sm ? 'px-2.5 py-1 text-xs' : 'px-3.5 py-1.5 text-sm'
      } ${
        sel
          ? 'bg-primary text-white font-semibold'
          : 'bg-surface border border-border text-text-secondary hover:border-primary/40 hover:text-primary'
      }`}
    >
      {children}
    </a>
  );
}
