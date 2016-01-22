'use strict'
const React = require('react')
const ReactDOM = require('react-dom')
const ajax = require('jquery').ajax

module.exports = class QuestionForm extends React.Component {
  constructor (props) {
    super(props)
    this.state = { text: this.props.text || '', answer: this.props.answer || '' }
  }

  fetchQuestion (props) {
    props = props || this.props
    ajax({
      url: `http://${location.hostname}:${location.port}/api/questions/${props.questionId}`,
      dataType: 'json',
      success: (data) => {
        this.setState({
          text: data.question.text,
          answer: data.question.answer
        })
      },
      error: (xhr, status, error) => {
        console.error(xhr.status, error.toString())
      }
    })
  }

  componentDidMount () {
    if (this.props.isEditMode) {
      this.fetchQuestion()
    }
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.isEditMode) {
      this.fetchQuestion()
    }
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
      ajax({
        url: `http://${location.hostname}:${location.port}/api/questions/${this.props.questionId}/edit`,
        method: 'POST',
        dataType: 'json',
        data: this.state,
        success: (data) => {
          this.setState({ text: '', answer: '' })
          window.location = `/#threads/${data.threadId}`
        },
        error: (xhr, status, error) => {
          console.error(xhr.status, error.toString())
        }
      })
    } else {
      if (typeof this.props.onSubmitForm !== 'function') return
      this.props.onSubmitForm(this.state, () => {
        this.setState({
          text: '',
          answer: ''
        })
      })
    }
  }

  render () {
    return (
      <div className="panel panel-default">
        <div className="panel-heading">
          <h3 className="panel-title">
            {this.props.isEditMode ? 'Edit' : 'Create'} {this.props.isRequest ? 'Request' : 'Question'}
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
