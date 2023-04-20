/* eslint-disable no-console */
interface Issue {
  id: string
  body?: string | undefined
  html_url?: string | undefined
}

export function addIssueLinkToBody(issue: Issue, trackingIssue: Issue): string {
  const tasklistOpener = '```[tasklist]\n### Issues\n'
  const taskListCloser = '\n```\n'

  const newIssueLink = buildIssueLink(issue)

  const body = trackingIssue.body || ''

  if (!body.includes(tasklistOpener)) {
    return `${body}\n${tasklistOpener}${newIssueLink}${taskListCloser}`
  }

  const tasklistStartIndex = body.indexOf(tasklistOpener)
  const tasklistEndIndex = body.indexOf(taskListCloser, tasklistStartIndex)

  const tasklist = body.slice(
    tasklistStartIndex + tasklistOpener.length,
    tasklistEndIndex
  )

  if (tasklist.includes(newIssueLink)) {
    return body
  }

  const beforeTasklist = body.slice(0, tasklistStartIndex)
  const afterTaskList = body.slice(tasklistEndIndex)

  return `${beforeTasklist}${tasklistOpener}${tasklist}\n${newIssueLink}${afterTaskList}`
}

function buildIssueLink(issue: Issue): string {
  return `- [] ${issue.html_url}`
}

export function updateIssueWithBody(
  issue: Issue,
  updatedBody: string
): boolean {
  return updatedBody !== issue.body
}
