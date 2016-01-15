'use strict'
const React = require('react')
const ReactDOM = require('react-dom')
const TestUtils = require('react-addons-test-utils')
const sinon = require('sinon')
const expect = require('expect')
const expectJSX = require('expect-jsx')
expect.extend(expectJSX)

const ThreadListItem = require('../client/js/components/ThreadListItem')
const ThreadList = require('../client/js/components/ThreadList')
const ThreadForm = require('../client/js/components/ThreadForm')
const ThreadBox = require('../client/js/components/ThreadBox')
const Question = require('../client/js/components/Question')
const QuestionList = require('../client/js/components/QuestionList')
const QuestionForm = require('../client/js/components/QuestionForm')
const ThreadView = require('../client/js/components/ThreadView')

describe('ThreadListItem', () => {
  let renderer = null

  beforeEach(() => {
    renderer = TestUtils.createRenderer()
  })

  it('render isInDashboard=true', () => {
    renderer.render(
      <ThreadListItem threadId={1}
                      title="Test Thread 01"
                      creater="Foo"
                      timestamp={1452215370864}
                      isInDashboard={true} />
    )
    const rendered = renderer.getRenderOutput()
    const expected = (
      <tr className="threadListItem">
        <td><a href="/#threads/1">Test Thread 01</a></td>
        <td><a href="/#users/Foo">Foo</a></td>
        <td>2016/01/08 10:09:30</td>
        <td>
          <button className="btn btn-sm btn-default" onClick={() => {}}>
            Edit
          </button>
        </td>
        <td>
          <button className="btn btn-sm btn-danger" onClick={() => {}}>
            Delete
          </button>
        </td>
      </tr>
    )
    expect(rendered).toEqualJSX(expected)
  })

  it('render isInDashboard=false', () => {
    renderer.render(
      <ThreadListItem threadId={1}
                      title="Test Thread 01"
                      creater="Foo"
                      timestamp={1452215370864}
                      isInDashboard={false} />
    )
    const rendered = renderer.getRenderOutput()
    const expected = (
      <tr className="threadListItem">
        <td><a href="/#threads/1">Test Thread 01</a></td>
        <td><a href="/#users/Foo">Foo</a></td>
        <td>2016/01/08 10:09:30</td>
      </tr>
    )
    expect(rendered).toEqualJSX(expected)
  })
})

describe('ThreadList', () => {
  let renderer = null
  const items = [
    {
      threadId: 1,
      title: 'Test Thread 01',
      userId: 'Foo',
      timestamp: 1452215370864
    },
    {
      threadId: 2,
      title: 'Test Thread 02',
      userId: 'Bar',
      timestamp: 1452215370864
    },
    {
      threadId: 3,
      title: 'Test Thread 03',
      userId: 'Baz',
      timestamp: 1452215370864
    }
  ]

  beforeEach(() => {
    renderer = TestUtils.createRenderer()
  })

  it('render isInDashboard=true', () => {
    renderer.render(
      <ThreadList size={2} items={items} page={1} isInDashboard={true} />
    )
    const rendered = renderer.getRenderOutput()
    const expected = (
      <table className="table threadList">
        <tbody>
          <tr>
            <th>Title</th>
            <th>Created by</th>
            <th>Created At</th>
          </tr>
          <ThreadListItem threadId={1}
                          title="Test Thread 01"
                          creater="Foo"
                          timestamp={1452215370864}
                          isInDashboard={true}
                          onClickEdit={() => {}}
                          onClickDelete={() => {}} />
          <ThreadListItem threadId={2}
                          title="Test Thread 02"
                          creater="Bar"
                          timestamp={1452215370864}
                          isInDashboard={true}
                          onClickEdit={() => {}}
                          onClickDelete={() => {}} />
        </tbody>
      </table>
    )
    expect(rendered).toEqualJSX(expected)
  })

  it('render isInDashboard=false', () => {
    renderer.render(
      <ThreadList size={2} items={items} page={1} isInDashboard={false} />
    )
    const rendered = renderer.getRenderOutput()
    const expected = (
      <table className="table threadList">
        <tbody>
          <tr>
            <th>Title</th>
            <th>Created by</th>
            <th>Created At</th>
          </tr>
          <ThreadListItem threadId={1}
                          title="Test Thread 01"
                          creater="Foo"
                          timestamp={1452215370864}
                          isInDashboard={false}
                          onClickEdit={() => {}}
                          onClickDelete={() => {}} />
          <ThreadListItem threadId={2}
                          title="Test Thread 02"
                          creater="Bar"
                          timestamp={1452215370864}
                          isInDashboard={false}
                          onClickEdit={() => {}}
                          onClickDelete={() => {}} />
        </tbody>
      </table>
    )
    expect(rendered).toEqualJSX(expected)
  })

  it('onClickEdit', () => {
    const spy = sinon.spy()
    const rendered = TestUtils.renderIntoDocument(
      <ThreadList size={2}
                  items={items}
                  page={1}
                  isInDashboard={true}
                  onClickEdit={spy} />
    )
    const btn = TestUtils.scryRenderedDOMComponentsWithTag(rendered, 'button')
    expect(spy.called).toEqual(false)
    TestUtils.Simulate.click(btn[0])
    expect(spy.called).toEqual(true)
  })

  it('onClickDelete', () => {
    const spy = sinon.spy()
    const rendered = TestUtils.renderIntoDocument(
      <ThreadList size={2}
                  items={items}
                  page={1}
                  isInDashboard={true}
                  onClickDelete={spy} />
    )
    const btn = TestUtils.scryRenderedDOMComponentsWithTag(rendered, 'button')
    expect(spy.called).toEqual(false)
    TestUtils.Simulate.click(btn[1])
    expect(spy.called).toEqual(true)
  })
})

describe('ThreadForm', () => {
  let renderer = null

  beforeEach(() => {
    renderer = TestUtils.createRenderer()
  })

  it('render isEditMode=true', () => {
    renderer.render(<ThreadForm isEditMode={true} onSubmitForm={() => {}} />)
    const rendered = renderer.getRenderOutput()
    const expected = (
      <div className="panel panel-default">
        <div className="panel-heading">
          <h3 className="panel-title">Edit Thread</h3>
        </div>
        <div className="panel-body">
          <form className="threadForm form-inline" onSubmit={() => {}}>
            <div className="form-group">
              <label>Title</label>
              <input type="text"
                     className="form-control"
                     value=""
                     onChange={() => {}} />
            </div>
            <button type="submit" className="btn btn-default">Done</button>
          </form>
        </div>
      </div>
    )
    expect(rendered).toEqualJSX(expected)
  })

  it('render isEditMode=false', () => {
    renderer.render(<ThreadForm isEditMode={false} onSubmitForm={() => {}} />)
    const rendered = renderer.getRenderOutput()
    const expected = (
      <div className="panel panel-default">
        <div className="panel-heading">
          <h3 className="panel-title">Create Thread</h3>
        </div>
        <div className="panel-body">
          <form className="threadForm form-inline" onSubmit={() => {}}>
            <div className="form-group">
              <label>Title</label>
              <input type="text"
                     className="form-control"
                     value=""
                     onChange={() => {}} />
            </div>
            <button type="submit" className="btn btn-default">Create</button>
          </form>
        </div>
      </div>
    )
    expect(rendered).toEqualJSX(expected)
  })

  it('onChangeTitle', () => {
    const rendered = TestUtils.renderIntoDocument(<ThreadForm />)
    const input = TestUtils.scryRenderedDOMComponentsWithTag(rendered, 'input')

    TestUtils.Simulate.change(input[0], { target: { value: 'Foo' } })
    expect(rendered.state.title).toEqual('Foo')
  })

  it('onSubmitForm', () => {
    const spy = sinon.spy()
    const rendered = TestUtils.renderIntoDocument(
      <ThreadForm onSubmitForm={spy}/>
    )
    const form = TestUtils.scryRenderedDOMComponentsWithTag(rendered, 'form')
    const input = TestUtils.scryRenderedDOMComponentsWithTag(rendered, 'input')

    expect(spy.called).toEqual(false)
    TestUtils.Simulate.submit(form[0])
    expect(spy.called).toEqual(false)
    TestUtils.Simulate.change(input[0], { target: { value: 'Foo' } })
    TestUtils.Simulate.submit(form[0])
    expect(spy.called).toEqual(true)
  })
})

describe('ThreadBox', () => {
  let renderer = null

  beforeEach(() => {
    renderer = TestUtils.createRenderer()
  })

  it('render', () => {
    renderer.render(<ThreadBox page={1} />)
    const rendered = renderer.getRenderOutput()
    const expected = (
      <div className="threadBox">
        <div className="panel panel-default">
          <div className="panel-heading">
            <nav>
              <ul className="pagination">
                <li className="disabled">
                  <a href="/#threads/page/1" aria-label="Previous">
                    <span aria-hidden="true">&laquo;</span>
                  </a>
                </li>
                <li className="active">
                  <a href="/#threads/page/1">1</a>
                </li>
                <li className="disabled">
                  <a href="/#threads/page/1" aria-label="Next">
                    <span aria-hidden="true">&raquo;</span>
                  </a>
                </li>
              </ul>
            </nav>
          </div>
          <ThreadList size={10} page={1} items={[]} isInDashboard={false} />
        </div>
        <ThreadForm onSubmitForm={() => {}} />
      </div>
    )
    expect(rendered).toEqualJSX(expected)
  })
})

describe('Question', () => {
  let renderer = null

  beforeEach(() => {
    renderer = TestUtils.createRenderer()
  })

  it('render isRequest=true', () => {
    renderer.render(
      <Question answer="Foo"
                isRequest={true}
                text={"This is a sample question.\nSecond Line."} />
    )
    const rendered = renderer.getRenderOutput()
    const expected = (
      <div className="question panel panel-default">
        <div className="panel-heading">
          <h2 className="panel-title">Requested Question</h2>
        </div>
        <div className="panel-body">
          <p>This is a sample question.</p>
          <p>Second Line.</p>
          <div className="row">
            <div className="col-sm-6">
              <input type="text"
                     className="form-control"
                     onChange={() => {}}
                     onBlur={() => {}} />
            </div>
            <div className="col-sm-3">
              <button className="btn btn-default" disabled="disabled">-</button>
            </div>
            <div className="col-sm-3">
              <button className="btn btn-default" onClick={() => {}}>
                Show Answer
              </button>
            </div>
          </div>
        </div>
      </div>
    )
    expect(rendered).toEqualJSX(expected)
  })

  it('render isRequest=false', () => {
    renderer.render(
      <Question index={1}
                answer="Foo"
                isRequest={false}
                text={"This is a sample question.\nSecond Line."} />
    )
    const rendered = renderer.getRenderOutput()
    const expected = (
      <div className="question panel panel-default">
        <div className="panel-heading">
          <h2 className="panel-title">Q1</h2>
        </div>
        <div className="panel-body">
          <p>This is a sample question.</p>
          <p>Second Line.</p>
          <div className="row">
            <div className="col-sm-6">
              <input type="text"
                     className="form-control"
                     onChange={() => {}}
                     onBlur={() => {}} />
            </div>
            <div className="col-sm-3">
              <button className="btn btn-default" disabled="disabled">-</button>
            </div>
            <div className="col-sm-3">
              <button className="btn btn-default" onClick={() => {}}>
                Show Answer
              </button>
            </div>
          </div>
        </div>
      </div>
    )
    expect(rendered).toEqualJSX(expected)
  })

  it('render isEditActivated=true', () => {
    renderer.render(
      <Question index={1}
                answer="Foo"
                isRequest={false}
                isEditActivated={true}
                questionId={123}
                text={"This is a sample question.\nSecond Line."} />
    )
    const rendered = renderer.getRenderOutput()
    const expected = (
      <div className="question panel panel-default">
        <div className="panel-heading">
          <h2 className="panel-title">Q1</h2>
        </div>
        <div className="panel-body">
          <p>This is a sample question.</p>
          <p>Second Line.</p>
          <div className="row">
            <div className="col-sm-6">
              <input type="text"
                     className="form-control"
                     onChange={() => {}}
                     onBlur={() => {}} />
            </div>
            <div className="col-sm-3">
              <button className="btn btn-default" disabled="disabled">-</button>
            </div>
            <div className="col-sm-3">
              <button className="btn btn-default" onClick={() => {}}>
                Show Answer
              </button>
              <a href="/#questions/123/edit" className="btn btn-default">
                Edit
              </a>
              <button className="btn btn-default" onClick={() => {}}>
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    )
    expect(rendered).toEqualJSX(expected)
  })

  it('onChangeAnswer', () => {
    const rendered = TestUtils.renderIntoDocument(
      <Question index={1}
                answer="Foo"
                isRequest={false}
                text="This is a sample question." />
    )
    const input = TestUtils.scryRenderedDOMComponentsWithTag(rendered, 'input')

    TestUtils.Simulate.change(input[0], { target: { value: 'Foo' } })
    expect(rendered.state.userAnswer).toEqual('Foo')
  })

  it('onBlurAnswer', () => {
    const rendered = TestUtils.renderIntoDocument(
      <Question index={1}
                answer="Foo"
                isRequest={false}
                text="This is a sample question." />
    )
    const input = TestUtils.scryRenderedDOMComponentsWithTag(rendered, 'input')

    TestUtils.Simulate.change(input[0], { target: { value: 'Foo' } })
    TestUtils.Simulate.blur(input[0])
    expect(rendered.state.symbol).toEqual('◯')
    TestUtils.Simulate.change(input[0], { target: { value: 'Bar' } })
    TestUtils.Simulate.blur(input[0])
    expect(rendered.state.symbol).toEqual('✕')
  })

  it('onClickShowAnswer', () => {
    const rendered = TestUtils.renderIntoDocument(
      <Question index={1}
                answer="Foo"
                isRequest={false}
                text="This is a sample question." />
    )
    const btn = TestUtils.scryRenderedDOMComponentsWithTag(rendered, 'button')

    expect(rendered.state.isShownAnswer).toEqual(false)
    TestUtils.Simulate.click(btn[1])
    expect(rendered.state.isShownAnswer).toEqual(true)
  })
})

describe('QuestionList', () => {
  let renderer = null

  beforeEach(() => {
    renderer = TestUtils.createRenderer()
  })

  it('render', () => {
    const questions = [
      {
        questionId: 12,
        _i: 1,
        text: 'This is the first question.',
        answer: 'Foo'
      },
      {
        questionId: 14,
        _i: 2,
        text: 'This is the second question.',
        answer: 'Bar'
      },
      {
        questionId: 22,
        _i: 3,
        text: 'This is the third question.',
        answer: 'Baz'
      }
    ]

    renderer.render(
      <QuestionList questions={questions}
                    isEditActivated={false}
                    onClickDelete={() => {}} />
    )
    const rendered = renderer.getRenderOutput()
    const expected = (
      <div className="questionList">
        <Question questionId={12}
                  index={1}
                  answer="Foo"
                  isEditActivated={false}
                  onClickDelete={() => {}}
                  text="This is the first question." />
        <Question questionId={14}
                  index={2}
                  answer="Bar"
                  isEditActivated={false}
                  onClickDelete={() => {}}
                  text="This is the second question." />
        <Question questionId={22}
                  index={3}
                  answer="Baz"
                  isEditActivated={false}
                  onClickDelete={() => {}}
                  text="This is the third question." />
      </div>
    )
    expect(rendered).toEqualJSX(expected)
  })
})

describe('QuestionForm', () => {
  let renderer = null

  beforeEach(() => {
    renderer = TestUtils.createRenderer()
  })

  it('render isEditMode=true', () => {
    renderer.render(
      <QuestionForm isEditMode={true}
                    text="Editmode"
                    answer="Foo"
                    threadId={1}
                    index={1}
                    onSubmitForm={() => {}} />
    )
    const rendered = renderer.getRenderOutput()
    const expected = (
      <div className="panel panel-default">
        <div className="panel-heading">
          <h3 className="panel-title">Edit Question</h3>
        </div>
        <div className="panel-body">
          <form className="questionForm" onSubmit={() => {}}>
            <div className="form-group">
              <label>Text</label>
              <textarea className="form-control"
                        value="Editmode"
                        onChange={() => {}} />
            </div>
            <div className="form-group">
              <label>Answer</label>
              <input type="text"
                     className="form-control"
                     value="Foo"
                     onChange={() => {}} />
            </div>
            <button type="submit" className="btn btn-default">Done</button>
          </form>
        </div>
      </div>
    )

    expect(rendered).toEqualJSX(expected)
  })

  it('render isEditMode=false', () => {
    renderer.render(
      <QuestionForm isEditMode={false} onSubmitForm={() => {}} />
    )
    const rendered = renderer.getRenderOutput()
    const expected = (
      <div className="panel panel-default">
        <div className="panel-heading">
          <h3 className="panel-title">Create Question</h3>
        </div>
        <div className="panel-body">
          <form className="questionForm" onSubmit={() => {}}>
            <div className="form-group">
              <label>Text</label>
              <textarea className="form-control" value="" onChange={() => {}} />
            </div>
            <div className="form-group">
              <label>Answer</label>
              <input type="text"
                     className="form-control"
                     value=""
                     onChange={() => {}} />
            </div>
            <button type="submit" className="btn btn-default">Create</button>
          </form>
        </div>
      </div>
    )

    expect(rendered).toEqualJSX(expected)
  })

  it('onChangeText', () => {
    const rendered = TestUtils.renderIntoDocument(
      <QuestionForm isEditMode={false} />
    )
    const textarea = TestUtils.scryRenderedDOMComponentsWithTag(rendered, 'textarea')

    TestUtils.Simulate.change(textarea[0], { target: { value: 'Foo' } })
    expect(rendered.state.text).toEqual('Foo')
  })

  it('onChangeAnswer', () => {
    const rendered = TestUtils.renderIntoDocument(
      <QuestionForm isEditMode={false} />
    )
    const input = TestUtils.scryRenderedDOMComponentsWithTag(rendered, 'input')

    TestUtils.Simulate.change(input[0], { target: { value: 'Foo' } })
    expect(rendered.state.answer).toEqual('Foo')
  })

  it('onSubmitForm isEditMode=true', () => {
    const spy = sinon.spy()
    const rendered = TestUtils.renderIntoDocument(
      <QuestionForm isEditMode={true} onSubmitForm={spy}/>
    )
    const form = TestUtils.scryRenderedDOMComponentsWithTag(rendered, 'form')
    const textarea = TestUtils.scryRenderedDOMComponentsWithTag(rendered, 'textarea')
    const input = TestUtils.scryRenderedDOMComponentsWithTag(rendered, 'input')

    expect(spy.called).toEqual(false)
    TestUtils.Simulate.submit(form[0])
    expect(spy.called).toEqual(false)
    TestUtils.Simulate.change(textarea[0], { target: { value: 'Foo' } })
    TestUtils.Simulate.submit(form[0])
    expect(spy.called).toEqual(false)
    TestUtils.Simulate.change(input[0], { target: { value: 'Foo' } })
    TestUtils.Simulate.submit(form[0])
    expect(spy.called).toEqual(false)
  })

  it('onSubmitForm isEditMode=false', () => {
    const spy = sinon.spy()
    const rendered = TestUtils.renderIntoDocument(
      <QuestionForm isEditMode={false} onSubmitForm={spy}/>
    )
    const form = TestUtils.scryRenderedDOMComponentsWithTag(rendered, 'form')
    const textarea = TestUtils.scryRenderedDOMComponentsWithTag(rendered, 'textarea')
    const input = TestUtils.scryRenderedDOMComponentsWithTag(rendered, 'input')

    expect(spy.called).toEqual(false)
    TestUtils.Simulate.submit(form[0])
    expect(spy.called).toEqual(false)
    TestUtils.Simulate.change(textarea[0], { target: { value: 'Foo' } })
    TestUtils.Simulate.submit(form[0])
    expect(spy.called).toEqual(false)
    TestUtils.Simulate.change(input[0], { target: { value: 'Foo' } })
    TestUtils.Simulate.submit(form[0])
    expect(spy.called).toEqual(true)
  })
})

describe('ThreadView', () => {
  let renderer = null

  beforeEach(() => {
    renderer = TestUtils.createRenderer()
  })

  it('render mode="questions"', () => {
    renderer.render(<ThreadView threadId={1} mode="questions" />)
    const rendered = renderer.getRenderOutput()
    const expected = (
      <div className="threadView">
        <h2 />
        <ul className="nav nav-tabs" role="tablist">
          <li role="presentation" className="active">
            <a href="/#threads/1" role="tab" data-toggle="tab">
              Questions (0)
            </a>
          </li>
          <li role="presentation" className="">
            <a href="#threads/1/requests" role="tab" data-toggle="tab">
              Requests (0)
            </a>
          </li>
        </ul>
        <QuestionList questions={[]}
                      isEditActivated={false}
                      onClickDelete={() => {}} />
      </div>
    )
    expect(rendered).toEqualJSX(expected)
  })

  it('render mode="requests"', () => {
    renderer.render(<ThreadView threadId={1} mode="requests" />)
    const rendered = renderer.getRenderOutput()
    const expected = (
      <div className="threadView">
        <ul className="nav nav-tabs" role="tablist">
          <li role="presentation" className="active">
            <a href="/#threads/1" role="tab" data-toggle="tab">
              Questions (0)
            </a>
          </li>
          <li role="presentation" className="">
            <a href="#threads/1/requests" role="tab" data-toggle="tab">
              Requests (0)
            </a>
          </li>
        </ul>
        <RequestList requests={[]} />
      </div>
    )
    expect(rendered).toEqualJSX(expected)
  })
})

/*
describe('RequestedListItem', () => {
  let renderer = null

  beforeEach(() => {
    renderer = TestUtils.createRenderer()
  })

  it('render', () => {
    renderer.render(
      <RequestListItem threadId={1}
                       requestId={123}
                       index={12}
                       creater="Foo"
                       timestamp={1452215370864} />
    )
    const rendered = renderer.getRenderOutput()
    const expected = (
      <tr className="requestListItem">
        <td><a href="/#threads/1/requests/123">Request 12</a></td>
        <td><a href="/#users/Foo">Foo</a></td>
        <td>2016/01/08 10:09:30</td>
      </tr>
    )
    expect(rendered).toEqualJSX(expected)
  })
})

describe('RequestedList', () => {
  let renderer = null
  const items = [
    {
      threadId: 1,
      requestId: 2,
      _i: 3,
      userId: 'Foo',
      timestamp: 1452215370864
    },
    {
      threadId: 4,
      requestId: 5,
      _i: 6,
      userId: 'Bar',
      timestamp: 1452215370864
    },
    {
      threadId: 7,
      requestId: 8,
      _i: 9,
      userId: 'Baz',
      timestamp: 1452215370864
    }
  ]

  beforeEach(() => {
    renderer = TestUtils.createRenderer()
  })

  it('render', () => {
    renderer.render(
      <ThreadList items={items} />
    )
    const rendered = renderer.getRenderOutput()
    const expected = (
      <table className="table requestList">
        <tbody>
          <tr>
            <th>Title</th>
            <th>Created by</th>
            <th>Created At</th>
          </tr>
          <RequestListItem threadId={1}
                           requestId={2}
                           index={3}
                           creater="Foo"
                           timestamp={1452215370864} />
          <RequestListItem threadId={4}
                           requestId={5}
                           index={6}
                           creater="Bar"
                           timestamp={1452215370864} />
          <RequestListItem threadId={7}
                           requestId={8}
                           index={9}
                           creater="Baz"
                           timestamp={1452215370864} />
        </tbody>
      </table>
    )
    expect(rendered).toEqualJSX(expected)
  })
})
*/
