### In Development
Creating an action to add issues to a tasklist when a milestone is added to the issue.

### TODO
- Make label name configurable via action inputs
- Make tasklist title configurable via action inputs
- Handle scenario where tasklist has empty checkbox:  "- [ ]"
- Handle scenario where tasklist has no title
- Decide on strategy for demilestoning

# Add to tasklist action

This action adds an issue to a "tracking issue" when the issue is added to a milestone.
A tracking issue is an issue in the milestone that contains a tasklist filled with relevant issues.

## Inputs

### tracking-issue-label

**Optional** The label that will be used to identify the tracking issue. Default `"tracking-issue"`.

## Example usage

```yaml
  uses: underwoo16/add-to-tasklist
  with:
    github-token: ${{ secrets.GITHUB_TOKEN }}
    tracking-issue-label: 'tracking-issue'
```