import { CTA } from '@/lib/constants';

interface CtaButtonProps {
  className?: string;
  href?: string;
  variant?: 'primary' | 'outline';
}

export default function CtaButton({
  className = '',
  href = '#consultation-form',
  variant = 'primary',
}: CtaButtonProps) {
  const baseClasses =
    'inline-flex items-center justify-center px-8 py-4 text-lg font-bold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5';

  const variantClasses =
    variant === 'primary'
      ? 'btn-primary'
      : 'btn-outline';

  return (
    <a href={href} className={`${baseClasses} ${variantClasses} ${className}`}>
      {CTA.label}
    </a>
  );
}
