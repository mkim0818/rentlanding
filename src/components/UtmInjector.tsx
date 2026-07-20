'use client';

import { useEffect } from 'react';

/**
 * URL searchParams에서 UTM 파라미터를 읽어 hidden input에 주입합니다.
 * ConsultationForm 내부의 hidden 필드(id: utm_source, utm_medium, utm_campaign, utm_term)에 값을 설정합니다.
 */
export default function UtmInjector() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const fields = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term'];

    for (const field of fields) {
      const value = params.get(field);
      if (value) {
        const input = document.getElementById(field) as HTMLInputElement | null;
        if (input) {
          input.value = value;
        }
      }
    }
  }, []);

  // 아무것도 렌더링하지 않음
  return null;
}
