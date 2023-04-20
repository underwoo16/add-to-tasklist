import * as core from '@actions/core'
// import {wait} from './wait'
import {addToTasklist} from './add-to-tasklist'

async function run(): Promise<void> {
  try {
    await addToTasklist()
  } catch (e: unknown) {
    const error = e as Error
    core.setFailed(error.message)
    process.exit(1)
  }

  process.exit(0)
}

run()
// async function run(): Promise<void> {
//   try {
//     const ms: string = core.getInput('milliseconds')
//     core.debug(`Waiting ${ms} milliseconds ...`) // debug is only output if you set the secret `ACTIONS_STEP_DEBUG` to true

//     core.debug(new Date().toTimeString())
//     await wait(parseInt(ms, 10))
//     core.debug(new Date().toTimeString())

//     core.setOutput('time', new Date().toTimeString())
//   } catch (error) {
//     if (error instanceof Error) core.setFailed(error.message)
//   }
// }

// run()
