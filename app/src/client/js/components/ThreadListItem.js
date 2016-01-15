'use strict'
const React = require('react')
const ReactDOM = require('react-dom')
module.exports = class ThreadListItem extends React.Component {
  constructor (props) {
    super(props)
  }

  onClickEdit (event) {
    if (this.props.isInDashboard && typeof this.props.onClickEdit === 'function') {
      this.props.onClickEdit(this.props)
    }
  }

  onClickDelete (event) {
    if (this.props.isInDashboard && typeof this.props.onClickDelete === 'function') {
      this.props.onClickDelete(this.props)
    }
  }

  render () {
    const time = new Date(this.props.timestamp).toLocaleString('japanese')
                                               .replace(/-/g, '/')
    const editBtn = (
      <td>
        <button className="btn btn-sm btn-default"
                onClick={this.onClickEdit.bind(this)}>
          Edit
        </button>
      </td>
    )
    const deleteBtn = (
      <td>
        <button className="btn btn-sm btn-danger"
                onClick={this.onClickDelete.bind(this)}>
          Delete
        </button>
      </td>
    )
    return (
      <tr className="threadListItem">
        <td><a href={`/#threads/${this.props.threadId}`}>{this.props.title}</a></td>
        <td><a href={`/#users/${this.props.creater}`}>{this.props.creater}</a></td>
        <td>{time}</td>
        {this.props.isInDashboard ? editBtn : null}
        {this.props.isInDashboard ? deleteBtn : null}
      </tr>
    )
  }
}
