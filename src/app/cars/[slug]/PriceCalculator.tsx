'use client';

import { useState, useMemo } from 'react';
import type { Car, TrimOption, CarOption, ColorOption } from '@/lib/cars';

function fmtPrice(w: number) { return `${Math.round(w / 10_000).toLocaleString()}만원`; }
function fmtMonthly(w: number) {
  const man = Math.floor(w / 10_000);
  const chun = Math.round((w % 10_000) / 1_000);
  return chun > 0 ? `${man.toLocaleString()}만 ${chun}천원` : `${man.toLocaleString()}만원`;
}

const MILEAGES = [10_000, 15_000, 20_000, 25_000, 30_000, 35_000, 40_000];

function mileageMult(km: number) {
  if (km <= 10_000) return 1.0;
  if (km <= 15_000) return 1.05;
  if (km <= 20_000) return 1.10;
  if (km <= 25_000) return 1.16;
  if (km <= 30_000) return 1.22;
  if (km <= 35_000) return 1.28;
  return 1.35;
}

const TERM = 48;
const DEPOSIT_RATE = 30;

export default function PriceCalculator({
  car, selectedTrim, selectedOptionNames, trimOptions,
  selectedExColor, selectedInColor,
}: {
  car: Car;
  selectedTrim: TrimOption | null;
  selectedOptionNames: Set<string>;
  trimOptions: CarOption[];
  selectedExColor: ColorOption | null;
  selectedInColor: ColorOption | null;
}) {
  const displayPrice = selectedTrim?.price || car.carPrice;
  const [mileage, setMileage] = useState(10_000);

  const optionTotal = trimOptions
    .filter((o) => selectedOptionNames.has(o.name))
    .reduce((s, o) => s + o.price, 0);
  const colorTotal = (selectedExColor?.price || 0) + (selectedInColor?.price || 0);
  const extrasTotal = optionTotal + colorTotal;
  const totalPrice = displayPrice + extrasTotal;
  const trimRatio = car.carPrice > 0 ? displayPrice / car.carPrice : 1;

  const calc = useMemo(() => {
    const termMult = car.contractTermMultiplier[TERM] || 1.0;
    const extrasMonthly = extrasTotal / TERM;
    const depositAmount = Math.round((totalPrice * DEPOSIT_RATE) / 100);
    const discount = depositAmount * 0.00513;
    const baseMonthly = car.baseMonthlyPrice * trimRatio;
    const monthly = Math.max(0, Math.round((baseMonthly * termMult * mileageMult(mileage) + extrasMonthly - discount) * 1.1));
    return { monthly, depositAmount, totalPayment: monthly * TERM };
  }, [car, mileage, displayPrice, extrasTotal, trimRatio]);

  return (
    <div className="card rounded-2xl p-6 md:p-8">
      <h2 className="text-xl font-bold text-primary">간편 견적 계산기</h2>
      <p className="mt-1 text-xs text-text-muted">48개월 · 보증금 30% 기준 월 렌트료를 확인하세요.</p>

      <div className="mt-6 grid gap-8 md:grid-cols-2">
        <div className="space-y-6">
          {/* 주행거리 (유일한 선택 항목) */}
          <div>
            <label className="mb-2 block text-sm font-bold text-primary">연간 주행거리</label>
            <div className="flex flex-wrap gap-1.5">
              {MILEAGES.map((m) => (
                <button key={m} onClick={() => setMileage(m)}
                  className={`rounded-lg px-3 py-2 text-xs font-bold transition-all ${
                    mileage === m ? 'bg-primary text-white' : 'bg-surface-raised text-text-secondary hover:bg-border'
                  }`}>{m.toLocaleString()}km</button>
              ))}
            </div>
          </div>

          {/* 고정 조건 안내 */}
          <div className="rounded-xl bg-surface-raised p-4 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-text-secondary">계약 기간</span>
              <span className="font-semibold">{TERM}개월 (고정)</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-text-secondary">보증금</span>
              <span className="font-semibold">{DEPOSIT_RATE}% (고정 / 만기 환불)</span>
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-surface-raised p-6">
          <h3 className="mb-4 text-xs font-bold text-text-muted uppercase tracking-wider">예상 견적</h3>
          <div className="space-y-3">
            <div className="flex justify-between border-b border-border pb-3 text-sm">
              <span className="text-text-secondary">선택 트림</span>
              <span className="font-semibold text-right max-w-[60%] truncate">{selectedTrim?.name || car.trim}</span>
            </div>
            <div className="flex justify-between border-b border-border pb-3 text-sm">
              <span className="text-text-secondary">차량가 (옵션 포함)</span>
              <span className="font-semibold">{totalPrice.toLocaleString()}원</span>
            </div>
            <div className="flex justify-between border-b border-border pb-3 text-sm">
              <span className="text-text-secondary">계약 기간</span>
              <span className="font-semibold">{TERM}개월</span>
            </div>
            <div className="flex justify-between border-b border-border pb-3 text-sm">
              <span className="text-text-secondary">주행거리</span>
              <span className="font-semibold">{mileage.toLocaleString()}km</span>
            </div>
            <div className="flex justify-between border-b border-border pb-3 text-sm">
              <span className="text-text-secondary">보증금</span>
              <span className="font-semibold">{fmtPrice(calc.depositAmount)}</span>
            </div>
            {extrasTotal > 0 && (
              <div className="flex justify-between border-b border-border pb-3 text-sm">
                <span className="text-text-secondary">
                  옵션·컬러 추가
                  {colorTotal > 0 && <span className="text-[0.6rem]"> (컬러 {fmtPrice(colorTotal)})</span>}
                </span>
                <span className="font-semibold text-accent">+ {fmtPrice(extrasTotal)}</span>
              </div>
            )}
            <div className="rounded-lg bg-surface p-4 text-center border border-border">
              <p className="text-[0.6rem] text-text-muted">월 예상 렌트료 (부가세 포함)</p>
              <p className="text-3xl font-extrabold text-accent">{fmtMonthly(calc.monthly)}</p>
              <p className="text-[0.5rem] text-text-muted mt-1">
                {TERM}개월 총 {fmtPrice(calc.totalPayment)} · 보증금 포함 {fmtPrice(calc.depositAmount + calc.totalPayment)}
              </p>
            </div>
          </div>
          <a href="#car-consultation" className="btn-primary mt-5 flex w-full text-sm">
            이 조건으로 상담 신청하기
          </a>
        </div>
      </div>
    </div>
  );
}
