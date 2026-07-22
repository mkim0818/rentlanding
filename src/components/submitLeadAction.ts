'use server';

import { sql } from '@/lib/db';
import { PHONE_REGEX, NAME_MIN_LENGTH } from '@/lib/constants';

export type FormState = {
  success: boolean;
  message: string;
  errors?: {
    name?: string;
    phone?: string;
    agree?: string;
  };
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
  const kakaoId = formData.get('kakao_id')?.toString().trim() || null;
  const agree = formData.get('agree') === 'on';
  const utmSource = formData.get('utm_source')?.toString().trim() || null;
  const utmMedium = formData.get('utm_medium')?.toString().trim() || null;
  const utmCampaign = formData.get('utm_campaign')?.toString().trim() || null;
  const utmTerm = formData.get('utm_term')?.toString().trim() || null;

  // 서버 측 유효성 검사
  const errors: NonNullable<FormState['errors']> = {};
  if (!name || name.length < NAME_MIN_LENGTH) {
    errors.name = `이름을 ${NAME_MIN_LENGTH}글자 이상 입력해주세요`;
  }
  if (!phone || !PHONE_REGEX.test(phone)) {
    errors.phone = '올바른 전화번호 형식으로 입력해주세요 (예: 010-1234-5678)';
  }
  if (!agree) {
    errors.agree = '개인정보 수집·이용에 동의해주세요';
  }

  if (Object.keys(errors).length > 0) {
    return { success: false, message: '입력값을 확인해주세요', errors };
  }

  try {
    await sql`
      INSERT INTO leads (name, phone, car_type, budget, contract_period, contact_method, customer_type, preferred_period, car_slug, kakao_id, utm_source, utm_medium, utm_campaign, utm_term)
      VALUES (${name}, ${phone}, ${carType}, ${budget}, ${contractPeriod}, ${contactMethod}, ${customerType}, ${preferredPeriod}, ${carSlug}, ${kakaoId}, ${utmSource}, ${utmMedium}, ${utmCampaign}, ${utmTerm})
    `;

    // Google Sheets 연동 (비동기, 실패해도 에러 안 냄)
    const sheetsUrl = process.env.GOOGLE_SHEETS_URL;
    if (sheetsUrl) {
      fetch(sheetsUrl, {
        method: 'POST',
        body: JSON.stringify({ name, phone, carType, customerType, preferredPeriod, utmSource }),
        headers: { 'Content-Type': 'application/json' },
      }).catch(() => {}); // silently ignore sheets errors
    }

    return { success: true, message: '' };
  } catch (err) {
    console.error('Lead submission error:', err);
    return {
      success: false,
      message: '일시적인 오류가 발생했습니다.',
    };
  }
}
