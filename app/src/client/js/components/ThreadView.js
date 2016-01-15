'use strict'
const React = require('react')
const ReactDOM = require('react-dom')
const ajax = require('jquery').ajax

const QuestionList = require('./QuestionList')
const QuestionForm = require('./QuestionForm')

module.exports = class ThreadView extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      questions: [],
      requests: [],
      isCreater: false,
      title: '',
      message: '',
      messageType: ''
    }
  }

  fetchQuestions (props) {
    props = props || this.props
    ajax({
      url: `http://${location.hostname}:${location.port}/api/threads/${props.threadId}/questions`,
      dataType: 'json',
      success: (data) => {
        this.setState({
          questions: data.questions,
          isCreater: data.isCreater,
          title: data.title
        })
      },
      error: (xhr, status, error) => {
        console.error(xhr.status, error.toString())
        this.setState({
          message: 'Fetching Questions: Failed ;-( Please try again later.',
          messageType: 'warning'
        })
      }
    })
  }

  fetchRequests (props) {
    /* TODO */
  }

  componentDidMount () {
    this.fetchQuestions()
    this.fetchRequests()
  }

  componentWillReceiveProps(nextProps) {
    this.fetchQuestions(nextProps)
    this.fetchRequests(nextProps)
  }

  onSubmitForm (childState) {
    ajax({
      url: `http://${location.hostname}:${location.port}/api/threads/${this.props.threadId}/questions/create`,
      method: 'POST',
      data: { text: childState.text, answer: childState.answer },
      success: (data) => {
        this.setState({ message: 'Created!', messageType: 'success' })
        this.fetchRequests()
      },
      error: (xhr, status, error) => {
        console.error(xhr.status, error.toString())
        this.setState({
          message: 'Create Question: Failed ;-( Please try again later.',
          messageType: 'warning'
        })
      }
    })
  }

  render () {
    const msg = this.state.message && this.state.messageType
              ? (<div className={`panel panel-${this.state.messageType}`}>
                   <div className="panel-body">
                     {this.state.message}
                   </div>
                 </div>)
              : null
    return (
      <div className="threadView">
        <h2>{this.state.title}</h2>
        <ul className="nav nav-tabs" role="tablist">
          <li role="presentation"
              className={(this.props.mode === 'questions') ? 'active' : ''}>
            <a href={`/#threads/${this.props.threadId}`}
               role="tab"
               data-toggle="tab">
              Questions ({this.state.questions.length})
            </a>
          </li>
          <li role="presentation"
              className={(this.props.mode === 'requests') ? 'active' : ''}>
            <a href={`#threads/${this.props.threadId}/requests`}
               role="tab"
               data-toggle="tab">
              Requests ({this.state.requests.length})
            </a>
          </li>
        </ul>
        {this.props.mode === 'questions' ? <QuestionList questions={this.state.questions} isEditActivated={this.state.isCreater} /> : null}
        {msg}
        {this.state.isCreater ? <QuestionForm isEditMode={false} onSubmitForm={this.onSubmitForm.bind(this)} /> : null}
      </div>
    )
  }
}
