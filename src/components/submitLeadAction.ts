'use server';

import { PHONE_REGEX, NAME_MIN_LENGTH } from '@/lib/constants';

export type FormState = {
  success: boolean;
  message: string;
  errors?: { name?: string; phone?: string; agree?: string };
};

export async function submitLead(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const name = formData.get('name')?.toString().trim() ?? '';
  const phone = formData.get('phone')?.toString().trim() ?? '';
  const carType = formData.get('car_type')?.toString().trim() || null;
  const budget = formData.get('budget')?.toString().trim() || null;
  const contractPeriod = formData.get('contract_period')?.toString().trim() || null;
  const contactMethod = formData.get('contact_method')?.toString().trim() || null;
  const customerType = formData.get('customer_type')?.toString().trim() || null;
  const preferredPeriod = formData.get('preferred_period')?.toString().trim() || null;
  const carSlug = formData.get('car_slug')?.toString().trim() || null;
  const carModel = formData.get('car_model')?.toString().trim() || null;
  const carTrim = formData.get('car_trim')?.toString().trim() || null;
  const carOptions = formData.get('car_options')?.toString().trim() || null;
  const carExteriorColor = formData.get('car_exterior_color')?.toString().trim() || null;
  const carInteriorColor = formData.get('car_interior_color')?.toString().trim() || null;
  const kakaoId = formData.get('kakao_id')?.toString().trim() || null;
  const immediateDelivery = formData.get('immediate_delivery')?.toString().trim() || null;
  const additionalItems = formData.getAll('additional_items').filter(Boolean).join(',') || null;
  const agree = formData.get('agree') === 'on';
  const utmSource = formData.get('utm_source')?.toString().trim() || null;
  const utmMedium = formData.get('utm_medium')?.toString().trim() || null;
  const utmCampaign = formData.get('utm_campaign')?.toString().trim() || null;

  const errors: FormState['errors'] = {};
  if (!name || name.length < NAME_MIN_LENGTH) errors.name = `이름을 ${NAME_MIN_LENGTH}자 이상 입력해주세요`;
  if (!phone || !PHONE_REGEX.test(phone)) errors.phone = '올바른 연락처를 입력해주세요';
  if (!agree) errors.agree = '개인정보 수집·이용에 동의해주세요';
  if (Object.keys(errors).length > 0) return { success: false, message: '', errors };

  // Send to Google Sheets
  const sheetsUrl = process.env.GOOGLE_SHEETS_URL;
  if (!sheetsUrl) {
    return { success: false, message: '시스템 설정이 완료되지 않았습니다. 전화로 문의해주세요.' };
  }

  try {
    const res = await fetch(sheetsUrl, {
      method: 'POST',
      body: JSON.stringify({
        name, phone,
        carModel,
        carTrim: carTrim || carType,
        carOptions: carOptions || '',
        carColor: [carExteriorColor, carInteriorColor].filter(Boolean).join(' / ') || '',
        customerType, preferredPeriod,
        urgent: immediateDelivery || '',
        kakaoId,
        utmSource, utmMedium, utmCampaign,
        secret: process.env.GOOGLE_SHEETS_SECRET || 'rentlead-2026-secret',
      }),
      headers: { 'Content-Type': 'application/json' },
    });
    const result = await res.json();
    if (!result.ok) throw new Error('Sheets API failed');

    return { success: true, message: '' };
  } catch {
    return { success: false, message: '일시적인 오류가 발생했습니다.' };
  }
}
