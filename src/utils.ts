export function addIssueLinkToBody(
  issueLink?: string | null,
  trackingIssueBody?: string | null
): string {
  if (!issueLink) {
    return trackingIssueBody || ''
  }

  const tasklistOpener = '```[tasklist]\n### Issues\n'
  const taskListCloser = '\n```\n'

  const newIssueLink = buildIssueLink(issueLink)

  const body = trackingIssueBody || ''

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

function buildIssueLink(issueLink: string): string {
  return `- [ ] ${issueLink}`
}
