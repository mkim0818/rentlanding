import Header from '@/components/Header';
import ChatBubble from '@/components/ChatBubble';
import StickyCtaBar from '@/components/StickyCtaBar';

import type { Metadata } from 'next';

import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || 'https://www.example.com'
  ),
  title: '○○렌터카 | 국산·수입차 장기렌트 무료 견적 상담',
  description:
    '월 28만원대부터, 초기비용 ZERO. 보험·세금·정비 모두 포함된 장기렌트. 무료 견적 상담으로 최적의 조건을 찾아드립니다.',
  keywords: ['장기렌트', '장기렌터카', '신차장기렌트', '법인장기렌트', '무료견적', '렌터카'],
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    title: '○○렌터카 | 국산·수입차 장기렌트 무료 견적 상담',
    description:
      '월 28만원대부터, 초기비용 ZERO. 보험·세금·정비 모두 포함된 장기렌트. 무료 견적 상담으로 최적의 조건을 찾아드립니다.',
    siteName: '○○렌터카',
    images: [
      {
        url: '/images/og-image.png',
        width: 1200,
        height: 630,
        alt: '○○렌터카 장기렌트',
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="antialiased">
      <head>
        <link
          rel="stylesheet"
          as="style"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
        {/* GA4 스크립트: 실제 ID로 교체 후 주석 해제 */}
        {/* <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script> */}
        {/* <script dangerouslySetInnerHTML={{ __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-XXXXXXXXXX');
        `}} /> */}
        {/* 네이버 애널리틱스: 실제 ID로 교체 후 주석 해제 */}
        {/* <script type="text/javascript" src="//wcs.naver.net/wcslog.js"></script> */}
      </head>
      <body className="min-h-screen flex flex-col">
        <Header />
        {children}
        <StickyCtaBar />
        <ChatBubble />
      </body>
    </html>
  );
}
