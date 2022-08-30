/**
 * HTTP Get
 * */
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
    return returnError('no match token')
  }

  // 対象のtokenを探す
  for (let i = 2; i <= sheet.getMaxRows(); i++) {

    // 行を取得
    let row = sheet.getRange(i, 1, 1, 6)
    let values = row.getValues()[0]

    // 一致
    if (values[2] == param.token && values[3] == '認証待ち') {
      // 認証済みに変更
      row.setValues([[values[0],values[1],values[2], '認証済み', param.userName, param.userId]])
      row.setFontColor('gray')
      return returnOk(true)
    }
  }

  // 有効なトークンなし
  return returnOk(false)
}

/**
 * パラメータのチェック
 * */
function checkParam(param) {
  try {
    const REGEX = /^[0-9]{1,}-[0-9a-z]{1,}$/
    if (!REGEX.test(param.token)) {
      return returnError('invalid token')
    }

    if (!param.userId) {
      return returnError('invalid parameter: userId')
    }

    if (!param.userName) {
      return returnError('invalid parameter: userName')
    }
  } catch(e) {
    console.log(e)
    return returnError('invalid parameter')
  }
}

/**
 * 成功を送信
 * */
function returnOk(bool) {
      return returnJson({
      isSucceed: bool
    })
}

/**
 * 失敗を送信
 * */
function returnError(msg) {
      return returnJson({
      isSucceed: false,
      error: msg
    })
}

/**
 * JSONを送信
 * */
function returnJson(json) {
  console.log(json)
  return ContentService.createTextOutput(JSON.stringify(json))
}

/**
 * 送られてきたトークンをJSON形式に変換
 * */
function parseTokenToJSON(token) {
  let words = token.split('-')
  return {
    sheetId: words[0],
    value: words[1]
  }
}

/**
 * カレントスプレッドシートからシートIDをもとにシートを取得
 * */
function getSheetById(sheets,id) {
  for (sheet of sheets) {
    if (sheet.getSheetId() == id) {
      return sheet
    }
  }
}


function test() {
  doGet({parameter:{token: '1897866153-nii5eotg', userId: '342414321', userName: 'bosatsu'}})
}