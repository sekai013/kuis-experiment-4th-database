'use strict'
const React = require('react')
const ReactDOM = require('react-dom')
const ajax = require('jquery').ajax

const Question = require('./Question')
const CommentList = require('./CommentList')
const CommentForm = require('./CommentForm')

module.exports = class RequestView extends React.Component {
  constructor (props) {
    super(props)
    this.state = { comments: [], text:'', answer: '' }
  }

  fetchRequest (props) {
    props = props || this.props
    ajax({
      url: `http://${location.hostname}:${location.port}/api/threads/${props.threadId}/requests/${props.index}`,
      dataType: 'json',
      success: (data) => {
        this.setState({
          comments: data.comments,
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
    this.fetchRequest()
  }

  componentWillReceiveProps (nextProps) {
    this.fetchRequest(nextProps)
  }

  onClickMerge (event) {
    ajax({
      url: `http://${location.hostname}:${location.port}/api/threads/${this.props.threadId}/requests/${this.props.index}/merge`,
      method: 'POST',
      success: (data) => {
        window.location = `/#threads/${this.props.threadId}`
      },
      error: (xhr, status, error) => {
        console.error(xhr.status, error.toString())
      }
    })
  }

  onClickClose (event) {
    ajax({
      url: `http://${location.hostname}:${location.port}/api/threads/${this.props.threadId}/requests/${this.props.index}/close`,
      method: 'POST',
      success: (data) => {
        window.location = `/#threads/${this.props.threadId}/requests`
      },
      error: (xhr, status, error) => {
        console.error(xhr.status, error.toString())
      }
    })
  }

  onSubmitComment (childState, callback) {
    ajax({
      url: `http://${location.hostname}:${location.port}/api/threads/${this.props.threadId}/requests/${this.props.index}/comments/create`,
      method: 'POST',
      data: { text: childState.text },
      success: (data) => {
        this.fetchRequest()
        callback()
      },
      error: (xhr, status, error) => {
        console.error(xhr.status, error.toString())
      }
    })
  }

  render () {
    const btns = (
      <div className="center-block">
        <div className="row">
          <div className="col-sm-1 col-sm-offset-5">
            <button className="btn btn-default btn-lg center-block btn-merge"
                    onClick={this.onClickMerge.bind(this)} >
              Merge
            </button>
          </div>
          <div className="col-sm-1">
            <button className="btn btn-default btn-lg center-block btn-close"
                    onClick={this.onClickClose.bind(this)} >
              Close
            </button>
          </div>
        </div>
      </div>
    )
    return (
      <div className="requestView">
        <Question isRequest={true}
                  text={this.state.text}
                  answer={this.state.answer}
                  isEditActivated={false} />
        <CommentList comments={this.state.comments} />
        {this.props.isCreater ? btns : null}
        <CommentForm isUser={this.props.isUser}
                     onSubmitForm={this.onSubmitComment.bind(this)} />
      </div>
    )
  }
}
