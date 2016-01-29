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

const auth = function *(next) {
  if (this.isAuthenticated()) {
    yield next
  } else {
    this.body = {
      status: 401,
      message: 'Authorization Required'
    }
    this.throw('Authorization Required', 401)
  }
}

router.get('/', getDB, function *() {
  this.body = yield render('index', { title: 'Quizhub' })
})

router.get('/login', passport.authenticate('twitter'))

router.get('/logout', function *() {
  this.session = null
  passport.id = null
  passport.iconUrl = null
  this.redirect('/')
})

router.get('/auth/twitter/callback', passport.authenticate('twitter', {
  successRedirect: '/',
  failureRedirect: '/'
}))

router.get('/api/threads', getDB, function *() {
  try {
    this.body = yield this.DB.all(
      'SELECT * FROM threads NATURAL JOIN create_thread ORDER BY timestamp DESC'
    )
  } catch (error) {
    this.status = 500
    this.body = { status: 500, message: 'Internal Server Error' }
  }
})

router.post('/api/threads/create', auth, getDB, function *() {
  try {
    const threads = yield this.DB.all('SELECT * FROM threads')
    const threadId = threads.length + 1
    const title = this.request.body.title
    const stmt1 = yield this.DB.prepare('INSERT INTO threads VALUES(?, ?)')
    yield stmt1.run(threadId, title)
    stmt1.finalize()
    const stmt2 = yield this.DB.prepare('INSERT INTO create_thread VALUES(?, ?, ?)')
    yield stmt2.run(passport.id, threadId, Date.now())
    stmt2.finalize()
    this.body = { status: 200, threadId: threadId }
  } catch (error) {
    this.status = 500
    this.body = { status: 500, message: 'Internal Server Error' }
    const stmt3 = yield this.DB.prepare('DELETE FROM threads WHERE threadId = ?')
    yield stmt3.run(threadId)
    stmt3.finalize()
    const stmt4 = yield this.DB.prepare('DELETE FROM create_thread WHERE userId = ? AND threadId = ?')
    yield stmt4.run(userId, threadId)
    stmt4.finalize()
  }
})

router.get('/api/threads/:id/questions', getDB, function *() {
  try {
    const thread = yield this.DB.get(
      'SELECT * FROM threads WHERE threadId = ?',
      [this.params.id]
    )
    const creater = yield this.DB.get(
      'SELECT userId from create_thread where threadId = ?',
      [this.params.id]
    )
    const questions = yield this.DB.all('SELECT * FROM (SELECT * FROM threads WHERE threadId = ?) NATURAL JOIN thread_question NATURAL JOIN (SELECT * FROM questions WHERE isRequest = 0 AND _i > 0) ORDER BY _i', [this.params.id])

    if (thread) {
      this.body = {
        status: 200,
        questions: questions,
        isCreater: creater.userId === passport.id,
        title: thread.title
      }
    } else {
      this.status = 404
      this.body = { status: 404, message: 'Not Found' }
    }
  } catch (error) {
    this.status = 500
    this.body = { status: 500, message: 'Internal Server Error' }
  }
})

router.post('/api/threads/:id/questions/create', auth, getDB, function *() {
  try {
    const creater = yield this.DB.get(
      'SELECT userId from create_thread where threadId = ?',
      [this.params.id]
    )

    if (creater && creater.userId === passport.id) {
      const questions = yield this.DB.all('SELECT * FROM questions')
      const questionId = questions.length + 1
      this.questionId = questionId
      const questionsInThread = yield this.DB.all(
        'SELECT * FROM thread_question NATURAL JOIN questions WHERE threadId = ? AND isRequest = 0',
        [this.params.id]
      )
      const index = questionsInThread.length + 1
      const stmt1 = yield this.DB.prepare(
        'INSERT INTO questions VALUES(?, ?, ?, ?, ?)'
      )
      yield stmt1.run(questionId,
                      this.request.body.text,
                      this.request.body.answer,
                      index,
                      0)
      stmt1.finalize()
      const stmt2 = yield this.DB.prepare('INSERT INTO thread_question VALUES(?, ?)')
      yield stmt2.run(this.params.id, questionId)
      stmt2.finalize()
      this.body = { status: 200 }
    } else {
      this.status = 404
      this.body = { status: 404, message: 'Not Found' }
    }
  } catch (error) {
    console.error(error.toString());
    this.status = 500
    this.body = { status: 500, message: 'Internal Server Error' }
    if (this.questionId) {
      const stmt3 = yield this.DB.prepare('DELETE FROM questions WHERE questionId = ?')
      yield stmt3.run(this.questionId)
      stmt3.finalize()
      const stmt4 = yield this.DB.prepare(
        'DELETE FROM thread_question =  WHERE threadId = ? AND questionId = ?'
      )
      yield stmt4.run(this.params.id, this.questionId)
      stmt4.finalize()
    }
  }
})

router.post('/api/threads/:id/questions/:index/delete', auth, getDB, function *() {
  try {
    const creater = yield this.DB.get(
      'SELECT userId from create_thread where threadId = ?',
      [this.params.id]
    )
    const target = yield this.DB.get(
      'SELECT * FROM thread_question NATURAL JOIN questions NATURAL JOIN (SELECT * FROM threads WHERE threadId = ?) WHERE _i = ?',
      [this.params.id, this.params.index]
    )
    this.target = target

    if (creater && creater.userId === passport.id && target) {
      const stmt1 = yield this.DB.prepare(
        'DELETE FROM questions WHERE questionId = ?'
      )
      yield stmt1.run(target.questionId)
      stmt1.finalize()
      const stmt2 = yield this.DB.prepare(
        'DELETE FROM thread_question WHERE questionId = ?'
      )
      yield stmt2.run(target.questionId)
      stmt2.finalize()
      yield this.DB.run(
        'DELETE FROM question_request WHERE questionId = ?',
        [target.questionId]
      )
      yield this.DB.run(
        'UPDATE questions SET questionId = questionId - 1 WHERE questionId > ?',
        [target.questionId]
      )
      yield this.DB.run(
        'UPDATE questions SET _i = _i - 1 WHERE _i > ?',
        [target._i]
      )
      yield this.DB.run(
        'UPDATE thread_question SET questionId = questionId - 1 WHERE questionId > ?',
        [target.questionId]
      )
      yield this.DB.run(
        'UPDATE question_request SET questionId = questionId - 1 WHERE questionId > ?',
        [target.questionId]
      )
      this.body = { status: 200 }
    } else {
      this.status = 404
      this.body = { status: 404, message: 'Not Found' }
    }
  } catch (error) {
    console.error(error.toString());
    this.status = 500
    this.body = { status: 500, message: 'Internal Server Error' }
    if (this.target) {
      const question = yield this.DB.get(
        'SELECT * FROM questions WHERE questionId = ?',
        [this.target.questionId]
      )
      if (! question) {
        const stmt3 = yield this.DB.prepare(
          'INSERT INTO questions VALUES(?, ?, ?, ?, ?)'
        )
        yield stmt3.run(this.target.questionId,
                        this.target.text,
                        this.target.answer,
                        this.target._i,
                        0)
        stmt3.finalize()
      }
      const questionsInThread = yield this.DB.prepare(
        'SELECT * FROM thread_question WHERE questionId = ?',
        [this.target.questionId]
      )
      if (! questionsInThread) {
        const stmt4 = yield this.DB.prepare(
          'INSERT INTO thread_question VALUES(?, ?)'
        )
        yield stmt4.run(this.params.id, this.target.questionId)
        stmt4.finalize()
      }
    }
  }
})

router.get('/api/questions/:id', getDB, function *() {
  try {
    const question = yield this.DB.get(
      'SELECT * FROM questions WHERE questionId = ?',
      [this.params.id]
    )
    this.status = question ? 200 : 404
    this.body = question
              ? { status: 200, question: question }
              : { status: 404, message: 'Not Found' }
  } catch (error) {
    this.status = 500
    this.body = { status: 500, message: 'Internal Server Error' }
  }
})

router.post('/api/questions/:id/edit', auth, getDB, function *() {
  try {
    const creater = yield this.DB.get(
      'SELECT userId, threadId FROM create_thread NATURAL JOIN thread_question where questionId = ?',
      [this.params.id]
    )

    if (!creater) {
      this.status = 404
      this.body = { status: 404, message: 'Not Found' }
      return
    }

    if (creater.userId !== passport.id) {
      this.status = 401
      this.body = { status: 401, message: 'Authorization Required' }
      return
    }

    this.target = yield this.DB.get(
      'SELECT * FROM questions WHERE questionId = ?',
      [this.params.id]
    )

    yield this.DB.run(
      'UPDATE questions SET text = ? WHERE questionId = ?',
      [this.request.body.text, this.params.id]
    )
    yield this.DB.run(
      'UPDATE questions SET answer = ? WHERE questionId = ?',
      [this.request.body.answer, this.params.id]
    )

    this.body = { status: 200, threadId: creater.threadId }
      
  } catch (error) {
    console.error(error.toString());
    this.status = 500
    this.body = { status: 500, message: 'Internal Server Error' }

    if (this.target) {
      yield this.DB.run(
        'UPDATE questions SET text = ? WHERE questionId = ?',
        [this.question.text, this.params.id]
      )
      yield this.DB.run(
        'UPDATE questions SET answer = ? WHERE questionId = ?',
        [this.question.answer, this.params.id]
      )
    }
  }
})

router.get('/api/threads/:id/requests', getDB, function * () {
  try {
    const requests = yield this.DB.all(
      'SELECT * FROM requests NATURAL JOIN thread_request NATURAL JOIN send_request WHERE threadId = ? ORDER BY timestamp DESC',
      [this.params.id]
    )
    this.body = {
      status: 200,
      requests: requests,
      isUser: !!passport.id
    }
  } catch (error) {
    console.error(error.toString());
    this.status = 500
    this.body = { status: 500, message: 'Internal Server Error' }
  }
})

router.get('/api/threads/:id/requests/:index', getDB, function * () {
  try {
    const request = yield this.DB.get(
      'SELECT * FROM requests NATURAL JOIN thread_request WHERE threadId = ? and _i = ?',
      [this.params.id, this.params.index]
    )

    if (!request) {
      this.status = 404
      this.body = { status: 404, message: 'Not Found' }
      return
    }

    const question = yield this.DB.get(
      'SELECT * FROM questions NATURAL JOIN question_request NATURAL JOIN questions WHERE requestId = ?',
      [request.requestId]
    )

    const comments = yield this.DB.all(
      'SELECT * FROM comments NATURAL JOIN request_comment NATURAL JOIN post_comment WHERE requestId = ?',
      [request.requestId]
    )

    this.body = {
      status: 200,
      question: question,
      comments: comments
    }

  } catch (error) {
    console.error(error.toString());
    this.status = 500
    this.body = { status: 500, message: 'Internal Server Error' }
  }
})

router.get('/api/requests/:id', getDB, function * () {
  try {
    const request = yield this.DB.get(
      'SELECT * FROM requests WHERE requestId = ?',
      [this.params.id]
    )

    if (!request) {
      this.status = 404
      this.body = { status: 404, message: 'Not Found' }
      return
    }

    const question = yield this.DB.get(
      'SELECT * FROM questions NATURAL JOIN question_request NATURAL JOIN questions WHERE requestId = ?',
      [this.params.id]
    )

    const comments = yield this.DB.all(
      'SELECT * FROM comments NATURAL JOIN request_comment NATURAL JOIN post_comment WHERE requestId = ?',
      [this.params.id]
    )

    this.body = {
      status: 200,
      question: question,
      comments: comments
    }

  } catch (error) {
    console.error(error.toString());
    this.status = 500
    this.body = { status: 500, message: 'Internal Server Error' }
  }
})

router.post('/api/threads/:id/requests/create', auth, getDB, function *() {
  try {
    const requests = yield this.DB.all('SELECT * FROM requests')
    const requestId= requests.length + 1
    this.requestId = requestId
    const requestsInThread = yield this.DB.all(
      'SELECT * FROM thread_request WHERE threadId = ?',
      [this.params.id]
    )
    const index = requestsInThread.length + 1
    const questions = yield this.DB.all('SELECT * FROM questions')
    const questionId = questions.length + 1

    yield this.DB.run(
      'INSERT INTO questions VALUES(?, ?, ?, ?, ?)',
      [questionId, this.request.body.text, this.request.body.answer, 0, 1]
    )
    const stmt1 = yield this.DB.prepare(
      'INSERT INTO requests VALUES(?, ?, ?)'
    )
    yield stmt1.run(requestId, index, 0)
    stmt1.finalize()
    yield this.DB.run(
      'INSERT INTO thread_question VALUES(?, ?)',
      [this.params.id, questionId]
    )
    yield this.DB.run(
      'INSERT INTO question_request VALUES(?, ?)',
      [questionId, requestId]
    )
    yield this.DB.run(
      'INSERT INTO send_request VALUES(?, ?, ?)',
      [passport.id, requestId, Date.now()]
    )
    const stmt2 = yield this.DB.prepare('INSERT INTO thread_request VALUES(?, ?)')
    yield stmt2.run(this.params.id, requestId)
    stmt2.finalize()
    this.body = { status: 200 }
  } catch (error) {
    console.error(error.toString());
    this.status = 500
    this.body = { status: 500, message: 'Internal Server Error' }
  }
})

router.post('/api/threads/:id/requests/:index/comments/create', auth, getDB, function *() {
  try {

    const request = yield this.DB.get('SELECT * FROM requests NATURAL JOIN thread_request WHERE threadId = ? AND _i = ?', [this.params.id, this.params.index])

    if (! request) {
      this.status = 404
      this.body = {
        status: 404,
        message: 'Target Request is not found'
      }
    }

    const comments = yield this.DB.all('SELECT * FROM comments')
    const commentId = comments.length + 1
    const commentsInRequest = yield this.DB.all(
      'SELECT * FROM request_comment WHERE requestId = ?',
      [request.requestId]
    )
    const index = commentsInRequest.length + 1

    yield this.DB.run(
      'INSERT INTO comments VALUES(?, ?, ?)',
      [commentId, index, this.request.body.text]
    )
    yield this.DB.run(
      'INSERT INTO post_comment VALUES(?, ?, ?)',
      [passport.id, commentId, Date.now()]
    )
    yield this.DB.run(
      'INSERT INTO request_comment VALUES(?, ?)',
      [request.requestId, commentId]
    )
    this.body = { status: 200 }
  } catch (error) {
    console.error(error.toString());
    this.status = 500
    this.body = { status: 500, message: 'Internal Server Error' }
  }
})

router.post('/api/threads/:id/requests/:index/merge', auth, getDB, function *() {
  try {

    const thread = yield this.DB.get(
      'SELECT * FROM threads NATURAL JOIN create_thread WHERE threadId = ?',
      [this.params.id]
    )

    if (! thread) {
      this.status = 404
      this.body = {
        status: 404,
        message: 'Target Thread is not found'
      }
    }

    if (passport.id !== thread.userId) {
      this.status = 401
      this.body = { status: 401, message: 'Authorization Required' }
    }

    const request = yield this.DB.get('SELECT * FROM requests NATURAL JOIN thread_request WHERE threadId = ? AND _i = ?', [this.params.id, this.params.index])

    if (! request) {
      this.status = 404
      this.body = {
        status: 404,
        message: 'Target Request is not found'
      }
    }

    const questions = yield this.DB.all('SELECT * FROM questions NATURAL JOIN thread_question WHERE threadId = ? AND _i > 0', [this.params.id])
    const question = yield this.DB.get('SELECT * FROM question_request NATURAL JOIN questions WHERE requestId = ?', [request.requestId])

    yield this.DB.run(
      'UPDATE requests SET isClosed = 1 WHERE requestId = ?',
      [request.requestId]
    )
    yield this.DB.run(
      'UPDATE questions SET isRequest = 0 WHERE questionId = ?',
      [question.questionId]
    )
    yield this.DB.run(
      'UPDATE questions SET _i = ? WHERE questionId = ?',
      [questions.length + 1, question.questionId]
    )
    this.body = { status: 200 }
  } catch (error) {
    console.error(error.toString());
    this.status = 500
    this.body = { status: 500, message: 'Internal Server Error' }
  }
})

router.post('/api/threads/:id/requests/:index/close', auth, getDB, function *() {
  try {

    const thread = yield this.DB.get(
      'SELECT * FROM threads NATURAL JOIN create_thread WHERE threadId = ?',
      [this.params.id]
    )

    if (! thread) {
      this.status = 404
      this.body = {
        status: 404,
        message: 'Target Thread is not found'
      }
    }

    if (passport.id !== thread.userId) {
      this.status = 401
      this.body = { status: 401, message: 'Authorization Required' }
    }

    const request = yield this.DB.get('SELECT * FROM requests NATURAL JOIN thread_request WHERE threadId = ? AND _i = ?', [this.params.id, this.params.index])

    if (! request) {
      this.status = 404
      this.body = {
        status: 404,
        message: 'Target Request is not found'
      }
    }

    yield this.DB.run(
      'UPDATE requests SET isClosed = 1 WHERE requestId = ?',
      [request.requestId]
    )

    this.body = { status: 200 }

  } catch (error) {
    console.error(error.toString());
    this.status = 500
    this.body = { status: 500, message: 'Internal Server Error' }
  }
})

module.exports = router
