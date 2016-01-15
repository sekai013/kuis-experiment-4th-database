'use strict'
const React = require('react')
const ReactDOM = require('react-dom')
module.exports = class QuestionForm extends React.Component {
  constructor (props) {
    super(props)
    this.state = { text: this.props.text || '', answer: this.props.answer || '' }
  }

  onChangeText (event) {
    this.setState({ text: event.target.value })
  }

  onChangeAnswer (event) {
    this.setState({ answer: event.target.value })
  }

  onSubmitForm (event) {
    event.preventDefault()
    if (! (this.state.text.trim() && this.state.answer.trim())) return
    if (this.props.isEditMode) {
      // post to server
    } else {
      if (typeof this.props.onSubmitForm !== 'function') return
      this.props.onSubmitForm(this.state)
    }
  }

  render () {
    return (
      <div className="panel panel-default">
        <div className="panel-heading">
          <h3 className="panel-title">
            {this.props.isEditMode ? 'Edit' : 'Create'} Question
          </h3>
        </div>
        <div className="panel-body">
          <form className="questionForm" onSubmit={this.onSubmitForm.bind(this)}>
            <div className="form-group">
              <label>Text</label>
              <textarea value={this.state.text}
                        className="form-control"
                        onChange={this.onChangeText.bind(this)} />
            </div>
            <div className="form-group">
              <label>Answer</label>
              <input type="text"
                     className="form-control"
                     value={this.state.answer}
                     onChange={this.onChangeAnswer.bind(this)} />
            </div>
            <button type="submit" className="btn btn-default">
              {this.props.isEditMode ? 'Done' : 'Create'}
            </button>
          </form>
        </div>
      </div>
    )
  }
}
