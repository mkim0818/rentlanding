'use client';

import { useState } from 'react';
import Link from 'next/link';
import { type Car, type CarOption } from '@/lib/cars';
import PriceCalculator from './PriceCalculator';
import CarConsultationForm from './CarConsultationForm';

function fmtPrice(w: number) { return `${(w / 10_000).toFixed(0)}만원`; }
function fmtMonthly(w: number) { return `${(w / 10_000).toFixed(0)}만원`; }
function fmtBigPrice(w: number) {
  if (w >= 100_000_000) return `${(w / 100_000_000).toFixed(1)}억`;
  return `${Math.round(w / 10_000).toLocaleString()}만원`;
}
function badgeClass(b?: string | null) {
  if (!b) return '';
  switch (b) { case '인기': return 'badge-hot'; case 'NEW': return 'badge-new'; case '특가': return 'badge-deal'; default: return ''; }
}

const SPEC_LABELS: Record<string, string> = {
  displacement: '배기량', seats: '승차정원', fuelEfficiency: '연비',
  drivetrain: '구동방식', transmission: '변속기',
};
function fmtSpec(k: string, v: unknown) {
  if (k === 'displacement') return `${v}cc`;
  if (k === 'seats') return `${v}인승`;
  return String(v);
}

export default function CarDetailClient({ car }: { car: Car; idx: number; total: number }) {
  const [selectedTrim, setSelectedTrim] = useState(car.availableTrims[0] || null);
  const [selectedExColor, setSelectedExColor] = useState(car.exteriorColors[0] || null);
  const [selectedInColor, setSelectedInColor] = useState(car.interiorColors[0] || null);
  const [selectedOptionNames, setSelectedOptionNames] = useState<Set<string>>(new Set());

  const activeTrim = selectedTrim || car.availableTrims[0];
  const displayPrice = activeTrim?.price || car.carPrice;
  const displayOptions: CarOption[] = activeTrim?.options?.length ? activeTrim.options : car.options;

  const optionTotal = displayOptions
    .filter((o) => selectedOptionNames.has(o.name))
    .reduce((s, o) => s + o.price, 0);
  const colorTotal = (selectedExColor?.price || 0) + (selectedInColor?.price || 0);
  const totalPrice = displayPrice + optionTotal + colorTotal;
  const trimRatio = car.carPrice > 0 ? displayPrice / car.carPrice : 1;
  const extrasMonthly = (optionTotal + colorTotal) / 48;
  const baseMonthly = car.baseMonthlyPrice * trimRatio;
  const depositForCalc = Math.round((totalPrice * 30) / 100);
  const discountForCalc = depositForCalc * 0.00513;
  const estimatedMonthly = Math.max(0, Math.round((baseMonthly + extrasMonthly - discountForCalc) * 1.1));

  function toggleOption(name: string) {
    const next = new Set(selectedOptionNames);
    if (next.has(name)) next.delete(name);
    else next.add(name);
    setSelectedOptionNames(next);
  }

  function selectTrim(t: typeof activeTrim) {
    setSelectedTrim(t);
    setSelectedOptionNames(new Set()); // reset options when trim changes
  }

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-5xl px-5 py-8 md:px-8 md:py-12">
        <nav className="mb-6 flex items-center gap-2 text-xs text-text-muted">
          <Link href="/" className="hover:text-primary transition-colors">홈</Link>
          <span>/</span>
          <Link href="/cars" className="hover:text-primary transition-colors">차량 찾기</Link>
          <span>/</span>
          <span className="font-semibold text-primary">{car.brand} {car.model}</span>
        </nav>

        <div className="card rounded-2xl">
          <div className="flex flex-col gap-6 p-6 md:flex-row md:p-8">
            <div className="flex h-56 w-full items-center justify-center rounded-xl bg-surface-raised md:h-72 md:w-80 md:shrink-0">
              <img src={car.image} alt={`${car.brand} ${car.model}`} className="h-full w-full object-contain p-4" />
            </div>
            <div className="flex flex-1 flex-col justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-medium text-text-muted">{car.brand}</span>
                  {car.badge && <span className={badgeClass(car.badge)}>{car.badge}</span>}
                </div>
                <h1 className="mt-1 text-2xl font-extrabold text-primary md:text-3xl">{car.model}</h1>
                <p className="mt-1 text-base text-text-secondary">{activeTrim?.name || car.trim}</p>
                <p className="mt-0.5 text-xs text-text-muted">{car.year}년형 · {car.fuelType}</p>
                <div className="mt-5 rounded-xl border border-border bg-surface-raised p-5">
                  <div className="flex items-baseline gap-6">
                    <div>
                      <p className="text-[0.6rem] text-text-muted">차량가</p>
                      <p className="text-xl font-extrabold text-primary transition-all duration-300" key={totalPrice}>
                        {totalPrice.toLocaleString()}원
                      </p>
                      {(optionTotal + colorTotal) > 0 && (
                        <p className="text-[0.5rem] text-text-muted">
                          (기본 {displayPrice.toLocaleString()}원 + 옵션 {(optionTotal + colorTotal).toLocaleString()}원)
                        </p>
                      )}
                    </div>
                    <div>
                      <p className="text-[0.6rem] text-text-muted">예상 월 렌트료</p>
                      <p className="text-2xl font-extrabold text-accent transition-all duration-300" key={estimatedMonthly}>
                        월 {estimatedMonthly.toLocaleString()}원
                      </p>
                      <p className="text-[0.5rem] text-text-muted">48개월·1만km·보증금30%·부가세 포함</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Trim Selection ── */}
          {car.availableTrims.length > 1 && (
            <div className="border-t border-border px-6 py-5 md:px-8">
              <h2 className="mb-4 text-sm font-bold text-primary">트림 선택</h2>
              <div className="flex flex-wrap gap-2">
                {car.availableTrims.map((t) => (
                  <button
                    key={t.code}
                    onClick={() => selectTrim(t)}
                    className={`rounded-full px-4 py-2 text-xs font-medium transition-all ${
                      activeTrim?.code === t.code
                        ? 'bg-primary text-white'
                        : 'bg-surface border border-border text-text-secondary hover:border-primary/40'
                    }`}
                  >
                    {t.name} <span className="opacity-70 ml-1">{fmtBigPrice(t.price)}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── Specs ── */}
          <div className="border-t border-border px-6 py-5 md:px-8">
            <h2 className="mb-4 text-sm font-bold text-primary">차량 제원</h2>
            <dl className="grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-3 md:grid-cols-5">
              {Object.entries(car.specs).map(([key, value]) => (
                <div key={key}>
                  <dt className="text-[0.6rem] text-text-muted">{SPEC_LABELS[key] || key}</dt>
                  <dd className="text-sm font-semibold">{fmtSpec(key, value)}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* ── Exterior Colors ── */}
          {car.exteriorColors.length > 0 && (
            <div className="border-t border-border px-6 py-5 md:px-8">
              <h2 className="mb-4 text-sm font-bold text-primary">외장 컬러</h2>
              <div className="flex flex-wrap gap-3">
                {car.exteriorColors.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => setSelectedExColor(c)}
                    className={`flex flex-col items-center gap-1 rounded-xl p-2 transition-all ${
                      selectedExColor?.name === c.name
                        ? 'ring-2 ring-accent bg-surface-raised'
                        : 'bg-surface hover:bg-surface-raised'
                    }`}
                  >
                    {c.url ? (
                      <img src={c.url} alt={c.name} className="h-10 w-10 rounded-full border border-border object-cover" />
                    ) : (
                      <div className="h-10 w-10 rounded-full border border-border bg-surface" />
                    )}
                    <span className="text-[0.55rem] text-text-muted text-center max-w-[60px] truncate">{c.name}</span>
                    {c.price > 0 && <span className="text-[0.5rem] text-accent">+{c.price.toLocaleString()}</span>}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── Interior Colors ── */}
          {car.interiorColors.length > 0 && (
            <div className="border-t border-border px-6 py-5 md:px-8">
              <h2 className="mb-4 text-sm font-bold text-primary">내장 컬러</h2>
              <div className="flex flex-wrap gap-3">
                {car.interiorColors.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => setSelectedInColor(c)}
                    className={`rounded-xl px-4 py-2 text-xs font-medium transition-all ${
                      selectedInColor?.name === c.name
                        ? 'ring-2 ring-accent bg-surface-raised'
                        : 'bg-surface hover:bg-surface-raised'
                    }`}
                  >
                    {c.name}
                    {c.price > 0 && <span className="ml-1 text-accent">+{c.price.toLocaleString()}</span>}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── Selectable Options (only here, not duplicated) ── */}
          {displayOptions.length > 0 && (
            <div className="border-t border-border px-6 py-5 md:px-8">
              <h2 className="mb-4 text-sm font-bold text-primary">추가 옵션</h2>
              <div className="space-y-2">
                {displayOptions.map((opt) => {
                  const sel = selectedOptionNames.has(opt.name);
                  return (
                    <button
                      key={opt.name}
                      onClick={() => toggleOption(opt.name)}
                      className={`flex w-full items-center justify-between rounded-lg px-4 py-3 text-sm transition-all ${
                        sel
                          ? 'border-2 border-accent bg-accent/5'
                          : 'border border-border bg-surface-raised hover:bg-surface'
                      }`}
                    >
                      <span className={sel ? 'font-semibold' : ''}>{opt.name}</span>
                      <span className={`text-sm font-bold ${sel ? 'text-accent' : 'text-text-muted'}`}>
                        + {fmtBigPrice(opt.price)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Price Calculator — gets selectedOptions, doesn't render its own option UI */}
        <div className="mt-6">
          <PriceCalculator
            car={car}
            selectedTrim={activeTrim}
            selectedOptionNames={selectedOptionNames}
            trimOptions={displayOptions}
            selectedExColor={selectedExColor}
            selectedInColor={selectedInColor}
          />
        </div>

        <div id="car-consultation" className="mt-6 card rounded-2xl p-6 md:p-8">
          <h2 className="text-xl font-bold text-primary">이 차량으로 상담 신청</h2>
          <p className="mt-1 text-sm text-text-secondary">
            {car.brand} {car.model} {activeTrim?.name || car.trim}에 대한 맞춤 견적을 보내드립니다.
          </p>
          <div className="mt-6">
            <CarConsultationForm
              car={car}
              selectedTrim={activeTrim}
              selectedExColor={selectedExColor}
              selectedInColor={selectedInColor}
              selectedOptionNames={selectedOptionNames}
              allOptions={displayOptions}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
