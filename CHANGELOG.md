# 렌터카 랜딩페이지 업데이트 기록

## 2026-07-20 — 프로젝트 초기 구현

### 프로젝트 스캐폴드
- Next.js 16(App Router) + TypeScript + Tailwind CSS v4
- `@vercel/postgres` 설치 (Vercel Postgres 연동)
- 작업 디렉토리: `~/projects/rentlanding`

### 구현된 구조

#### `src/lib/`
- **`db.ts`** — Vercel Postgres `sql` tagged template re-export
- **`constants.ts`** — 모든 텍스트, 옵션, 유효성 검사 정규식을 상수화. 교체 시 이 파일만 수정하면 됨
- **`setup-db.ts`** — `leads` 테이블 생성 스크립트 (`npx tsx src/lib/setup-db.ts`)

#### `src/components/` (11개 컴포넌트)
- **`HeroSection.tsx`** — 헤드라인, 서브헤드라인, 신뢰배지(누적계약/업력), 인기차종 3종 카드, CTA
- **`BenefitsSection.tsx`** — 장기렌트 혜택 4종 (보험·세금 포함, 초기비용ZERO, 반납·인수선택, 법인비용처리), 2x2 그리드
- **`CarComparisonTable.tsx`** — 차종 비교표 (준중형/SUV/수입세단). 데스크탑 테이블 + 모바일 카드 전환
- **`RentalVsLeaseSection.tsx`** — 장기렌트 vs 리스 vs 할부 비교표. 테이블 + 모바일 카드
- **`ProcessSection.tsx`** — 4단계 상담 절차 (STEP 1~4, 원형 배지 + 연결선)
- **`ConsultationForm.tsx`** — 상담 신청 폼 (useActionState + HTML5 native validation)
- **`submitLeadAction.ts`** — Server Action. `leads` 테이블에 INSERT. UTM 파라미터 포함. 서버 측 유효성 검사
- **`TrustSection.tsx`** — 제휴 금융사 배지, 운영정보, 상담 가능 시간
- **`FAQSection.tsx`** — 6개 FAQ 아코디언 (inline style 기반 토글)
- **`CtaButton.tsx`** — 공통 CTA 버튼. `href` 앵커로 폼 섹션 스크롤
- **`FloatingButtons.tsx`** — 모바일 하단 고정 "전화 상담" + "견적 신청" 버튼
- **`UtmInjector.tsx`** — URL searchParams → hidden input 자동 주입 (`utm_source`, `utm_medium`, `utm_campaign`, `utm_term`)

#### `src/app/`
- **`layout.tsx`** — metadata(OG 포함), Pretendard CDN 폰트, GA4/네이버 애널리틱스 주석 마킹
- **`page.tsx`** — 모든 섹션 조립 + JSON-LD 구조화 데이터
- **`globals.css`** — Tailwind v4 지시문, 커스텀 테마 컬러, CTA 그라데이션, 섹션 패딩
- **`robots.ts`** — robots.txt 생성
- **`sitemap.ts`** — sitemap.xml 생성

### 설계 결정
- **폼 검증 2중 구조**: HTML5 native (`required`, `minLength`, `pattern`) + Server Action 서버 측 검증
- **CTA 버튼**: Next.js `<Link>` → 네이티브 `<a href="#consultation-form">` 변경 (해시 앵커 스크롤 호환성)
- **FAQ 아코디언**: Tailwind 클래스 대신 inline style 사용 (Tailwind v4 동적 클래스 미적용 이슈 회피)
- **모든 텍스트 상수화**: `constants.ts` → 차종/캠페인별 랜딩페이지 복제 시 이 파일만 교체
- **UTM 추적**: 클라이언트에서 URL 파라미터 읽어 hidden input에 주입 → Server Action에서 DB 저장
- **레이아웃**: `h-full` 제거, `min-h-screen` 사용 (윈도우 스크롤 활성화)

### 검증 결과
| 항목 | 결과 |
|------|------|
| `npm run build` | ✅ Zero errors, static generation 완료 |
| 7개 섹션 렌더링 | ✅ Hero, Benefits, CarComparison, RentalVsLease, Process, Trust, FAQ |
| 폼 유효성 검사 | ✅ HTML5 native + Server Action 이중 검증 |
| 폼 제출 (DB 미연결 시) | ✅ 에러 메시지 + 전화번호 안내 표시 |
| 모바일 반응형 (375px) | ✅ 1컬럼 전환, 플로팅 버튼, 차종 비교 카드 전환 |
| SEO | ✅ robots.txt, sitemap.xml, JSON-LD, OG 태그 |
| FAQ 구조 | ✅ 6개 항목, React hydration 확인 |

### 배포 전 필요 작업
1. Vercel Postgres DB 생성 후 `POSTGRES_URL` 환경변수 설정
2. `npx tsx src/lib/setup-db.ts` 실행 (테이블 생성)
3. `constants.ts` 내 회사명, 전화번호, 업력, 계약건수 실제 값으로 변경
4. `/public/images/`에 차량 이미지 및 OG 이미지 추가
5. GA4 / 네이버 애널리틱스 스크립트 주석 해제 + ID 입력
6. `NEXT_PUBLIC_SITE_URL` 환경변수 설정
7. Vercel 배포
