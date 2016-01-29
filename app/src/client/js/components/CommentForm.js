'use strict'
const React = require('react')
const ReactDOM = require('react-dom')
module.exports = class CommentForm extends React.Component {
  constructor (props) {
    super(props)
    this.state = { text: '' }
  }

  onChangeText (event) {
    this.setState({ text: event.target.value })
  }

  onSubmitForm (event) {
    event.preventDefault()
    if (this.state.text && this.props.isUser) {
      this.props.onSubmitForm(this.state, () => { this.setState({ text: '' }) })
    }
  }

  render () {
    const guest = (
      <p>To post a comment, please login <a href="/login">here</a>.</p>
    )
    const user = (
      <div>
        <div className="form-group">
          <label>Text</label>
          <textarea className="form-control"
                    onChange={this.onChangeText.bind(this)}
                    value={this.state.text} />
        </div>
        <button type="submit" className="btn btn-default">Post</button>
      </div>
    )
    return (
      <div className="panel panel-default">
        <div className="panel-heading">
          <h3 className="panel-title">Post Comment</h3>
        </div>
        <div className="panel-body">
          <form className="commentForm" onSubmit={this.onSubmitForm.bind(this)}>
            {this.props.isUser ? user : guest}
          </form>
        </div>
      </div>
    )
  }
}
