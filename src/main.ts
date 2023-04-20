import * as core from '@actions/core'
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
