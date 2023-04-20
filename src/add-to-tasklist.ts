import * as core from '@actions/core'
import * as github from '@actions/github'
import * as webhooks from '@octokit/webhooks'
import {addIssueLinkToBody, updateIssueWithBody} from './utils'

interface IssueResponse {
  node: {
    id: string
    body: string
  }
}
interface RepositoryMileStoneIssueResponse {
  repository: {
    milestone: {
      issues: {
        edges: IssueResponse[]
      }
    }
  }
}

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

  // find tracking issue that matches milestone
  // issues in this milestone with tracking-issue label
  const trackingIssueResponse =
    await octokit.graphql<RepositoryMileStoneIssueResponse>(
      `query { 
          repository(owner: ${repository.owner.login}, name: ${repository.name}) {
          milestone(number: ${milestone.id}) {
            issues(labels: ["tracking-issue"], first: 10) {
              edges {
                node {
                  id
                  body
                  url
                }
              }
            }
          }
        }
      }`
    )

  if (!trackingIssueResponse) return

  const trackingIssues = trackingIssueResponse.repository.milestone.issues.edges
  // add this issue to specified task list
  // or fallback to one of: [solo task list >> unlabeled task list >> new task list] on tracking issue
  for (const trackingIssueNode of trackingIssues) {
    const trackingIssue = trackingIssueNode.node
    // eslint-disable-next-line no-console
    console.log(trackingIssue)
    const updatedBody = addIssueLinkToBody(issue, trackingIssue)

    updateIssueWithBody(trackingIssue, updatedBody)
  }
}


