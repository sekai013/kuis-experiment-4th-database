'use strict'
const React = require('react')
const ReactDOM = require('react-dom')
module.exports = class Comment extends React.Component {
  constructor (props) {
    super(props)
  }

  render () {
    const lines = this.props.text.split('\n').map((line, i) => {
      return <p key={i}>{line}</p>
    })
    const time = new Date(this.props.timestamp).toLocaleString('japanese')
                                               .replace(/-/g, '/')
    return (
      <div className="comment panel panel-default">
        <div className="panel-heading">
          <h3 className="panel-title">
            <a href={`/#users/${this.props.author}`}>{this.props.author}</a>
          </h3>
          {time}
        </div>
        <div className="panel-body">
          {lines}
        </div>
      </div>
    )
  }
}
