'use strict'
const fs = require('fs')
const sqlite3 = require('sqlite3').verbose()

const DBPath = 'task_4.sqlite3'

if (fs.existsSync(DBPath)) {
  fs.unlinkSync(DBPath)
}

const DB = new sqlite3.Database(DBPath)

DB.serialize(() => {
  DB.run('create table users (user_id int primary key, password text)')
  DB.run('create table threads (thread_id int primary key, title text)')
  DB.run('create table requests (request_id int primary key, _i int)')
  DB.run('create table questions (questions_id int primary key, question text, _i int, is_request int)')
  DB.run('create table question_info (question primary key, answer text)')
  DB.run('create table comments (comment_id int primary key, _i int, content text)')
  DB.run('create table create_thread (user_id int, thread_id int, timestamp int, primary key(user_id, thread_id), foreign key(user_id) references users(user_id), foreign key(thread_id) references threads(thread_id))')
  DB.run('create table post_comment (user_id int, comment_id int, timestamp int, primary key(user_id, comment_id), foreign key(user_id) references users(user_id), foreign key(comment_id) references comments(comment_id))')
  DB.run('create table request_comment (request_id int, comment_id int, primary key(request_id, comment_id), foreign key(request_id) references requests(request_id), foreign key(comment_id) references comments(comment_id))')
  DB.run('create table thread_request (thread_id int, request_id int, primary key(thread_id, request_id), foreign key(thread_id) references threads(thread_id), foreign key(request_id) references requests(request_id))')
  DB.run('create table thread_question (thread_id int, question_id int, primary key(thread_id, question_id), foreign key(thread_id) references threads(thread_id), foreign key(question_id) references questions(question_id))')
  DB.run('create table send_request (user_id int, request_id int, primary key(user_id, request_id), foreign key(user_id) references users(user_id), foreign key(request_id) references requests(request_id))')

  let stmt = DB.prepare('insert into users values(?, ?)')

  for (let i = 0; i < 100; i++) {
    let pwd = Math.floor(Math.random() * 1e8).toString(16)
    stmt.run(i, pwd)
    console.log(`INSERT INTO users VALUES(${i}, ${pwd})`)
  }
})
