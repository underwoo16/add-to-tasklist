import * as core from '@actions/core'
import * as github from '@actions/github'

import {addToTasklist} from '../src/add-to-tasklist'

describe('addToTasklist', () => {
  let outputs: Record<string, string>
  beforeEach(() => {
    jest.spyOn(process.stdout, 'write').mockImplementation(() => true)
  })

  beforeEach(() => {
    mockGetInput({
      'github-token': 'gh_token'
    })

    outputs = mockSetOutput()
  })

  afterEach(() => {
    github.context.payload = {}
    jest.restoreAllMocks()
  })

  test('should not update tracking issue if no repository', async () => {
    github.context.payload = {
      repository: undefined,
      issue: {number: 1},
      milestone: {},
      action: 'opened'
    }

    await addToTasklist()

    expect(outputs).toEqual({})
  })

  test('should not update tracking issue when no issue', async () => {
    github.context.payload = {
      repository: {name: 'repo', owner: {login: 'owner'}},
      issue: undefined,
      milestone: {},
      action: 'opened'
    }

    await addToTasklist()

    expect(outputs).toEqual({})
  })

  test('should not update tracking issue when no milestone', async () => {
    github.context.payload = {
      repository: {name: 'repo', owner: {login: 'owner'}},
      issue: {number: 1},
      milestone: undefined,
      action: 'opened'
    }

    await addToTasklist()

    expect(outputs).toEqual({})
  })

  test('should not update tracking issue if issue was not milestoned', async () => {
    github.context.payload = {
      repository: {name: 'repo', owner: {login: 'owner'}},
      issue: {number: 1},
      milestone: {},
      action: 'opened'
    }

    await addToTasklist()

    expect(outputs).toEqual({})
  })

  test('should not update tracking issue if issue was not milestoned', async () => {
    github.context.payload = {
      repository: {name: 'repo', owner: {login: 'owner'}},
      issue: {number: 1},
      milestone: {},
      action: 'opened'
    }

    await addToTasklist()

    expect(outputs).toEqual({})
  })

  test('should not update tracking issue when rest api fails', async () => {
    github.context.payload = {
      repository: {name: 'repo', owner: {login: 'owner'}},
      issue: {number: 1, html_url: 'www.github.com/test/test/issues/1'},
      milestone: {number: 1},
      action: 'milestoned'
    }

    mockRestIssuesApi({
      func: 'listForRepo',
      return: {
        status: 404,
        data: []
      }
    })

    await addToTasklist()

    expect(outputs).toEqual({})
  })

  test('should not update tracking issue when issue is already linked', async () => {
    github.context.payload = {
      repository: {name: 'repo', owner: {login: 'owner'}},
      issue: {number: 1, html_url: 'www.github.com/test/test/issues/1'},
      milestone: {number: 1},
      action: 'milestoned'
    }

    mockRestIssuesApi({
      func: 'listForRepo',
      return: {
        status: 200,
        data: [
          {
            number: 1,
            body: '```[tasklist]\n### Issues\n- [ ] www.github.com/test/test/issues/1\n```'
          }
        ]
      }
    })

    await addToTasklist()

    expect(outputs).toEqual({})
  })

  test('should update tracking issue when issue is not linked', async () => {
    github.context.payload = {
      repository: {name: 'repo', owner: {login: 'owner'}},
      issue: {number: 1, html_url: 'www.github.com/test/test/issues/1'},
      milestone: {number: 1},
      action: 'milestoned'
    }

    mockRestIssuesApi(
      {
        func: 'listForRepo',
        return: {
          status: 200,
          data: [{number: 1, body: '### Description\nAnd some body text'}]
        }
      },
      {
        func: 'update',
        return: {
          data: {node_id: '123'}
        }
      }
    )

    await addToTasklist()

    expect(outputs).toEqual({updated: true, updatedId: '123'})
  })
})

function mockGetInput(mocks: Record<string, string>): jest.SpyInstance {
  const mock = (key: string) => mocks[key] ?? ''
  return jest.spyOn(core, 'getInput').mockImplementation(mock)
}

function mockSetOutput(): Record<string, string> {
  const output: Record<string, string> = {}
  jest
    .spyOn(core, 'setOutput')
    .mockImplementation((key, value) => (output[key] = value))
  return output
}

function mockRestIssuesApi(...mocks: {func: string; return: unknown}[]) {
  const mock: {[key: string]: jest.Mock} = {}
  for (const m of mocks) {
    mock[m.func] = jest.fn().mockImplementation(() => m.return)
  }

  jest.spyOn(github, 'getOctokit').mockImplementation(() => {
    return {
      rest: {
        issues: mock
      }
    } as unknown as ReturnType<typeof github.getOctokit>
  })
}
