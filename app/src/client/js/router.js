'use strict'
const React = require('react')
const ReactDOM = require('react-dom')

class Router {

  get (hash, func) {
    const eventListener = (event) => {
      const match = this.match(location.hash, hash)
      if (match.result) {
        func(match.params)
      }
    }

    window.addEventListener('hashchange', eventListener)
    eventListener()
  }

  match (actualHash, hash) {
    const params = {}
    const actualHashArray = actualHash.slice(1).split('/')
    const hashArray = hash.slice(1).split('/')

    if (actualHashArray.length !== hashArray.length) {
      return { result: false }
    }

    for (let i = 0; i < actualHashArray.length; i++) {
      const h = hashArray[i]
      if (h[0] === ':') {
        params[h.slice(1)] = actualHashArray[i]
        continue
      }
      if (h !== actualHashArray[i]) {
        return { result: false }
      }
    }

    return { result: true, params: params }
  }
}

module.exports = new Router()
