/**
 * Google Sheets 연동 — Google Apps Script
 * 
 * 설정:
 * 1. Google Sheets 새로 만들기
 * 2. 확장 프로그램 > Apps Script 열기
 * 3. 아래 코드 붙여넣고 저장
 * 4. 배포 > 새 배포 > 웹 앱 (액세스 권한: "나" 또는 "모든 사용자")
 * 5. 생성된 URL을 NEXT_PUBLIC_GOOGLE_SHEETS_URL 환경변수에 등록
 *
 * 시트 첫 행(헤더):
 *   이름 | 연락처 | 차량 | 고객유형 | 희망시기 | UTM소스 | 등록일시
 */

const SHEET_NAME = '리드';

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
    
    // 첫 행에 헤더가 없으면 추가
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['이름', '연락처', '차량', '고객유형', '희망시기', 'UTM소스', '등록일시']);
    }
    
    sheet.appendRow([
      data.name || '',
      data.phone || '',
      data.carType || '',
      data.customerType || '',
      data.preferredPeriod || '',
      data.utmSource || '',
      new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' })
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (e) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: e.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
