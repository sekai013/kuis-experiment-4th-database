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
      <tr className="question">
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
      <tr className="question">
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
      creater: 'Foo',
      timestamp: 1452215370864
    },
    {
      threadId: 2,
      title: 'Test Thread 02',
      creater: 'Bar',
      timestamp: 1452215370864
    },
    {
      threadId: 3,
      title: 'Test Thread 03',
      creater: 'Baz',
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
})

describe('ThreadForm', () => {
  let renderer = null

  beforeEach(() => {
    renderer = TestUtils.createRenderer()
  })

  it('render', () => {
    renderer.render(<ThreadForm onSubmitForm={() => {}} />)
    const rendered = renderer.getRenderOutput()
    const expected = (
      <form className="threadForm" onSubmit={() => {}}>
        <div className="form-group">
          <label>Title</label>
          <input type="text"
                 className="form-control"
                 value=""
                 onChange={() => {}} />
        </div>
        <button type="submit" className="btn btn-default">Create</button>
      </form>
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
        <div class="panel panel-default">
          <div class="panel-heading">
            <nav>
              <ul class="pagination">
                <li className="disabled">
                  <a href="/#threads/page/0" aria-label="Previous">
                    <span aria-hidden="true">&laquo;</span>
                  </a>
                </li>
                <li className="active">
                  <a href="/#threads/page/1">1</a>
                </li>
                <li className="disabled">
                  <a href="/#threads/page/2" aria-label="Next">
                    <span aria-hidden="true">&raquo;</span>
                  </a>
                </li>
              </ul>
            </nav>
          </div>
       
          <ThreadList size={30} page={1} isInDashboard={false} />
        </div>
        <ThreadForm onSubmitForm={() => {}} />
      </div>
    )
    expect(rendered).toEqualJSX(expected)
  })
})
