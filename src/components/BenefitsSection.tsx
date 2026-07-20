import { BENEFITS } from '@/lib/constants';

export default function BenefitsSection() {
  return (
    <section id="benefits">
      <div className="section-padding">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-12 text-center text-2xl font-extrabold text-primary md:text-3xl">
            왜 장기렌트인가요?
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {BENEFITS.map((benefit, index) => (
              <div
                key={benefit.title}
                className={`card rounded-2xl p-6 flex gap-4 animate-fade-up stagger-${index + 1}`}
              >
                <span className="flex-shrink-0 text-3xl">{benefit.icon}</span>
                <div>
                  <h3 className="mb-1 text-lg font-bold">{benefit.title}</h3>
                  <p className="text-sm text-text-secondary">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
