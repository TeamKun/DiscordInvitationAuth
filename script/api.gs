function doGet(e) {
  let param = e.parameter
  // パラメータチェック
  let error = checkParam(param)
  if (error) {
    return error
  }

  let token = parseTokenToJSON(param.token)

  // 対象のシートを取得
  let sheet = getSheetById(SpreadsheetApp.getActiveSpreadsheet().getSheets(), token.sheetId)
  if (!sheet) {
    return returnError('invalid token')
  }

  // 対象のtokenを探す
  for (let i = 2; i <= sheet.getMaxRows(); i++) {

    // 行を取得
    let row = sheet.getRange(i, 1, 1, 4)
    let values = row.getValues()[0]

    // 一致
    if (values[2] == param.token && values[3] == '認証待ち') {
      // 認証済みに変更
      row.setValues([[values[0],values[1],values[2], '認証済み']])
      row.setFontColor('gray')
      return returnOk(true)
    }
  }

  // 有効なトークンなし
  return returnOk(false)
}

function checkParam(param) {
  try {
    const REGEX = /^[0-9]{1,}-[0-9a-z]{1,}$/
    if (!REGEX.test(param.token)) {
      return returnError('invalid token')
    }
  } catch(e) {
    console.log(e)
    return returnError('invalid parameter')
  }
}

function returnOk(bool) {
      return returnJson({
      code: 200,
      result: bool
    })
}

function returnError(msg) {
      return returnJson({
      code: 500,
      error: msg
    })
}

function returnJson(json) {
  console.log(json)
  return ContentService.createTextOutput(JSON.stringify(json))
}

function parseTokenToJSON(token) {
  let words = token.split('-')
  return {
    sheetId: words[0].slice(1),
    value: words[1]
  }
}

function getSheetById(sheets,id) {
  for (sheet of sheets) {
    if (sheet.getSheetId() == id) {
      return sheet
    }
  }
}

function test() {
  doGet({parameter:{token: '1897866153-nii5eotg'}})
}