function sendMail() {

  // 招待URL入力
  let ui = SpreadsheetApp.getUi()
  let res = ui.prompt('招待メールを送信','Discordの招待URLを入力してください', ui.ButtonSet.OK_CANCEL)

  // cancel
  if (res.getSelectedButton() === ui.Button.CANCEL) {
    return
  }

  /** 招待URL */
  const URL = res.getResponseText()

  // URLチェック
  if (!isDiscordInvitationURL(URL)) {
      ui.alert('エラー： 不正なURL','招待URLは\nhttps://discord.gg/{コード}\nの形式です')
  }

  // 送信準備
  let sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  let sendTargetList = []
  for(let i = 2; i <= sheet.getMaxRows(); i++) {

      // 行を取得
      let row = sheet.getRange(i, 1, 1, 4)
      let values = row.getValues()[0]

      if (!mailSendValitdation(values)) {
        continue
      }

      sendTargetList.push(row)
    }

  // メール送信確認
  let serverName = sheet.getSheetName()
  let mailTitle = `${serverName}へのご招待`

  let confirmRes = ui.alert('送信確認',
  `以下の内容でメールを送信します\n
  タイトル: ${mailTitle}\n
  招待URL: ${URL}\n
  送信対象者: ${sendTargetList.length}名`,
  ui.ButtonSet.OK_CANCEL)

  // cancel
  if (confirmRes === ui.Button.CANCEL) {
    return
  }

  // メール送信
  let failCount = 0
  for (const targetRow of sendTargetList) {
    let targetValues = targetRow.getValues()[0]
    const MAIL_BODY = `
      ${targetValues[0]}様\n
      Discordサーバー: ${serverName}へ招待いたします。\n
      以下の招待URLからサーバーに入ってください。Discordアカウントを複数所持している方はサーバーに入室する際、アカウントに誤りがないか必ずご確認ください。\n
      サーバー入室後にアカウント認証の案内がありますので、それに従って下記の認証トークンを入力してください。\n
      招待URL： ${URL}\n
      認証トークン: ${targetValues[2]}
    `

    const OPTIONS = {name: serverName}

    // メール送信
    try {
      GmailApp.sendEmail(targetValues[1], mailTitle, MAIL_BODY, OPTIONS)
      targetRow.setValues([[targetValues[0],targetValues[1],targetValues[2],'認証待ち']])
      targetRow.setFontColor('green')
    // 送信失敗
    } catch (e) {
      targetRow.setValues([[targetValues[0],targetValues[1],targetValues[2],'送信失敗']])
      targetRow.setFontColor('red')
      failCount ++
    }
  }

  ui.alert('送信完了',
  `成功: ${sendTargetList.length - failCount}\n
  失敗: ${failCount}`,
  ui.ButtonSet.OK)
}

function isDiscordInvitationURL(text) {
  const REGEX = /^https:\/\/discord.gg\//
  return REGEX.test(text)
}

function mailSendValitdation(values) {
  for (let i = 0; i < 3; i++) {
    if (!values[i]) {
      return false
    }
  }

  if (values[3] !== '未送信') {
    return
  }
  return true
}
