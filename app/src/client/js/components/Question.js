'use strict'
const React = require('react')
const ReactDOM = require('react-dom')
module.exports = class Question extends React.Component {
  constructor (props) {
    super(props)
    this.state = { userAnswer: '', symbol: '-', isShownAnswer: false }
  }

  onChangeAnswer (event) {
    this.setState({ userAnswer: event.target.value.trim() })
  }

  onBlurAnswer (event) {
    const symbol = this.props.answer === this.state.userAnswer ? '◯' : '✕'
    this.setState({ symbol: symbol })
  }

  onClickShowAnswer (event) {
    this.setState({ isShownAnswer: !this.state.isShownAnswer })
  }

  onClickDelete (event) {
    event.preventDefault()
    if (this.props.isEditActivated && typeof this.props.onClickDelete === 'function') {
      this.props.onClickDelete(this.props)
    }
  }

  render () {
    const answer = (
      <div className="answer">
        <h3>Answer: {this.props.answer}</h3>
      </div>
    )
    const textNodes = this.props.text.split('\n').map((text, i) => {
      return <p key={i}>{text}</p>
    })
    const editBtn = this.props.isEditActivated
                  ? <a href={`/#questions/${this.props.questionId}/edit`} className="btn btn-default">Edit</a>
                  : null
    const deleteBtn = this.props.isEditActivated
                    ? <button className="btn btn-default" onClick={this.onClickDelete.bind(this)}>Delete</button>
                    : null
    return (
      <div className="question panel panel-default">
        <div className="panel-heading">
          <h2 className="panel-title">
            {this.props.isRequest ? 'Requested Question' : `Q${this.props.index}`}
          </h2>
        </div>
        <div className="panel-body">
          {textNodes}
          <div className="row">
            <div className="col-sm-6">
              <input type="text"
                     className="form-control"
                     onChange={this.onChangeAnswer.bind(this)}
                     onBlur={this.onBlurAnswer.bind(this)} />
            </div>
            <div className="col-sm-3">
              <button className="btn btn-default" disabled="disabled">
                {this.state.symbol}
              </button>
            </div>
            <div className="col-sm-3">
              <button className="btn btn-default"
                      onClick={this.onClickShowAnswer.bind(this)}>
                {this.state.isShownAnswer ? 'Hide Answer' : 'Show Answer'}
              </button>
              {editBtn}
              {deleteBtn}
            </div>
          </div>
          {this.state.isShownAnswer ? answer : ''}
        </div>
      </div>
    )
  }
}
