# ○○렌터카 장기렌트 랜딩페이지

## 개요

Next.js 16(App Router) + TypeScript + Tailwind CSS v4 기반 렌터카 장기렌트 랜딩페이지.  
리드 수집(상담 신청)이 목적이며, 차량 리스트와 견적 계산기를 갖춘 3페이지 구조.

- **배포**: [Vercel](https://vercel.com/minyoung-kim-s-projects/rentlanding)
- **GitHub**: https://github.com/mkim0818/rentlanding
- **DB**: Vercel Postgres (`leads` 테이블)
- **개발 서버**: `npm run dev` → `http://localhost:3000`

## 페이지 구조

| 경로 | 타입 | 설명 |
|------|------|------|
| `/` | Static | 메인 랜딩 — Hero, 차량쇼케이스(인기순), 혜택, 비교, 절차, 상담폼, FAQ |
| `/cars` | Dynamic | 차량 리스트 — 브랜드·차종·연료·가격대 필터 + 검색 + 인기순 정렬 |
| `/cars/[slug]` | SSG | 차량 상세 — 트림/옵션/컬러 선택 + 견적 계산기 + 상담폼 |

## 차량 데이터

- **154대** (국산·수입), **14개 브랜드**
- **데이터 출처**: [아마존카 API](https://api.amazoncar.co.kr) — 실시간 월 렌트료
- **트림/옵션/컬러**: 차량별 675개 트림별 옵션 세트, 외장·내장 컬러 포함
- **파일**: `src/lib/cars.ts` (자동 생성)
- **이미지**: `/public/images/cars/` (154장 webp, 아마존카 CDN)

### 정렬 기준

- **브랜드 필터**: 산업통상부 2026.06 내수 판매 + 시장 인지도 순
- **차량 리스트**: 모델별 그룹핑(변종 통합) → 판매실적 top10 → 인기배지 → 가격순
- **홈 쇼케이스**: 모델당 1장, 판매실적 상위 6종

## 데이터 업데이트

```bash
# 수동 실행
python3 scripts/update-cars.py
npm run build

# 자동 실행 (GitHub Actions)
# 매일 오전 8시(KST) 실행 → cars.ts 갱신 → Vercel 자동 배포
```

API 주소 변경 시: `AMAZONCAR_API_URL` 환경변수 설정

## 견적 계산

```
월 렌트료 = (baseMonthlyPrice × trimRatio + extrasMonthly - depositDiscount) × 1.1(부가세)
```

- **trimRatio**: 선택 트림 가격 ÷ 기준 트림 가격
- **extrasMonthly**: (옵션 + 컬러 추가금) ÷ 계약기간
- **depositDiscount**: 보증금 × 0.00513
- 계약기간(24~72개월), 주행거리(1만~4만km), 보증금(0~30%) 조정 가능

## DB

`src/lib/setup-db.ts` 실행으로 `leads` 테이블 생성:
```bash
npx tsx src/lib/setup-db.ts
```

## 디자인 시스템

- **테마**: Clean Signal — 오프화이트(`#f9f7f4`) + 차콜(`#1f1f1f`) + 코랄 액센트(`#e85d3a`)
- **폰트**: Pretendard (CDN)

## 환경변수

| 변수 | 용도 |
|------|------|
| `POSTGRES_URL` | Vercel Postgres 연결 |
| `AMAZONCAR_API_URL` | 아마존카 API 주소 (기본값: `https://api.amazoncar.co.kr/api`) |

## 회사 정보

`src/lib/constants.ts`:
- `COMPANY.name` — 회사명
- `COMPANY.phone` / `phoneDisplay` — 전화번호
