import * as core from '@actions/core'
import * as github from '@actions/github'
import {addIssueLinkToBody, getTrackingIssueLabel} from './utils'

export async function addToTrackingIssue(): Promise<void> {
  const {action, issue, milestone, repository} = github.context.payload

  if (!repository) return

  if (!issue) return

  if (!milestone) return

  if (action !== 'milestoned') return

  // This should be a token with access to your repository scoped in as a secret.
  // The YML workflow will need to set myToken with the GitHub Secret Token
  // github-token: ${{ secrets.GITHUB_TOKEN }}
  // https://help.github.com/en/actions/automating-your-workflow-with-github-actions/authenticating-with-the-github_token#about-the-github_token-secret
  const myToken = core.getInput('github-token')

  const octokit = github.getOctokit(myToken)

  const trackingIssues = await octokit.rest.issues.listForRepo({
    owner: repository.owner.login,
    repo: repository.name,
    milestone: milestone.number,
    labels: getTrackingIssueLabel()
  })

  if (!trackingIssues || trackingIssues.status !== 200) return

  // add issue link to tracking issue(s)
  for (const trackingIssue of trackingIssues.data) {
    const updatedBody = addIssueLinkToBody(issue.html_url, trackingIssue.body)

    if (updatedBody && updatedBody !== trackingIssue.body) {
      const updateResponse = await octokit.rest.issues.update({
        owner: repository.owner.login,
        repo: repository.name,
        issue_number: trackingIssue.number,
        body: updatedBody
      })

      core.setOutput('updatedId', updateResponse.data.node_id)
    }
  }
}
