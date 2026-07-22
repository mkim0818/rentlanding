#!/usr/bin/env python3
#!/usr/bin/env python3
"""
아마존카 API → src/lib/cars.ts 자동 업데이트

사용법:
  python3 scripts/update-cars.py

동작:
  - amazoncar.co.kr API에서 신차 154대 전체 데이터 수집
  - 트림·옵션·컬러·이미지 다운로드
  - src/lib/cars.ts 자동 생성
  - 이후 npm run build 로 SSG 재생성

소요시간: 약 3~5분 (API 호출 1,500+건 + 이미지 다운로드)
"""
import requests, json, re, os, sys
from concurrent.futures import ThreadPoolExecutor, as_completed

API = os.environ.get("AMAZONCAR_API_URL", "https://api.amazoncar.co.kr/api")
CT = {"경/소형승용":"경소형","중형승용":"중형","대형승용":"대형","SUV/RV":"SUV","화물/승합":"승합"}
FT = {"가솔린":"가솔린","하이브리드":"하이브리드","LPG":"LPG","전기":"전기","디젤":"디젤"}

ORIG = [
    ("morning-2026","기아","모닝"),("ray-2026","기아","레이"),
    ("casper-2026","현대","캐스퍼"),("avante-2026-hybrid","현대","아반떼"),
    ("k5-2026-lpi","기아","K5"),("sonata-2026-hybrid","현대","쏘나타"),
    ("granger-2026-hybrid","현대","그랜저"),("k8-2026","기아","K8"),
    ("g80-2026","제네시스","G80"),("seltos-2026-hybrid","기아","셀토스"),
    ("sportage-2026","기아","스포티지"),("tucson-2026-hybrid","현대","투싼"),
    ("sorento-2026-hybrid","기아","쏘렌토"),("santafe-2026-hybrid","현대","싼타페"),
    ("palisade-2026-hybrid","현대","팰리세이드"),("gv70-2026","제네시스","GV70"),
    ("carnival-2026-hybrid-9","기아","카니발"),("staria-2026-hybrid","현대","스타리아"),
    ("ev3-2026","기아","EV3"),("ev5-2026","기아","EV5"),
]

def slugify(brand, model, used):
    m = {'기아':'kia','현대':'hyundai','제네시스':'genesis','BMW':'bmw','벤츠':'mercedes',
         '아우디':'audi','폭스바겐':'volkswagen','도요타':'toyota','렉서스':'lexus',
         '볼보':'volvo','KGM':'kgm','르노코리아':'renault','한국지엠':'gm','테슬라':'tesla','BYD':'byd'}
    b = m.get(brand, re.sub(r'[^a-z]','',brand.lower()))
    n = model.lower()
    for o,nu in [("the new ",""),("더 뉴 ",""),("더뉴 ",""),("new ",""),
                  ("하이브리드","hybrid"),("가솔린","gasoline"),("디젤","diesel"),
                  ("전기","ev"),("lpg","lpg"),("터보","turbo"),("일렉트릭","electric"),
                  (" ","-"),(".",""),("(",""),(")",""),("/","-"),("'",""),
                  ("---","-"),("--","-")]:
        n = n.replace(o, nu)
    n = re.sub(r'[^a-z0-9-]','',n).strip('-')
    s = f"{b}-{n[:40]}-2026"
    if s in used:
        ctr = 2
        while f"{s}-{ctr}" in used: ctr += 1
        s = f"{s}-{ctr}"
    return s

def fetch(url, timeout=15):
    try:
        r = requests.get(url, timeout=timeout)
        if r.status_code == 200 and r.text.strip() and r.text not in ['[]','']:
            return r.json()
    except: pass
    return None

def download_img(url, path):
    if os.path.exists(path): return True
    try:
        r = requests.get(url, timeout=10)
        if r.status_code == 200:
            os.makedirs(os.path.dirname(path), exist_ok=True)
            with open(path, 'wb') as f: f.write(r.content)
            return True
    except: pass
    return False

def fetch_trim_options(cc, nc, code_str):
    """Fetch options for a specific trim from its Code (CarId CarSeq)"""
    parts = code_str.strip().split()
    if len(parts) < 2: return None
    cid, cseq = parts[0], parts[1]
    try:
        r = requests.get(f"{API}/Estimates/NewCars/DetailOptions/{cc}/{nc}/{cid}/{cseq}", timeout=10)
        if r.status_code == 200 and r.text.strip() and r.text != '[]':
            return r.json()
    except: pass
    return None

def main():
    # 1. Fetch all cars
    print("1. Fetching car list...", file=sys.stderr)
    cars = requests.post(f"{API}/Cars/NewCars/?offset=0&size=200", json={"filter":{}}, timeout=30).json()["items"]
    total = len(cars)
    
    # 2. Assign slugs
    print("2. Assigning slugs...", file=sys.stderr)
    slug_map, used = {}, set()
    for slug, brand, kw in ORIG:
        for c in cars:
            sb = ["제네시스","현대"] if brand == "제네시스" else [brand]
            if kw in c.get("차명","") and any(b in c.get("제조사","") for b in sb):
                slug_map[id(c)] = slug; used.add(slug); break
    for c in cars:
        if id(c) in slug_map: continue
        s = slugify(c.get("제조사",""), c.get("차명",""), used)
        slug_map[id(c)] = s; used.add(s)
    
    # 3. Fetch trims + colors
    print("3. Fetching trims/colors...", file=sys.stderr)
    with ThreadPoolExecutor(max_workers=15) as ex:
        futs = {}
        for c in cars:
            cc = c.get("제조사_코드",""); nc = c.get("차명_코드","")
            ci = c.get("CarId",""); cs = c.get("CarSeq","")
            if cc and nc:
                futs[ex.submit(fetch, f"{API}/Estimates/NewCars/Trims/{cc}/{nc}")] = ("trims", c)
            if cc and nc and ci and cs:
                futs[ex.submit(fetch, f"{API}/Estimates/NewCars/ExColors/{cc}/{nc}/{ci}/{cs}")] = ("excols", c)
                futs[ex.submit(fetch, f"{API}/Estimates/NewCars/InColors/{cc}/{nc}/{ci}/{cs}")] = ("incols", c)
                futs[ex.submit(fetch, f"{API}/Estimates/NewCars/Spec/{ci}/{cs}")] = ("spec", c)
        for f in as_completed(futs):
            typ, c = futs[f]
            try:
                d = f.result()
                if d: c[f"_{typ}"] = d
            except: pass
    
    # 4. Fetch TRIM-SPECIFIC options (key: for each trim, fetch its own options)
    print("4. Fetching trim-specific options...", file=sys.stderr)
    trim_option_requests = []
    for c in cars:
        cc = c.get("제조사_코드",""); nc = c.get("차명_코드","")
        trims_data = c.get("_trims") or []
        if not isinstance(trims_data, list): trims_data = []
        for t in trims_data:
            if isinstance(t, dict) and t.get("Code"):
                trim_option_requests.append((cc, nc, t.get("Code",""), c, t))
    
    with ThreadPoolExecutor(max_workers=15) as ex:
        futs2 = {}
        for cc, nc, code_str, c, t in trim_option_requests:
            futs2[ex.submit(fetch_trim_options, cc, nc, code_str)] = (c, t.get("Code",""))
        for f in as_completed(futs2):
            c, code = futs2[f]
            try:
                opts = f.result()
                if opts:
                    if "_trim_options" not in c:
                        c["_trim_options"] = {}
                    c["_trim_options"][code.strip()] = opts
            except: pass
    
    # 5. Download images
    print("5. Downloading images...", file=sys.stderr)
    img_dir, img_count = "public/images/cars", 0
    os.makedirs(img_dir, exist_ok=True)
    for c in cars:
        url = c.get("차명_이미지_URL",""); slug = slug_map.get(id(c),"")
        if url and slug:
            p = f"{img_dir}/{slug}.webp"
            if download_img(url.replace("/small","/medium"), p) or download_img(url, p):
                c["_img"] = f"/images/cars/{slug}.webp"; img_count += 1
    
    # 6. Generate cars.ts
    print("7. Generating cars.ts...", file=sys.stderr)
    entries = []
    trim_opt_count = 0
    
    for c in cars:
        slug = slug_map.get(id(c),"")
        ct = CT.get(c.get("차종",""), "SUV")
        ft = FT.get(c.get("연료",""), "가솔린")
        monthly = c.get("최소금액", 0)
        badge = "NEW" if c.get("신규여부") else ("인기" if c.get("인기여부") else "")
        img = c.get("_img", f"/images/cars/{slug}.svg")
        
        # carPrice from cheapest trim
        trims_data = c.get("_trims") or []
        if not isinstance(trims_data, list): trims_data = []
        car_price = 0
        if trims_data:
            prices = [t.get("Price",0) for t in trims_data if isinstance(t, dict) and t.get("Price")]
            if prices: car_price = min(prices)
        if not car_price: car_price = int(round(monthly * 48 / 0.03))
        
        # Specs
        spec_data = c.get("_spec") or {}
        text = spec_data.get("기본사양품목","") if isinstance(spec_data, dict) else ""
        disp, seats, trans = 0, 5, "A/T"
        dm = re.search(r'(\d+(?:\.\d+)?)\s*(cc|ℓ)', text)
        if dm:
            d = dm.group(1).replace('.','')
            disp = int(d) if len(d) >= 3 else int(float(dm.group(1)) * 1000)
        sm = re.search(r'(\d+)인승', text); 
        if sm: seats = int(sm.group(1))
        for t in ["8단 자동변속기","7단 DCT","6단 자동변속기","4단 자동변속기","자동 8단","자동 6단","자동 4단","DCT"]:
            if t in text: trans = t; break
        
        known = {
            "morning-2026":{"displacement":998,"seats":5,"fe":"14.7km/L","drivetrain":"2WD","trans":"자동4단"},
            "ray-2026":{"displacement":998,"seats":5,"fe":"12.9km/L","drivetrain":"2WD","trans":"자동4단"},
            "casper-2026":{"displacement":998,"seats":4,"fe":"12.8km/L","drivetrain":"2WD","trans":"A/T"},
            "avante-2026-hybrid":{"displacement":1580,"seats":5,"fe":"20.1km/L","drivetrain":"2WD","trans":"DCT"},
            "k5-2026-lpi":{"displacement":1999,"seats":5,"fe":"9.8km/L","drivetrain":"2WD","trans":"자동6단"},
            "sonata-2026-hybrid":{"displacement":1999,"seats":5,"fe":"18.2km/L","drivetrain":"2WD","trans":"A/T"},
            "granger-2026-hybrid":{"displacement":1598,"seats":5,"fe":"16.2km/L","drivetrain":"2WD","trans":"A/T"},
            "k8-2026":{"displacement":2497,"seats":5,"fe":"12.0km/L","drivetrain":"2WD","trans":"자동8단"},
            "g80-2026":{"displacement":2497,"seats":5,"fe":"10.2km/L","drivetrain":"2WD","trans":"A/T"},
            "seltos-2026-hybrid":{"displacement":1580,"seats":5,"fe":"14.3km/L","drivetrain":"2WD","trans":"DCT"},
            "sportage-2026":{"displacement":1598,"seats":5,"fe":"12.3km/L","drivetrain":"2WD","trans":"DCT"},
            "tucson-2026-hybrid":{"displacement":1598,"seats":5,"fe":"15.8km/L","drivetrain":"4WD","trans":"A/T"},
            "sorento-2026-hybrid":{"displacement":1598,"seats":5,"fe":"14.3km/L","drivetrain":"2WD","trans":"자동6단"},
            "santafe-2026-hybrid":{"displacement":1598,"seats":5,"fe":"13.8km/L","drivetrain":"2WD","trans":"A/T"},
            "palisade-2026-hybrid":{"displacement":2497,"seats":9,"fe":"11.2km/L","drivetrain":"2WD","trans":"A/T"},
            "gv70-2026":{"displacement":2497,"seats":5,"fe":"9.8km/L","drivetrain":"2WD","trans":"A/T"},
            "carnival-2026-hybrid-9":{"displacement":1598,"seats":9,"fe":"13.5km/L","drivetrain":"2WD","trans":"자동6단"},
            "staria-2026-hybrid":{"displacement":1598,"seats":9,"fe":"11.8km/L","drivetrain":"2WD","trans":"A/T"},
            "ev3-2026":{"displacement":0,"seats":5,"fe":"5.8km/kWh","drivetrain":"2WD","trans":"감속기"},
            "ev5-2026":{"displacement":0,"seats":5,"fe":"5.5km/kWh","drivetrain":"2WD","trans":"감속기"},
        }
        k = known.get(slug)
        sp = {"displacement":k["displacement"] if k else disp,
              "seats":k["seats"] if k else seats,
              "fuelEfficiency":k["fe"] if k else "정보없음",
              "drivetrain":k["drivetrain"] if k else "2WD",
              "transmission":k["trans"] if k else trans}
        
        # ── Structured trims with per-trim options ──
        trim_options_map = c.get("_trim_options", {}) or {}
        available_trims = []
        for t in trims_data:
            if isinstance(t, dict):
                code = (t.get("Code","") or "").strip()
                # Get trim-specific options
                trim_opts = trim_options_map.get(code, [])
                if not isinstance(trim_opts, list): trim_opts = []
                trim_specific_options = []
                for o in trim_opts:
                    n = o.get("name","") or o.get("Name","")
                    p = o.get("price",0) or o.get("Price",0)
                    d = o.get("상세설명","") or ""
                    if n and p:
                        trim_specific_options.append({"name":n, "price":int(p)})
                
                if trim_specific_options:
                    trim_opt_count += 1
                
                available_trims.append({
                    "name": t.get("SName","") or t.get("Name",""),
                    "price": t.get("Price",0),
                    "code": code,
                    "options": trim_specific_options,
                })
        
        # Default options (first trim's options, fallback for compatibility)
        default_options = available_trims[0].get("options",[]) if available_trims else []
        
        # ── Colors ──
        excols = c.get("_excols") or []
        if not isinstance(excols, list): excols = []
        exterior_colors = []
        for e in excols:
            if isinstance(e, dict):
                exterior_colors.append({"name":e.get("name",""),"price":e.get("price",0),"url":e.get("Url","")})
        incols = c.get("_incols") or []
        if not isinstance(incols, list): incols = []
        interior_colors = []
        for e in incols:
            if isinstance(e, dict):
                interior_colors.append({"name":e.get("name",""),"price":e.get("price",0),"url":e.get("Url","")})
        
        # Trim name display
        trim_name = ""
        if trims_data:
            trim_name = trims_data[0].get("SName","") or trims_data[0].get("Name","")
        if not trim_name and spec_data and isinstance(spec_data, dict):
            trim_name = spec_data.get("트림명","")
        
        badge_str = f"'{badge}'" if badge else 'null'
        
        entry = f"""  {{
    slug: '{slug}',
    brand: '{c.get("제조사","")}',
    model: '{c.get("차명","")}',
    trim: '{trim_name}',
    year: 2026,
    carType: '{ct}',
    fuelType: '{ft}',
    image: '{img}',
    carPrice: {car_price},
    baseMonthlyPrice: {monthly},
    badge: {badge_str},
    specs: {{ displacement: {sp['displacement']}, seats: {sp['seats']}, fuelEfficiency: '{sp['fuelEfficiency']}', drivetrain: '{sp['drivetrain']}', transmission: '{sp['transmission']}' }},
    options: {json.dumps(default_options, ensure_ascii=False)},
    availableTrims: {json.dumps(available_trims, ensure_ascii=False)},
    exteriorColors: {json.dumps(exterior_colors, ensure_ascii=False)},
    interiorColors: {json.dumps(interior_colors, ensure_ascii=False)},
    contractTermMultiplier: {{ 24: 1.33, 36: 1.14, 48: 1.0, 60: 0.90, 72: 0.83 }},
  }}"""
        entries.append(entry)
    
    # ── Generate ──
    ts = f"""// ── Amazoncar API v4 ({len(entries)} cars, {trim_opt_count} trim-specific option sets) ──

export interface CarOption {{
  name: string;
  price: number;
}}

export interface CarSpecs {{
  displacement: number;
  seats: number;
  fuelEfficiency?: string;
  drivetrain?: string;
  transmission?: string;
}}

export interface TrimOption {{
  name: string;
  price: number;
  code: string;
  options: CarOption[];
}}

export interface ColorOption {{
  name: string;
  price: number;
  url: string;
}}

export interface Car {{
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
  badge: '인기' | 'NEW' | '특가' | null;
  specs: CarSpecs;
  options: CarOption[];
  availableTrims: TrimOption[];
  exteriorColors: ColorOption[];
  interiorColors: ColorOption[];
  contractTermMultiplier: Record<number, number>;
}}

export const cars: Car[] = [
{','.join(entries)}
];

// ── Filter sort: 산업통상부 2026.06 내수 판매 + 시장 인지도 기준 ──
const BRAND_RANK: Record<string, number> = {{
  현대: 1, 기아: 2, 테슬라: 3, BMW: 4, 벤츠: 5, BYD: 6,
  제네시스: 7, KGM: 8, 르노코리아: 9, 한국지엠: 10,
  아우디: 11, 폭스바겐: 12, 렉서스: 13, 볼보: 14, 도요타: 15,
}};
const TYPE_RANK: Record<string, number> = {{
  SUV: 1, 중형: 2, 대형: 3, 경소형: 4, 승합: 5,
}};
const FUEL_RANK: Record<string, number> = {{
  하이브리드: 1, 가솔린: 2, 전기: 3, LPG: 4, 디젤: 5,
}};

export const ALL_BRANDS = [...new Set(cars.map((c) => c.brand))].sort((a, b) =>
  (BRAND_RANK[a] ?? 99) - (BRAND_RANK[b] ?? 99)
);
export const ALL_CAR_TYPES = [...new Set(cars.map((c) => c.carType))].sort((a, b) =>
  (TYPE_RANK[a] ?? 99) - (TYPE_RANK[b] ?? 99)
) as Car['carType'][];
export const ALL_FUEL_TYPES = [...new Set(cars.map((c) => c.fuelType))].sort((a, b) =>
  (FUEL_RANK[a] ?? 99) - (FUEL_RANK[b] ?? 99)
) as Car['fuelType'][];
export const PRICE_RANGES = [
  {{ label: '전체', min: 0, max: Infinity }},
  {{ label: '30만원 이하', min: 0, max: 300_000 }},
  {{ label: '30~50만원', min: 300_000, max: 500_000 }},
  {{ label: '50~70만원', min: 500_000, max: 700_000 }},
  {{ label: '70만원 이상', min: 700_000, max: Infinity }},
] as const;

export type SortOption = 'recommended' | 'price_asc' | 'price_desc';
export const SORT_OPTIONS: {{ value: SortOption; label: string }}[] = [
  {{ value: 'recommended', label: '추천순' }},
  {{ value: 'price_asc', label: '낮은 가격순' }},
  {{ value: 'price_desc', label: '높은 가격순' }},
];
"""
    with open("src/lib/cars.ts", "w") as f: f.write(ts)
    print(f"\n✅ Done: {total} cars, {img_count} images, {trim_opt_count} trim-specific option sets", file=sys.stderr)

if __name__ == "__main__":
    main()
