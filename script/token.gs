function createToken() {
  let sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  for (let i = 2; i <= sheet.getMaxRows(); i++) {

      // 行を取得
      let row = sheet.getRange(i, 1, 1, 4)
      let values = row.getValues()[0]

      // name check
      if (!values[1]) {
        continue
      }

      // bad adress
      if (!isMailAdress(values[1])) {
        row.setValues([[values[0],values[1], '', 'bad adress']])
        row.setFontColor('red')
        continue
      }

      // 認証待ち(送信済み)は再生成しない
      if (values[3] === '認証待ち') {
        continue
      }

      // create token
      row.setValues([[values[0],values[1],genelateToken(sheet.getSheetId()), '未送信']])
      row.setFontColor('black')
    }
}

function isMailAdress(text) {
  const REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
  return REGEX.test(text)
}

function genelateToken(sheetId) {
  const LENGTH = 8 //生成したい文字列の長さ
  const SOURCE = "abcdefghijklmnopqrstuvwxyz123456789"
  let token = ''

  for(let i=0; i<LENGTH; i++){
    token += SOURCE[Math.floor(Math.random() * SOURCE.length)];
  }
  
  return `${sheetId}-${token}`
}