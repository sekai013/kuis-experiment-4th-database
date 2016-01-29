'use strict'
const React = require('react')
const ReactDOM = require('react-dom')
const $ = require('jquery')

const ThreadBox = require('./components/ThreadBox')
const ThreadView = require('./components/ThreadView')
const QuestionForm = require('./components/QuestionForm')

const Question = require('./components/Question')
const Comment = require('./components/Comment')
const RequestView = require('./components/RequestView')

const router = require('./router')

window.addEventListener('load', () => {

  router.get('#threads', () => {
    ReactDOM.render(
      <ThreadBox page={1} />,
      document.getElementById('container')
    )
  })
  router.get('#threads/page/:n', (params) => {
    ReactDOM.render(
      <ThreadBox page={+params.n} />,
      document.getElementById('container')
    )
  })
  router.get('#threads/:id', (params) => {
    ReactDOM.render(
      <ThreadView threadId={+params.id} mode="questions" />,
      document.getElementById('container')
    )
  })
  router.get('#threads/:id/requests', (params) => {
    ReactDOM.render(
      <ThreadView threadId={+params.id} mode="requests" />,
      document.getElementById('container')
    )
  })
  router.get('#questions/:id/edit', (params) => {
    ReactDOM.render(
      <QuestionForm questionId={+params.id} isEditMode={true} />,
      document.getElementById('container')
    )
  })
  router.get('#threads/:id/requests/:index', (params) => {
    ReactDOM.render(
      <ThreadView threadId={+params.id} index={+params.index} mode="requestView" />,
      document.getElementById('container')
    )
  })

  router.defaultRoute('#threads')

  $(document).on('keydown', '.answer', (event) => {
    console.log(1111111)
    if (event.keyCode === 13) {
      const inputs = Array.from(document.querySelectorAll('.answer'))
      const index = inputs.indexOf(event.target)
      const next = index + 1 === inputs.length ? 0 : index + 1
      inputs[next].focus()
      if (next === 0) {
        window.scrollTo(0, 0);
      }
    }
  })
})
