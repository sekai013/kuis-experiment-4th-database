'use strict'
const React = require('react')
const ReactDOM = require('react-dom')

const ThreadListItem = require('./ThreadListItem')

module.exports = class ThreadList extends React.Component {
  constructor (props) {
    super(props)
  }

  onClickEdit (childProps) {
    if (this.props.isInDashboard && typeof this.props.onClickEdit === 'function') {
      this.props.onClickEdit(childProps)
    }
  }

  onClickDelete (childProps) {
    if (this.props.isInDashboard && typeof this.props.onClickDelete === 'function') {
      this.props.onClickDelete(childProps)
    }
  }

  render () {
    const start = this.props.size * (this.props.page - 1)
    const end = start + this.props.size
    const threadNodes = this.props.items.slice(start, end).map((t) => {
      return <ThreadListItem threadId={t.threadId}
                             title={t.title}
                             creater={t.userId}
                             timestamp={t.timestamp}
                             isInDashboard={this.props.isInDashboard}
                             onClickEdit={this.onClickEdit.bind(this)}
                             onClickDelete={this.onClickDelete.bind(this)}
                             key={t.threadId} />
    })
    return (
      <table className="table threadList">
        <tbody>
          <tr>
            <th>Title</th>
            <th>Created by</th>
            <th>Created At</th>
          </tr>
          {threadNodes}
        </tbody>
      </table>
    )
  }
}
