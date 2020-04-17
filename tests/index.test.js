const { resolve } = require('path')

const { Toolkit } = require('actions-toolkit')

let action
let tools

// Mock Toolkit.run to define `action` so we can call it
jest.spyOn(Toolkit, 'run').mockImplementation(actionFn => {
  action = actionFn
})
// Load up our entrypoint file
require('../lib')

function mockTools(cwd) {
  process.env.GITHUB_WORKSPACE = cwd

  // Create a new Toolkit instance
  tools = new Toolkit()

  // Mock methods on it!
  jest.spyOn(tools.exit, 'success').mockImplementation()
  jest.spyOn(tools.exit, 'failure').mockImplementation()
  jest.spyOn(tools.log, 'warn').mockImplementation()
}

// eslint-disable-next-line jest/no-disabled-tests
describe('success', () => {
  mockTools(resolve(__dirname, 'fixtures', 'correct'))

  it('exits successfully', async () => {
    await action(tools)
    expect(tools.exit.success).toHaveBeenCalled()
  })
})

describe('skipping', () => {
  it('skips if no package.json is found', async () => {
    mockTools(resolve(__dirname, 'fixtures', 'no-pkg'))
    await action(tools)
    expect(tools.log.warn).toHaveBeenCalledWith(
      'No "package.json" found in the root directory. Skipping.'
    )
  })

  it('skips if no lint script is found', async () => {
    mockTools(resolve(__dirname, 'fixtures', 'no-script'))
    await action(tools)
    expect(tools.log.warn).toHaveBeenCalledWith(
      'No "lint" script found in the. Skipping.'
    )
  })

  it('skips if no lint script object is found', async () => {
    mockTools(resolve(__dirname, 'fixtures', 'no-script-obj'))

    await action(tools)

    expect(tools.log.warn).toHaveBeenCalledWith(
      'No "lint" script found in the. Skipping.'
    )
  })
})
