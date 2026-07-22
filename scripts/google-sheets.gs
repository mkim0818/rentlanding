const SHEET_NAME = 'Leads';
const SECRET = 'rentlead-2026-secret'; // ← 원하는 비밀키로 변경

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    
    // 비밀키 검증
    if (data.secret !== SECRET) {
      return ContentService.createTextOutput(JSON.stringify({ ok: false, error: 'unauthorized' }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['이름','연락처','차량','고객유형','희망시기','예산','기간','상담방식','카카오ID','UTM소스','등록일시']);
    }
    sheet.appendRow([
      data.name || '', data.phone || '', data.carType || '', data.carModel || '',
      data.customerType || '', data.preferredPeriod || '',
      data.budget || '', data.contractPeriod || '',
      data.contactMethod || '', data.kakaoId || '',
      data.utmSource || '',
      new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' })
    ]);
    return ContentService.createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (e) {
    return ContentService.createTextOutput(JSON.stringify({ ok: false, error: e.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
