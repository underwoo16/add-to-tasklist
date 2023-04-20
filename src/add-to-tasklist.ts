import * as core from '@actions/core'
import * as github from '@actions/github'
import {addIssueLinkToBody} from './utils'

export async function addToTasklist(): Promise<void> {
  const {action, issue, milestone, repository} = github.context.payload

  if (!repository) return

  if (!issue) return

  if (!milestone) return

  if (action !== 'milestoned') return

  // This should be a token with access to your repository scoped in as a secret.
  // The YML workflow will need to set myToken with the GitHub Secret Token
  // myToken: ${{ secrets.GITHUB_TOKEN }}
  // https://help.github.com/en/actions/automating-your-workflow-with-github-actions/authenticating-with-the-github_token#about-the-github_token-secret
  const myToken = core.getInput('myToken')

  const octokit = github.getOctokit(myToken)

  // fetch tracking issues for this milestone
  const trackingIssues = await octokit.rest.issues.listForRepo({
    owner: repository.owner.login,
    repo: repository.name,
    milestone: milestone.number,
    labels: 'tracking-issue'
  })

  if (!trackingIssues || trackingIssues.status !== 200) return

  // add issue link to tracking issue(s)
  for (const trackingIssue of trackingIssues.data) {
    const updatedBody = addIssueLinkToBody(issue.html_url, trackingIssue.body)

    if (updatedBody && updatedBody !== trackingIssue.body) {
      await octokit.rest.issues.update({
        owner: repository.owner.login,
        repo: repository.name,
        issue_number: trackingIssue.number,
        body: updatedBody
      })
    }
  }
}
