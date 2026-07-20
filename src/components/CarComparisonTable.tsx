import { CAR_COMPARISON } from '@/lib/constants';

export default function CarComparisonTable() {
  return (
    <section id="car-comparison" className="bg-bg-light">
      <div className="section-padding">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-4 text-center text-2xl font-extrabold md:text-3xl">
            차종별 예상 견적 비교
          </h2>
          <p className="mb-8 text-center text-sm text-text-muted">
            예상 월 납입료를 비교해보세요
          </p>

          {/* 데스크탑 테이블 */}
          <div className="hidden overflow-hidden rounded-2xl border border-border bg-white md:block">
            <table className="w-full">
              <thead>
                <tr className="bg-blue-50">
                  <th className="px-6 py-4 text-left text-sm font-bold text-text-primary">
                    항목
                  </th>
                  {CAR_COMPARISON.columns.map((col) => (
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
                {CAR_COMPARISON.rows.map((row, idx) => (
                  <tr
                    key={row.label}
                    className={idx !== CAR_COMPARISON.rows.length - 1 ? 'border-b border-border' : ''}
                  >
                    <td className="px-6 py-4 text-sm font-medium text-text-secondary">
                      {row.label}
                    </td>
                    {row.values.map((val, colIdx) => (
                      <td
                        key={colIdx}
                        className="px-6 py-4 text-center text-sm font-bold text-text-primary"
                      >
                        {val}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 모바일 카드 */}
          <div className="space-y-4 md:hidden">
            {CAR_COMPARISON.columns.map((col, colIdx) => (
              <div
                key={col}
                className="rounded-2xl border border-border bg-white p-5"
              >
                <h3 className="mb-3 text-lg font-bold text-primary">{col}</h3>
                <dl className="space-y-2">
                  {CAR_COMPARISON.rows.map((row) => (
                    <div key={row.label} className="flex justify-between">
                      <dt className="text-sm text-text-muted">{row.label}</dt>
                      <dd className="text-sm font-bold">{row.values[colIdx]}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            ))}
          </div>

          <p className="mt-6 text-center text-xs text-text-muted">
            {CAR_COMPARISON.disclaimer}
          </p>
        </div>
      </div>
    </section>
  );
}
