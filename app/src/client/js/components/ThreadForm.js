'use strict'
const React = require('react')
const ReactDOM = require('react-dom')
module.exports  = class ThreadForm extends React.Component {
  constructor (props) {
    super(props)
    this.state = { title: '' }
  }

  onSubmitForm (event) {
    event.preventDefault()
    if (this.state.title.trim() && typeof this.props.onSubmitForm === 'function') {
      this.setState({ title: this.state.title.trim() })
      this.props.onSubmitForm(this.state)
    }
  }

  onChangeTitle (event) {
    this.setState({ title: event.target.value })
  }

  render () {
    return (
      <div className="panel panel-default">
        <div className="panel-heading">
          <h3 className="panel-title">
            {this.props.isEditMode ? 'Edit' : 'Create'} Thread
          </h3>
        </div>
        <div className="panel-body">
          <form className="threadForm form-inline"
                onSubmit={this.onSubmitForm.bind(this)}>
            <div className="form-group">
              <label>Title</label>
              <input type="text"
                     className="form-control"
                     value={this.state.title}
                     onChange={this.onChangeTitle.bind(this)} />
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
