'use strict'
const React = require('react')
const ReactDOM = require('react-dom')

const Comment = require('./Comment')

module.exports = class CommentList extends React.Component {
  constructor (props) {
    super(props)
  }

  render () {
    const commentNodes = this.props.comments.map((c) => {
      return (
        <Comment author={c.userId}
                 text={c.text}
                 timestamp={c.timestamp}
                 key={c.commentId} />
      )
    })
    return (
      <div className="commentList">
        {commentNodes}
      </div>
    )
  }
}
