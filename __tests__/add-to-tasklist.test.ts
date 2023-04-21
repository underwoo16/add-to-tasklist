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
      'github-token': 'gh_token',
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
      issue: { number: 1 },
      milestone: {},
      action: 'opened',
    }

    await addToTasklist()

    expect(outputs).toEqual({})
  })

  test('should not update tracking issue when no issue', async () => {
    github.context.payload = {
      repository: { name: "repo", owner: { login: "owner" } },
      issue: undefined,
      milestone: {},
      action: 'opened',
    }

    await addToTasklist()

    expect(outputs).toEqual({})
  })

  test('should not update tracking issue when no milestone', async () => {
    github.context.payload = {
      repository: { name: "repo", owner: { login: "owner" } },
      issue: { number: 1 },
      milestone: undefined,
      action: 'opened',
    }

    await addToTasklist()

    expect(outputs).toEqual({})
  })

  test('should not update tracking issue if issue was not milestoned', async () => {
    github.context.payload = {
      repository: { name: "repo", owner: { login: "owner" } },
      issue: { number: 1 },
      milestone: {},
      action: 'opened',
    }

    await addToTasklist()

    expect(outputs).toEqual({})
  })
})

function mockGetInput(mocks: Record<string, string>): jest.SpyInstance {
  const mock = (key: string) => mocks[key] ?? ''
  return jest.spyOn(core, 'getInput').mockImplementation(mock)
}
  
function mockSetOutput(): Record<string, string> {
  const output: Record<string, string> = {}
  jest.spyOn(core, 'setOutput').mockImplementation((key, value) => (output[key] = value))
  return output
}