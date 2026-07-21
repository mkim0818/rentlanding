import Link from 'next/link';
import { COMPANY } from '@/lib/constants';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-bg/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 md:px-12 lg:px-20">
        <Link href="/" className="font-display text-xl tracking-tight text-primary">
          {COMPANY.name}
        </Link>
        <nav className="flex items-center gap-8">
          <Link href="/cars" className="text-sm font-bold text-text-secondary hover:text-primary transition-colors">
            차량 찾기
          </Link>
          <Link href="/#consultation-form" className="text-sm font-bold text-text-secondary hover:text-primary transition-colors">
            상담
          </Link>
          <a href={`tel:${COMPANY.phone}`}
            className="hidden text-sm font-bold text-primary hover:text-accent transition-colors md:inline">
            {COMPANY.phoneDisplay}
          </a>
        </nav>
      </div>
    </header>
  );
}
