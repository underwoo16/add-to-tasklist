import * as core from '@actions/core'
import {addToTrackingIssue} from './add-to-tracking-issue'

async function run(): Promise<void> {
  try {
    await addToTrackingIssue()
  } catch (e: unknown) {
    const error = e as Error
    core.setFailed(error.message)
    process.exit(1)
  }

  process.exit(0)
}

run()
