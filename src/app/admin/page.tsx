'use client';

import { useState } from 'react';
import { getLeads } from './adminActions';

export default function AdminPage() {
  const [pass, setPass] = useState('');
  const [authorized, setAuthorized] = useState(false);
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function login() {
    setLoading(true);
    setError('');
    try {
      const result = await getLeads(pass);
      setAuthorized(result.authorized);
      if (result.authorized) setLeads(result.leads);
      else setError('비밀번호가 틀렸습니다');
    } catch {
      setError('오류가 발생했습니다');
    }
    setLoading(false);
  }

  function downloadCSV() {
    const header = '이름,연락처,차량,고객유형,희망시기,UTM소스,등록일시\n';
    const rows = leads.map((l: any) =>
      [l.name, l.phone, l.car_type, l.customer_type, l.preferred_period, l.utm_source, l.created_at].join(',')
    ).join('\n');
    const blob = new Blob(['\uFEFF' + header + rows], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'leads.csv'; a.click();
  }

  if (!authorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="card rounded-2xl p-8 w-full max-w-sm text-center">
          <h1 className="text-xl font-bold text-primary mb-6">관리자 로그인</h1>
          <input type="password" value={pass} onChange={(e) => setPass(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && login()}
            placeholder="비밀번호" autoFocus
            className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm mb-4" />
          {error && <p className="text-sm text-error mb-3">{error}</p>}
          <button onClick={login} disabled={loading}
            className="btn-primary w-full text-sm">{loading ? '확인 중...' : '로그인'}</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-extrabold text-primary">상담 리드 ({leads.length}건)</h1>
          <button onClick={downloadCSV}
            className="btn-outline text-sm">📥 CSV 다운로드</button>
        </div>
        <div className="card rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-surface-raised text-left text-xs text-text-muted">
                  <th className="px-4 py-3">이름</th>
                  <th className="px-4 py-3">연락처</th>
                  <th className="px-4 py-3">차량</th>
                  <th className="px-4 py-3">고객유형</th>
                  <th className="px-4 py-3">희망시기</th>
                  <th className="px-4 py-3">UTM</th>
                  <th className="px-4 py-3">등록일시</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((l: any) => (
                  <tr key={l.id} className="border-b border-border hover:bg-surface-raised">
                    <td className="px-4 py-3 font-medium">{l.name}</td>
                    <td className="px-4 py-3">{l.phone}</td>
                    <td className="px-4 py-3 max-w-[200px] truncate">{l.car_type || '-'}</td>
                    <td className="px-4 py-3">{
                      (({ personal: '개인', business_small: '개인사업자', business_corp: '법인' } as Record<string, string>)[l.customer_type] || '-')
                    }</td>
                    <td className="px-4 py-3">{l.preferred_period || '-'}</td>
                    <td className="px-4 py-3 text-[0.65rem]">{l.utm_source || '-'}</td>
                    <td className="px-4 py-3 text-xs text-text-muted">{new Date(l.created_at).toLocaleString('ko-KR')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
