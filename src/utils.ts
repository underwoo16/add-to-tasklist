import * as core from '@actions/core'

export function addIssueLinkToBody(
  issueLink?: string | null,
  trackingIssueBody?: string | null
): string | null | undefined {
  if (!issueLink) {
    core.debug('No issue link provided, skipping adding to tracking issue')
    return trackingIssueBody
  }

  const tasklistOpener = '```[tasklist]\n### Issues\n'
  const taskListCloser = '```\n'

  const newIssueLink = buildIssueLink(issueLink)

  const body = trackingIssueBody || ''

  if (!body.includes(tasklistOpener)) {
    core.debug('No tasklist found, adding new tasklist')
    core.debug('Body:\n${body}\n')
    core.debug('Tasklist opener:\n${tasklistOpener}\n')

    return `${body}\n${tasklistOpener}${newIssueLink}${taskListCloser}`
  }

  core.debug('Tasklist found, adding issue to tasklist')

  const tasklistStartIndex = body.indexOf(tasklistOpener)
  const tasklistEndIndex = body.indexOf(taskListCloser, tasklistStartIndex)

  const tasklist = body.slice(
    tasklistStartIndex + tasklistOpener.length,
    tasklistEndIndex
  )
  core.debug('Tasklist:\n${tasklist}\n')

  if (tasklist.includes(newIssueLink)) {
    core.debug('Issue already exists in tasklist, skipping')
    return body
  }

  const beforeTasklist = body.slice(0, tasklistStartIndex)
  const afterTaskList = body.slice(tasklistEndIndex)

  return `${beforeTasklist}${tasklistOpener}${tasklist}${newIssueLink}${afterTaskList}`
}

function buildIssueLink(issueLink: string): string {
  return `- [ ] ${issueLink}\n`
}
