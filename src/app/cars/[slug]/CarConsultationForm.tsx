'use client';

import { useActionState, useEffect, useRef } from 'react';
import { useFormStatus } from 'react-dom';
import { NAME_MIN_LENGTH, COMPANY } from '@/lib/constants';
import type { Car, TrimOption, ColorOption, CarOption } from '@/lib/cars';
import { submitLead } from '@/components/submitLeadAction';
import UtmInjector from '@/components/UtmInjector';

type FormState = {
  success: boolean; message: string;
  errors?: { name?: string; phone?: string; agree?: string };
};
const initialState: FormState = { success: false, message: '' };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="btn-primary w-full text-sm">
      {pending ? '처리 중...' : '이 조건으로 상담 신청'}
    </button>
  );
}

interface Props {
  car: Car;
  selectedTrim: TrimOption | null;
  selectedExColor: ColorOption | null;
  selectedInColor: ColorOption | null;
  selectedOptionNames: Set<string>;
  allOptions: CarOption[];
}

export default function CarConsultationForm({
  car,
  selectedTrim,
  selectedExColor,
  selectedInColor,
  selectedOptionNames,
  allOptions,
}: Props) {
  const [state, formAction] = useActionState<FormState, FormData>(submitLead, initialState);
  const phoneRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const handlePhoneInput = () => {
    const input = phoneRef.current; if (!input) return;
    const raw = input.value.replace(/[^0-9]/g, '');
    if (raw.length <= 3) input.value = raw;
    else if (raw.length <= 7) input.value = `${raw.slice(0, 3)}-${raw.slice(3)}`;
    else input.value = `${raw.slice(0, 3)}-${raw.slice(3, 7)}-${raw.slice(7, 11)}`;
  };

  useEffect(() => { if (state.success) formRef.current?.reset(); }, [state.success]);

  const selectedOpts = allOptions.filter((o) => selectedOptionNames.has(o.name));
  const selectionSummary = [
    selectedTrim?.name,
    selectedExColor?.name,
    selectedInColor?.name,
    ...selectedOpts.map((o) => o.name),
  ].filter(Boolean).join(' / ');

  if (state.success) {
    return (
      <div className="card rounded-2xl p-8 text-center">
        <span className="text-4xl">✅</span>
        <h3 className="mt-3 text-lg font-bold text-primary">상담 신청 완료</h3>
        <p className="mt-2 text-sm text-text-secondary">
          {car.brand} {car.model} 견적 상담이 접수되었습니다. 영업일 1일 이내 연락드립니다.
        </p>
        <p className="mt-4 text-sm text-text-secondary">
          빠른 상담: <a href={`tel:${COMPANY.phone}`} className="font-bold text-primary underline">{COMPANY.phoneDisplay}</a>
        </p>
      </div>
    );
  }

  return (
    <form ref={formRef} action={formAction} noValidate className="space-y-4">
      <UtmInjector />
      <input type="hidden" name="car_slug" value={car.slug} />
      <input type="hidden" name="car_type" value={selectionSummary} />

      <div className="rounded-lg bg-surface-raised px-4 py-3">
        <div className="text-xs text-text-muted mb-1">선택 차량</div>
        <div className="text-sm font-bold text-primary">{car.brand} {car.model}</div>
        {selectedTrim && (
          <div className="mt-2 space-y-1 text-xs text-text-secondary">
            <div>▸ 트림: <span className="font-medium">{selectedTrim.name}</span> <span className="text-text-muted">({selectedTrim.price.toLocaleString()}원)</span></div>
            {selectedExColor && <div>▸ 외장: <span className="font-medium">{selectedExColor.name}</span>{selectedExColor.price > 0 && <span className="text-text-muted"> (+{selectedExColor.price.toLocaleString()})</span>}</div>}
            {selectedInColor && <div>▸ 내장: <span className="font-medium">{selectedInColor.name}</span></div>}
            {selectedOpts.length > 0 && (
              <div>▸ 옵션: <span className="font-medium">{selectedOpts.map((o) => o.name).join(', ')}</span> <span className="text-accent">(+{selectedOpts.reduce((s, o) => s + o.price, 0).toLocaleString()}원)</span></div>
            )}
          </div>
        )}
      </div>

      <div>
        <label htmlFor="name" className="mb-1 block text-sm font-bold text-primary">이름 *</label>
        <input id="name" name="name" type="text" required minLength={NAME_MIN_LENGTH}
          placeholder="이름을 입력하세요"
          className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-text placeholder:text-text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10" />
        {state.errors?.name && <p className="mt-1 text-xs text-error">{state.errors.name}</p>}
      </div>

      <div>
        <label htmlFor="phone" className="mb-1 block text-sm font-bold text-primary">연락처 *</label>
        <input ref={phoneRef} id="phone" name="phone" type="tel" required
          placeholder="010-0000-0000" onInput={handlePhoneInput}
          className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-text placeholder:text-text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10" />
        {state.errors?.phone && <p className="mt-1 text-xs text-error">{state.errors.phone}</p>}
      </div>

      <div>
        <label className="mb-1 block text-sm font-bold text-primary">고객 유형</label>
        <div className="flex gap-4">
          {[{ value: 'personal', label: '개인' }, { value: 'business_small', label: '개인사업자' }, { value: 'business_corp', label: '법인' }].map(({ value, label }) => (
            <label key={value} className="flex items-center gap-1.5 cursor-pointer">
              <input type="radio" name="customer_type" value={value} defaultChecked={value === 'personal'} className="h-4 w-4 accent-accent" />
              <span className="text-sm">{label}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-bold text-primary">희망 시기</label>
        <div className="flex gap-4">
          {['1개월 이내', '3개월 이내', '미정'].map((label) => (
            <label key={label} className="flex items-center gap-1.5 cursor-pointer">
              <input type="radio" name="preferred_period" value={label} defaultChecked={label === '미정'} className="h-4 w-4 accent-accent" />
              <span className="text-sm">{label}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="flex items-start gap-2 cursor-pointer">
          <input type="checkbox" name="agree" required className="mt-0.5 h-4 w-4 accent-accent" />
          <span className="text-xs text-text-secondary">
            개인정보 수집·이용에 동의합니다. * <span className="text-text-muted">(상담 목적으로만 사용)</span>
          </span>
        </label>
        {state.errors?.agree && <p className="mt-1 text-xs text-error">{state.errors.agree}</p>}
      </div>

      <SubmitButton />
      {state.message && !state.success && <p className="text-center text-sm text-error">{state.message}</p>}
    </form>
  );
}
