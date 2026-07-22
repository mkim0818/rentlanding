/**
 * Google Apps Script — Webhook for rentlanding lead form
 *
 * 배포 방법:
 * 1. Google Sheets → 확장 프로그램 → Apps Script
 * 2. 이 코드를 붙여넣고 SHEET_NAME을 실제 시트 이름으로 변경
 * 3. 배포 → 새 배포 → 웹 앱 (실행 권한: "나", 액세스 권한: "모든 사용자")
 * 4. 생성된 URL을 .env.local의 GOOGLE_SHEETS_URL에 저장
 */

const SHEET_NAME = '시트1'; // 실제 시트 이름으로 변경

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);

    // secret 검증 (선택)
    // if (data.secret !== 'rentlead-2026-secret') {
    //   return ContentService.createTextOutput(JSON.stringify({ ok: false, error: 'invalid secret' }))
    //     .setMimeType(ContentService.MimeType.JSON);
    // }

    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];

    // 헤더가 없으면 자동 생성
    if (headers.length === 0 || !headers[0]) {
      const newHeaders = [
        '제출일시', '이름', '연락처', '차종(요약)', '차량모델',
        '트림', '옵션', '외장컬러', '내장컬러',
        '고객유형', '희망시기', '월예산', '계약기간', '상담방식',
        '즉시출고', '추가용품',
        'carSlug', 'kakaoId',
        'utm_source', 'utm_medium', 'utm_campaign'
      ];
      sheet.getRange(1, 1, 1, newHeaders.length).setValues([newHeaders]);
      // 다시 읽기
      var h = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    } else {
      var h = headers;
    }

    const map = {
      '제출일시': new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' }),
      '이름': data.name || '',
      '연락처': data.phone || '',
      '차종(요약)': data.carType || '',
      '차량모델': data.carModel || '',
      '트림': data.carTrim || '',
      '옵션': data.carOptions || '',
      '외장컬러': data.carExteriorColor || '',
      '내장컬러': data.carInteriorColor || '',
      '고객유형': data.customerType || '',
      '희망시기': data.preferredPeriod || '',
      '월예산': data.budget || '',
      '계약기간': data.contractPeriod || '',
      '상담방식': data.contactMethod || '',
      '즉시출고': data.immediateDelivery === 'yes' ? '예' : '',
      '추가용품': data.additionalItems || '',
      'carSlug': data.carSlug || '',
      'kakaoId': data.kakaoId || '',
      'utm_source': data.utmSource || '',
      'utm_medium': data.utmMedium || '',
      'utm_campaign': data.utmCampaign || '',
    };

    const row = h.map(function(col) { return map[col] || ''; });
    sheet.appendRow(row);

    return ContentService.createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ ok: false, error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// GET 테스트용
function doGet() {
  return ContentService.createTextOutput(JSON.stringify({ ok: true, message: 'Apps Script is running' }))
    .setMimeType(ContentService.MimeType.JSON);
}
