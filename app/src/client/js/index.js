'use strict'
const React = require('react')
const ReactDOM = require('react-dom')

const ThreadBox = require('./components/ThreadBox')

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
})
