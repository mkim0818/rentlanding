import { COMPARISON_OPTIONS } from '@/lib/constants';
import CtaButton from './CtaButton';

export default function RentalVsLeaseSection() {
  return (
    <section id="comparison">
      <div className="section-padding">
        <div className="mx-auto max-w-4xl">
          <h2 className="animate-fade-up stagger-1 mb-4 text-center text-2xl font-extrabold md:text-3xl">
            장기렌트 vs 리스 vs 할부
          </h2>
          <p className="animate-fade-up stagger-1 mb-8 text-center text-sm text-text-muted">
            나에게 맞는 방식은 무엇일까요?
          </p>

          {/* 데스크탑 */}
          <div className="hidden overflow-hidden rounded-2xl border border-border bg-surface md:block animate-fade-up stagger-2">
            <table className="w-full">
              <thead>
                <tr className="bg-surface-raised">
                  <th className="px-6 py-4 text-left text-sm font-bold text-text-primary">
                    구분
                  </th>
                  {COMPARISON_OPTIONS.columns.map((col) => (
                    <th
                      key={col}
                      className="px-6 py-4 text-center text-sm font-bold text-text-primary"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COMPARISON_OPTIONS.rows.map((row, idx) => (
                  <tr
                    key={row.label}
                    className={
                      idx !== COMPARISON_OPTIONS.rows.length - 1
                        ? 'border-b border-border'
                        : ''
                    }
                  >
                    <td className="px-6 py-4 text-sm font-medium text-text-secondary">
                      {row.label}
                    </td>
                    {row.values.map((val, colIdx) => (
                      <td
                        key={colIdx}
                        className="px-6 py-4 text-center text-sm text-text-primary"
                      >
                        {val}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 모바일 */}
          <div className="space-y-4 md:hidden animate-fade-up stagger-2">
            {COMPARISON_OPTIONS.columns.map((col, colIdx) => (
              <div
                key={col}
                className="rounded-2xl border border-border bg-surface p-5"
              >
                <h3 className="mb-3 text-lg font-bold text-primary">{col}</h3>
                <dl className="space-y-2">
                  {COMPARISON_OPTIONS.rows.map((row) => (
                    <div key={row.label} className="flex justify-between">
                      <dt className="text-sm text-text-muted">{row.label}</dt>
                      <dd className="text-sm font-bold">{row.values[colIdx]}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            ))}
          </div>

          <p className="mt-6 text-center text-sm text-text-secondary animate-fade-up stagger-3">
            자세한 상담은 아래 폼으로 신청해주세요
          </p>
          <div className="mt-4 text-center animate-fade-up stagger-3">
            <CtaButton />
          </div>
        </div>

        <div className="section-divider mt-16" />
      </div>
    </section>
  );
}
