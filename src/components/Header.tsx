import Link from 'next/link';
import { COMPANY } from '@/lib/constants';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-surface/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5 md:px-8">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-extrabold tracking-tight text-primary">
            {COMPANY.name}
          </span>
        </Link>

        <nav className="flex items-center gap-6">
          <Link
            href="/cars"
            className="text-sm font-semibold text-text-secondary transition-colors hover:text-primary"
          >
            차량 찾기
          </Link>
          <Link
            href="/#consultation-form"
            className="text-sm font-semibold text-text-secondary transition-colors hover:text-primary"
          >
            상담 신청
          </Link>
          <a
            href={`tel:${COMPANY.phone}`}
            className="hidden rounded-lg bg-primary px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-primary-hover md:inline-flex"
          >
            {COMPANY.phoneDisplay}
          </a>
        </nav>
      </div>
    </header>
  );
}
