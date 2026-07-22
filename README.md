# ○○렌터카 장기렌트 랜딩페이지

## 개요

Next.js 16(App Router) + TypeScript + Tailwind CSS v4 기반 렌터카 장기렌트 랜딩페이지.  
리드 수집(상담 신청)이 목적이며, 차량 리스트와 견적 계산기를 갖춘 3페이지 구조.

- **배포**: [Vercel](https://vercel.com) (현재: `rentlanding.vercel.app` 등록 가능)
- **DB**: Vercel Postgres (`leads` 테이블)
- **개발 서버**: `npm run dev` → `http://localhost:3000`

## 페이지 구조

| 경로 | 타입 | 설명 |
|------|------|------|
| `/` | Static | 메인 랜딩 — Hero, 차량쇼케이스, 혜택, 비교, 절차, 상담폼, FAQ |
| `/cars` | Dynamic | 차량 리스트 — 브랜드·차종·연료·가격대 필터 + 검색 + 정렬 |
| `/cars/[slug]` | SSG | 차량 상세 — 제원, 옵션, 견적 계산기, 상담폼 |

## 상담 플로우

카드의 "⚡ 빠른 상담" → `/?car=슬러그#consultation-form` → 차량명 표시 후 이름/연락처만 입력  
메인 폼은 빠른상담·상세견적 탭 전환. URL `?car=` 파라미터로 차량 전달 가능.

## 차량 데이터 관리

- **파일**: `src/lib/cars.ts`
- **데이터 출처**: [아마존카 API](https://api.amazoncar.co.kr) — 신차 154대, 실시간 월 렌트료 반영
- **업데이트**: 
```bash
# 데이터 최신화 (신차 추가, 가격 변동 등)
python3 scripts/update-cars.py
npm run build   # SSG 페이지 재생성
```
- **이미지**: `/public/images/cars/` 디렉토리에 저장 (154장 webp)
- **확장**: `TrimOption[]`, `ColorOption[]` 으로 트림/컬러 선택 지원

## DB

`src/lib/setup-db.ts` 실행으로 `leads` 테이블 생성:

```bash
npx tsx src/lib/setup-db.ts
```

테이블 컬럼: `name`, `phone`, `car_type`, `budget`, `contract_period`, `contact_method`, `customer_type`, `preferred_period`, `car_slug`, `utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, `created_at`, `status`

## 디자인 시스템

- **테마**: Clean Signal — 오프화이트(`#f9f7f4`) + 차콜(`#1f1f1f`) + 코랄 액센트(`#e85d3a`)
- **폰트**: Pretendard (CDN)
- **CSS 변수**: `--color-primary`, `--color-accent`, `--color-bg`, `--color-surface` 등
- **유틸리티**: `.btn-primary`, `.btn-outline`, `.card`, `.section-padding`, `.section-divider`
- **파일**: `src/app/globals.css`

## 환경변수

| 변수 | 용도 |
|------|------|
| `POSTGRES_URL` | Vercel Postgres 연결 |
| `NEXT_PUBLIC_SITE_URL` | 사이트 URL (OG, sitemap) |

## 회사 정보 수정

`src/lib/constants.ts`:
- `COMPANY.name` — 회사명
- `COMPANY.phone` / `phoneDisplay` — 전화번호
- `COMPANY.address`, `businessHours`, `yearsInBusiness`, `totalContracts`

## 배포

```bash
npx vercel          # 프리뷰
npx vercel --prod   # 프로덕션
```

