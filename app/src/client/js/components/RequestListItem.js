'use strict'
const React = require('react')
const ReactDOM = require('react-dom')
module.exports = class Request extends React.Component {
  constructor (props) {
    super(props)
  }

  render () {
    const href = `/#threads/${this.props.threadId}/requests/${this.props.index}`
    const time = new Date(this.props.timestamp).toLocaleString('japanese')
                                               .replace(/-/g, '/')
    return (
      <tr className="requestListItem">
        <td><a href={href}>Request {this.props.index}</a></td>
        <td><a href={`/#users/${this.props.creater}`}>{this.props.creater}</a></td>
        <td>{time}</td>
        { this.props.isClosed ? <td>Closed</td> : <td>Open</td> }
      </tr>
    )
  }
}
