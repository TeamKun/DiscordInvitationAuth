const { Client, Intents } = require('discord.js');
const Discord = require('discord.js')
const AXIOS = require('axios')
const CLIENT = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
const CONFIG = require('./config.json')
const HTTP_CONFIG = {
    headers: {
        "Content-type": "application/json",
    }
}

CLIENT.login(CONFIG.token)

CLIENT.on('messageCreate', async(msg) => {
    if (CONFIG.targetChannel != msg.channelId) {
        return
    }

    if (msg.author.bot) {
        return
    }

    let author = msg.author
    let sender = msg.guild.members.resolve(author)
    let role = msg.guild.roles.cache.find(r => r.id === CONFIG.authRole)

    // 認証済みユーザーの書き込みを禁止する
    if (sender.roles.cache.has(CONFIG.authRole)) {
        msg.delete()
        return
    }
    let params = {
        params: {
            userId: msg.author.id,
            userName: msg.author.tag,
            token: msg.content
        }
    }

    let res = await AXIOS.get(CONFIG.apiUrl, params)

    // 認証失敗
    if (!res.data.isSucceed) {
        console.log(`[INFO] SEND: ${params.userName}-${params.userId} => ${params.token}\n RESULT : ${res.data.error}`)
        msg.reply(`❌ 認証失敗...\nトークンに誤りがないか確認してください`)
        return
    }

    // 認証成功
    sender.roles.add(role)
    msg.reply(`🔴 認証成功!\nようこそ!`)
})