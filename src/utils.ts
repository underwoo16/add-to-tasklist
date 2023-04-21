import * as core from '@actions/core'

const tickMarks = '```'
const bodyRegex =
  /(?<beforeTasklist>[\S\s]*)(?<taskListOpener>```\[tasklist\]\s*)(?<taskListName>### Issues\s*)(?<taskList>[\S\s]*?)(?<taskListEnder>```)(?<afterTaskList>[\S\s]*)/g

export function addIssueLinkToBody(
  issueLink?: string | null,
  trackingIssueBody?: string | null
): string | null | undefined {
  if (!issueLink) {
    core.debug('No issue link provided, skipping adding to tracking issue')
    return trackingIssueBody
  }

  if (!trackingIssueBody) {
    core.debug(
      'No tracking issue body provided, skipping adding to tracking issue'
    )
    return trackingIssueBody
  }

  const match = bodyRegex.exec(trackingIssueBody)
  if (!match || !match.groups) {
    core.debug(
      'No matching tasklist found, adding new task list and issue link'
    )
    return `${trackingIssueBody}\n${tickMarks}[tasklist]\n### Issues\n${buildIssueLink(
      issueLink
    )}${tickMarks}`
  }

  const {
    beforeTasklist,
    taskList,
    taskListOpener,
    taskListName,
    taskListEnder,
    afterTaskList
  } = match.groups

  if (taskList === null || taskList === undefined) {
    core.debug('No matching task list found, adding new task list')
    return `${trackingIssueBody}\n${tickMarks}[tasklist]\n### Issues\n${buildIssueLink(
      issueLink
    )}${tickMarks}`
  }

  if (taskList.includes(issueLink)) {
    core.debug('Issue link already exists in task list, skipping')
    return trackingIssueBody
  }

  return `${beforeTasklist}${taskListOpener}${taskListName}${taskList}${buildIssueLink(
    issueLink
  )}${taskListEnder}${afterTaskList}`
}

function buildIssueLink(issueLink: string): string {
  return `- [ ] ${issueLink}\n`
}
