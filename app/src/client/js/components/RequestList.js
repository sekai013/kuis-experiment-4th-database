'use strict'
const React = require('react')
const ReactDOM = require('react-dom')

const RequestListItem = require('./RequestListItem')

module.exports = class RequestList extends React.Component {
  constructor (props) {
    super(props)
    this.state = { isAll: false }
  }

  onChangeCheckbox (event) {
    this.setState({ isAll: event.target.checked })
  }

  render () {
    const requestNodes = this.props.requests.filter((r) => {
      return this.state.isAll || !r.isClosed
    }).map((r) => {
      return (<RequestListItem threadId={r.threadId}
                               index={r._i}
                               creater={r.userId}
                               timestamp={r.timestamp}
                               isClosed={r.isClosed}
                               requestId={r.requestId}
                               key={r.requestId} />)
    })
    return (
      <div className="panel panel-default">
        <div className="panel-heading">
          Show Closed Request <input type="checkbox" onChange={this.onChangeCheckbox.bind(this)} />
        </div>
        <table className="table requestList">
          <tbody>
            <tr>
              <th>Request</th>
              <th>Created by</th>
              <th>Created At</th>
              <th>Status</th>
            </tr>
            {requestNodes}
          </tbody>
        </table>
      </div>
    )
  }
}
