'use strict'
const React = require('react')
const ReactDOM = require('react-dom')

const Question = require('./Question')

module.exports = class QuestionList extends React.Component {
  constructor (props) {
    super(props)
  }

  onClickDelete (childProps) {
    if (this.props.isEditActivated && typeof this.props.onClickDelete === 'function') {
      this.props.onClickDelete(childProps)
    }
  }

  render () {
    const questionNodes = this.props.questions.map((q) => {
      return (
        <Question questionId={q.questionId}
                  isEditActivated={this.props.isEditActivated}
                  onClickDelete={this.onClickDelete.bind(this)}
                  index={q._i}
                  answer={q.answer}
                  text={q.text}
                  key={q.questionId} />
      )
    })
    return (
      <div className="questionList">
        {questionNodes}
      </div>
    )
  }
}
