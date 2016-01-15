'use strict'
const React = require('react')
const ReactDOM = require('react-dom')

const Question = require('./Question')

module.exports = class QuestionList extends React.Component {
  constructor (props) {
    super(props)
  }

  render () {
    const questionNodes = this.props.questions.map((q) => {
      return (
        <Question questionId={q.questionId}
                  isEditActivated={this.props.isEditActivated}
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
