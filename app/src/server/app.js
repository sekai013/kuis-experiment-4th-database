'use strict'
require('babel-polyfill')
const path = require('path')
const Koa = require('koa')
const serve = require('koa-static')
const session = require('koa-generic-session')
const bodyParser = require('koa-bodyparser')
const passport = require('koa-passport')


const router = require('./router')
const api = require('./api')
const config = require('../config/config')
const app = new Koa()

// Settings

app.keys = [config.SessionSecret]
app.use(session())
app.use(bodyParser())

app.use(passport.initialize())
app.use(passport.session())

// Logger

app.use(function *(next) {
  let start = new Date
  yield next
  let ms = new Date - start
  console.log(`${this.method}: ${this.url} - ${ms}ms`)
})

// Routing

app.use(serve(path.resolve(__dirname, '../public')))
app.use(api.routes())
app.use(router.routes())

// Server Running

app.listen(3000, () => { console.log('Server Running.') })
