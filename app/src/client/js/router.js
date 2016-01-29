'use strict'
const React = require('react')
const ReactDOM = require('react-dom')

class Router {

  constructor () {
    this.hash = []
  }

  get (hash, func) {
    const eventListener = (event) => {
      const match = this.match(location.hash, hash)
      if (match.result) {
        func(match.params)
      }
    }

    this.hash.push(hash)
    window.addEventListener('hashchange', eventListener)
    eventListener()
  }

  defaultRoute (hash) {
    const eventListener = (event) => {
      for (let i in this.hash) {
        if (this.match(location.hash, this.hash[i]).result) return
      }
      window.location = hash
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
