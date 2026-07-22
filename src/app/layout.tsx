import Header from '@/components/Header';
import ChatBubble from '@/components/ChatBubble';
import StickyCtaBar from '@/components/StickyCtaBar';
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://www.example.com'),
  title: '○○렌터카 | 국산·수입차 장기렌트 무료 견적 상담',
  description: '월 28만원대부터, 초기비용 ZERO. 보험·세금·정비 모두 포함된 장기렌트.',
  keywords: ['장기렌트', '장기렌터카', '신차장기렌트', '법인장기렌트', '무료견적'],
  openGraph: {
    type: 'website', locale: 'ko_KR',
    title: '○○렌터카 | 국산·수입차 장기렌트 무료 견적 상담',
    description: '월 28만원대부터, 초기비용 ZERO. 보험·세금·정비 모두 포함된 장기렌트.',
    siteName: '○○렌터카',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className="antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Do+Hyeon&display=swap" rel="stylesheet" />
        <link rel="stylesheet" as="style" crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css" />
        <script src="https://t1.kakaocdn.net/kakao_js_sdk/2.5.0/kakao.min.js" 
          integrity="sha384-kYPsUbBPlktXsY6/oNHSUDZoTXkJTn0I9sShLSp3bbtD31G+huQhbNg9H9tVz3Uj" crossOrigin="anonymous"></script>
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
