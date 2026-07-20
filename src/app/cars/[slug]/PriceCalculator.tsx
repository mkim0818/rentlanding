'use client';

import { useState, useMemo } from 'react';
import type { Car } from '@/lib/cars';

function formatPrice(won: number): string {
  return `${Math.round(won / 10_000).toLocaleString()}만원`;
}
function formatMonthly(won: number): string {
  return `${Math.floor(won / 10_000).toLocaleString()}만 ${Math.round((won % 10_000) / 1_000)}천원`;
}

const TERMS = [24, 36, 48, 60, 72];
const MILEAGES = [10_000, 15_000, 20_000, 25_000, 30_000, 35_000, 40_000];
const DEPOSIT_RATES = [0, 10, 15, 20, 30];

function mileageMultiplier(km: number): number {
  if (km <= 10_000) return 1.0;
  if (km <= 15_000) return 1.05; if (km <= 20_000) return 1.10;
  if (km <= 25_000) return 1.16; if (km <= 30_000) return 1.22;
  if (km <= 35_000) return 1.28; return 1.35;
}
function depositDiscount(deposit: number): number {
  return deposit * 0.00513;
}

export default function PriceCalculator({ car }: { car: Car }) {
  const [term, setTerm] = useState(48);
  const [mileage, setMileage] = useState(10_000);
  const [depositRate, setDepositRate] = useState(30);
  const [selectedOptions, setSelectedOptions] = useState<Set<string>>(new Set());

  const toggleOption = (name: string) => {
    const next = new Set(selectedOptions);
    if (next.has(name)) next.delete(name); else next.add(name);
    setSelectedOptions(next);
  };

  const calc = useMemo(() => {
    const termMult = car.contractTermMultiplier[term] || 1.0;
    const mileMult = mileageMultiplier(mileage);
    const optionTotal = car.options.filter((o) => selectedOptions.has(o.name)).reduce((s, o) => s + o.price, 0);
    const optionMonthly = optionTotal / 48;
    const depositAmount = Math.round((car.carPrice * depositRate) / 100);
    const discount = depositDiscount(depositAmount);
    const monthly = Math.max(0, Math.round(car.baseMonthlyPrice * termMult * mileMult + optionMonthly - discount));
    return {
      monthly, depositAmount, optionTotal,
      totalPayment: Math.round(monthly * term),
      totalWithCar: Math.round(depositAmount + monthly * term),
    };
  }, [car, term, mileage, depositRate, selectedOptions]);

  return (
    <div className="card rounded-2xl p-6 md:p-8">
      <h2 className="text-xl font-bold text-primary">간편 견적 계산기</h2>
      <p className="mt-1 text-xs text-text-muted">※ 실제 견적은 신용도, 프로모션 등에 따라 달라질 수 있습니다.</p>

      <div className="mt-6 grid gap-8 md:grid-cols-2">
        {/* 좌측: 옵션 */}
        <div className="space-y-6">
          {/* 계약 기간 */}
          <div>
            <label className="mb-2 block text-sm font-bold text-primary">계약 기간</label>
            <div className="flex flex-wrap gap-1.5">
              {TERMS.map((t) => (
                <button key={t} onClick={() => setTerm(t)}
                  className={`rounded-lg px-4 py-2 text-sm font-bold transition-all ${
                    term === t ? 'bg-primary text-white' : 'bg-surface-raised text-text-secondary hover:bg-border'
                  }`}>{t}개월</button>
              ))}
            </div>
          </div>
          {/* 주행거리 */}
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
            <p className="mt-1 text-[0.6rem] text-text-muted">약정거리가 짧을수록 저렴합니다</p>
          </div>
          {/* 보증금 */}
          <div>
            <label className="mb-2 block text-sm font-bold text-primary">보증금</label>
            <div className="flex flex-wrap gap-1.5">
              {DEPOSIT_RATES.map((r) => {
                const amt = Math.round((car.carPrice * r) / 100);
                return (
                  <button key={r} onClick={() => setDepositRate(r)}
                    className={`rounded-lg px-3 py-2 text-xs font-bold transition-all ${
                      depositRate === r ? 'bg-primary text-white' : 'bg-surface-raised text-text-secondary hover:bg-border'
                    }`}>{formatPrice(amt)} ({r}%)</button>
                );
              })}
            </div>
            <p className="mt-1 text-[0.6rem] text-text-muted">보증금은 만기 후 환불됩니다</p>
          </div>
          {/* 옵션 */}
          {car.options.length > 0 && (
            <div>
              <label className="mb-2 block text-sm font-bold text-primary">추가 옵션</label>
              <div className="space-y-2">
                {car.options.map((opt) => {
                  const sel = selectedOptions.has(opt.name);
                  return (
                    <button key={opt.name} onClick={() => toggleOption(opt.name)}
                      className={`flex w-full items-center justify-between rounded-lg px-4 py-3 text-sm transition-all ${
                        sel ? 'border-2 border-accent bg-accent/5' : 'border border-border bg-surface hover:bg-surface-raised'
                      }`}>
                      <span className={sel ? 'font-semibold' : ''}>{opt.name}</span>
                      <span className={sel ? 'font-bold text-accent' : 'text-text-muted'}>+ {formatPrice(opt.price)}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* 우측: 결과 */}
        <div className="rounded-xl bg-surface-raised p-6">
          <h3 className="mb-4 text-xs font-bold text-text-muted uppercase tracking-wider">예상 견적</h3>
          <div className="space-y-3">
            <div className="flex justify-between border-b border-border pb-3 text-sm">
              <span className="text-text-secondary">차량가</span>
              <span className="font-semibold">{formatPrice(car.carPrice)}</span>
            </div>
            <div className="flex justify-between border-b border-border pb-3 text-sm">
              <span className="text-text-secondary">계약 기간</span>
              <span className="font-semibold">{term}개월</span>
            </div>
            <div className="flex justify-between border-b border-border pb-3 text-sm">
              <span className="text-text-secondary">연간 주행거리</span>
              <span className="font-semibold">{mileage.toLocaleString()}km</span>
            </div>
            <div className="flex justify-between border-b border-border pb-3 text-sm">
              <span className="text-text-secondary">보증금</span>
              <span className="font-semibold">{formatPrice(calc.depositAmount)}</span>
            </div>
            {calc.optionTotal > 0 && (
              <div className="flex justify-between border-b border-border pb-3 text-sm">
                <span className="text-text-secondary">옵션 추가</span>
                <span className="font-semibold text-accent">+ {formatPrice(calc.optionTotal)}</span>
              </div>
            )}
            {/* 월 렌트료 */}
            <div className="rounded-lg bg-surface p-4 text-center border border-border">
              <p className="text-[0.6rem] text-text-muted">월 예상 렌트료 (부가세 포함)</p>
              <p className="text-3xl font-extrabold text-accent">{formatMonthly(calc.monthly)}</p>
            </div>
            <div className="space-y-1 text-xs text-text-muted">
              <div className="flex justify-between"><span>총 납입액</span><span className="font-medium">{formatPrice(calc.totalPayment)}</span></div>
              <div className="flex justify-between"><span>보증금 포함 총액</span><span className="font-medium">{formatPrice(calc.totalWithCar)}</span></div>
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
