import { PROCESS_STEPS } from '@/lib/constants';

export default function ProcessSection() {
  return (
    <section id="process" className="bg-surface">
      <div className="section-padding">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-12 text-center text-2xl font-extrabold text-primary md:text-3xl">
            상담 절차
          </h2>

          <div className="relative">
            {/* 연결선 (데스크탑만) */}
            <div className="absolute left-0 right-0 top-12 hidden h-0.5 bg-border md:block" />

            <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
              {PROCESS_STEPS.map((step, i) => (
                <div key={step.step} className={`animate-fade-up stagger-${i + 1} relative text-center`}>
                  {/* 번호 + 아이콘 */}
                  <div className="relative z-10 mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-surface shadow-md ring-4 ring-accent/20">
                    <div className="text-center">
                      <span className="block text-3xl">{step.icon}</span>
                      <span className="mt-1 block text-xs font-bold text-accent">
                        STEP {step.step}
                      </span>
                    </div>
                  </div>

                  <h3 className="mb-1 text-lg font-bold text-primary">{step.title}</h3>
                  <p className="text-sm text-text-secondary">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
