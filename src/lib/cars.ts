// ── 차량 데이터 ─────────────────────────────────────
// 엑셀 등에서 복사하여 업데이트. 이미지는 /public/images/cars/ 에 저장.
//
// 필드 설명:
//   slug         - URL 경로 (고유, 영문+하이픈)
//   brand        - 브랜드명
//   model        - 모델명
//   trim         - 트림/등급명
//   year         - 연식
//   carType      - 차종 분류
//   fuelType     - 연료 분류
//   image        - 차량 이미지 경로
//   carPrice     - 차량가 (원)
//   baseMonthlyPrice - 기준 월 렌트료 (48개월, 선납30%, 만26세, 10,000km 기준)
//   badge        - 카드 뱃지 (인기/NEW/특가/없음)
//   specs        - 제원 정보
//   options      - 선택 가능 옵션 목록
//   contractTerms - 계약 기간별 월가 배율 (기준=1.0)
// ────────────────────────────────────────────────────

export interface CarOption {
  name: string;
  price: number; // 옵션 추가 가격
}

export interface CarSpecs {
  displacement: number; // 배기량 (cc)
  seats: number;
  fuelEfficiency?: string; // 연비 (km/L 또는 km/kWh)
  drivetrain?: string; // 구동방식
  transmission?: string; // 변속기
}

export interface Car {
  slug: string;
  brand: string;
  model: string;
  trim: string;
  year: number;
  carType: '경소형' | '중형' | '대형' | 'SUV' | '승합';
  fuelType: '가솔린' | '디젤' | 'LPG' | '하이브리드' | '전기';
  image: string;
  carPrice: number;
  baseMonthlyPrice: number;
  badge?: '인기' | 'NEW' | '특가';
  specs: CarSpecs;
  options: CarOption[];
  /** 계약 기간(개월) → 월가 조정 배율 (1.0 = 기준가) */
  contractTermMultiplier: Record<number, number>;
  description?: string;
}

export const cars: Car[] = [
  // ── 경소형 ────────────────────────────────────────
  {
    slug: 'morning-2026',
    brand: '기아',
    model: '모닝',
    trim: '1.0 가솔린 시그니처',
    year: 2026,
    carType: '경소형',
    fuelType: '가솔린',
    image: '/images/cars/morning.svg',
    carPrice: 15_150_000,
    baseMonthlyPrice: 178_000,
    badge: '특가',
    specs: { displacement: 998, seats: 5, fuelEfficiency: '15.7km/L', drivetrain: '2WD', transmission: 'A/T' },
    options: [
      { name: '스타일 패키지', price: 600_000 },
      { name: '드라이브 와이즈', price: 800_000 },
    ],
    contractTermMultiplier: { 24: 1.35, 36: 1.15, 48: 1.0, 60: 0.90, 72: 0.83 },
  },
  {
    slug: 'ray-2026',
    brand: '기아',
    model: '레이',
    trim: '1.0 가솔린 프레스티지',
    year: 2026,
    carType: '경소형',
    fuelType: '가솔린',
    image: '/images/cars/ray.svg',
    carPrice: 17_600_000,
    baseMonthlyPrice: 195_000,
    specs: { displacement: 998, seats: 5, fuelEfficiency: '13.3km/L', drivetrain: '2WD', transmission: 'A/T' },
    options: [],
    contractTermMultiplier: { 24: 1.35, 36: 1.15, 48: 1.0, 60: 0.90, 72: 0.83 },
  },
  {
    slug: 'casper-2026',
    brand: '현대',
    model: '캐스퍼',
    trim: '1.0 터보 인스퍼레이션',
    year: 2026,
    carType: '경소형',
    fuelType: '가솔린',
    image: '/images/cars/casper.svg',
    carPrice: 19_600_000,
    baseMonthlyPrice: 210_000,
    specs: { displacement: 998, seats: 4, fuelEfficiency: '12.8km/L', drivetrain: '2WD', transmission: 'A/T' },
    options: [
      { name: '액티브 패키지', price: 900_000 },
    ],
    contractTermMultiplier: { 24: 1.35, 36: 1.15, 48: 1.0, 60: 0.90, 72: 0.83 },
  },

  // ── 중형 ──────────────────────────────────────────
  {
    slug: 'avante-2026-hybrid',
    brand: '현대',
    model: '아반떼',
    trim: '1.6 하이브리드 인스퍼레이션',
    year: 2026,
    carType: '중형',
    fuelType: '하이브리드',
    image: '/images/cars/avante-hybrid.svg',
    carPrice: 26_180_000,
    baseMonthlyPrice: 248_000,
    badge: '인기',
    specs: { displacement: 1580, seats: 5, fuelEfficiency: '20.1km/L', drivetrain: '2WD', transmission: 'DCT' },
    options: [
      { name: '컨비니언스', price: 1_100_000 },
      { name: '와이드 선루프', price: 500_000 },
    ],
    contractTermMultiplier: { 24: 1.32, 36: 1.13, 48: 1.0, 60: 0.91, 72: 0.84 },
  },
  {
    slug: 'k5-2026-lpi',
    brand: '기아',
    model: 'K5',
    trim: '2.0 LPI 프레스티지',
    year: 2026,
    carType: '중형',
    fuelType: 'LPG',
    image: '/images/cars/k5-lpi.svg',
    carPrice: 27_240_000,
    baseMonthlyPrice: 258_000,
    specs: { displacement: 1999, seats: 5, fuelEfficiency: '8.9km/L', drivetrain: '2WD', transmission: 'A/T' },
    options: [
      { name: '시그니처 패키지', price: 1_400_000 },
    ],
    contractTermMultiplier: { 24: 1.32, 36: 1.13, 48: 1.0, 60: 0.91, 72: 0.84 },
  },
  {
    slug: 'sonata-2026-hybrid',
    brand: '현대',
    model: '쏘나타 디 엣지',
    trim: '2.0 하이브리드 익스클루시브',
    year: 2026,
    carType: '중형',
    fuelType: '하이브리드',
    image: '/images/cars/sonata-hybrid.svg',
    carPrice: 37_740_000,
    baseMonthlyPrice: 315_000,
    specs: { displacement: 1999, seats: 5, fuelEfficiency: '18.2km/L', drivetrain: '2WD', transmission: 'A/T' },
    options: [
      { name: '컨비니언스', price: 1_200_000 },
      { name: '파노라마 선루프', price: 1_100_000 },
    ],
    contractTermMultiplier: { 24: 1.30, 36: 1.12, 48: 1.0, 60: 0.91, 72: 0.84 },
  },

  // ── 대형 ──────────────────────────────────────────
  {
    slug: 'granger-2026-hybrid',
    brand: '현대',
    model: '그랜저',
    trim: '1.6 터보 하이브리드 프리미엄',
    year: 2026,
    carType: '대형',
    fuelType: '하이브리드',
    image: '/images/cars/granger-hybrid.svg',
    carPrice: 44_540_000,
    baseMonthlyPrice: 398_000,
    badge: '인기',
    specs: { displacement: 1598, seats: 5, fuelEfficiency: '16.2km/L', drivetrain: '2WD', transmission: 'A/T' },
    options: [
      { name: '컨비니언스', price: 1_100_000 },
      { name: '파노라마 선루프', price: 1_200_000 },
      { name: '스타일', price: 1_000_000 },
    ],
    contractTermMultiplier: { 24: 1.29, 36: 1.11, 48: 1.0, 60: 0.91, 72: 0.85 },
  },
  {
    slug: 'k8-2026',
    brand: '기아',
    model: 'K8',
    trim: '2.5 가솔린 노블레스 라이트',
    year: 2026,
    carType: '대형',
    fuelType: '가솔린',
    image: '/images/cars/k8.svg',
    carPrice: 36_790_000,
    baseMonthlyPrice: 335_000,
    specs: { displacement: 2497, seats: 5, fuelEfficiency: '11.5km/L', drivetrain: '2WD', transmission: 'A/T' },
    options: [
      { name: '노블레스 컬렉션', price: 2_100_000 },
    ],
    contractTermMultiplier: { 24: 1.30, 36: 1.12, 48: 1.0, 60: 0.91, 72: 0.84 },
  },
  {
    slug: 'g80-2026',
    brand: '제네시스',
    model: 'G80',
    trim: '2.5 터보 가솔린 2WD',
    year: 2026,
    carType: '대형',
    fuelType: '가솔린',
    image: '/images/cars/g80.svg',
    carPrice: 58_990_000,
    baseMonthlyPrice: 532_000,
    badge: 'NEW',
    specs: { displacement: 2497, seats: 5, fuelEfficiency: '10.2km/L', drivetrain: '2WD', transmission: 'A/T' },
    options: [
      { name: '프리미엄 컬렉션', price: 3_500_000 },
      { name: '컨비니언스 II', price: 1_800_000 },
    ],
    contractTermMultiplier: { 24: 1.27, 36: 1.10, 48: 1.0, 60: 0.92, 72: 0.86 },
  },

  // ── SUV ───────────────────────────────────────────
  {
    slug: 'seltos-2026-hybrid',
    brand: '기아',
    model: '셀토스',
    trim: '1.6 하이브리드 트렌디',
    year: 2026,
    carType: 'SUV',
    fuelType: '하이브리드',
    image: '/images/cars/seltos-hybrid.svg',
    carPrice: 29_980_000,
    baseMonthlyPrice: 268_000,
    badge: 'NEW',
    specs: { displacement: 1580, seats: 5, fuelEfficiency: '16.4km/L', drivetrain: '2WD', transmission: 'DCT' },
    options: [
      { name: '드라이브 와이즈', price: 1_000_000 },
    ],
    contractTermMultiplier: { 24: 1.32, 36: 1.13, 48: 1.0, 60: 0.91, 72: 0.84 },
  },
  {
    slug: 'sportage-2026',
    brand: '기아',
    model: '스포티지',
    trim: '1.6 터보 프레스티지 2WD',
    year: 2026,
    carType: 'SUV',
    fuelType: '가솔린',
    image: '/images/cars/sportage.svg',
    carPrice: 28_630_000,
    baseMonthlyPrice: 275_000,
    specs: { displacement: 1598, seats: 5, fuelEfficiency: '12.3km/L', drivetrain: '2WD', transmission: 'A/T' },
    options: [
      { name: '스타일 패키지', price: 900_000 },
      { name: '와이드 선루프', price: 1_000_000 },
    ],
    contractTermMultiplier: { 24: 1.32, 36: 1.13, 48: 1.0, 60: 0.91, 72: 0.84 },
  },
  {
    slug: 'tucson-2026-hybrid',
    brand: '현대',
    model: '투싼',
    trim: '1.6 터보 하이브리드 모던 4WD',
    year: 2026,
    carType: 'SUV',
    fuelType: '하이브리드',
    image: '/images/cars/tucson-hybrid.svg',
    carPrice: 35_910_000,
    baseMonthlyPrice: 305_000,
    badge: '인기',
    specs: { displacement: 1598, seats: 5, fuelEfficiency: '15.8km/L', drivetrain: '4WD', transmission: 'A/T' },
    options: [
      { name: '파노라마 선루프', price: 1_200_000 },
      { name: '컨비니언스', price: 1_100_000 },
    ],
    contractTermMultiplier: { 24: 1.31, 36: 1.12, 48: 1.0, 60: 0.91, 72: 0.84 },
  },
  {
    slug: 'sorento-2026-hybrid',
    brand: '기아',
    model: '쏘렌토',
    trim: '1.6 터보 하이브리드 2WD 프레스티지 (5인승)',
    year: 2026,
    carType: 'SUV',
    fuelType: '하이브리드',
    image: '/images/cars/sorento-hybrid.svg',
    carPrice: 39_960_000,
    baseMonthlyPrice: 338_000,
    badge: '인기',
    specs: { displacement: 1598, seats: 5, fuelEfficiency: '14.5km/L', drivetrain: '2WD', transmission: 'A/T' },
    options: [
      { name: '시그니처 패키지', price: 2_200_000 },
      { name: '파노라마 선루프', price: 1_200_000 },
    ],
    contractTermMultiplier: { 24: 1.30, 36: 1.12, 48: 1.0, 60: 0.92, 72: 0.85 },
  },
  {
    slug: 'santafe-2026-hybrid',
    brand: '현대',
    model: '싼타페',
    trim: '1.6 터보 하이브리드 2WD 익스클루시브 (5인승)',
    year: 2026,
    carType: 'SUV',
    fuelType: '하이브리드',
    image: '/images/cars/santafe-hybrid.svg',
    carPrice: 40_640_000,
    baseMonthlyPrice: 345_000,
    specs: { displacement: 1598, seats: 5, fuelEfficiency: '13.8km/L', drivetrain: '2WD', transmission: 'A/T' },
    options: [
      { name: '컨비니언스', price: 1_300_000 },
      { name: '캘리그래피 패키지', price: 2_800_000 },
    ],
    contractTermMultiplier: { 24: 1.30, 36: 1.12, 48: 1.0, 60: 0.92, 72: 0.85 },
  },
  {
    slug: 'palisade-2026-hybrid',
    brand: '현대',
    model: '팰리세이드',
    trim: '2.5 터보 하이브리드 익스클루시브 2WD (9인승)',
    year: 2026,
    carType: 'SUV',
    fuelType: '하이브리드',
    image: '/images/cars/palisade-hybrid.svg',
    carPrice: 49_820_000,
    baseMonthlyPrice: 438_000,
    badge: 'NEW',
    specs: { displacement: 2497, seats: 9, fuelEfficiency: '11.2km/L', drivetrain: '2WD', transmission: 'A/T' },
    options: [
      { name: '캘리그래피 패키지', price: 3_500_000 },
      { name: '파노라마 선루프', price: 1_200_000 },
    ],
    contractTermMultiplier: { 24: 1.28, 36: 1.11, 48: 1.0, 60: 0.92, 72: 0.86 },
  },
  {
    slug: 'gv70-2026',
    brand: '제네시스',
    model: 'GV70',
    trim: '2.5 터보 가솔린 2WD',
    year: 2026,
    carType: 'SUV',
    fuelType: '가솔린',
    image: '/images/cars/gv70.svg',
    carPrice: 53_180_000,
    baseMonthlyPrice: 485_000,
    specs: { displacement: 2497, seats: 5, fuelEfficiency: '9.8km/L', drivetrain: '2WD', transmission: 'A/T' },
    options: [
      { name: '프리미엄 컬렉션', price: 3_800_000 },
    ],
    contractTermMultiplier: { 24: 1.27, 36: 1.10, 48: 1.0, 60: 0.92, 72: 0.86 },
  },

  // ── 승합 ──────────────────────────────────────────
  {
    slug: 'carnival-2026-hybrid-9',
    brand: '기아',
    model: '카니발',
    trim: '1.6 터보 하이브리드 9인승 프레스티지',
    year: 2026,
    carType: '승합',
    fuelType: '하이브리드',
    image: '/images/cars/carnival-hybrid.svg',
    carPrice: 40_910_000,
    baseMonthlyPrice: 342_000,
    badge: '인기',
    specs: { displacement: 1598, seats: 9, fuelEfficiency: '13.5km/L', drivetrain: '2WD', transmission: 'A/T' },
    options: [
      { name: '컨비니언스', price: 1_100_000 },
      { name: '스타일', price: 1_000_000 },
      { name: '드라이브 와이즈', price: 1_200_000 },
    ],
    contractTermMultiplier: { 24: 1.30, 36: 1.12, 48: 1.0, 60: 0.92, 72: 0.85 },
  },
  {
    slug: 'staria-2026-hybrid',
    brand: '현대',
    model: '스타리아',
    trim: '1.6 터보 하이브리드 라운지 9인승',
    year: 2026,
    carType: '승합',
    fuelType: '하이브리드',
    image: '/images/cars/staria-hybrid.svg',
    carPrice: 38_500_000,
    baseMonthlyPrice: 328_000,
    specs: { displacement: 1598, seats: 9, fuelEfficiency: '11.8km/L', drivetrain: '2WD', transmission: 'A/T' },
    options: [
      { name: '프리미엄 패키지', price: 2_400_000 },
    ],
    contractTermMultiplier: { 24: 1.31, 36: 1.12, 48: 1.0, 60: 0.91, 72: 0.84 },
  },

  // ── 전기차 ────────────────────────────────────────
  {
    slug: 'ev3-2026',
    brand: '기아',
    model: 'EV3',
    trim: '스탠다드 에어',
    year: 2026,
    carType: 'SUV',
    fuelType: '전기',
    image: '/images/cars/ev3.svg',
    carPrice: 41_460_000,
    baseMonthlyPrice: 325_000,
    badge: 'NEW',
    specs: { displacement: 0, seats: 5, fuelEfficiency: '5.8km/kWh', drivetrain: '2WD', transmission: 'A/T' },
    options: [
      { name: '드라이브 와이즈', price: 1_100_000 },
    ],
    contractTermMultiplier: { 24: 1.33, 36: 1.14, 48: 1.0, 60: 0.90, 72: 0.82 },
  },
  {
    slug: 'ev5-2026',
    brand: '기아',
    model: 'EV5',
    trim: '롱레인지 에어',
    year: 2026,
    carType: 'SUV',
    fuelType: '전기',
    image: '/images/cars/ev5.svg',
    carPrice: 48_550_000,
    baseMonthlyPrice: 390_000,
    specs: { displacement: 0, seats: 5, fuelEfficiency: '5.5km/kWh', drivetrain: '2WD', transmission: 'A/T' },
    options: [
      { name: '윈드 패키지', price: 1_500_000 },
    ],
    contractTermMultiplier: { 24: 1.33, 36: 1.14, 48: 1.0, 60: 0.90, 72: 0.82 },
  },
];

// ── 필터를 위한 집계 ──────────────────────────────
export const ALL_BRANDS = [...new Set(cars.map((c) => c.brand))].sort();
export const ALL_CAR_TYPES = [...new Set(cars.map((c) => c.carType))] as Car['carType'][];
export const ALL_FUEL_TYPES = [...new Set(cars.map((c) => c.fuelType))] as Car['fuelType'][];
export const PRICE_RANGES = [
  { label: '전체', min: 0, max: Infinity },
  { label: '20만원 이하', min: 0, max: 200_000 },
  { label: '20~30만원', min: 200_000, max: 300_000 },
  { label: '30~40만원', min: 300_000, max: 400_000 },
  { label: '40만원 이상', min: 400_000, max: Infinity },
] as const;

export type SortOption = 'recommended' | 'price_asc' | 'price_desc';
export const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'recommended', label: '추천순' },
  { value: 'price_asc', label: '낮은 가격순' },
  { value: 'price_desc', label: '높은 가격순' },
];
