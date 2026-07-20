// ── 회사/운영 정보 ──────────────────────────────────
export const COMPANY = {
  name: '○○렌터카',
  phone: '02-XXXX-XXXX',
  phoneDisplay: '02-XXXX-XXXX',
  address: '서울특별시 ○○구 ○○로 123',
  businessHours: '평일 09:00~18:00 / 토요일 09:00~14:00',
  yearsInBusiness: '○○년',
  totalContracts: '○○건',
} as const;

// ── 히어로 섹션 ─────────────────────────────────────
export const HERO = {
  headline: '국산·수입차 장기렌트, 무료 견적 상담으로 시작하세요',
  subheadline: '월 28만원대부터 · 초기비용 ZERO · 보험·세금·정비 포함',
  popularCars: [
    {
      name: '아반떼 (준중형)',
      price: '월 28만원대~',
      image: '/images/car-compact.png',
      note: '자세한 견적은 상담 후 안내',
    },
    {
      name: '투싼 (SUV)',
      price: '월 38만원대~',
      image: '/images/car-suv.png',
      note: '자세한 견적은 상담 후 안내',
    },
    {
      name: '3시리즈 (수입 세단)',
      price: '월 55만원대~',
      image: '/images/car-import.png',
      note: '자세한 견적은 상담 후 안내',
    },
  ],
  trustBadges: [
    { label: '누적 계약', value: COMPANY.totalContracts },
    { label: '장기렌트 전문', value: COMPANY.yearsInBusiness },
  ],
} as const;

// ── 혜택 섹션 ──────────────────────────────────────
export const BENEFITS = [
  {
    icon: '🛡️',
    title: '보험·세금·정비 모두 포함',
    description: '별도 부담 없이 한 달 납입료로 모든 비용 해결',
  },
  {
    icon: '💰',
    title: '초기비용 ZERO',
    description: '목돈 부담 없이 신차를 바로 운행할 수 있습니다',
  },
  {
    icon: '🔄',
    title: '만기 후 반납 또는 인수 선택',
    description: '계약 종료 후 원하는 방식으로 유연하게 선택하세요',
  },
  {
    icon: '📋',
    title: '법인 비용처리 가능',
    description: '세금계산서 발행, 전액 손금산입으로 절세 효과',
  },
] as const;

// ── 차종 비교 테이블 ────────────────────────────────
export const CAR_COMPARISON = {
  columns: ['국산 준중형', '국산 SUV', '수입 세단'] as const,
  rows: [
    { label: '월 납입료 시작가', values: ['월 28만원대~', '월 38만원대~', '월 55만원대~'] },
    { label: '계약 기간', values: ['24~60개월', '24~60개월', '36~60개월'] },
    { label: '초기비용', values: ['상담 후 확인', '상담 후 확인', '상담 후 확인'] },
    { label: '포함 항목', values: ['보험·세금·정기점검', '보험·세금·정기점검', '보험·세금·정기점검'] },
    { label: '주행거리 옵션', values: ['2만km/3만km/무제한', '2만km/3만km/무제한', '2만km/3만km'] },
  ],
  disclaimer: '※ 위 금액은 예시이며, 실제 납입료는 신용등급, 계약 조건 등에 따라 달라질 수 있습니다. 정확한 견적은 상담을 통해 안내드립니다.',
} as const;

// ── 장기렌트 vs 리스 vs 할부 비교 ──────────────────
export const COMPARISON_OPTIONS = {
  columns: ['장기렌트', '리스', '할부'] as const,
  rows: [
    { label: '초기비용', values: ['없음', '선납금 있음', '계약금 있음'] },
    { label: '월 납입금', values: ['취득세 포함', '취득세 별도', '취득세 별도'] },
    { label: '소유권', values: ['렌터사 보유', '리스사 보유', '내 명의'] },
    { label: '유지보수', values: ['포함', '별도', '별도'] },
    { label: '세금 처리', values: ['전액 비용처리', '일부 비용처리', '감가상각'] },
  ],
} as const;

// ── 상담 절차 ──────────────────────────────────────
export const PROCESS_STEPS = [
  { step: 1, icon: '📝', title: '견적 신청', description: '아래 폼을 작성해주세요' },
  { step: 2, icon: '📞', title: '담당자 연락', description: '영업일 1일 이내 연락드립니다' },
  { step: 3, icon: '📊', title: '맞춤 견적 발송', description: '차종·예산·조건별 최적 견적' },
  { step: 4, icon: '✍️', title: '계약 진행', description: '원하시는 조건으로 계약 체결' },
] as const;

// ── 신뢰 요소 ──────────────────────────────────────
export const TRUST = {
  partners: ['현대캐피탈', 'KB캐피탈', '하나캐피탈', '신한카드', '롯데캐피탈'],
  badges: [
    { label: '장기렌트 전문', value: COMPANY.yearsInBusiness },
    { label: '누적 계약', value: COMPANY.totalContracts },
  ],
  counselingHours: COMPANY.businessHours,
} as const;

// ── FAQ ────────────────────────────────────────────
export const FAQ_ITEMS = [
  {
    q: '장기렌트와 리스의 차이는 무엇인가요?',
    a: '장기렌트는 취득세, 보험료, 정비 비용이 월 납입료에 모두 포함되어 있고 계약 만기 후 반납이 원칙입니다. 리스는 차량 운용에 따른 비용을 이용자가 별도 부담하며, 만기 후 인수 또는 반납을 선택할 수 있습니다.',
  },
  {
    q: '월 납입료에는 어떤 비용이 포함되나요?',
    a: '자동차세, 보험료(대인·대물·자손), 정기 점검 및 소모품 교체 비용이 포함됩니다. 유류비와 주차비, 과태료는 별도입니다.',
  },
  {
    q: '신용등급이 낮아도 가능한가요?',
    a: '신용등급에 따라 한도나 조건이 달라질 수 있지만, 등급이 낮더라도 보증보험 가입이나 추가 담보를 통해 진행 가능한 경우가 많습니다. 개별 심사 결과에 따라 달라지므로 상담을 통해 확인해보세요.',
  },
  {
    q: '계약 기간 중 차량을 바꿀 수 있나요?',
    a: '계약 기간 중 차량 변경은 일반적으로는 어렵습니다. 다만 계약 조건에 따라 중도 해지 후 새 계약으로 전환하거나, 일부 업체의 경우 차량 교체 프로그램을 운영하기도 합니다.',
  },
  {
    q: '법인 명의로 계약하면 어떤 혜택이 있나요?',
    a: '렌트료 전액을 비용으로 처리할 수 있어 법인세 절감 효과가 있습니다. 세금계산서 발행이 가능하고, 차량 취득세와 등록세 부담이 없으며, 감가상각 관리가 필요 없습니다.',
  },
  {
    q: '견적 상담 후 계약까지 얼마나 걸리나요?',
    a: '견적 확정 후 신용 심사에 1~3영업일, 차량 출고까지 재고 상황에 따라 1~4주 정도 소요됩니다. 빠른 출고가 가능한 차종도 있으니 상담 시 확인해보세요.',
  },
] as const;

// ── 폼 셀렉트 옵션 ─────────────────────────────────
export const CAR_TYPE_OPTIONS = [
  { value: '', label: '선택해주세요' },
  { value: 'domestic_compact', label: '국산 준중형' },
  { value: 'domestic_midsize', label: '국산 중형' },
  { value: 'domestic_suv', label: '국산 SUV' },
  { value: 'import_sedan', label: '수입 세단' },
  { value: 'import_suv', label: '수입 SUV' },
  { value: 'other', label: '기타' },
] as const;

export const BUDGET_OPTIONS = [
  { value: '', label: '선택해주세요' },
  { value: 'under_30', label: '30만원 이하' },
  { value: '30_50', label: '30~50만원' },
  { value: '50_70', label: '50~70만원' },
  { value: 'over_70', label: '70만원 이상' },
  { value: 'undecided', label: '미정' },
] as const;

export const PERIOD_OPTIONS = [
  { value: '', label: '선택해주세요' },
  { value: '24', label: '24개월' },
  { value: '36', label: '36개월' },
  { value: '48', label: '48개월' },
  { value: '60', label: '60개월' },
  { value: 'undecided', label: '미정' },
] as const;

export const CONTACT_METHODS = [
  { value: 'phone', label: '전화 상담' },
  { value: 'visit', label: '방문 상담' },
] as const;

// ── 유효성 검사 ─────────────────────────────────────
export const PHONE_REGEX = /^01[016789]-?\d{3,4}-?\d{4}$/;
export const NAME_MIN_LENGTH = 2;

// ── CTA ────────────────────────────────────────────
export const CTA = {
  label: '무료 견적 상담 받기',
  phoneLabel: '전화 상담',
  formLabel: '견적 신청',
} as const;
