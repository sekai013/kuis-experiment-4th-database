'use strict'
const React = require('react')
const ReactDOM = require('react-dom')
const ajax = require('jquery').ajax

const ThreadList = require('./ThreadList')
const ThreadForm = require('./ThreadForm')

module.exports = class ThreadBox extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      page: this.props.page || 1,
      items: [],
      message: '',
      messageType: ''
    }
  }

  componentWillReceiveProps (nextProps) {
    this.setState({ page: nextProps.page })
  }

  componentDidMount () {
    ajax({
      url: `http://${location.hostname}:${location.port}/api/threads`,
      dataType: 'json',
      success: (items) => {
        this.setState({ items: items })
      },
      error: (xhr, status, error) => {
        console.error(status, error.toString())
        this.setState({
          message: 'Fetching Threads: Failed ;-( Please try again later.',
          messageType: 'warning'
        })
      }
    })
  }

  onSubmitForm (childProps) {
    console.log(childProps)
    ajax({
      url: `http://${location.hostname}:${location.port}/api/threads/create`,
      method: 'POST',
      data: { title: childProps.title },
      success: (data) => {
        this.setState({ message: 'Created!', messageType: 'success' })
        window.location = `/#threads/${data.threadId}`
      },
      error: (xhr, status, error) => {
        console.error(xhr.status, error.toString())
        const message = xhr.status === 401
                      ? <span>To create a thread, login <a href="/login">here!</a></span>
                      : 'Create Thread: Failed ;-( Please try again later.'
        this.setState({
          message: message,
          messageType: 'warning'
        })
      }
    })
  }

  render () {
    const lastPage = 1 + Math.floor(this.state.items.length / 10)
    const left = Math.max(1, this.state.page - 2)
    const right = Math.min(lastPage, this.state.page + 2)
    const prev = this.state.page === 1
               ? (<li className="disabled">
                    <a href="/#threads/page/1" aria-label="Previous">
                      <span aria-hidden="true">&laquo;</span>
                    </a>
                  </li>)
               : (<li><a href={`/#threads/page/${this.state.page - 1}`}
                         aria-label="Previous">
                    <span aria-hidden="true">&laquo;</span>
                  </a></li>)
    const next = this.state.page === lastPage
               ? (<li className="disabled">
                    <a href={`/#threads/page/${lastPage}`} aria-label="Next">
                      <span aria-hidden="true">&raquo;</span>
                    </a></li>)
               : (<li><a href={`/#threads/page/${this.state.page + 1}`}
                         aria-label="Next">
                    <span aria-hidden="true">&raquo;</span>
                  </a></li>)
    const pages = []
    for (let i = left; i <= right; i++) {
      pages.push(
        <li className={this.state.page === i ? "active" : ""} key={i}>
          <a href={`/#threads/page/${i}`}>{i}</a>
        </li>
      )
    }
    const msg = this.state.message && this.state.messageType
              ? (<div className={`panel panel-${this.state.messageType}`}>
                   <div className="panel-body">
                     {this.state.message}
                   </div>
                 </div>)
              : ""

    return (
      <div className="threadBox">
        <div className="panel panel-default">
          <div className="panel-heading">
            <nav>
              <ul className="pagination">
                {prev}
                {pages}
                {next}
              </ul>
            </nav>
          </div>
          <ThreadList size={10}
                      page={this.state.page}
                      items={this.state.items}
                      isInDashboard={false} />
        </div>
        {msg}
        <ThreadForm onSubmitForm={this.onSubmitForm.bind(this)} />
      </div>
    )
  }
}
