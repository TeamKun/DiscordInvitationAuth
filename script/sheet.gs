/**
 * シート作成
*/
function createSheet() {
  let ui = SpreadsheetApp.getUi()
  let dialogTitle = '新しいユーザーシートを作成する'
  let prompt = 'サーバー名を入力'
  let res = ui.prompt(dialogTitle, prompt, ui.ButtonSet.OK_CANCEL)

  // cancel
  if (res.getSelectedButton() === ui.Button.CANCEL) {
    return
  }

  // OK
  let sheetName = res.getResponseText()
  let newSheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet();
  newSheet.setName(sheetName);
  newSheet.getRange('A1').setValue('name').setBackgroundRGB(255,255,153)
  newSheet.getRange('B1').setValue('mail_adress').setBackgroundRGB(255,255,153)
  newSheet.getRange('C1').setValue('token').setBackgroundRGB(255,255,153)
  newSheet.getRange('D1').setValue('status').setBackgroundRGB(255,255,153)

  SpreadsheetApp.getActiveSpreadsheet().getSheet
}
