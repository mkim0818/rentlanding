'use client';

import { useActionState, useEffect, useRef, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { useSearchParams } from 'next/navigation';
import { CAR_TYPE_OPTIONS, BUDGET_OPTIONS, PERIOD_OPTIONS, CONTACT_METHODS, NAME_MIN_LENGTH, COMPANY } from '@/lib/constants';
import { cars } from '@/lib/cars';
import { submitLead } from './submitLeadAction';
import UtmInjector from './UtmInjector';

declare global { interface Window { Kakao: any; } }

type FormState = { success: boolean; message: string; errors?: { name?: string; phone?: string; agree?: string } };
const init: FormState = { success: false, message: '' };

function SubmitBtn({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return <button type="submit" disabled={pending} className="btn-primary w-full text-base">{pending ? '처리 중...' : label}</button>;
}

function PhoneInput({ phoneRef }: { phoneRef: React.RefObject<HTMLInputElement | null> }) {
  const h = () => {
    const e = phoneRef.current; if (!e) return;
    const v = e.value.replace(/[^0-9]/g, '');
    if (v.length <= 3) e.value = v;
    else if (v.length <= 7) e.value = `${v.slice(0,3)}-${v.slice(3)}`;
    else e.value = `${v.slice(0,3)}-${v.slice(3,7)}-${v.slice(7,11)}`;
  };
  return <input ref={phoneRef} id="phone" name="phone" type="tel" required placeholder="010-0000-0000" onInput={h}
    className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm focus:border-primary focus:outline-none" />;
}

function SuccessScreen() {
  return <div className="card rounded-2xl p-10 text-center">
    <span className="text-5xl">✅</span>
    <h3 className="mt-4 text-xl font-bold text-primary">신청 완료</h3>
    <p className="mt-2 text-sm text-text-secondary">영업일 1일 이내 연락드립니다.<br />
    빠른 상담: <a href={`tel:${COMPANY.phone}`} className="font-bold text-primary underline">{COMPANY.phoneDisplay}</a></p>
  </div>;
}

function CarInfo({ car }: { car: typeof cars[number] }) {
  return <div className="rounded-lg border border-accent/30 bg-accent/5 px-4 py-3 text-sm">
    <span className="text-text-muted">선택 차량: </span>
    <span className="font-bold text-primary">{car.brand} {car.model}</span>
    <span className="text-text-muted"> {car.trim}</span>
  </div>;
}

/* ── 빠른 상담 폼 ─────────────────────────────── */
function QuickForm({ carSlug, car }: { carSlug?: string; car?: typeof cars[number] | null }) {
  const [kakaoUser, setKakaoUser] = useState<{nickname:string;email:string;id:number}|null>(null);
  const [pendingForm, setPendingForm] = useState<HTMLFormElement | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  
  // Init Kakao SDK
  useEffect(() => {
    if (window.Kakao && !window.Kakao.isInitialized()) {
      window.Kakao.init(process.env.NEXT_PUBLIC_KAKAO_JS_KEY);
    }
  }, []);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    if (!kakaoUser) {
      e.preventDefault();
      setPendingForm(e.currentTarget);
      if (!window.Kakao.isInitialized()) window.Kakao.init(process.env.NEXT_PUBLIC_KAKAO_JS_KEY);
      window.Kakao.Auth.login({
        success: (authObj: any) => {
          window.Kakao.API.request({
            url: '/v2/user/me',
            success: (res: any) => {
              setKakaoUser({
                nickname: res.kakao_account?.profile?.nickname || res.properties?.nickname || '',
                email: res.kakao_account?.email || '',
                id: res.id,
              });
            },
          });
        },
      });
      return;
    }
    // Already logged in — submit normally (form action handles it)
  }

  // Auto-submit after Kakao login completes
  useEffect(() => {
    if (kakaoUser && pendingForm) {
      const form = pendingForm;
      setPendingForm(null);
      // Add kakao_id hidden input
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = 'kakao_id';
      input.value = '' + kakaoUser.id;
      form.appendChild(input);
      form.requestSubmit();
    }
  }, [kakaoUser, pendingForm]);

  // Use form action for server submission
  const [state, formAction] = useActionState<FormState, FormData>(submitLead, init);

  useEffect(() => { if (state.success) formRef.current?.reset(); }, [state.success]);
  if (state.success) return <SuccessScreen />;

  return <form ref={formRef} action={formAction} onSubmit={handleSubmit} noValidate className="space-y-4">
    <UtmInjector />
    {carSlug && <input type="hidden" name="car_slug" value={carSlug} />}
    {car ? <CarInfo car={car} /> : null}
    <div>
      <label htmlFor="name" className="mb-1 block text-sm font-bold text-primary">이름 *</label>
      <input id="name" name="name" type="text" required minLength={NAME_MIN_LENGTH} placeholder="이름을 입력하세요"
        className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm focus:border-primary focus:outline-none" />
      {state.errors?.name && <p className="mt-1 text-xs text-error">{state.errors.name}</p>}
    </div>
    <div>
      <label htmlFor="phone" className="mb-1 block text-sm font-bold text-primary">연락처 *</label>
      <PhoneInput phoneRef={null as any} />
      {state.errors?.phone && <p className="mt-1 text-xs text-error">{state.errors.phone}</p>}
    </div>
    <label className="flex items-start gap-2 cursor-pointer">
      <input type="checkbox" name="agree" required className="mt-0.5 h-4 w-4 accent-accent" />
      <span className="text-xs text-text-secondary">개인정보 수집·이용 동의 *</span>
    </label>
    {state.errors?.agree && <p className="mt-1 text-xs text-error">{state.errors.agree}</p>}
    <button type="submit" className="btn-primary w-full text-base flex items-center justify-center gap-2">
      <svg width="18" height="18" viewBox="0 0 18 18"><path fill="currentColor" d="M9 0C4.03 0 0 3.127 0 6.986c0 2.465 1.624 4.63 4.07 5.862l-1.03 3.786c-.058.215.188.39.379.27l4.578-3.036c.328.046.662.07 1.003.07 4.97 0 9-3.127 9-6.986C18 3.127 13.97 0 9 0z"/></svg>
      카카오로 빠른 상담 신청
    </button>
    {state.message && !state.success && <p className="text-center text-sm text-error">{state.message}</p>}
  </form>;
}

/* ── 상세 상담 폼 ─────────────────────────────── */
function DetailedForm({ carSlug, car }: { carSlug?: string; car?: typeof cars[number] | null }) {
  const [kakaoUser, setKakaoUser] = useState<{nickname:string;email:string;id:number}|null>(null);
  const [pendingForm, setPendingForm] = useState<HTMLFormElement | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  
  useEffect(() => {
    if (window.Kakao && !window.Kakao.isInitialized()) {
      window.Kakao.init(process.env.NEXT_PUBLIC_KAKAO_JS_KEY);
    }
  }, []);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    if (!kakaoUser) {
      e.preventDefault();
      setPendingForm(e.currentTarget);
      if (!window.Kakao.isInitialized()) window.Kakao.init(process.env.NEXT_PUBLIC_KAKAO_JS_KEY);
      window.Kakao.Auth.login({
        success: () => {
          window.Kakao.API.request({
            url: '/v2/user/me',
            success: (res: any) => setKakaoUser({
              nickname: res.kakao_account?.profile?.nickname || res.properties?.nickname || '',
              email: res.kakao_account?.email || '',
              id: res.id,
            }),
          });
        },
      });
      return;
    }
  }

  useEffect(() => {
    if (kakaoUser && pendingForm) {
      const form = pendingForm;
      setPendingForm(null);
      const input = document.createElement('input');
      input.type = 'hidden'; input.name = 'kakao_id'; input.value = '' + kakaoUser.id;
      form.appendChild(input);
      form.requestSubmit();
    }
  }, [kakaoUser, pendingForm]);

  const [state, formAction] = useActionState<FormState, FormData>(submitLead, init);
  useEffect(() => { if (state.success) formRef.current?.reset(); }, [state.success]);
  if (state.success) return <SuccessScreen />;

  return <form ref={formRef} action={formAction} onSubmit={handleSubmit} noValidate className="space-y-4">
    <UtmInjector />
    {carSlug && <input type="hidden" name="car_slug" value={carSlug} />}
    {car ? <CarInfo car={car} /> : (
      <div>
        <label htmlFor="car_type" className="mb-1 block text-sm font-bold text-primary">희망 차종</label>
        <select id="car_type" name="car_type" defaultValue="" className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm focus:border-primary focus:outline-none">
          {CAR_TYPE_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>
    )}
    <div>
      <label htmlFor="name" className="mb-1 block text-sm font-bold text-primary">이름 *</label>
      <input id="name" name="name" type="text" required minLength={NAME_MIN_LENGTH} placeholder="이름을 입력하세요"
        defaultValue={kakaoUser?.nickname || ''}
        className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm focus:border-primary focus:outline-none" />
      {state.errors?.name && <p className="mt-1 text-xs text-error">{state.errors.name}</p>}
    </div>
    <div>
      <label htmlFor="phone" className="mb-1 block text-sm font-bold text-primary">연락처 *</label>
      <PhoneInput phoneRef={null as any} />
      {state.errors?.phone && <p className="mt-1 text-xs text-error">{state.errors.phone}</p>}
    </div>
    <div>
      <label htmlFor="budget" className="mb-1 block text-sm font-bold text-primary">월 예산</label>
      <select id="budget" name="budget" defaultValue="" className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm focus:border-primary focus:outline-none">
        {BUDGET_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
    <div>
      <label htmlFor="contract_period" className="mb-1 block text-sm font-bold text-primary">계약 기간</label>
      <select id="contract_period" name="contract_period" defaultValue="" className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm focus:border-primary focus:outline-none">
        {PERIOD_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
    <div>
      <label className="mb-1 block text-sm font-bold text-primary">고객 유형</label>
      <div className="flex gap-4">
        {['personal','business_small','business_corp'].map((v,i) => (
          <label key={v} className="flex items-center gap-1.5 cursor-pointer">
            <input type="radio" name="customer_type" value={v} defaultChecked={i===0} className="h-4 w-4 accent-accent"/>
            <span className="text-sm">{['개인','개인사업자','법인'][i]}</span>
          </label>
        ))}
      </div>
    </div>
    <div>
      <label className="mb-1 block text-sm font-bold text-primary">희망 시기</label>
      <div className="flex gap-4">
        {['1개월 이내','3개월 이내','미정'].map((l,i) => (
          <label key={l} className="flex items-center gap-1.5 cursor-pointer">
            <input type="radio" name="preferred_period" value={l} defaultChecked={i===2} className="h-4 w-4 accent-accent"/>
            <span className="text-sm">{l}</span>
          </label>
        ))}
      </div>
    </div>
    <div>
      <label className="mb-1 block text-sm font-bold text-primary">상담 방식</label>
      <div className="flex gap-4">
        {CONTACT_METHODS.map(m => (
          <label key={m.value} className="flex items-center gap-1.5 cursor-pointer">
            <input type="radio" name="contact_method" value={m.value} defaultChecked={m.value==='phone'} className="h-4 w-4 accent-accent"/>
            <span className="text-sm">{m.label}</span>
          </label>
        ))}
      </div>
    </div>
    <label className="flex items-start gap-2 cursor-pointer">
      <input type="checkbox" name="agree" required className="mt-0.5 h-4 w-4 accent-accent" />
      <span className="text-xs text-text-secondary">개인정보 수집·이용 동의 *</span>
    </label>
    {state.errors?.agree && <p className="mt-1 text-xs text-error">{state.errors.agree}</p>}
    <button type="submit" className="btn-primary w-full text-base flex items-center justify-center gap-2">
      <svg width="18" height="18" viewBox="0 0 18 18"><path fill="currentColor" d="M9 0C4.03 0 0 3.127 0 6.986c0 2.465 1.624 4.63 4.07 5.862l-1.03 3.786c-.058.215.188.39.379.27l4.578-3.036c.328.046.662.07 1.003.07 4.97 0 9-3.127 9-6.986C18 3.127 13.97 0 9 0z"/></svg>
      카카오로 상세 견적 신청
    </button>
    {state.message && !state.success && <p className="text-center text-sm text-error">{state.message}</p>}
  </form>;
}

/* ── 메인 ─────────────────────────────────────── */
export default function ConsultationForm({ carSlug: propSlug }: { carSlug?: string }) {
  const searchParams = useSearchParams();
  const urlSlug = searchParams.get('car');
  const slug = (propSlug || urlSlug) ?? undefined;
  const car = slug ? cars.find(c => c.slug === slug) : null;
  const [tab, setTab] = useState<'quick' | 'detail'>('quick');

  return (
    <section id="consultation-form" className="bg-surface">
      <div className="section-padding">
        <div className="mx-auto max-w-md">
          <h2 className="mb-2 text-center text-2xl font-extrabold text-primary md:text-3xl">무료 견적 상담 신청</h2>
          <p className="mb-8 text-center text-sm text-text-muted">카카오 로그인으로 간편하게 신청하세요</p>

          <div className="mb-6 flex gap-3">
            <button type="button" onClick={() => setTab('quick')}
              className={`flex-1 rounded-xl px-4 py-3 text-sm font-bold transition-colors ${tab==='quick'?'bg-primary text-white':'bg-surface-raised text-text-secondary hover:bg-border'}`}>
              ⚡ 빠른 상담
            </button>
            <button type="button" onClick={() => setTab('detail')}
              className={`flex-1 rounded-xl px-4 py-3 text-sm font-bold transition-colors ${tab==='detail'?'bg-primary text-white':'bg-surface-raised text-text-secondary hover:bg-border'}`}>
              📋 상세 견적
            </button>
          </div>

          {tab === 'quick' ? <QuickForm carSlug={slug} car={car} /> : <DetailedForm carSlug={slug} car={car} />}
        </div>
      </div>
    </section>
  );
}
