function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('리드');
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['이름','연락처','차량','트림','옵션','컬러','고객유형','희망시기','즉시출고','카카오ID','UTM소스','UTM매체','UTM캠페인','등록일시']);
    }
    sheet.appendRow([
      data.name || '',
      data.phone || '',
      data.carModel || '',
      data.carTrim || '',
      data.carOptions || '',
      data.carColor || '',
      data.customerType || '',
      data.preferredPeriod || '',
      data.urgent || '',
      data.kakaoId || '',
      data.utmSource || '',
      data.utmMedium || '',
      data.utmCampaign || '',
      new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' })
    ]);
    return ContentService.createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (e) {
    return ContentService.createTextOutput(JSON.stringify({ ok: false }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
