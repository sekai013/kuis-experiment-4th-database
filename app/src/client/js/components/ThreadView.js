'use strict'
const React = require('react')
const ReactDOM = require('react-dom')
const ajax = require('jquery').ajax

const QuestionList = require('./QuestionList')
const QuestionForm = require('./QuestionForm')
const RequestList = require('./RequestList')
const RequestView = require('./RequestView')

module.exports = class ThreadView extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      questions: [],
      requests: [],
      isUser: false,
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
    props = props || this.props
    ajax({
      url: `http://${location.hostname}:${location.port}/api/threads/${props.threadId}/requests`,
      dataType: 'json',
      success: (data) => {
        this.setState({
          requests: data.requests,
          isUser: data.isUser,
        })
      },
      error: (xhr, status, error) => {
        console.error(xhr.status, error.toString())
        this.setState({
          message: 'Fetching Requests: Failed ;-( Please try again later.',
          messageType: 'warning'
        })
      }
    })
  }

  componentDidMount () {
    this.fetchQuestions()
    this.fetchRequests()
  }

  componentWillReceiveProps(nextProps) {
    this.fetchQuestions(nextProps)
    this.fetchRequests(nextProps)
  }

  onClickDelete (childProps) {
    ajax({
      url: `http://${location.hostname}:${location.port}/api/threads/${this.props.threadId}/questions/${childProps.index}/delete`,
      method: 'POST',
      success: (data) => {
        this.setState({
          message: `Question ${childProps.index} Deleted.`,
          messageType: 'success'
        })
        this.fetchQuestions()
        setTimeout(() => { this.setState({ message: '', messageType: '' }) }, 1000)
      },
      error: (xhr, status, error) => {
        console.error(xhr.status, error.toString())
        this.setState({
          message: 'Delete Question: Failed ;-( Please try again later.',
          messageType: 'warning'
        })
      }
    })
  }

  onSubmitQuestion (childState, callback) {
    ajax({
      url: `http://${location.hostname}:${location.port}/api/threads/${this.props.threadId}/questions/create`,
      method: 'POST',
      data: { text: childState.text, answer: childState.answer },
      success: (data) => {
        this.setState({ message: 'Created!', messageType: 'success' })
        this.fetchQuestions()
        callback()
        setTimeout(() => { this.setState({ message: '', messageType: '' }) }, 1000)
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

  onSubmitRequest (childState, callback) {
    ajax({
      url: `http://${location.hostname}:${location.port}/api/threads/${this.props.threadId}/requests/create`,
      method: 'POST',
      data: { text: childState.text, answer: childState.answer },
      success: (data) => {
        this.setState({ message: 'Created!', messageType: 'success' })
        this.fetchRequests()
        callback()
        setTimeout(() => { this.setState({ message: '', messageType: '' }) }, 1000)
      },
      error: (xhr, status, error) => {
        console.error(xhr.status, error.toString())
        this.setState({
          message: 'Create Request: Failed ;-( Please try again later.',
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
    const questions = (
      <div>
        <QuestionList questions={this.state.questions}
                      onClickDelete={this.onClickDelete.bind(this)}
                      isEditActivated={this.state.isCreater} />
        {msg}
        {this.state.isCreater ? <QuestionForm isEditMode={false} isRequest={false} onSubmitForm={this.onSubmitQuestion.bind(this)} /> : null}
      </div>
    )
    const requests = (
      <div>
        <RequestList requests={this.state.requests} />
        {msg}
        {this.state.isUser ? <QuestionForm isEditMode={false} isRequest={true} onSubmitForm={this.onSubmitRequest.bind(this)} /> : null}
      </div>
    )
    const requestView = (
      <RequestView threadId={this.props.threadId} index={this.props.index} isCreater={this.state.isCreater} isUser={this.state.isUser} />
    )
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
              Requests ({this.state.requests.filter((r) => { return !r.isClosed }).length})
            </a>
          </li>
        </ul>
        { this.props.mode === 'questions' ? questions : null }
        { this.props.mode === 'requests' ? requests : null }
        { this.props.mode === 'requestView' ? requestView : null }
      </div>
    )
  }
}
