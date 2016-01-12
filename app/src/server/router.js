'use strict'
const path = require('path')
const router = require('koa-router')()
const views = require('co-views')
const passport = require('koa-passport')
const TwitterStrategy = require('passport-twitter').Strategy
const sqlite3 = require('co-sqlite3')

const render = views(path.resolve(__dirname, '../views'),
                     { map: { html: 'ejs' }, default: 'ejs' })
const config = require('../config/config')
const DBPath = path.resolve(__dirname, './db/database.sqlite3')

passport.serializeUser(function (profile, done) {
  done(null, profile.username)
})

passport.deserializeUser(function (id, done) {
  const sqlite = require('sqlite3').verbose()
  const DB = new sqlite.Database(DBPath);
  DB.serialize(() => {
    DB.get('SELECT * FROM users WHERE userId = ?', id, (err, data) => {
      if (!err && data === undefined) {
        DB.run('INSERT INTO users VALUES(?)', id, (err) => {
          done(err, { userId: data })
        })
      } else {
        done(err, data)
      }
    })
  })
})

passport.use(new TwitterStrategy({
  consumerKey: config.TwitterKey,
  consumerSecret: config.TwitterSecret,
  callbackURL: `http://${process.env.host || "127.0.0.1"}:${process.env.port || 3000}/auth/twitter/callback`
}, function callback (token, tokenSecret, profile, done) {
  passport.id = profile.username
  passport.iconUrl = profile._json.profile_image_url
  done(null, profile)
}))

const getDB = function *(next) {
  this.DB = yield sqlite3(DBPath)
  yield next
}

router.get('/', getDB, function *() {
  this.body = yield render('index', { title: 'Quizhub' })
})

router.get('/login', passport.authenticate('twitter'))

router.get('/logout', function *() {
  this.session = null
  this.redirect('/')
})

router.get('/auth/twitter/callback', passport.authenticate('twitter', {
  successRedirect: '/',
  failureRedirect: '/'
}))

module.exports = router
