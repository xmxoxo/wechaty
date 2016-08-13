#!/usr/bin/env node

const Wechaty = require('..')

const log = Wechaty.log

const welcome = `
| __        __        _           _
| \\ \\      / /__  ___| |__   __ _| |_ _   _
|  \\ \\ /\\ / / _ \\/ __| '_ \\ / _\` | __| | | |
|   \\ V  V /  __/ (__| | | | (_| | |_| |_| |
|    \\_/\\_/ \\___|\\___|_| |_|\\__,_|\\__|\\__, |
|                                     |___/

=============== Powered by Wechaty ===============
       -------- https://wechaty.io --------

I'm a bot, my super power is download cloud bot from wechaty.io

__________________________________________________


`

const profile = process.env.WECHATY_PROFILE || 'io-bot'
let token = process.env.WECHATY_TOKEN

if (!token) {
  log.error('Bot', 'token not found: please set WECHATY_TOKEN in environment before run io-bot')
  // process.exit(-1)
  log.warn('Bot', 'set token to "DEMO" for demo purpose')
  token = 'DEMO'
} else {
  console.log(welcome)
  log.info('Bot', 'Starting for WECHATY_TOKEN: %s', token)
}

const bot = new Wechaty({
  profile
  , token // token for wechaty.io auth
})

bot
.on('login'	  , user => log.info('Bot', `${user.name()} logined`))
.on('logout'	, user => log.info('Bot', `${user.name()} logouted`))
.on('scan'    , ({url, code}) => log.info('Bot', '[%d] %s <-- Scan QR Code in url to login', code, url))
.on('message', m => {
  m.ready()
    .then(onMessage)
    .catch(e => log.error('Bot', 'ready: %s' , e))
})

bot.init()
.catch(e => {
  log.error('Bot', 'init() fail: %s', e)
  bot.quit()
  process.exit(-1)
})

const onMessage = function(m) {
  const from = m.from()
  const to = m.to()
  const content = m.toString()
  const room = m.room()

  // log.info('Bot', '%s<%s>:%s'
  //               , (room ? '['+room.name()+']' : '')
  //               , from.name()
  //               , m.toStringDigest()
  //         )

  if (/^wechaty|botie/i.test(m.get('content')) && !bot.self(m)) {
    bot.reply(m, 'https://www.wechaty.io')
      .then(_ => log.info('Bot', 'REPLIED to magic word "wechaty"'))
  }
}
/**
 *
 * To make heroku happy
 *
 */
if (process.env.DYNO) {
  const app = require('express')()

  app.get('/', function (req, res) {
    res.send('Wechaty IO Bot Alive!')
  })

  app.listen(process.env.PORT || 8080, function () {
    console.log('Wechaty IO Bot listening on port ' + process.env.PORT + '!')
  })
}